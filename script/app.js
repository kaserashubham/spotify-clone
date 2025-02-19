console.log("spotify app");

// global variable
let playpausebtn = document.querySelector("#play-pause");
let audio = new Audio();
let songsURL = "http://192.168.29.45:5500/songs/";
let songs;
// let isMusicPlaying = false;

async function getSongList() {
  // let response = await fetch("http://localhost:5500/songs/");
  let response = await fetch(songsURL);
  //   console.log(response);
  response = await response.text();
  //   console.log(songs);
  let div = document.createElement("div");
  div.innerHTML = response;
  //   console.log(div.querySelectorAll("a"));
  let as = div.querySelectorAll("a");
  let songs = [];
  for (const element of as) {
    if (element.href.endsWith(".mp3")) {
      //   console.log(element.href);
      songs.push(element.href);
    }
  }

  //   console.log(songs);
  return songs;
}

function updateSongList(songs) {
  for (let element of songs) {
    let songName = element.split(".mp3");
    // console.log("list of songs is :", songName[0]);

    songName[0] = songName[0].replace(songsURL, "");
    songName[0] = songName[0].replaceAll("%20", " ");

    let songlistUL = document.querySelector(".song-list").querySelector("ul");
    // let songLIstLI = document.createElement("li");
    songlistUL.innerHTML += `<li>
                <div class="song-info-container flex">
                  <img src="images/music.svg" class="invert" alt="" />
                  <div class="songInfo">
                    <div class="songName">${songName[0]}</div>
                    <div>Song Artist</div>
                  </div>
                  <img src="images/play-button.svg" class="invert" id="playSong" alt="" />
                </div>
              </li>`;
    // songLIstLI.innerText = songName[0];
    // songlistUL.append(songLIstLI);
  }
}
function playMusic(track, pause = false) {
  // audio = new Audio("/songs/" + track + ".mp3");

  audio.src = "/songs/" + track + ".mp3";
  if (!pause) {
    //
    // audio.src = track;
    audio.play();
    // isMusicPlaying = true;
    playpausebtn.src = "/images/pause.svg";
  }

  document.querySelector(".song-name").innerText = track;
  document.querySelector(".artist-name").innerText = "Album Artist";
}

function pauseMusic() {
  playpausebtn.addEventListener("click", (e) => {
    console.log("play-pause button clicked");
    if (!audio.paused) {
      audio.pause();
      playpausebtn.src = "/images/play-button.svg";
      // isMusicPlaying = false;
    } else {
      audio.play();
      playpausebtn.src = "/images/pause.svg";
      // isMusicPlaying = true;
      let songName = audio.src.split(".mp3");
      // console.log("list of songs is :", songName[0]);

      songName[0] = songName[0].replace(songsURL, "");
      songName[0] = songName[0].replaceAll("%20", " ");
      document.querySelector(".song-name").innerText = songName[0];
      document.querySelector(".artist-name").innerText = "Album Artist";
    }
  });
}

function convertSecondsToMinutes(seconds) {
  let finalTime = "";
  seconds = Math.floor(seconds);
  // console.log("seonds:", seconds);
  finalTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60
  ).padStart(2, "0")}`;
  return finalTime;
}

function updateSeekBar() {
  audio.addEventListener("timeupdate", (e) => {
    // console.log("current Time : ", convertSecondsToMinutes(audio.currentTime));
    // console.log("duration : ", convertSecondsToMinutes(audio.duration));
    document.querySelector(".song-time").innerText = `${convertSecondsToMinutes(
      audio.currentTime
    )}/${convertSecondsToMinutes(audio.duration)}`;
    let seekbarPercent = (audio.currentTime / audio.duration) * 100;
    document.querySelector(".circle").style.left = `${seekbarPercent}%`;
  });
}

function useSeekBar() {
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    console.log(e.offsetX, e.target.getBoundingClientRect().width);
    let seekbarPercent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = `${seekbarPercent}%`;
    audio.currentTime =
      (e.offsetX / e.target.getBoundingClientRect().width) * audio.duration;
  });
}
async function main() {
  songs = await getSongList();
  console.log(songs[0]);
  updateSongList(songs);
  // set first song of the list as source
  // audio.src = songs[0];
  let songName = songs[0].split(".mp3");
  // console.log("list of songs is :", songName[0]);

  songName[0] = songName[0].replace(songsURL, "");
  songName[0] = songName[0].replaceAll("%20", " ");
  playMusic(songName[0], true);
  let currentSong = document.querySelectorAll(".song-list li");
  // console.log(currentSong);
  currentSong.forEach((element) => {
    console.log(element);
    // element.querySelector("#playSong")
    element
      .querySelector(".song-info-container")
      .addEventListener("click", (event) => {
        // console.log("play button clicked");

        console.log(element.querySelector(".songName").innerText);
        playMusic(element.querySelector(".songName").innerText);
      });
  });

  console.log(playpausebtn.src);
  pauseMusic();

  // listen for time update event
  updateSeekBar();

  // add functionality to use seekbar
  useSeekBar();
  // add functions for hamburger
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0%";
  });

  document.querySelector(".home .close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-120%";
  });

  // adding event on prev and next
  prev.addEventListener("click", (e) => {
    let i;
    for (i = 0; i < songs.length; i++) {
      if (audio.src === songs[i]) {
        break;
      }
    }
    if (i > 0) {
      // songName = songs[songs.length - 1].split(".mp3");
      songName = songs[i - 1].split(".mp3");
      songName[0] = songName[0].replace(songsURL, "");
      songName[0] = songName[0].replaceAll("%20", " ");
      playMusic(songName[0]);
    }
  });
  // adding event on prev and next
  next.addEventListener("click", (e) => {
    let i;
    for (i = 0; i < songs.length; i++) {
      if (audio.src === songs[i]) {
        break;
      }
    }
    if (i + 1 < songs.length) {
      // songName = songs[0].split(".mp3");
      songName = songs[i + 1].split(".mp3");
      songName[0] = songName[0].replace(songsURL, "");
      songName[0] = songName[0].replaceAll("%20", " ");
      playMusic(songName[0]);
    }
  });
}

main();
// console.log(getSongList());
