/**
 * Smoke test for EnhancedChatPage against a live SFW test page.
 *
 * Run modes:
 *   1. With a full `playwright` install (downloads its own browser):
 *        npm i -D playwright && node smoke.mjs
 *   2. With only `playwright-core` + a cached Chromium (no download):
 *        PW_CORE=1 PW_EXECUTABLE="/path/to/Chromium" node smoke.mjs
 *
 * Env:
 *   CHAT_URL       page to test   (default: the cwc-dev-03 page)
 *   PW_CORE=1      import playwright-core instead of playwright
 *   PW_EXECUTABLE  chromium binary path (required with PW_CORE if no channel)
 *   HEADED=1       run headed
 *   SHOT=/path     screenshot output (default ./smoke.png next to this file)
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EnhancedChatPage } from './EnhancedChatPage.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHAT_URL =
  process.env.CHAT_URL || 'https://esw1234.github.io/godwin/sfw/cwc-dev-03.html';
const SHOT = process.env.SHOT || join(__dirname, 'smoke.png');

// Resolve the playwright module flexibly: full `playwright` (preferred) or `playwright-core`.
async function loadChromium() {
  const mod = process.env.PW_CORE ? 'playwright-core' : 'playwright';
  const pw = await import(mod).catch((e) => {
    console.error(`Could not import "${mod}". Install it, or set PW_CORE=1 with playwright-core.`);
    throw e;
  });
  const chromium = pw.chromium || pw.default?.chromium;
  if (!chromium) throw new Error(`"${mod}" did not export chromium`);
  return chromium;
}

let failures = 0;
function check(label, cond) {
  const ok = !!cond;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) failures++;
  return ok;
}

const chromium = await loadChromium();
const launchOpts = { headless: !process.env.HEADED };
if (process.env.PW_EXECUTABLE) launchOpts.executablePath = process.env.PW_EXECUTABLE;

const browser = await chromium.launch(launchOpts);
const page = await browser.newPage();
const chat = new EnhancedChatPage(page);

try {
  console.log(`\nEnhancedChatPage smoke → ${CHAT_URL}\n`);

  await chat.goto(CHAT_URL);
  console.log('STEP loaded host page');

  await chat.waitForButton();
  check('FAB created (onEmbeddedMessagingButtonCreated)', chat.sawLifecycle('onEmbeddedMessagingButtonCreated'));

  await chat.open();
  check('composer visible after open()', await chat.composer().isVisible());
  check('window maximized event fired', await chat.waitForLifecycle('onEmbeddedMessagingWindowMaximized'));

  // send() waits for the bubble to render (delivery confirmation)
  const msg = await chat.send('Smoke test: what can you help with?');
  console.log(`STEP sent: "${msg}"`);
  check('conversation opened (server-side id assigned)', await chat.waitForLifecycle('onEmbeddedMessagingConversationOpened', { timeout: 15000 }));

  const echoed = await chat.collectMessages(msg);
  check('user message appears in transcript', echoed.some((m) => m.text === msg));

  const reply = await chat.waitForAgentReply(msg, { timeout: 30000 });
  // Agent reply depends on bot config; report but don't hard-fail the harness on it.
  console.log(`  ${reply ? 'PASS' : 'INFO'}  agent reply: ${reply ? JSON.stringify(reply.slice(0, 80)) : '(none within 30s — bot may not be configured to respond)'}`);

  await page.screenshot({ path: SHOT });
  console.log(`\nscreenshot → ${SHOT}`);
} catch (err) {
  console.error('\nERROR:', err.message);
  failures++;
} finally {
  await browser.close();
}

console.log(`\n${failures === 0 ? 'OK — all hard checks passed' : `${failures} hard check(s) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
