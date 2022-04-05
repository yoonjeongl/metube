const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume")
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    // if the video is playing, pause it
    if(video.paused) {
        video.play();
    } else{
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMuteClick = () => {
    if (video.muted){
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : video.volume;
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    video.volume = value;
    if( value === "0"){
        video.muted = true;
        muteBtn.innerText = "Unmute";
    }
    if(!video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    } else { 
        video.muted = true;
        muteBtn.innerText = "Unmute";
    }
};
let a = 0;
const formatTime = (seconds) => {
    a = new Date( seconds * 1000 ).toISOString().substring(14, 19);
    return a;
}

const handleLoadedMetadata = () =>{
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const {
        target: { value },
    } = event;
    video.currentTime = value;
};

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullscreenBtn.innerText = "Enter Full Screen";
        
    } else{
        videoContainer.requestFullscreen();
        fullscreenBtn.innerText = "Exit Full Screen";    
    }
};

const hideControls = videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
        }
    videoControls.classList.add("showing");
    controlsTimeout = setTimeout(() => {
    videoControls.classList.remove("showing");
    }, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullscreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("mousemove", handleMouseMove);