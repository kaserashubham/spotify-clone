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

async function main() {
  let songs = await getSongList();
  console.log(songs[0]);
  let audio = new Audio(songs[0]);
  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration);
    audio.muted = "true";
    console.log(audio.muted);
    // audio.autoplay;
    audio.play();
  });
}

main();
// console.log(getSongList());
