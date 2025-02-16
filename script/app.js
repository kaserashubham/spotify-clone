console.log("spotify app");

async function getSongList() {
  let response = await fetch("http://localhost:5500/songs/");
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
    element = element.replace("http://127.0.0.1:5500/songs/", "");
    element = element.replaceAll("%20", " ");
    let songName = element.split(".mp3");
    // console.log("list of songs is :", songName[0]);
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
async function main() {
  let songs = await getSongList();
  console.log(songs[0]);
  updateSongList(songs);

  let currentSong = document.querySelectorAll(".song-list li");
  // console.log(currentSong);

  currentSong.forEach((element) => {
    // console.log(element);
    element.querySelector("#playSong").addEventListener("click", (event) => {
      // console.log("play button clicked");

      console.log(element.querySelector(".songName").innerText);
    });
  });
  // console.log(currentSong[0].querySelector("#playSong"));

  // let audio = new Audio(songs[0]);
  // audio.addEventListener("loadeddata", () => {
  //   console.log(audio.duration);
  //   audio.muted = "true";
  //   console.log(audio.muted);
  //   // audio.autoplay;
  //   audio.play();
  // });
}

main();
// console.log(getSongList());
