/**
 * EnhancedChatPage — a Playwright page-object for driving the ECV2 / Enhanced Chat
 * (Customer Web Client) widget embedded on an external host page.
 *
 * ARCHITECTURE NOTE (why this works the way it does):
 *   The chat widget is a SINGLE cross-origin iframe (`#embeddedMessagingFrame`,
 *   served from the ESW site) whose entire UI lives in deep Shadow DOM —
 *   `runtime_copilot-cwc-broker` → `cwc-layout` → message bubbles (`cwc-*message*`).
 *   It is NOT nested iframes: opening the conversation spawns no new frames.
 *   Raw `iframe.contentDocument.querySelector` therefore fails twice over
 *   (cross-origin AND shadow boundary). Playwright locators pierce both, which
 *   is the only reason this is tractable without app changes.
 *
 *   All selectors below were verified live against deployment `cwc_dev_03`
 *   (godwin-sdb6) on 2026-06-09 via headless Chromium.
 *
 * USAGE:
 *   import { EnhancedChatPage } from './EnhancedChatPage.mjs';
 *   const chat = new EnhancedChatPage(page);
 *   await chat.waitForButton();      // FAB created
 *   await chat.open();               // maximize the window
 *   await chat.send('hello');
 *   const reply = await chat.waitForAgentReply();
 */

/** Selectors, isolated so a markup churn is a one-line fix, not a hunt. */
export const SELECTORS = {
  iframe: '#embeddedMessagingFrame',
  fab: '.chat-fab-container, button[class*="fab" i]',
  composer: 'textbox', // role; placeholder "Type your message..."
  minimizeButton: /minimize the chat window/i,
  menuButton: /open the chat menu/i,
  // Conversation entries render as cwc-*message* nodes in shadow DOM.
  // Outbound (user) vs inbound (agent) is distinguished inside collectMessages().
  messageNodeClassRegex: 'cwc-.*message',
  systemNoiseRegex: /joined|just now|^sent\b|left the conversation/i,
};

/** Host-page lifecycle events the SFW test page logs to console. */
export const LIFECYCLE_EVENTS = [
  'onEmbeddedMessagingReady',
  'onEmbeddedMessagingButtonCreated',
  'onEmbeddedMessagingWindowMaximized',
  'onEmbeddedMessagingWindowMinimized',
  'onEmbeddedMessagingConversationOpened',
  'onEmbeddedMessagingConversationClosed',
];

export class EnhancedChatPage {
  /**
   * @param {import('playwright-core').Page} page  an already-created Playwright page
   * @param {object} [opts]
   * @param {number} [opts.defaultTimeout=15000]   per-action timeout (ms)
   */
  constructor(page, opts = {}) {
    this.page = page;
    this.defaultTimeout = opts.defaultTimeout ?? 15000;
    this.frame = page.frameLocator(SELECTORS.iframe);
    /** @type {string[]} captured lifecycle event log lines */
    this.lifecycle = [];
    this._wireLifecycle();
  }

  /** Capture the page-level onEmbeddedMessaging* console logs as they fire. */
  _wireLifecycle() {
    this.page.on('console', (m) => {
      const t = m.text();
      if (LIFECYCLE_EVENTS.some((e) => t.includes(e))) this.lifecycle.push(t);
    });
  }

  /**
   * Navigate to a hosted SFW test page. Uses 'domcontentloaded' NOT 'networkidle' —
   * the chat holds long-poll connections open, so the network never goes idle and
   * 'networkidle' would always time out.
   */
  async goto(url, { timeout = 45000 } = {}) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    return this;
  }

  /** Resolve once the bootstrap has created the FAB (onEmbeddedMessagingButtonCreated). */
  async waitForButton({ timeout = 30000 } = {}) {
    await this.frame.locator(SELECTORS.fab).first().waitFor({ state: 'visible', timeout });
    return this;
  }

  /** Open (maximize) the chat window by clicking the FAB. Idempotent-ish: safe if already open. */
  async open({ timeout = this.defaultTimeout } = {}) {
    await this.frame.locator(SELECTORS.fab).first().click({ timeout });
    // composer presence is the reliable "open" signal
    await this.composer().waitFor({ state: 'visible', timeout });
    return this;
  }

  /** The message composer textbox locator ("Type your message..."). */
  composer() {
    return this.frame.getByRole(SELECTORS.composer).first();
  }

  /**
   * Type a message and send it (Enter). Returns the text sent.
   * Does NOT wait for the agent — call waitForAgentReply() for that.
   *
   * By default waits for the sent text to render as a bubble (delivery confirmation)
   * using getByText, which pierces shadow DOM and is class-agnostic — robust against
   * the outbound-bubble markup differing from the `cwc-*message` inbound class.
   * Pass {waitForEcho:false} to fire-and-forget.
   */
  async send(text, { timeout = this.defaultTimeout, waitForEcho = true } = {}) {
    const box = this.composer();
    await box.click({ timeout });
    await box.fill(text);
    await box.press('Enter');
    if (waitForEcho) {
      await this.frame.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout });
    }
    return text;
  }

  /**
   * Wait until a given onEmbeddedMessaging* lifecycle event has fired.
   * Polls the captured log (events arrive asynchronously after the triggering action).
   */
  async waitForLifecycle(eventName, { timeout = this.defaultTimeout, interval = 250 } = {}) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (this.sawLifecycle(eventName)) return true;
      await this.page.waitForTimeout(interval);
    }
    return false;
  }

  /** Minimize the chat window via the header control. */
  async minimize({ timeout = this.defaultTimeout } = {}) {
    await this.frame.getByRole('button', { name: SELECTORS.minimizeButton }).click({ timeout });
    return this;
  }

  /**
   * Collect the current conversation as an ordered list of {dir, text} where
   * dir is 'out' | 'in' | 'system'. Pierces shadow DOM via an in-frame deep walk.
   * @param {string} [myText] the user's last sent text, to classify outbound bubbles
   */
  async collectMessages(myText = null) {
    return this.frame.locator(':scope').evaluate(
      (_, { myText, noise }) => {
        function* walk(root) {
          const stack = [root];
          while (stack.length) {
            const n = stack.pop();
            if (n.shadowRoot) stack.push(n.shadowRoot);
            for (const c of n.children || []) stack.push(c);
            yield n;
          }
        }
        const noiseRe = new RegExp(noise, 'i');
        const seen = new Set();
        const out = [];
        for (const n of walk(document)) {
          const raw = n.className;
          const cls = raw && raw.baseVal !== undefined ? raw.baseVal : raw;
          if (typeof cls !== 'string') continue;
          // own text only (direct text children), avoids double-counting ancestors
          const ownText = [...n.childNodes]
            .filter((c) => c.nodeType === 3)
            .map((c) => c.textContent.trim())
            .join(' ')
            .trim();
          const text = ownText || (n.textContent || '').trim();
          // Accept inbound/system bubbles by class, OR any leaf node that exactly
          // carries the user's sent text (the outbound bubble uses different markup).
          const isMessageClass = /cwc-.*message/i.test(cls);
          const isMyEcho = myText && ownText === myText;
          if (!isMessageClass && !isMyEcho) continue;
          if (!text || text.length > 600 || seen.has(text)) continue;
          seen.add(text);
          let dir = 'in';
          if (myText && text === myText) dir = 'out';
          else if (/system|participant|timestamp/i.test(cls) || noiseRe.test(text)) dir = 'system';
          else if (/outbound|sent|self|end/i.test(cls)) dir = 'out';
          out.push({ dir, text, cls: String(cls).slice(0, 60) });
        }
        return out;
      },
      { myText, noise: SELECTORS.systemNoiseRegex.source }
    );
  }

  /**
   * Poll until an inbound (agent) message appears that is not the user's own text
   * and not system noise. Returns the agent message text, or null on timeout.
   * @param {string} [myText] the user's sent text to exclude
   */
  async waitForAgentReply(myText = null, { timeout = 40000, interval = 2000 } = {}) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const msgs = await this.collectMessages(myText).catch(() => []);
      const agent = msgs.find((m) => m.dir === 'in');
      if (agent) return agent.text;
      await this.page.waitForTimeout(interval);
    }
    return null;
  }

  /**
   * Auth flow: set a verified-identity JWT via the bootstrap userVerificationAPI.
   * Drives the host page's global, so it works regardless of iframe boundaries.
   */
  async setIdentityToken(jwt) {
    await this.page.evaluate((token) => {
      // eslint-disable-next-line no-undef
      window.embeddedservice_bootstrap.userVerificationAPI.setIdentityToken({
        identityTokenType: 'JWT',
        identityToken: token,
      });
    }, jwt);
    return this;
  }

  /** Clear the verified session (host global). */
  async clearSession() {
    await this.page.evaluate(() => {
      // eslint-disable-next-line no-undef
      window.embeddedservice_bootstrap.userVerificationAPI.clearSession(true);
    });
    return this;
  }

  /** True if a given lifecycle event has fired since load. */
  sawLifecycle(eventName) {
    return this.lifecycle.some((l) => l.includes(eventName));
  }
}
