/* admin/admin.js — Content Control table logic (demo preview override) */
if(!window.ComContent.isDemoLoggedIn()){
  location.href = "login.html";
}
document.getElementById("logout-btn").addEventListener("click", () => {
  window.ComContent.demoLogout();
  location.href = "login.html";
});
document.getElementById("reset-btn").addEventListener("click", () => {
  window.ComContent.clearOverride();
  paint();
});
function paint(){
  document.querySelectorAll("[data-status-label]").forEach(el => {
    const [weekId, part] = el.getAttribute("data-status-label").split(":");
    const on = window.ComContent.isPublished(weekId, part);
    el.textContent = on ? "Published" : "Coming Soon";
    el.style.borderColor = on ? "var(--signal)" : "var(--locked-gray)";
    el.style.color = on ? "var(--signal)" : "var(--locked-gray)";
  });
}
document.querySelectorAll("[data-toggle]").forEach(btn => {
  btn.addEventListener("click", () => {
    const [weekId, part] = btn.getAttribute("data-toggle").split(":");
    const on = window.ComContent.isPublished(weekId, part);
    window.ComContent.setOverride(weekId, part, !on);
    paint();
  });
});
paint();
