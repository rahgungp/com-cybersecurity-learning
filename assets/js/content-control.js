/* content-control.js
   Reads publish status from courseConfig (assets/js/course-config.js), which is
   the permanent source of truth a dosen edits by hand.

   The Admin Panel additionally supports a LOCAL PREVIEW OVERRIDE stored in this
   browser's localStorage, so a dosen can demo "Publish/Hide" instantly without
   editing code. The override only affects the browser it was set in — it is not
   a real database and does not change the file for other visitors. To make a
   change permanent (and visible to everyone), edit assets/js/course-config.js.

   IMPORTANT: this is a client-side, static-site mechanism. It is NOT a security
   boundary — anyone who opens devtools or reads course-config.js can see which
   weeks are flagged unpublished. See README "Security Limitations". */
(function(){
  "use strict";
  const OVERRIDE_KEY = "com_cyber_publish_override";
  const AUTH_KEY = "com_cyber_admin_demo_session";

  function readOverride(){
    try{ return JSON.parse(localStorage.getItem(OVERRIDE_KEY)) || {}; }
    catch(e){ return {}; }
  }
  function writeOverride(o){ localStorage.setItem(OVERRIDE_KEY, JSON.stringify(o)); }
  function clearOverride(){ localStorage.removeItem(OVERRIDE_KEY); }

  function baseConfig(){ return (typeof window.courseConfig !== "undefined") ? window.courseConfig : {}; }

  /* effective status = local override (if set) else course-config.js default */
  function isPublished(weekId, part){
    const override = readOverride();
    if(override[weekId] && typeof override[weekId][part] === "boolean"){
      return override[weekId][part];
    }
    const cfg = baseConfig();
    return !!(cfg[weekId] && cfg[weekId][part]);
  }
  function setOverride(weekId, part, value){
    const o = readOverride();
    o[weekId] = o[weekId] || {};
    o[weekId][part] = value;
    writeOverride(o);
  }
  function weekIds(){ return Object.keys(baseConfig()); }
  function weekTitle(weekId){ const cfg = baseConfig(); return cfg[weekId] ? cfg[weekId].title : weekId; }

  /* demo admin session flag — NOT real authentication, see admin/login.html */
  function demoLogin(){ sessionStorage.setItem(AUTH_KEY, "1"); }
  function demoLogout(){ sessionStorage.removeItem(AUTH_KEY); }
  function isDemoLoggedIn(){ return sessionStorage.getItem(AUTH_KEY) === "1"; }

  window.ComContent = {
    isPublished, setOverride, clearOverride, readOverride,
    weekIds, weekTitle, baseConfig,
    demoLogin, demoLogout, isDemoLoggedIn
  };

  /* auto-lock any element with data-locked-unless="weekId:part".
     Content is NEVER removed from the DOM (Hide != Delete) — it is only
     visually hidden and replaced with a "Coming Soon" overlay via CSS
     ([data-locked="true"] rule in style.css). A dosen re-publishing the
     part (course-config.js or the Admin Panel override) restores it
     instantly without any content having been deleted. */
  function paintLocks(){
    document.querySelectorAll("[data-locked-unless]").forEach(el => {
      const [weekId, part] = el.getAttribute("data-locked-unless").split(":");
      const locked = !isPublished(weekId, part);
      el.setAttribute("data-locked", locked ? "true" : "false");
      let overlay = el.querySelector(":scope > .lock-overlay");
      if(locked && !overlay){
        overlay = document.createElement("div");
        overlay.className = "lock-overlay locked-panel";
        overlay.innerHTML = `
          <div class="ic">🔒</div>
          <h2>COMING SOON</h2>
          <p>Bagian ini belum dipublikasikan oleh dosen pengampu. Materi akan tersedia sesuai jadwal perkuliahan.</p>`;
        el.appendChild(overlay);
      } else if(!locked && overlay){
        overlay.remove();
      }
    });
  }
  window.ComContent.paintLocks = paintLocks;
  document.addEventListener("DOMContentLoaded", paintLocks);
})();
