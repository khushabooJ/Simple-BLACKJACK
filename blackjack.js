let blackjackGame = {
    'you': { 'scorespan': "#your-blackjack-result", 'div': '#your-box', 'score': 0 },
    'dealer': { 'scorespan': "#dealer-blackjack-result", 'div': '#dealer-box', 'score': 0},
    'cards': ["2", "3", "4", "5", '6', '7', "8", "9", '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': { "2": 2, "3": 3, "4": 4, "5": 5, '6': 6, '7': 7, "8": 8, "9": 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    "turnsOver": false,
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('sounds/sound.wav');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3')

document.querySelector('#hit').addEventListener('click', blackjackhit);

document.querySelector('#stand').addEventListener('click', dealerLogic);

document.querySelector('#deal').addEventListener('click', blackjackDeal);

function blackjackhit() { 
    if(blackjackGame['isStand'] === false){
    let card = randomCard();
    console.log(card)
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    console.log(YOU['score'])
}
};
function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13)
    return blackjackGame['cards'][randomIndex];
};

function showCard(card, activePlayer) {
    if(blackjackGame['turnsOver'] === false){
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}
}

function blackjackDeal() {
    if(blackjackGame['turnsOver'] === true){

    blackjackGame['isStand'] = false;

    let yourImages = document.querySelector("#your-box").querySelectorAll('img');
    let dealerImages = document.querySelector("#dealer-box").querySelectorAll('img');

    for (i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
    };
    for (i = 0; i < dealerImages.length; i++) {
        dealerImages[i].remove();
    } 

    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector("#your-blackjack-result").textContent = 0;
    document.querySelector('#dealer-blackjack-result').textContent = 0;
    document.querySelector('#your-blackjack-result').style.color = 'white';
    document.querySelector('#dealer-blackjack-result').style.color = 'white';

    //document.querySelector('#blackjack-result');
    document.querySelector('#blackjack-result').textContent = "Let's Play"
    document.querySelector('#blackjack-result').style.color = 'black';
    

    blackjackGame['turnsOver'] = false;
    
}

};

function updateScore(card, activePlayer) {
    if (card === 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];

    }
}

function showScore(activePlayer) {
    if(blackjackGame['turnsOver'] === false)
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scorespan']).textContent = "BUST!";
        document.querySelector(activePlayer['scorespan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
    }
}

//to make a second diffrence in serving of cards
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
 
async function dealerLogic() {
    blackjackGame['isStand'] = true;
    //to make dealer automatic
    while(DEALER['score'] < 19 && blackjackGame['isStand'] === true){
    let card = randomCard();
    console.log(card)
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
    }

   
    blackjackGame['turnsOver'] = true; 
    let winner = computeWinner();
    showResult(winner);
    console.log(blackjackGame['turnsOver']);

}

function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            //console.log('YOU WON!');
            blackjackGame['wins']++;
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {
            //console.log('YOU LOST!')
            blackjackGame["losses"]++;
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score']) {
            // console.log("YOU DREW!");
            blackjackGame['draws']++;
        }
        // condition where user busts and dealer doesn't
        } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {

        blackjackGame['losses']++;
        //console.log('YOU LOST!');
        winner = DEALER;
        } else if (YOU['score'] > 21 && DEALER > 21) {
        //console.log('YOU DREW!');
        blackjackGame['draws']++;
        }

     console.log(blackjackGame)
     return winner;
}

function showResult(winner) {
    let message, messageColor;

    if(blackjackGame['turnsOver'] === true){

      if (winner === YOU) {
          document.querySelector('#wins').textContent = blackjackGame['wins']
          message = 'YOU WON!';
          messageColor = 'green';
          winSound.play();
      } else if (winner === DEALER) {
          document.querySelector('#losses').textContent = blackjackGame['losses']
          message = 'YOU LOST!';
          messageColor = "red";
          lossSound.play();
      } else {
          document.querySelector('#draws').textContent = blackjackGame['draws']
          message = 'YOU DREW!';
          messageColor = 'black';
      }
      document.querySelector('#blackjack-result').textContent = message;
      document.querySelector('#blackjack-result').style.color = messageColor;

    }

}