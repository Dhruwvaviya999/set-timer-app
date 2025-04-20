let timers = [];
let idCounter = 1;

const alarmBuzzer = new Audio("assets/timerEndsSound.wav"); // fixed spelling

// inputs
const inputHr = document.querySelector(".hours");
const inputMin = document.querySelector(".minutes");
const inputSec = document.querySelector(".seconds");

const setTimerBtn = document.getElementById("setTimerBtn");
const timersContainer = document.querySelector(".timers-container");

// ✅ function to format time
function formatTime(h, m, s) {
  return (
    String(h).padStart(2, "0") +
    " : " +
    String(m).padStart(2, "0") +
    " : " +
    String(s).padStart(2, "0")
  );
}

// ✅ new function: render one timer only
function renderSingleTimer(timer) {
  const timerDiv = document.createElement("div");
  timerDiv.className = "timer";
  timerDiv.id = `timer-${timer.id}`;

  timerDiv.innerHTML = `
    <p>Time Left :</p>
    <div class="time-display">${formatTime(timer.hour, timer.minute, timer.second)}</div>
    <button onclick="deleteBtn(${timer.id})">Delete</button>
  `;

  timersContainer.appendChild(timerDiv);
}

// ✅ start countdown logic
function startCountdown(timer) {
  const timerDiv = document.getElementById(`timer-${timer.id}`);

  timer.interval = setInterval(() => {
    if (timer.hour === 0 && timer.minute === 0 && timer.second === 0) {
      clearInterval(timer.interval);

      timerDiv.style.fontSize = "35px";
      timerDiv.style.fontWeight = "600";
      timerDiv.style.color = "#34344A";
      timerDiv.style.backgroundColor = "#F0F757";
      timerDiv.innerHTML = "Timer Is Up!";

      const stopTimer = document.createElement("button");
      stopTimer.id = "stopTimer";
      stopTimer.textContent = "Stop";
      stopTimer.addEventListener("click", () => handleStopTimer(timer.id));
      timerDiv.appendChild(stopTimer);

      alarmBuzzer.currentTime = 0;
      alarmBuzzer.play();
      return;
    }

    // decrease time
    if (timer.second > 0) {
      timer.second--;
    } else {
      if (timer.minute > 0) {
        timer.minute--;
        timer.second = 59;
      } else {
        if (timer.hour > 0) {
          timer.hour--;
          timer.minute = 59;
          timer.second = 59;
        }
      }
    }

    // update the time display
    const timeDisplay = timerDiv.querySelector(".time-display");
    if (timeDisplay) {
      timeDisplay.textContent = formatTime(timer.hour, timer.minute, timer.second);
    }
  }, 1000);
}

// ✅ when "Set Timer" is clicked
setTimerBtn.addEventListener("click", () => {
  const hr = Number(inputHr.value) || 0;
  const min = Number(inputMin.value) || 0;
  const sec = Number(inputSec.value) || 0;

  if (hr === 0 && min === 0 && sec === 0) return;

  const newTimer = {
    id: idCounter++,
    hour: hr,
    minute: min,
    second: sec,
    interval: null,
  };

  timers.push(newTimer);
  renderSingleTimer(newTimer); // ✅ only render new timer
  startCountdown(newTimer);

  inputHr.value = "";
  inputMin.value = "";
  inputSec.value = "";
});

// ✅ delete a timer
function deleteBtn(id) {
  const timerToDelete = timers.find((timer) => timer.id === id);
  if (timerToDelete && timerToDelete.interval) {
    clearInterval(timerToDelete.interval);
  }

  timers = timers.filter((timer) => timer.id !== id);

  const timerDiv = document.getElementById(`timer-${id}`);
  if (timerDiv) {
    timerDiv.remove();
  }

  // if no timers left
  if (timers.length === 0) {
    timersContainer.innerHTML = `<p style="font-size: 20px; margin-top: 10px; text-align: center;">You have no timers currently!</p>`;
  }
}

// ✅ stop alarm and delete timer
function handleStopTimer(id) {
  alarmBuzzer.pause();
  alarmBuzzer.currentTime = 0;
  deleteBtn(id);
}
