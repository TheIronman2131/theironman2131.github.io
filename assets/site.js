/* AIWaterUsage.com — shared interaction: theme toggle + mobile navigation. */
(function () {
  "use strict";

  /* --- Theme toggle (sun that morphs into a moon) ------------------------ */
  var root = document.documentElement;
  var btn = document.createElement("button");
  btn.className = "theme-toggle";
  btn.type = "button";
  btn.innerHTML =
    '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<defs><mask id="themeCrescent">' +
        '<rect x="0" y="0" width="24" height="24" fill="#fff"/>' +
        '<circle class="cutter" fill="#000"/>' +
      '</mask></defs>' +
      '<g class="rays" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">' +
        '<line x1="12" y1="1.8" x2="12" y2="4.1"/>' +
        '<line x1="12" y1="19.9" x2="12" y2="22.2"/>' +
        '<line x1="1.8" y1="12" x2="4.1" y2="12"/>' +
        '<line x1="19.9" y1="12" x2="22.2" y2="12"/>' +
        '<line x1="4.8" y1="4.8" x2="6.4" y2="6.4"/>' +
        '<line x1="17.6" y1="17.6" x2="19.2" y2="19.2"/>' +
        '<line x1="4.8" y1="19.2" x2="6.4" y2="17.6"/>' +
        '<line x1="17.6" y1="6.4" x2="19.2" y2="4.8"/>' +
      '</g>' +
      '<circle class="orb" cx="12" cy="12" fill="currentColor" mask="url(#themeCrescent)"/>' +
    '</svg>';

  function syncLabel() {
    var dark = root.dataset.theme === "dark";
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    btn.setAttribute("aria-pressed", String(dark));
  }
  btn.addEventListener("click", function () {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncLabel();
  });
  if (document.body) { document.body.appendChild(btn); syncLabel(); }

  /* --- Mobile navigation ------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();

/* Cookie consent banner — gates Google Analytics via Consent Mode.
   Default consent is "denied" (set in each page's head before GTM); Accept
   flips analytics on. Decline leaves it denied. The choice is remembered. */
(function () {
  "use strict";
  var KEY = "cookieConsent";
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  if (stored === "granted" || stored === "denied" || !document.body) return;

  var el = document.createElement("div");
  el.className = "cookie";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "Cookie notice");
  el.innerHTML =
    '<svg class="cookie-ico" viewBox="0 0 32 32" fill="none" aria-hidden="true">' +
      '<circle cx="16" cy="16" r="13" fill="var(--accent-tint)" stroke="var(--accent)" stroke-width="1.5"/>' +
      '<circle cx="12" cy="12" r="1.7" fill="var(--accent)"/>' +
      '<circle cx="21" cy="13" r="1.4" fill="var(--accent)"/>' +
      '<circle cx="14" cy="21" r="1.5" fill="var(--accent)"/>' +
      '<circle cx="21" cy="20.5" r="1.2" fill="var(--accent)"/>' +
    '</svg>' +
    '<div class="cookie-body">' +
      '<p class="cookie-text">We use a couple of cookies to measure visits with Google Analytics — nothing else, and no ads.</p>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="cookie-btn cookie-accept">Accept</button>' +
        '<button type="button" class="cookie-btn cookie-ghost cookie-decline">Decline</button>' +
        '<a class="cookie-link" href="/privacy.html">Privacy policy</a>' +
      '</div>' +
    '</div>';

  function decide(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    if (v === "granted" && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied" });
    }
    if (el.parentNode) el.parentNode.removeChild(el);
  }
  el.querySelector(".cookie-accept").addEventListener("click", function () { decide("granted"); });
  el.querySelector(".cookie-decline").addEventListener("click", function () { decide("denied"); });
  document.body.appendChild(el);
})();
