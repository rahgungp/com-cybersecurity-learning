/* quiz.js — renders and scores a quiz from a JSON definition embedded in the page
   Usage: <div data-quiz='MODULE_ID'></div> plus a <script type="application/json" data-quiz-data="MODULE_ID"> */
(function(){
  "use strict";

  function renderQuiz(container, moduleId, questions, passScore){
    let answers = new Array(questions.length).fill(null);

    function renderQuestions(){
      container.innerHTML = questions.map((q, qi) => `
        <div class="quiz-q" data-qi="${qi}">
          <p class="q-title">${qi+1}. ${q.q}</p>
          ${q.options.map((opt, oi) => `
            <div class="quiz-opt" data-oi="${oi}">${opt}</div>
          `).join("")}
        </div>
      `).join("") + `
        <button class="btn btn-primary" data-quiz-submit>Submit Quiz</button>
        <div class="quiz-result" data-quiz-result style="display:none"></div>
      `;

      container.querySelectorAll(".quiz-q").forEach(qEl => {
        const qi = parseInt(qEl.getAttribute("data-qi"), 10);
        qEl.querySelectorAll(".quiz-opt").forEach(optEl => {
          optEl.addEventListener("click", () => {
            qEl.querySelectorAll(".quiz-opt").forEach(o => o.classList.remove("selected"));
            optEl.classList.add("selected");
            answers[qi] = parseInt(optEl.getAttribute("data-oi"), 10);
          });
        });
      });

      container.querySelector("[data-quiz-submit]").addEventListener("click", () => {
        if(answers.includes(null)){
          alert("Jawab semua pertanyaan terlebih dahulu.");
          return;
        }
        let correct = 0;
        questions.forEach((q, qi) => {
          const qEl = container.querySelector(`.quiz-q[data-qi="${qi}"]`);
          qEl.querySelectorAll(".quiz-opt").forEach((optEl, oi) => {
            if(oi === q.correct) optEl.classList.add("correct");
            else if(oi === answers[qi] && oi !== q.correct) optEl.classList.add("wrong");
          });
          if(answers[qi] === q.correct) correct++;
        });
        const score = Math.round((correct/questions.length)*100);
        const passed = score >= (passScore || 70);
        const resultEl = container.querySelector("[data-quiz-result]");
        resultEl.style.display = "block";
        resultEl.className = "quiz-result " + (passed ? "pass" : "fail");
        resultEl.innerHTML = `
          <div class="score">${score}%</div>
          <p>${passed ? "Passed ✓ — kerja bagus." : "Belum lulus — coba tinjau kembali materi."}</p>
          <button class="btn btn-outline btn-sm" data-quiz-retry>Try Again</button>
        `;
        container.querySelector("[data-quiz-submit]").style.display = "none";
        if(window.ComProgress){
          window.ComProgress.set(moduleId, { quiz: passed, quizScore: score });
        }
        resultEl.querySelector("[data-quiz-retry]").addEventListener("click", () => {
          answers = new Array(questions.length).fill(null);
          renderQuestions();
        });
      });
    }
    renderQuestions();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-quiz]").forEach(container => {
      const moduleId = container.getAttribute("data-quiz");
      const dataEl = document.querySelector(`script[data-quiz-data="${moduleId}"]`);
      if(!dataEl) return;
      try{
        const payload = JSON.parse(dataEl.textContent);
        renderQuiz(container, moduleId, payload.questions, payload.passScore);
      }catch(e){ console.error("Quiz data error", e); }
    });
  });
})();
