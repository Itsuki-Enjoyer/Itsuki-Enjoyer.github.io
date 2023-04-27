const form = document.getElementById("search-form");
const lyricsDiv = document.getElementById("lyrics");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const songTitle = document.getElementById("song").value;
  const artistName = document.getElementById("artist").value;
  searchLyrics(songTitle, artistName);
});

async function searchLyrics(songTitle, artistName) {
  const API_KEY = "xJVGGPEDWU5edsPMFbb89zdmP2usfoO7XKjpM8sQT-fm9XhK-w7aeGsfE2JNQ7mp";
  const response = await fetch(`https://api.genius.com/search?q=${songTitle} ${artistName}`, {
    headers: {
      "Authorization": `Bearer ${API_KEY}`
    }
  });
  const data = await response.json();
  const songId = data.response.hits[0].result.id;
  getLyrics(songId);
}

async function getLyrics(songId) {
  const API_KEY = "xJVGGPEDWU5edsPMFbb89zdmP2usfoO7XKjpM8sQT-fm9XhK-w7aeGsfE2JNQ7mp";
  const response = await fetch(`https://api.genius.com/songs/${songId}`, {
    headers: {
      "Authorization": `Bearer ${API_KEY}`
    }
  });
  const data = await response.json();
  const lyrics = data.response.song.lyrics;
  lyricsDiv.innerText = lyrics;
}
