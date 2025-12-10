const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const title = document.querySelector(".song-title");
const artist = document.querySelector(".song-artist");

const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");

const volume = document.getElementById("volume");
const playlistUI = document.getElementById("playlist");

let songs = [
  { title: "aika mandali katha sangto mumbaichya rajachi", artist: "Gurudas Kadam", src: "Songs/Song1.mp3" },
  { title: "lalbaugcha raja", artist: "Dhruvan Moorthy | Sneha Mahadik", src: "Songs/Song2.mp3" },
  { title: "Chintamani", artist: "Dhruvan Moorthy | Sneha Mahadik", src: "Songs/Song3.mp3" }
];

let index = 0;

/* Load Song */
function loadSong(i) {
  audio.src = songs[i].src;
  title.textContent = songs[i].title;
  artist.textContent = songs[i].artist;
  highlightSong(i);
}
loadSong(index);

/* Play / Pause */
playBtn.addEventListener("click", () => {
  audio.play().then(() => {
    playBtn.textContent = "⏸";
  }).catch(err => {
    console.error("Playback error:", err);
  });

  if (!audio.paused) {
    audio.pause();
    playBtn.textContent = "▶";
  }
});

/* Next/Prev */
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

function nextSong() {
  index = (index + 1) % songs.length;
  loadSong(index);
  audio.play();
  playBtn.textContent = "⏸";
}

function prevSong() {
  index = (index - 1 + songs.length) % songs.length;
  loadSong(index);
  audio.play();
  playBtn.textContent = "⏸";
}

/* Show duration once metadata loads */
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(Math.floor(audio.duration));
});

/* Progress Bar Update */
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(Math.floor(audio.currentTime));
  }
});

/* Click Progress Bar */
progress.addEventListener("change", () => {
  audio.currentTime = (progress.value * audio.duration) / 100;
});

/* Volume with persistence */
volume.addEventListener("input", () => {
  audio.volume = volume.value;
  localStorage.setItem("playerVolume", volume.value);
});

window.addEventListener("load", () => {
  const savedVol = localStorage.getItem("playerVolume");
  if (savedVol !== null) {
    volume.value = savedVol;
    audio.volume = savedVol;
  }
});

/* Format Time */
function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/* Playlist UI */
songs.forEach((song, i) => {
  let li = document.createElement("li");
  li.textContent = `${song.title} — ${song.artist}`;
  li.addEventListener("click", () => {
    index = i;
    loadSong(i);
    audio.play();
    playBtn.textContent = "⏸";
  });
  playlistUI.appendChild(li);
});

/* Highlight played song */
function highlightSong(i) {
  [...playlistUI.children].forEach(li => li.classList.remove("playing"));
  playlistUI.children[i].classList.add("playing");
}

/* Auto-play next song when one ends */
audio.addEventListener("ended", nextSong);

/* Keyboard shortcuts */
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    playBtn.click();
  } else if (e.code === "ArrowRight") {
    nextSong();
  } else if (e.code === "ArrowLeft") {
    prevSong();
  }
});
