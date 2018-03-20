// Global variables used in the code

const deckOfCards = document.querySelector('.deck');
// Nodelist of all cards elements
const allCards = document.getElementsByClassName('card');
// list of all cards
let openCards = [];
const movesContainer = document.getElementById('moves_counter');
let currentMove = Number(movesContainer.innerHTML);
let matchedCards = 0;
// variables holding start and end time
let startTime;
let endTime;
// modal elements
const victoryModal = document.getElementById('victory_modal');
const timeModal = document.getElementById('time_to_win');
const starsModal = document.getElementById('stars_at_end');

// restart button 
const restart = document.getElementsByClassName('restart');

// timer elements
const stopWatch = document.querySelector('.timer');
let seconds = 0, minutes = 0, hours = 0, t;

// start button at the beginning
const startButton = document.querySelector('.start');

const starsContainer = document.querySelector('.stars');

let cards = ['<i class="fa fa-diamond"></i>',
  '<i class="fa fa-paper-plane-o"></i>',
  '<i class="fa fa-anchor"></i>',
  '<i class="fa fa-bolt"></i>',
  '<i class="fa fa-cube"></i>',
  '<i class="fa fa-anchor"></i>',
  '<i class="fa fa-leaf"></i>',
  '<i class="fa fa-bicycle"></i>',
  '<i class="fa fa-diamond"></i>',
  '<i class="fa fa-bomb"></i>',
  '<i class="fa fa-leaf"></i>',
  '<i class="fa fa-bomb"></i>',
  '<i class="fa fa-bolt"></i>',
  '<i class="fa fa-bicycle"></i>',
  '<i class="fa fa-paper-plane-o"></i>',
  '<i class="fa fa-cube"></i>'
];

// shuffle the cards function
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// turns back everything
function cleanSlate() {
  victoryModal.style.display = 'none';
  movesContainer.innerHTML = '0';
  currentMove = 0;
  matchedCards = 0;
  deckOfCards.innerHTML = "";
}

// shuffles the array of cards and creates a new deck
function createNewDeck() {
  cleanSlate();
  cards = shuffle(cards);
  for (let i = 0; i < cards.length; i++) {
    let card = document.createElement('li');
    card.className = 'card';
    card.innerHTML = cards[i];
    deckOfCards.appendChild(card);
  }
}

function startGame() {
  startButton.addEventListener('click', function () {
    startTime = performance.now();
    timer();
    memoryGame();
  });
}

// adds event listeners to all cards
function respondToCardClick() {
  // Starts measuring the time --- put later in another function, smthng like restart
  for (let i = 0; i < allCards.length; i++) {
    allCards[i].addEventListener('click', displayCardSymbol);
  }
}

// displays symbol of the card by adding css class
function displayCardSymbol(e) {
  let clickedCard = e.target;
  if (clickedCard.classList.contains('show', 'open')) {
    return;
  }
  clickedCard.classList.add('show', 'open');
  openCards.push(clickedCard);
  checkMatch();
  handleMovesCounter();
}

// handles card matching
function checkMatch() {
  if (openCards.length === 2) {
    if (areSameCards()) {
      isMatch();
      allMatched();
    } else {
      setTimeout(isNotMatch, 500);
    }
  }
}

// checks if the two open cards are the same
function areSameCards() {
  return openCards[0].innerHTML === openCards[1].innerHTML;
}

// handles two different clicked cards
function isNotMatch() {
  for (let i = 0; i < openCards.length; i++) {
    openCards[i].classList.remove('show', 'open');
  }
  // empties the open cards container
  openCards.length = 0;
}

// handles when clicked cards are matched
function isMatch() {
  for (let i = 0; i < openCards.length; i++) {
    openCards[i].classList.add('match');
  }
  openCards.length = 0;
  // increments the match number counter
  matchedCards += 1;
}

// Turns milliseconds to minutes and seconds (from - https://goo.gl/Ux9sPb)
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// checks if all cards are matched - when there are 8 paired cards
function allMatched() {
  if (matchedCards === 8) {
    endTime = performance.now();
    restartTime();
    let finalTime = millisToMinutesAndSeconds(endTime - startTime);
    victoryModal.style.display = "flex";
    timeModal.innerHTML = "The needed time was " + finalTime + " min.";
    let remainedStars = document.querySelectorAll('.fa-star').length;
    if (remainedStars === 1) {
      starsModal.innerHTML = "You have won " + remainedStars + " star";
    } else {
      starsModal.innerHTML = "You have won " + remainedStars + " stars";
    }
  }
  return;
}

// increments the moves counter
function handleMovesCounter() {
  currentMove = currentMove + 1;
  movesContainer.innerHTML = currentMove;
  hideStars();
}

// removes stars after a number of moves
function hideStars() {
  let lastStar = starsContainer.lastElementChild;
  if (currentMove === 31) {
    lastStar.remove();
  } else if (currentMove === 41) {
    lastStar.remove();
  }
}

// showes stars after restart or new game
function showStars() {
  starsContainer.innerHTML = '<li><i class="fa fa-star"></i></li>' +
  '<li><i class="fa fa-star"></i>' + '</li><li><i class="fa fa-star"></i></li>';
}

function restartGame() {
  for (let i = 0; i < restart.length; i++) {
    restart[i].addEventListener('click', function () {
      restartTime();
      timer();
      showStars();
      memoryGame();
    });
  }
}

// Timer function based on https://jsfiddle.net/Daniel_Hug/pvk6p/
function add() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }

  stopWatch.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" +
    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" +
    (seconds > 9 ? seconds : "0" + seconds);

  timer();
}

function timer() {
  t = setTimeout(add, 1000);
}

function restartTime() {
  clearTimeout(t);
  stopWatch.textContent = "00:00:00";
  seconds = 0; minutes = 0; hours = 0;
}

function memoryGame() {
  createNewDeck();
  respondToCardClick();
  restartGame();
}

// starts a game
startGame();
