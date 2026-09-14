/* progress.js — tracks theory/practice/quiz completion per week in localStorage.
   Demo only: per-browser client-side state. See README "Security Limitations". */
(function(){
  "use strict";
  const KEY = "com_cyber_progress";

  function readAll(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
  function writeAll(data){ localStorage.setItem(KEY, JSON.stringify(data)); }

  function get(weekId){
    const all = readAll();
    return all[weekId] || { theory:false, practice:false, quiz:false, quizScore:null };
  }
  function set(weekId, patch){
    const all = readAll();
    all[weekId] = Object.assign(get(weekId), patch);
    writeAll(all);
    document.dispatchEvent(new CustomEvent("progress:changed", { detail:{ weekId, state:all[weekId] } }));
  }
  /* percent for one week: average of theory + practice (quiz counts as bonus if it exists) */
  function weekPercent(weekId, hasQuiz){
    const s = get(weekId);
    const parts = hasQuiz ? [s.theory, s.practice, s.quiz] : [s.theory, s.practice];
    const done = parts.filter(Boolean).length;
    return Math.round((done/parts.length)*100);
  }
  /* overall percent across only the given (published/active) week ids —
     locked/coming-soon weeks are excluded, per spec: they are not "unfinished". */
  function overallPercent(activeWeekIds){
    if(!activeWeekIds || !activeWeekIds.length) return 0;
    let sum = 0;
    activeWeekIds.forEach(id => { sum += weekPercent(id, false); });
    return Math.round(sum/activeWeekIds.length);
  }

  window.ComProgress = { get, set, weekPercent, overallPercent, readAll };

  /* auto-wire buttons with data-complete="weekId:part" */
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-complete]").forEach(btn => {
      btn.addEventListener("click", () => {
        const [weekId, part] = btn.getAttribute("data-complete").split(":");
        set(weekId, { [part]: true });
        btn.textContent = btn.getAttribute("data-complete-label") || "Completed ✓";
        btn.setAttribute("disabled", "true");
      });
    });

    /* render progress bars marked with data-progress-bar="weekId" */
    document.querySelectorAll("[data-progress-bar]").forEach(bar => {
      const id = bar.getAttribute("data-progress-bar");
      const hasQuiz = bar.hasAttribute("data-has-quiz");
      const pct = weekPercent(id, hasQuiz);
      const fill = bar.querySelector(".progress-fill");
      if(fill) fill.style.width = pct + "%";
      const label = bar.parentElement.querySelector("[data-progress-label]");
      if(label) label.textContent = pct + "%";
    });
  });
})();
