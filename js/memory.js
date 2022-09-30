// Dichiaro costanti necessarie al js
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

// dichiaro lo stato del gioco (se è iniziato, quante carte sono flippate, il tempo totale e il loop per il timer)
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalTime: 0,
    loop: null
}

// funzione per mischiare gli elementi dell'array
function shuffle(array) {
    // costante clone che seleziona tutto l'array (spread operator)
    const clonedArray = [...array]

    // per ogni elemento dell'array, pesca un indice random e scambia il contenuto tra l'elemento attuale e quello con indice random
    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }
    return clonedArray
}

//  funzione per pickare random elementi dell'array
function pickRandom(array, items) {
    // costante clone che seleziona tutto l'array (spread operator)
    const clonedArray = [...array]
    const randomPicks = []

    // per ogni elemento dell'array clonato, genera un indice random e aggiunge l'elemento con questo indice all'array "picks" per poi toglierlo dall'array clonato
    // items è la quantità di carte fratto due = in questo caso 8, quindi restituisce 8 coppie di carte
    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

// funzione che genera la board di gioco
function generateGame() {
    const dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    // creo le emoji
    const emojis = ['🌿', '🌼', '🌱', '🍁', '🍂', '🌵', '🌸', '🍃']
    // determino la dimensione dell'array
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2)
    // creo un'array mescolato che comprenda le coppie di emoji
    const items = shuffle([...picks, ...picks])
    // creo le carte singole
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')} 
       </div>
    `
    // JOIN ?????????????????????

    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
    // DOM PARSER ?????????????????????
}

// funzione che fa partire il timer (inizia il gioco) quando premi su START o quando flippi la prima carta
function startGame() {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.timer.innerText = `time: ${state.totalTime} sec`
    }, 1000)
}

// Funzione che fa ri-flippare le carte se non matchano tra loro
function flipBackCards() {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

// funzione che flippa le carte e, se le carte flippate sono due, controlla se matchano e di conseguenza decide se riflipparle o se assegnargli la classe "matched" e quindi lasciarle flippate
function flipCard(card) {
    state.flippedCards++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // Se non ci sono più carte che possono essere flippate, allora abbiamo vinto il gioco
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    Under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `
            // Fermo il timer alla vittoria
            clearInterval(state.loop)
        }, 1000)
    }
}

// aggiunge l'evento al click sulle carte
function attachEventListeners() {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()