document.addEventListener("DOMContentLoaded", function () {
  const videoContainers = document.querySelectorAll(".video-container");

  videoContainers.forEach((container) => {
    const video = container.querySelector("video");
    const playButton = container.querySelector(".play-button");

    if (video && playButton) {
      const togglePlay = () => {
        if (video.paused || video.ended) {
          video.play();
        } else {
          video.pause();
        }
      };

      container.addEventListener("click", togglePlay);

      video.addEventListener("play", () => container.classList.add("playing"));
      video.addEventListener("pause", () =>
        container.classList.remove("playing")
      );
      video.addEventListener("ended", () =>
        container.classList.remove("playing")
      );
    }
  });
});
