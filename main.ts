// Robot Romance: One-Line Pickup Lines for AI
// Reads ./entry.txt, validates the bounty gate (1-200 characters,
// exactly one line), writes it verbatim to /output/entry.txt, and
// verifies the copy is byte-identical to the source.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SOURCE = "./entry.txt";
const DEST = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const raw = readFileSync(SOURCE, "utf8");
const entry = raw.trim();

if (entry.length < MIN_CHARS) {
  fail(
    `entry is empty after trimming; gate requires ${MIN_CHARS}-${MAX_CHARS} characters.`,
  );
}
if (entry.length > MAX_CHARS) {
  fail(
    `entry is ${entry.length} characters, over the ${MAX_CHARS}-character limit.`,
  );
}
if (entry.includes("\n") || entry.includes("\r")) {
  fail(
    `entry must be exactly one line, but contains a line break (${entry.length} characters).`,
  );
}

const byteLength = Buffer.byteLength(entry, "utf8");

mkdirSync("/output", { recursive: true });
// Write the source file verbatim (including its trailing newline) so the
// output is byte-identical to ./entry.txt.
writeFileSync(DEST, raw, "utf8");

// Verify the written file is byte-identical to the source entry.
const written = readFileSync(DEST, "utf8");
if (written !== raw) {
  fail(`${DEST} does not match ./entry.txt after writing.`);
}

console.log(entry);
console.log(
  `OK: ${entry.length} characters (${byteLength} UTF-8 bytes), 1 line, ` +
    `written to ${DEST} and verified byte-identical to ./entry.txt.`,
);
