/**
 * Builds remote-data/presentations.json (the Oral / Poster presentation schedule) from the
 * website's raw export, lib/presentation-schedules.json in the apticon-2026 repo.
 *
 * The raw export has extraction noise (dates like "24thOct2026", times like "10:00AMto 12:00Noon",
 * oral titles split across two rows). This script cleans that into one consistent shape the app
 * validates and renders.
 *
 * Run:
 *   node scripts/build-presentations.js <path-to-presentation-schedules.json>
 *
 * Safe to re-run: it always rewrites remote-data/presentations.json from the given source.
 */

const fs = require('fs');
const path = require('path');

const DAY_LABELS = { 1: 'Day 1', 2: 'Day 2' };
const DAY_DATES = { 1: '24 Oct 2026', 2: '25 Oct 2026' };

// Every distinct raw time string in the source, mapped to one display form. An unknown value
// throws instead of being passed through, so a new/typo'd time can't slip into the app unseen.
const TIMES = {
  '2:30 PM to 3:30 PM': '2:30 PM – 3:30 PM',
  '02:30 PM – 3:30PM': '2:30 PM – 3:30 PM',
  '3:30 PM to 4:30 PM': '3:30 PM – 4:30 PM',
  '3:30PMto 4:30PM': '3:30 PM – 4:30 PM',
  '4:30PMto 5:30PM': '4:30 PM – 5:30 PM',
  '10:30 AM to 12 NOON': '10:30 AM – 12:00 PM',
  '10:00AMto 12:00Noon': '10:00 AM – 12:00 PM',
  // Truncated in the source (one Day 2 poster); every other Day 2 poster is 10:00 AM – 12:00 PM.
  '10:00AMto': '10:00 AM – 12:00 PM',
};

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

function dayNumberFromDate(raw) {
  const match = /^\s*(24|25)/.exec(raw);
  if (!match) throw new Error(`Cannot read the day from date "${raw}"`);
  return match[1] === '24' ? 1 : 2;
}

function time(raw) {
  const mapped = TIMES[clean(raw)];
  if (!mapped) throw new Error(`Unknown time "${raw}" - add it to TIMES`);
  return mapped;
}

/**
 * The source repeats a code when a long oral title wraps onto a second row. If one title contains
 * the other, keep the longer one; otherwise the two rows are fragments, so join them in order.
 */
function mergeOralDuplicates(rows) {
  const byCode = new Map();
  const order = [];
  for (const row of rows) {
    const existing = byCode.get(row.code);
    if (!existing) {
      byCode.set(row.code, { ...row });
      order.push(row.code);
      continue;
    }
    const a = existing.title;
    const b = row.title;
    if (b.includes(a)) existing.title = b;
    else if (!a.includes(b)) {
      existing.title = `${a} ${b}`;
      if (row.affiliation && !existing.affiliation.includes(row.affiliation)) {
        existing.affiliation = `${existing.affiliation} ${row.affiliation}`;
      }
    }
  }
  return order.map((code) => byCode.get(code));
}

function buildOral(raw) {
  const rows = raw.map((r) => ({
    code: clean(r.code),
    author: clean(r.author),
    title: clean(r.title),
    affiliation: clean(r.affiliation),
    subject: clean(r.subject),
    slot: clean(r.slot),
    hall: clean(r.hall),
    day: DAY_LABELS[dayNumberFromDate(r.date)],
    date: DAY_DATES[dayNumberFromDate(r.date)],
    time: time(r.time),
    isOnline: r.isOnline === true,
  }));
  return mergeOralDuplicates(rows);
}

// Posters sharing a code are different people (a numbering error in the source), so they all stay.
// `day` is trusted over the date text: four Day 2 posters carry "24th Oct" but sit in the Day 2
// morning slot.
function buildPoster(raw) {
  return raw.map((r) => {
    const day = clean(r.day) === 'Day 2' ? 2 : 1;
    return {
      code: clean(r.code),
      author: clean(r.author),
      title: clean(r.title),
      affiliation: clean(r.affiliation),
      subject: clean(r.subject),
      day: DAY_LABELS[day],
      date: DAY_DATES[day],
      time: time(r.time),
    };
  });
}

// One presentation per line keeps the file diffable and easy to hand-edit on github.com.
const lines = (rows) => rows.map((r) => `    ${JSON.stringify(r)}`).join(',\n');

function main() {
  const source = process.argv[2];
  if (!source) {
    console.error('Usage: node scripts/build-presentations.js <path-to-presentation-schedules.json>');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(path.resolve(source), 'utf8'));
  const oral = buildOral(raw.oral);
  const poster = buildPoster(raw.poster);

  const out = path.join(__dirname, '..', 'remote-data', 'presentations.json');
  fs.writeFileSync(out, `{\n  "oral": [\n${lines(oral)}\n  ],\n  "poster": [\n${lines(poster)}\n  ]\n}\n`);
  console.log(`oral: ${raw.oral.length} source rows -> ${oral.length}   poster: ${raw.poster.length} -> ${poster.length}`);
  console.log(`wrote ${path.relative(process.cwd(), out)}`);
}

main();
