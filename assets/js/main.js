/* main.js — navigation, theme, search, filter chips */
(function(){
  "use strict";

  /* ---------- THEME ---------- */
  const THEME_KEY = "com_cyber_theme";
  function applyTheme(t){
    document.documentElement.setAttribute("data-theme", t);
    const btn = document.querySelector("[data-theme-toggle]");
    if(btn) btn.textContent = t === "dark" ? "☀" : "🌙";
    localStorage.setItem(THEME_KEY, t);
  }
  function initTheme(){
    const saved = localStorage.getItem(THEME_KEY) ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(saved);
    const btn = document.querySelector("[data-theme-toggle]");
    if(btn){
      btn.addEventListener("click", () => {
        const cur = document.documentElement.getAttribute("data-theme");
        applyTheme(cur === "dark" ? "light" : "dark");
      });
    }
  }

  /* ---------- MOBILE MENU ---------- */
  function initMobileMenu(){
    const toggle = document.querySelector("[data-menu-toggle]");
    const links = document.querySelector(".nav-links");
    if(!toggle || !links) return;
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      links.style.display = links.classList.contains("open") ? "flex" : "";
    });
  }

  /* ---------- MOBILE SIDEBAR (course detail) ---------- */
  function initSidebarToggle(){
    const toggle = document.querySelector("[data-sidebar-toggle]");
    const sidebar = document.querySelector(".sidebar");
    if(!toggle || !sidebar) return;
    toggle.addEventListener("click", () => {
      sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
    });
  }

  /* ---------- FILTER CHIPS ---------- */
  function initFilters(){
    const chips = document.querySelectorAll(".chip[data-filter]");
    const cards = document.querySelectorAll("[data-topic]");
    if(!chips.length) return;
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const f = chip.getAttribute("data-filter");
        cards.forEach(card => {
          const topics = (card.getAttribute("data-topic") || "").split(",");
          card.style.display = (f === "all" || topics.includes(f)) ? "" : "none";
        });
      });
    });
  }

  /* ---------- SEARCH ---------- */
  function initSearch(){
    const input = document.querySelector("[data-search-input]");
    const cards = document.querySelectorAll("[data-search-card]");
    if(!input) return;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      cards.forEach(card => {
        const hay = (card.getAttribute("data-search-card") + " " + card.textContent).toLowerCase();
        card.style.display = hay.includes(q) ? "" : "none";
      });
    });
  }

  /* ---------- COPY CODE ---------- */
  function initCopyButtons(){
    document.querySelectorAll(".copy-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.closest(".code-block").querySelector(".code-body");
        if(!target) return;
        navigator.clipboard.writeText(target.innerText).then(() => {
          const original = btn.textContent;
          btn.textContent = "Copied ✓";
          btn.classList.add("copied");
          setTimeout(() => { btn.textContent = original; btn.classList.remove("copied"); }, 1500);
        });
      });
    });
  }

  /* ---------- LIVE WEEK STATUS (badges, cards, sidebar) ---------- */
  const STATUS_LABEL = {
    completed: ["✓ COMPLETED", "badge-completed", "completed"],
    learning:  ["🔵 IN PROGRESS", "badge-learning", "learning"],
    available: ["🟢 AVAILABLE", "badge-learning", "learning"],
    locked:    ["🔒 COMING SOON", "badge-locked", "locked"]
  };
  function weekStatus(weekId){
    if(!window.ComContent) return "locked";
    const matOn = window.ComContent.isPublished(weekId, "material");
    const pracOn = window.ComContent.isPublished(weekId, "practice");
    if(!matOn && !pracOn) return "locked";
    const prog = window.ComProgress ? window.ComProgress.get(weekId) : {theory:false, practice:false};
    if(prog.theory && prog.practice) return "completed";
    if(prog.theory || prog.practice) return "learning";
    return "available";
  }
  function refreshWeekStatusUI(){
    if(!window.ComContent) return;
    document.querySelectorAll("[data-week]").forEach(el => {
      const weekId = el.getAttribute("data-week");
      const status = weekStatus(weekId);
      const [label, badgeCls, cardStatus] = STATUS_LABEL[status];

      if(el.classList.contains("card")){
        el.setAttribute("data-status", cardStatus);
        const badge = el.querySelector("[data-badge]");
        if(badge){ badge.className = "badge " + badgeCls; badge.textContent = label; }
        const matLink = el.querySelector("[data-material-link]");
        const pracLink = el.querySelector("[data-practice-link]");
        const matOn = window.ComContent.isPublished(weekId, "material");
        const pracOn = window.ComContent.isPublished(weekId, "practice");
        if(matLink) matLink.classList.toggle("btn-outline", !matOn);
        if(pracLink) pracLink.style.display = pracOn ? "" : "none";
      }
      if(el.classList.contains("side-item")){
        const ic = el.querySelector(".ic");
        const isCurrent = el.classList.contains("current");
        let icon = "🔒";
        if(status !== "locked"){ icon = status === "completed" ? "✓" : (isCurrent ? "◉" : "○"); }
        if(ic) ic.textContent = icon;
        el.classList.toggle("locked", status === "locked" && !isCurrent);
      }
    });
    /* overall progress figure, wherever present */
    document.querySelectorAll("[data-progress-overall]").forEach(el => {
      const active = Object.keys(window.ComContent.baseConfig()).filter(id => weekStatus(id) !== "locked");
      el.textContent = (window.ComProgress ? window.ComProgress.overallPercent(active) : 0) + "%";
    });
  }
  window.refreshWeekStatusUI = refreshWeekStatusUI;

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    initSidebarToggle();
    initFilters();
    initSearch();
    initCopyButtons();
    refreshWeekStatusUI();
  });
})();
