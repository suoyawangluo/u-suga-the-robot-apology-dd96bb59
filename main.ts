// The Robot Apology — u-suga-the-robot-apology-dd96bb59
// A two-line robot confession: one sentence owning a specific mistake,
// one sentence naming the lesson and the fix that follows from it.
// Writes the entry to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE_ONE =
  "I'm sorry I set your alarm for 7 p.m. instead of 7 a.m., and you slept through your morning meeting.";
const LINE_TWO =
  "I've learned to check the small letters after the numbers, so from now on your mornings will start in the morning.";

const entry = `${LINE_ONE}\n${LINE_TWO}\n`;

// checkGate: the sealed scorer requires UTF-8 text of 1-400 characters,
// not only whitespace, in exactly two lines, one sentence each.
function checkGate(text: string): void {
  const chars = [...text.trimEnd()];
  if (chars.length < 1 || chars.length > 400) {
    throw new Error(`gate: entry is ${chars.length} characters, must be 1-400`);
  }
  if (text.trim().length === 0) throw new Error("gate: entry is only whitespace");
  const lines = text.trimEnd().split("\n");
  if (lines.length !== 2) throw new Error(`gate: entry has ${lines.length} lines, must be 2`);
  for (const line of lines) {
    // A sentence ends with . ! or ? at end of line or before a capitalised
    // next sentence; dots inside abbreviations like "7 p.m." do not count.
    const terminators = line.match(/[.!?](?=\s*$|\s+[A-Z])/g) ?? [];
    if (terminators.length !== 1) {
      throw new Error(`gate: line is not a single sentence: ${line}`);
    }
  }
}

checkGate(entry);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, entry, "utf8");
const sha256 = createHash("sha256").update(readFileSync(outPath)).digest("hex");
console.log(`wrote ${outPath} (${[...entry.trimEnd()].length} code points, sha256 ${sha256})`);
console.log(`verified: ${JSON.stringify(entry.trimEnd())}`);
