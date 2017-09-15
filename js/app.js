/*
 * Create a list that holds all of your cards
 */

// document.getElementsByClassName returns NodeList object. So, we convert it to Array.
var cardList = Array.prototype.slice.call(document.getElementsByClassName('card'));

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Grab the deck
var deck = document.getElementsByClassName('deck')[0];
// Array to hold opened cards.
var openCardList =[];
// A variable to show the number of moves
var moveCount = 0;
// Grab the element with the class name of 'moves'
var moveHTML = document.getElementsByClassName('moves')[0];
// Grab the win screen
var winScreen = document.getElementById('winScreen');
// Grab the element with the class name of 'stars'
var stars = document.getElementsByClassName('stars')[0];
// A variable to show the number of star rate
var starRate;
// A variable for timer
var time = 0;
// Grab the DOM element with class name of 'time'
var timeHTML = document.getElementsByClassName('time')[0];

// Restart the game.
restart();

// Start to time count
startTimeCount();

// A function to restart the game.
function restart(){
    // Reset moveCount
    moveCount = 0;
    moveHTML.innerText = moveCount;

    // Reset time
    time = 0;

    // Set star rate 3 as default
    createStars(3);

    // Shuffle cards
    cardList = shuffle(cardList);
    // Add cards in the deck
    cardList.forEach(function(card){
        card.classList.remove('open','show','match');
        deck.appendChild(card);
    });
} // resart()

// Shuffle function from http://stackoverflow.com/a/2450976
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

for (var i = 0, len = cardList.length; i < len; i++){
    // Grab a card one by one
    var card = cardList[i];
    // Add click event listener
    card.addEventListener('click',function(event){
        /*
         * An user may click an opened card. In that case, event.target will be <li> tag or <i> tag
         * depending on the point a use clicks. So, make it consistant here.
         */
        var targetCard;
        if(event.target.tagName == 'LI'){
            targetCard = event.target;
        }else {
            targetCard = event.target.parentElement;
        }
        // Check if the card has already opened.
        var isClicked = targetCard.classList.contains('open');
        // If the card is not opened, continue to process it.
        if(!isClicked){
            display(targetCard)
            setTimeout(function(){
                checkOpenCardList();
            },300);
            setTimeout(function(){
                checkComplete();
            },400);
        }
    })
}

// A function to display card symbol and change color
function display(card){
    // Add 'open' and 'show' class name
    card.classList.add('open','show');
    // Push the card to openCardList
    openCardList.push(card);
}

// A function to hide card symbol and change color
function hide(card){
    // Remove 'open' and 'show' class name
    card.classList.remove('open','show');
}

// A function to check two opened cards
function checkOpenCardList(){
    // If openCardList contain two cards, compare them and clear openCardList.
    if (openCardList.length == 2){
        incrementMoveCount();
        var firstCard = openCardList[0];
        var secondCard = openCardList[1];
        // Compare two cards.
        compare(firstCard,secondCard);
        // Clear openCardList.
        openCardList = [];
    }
} // checkOpenCardList()

// A helper function to check if two cards match or not, and do appropriate actions.
function compare(firstCard, secondCard){
    var firstCardSymbol = firstCard.children[0].className;
    var secondCardSymbol = secondCard.children[0].className;

    if(firstCardSymbol == secondCardSymbol){
        firstCard.classList.remove('open');
        secondCard.classList.remove('open');
        firstCard.classList.add('match');
        secondCard.classList.add('match');
    }else {
        firstCard.classList.remove('open','show');
        secondCard.classList.remove('open','show');
        firstCard.classList.add('unmatch');
        secondCard.classList.add('unmatch');
        // Use setTimeout function to take time for cards to animate before it is hided.
        setTimeout(function(){
                firstCard.classList.remove('unmatch');
                secondCard.classList.remove('unmatch');
            }, 700);
    }
}

// A function to increment moveCount
function incrementMoveCount(){
    // increment moveCount
    moveCount += 1;
    // Change innerText of moveHTML
    moveHTML.innerText = moveCount;

    // Grab the element with the class name of 'stars'
    var starsHTML = document.getElementsByClassName('stars')[0];
    // Get HTMLCollection of children of starsHTML
    var starHTMLCollection = starsHTML.children;

    // Decrese the number of stars as the moveCount exceeds 16.
    if ( (moveCount % 16 == 0 ) && (starHTMLCollection.length > 1) ){
            starsHTML.removeChild(starHTMLCollection[starHTMLCollection.length - 1]);
    }
}

// A function to check if the game is completed or not
// If it does, show win screen
function checkComplete(){
    var cardList = document.getElementsByClassName('card');
    var isCompleted = true;
    for (i = 0, len = cardList.length; i < len; i++) {
        if (!cardList[i].classList.contains('match') ) {
            isCompleted = false;
        }
    }
    if(isCompleted){
        showWinScreen();
    }
}

// A helper function to display the win screen
function showWinScreen(){
    // Stop time count
    clearInterval(startTimeCount);
    // Grab elements in the win screen
    var timeResult = document.getElementById('timeResult');
    var moveResult = document.getElementById('moveResult');
    var starResult = document.getElementById('starResult');
    // Grab the element with the class name of 'stars'
    var starsHTML = document.getElementsByClassName('stars')[0];
    // Get HTMLCollection of children of starsHTML
    var starHTMLCollection = starsHTML.children;
    var numberOfStars = starHTMLCollection.length;
    console.log(numberOfStars);
    moveResult.innerText = moveCount;
    timeResult.innerText = time;
    starResult.innerText = numberOfStars;

    winScreen.style.display = 'flex';
}
// A function to hide the win screen
function hideWinScreen(){
    winScreen.style.display = 'none';
}

// A function to creat stars
function createStars(number){
    // Clear stars
    stars.innerHTML = '';
    // Create HTML string to show a star
    var starHTML = '<li><i class="fa fa-star"></i></li>';
    for(i = 0; i < number; i++) {
        stars.innerHTML += starHTML;
    }
}

// A function to start counting time
function startTimeCount(){
    setInterval(function(){
        time++;
        timeHTML.innerText = time;
    },1000);
}

