console.log("spotify app");

// global variable
let playpausebtn = document.querySelector("#play-pause");
let audio = new Audio();
let folder = "Heeramandi";
// let folder = "Pushpa";
let songsURL = `http://127.0.0.1:5500/songs`;
let songs;
let volPerc = 100;

// let isMusicPlaying = false;
async function getAllFolderList() {
  console.log("getting folder list");
  let folderList = [];
  let response = await fetch(songsURL);
  // console.log(response);
  response = await response.text();
  // console.log("folder data:", response);
  let div = document.createElement("div");
  div.innerHTML = response;
  // console.log(div);
  // console.log(div.querySelectorAll("li a")[1].href);
  let as = div.querySelectorAll("li a");
  for (const element of as) {
    if (!element.href.endsWith("/")) {
      let folderName = element.href;
      folderName = folderName.replace(songsURL + "/", "");
      folderList.push(folderName);
      console.log(folderName);
    }
  }
  console.log(folderList);
  return folderList;
}
async function getSongList(folder) {
  // let response = await fetch("http://localhost:5500/songs/");
  let response = await fetch(songsURL + `/${folder}/`);
  // console.log(response);
  // console.log(songsURL + `/${folder}/`);
  response = await response.text();
  // console.log(response);
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

  // console.log(songs);
  return songs;
}

function updateSongList(songs) {
  for (let element of songs) {
    let songName = element.split(".mp3");

    songName[0] = songName[0].replace(songsURL + `/${folder}/`, "");
    console.log("list of songs is :", songName[0]);
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

  audio.src = `/songs/${folder}/` + track + ".mp3";
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
    // console.log("play-pause button clicked");
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

      songName[0] = songName[0].replace(songsURL + `/${folder}/`, "");
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
    document.querySelector(
      ".seekbar .circle"
    ).style.left = `${seekbarPercent}%`;
  });
}

function useSeekBar() {
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.offsetX, e.target.getBoundingClientRect().width);
    let seekbarPercent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(
      ".seekbar .circle"
    ).style.left = `${seekbarPercent}%`;
    audio.currentTime =
      (e.offsetX / e.target.getBoundingClientRect().width) * audio.duration;
  });
}

function updateVolIcon(perc) {
  let volIcon;
  if (perc > 80 && perc <= 100) {
    volIcon = "/images/volume-max.svg";
  } else if (perc > 0) {
    volIcon = "/images/volume.svg";
  } else if (perc === 0) {
    volIcon = "/images/volume-min.svg";
  }
  document.querySelector(".volume-container img").src = volIcon;
  if (perc === 0) {
    audio.muted = true;
  } else {
    audio.volume = volPerc / 100;
    audio.muted = false;
  }
}
function volumeSeekHandler() {
  // document.querySelector(".vol-seek").addEventListener("click", (e) => {
  //   if (e.target.className === "vol-seek") {
  //     volPerc = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  //     console.log(volPerc);
  //     updateVolIcon(volPerc);
  //     document.querySelector(".vol-seek .circle").style.left = `${volPerc}%`;
  //     audio.volume = volPerc / 100;
  //   }
  // });

  // update the volume icon according to percent
  // set default value of volume
  updateVolIcon(volPerc);
  document.querySelector(".vol-slider").addEventListener("input", (event) => {
    // console.log("range value:", event.target.value);
    volPerc = event.target.value;
    updateVolIcon(volPerc);
  });

  document
    .querySelector(".volume-container img")
    .addEventListener("click", (e) => {
      if (audio.muted) {
        updateVolIcon(volPerc);
        document.querySelector(".vol-slider").style.accentColor = "#1fdf64";
      } else {
        updateVolIcon(0);
        document.querySelector(".vol-slider").style.accentColor = "#999999";
      }
    });
}

function updateCards(folders) {
  for (const element of folders) {
    console.log("folder name", element);
    let albumArt = `${songsURL}/${element}/cover.jpg`;
    document.querySelector(".card-container").innerHTML += `<div class="card">
                <div class="play">
                  <svg
                    fill="#000000"
                    width="16px"
                    height="16px"
                    viewBox="0 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>play</title>
                      <path
                        d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z"
                      ></path>
                    </g>
                  </svg>
                </div>
                <img
                  src="${albumArt}"
                  alt=""
                />
                <h2 class='album-name'>${element}</h2>
                <p></p>
              </div>`;
  }
}
function clearSongList() {
  let songlistUL = document.querySelector(".song-list").querySelector("ul");
  // let songLIstLI = document.createElement("li");
  songlistUL.innerHTML = "";
}
async function songListHandler(folder) {
  // console.log("selected folder:", folder);
  clearSongList();
  songs = await getSongList(folder);
  // console.log(songs);
  updateSongList(songs);
  // set first song of the list as source
  // audio.src = songs[0];
  let songName = songs[0].split(".mp3");
  // console.log("list of songs is :", songName[0]);

  songName[0] = songName[0].replace(songsURL + `/${folder}/`, "");
  songName[0] = songName[0].replaceAll("%20", " ");
  playMusic(songName[0], true);
  let currentSong = document.querySelectorAll(".song-list li");
  // console.log(currentSong);
  currentSong.forEach((element) => {
    // console.log(element);
    // element.querySelector("#playSong")
    element
      .querySelector(".song-info-container")
      .addEventListener("click", (event) => {
        // console.log("play button clicked");

        // console.log(element.querySelector(".songName").innerText);
        playMusic(element.querySelector(".songName").innerText);
      });
  });
}

function songController() {
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
      songName[0] = songName[0].replace(songsURL + `/${folder}/`, "");
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
      songName[0] = songName[0].replace(songsURL + `/${folder}/`, "");
      songName[0] = songName[0].replaceAll("%20", " ");
      playMusic(songName[0]);
    }
  });

  // console.log(playpausebtn.src);
  pauseMusic();

  // listen for time update event
  updateSeekBar();

  // add functionality to use seekbar
  useSeekBar();
}

function sideBarController() {
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0%";
  });

  document.querySelector(".home .close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-120%";
  });
}
function stopMusic() {
  audio.currentTime = 0;
  playpausebtn.src = "/images/play-button.svg";
}
function albumControler() {
  let allCards = document.querySelectorAll(".card ");

  for (const element of allCards) {
    element.addEventListener("click", (e) => {
      let folderName = element.querySelector(".album-name").innerHTML;
      folder = folderName;
      stopMusic();
      songListHandler(folderName);
    });
  }
}
async function main() {
  // folder = "Heeramandi";

  // folder = "Pushpa";

  // getAllFolderList
  let allFolder = await getAllFolderList();
  // setting the first folder as default
  folder = allFolder[0];
  // Add cards using folder list
  updateCards(allFolder);
  // console.log(folder);

  songListHandler(folder);

  albumControler();

  // add functions for hamburger
  sideBarController();

  // adding event on prev and next
  songController();

  // adding eventlistener on volume seekbar
  volumeSeekHandler();

  //
}

main();
// console.log(getSongList());
