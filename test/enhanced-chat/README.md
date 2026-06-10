# Enhanced Chat (ECV2 / CWC) browser-test helper

A Playwright page-object for driving the Enhanced Chat widget embedded on an
external host page (e.g. the SFW test pages under `godwin/sfw/`).

## Why this exists / the architecture that shapes it

The chat widget is a **single cross-origin iframe** (`#embeddedMessagingFrame`,
served from the ESW deployment site) whose entire UI lives in **deep Shadow DOM**
(`runtime_copilot-cwc-broker` → `cwc-layout` → `cwc-*message*` bubbles). It is
**not** nested iframes — opening the conversation spawns no new frames.

That means raw `iframe.contentDocument.querySelector(...)` fails twice over:
cross-origin **and** shadow-boundary. Playwright locators pierce both
automatically, which is the only reason this is tractable with **zero app
changes**. (For a no-app-change *and* Selenium/Safari/FIT-portable approach, see
"Track B" in the design notes — a dev-gated `test:*` RPC namespace on the
existing `cwc-broker` postMessage bus. Not implemented here.)

All selectors were verified live against deployment `cwc_dev_03` (godwin-sdb6).

## Files

| File | Purpose |
|---|---|
| `EnhancedChatPage.mjs` | The page-object. Import and use in any Playwright test. |
| `smoke.mjs` | Runnable smoke test exercising the full open → send → assert flow. |

## Run the smoke test

**Option 1 — full `playwright` (downloads its own browser):**
```bash
npm i -D playwright
node smoke.mjs
```

**Option 2 — `playwright-core` + an already-cached Chromium (no download):**
```bash
npm i -D playwright-core
PW_CORE=1 \
PW_EXECUTABLE="$HOME/Library/Caches/ms-playwright/chromium-1187/chrome-mac/Chromium.app/Contents/MacOS/Chromium" \
node smoke.mjs
```

Env vars: `CHAT_URL` (page under test), `HEADED=1`, `SHOT=/path/to.png`.

## API

```js
import { EnhancedChatPage } from './EnhancedChatPage.mjs';

const chat = new EnhancedChatPage(page);     // page = a Playwright Page
await chat.goto('https://esw1234.github.io/godwin/sfw/cwc-dev-03.html');
await chat.waitForButton();                   // FAB created
await chat.open();                            // maximize window
await chat.send('hello');                     // types + Enter, waits for the bubble to render
const reply = await chat.waitForAgentReply('hello');  // agent text, or null on timeout
await chat.minimize();

// Auth (verified identity) flow — drives the bootstrap global, iframe-agnostic:
await chat.setIdentityToken(jwt);
await chat.clearSession();

// Introspection:
await chat.collectMessages('hello');          // [{dir:'out'|'in'|'system', text, cls}]
await chat.waitForLifecycle('onEmbeddedMessagingConversationOpened');
chat.sawLifecycle('onEmbeddedMessagingReady');
chat.lifecycle;                               // captured event log lines
```

## Gotchas baked into the helper

- **Never `waitUntil:'networkidle'`** — chat holds long-poll connections open, so
  the network never idles. `goto()` uses `domcontentloaded`.
- **Lifecycle events are async** — they fire a beat *after* the triggering action,
  so assert via `waitForLifecycle(...)`, not an immediate `sawLifecycle(...)`.
- **`send()` waits for the echoed bubble** via `getByText` (class-agnostic), since
  the outbound-bubble markup differs from the inbound `cwc-*message` class.
- **Dev-mode console is noisy** (LWC version-mismatch warnings, O11Y lines) when
  the deployment loads `?lwc.mode=dev`; filter it in CI logs if needed.

## Note on agent replies

The smoke test reports the agent reply as `INFO`, not a hard check — whether the
bot responds depends on its Agentforce topic/LLM configuration, which is
independent of the test harness. `waitForAgentReply()` returns `null` (not an
error) on timeout so you can assert on it explicitly per-deployment.
