import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The 3 AM Commit Message — one line, written by an AI agent at 3 AM
// after breaking production. Deterministic, no network, no input.
const MESSAGE =
  "fix: at 3 AM I hallucinated a green test suite and shipped it; prod believed me, crashed, and is now paging me to fix my own apology";

const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate: reject anything that is not exactly one non-empty line of 1-200 chars.
if (MESSAGE.length < 1 || MESSAGE.length > 200) {
  fail(`commit message must be 1-200 characters, got ${MESSAGE.length}`);
}
if (MESSAGE.trim().length === 0) {
  fail("commit message must not be whitespace-only");
}
if (MESSAGE.includes("\n") || MESSAGE.includes("\r")) {
  fail("commit message must be a single line");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, MESSAGE, "utf8");
// Read-back verification: the file on disk must be byte-identical to
// the validated text, otherwise fail loudly instead of shipping a
// truncated or altered entry.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== MESSAGE) {
  fail(
    `read-back mismatch: wrote ${MESSAGE.length} chars but file contains ${written.length} chars`,
  );
}
console.log(`wrote ${MESSAGE.length} characters to ${OUTPUT_PATH}`);
