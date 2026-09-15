// CLS diagnostic (kept from the 039 gate): run one Lighthouse pass (default mobile config, simulated throttling —
// i.e. an unthrottled load in Lighthouse's own Chrome) and print every LayoutShift from its trace,
// timed against navigation start, FCP and the site's karka:* user-timing marks.
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const url = process.argv[2] ?? 'http://localhost:4173/';
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-first-run'] });
try {
  const result = await lighthouse(url, { port: chrome.port, logLevel: 'error', onlyCategories: ['performance'] });
  const trace = result.artifacts.Trace ?? result.artifacts.traces?.defaultPass;
  const events = trace.traceEvents;
  const nav = events.find((e) => e.name === 'navigationStart' && e.args?.data?.isLoadingMainFrame) ?? events.find((e) => e.name === 'navigationStart');
  const t0 = nav.ts;
  const ms = (ts) => Math.round((ts - t0) / 1000);
  const rows = [];
  for (const e of events) {
    if (e.name === 'firstContentfulPaint') rows.push([ms(e.ts), 'FCP']);
    if (e.cat?.includes('blink.user_timing') && String(e.name).startsWith('karka:')) rows.push([ms(e.ts), `mark ${e.name}`]);
    if (e.name === 'LayoutShift') {
      const d = e.args?.data ?? {};
      const nodes = (d.impacted_nodes ?? []).map((n) => `[${n.old_rect?.join(',')}]→[${n.new_rect?.join(',')}]`).join(' ; ');
      rows.push([ms(e.ts), `SHIFT score=${(d.score ?? 0).toFixed(3)} weighted=${(d.weighted_score_delta ?? 0).toFixed(3)} input=${d.had_recent_input} ${nodes}`]);
    }
  }
  rows.sort((a, b) => a[0] - b[0]).forEach(([t, s]) => console.log(`${t} ms  ${s}`));
  console.log('CLS audit:', result.lhr.audits['cumulative-layout-shift'].displayValue, '| perf', Math.round(result.lhr.categories.performance.score * 100));
} finally {
  try {
    await chrome.kill();
  } catch {
    /* Windows temp-profile cleanup can throw EPERM; harmless. */
  }
}
