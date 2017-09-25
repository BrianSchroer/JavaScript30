const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('#fullscreenButton');

function togglePlay() {
  video[video.paused ? 'play' : 'pause']();
}

function toggleFullscreen() {
  if (document.webkitIsFullScreen) {
    document.webkitExitFullscreen();
  } else {
    player.webkitRequestFullscreen();
  }
}

function handleFullScreenChange() {
  console.log(document.webkitIsFullScreen);
}

function updateToggleIcon() {
  toggle.textContent = this.paused ? '►' : '❚❚';
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value; // (range names are "volume" and "playbackRate")
}

function updateProgressBar() {
  const percent = video.currentTime / video.duration * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const newPercentComplete = e.offsetX / progress.offsetWidth;
  const scrubTime = newPercentComplete * video.duration;
  video.currentTime = scrubTime;
}

toggle.addEventListener('click', togglePlay);

document.addEventListener('onwebkitfullscreenchange', handleFullScreenChange);
fullscreen.addEventListener('click', toggleFullscreen);

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateToggleIcon);
video.addEventListener('pause', updateToggleIcon);
video.addEventListener('timeupdate', updateProgressBar);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));

let mouseDown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousedown', () => (mouseDown = true));
progress.addEventListener('mouseup', () => (mouseDown = false));
progress.addEventListener('mousemove', e => mouseDown && scrub(e));
