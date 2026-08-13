#!/usr/bin/env node
/**
 * Removes the GSUB table from the CV PDF fonts.
 *
 * Why: @react-pdf/pdfkit writes ligature glyphs into the PDF ToUnicode CMap as
 * `<0066 0069>` instead of `<00660069>`. The space makes the entry invalid, so
 * text extractors drop it entirely and an ATS reads "Certication" instead of
 * "Certification". No GSUB means no ligature glyphs, so every character keeps a
 * one-to-one mapping. Kerning lives in GPOS and is untouched.
 *
 *   node scripts/strip-font-gsub.mjs
 *
 * Run this again if the font files are ever re-downloaded.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DROP = new Set(["GSUB", "morx"]);
const FONT_DIR = join(process.cwd(), "assets", "fonts");
const FILES = [
  "Geist-Regular.ttf",
  "Geist-Medium.ttf",
  "Geist-SemiBold.ttf",
  "Geist-Italic.ttf",
  "InstrumentSerif-Italic.ttf",
];

function stripTables(buf) {
  const numTables = buf.readUInt16BE(4);
  const records = [];

  for (let i = 0; i < numTables; i += 1) {
    const at = 12 + i * 16;
    records.push({
      tag: buf.toString("latin1", at, at + 4),
      checkSum: buf.readUInt32BE(at + 4),
      offset: buf.readUInt32BE(at + 8),
      length: buf.readUInt32BE(at + 12),
    });
  }

  const kept = records
    .filter((record) => !DROP.has(record.tag))
    .sort((a, b) => (a.tag < b.tag ? -1 : 1));

  if (kept.length === numTables) return null;

  const count = kept.length;
  const entrySelector = Math.floor(Math.log2(count));
  const searchRange = 16 * 2 ** entrySelector;

  const header = Buffer.alloc(12 + count * 16);
  buf.copy(header, 0, 0, 4);
  header.writeUInt16BE(count, 4);
  header.writeUInt16BE(searchRange, 6);
  header.writeUInt16BE(entrySelector, 8);
  header.writeUInt16BE(count * 16 - searchRange, 10);

  const chunks = [header];
  let cursor = header.length;

  kept.forEach((record, index) => {
    const padding = (4 - (cursor % 4)) % 4;
    if (padding) {
      chunks.push(Buffer.alloc(padding));
      cursor += padding;
    }

    const at = 12 + index * 16;
    header.write(record.tag, at, 4, "latin1");
    header.writeUInt32BE(record.checkSum, at + 4);
    header.writeUInt32BE(cursor, at + 8);
    header.writeUInt32BE(record.length, at + 12);

    chunks.push(buf.subarray(record.offset, record.offset + record.length));
    cursor += record.length;
  });

  const out = Buffer.concat(chunks);

  // Tables moved, so the whole-file checksum in `head` no longer holds.
  const headIndex = kept.findIndex((record) => record.tag === "head");
  if (headIndex !== -1) {
    out.writeUInt32BE(0, out.readUInt32BE(12 + headIndex * 16 + 8) + 8);
  }

  return out;
}

let changed = 0;

for (const file of FILES) {
  const target = join(FONT_DIR, file);
  const stripped = stripTables(readFileSync(target));

  if (!stripped) {
    console.log(`· ${file} (already clean)`);
    continue;
  }

  writeFileSync(target, stripped);
  console.log(`✓ ${file}`);
  changed += 1;
}

console.log(`${changed} font(s) rewritten.`);
