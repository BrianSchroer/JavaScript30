const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snapAudio = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      alert('Video initialization error: ' + err);
      console.log('VIDEO ERROR', err);
    });
}

function paintToCanvas() {
  const { videoWidth, videoHeight } = video;
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    let pixels = ctx.getImageData(0, 0, videoWidth, videoHeight);

    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 50);
}

function takePhoto() {
  snapAudio.currentTime = 0;
  snapAudio.play();

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/jpeg');
  a.setAttribute('download', 'handsome');
  a.innerHTML = `<img src="${a.href}" alt="Handsome person" />`;

  strip.insertBefore(a, strip.firstChild);
}

function redEffect(pixels) {
  const data = pixels.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = data[i + 0] + 200; // RED
    data[i + 1] = data[i + 1] - 50; // GREEN
    data[i + 2] = data[i + 2] * 0.5; // Blue
  }

  return pixels;
}

function rgbSplit(pixels) {
  const data = pixels.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i - 150] = data[i + 0]; // RED
    data[i + 500] = data[i + 1]; // GREEN
    data[i - 550] = data[i + 2]; // Blue
  }

  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });

  const data = pixels.data;

  for (i = 0; i < data.length; i = i + 4) {
    red = data[i + 0];
    green = data[i + 1];
    blue = data[i + 2];
    alpha = data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
