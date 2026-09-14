/* notes.js — personal notes and bookmarks, stored per-browser in localStorage (demo only) */
(function(){
  "use strict";
  const NOTES_KEY = "com_cyber_notes";
  const BOOKMARK_KEY = "com_cyber_bookmarks";

  function readNotes(){ try{ return JSON.parse(localStorage.getItem(NOTES_KEY)) || {}; }catch(e){ return {}; } }
  function writeNotes(d){ localStorage.setItem(NOTES_KEY, JSON.stringify(d)); }
  function readBookmarks(){ try{ return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; }catch(e){ return []; } }
  function writeBookmarks(d){ localStorage.setItem(BOOKMARK_KEY, JSON.stringify(d)); }

  function addNote(moduleId, text){
    if(!text.trim()) return;
    const all = readNotes();
    all[moduleId] = all[moduleId] || [];
    all[moduleId].unshift({ text, at: new Date().toLocaleString("id-ID") });
    writeNotes(all);
  }
  function toggleBookmark(moduleId, title){
    let list = readBookmarks();
    const idx = list.findIndex(b => b.id === moduleId);
    if(idx >= 0){ list.splice(idx,1); }
    else{ list.unshift({ id: moduleId, title, at: new Date().toLocaleString("id-ID") }); }
    writeBookmarks(list);
    return idx < 0;
  }
  function isBookmarked(moduleId){ return readBookmarks().some(b => b.id === moduleId); }

  window.ComNotes = { addNote, readNotes, toggleBookmark, isBookmarked, readBookmarks };

  document.addEventListener("DOMContentLoaded", () => {
    /* notes widget */
    const notesBox = document.querySelector("[data-notes-module]");
    if(notesBox){
      const moduleId = notesBox.getAttribute("data-notes-module");
      const list = notesBox.querySelector("[data-notes-list]");
      const textarea = notesBox.querySelector("textarea");
      const saveBtn = notesBox.querySelector("[data-notes-save]");

      function renderList(){
        const items = readNotes()[moduleId] || [];
        list.innerHTML = items.map(n => `
          <div class="note-item">
            <div class="n-meta"><span>${n.at}</span></div>
            <div>${n.text.replace(/</g,"&lt;")}</div>
          </div>
        `).join("") || `<p style="font-size:.82rem">Belum ada catatan untuk modul ini.</p>`;
      }
      saveBtn.addEventListener("click", () => {
        addNote(moduleId, textarea.value);
        textarea.value = "";
        renderList();
      });
      renderList();
    }

    /* bookmark toggle button */
    document.querySelectorAll("[data-bookmark-toggle]").forEach(btn => {
      const moduleId = btn.getAttribute("data-bookmark-toggle");
      const title = btn.getAttribute("data-bookmark-title") || document.title;
      function refresh(){
        const on = isBookmarked(moduleId);
        btn.textContent = on ? "🔖 Bookmarked" : "🔖 Bookmark";
        btn.classList.toggle("btn-primary", on);
        btn.classList.toggle("btn-outline", !on);
      }
      btn.addEventListener("click", () => { toggleBookmark(moduleId, title); refresh(); });
      refresh();
    });

    /* bookmark list rendering, e.g. on dashboard */
    const bmList = document.querySelector("[data-bookmarks-list]");
    if(bmList){
      const items = readBookmarks();
      bmList.innerHTML = items.length ? items.map(b => `
        <div class="activity-item"><span>🔖</span><div><strong>${b.title}</strong><br><span style="color:var(--ink-soft);font-size:.78rem">${b.at}</span></div></div>
      `).join("") : `<p style="font-size:.85rem">Belum ada materi yang disimpan.</p>`;
    }
  });
})();
