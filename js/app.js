/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

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


function memoryGame() {
  respondToCardClick();
}

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

// adds event listeners to all cards
function respondToCardClick() {
  // Starts measuring the time --- put later in another function, smthng like restart
  startTime = performance.now();
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

// checks if all cards are matched - when there are 8 paired cards
function allMatched() {
  if (matchedCards === 8) {
    endTime = performance.now();
    victoryModal.style.display = "flex";
    timeModal.innerHTML = "The needed time was: " + (endTime - startTime) + " milliseconds.";
    let remainedStars = document.querySelectorAll('.fa-star').length;
    starsModal.innerHTML = "You have won " + remainedStars + " stars";
  }
  return;
}

// increments the moves counter
function handleMovesCounter() {
  currentMove = currentMove + 1;
  movesContainer.innerHTML = currentMove;
  handleStars();
}

// removes stars after a number of moves
function handleStars() {
  const starsContainer = document.querySelector('.stars');
  let lastStar = starsContainer.lastElementChild;
  if (currentMove === 21) {
    lastStar.remove();
  } else if (currentMove === 30) {
    lastStar.remove();
  }
}

// starts a game
memoryGame();