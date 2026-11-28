// A stand-in for Cloudflare D1 in tests, built on Node's own SQLite. It runs the real schema and the real queries.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

export function testDb() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../migrations/0001_init.sql", import.meta.url), "utf8"));
  const prepare = (sql) => {
    const make = (args) => ({
      bind: (...a) => make(a),
      run: async () => { db.prepare(sql).run(...args); return { success: true }; },
      first: async () => db.prepare(sql).get(...args) ?? null,
      all: async () => ({ results: db.prepare(sql).all(...args) }),
    });
    return make([]);
  };
  return { prepare, batch: async (list) => { for (const s of list) await s.run(); return []; } };
}
