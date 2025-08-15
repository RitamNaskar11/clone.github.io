

let audio = new Audio();


function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Add leading zeros if needed
    if (minutes < 10) minutes = "0" + minutes;
    if (secs < 10) secs = "0" + secs;

    return `${minutes}:${secs}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    console.log(response);


    let div = document.createElement("div");
    div.innerHTML = response;

    let links = div.getElementsByTagName("a"); // Get anchor tags
    let songs = [];

    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;

}
function playMusic(trackName, pause = false) {
    let songPath = "/songs/" + (trackName.trim());

    // set the audio player to use the song
    audio.src = songPath

    // then try to play the song
    if (!pause)
        audio.play().then(() => {
            play.src = "pause.svg"

        }).catch(err => console.log("Play blocked:", err));


    document.querySelector(".song-Info").innerHTML = decodeURI(trackName)
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}

async function main() {



    // get the list of all the song
    let songs = await getSongs()
    console.log(songs);
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>  
                            <img class="invert" src="music.svg" alt="">
                            <div class="song-details">
                                <div> ${song.replaceAll("%20", " ")} </div>
                                <div>Spotify</div>
                            </div>
                            <img class="invert" src="play.svg" alt=""></li>`
    }


    // Attach the add listener to each song

    Array.from(document.querySelectorAll(".songList ul li")).forEach(e => {
        e.addEventListener("click", () => {
            let trackName = (e.querySelector(".song-details").firstElementChild.textContent.trim());
            playMusic(trackName)
        })

    })
    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play()
            play.src = "pause.svg"
        }
        else {
            audio.pause()
            play.src = "play.svg"
        }
    })

    //  time update for playing song

    audio.addEventListener("timeupdate", () => {
        let current = formatTime(audio.currentTime);
        let total = formatTime(audio.duration);

        document.querySelector(".songTime").innerHTML = `${current} / ${total}`;
        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        audio.currentTime = ((audio.duration) * percent) / 100;
    })

    // Add an event listener for hamburger 
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })
}
main()

