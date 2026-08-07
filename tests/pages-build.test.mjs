import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const output = new URL("../dist-pages/", import.meta.url);
const dataUrl = new URL("../app/site-data.json", import.meta.url);

test("builds a standalone GitHub Pages site", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /assets\/.*\.js/);
  assert.doesNotMatch(html, /_vinext|\/server\//);
  await access(new URL(".nojekyll", output));
});

test("publishes every accumulated day and its media", async () => {
  const archive = JSON.parse(await readFile(dataUrl, "utf8"));
  assert.equal(Object.keys(archive.days).length, archive.dates.length);
  assert.equal(
    archive.totals.films,
    archive.dates.reduce(
      (total, date) => total + archive.days[date].stats.films,
      0,
    ),
  );

  for (const date of archive.dates) {
    const first = archive.days[date].records[0];
    await access(new URL(`.${first.sheet}`, output));
    await access(new URL(`.${first.keyframes[0].url}`, output));
  }
});
