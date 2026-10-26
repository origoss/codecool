// Codecool secrets & security session: shared lesson behaviour (quiz widget + copy buttons). No build step, no storage.
//
// Quiz markup:
//   <fieldset class="quiz-q" data-answer="2">            <!-- 0-based index of the right option -->
//     <legend><span class="kind">Predict the output</span>Question text</legend>
//     <button class="opt" data-why="Why this is wrong/right">Option text</button> ...
//     <div class="why" aria-live="polite"></div>
//   </fieldset>
//   <p class="quiz-score"></p>                            <!-- optional, filled in automatically -->
//
// Wrong picks are disabled with their explanation shown, so the student retries until right.
// The score counts only first-try answers: that is the honest retrieval measure.

document.addEventListener("DOMContentLoaded", () => {
  const questions = [...document.querySelectorAll(".quiz-q")];
  const score = document.querySelector(".quiz-score");
  let answered = 0, firstTry = 0;

  const updateScore = () => {
    if (score && answered === questions.length) {
      score.textContent = `First-try score: ${firstTry} / ${questions.length}. ` +
        (firstTry === questions.length ? "Solid." : "Come back tomorrow and try the misses again from memory.");
    }
  };

  questions.forEach((q) => {
    const answer = Number(q.dataset.answer);
    const opts = [...q.querySelectorAll("button.opt")];
    const why = q.querySelector(".why");
    let tries = 0;
    opts.forEach((btn, i) => {
      btn.type = "button";
      btn.addEventListener("click", () => {
        tries++;
        why.textContent = btn.dataset.why || "";
        if (i === answer) {
          btn.classList.add("right");
          why.className = "why right";
          opts.forEach((b) => (b.disabled = true));
          answered++;
          if (tries === 1) firstTry++;
          updateScore();
        } else {
          btn.classList.add("wrong");
          btn.disabled = true;
          why.className = "why wrong";
        }
      });
    });
  });

  document.querySelectorAll("pre").forEach((pre) => {
    const b = document.createElement("button");
    b.className = "copy";
    b.textContent = "copy";
    b.addEventListener("click", () => {
      const clone = pre.cloneNode(true);
      clone.querySelector(".copy").remove();
      navigator.clipboard?.writeText(clone.textContent.trim()).then(() => {
        b.textContent = "copied";
        setTimeout(() => (b.textContent = "copy"), 1200);
      });
    });
    pre.appendChild(b);
  });
});
