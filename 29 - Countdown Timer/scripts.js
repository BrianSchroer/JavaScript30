let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = Array.from(document.querySelectorAll('[data-time]'));

function timer(seconds) {
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndingTime(new Date(then));

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      return clearInterval(countdown);
    }

    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const stringBuilder = [];
  let unitCalculator = { remaining: seconds, value: 0 };
  const remaining = { seconds };

  const hours = calculateUnits(remaining, 3600);
  const hasHours = hours > 0;
  if (hasHours) {
    stringBuilder.push(hours);
  }

  const minutes = calculateUnits(remaining, 60);
  if (hasHours || minutes > 0) {
    stringBuilder.push(formatUnits(minutes, /*zeroPrefix=*/ hasHours));
  } else {
    stringBuilder.push('');
  }

  stringBuilder.push(formatUnits(remaining.seconds));

  const display = stringBuilder.join(':');
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndingTime(endingTime) {
  const hours = endingTime.getHours();
  const displayHours = hours > 12 ? hours - 12 : hours;

  const minutes = formatUnits(endingTime.getMinutes());

  endTime.textContent = `Be back at ${displayHours}:${minutes}`;
}

function calculateUnits(remaining, divisor) {
  const { seconds } = remaining;
  const units = Math.floor(seconds / divisor);
  remaining.seconds = seconds % divisor;
  return units;
}

function formatUnits(units, zeroPrefix = true) {
  return zeroPrefix && units < 10 ? `0${units}` : units;
}

function handleButtonClick() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

function handleFormSubmit(e, callback) {
  e.preventDefault();
  callback();
  this.reset();
}

buttons.forEach(button => button.addEventListener('click', handleButtonClick));

document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = parseFloat(this.minutes.value);

  if (isNaN(mins)) {
    alert(`"${this.minutes.value}" is not a number!`);
  } else {
    timer(mins * 60);
  }

  this.reset();
});
