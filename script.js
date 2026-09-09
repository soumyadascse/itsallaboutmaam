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

/* =========================================
   OUR JOURNEY MEMORIES
========================================= */

const memories = {

    hand: {
        icon: "🤝",
        title: "The First Time I Held Your Hand",
        text:
            "I still remember that feeling. " +
            "It was such a simple thing, but holding your hand " +
            "for the first time made that moment unforgettable."
    },

    hug: {
        icon: "🤗",
        title: "Our First Hug",
        text:
            "For those few moments, everything else disappeared. " +
            "It felt like being close to you was exactly where " +
            "I was supposed to be."
    },

    kiss: {
        icon: "💋",
        title: "Our First Kiss",
        text:
            "Some memories don't need many words. " +
            "This is one of those moments I will always carry " +
            "with me."
    },

    office: {
        icon: "🏢",
        title: "Our Office Journeys",
        text:
            "Going to office with you every day and returning " +
            "home with you made even the most ordinary routine " +
            "feel special."
    },

    hands: {
        icon: "❤️",
        title: "Your Hands In Mine",
        text:
            "I love the way you hold my hands. " +
            "There is something about that little moment " +
            "that makes me feel close to you."
    }

};


function showMemory(memoryName) {

    const memory = memories[memoryName];

    if (!memory) {
        return;
    }

    const modal =
        document.getElementById("memoryModal");

    const icon =
        document.getElementById("memoryIcon");

    const title =
        document.getElementById("memoryTitle");

    const text =
        document.getElementById("memoryText");

    icon.innerHTML = memory.icon;

    title.innerHTML = memory.title;

    text.innerHTML = memory.text;

    modal.style.display = "flex";

    document.body.style.overflow = "hidden";
}


function closeMemory() {

    const modal =
        document.getElementById("memoryModal");

    modal.style.display = "none";

    document.body.style.overflow = "";
}


/* Close when clicking outside */

const memoryModal =
    document.getElementById("memoryModal");

if (memoryModal) {

    memoryModal.addEventListener(
        "click",
        function(event) {

            if (event.target === memoryModal) {
                closeMemory();
            }

        }
    );

}
