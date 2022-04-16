const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon =playBtn.querySelector("i")
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume")
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreen");
const fullscreenBtnIcon = fullscreenBtn.querySelector("i");
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
    playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = () => {
    if (video.muted){
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : video.volume;
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    video.volume = value;
    if( value === "0"){
        video.muted = false;
        muteBtnIcon.className = "fas fa-volume-up";
    }
    if(!video.muted) {
        video.muted = true;
        muteBtnIcon.className = "fas fa-volume-mute";
    } else { 
        video.muted = false;
        muteBtnIcon.className = "fas fa-volume-up";
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
        fullscreenBtnIcon.classList = "fas fa-expand";
        
    } else{
        videoContainer.requestFullscreen();
        fullscreenBtnIcon.classList = "fas fa-compress";
    }
};

const hideControls = () => videoControls.classList.remove("showing");

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

const handleMouseLeave = () =>{
    controlsTimeout = setTimeout(hideControls, 3000)
}
const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method:"POST",
    });
};

const handlefullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("canplay", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullscreenBtn.addEventListener("click", handleFullscreen);
window.addEventListener("keydown", function (event) {
    if (event.code === "Escape" || event.code === "KeyF") {
      handlefullscreen();
    }
    if (event.code === "Space"){
        handlePlayClick();
    }
  });