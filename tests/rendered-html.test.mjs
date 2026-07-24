import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const siteRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the motion archive", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Motion Intelligence/i);
  assert.match(html, /产品动态视频每日拆解/);
  assert.match(html, /2026-07-24/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/i);
});

test("contains cumulative daily data and namespaced media", async () => {
  const raw = await readFile(new URL("../app/site-data.json", import.meta.url), "utf8");
  const data = JSON.parse(raw);

  assert.deepEqual(data.dates, ["2026-07-24", "2026-07-23"]);
  assert.equal(data.totals.films, 20);
  assert.equal(data.days["2026-07-24"].records.length, 10);
  assert.equal(data.days["2026-07-23"].records.length, 10);
  assert.match(
    data.days["2026-07-24"].records[0].sheet,
    /^\/media\/2026-07-24\/sheets\//,
  );

  await access(
    new URL(
      `.${data.days["2026-07-24"].records[0].sheet}`,
      new URL("public/", siteRoot),
    ),
  );
});
