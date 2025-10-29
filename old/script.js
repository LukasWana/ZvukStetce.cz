onload = (event) => {
    let email = document.getElementById("mailto");
    const video = document.getElementById("bg-video");

    create_email(email, "petra@zvukstetce.cz", "mailto:petra@zvukstetce.cz");
    addListener(video);
};

function create_email(email, text, href) {
    console.log("email created");
    email.innerText = text;
    email.setAttribute("href", href)
}

function addListener(element) {
    element.addEventListener("timeupdate", function () {
        slide_video(element)
    });
}

function slide_video(video) {
    if (video.currentTime.toFixed(2) > 9.0) {
        video.setAttribute("class", "slide")
    }
    if (video.currentTime.toFixed(2) == 0.0) {
        video.setAttribute("class", "slide_back")
    }
    //console.log(`Video Time: ${video.currentTime.toFixed(2)}s`);
}