const heartsContainer = document.querySelector(".hearts");

function createHeart() {
    const heart = document.createElement("div");

    heart.classList.add("floating-heart");

    heart.innerHTML = "♥";

    heart.style.left = Math.random() * 100 + "vw";

    heart.style.fontSize =
        (12 + Math.random() * 20) + "px";

    heart.style.animationDuration =
        (4 + Math.random() * 4) + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 8000);
}

setInterval(createHeart, 700);
