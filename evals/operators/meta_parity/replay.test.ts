// @vitest-environment node
// Runs inside the pinned platform checkout. All campaign data and identities are synthetic.
import { beforeAll, expect, test, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { POST } from "@/app/(marketing)/user-mcp/route";
import { runServerTurn } from "@/lib/account/agent-chat/server-turn.server";
import { GlanceCard } from "@/components/account/GlanceCard";
import { ActionDiscovery } from "./upstream/discovery";
import { compactMcpTools } from "./upstream/contracts";
import { resolveMcpActionCall } from "./upstream/dispatch";
import scenarios from "./cases.json";
import definitions from "./upstream/actions.json";

vi.mock("@/lib/env", () => ({ env: { NEXT_PUBLIC_BASE_URL: "https://example.invalid" } }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/logger", () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock("@/components/account/AccountChatContext", () => ({ useAccountChat: () => ({}) }));
vi.mock("@/lib/auth/mcp-session", () => ({
  getSessionFromCookies: () => ({ user: { id: "fixture-manager" } }),
}));
vi.mock("@/lib/auth/oauth-tokens", () => ({}));
vi.mock("@/lib/infra/humanAssertionExchange", () => ({}));
vi.mock("@/lib/auth/mcp-auth-errors", () => ({}));
vi.mock("@/app/api/infrastructure/_lib/humanAccessAssertion", () => ({
  addHumanAccessAssertion: vi.fn(),
}));
vi.mock("@/lib/mcp/developer-mcp-handler", () => ({}));
vi.mock("@/lib/infra/infraFetch", () => ({ infraFetch: (...args: any[]) => upstream(...args) }));

const { question, windowDays, asOf, collection } = scenarios;
const index = new ActionDiscovery(definitions);
type Scenario = (typeof scenarios.scenarios)[number];
let current: Scenario;
let calls: string[] = [];
const resultPath = process.env.PARITY_RESULT!;
beforeAll(() => writeFileSync(resultPath, "", { flag: "wx" }));
const model = process.env.PARITY_MODEL;
const save = (row: object) => appendFileSync(resultPath, JSON.stringify(row) + "\n");

function read(operation: string, args: Record<string, unknown>) {
  calls.push(operation);
  if (operation === "list_my_collections")
    return { collections: [{ slug: collection, name: "Cedar Demo", role: "ADMIN" }] };
  if (
    args.collection_slug !== collection ||
    args.channel !== "meta" ||
    (args.days ?? 30) !== windowDays
  )
    throw Error("No fixture data for this collection, channel or period");
  if (operation === "get_ads_performance")
    return {
      channel: "meta",
      windowDays,
      hasAdAccount: true,
      metrics: { spendUsd: 200, clicks: 100, impressions: 2000 },
    };
  if (operation !== "get_ads_attribution")
    throw Error("Operation unavailable in attribution fixture");
  const { reportedClick, reportedView, namedClick, namedView, receipts } = current;
  const matched = namedClick + namedView;
  const counts = { clickBookings: namedClick, viewBookings: namedView };
  return {
    collection: { slug: collection },
    channel: "meta",
    windowDays,
    hasAdEntity: true,
    basis: "meta_reported",
    totalBookings: matched,
    ...counts,
    ...(receipts === undefined ? {} : { receiptMatchedBookings: receipts }),
    byCampaign: [
      {
        campaignId: "demo-7",
        campaignName: "Spring Return",
        bookings: matched,
        ...counts,
        metaReported: {
          clickPurchases: reportedClick,
          clickValueUsd: reportedClick * 300,
          viewPurchases: reportedView,
          viewValueUsd: reportedView * 300,
        },
      },
    ],
  };
}

async function upstream(path: string, options: RequestInit) {
  if (path === "/v1/user-mcp/tools") return Response.json({ tools: compactMcpTools });
  if (path !== "/v1/user-mcp/execute") throw Error("Unexpected upstream path");
  const { tool, input } = JSON.parse(String(options.body));
  try {
    if (!["search", "execute"].includes(tool)) throw Error("Use one of the listed connector tools");
    const action = resolveMcpActionCall(tool, input);
    const result = tool === "search" ? index.search(input) : read(action.operation, action.input);
    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 400 });
  }
}

async function rpc(method: string, params: object = {}) {
  const response = await POST(
    new NextRequest("https://example.invalid/user-mcp", {
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    }),
  );
  const envelope = await response.json();
  if (envelope.error) throw Error(envelope.error.message);
  if (!envelope.result) throw Error("Missing MCP result (" + response.status + ")");
  return envelope.result;
}

const skills = JSON.parse(readFileSync(new URL("./skills.json", import.meta.url), "utf8"));

async function operator() {
  const init = await rpc("initialize");
  const catalog = (await rpc("tools/list")).tools;
  const tools = catalog.map((t: any) => ({
    type: "function",
    function: { name: t.name, description: t.description, parameters: t.inputSchema },
  }));
  tools.push({
    type: "function",
    function: {
      name: "read_skill",
      description: "Open a packaged skill markdown file by relative path.",
      parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
    },
  });
  const messages: any[] = [
    {
      role: "system",
      content:
        init.instructions +
        "\nSelected collection: " +
        collection +
        "\nInstalled Operator skills:\n" +
        skills.index,
    },
    { role: "user", content: question },
  ];
  const trace: any[] = [];
  // Diagnostic only: give the model the same target data via genuine MCP responses.
  // Keep this arm separate from independent discovery; no answer wording is supplied.
  if (process.env.PARITY_SUPPLY_READ === "1") {
    const operation = "get_ads_attribution";
    const input = { collection_slug: collection, channel: "meta", days: windowDays };
    for (const [name, args] of [
      ["search", { operation }],
      ["execute", { operation, input }],
    ] as const) {
      const tool_call_id = "fixture-" + name;
      const result = (await rpc("tools/call", { name, arguments: args })).content[0].text;
      messages.push({
        role: "assistant",
        content: null,
        tool_calls: [
          {
            id: tool_call_id,
            type: "function",
            function: { name, arguments: JSON.stringify(args) },
          },
        ],
      });
      messages.push({ role: "tool", tool_call_id, content: result });
      trace.push({ name, args, result, supplied: true });
    }
  }
  for (let turn = 0; turn < 12; turn++) {
    const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model, messages, tools, temperature: 0.2, max_tokens: 3000 }),
    });
    if (!response.ok) throw Error("Local model HTTP " + response.status);
    const choice = (await response.json()).choices[0];
    if (choice.finish_reason === "length") throw Error("Model output truncated");
    const message = choice.message;
    if (!message.tool_calls?.length) return { answer: message.content, trace };
    messages.push({ role: "assistant", content: message.content, tool_calls: message.tool_calls });
    for (const call of message.tool_calls) {
      const name = call.function.name;
      let result: string;
      try {
        const args = JSON.parse(call.function.arguments);
        result =
          name === "read_skill"
            ? Object.hasOwn(skills.docs, args.path)
              ? skills.docs[args.path]
              : "Unknown package document"
            : (await rpc("tools/call", { name, arguments: args })).content[0].text;
        trace.push({ name, args, result: name === "read_skill" ? "[packaged skill]" : result });
      } catch (error) {
        result = String(error);
        trace.push({ name, error: result });
      }
      messages.push({ role: "tool", tool_call_id: call.id, content: result });
    }
  }
  throw Error("Turn limit reached");
}

for (const scenario of scenarios.scenarios) {
  test(
    scenario.id,
    async () => {
      current = scenario;
      calls = [];
      const reader = async (name: string, args: any, schema: any) => schema.parse(read(name, args));
      const facts = read("get_ads_attribution", {
        collection_slug: collection,
        channel: "meta",
        days: windowDays,
      });
      calls = [];
      if (model) {
        try {
          save({
            arm: process.env.PARITY_SUPPLY_READ === "1" ? "operator-supplied" : "operator",
            id: scenario.id,
            model,
            facts,
            ...(await operator()),
            calls,
          });
        } catch (error) {
          save({
            arm: process.env.PARITY_SUPPLY_READ === "1" ? "operator-supplied" : "operator",
            id: scenario.id,
            model,
            facts,
            error: String(error),
            calls,
          });
          throw error;
        }
        return;
      }
      // Direct MCP control: verify the available result independently of whether a model discovers it.
      const definition = await rpc("tools/call", {
        name: "search",
        arguments: { operation: "get_ads_attribution" },
      });
      expect(JSON.parse(definition.content[0].text).operation).toBe("get_ads_attribution");
      const direct = await rpc("tools/call", {
        name: "execute",
        arguments: {
          operation: "get_ads_attribution",
          input: { collection_slug: collection, channel: "meta", days: windowDays },
        },
      });
      const directMcpFacts = JSON.parse(direct.content[0].text);
      expect(directMcpFacts).toEqual(facts);
      calls = [];
      const thread = {
        id: "fixture-thread",
        title: "Report",
        version: 0,
        messages: [],
        collectionId: collection,
        ownerUserId: "fixture-manager",
      };
      const turn = await runServerTurn(
        {
          service: { get: async () => thread, appendTurn: async () => ({ ...thread, version: 1 }) },
          loadContext: async () => null,
          fetchCampaigns: async () => [],
          glanceReader: reader,
          now: () => new Date(asOf),
        },
        {
          collectionSlug: collection,
          conversationId: thread.id,
          expectedVersion: 0,
          message: { id: "ask", role: "user", parts: [{ type: "text", text: question }] },
        },
      );
      const parts = turn.assistant.parts;
      const glance = parts.find((p) => p.type === "data-page" && p.data.glance)?.data.glance;
      expect(glance?.kind).toBe("meta_results");
      const html = renderToStaticMarkup(
        createElement(GlanceCard, { glance, collectionSlug: collection }),
      );
      const card = html
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      save({
        arm: "sonny",
        id: scenario.id,
        facts,
        directMcpFacts,
        calls,
        answer: parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(" "),
        card,
        glance,
      });
      expect(calls).toContain("get_ads_attribution");
      expect([glance.clickBookings, glance.viewBookings]).toEqual([
        scenario.reportedClick,
        scenario.reportedView,
      ]);
      expect([glance.namedClickBookings, glance.namedViewBookings]).toEqual(
        scenario.receipts === undefined ? [null, null] : [scenario.namedClick, scenario.namedView],
      );
    },
    300000,
  );
}
