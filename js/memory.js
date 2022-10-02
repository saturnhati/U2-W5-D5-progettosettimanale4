let FIRSTCARD;
let SECONDCARD;
let CARDS = document.querySelectorAll('.memory-card');
let GAMEBOARD = document.querySelector('.game')
let timer = document.getElementById('timer')
let interval;
let gameStarted = false

function startTimer() {
    let s = 0,
        m = 0
    interval = setInterval(function () {
        timer.innerHTML = "Time: " + m + " min " + s + " sec";
        s++;
        if (s == 60) {
            m++;
            s = 0;
        }
        if (m == 60) {
            m = 0;
        }
    }, 1000);
}

const shuffle = () => {
    const clonedCARDS = [...CARDS]

    for (let index = clonedCARDS.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedCARDS[index]

        clonedCARDS[index] = clonedCARDS[randomIndex]
        clonedCARDS[randomIndex] = original
    }
    return clonedCARDS
}

function restartGame() {
    let clonedCARDS = shuffle()
    gameStarted = false
    GAMEBOARD.innerHTML = ''
    for (let i = 0; i < clonedCARDS.length; i++) {
        GAMEBOARD.appendChild(clonedCARDS[i])
        clonedCARDS[i].classList.remove("flipped")
        clonedCARDS[i].classList.remove("matched")
    }
    clearInterval(interval)
    timer.innerHTML = ''
}

document.getElementById('modal-button').addEventListener('click', () => {
    restartGame()
    document.getElementById('modal').classList.add('invisible')
})

const flip = userClick => {
    userClick.target.classList.add('flipped');
    if (gameStarted == false) {
        gameStarted = true
        startTimer()
    }
    if (FIRSTCARD === undefined) {
        FIRSTCARD = userClick.target;
    }
    else {
        SECONDCARD = userClick.target;
        for (let i = 0; i < CARDS.length; i++) {
            CARDS[i].removeAttribute("onclick");
        }
        setTimeout(function () {
            let areMatched = checkCards();
            if (areMatched) {
                FIRSTCARD.classList.replace("flipped", "matched");
                SECONDCARD.classList.replace("flipped", "matched");
            }
            else {
                FIRSTCARD.classList.remove("flipped");
                SECONDCARD.classList.remove("flipped");
            }
            FIRSTCARD = undefined;
            SECONDCARD = undefined;
            if (document.querySelectorAll('.matched').length === 16) {
                clearInterval(interval)
                document.getElementById('modal').classList.remove('invisible')
                document.getElementById('total-time').innerHTML = timer.innerHTML
            }
        }, 500)
        for (let i = 0; i < CARDS.length; i++) {
            CARDS[i].setAttribute("onclick", "flip(event)");
        }
    }
}

const checkCards = () => {
    if (FIRSTCARD.innerHTML === SECONDCARD.innerHTML) {
        return true
    }
    else {
        return false
    }
}

restartGame()