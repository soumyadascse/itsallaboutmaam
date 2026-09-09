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
/* =========================================
   LOVE GAME
========================================= */

const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");
const yesMessage = document.getElementById("yesMessage");

if (noButton) {

    function moveNoButton() {

        const game = document.querySelector(".love-game");

        const gameRect = game.getBoundingClientRect();
        const buttonRect = noButton.getBoundingClientRect();

        const maxX =
            gameRect.width - buttonRect.width - 30;

        const maxY = 130;

        const randomX =
            Math.random() * Math.max(maxX, 50);

        const randomY =
            Math.random() * maxY;

        noButton.style.position = "absolute";

        noButton.style.left =
            Math.max(10, randomX) + "px";

        noButton.style.top =
            randomY + "px";
    }


    /* Desktop */

    noButton.addEventListener(
        "mouseenter",
        moveNoButton
    );


    /* Mobile */

    noButton.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            moveNoButton();

        },
        { passive: false }
    );


    /* Extra protection */

    noButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            moveNoButton();

        }
    );

}


/* YES BUTTON */

if (yesButton) {

    yesButton.addEventListener(
        "click",
        function() {

            yesMessage.style.display = "block";

            yesButton.innerHTML =
                "❤️ I LOVE YOU TOO ❤️";

            createHeart();

        }
    );

}

/* =========================================
   SECRET PAGE
========================================= */

function checkSecret(answer) {

    const result = document.getElementById("secretResult");
    const letter = document.getElementById("secretLetter");

    if (!result || !letter) {
        return;
    }

    if (answer === "heart") {

        result.innerHTML =
            "❤️ Correct. You know me too well.";

        result.className = "correct-answer";

        letter.style.display = "block";

        for (let i = 0; i < 8; i++) {
            setTimeout(createHeart, i * 150);
        }

    } else {

        result.innerHTML =
            "Hmm... try again, Sharmila 😏❤️";

        result.className = "wrong-answer";

    }
}
