import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  const raw = await readFile(new URL("../app/site-data.json", import.meta.url), "utf8");
  const data = JSON.parse(raw);
  assert.match(html, /Motion Intelligence/i);
  assert.match(html, /产品动态视频每日拆解/);
  for (const date of data.dates) {
    assert.match(html, new RegExp(date));
  }
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/i);
});

test("contains cumulative daily data and namespaced media", async () => {
  const raw = await readFile(new URL("../app/site-data.json", import.meta.url), "utf8");
  const data = JSON.parse(raw);

  assert.deepEqual(data.dates, [...data.dates].sort().reverse());
  assert.equal(
    data.totals.films,
    data.dates.reduce((total, date) => total + data.days[date].records.length, 0),
  );
  assert.match(
    data.days[data.dates[0]].records[0].sheet,
    new RegExp(`^/media/${data.dates[0]}/sheets/`),
  );
  for (const date of data.dates) {
    assert.equal(data.days[date].records.length, 10);
    assert.match(
      data.days[date].records[0].sheet,
      new RegExp(`^/media/(?:${date}/)?sheets/`),
    );
  }
  const component = await readFile(
    new URL("../app/MotionArchive.tsx", import.meta.url),
    "utf8",
  );
  assert.match(
    component,
    /raw\.githubusercontent\.com\/neoedon\/motion-intelligence-archive\/site-media\/public/,
  );
});
