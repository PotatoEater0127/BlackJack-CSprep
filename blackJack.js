function blackjack() {
  // 😎
  let betAmount;
  let shuffleDeck = deckOCards();
  class Player {
    constructor(money) {
      this.money = money;
      this.hand = [];
    }
    // Add cards to a hand from the shuffled deck
    addCards(num) {
      for (let i = 0; i < num; i++) {
        this.hand.push(shuffleDeck.pop());
      }
      return this.hand;
    }

    createHand() {
      this.hand = [];
      this.hit();
      this.hit();
    }

    displayHand() {
      return this.hand.map(card => card.suit + card.value);
    }

    hit() {
      return this.addCards(1);
    }

    //functionality to double bet
    doubleDown() {
      this.money -= betAmount;
      betAmount *= 2;
      return this.addCards(1);
    }

    calcSum() {
      let cardSum = this.hand.reduce((sum, cur) => {
        if (cur.value === 'J' || cur.value === 'Q' || cur.value === 'K') {
          sum += 10;
          return sum;
        } else if (cur.value === 'A') {
          sum += 11;
          return sum;
        } else {
          sum += cur.value;
          return sum;
        }
      }, 0);
      let values = this.hand.map(card => card.value);
      while (cardSum > 21 && values.includes('A')) {
        cardSum -= 10;
        values.splice(values.indexOf('A'), 1);
      }
      return cardSum;
    }
  } //class ends

  //-----------------------------START functions for cards and shuffle-------------------------------

  function deckOCards() {
    let suits = ['♠', '♦', '♥', '♣'];
    let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'A', 'J', 'Q', 'K'];
    let deck = [];
    suits.forEach((suit) => {
      let cards = values.map((value) => ({suit: suit, value: value}));
      deck = deck.concat(cards);
    });
    // whenever deckOCards is invoked, we shuffle it
    const shuffled = shuffle(deck);
    return shuffled;
  } // deckOCards ends

    //a function to shuffle deckOCards
  function shuffle(array) {
    var currentIndex = array.length;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      var randomIndex = Math.floor(Math.random() * currentIndex);  // 0 <= randomIndex < 52
      currentIndex -= 1;
      // And swap it with the current element.
      // Switch last element and random element
      var temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  } // shuffle ends

//// print cards ////
function printBothHands(playerHand, dealerHand, isDealerCardFacedDown = false) {
  let lines = ['', '', '', '', '', '', '', '', ''];
  let spaceSize = 5;
  drawCards(playerHand, lines, false);
  drawSpaces(spaceSize, lines);
  drawCards(dealerHand, lines, isDealerCardFacedDown);
  console.log(lines.join('\n'));
}

function drawCards(cards, lines, isFacedDown) {
  // dealer's first card could be faced down
  if (isFacedDown) {
    drawFaceDownCard(lines);
  } else {
    drawCard(cards[0], lines);
  }
  cards.slice(1).forEach((card) => { drawCard(card, lines);});
}

function drawCard(card, lines) {
  let value = card.value;
  let suit = card.suit;
  let topLeft = value.toString();
  let bottomRight = value.toString();

  // If the card isn't 10, we pad the value to 2-digit size,
  // to make sure every card has the same width.
  if (value !== 10) {
    topLeft =  ' ' + topLeft;
    bottomRight = bottomRight + ' ';
  }
  lines[0] += `┌─────────┐`;
  lines[1] += `│${topLeft}       │`;
  lines[2] += `│         │`;
  lines[3] += `│         │`;
  lines[4] += `│    ${suit}    │`;
  lines[5] += `│         │`;
  lines[6] += `│         │`;
  lines[7] += `│       ${bottomRight}│`;
  lines[8] += `└─────────┘`;
}

function drawFaceDownCard(lines) {
  lines[0] += `┌─────────┐`;
  lines[1] += `│░░░░░░░░░│`;
  lines[2] += `│░░░░░░░░░│`;
  lines[3] += `│░░░░░░░░░│`;
  lines[4] += `│░░░░░░░░░│`;
  lines[5] += `│░░░░░░░░░│`;
  lines[6] += `│░░░░░░░░░│`;
  lines[7] += `│░░░░░░░░░│`;
  lines[8] += `└─────────┘`;
}

function drawSpaces(spaceSize, lines) {
  for (var i = 0; i < lines.length; i++) {
    lines[i] += ' '.repeat(spaceSize);
  }
}
//// print cards ends////

  let outcomes = () => {
    printBothHands(player.hand, dealer.hand, false);
    console.log("Player: [" + player.displayHand() + "] (" + player.calcSum() + ") | Dealer: ["
                    + dealer.displayHand() + "] (" + dealer.calcSum() + ")");
  }

  function whoWins() {
	  winner();
	  tie();

    //checks if dealer wins or not
        function winner() {
      if (dealer.calcSum() > player.calcSum() && dealer.calcSum() <= 21) {
        outcomes();
        console.log("Dealer wins!");
      } else if(player.calcSum() > 21){
        outcomes();
        console.log("You bust!");
      } else {
        outcomes();
        console.log("You win!");
        player.money += betAmount*2;
        }
    } //winner ends

    //checks if they tie (nobody wins)
    function tie(){
      if (player.calcSum() === dealer.calcSum()) {
        outcomes();
        console.log("Push! The values of both hands are equal.");
        player.money += betAmount;
      }
    } //tie ends

  } //whoWins ends
    function check21() {
      if (player.calcSum() === 21 && dealer.calcSum() === 21){
        // return player's money because of tie
        player.money += betAmount;
        console.log("Tie game. Your bet has been returned.")
        return 1;
      } else if (player.calcSum() === 21) {
        // player wins 1.5x their bet
        player.money += betAmount*2.5;
        console.log("Player wins! You have 21!");
        return 1;
      } else if (dealer.calcSum() === 21) {
        // player loses bet
        console.log("Dealer wins! Dealer has " + dealer.displayHand());
        return 1;
      } else return 0;
  } //end of check21

    function showPlayerOptions() {
      let hitCount = 0;
      let input;
      if (player.money < betAmount) {
        input = prompt('1: Hit, 2: Stand (please type a number)');
      } else {
        input = prompt('1: Hit, 2: Stand, 3: Double Down (please type a number)');
      }

      function inner() {
        if(input == '1' && hitCount == 0) {
          hitCount++;
          return input;
        } else if(hitCount >= 1) {
          input = prompt('1: Hit, 2: Stand (please type a number)');
          return input;
        }
        return input;
      }
      return inner;
    } // to invoke  let playerPrompt = showPlayerOptions(); // playerPrompt(); playerPrompt();

    function dealerTurn() {
      if (player.calcSum() < dealer.calcSum()) return;
      while (dealer.calcSum() < 17 || dealer.calcSum() < player.calcSum()) {
        if(player.calcSum() > 21) return;
        if (dealer.calcSum() > 21) {
          console.log("Dealer busts!");
          return;
        }
        dealer.hit();
      }
    }

    function stand() {
      console.log("You stand with [" + player.displayHand() + "] (" + player.calcSum() + "). It is now the dealer's turn.");
      dealerTurn();
    }

    function playerTurn(option,userPrompt) {
      if (option === '2') {
        stand();
        return;
      }
      while (option !== '2') { // loop until player chooses to stand
        // if player double downs
        if (option === '3') {
          player.doubleDown();
          printBothHands(player.hand, dealer.hand, true);
          console.log("Double down! Your hand is now [" + player.displayHand() + "] with a value of " + player.calcSum() + ".");
          stand();
          return;
        } else { // else if player hits
          player.hit();
          printBothHands(player.hand, dealer.hand, true);
          console.log("Hit! Your hand is now [" + player.displayHand() + "] with a value of " + player.calcSum() + ".");
        }
        if (player.calcSum() >= 21) return; // player busts, end of round
        option = userPrompt();
        if (option === '2') stand();
      }
  	}
  /**
  *** GAME PLAY ------------------------------------------------------------------------
  **/
  function gamePlay() {
    if (player.money <= 0) {
      console.log("You have no cash.");
      return
    }
    betAmount = parseInt(prompt("Please type the amount you want to bet. You have $" + player.money));

    //player cannot bet an amount higher than their current balance
    while (betAmount > player.money || betAmount < 1 || Number.isNaN(betAmount)) {
      console.log("Your balance is not enough!");
      betAmount = parseInt(prompt("Please type the amount you want to bet. You have $" + player.money));
    }

    //if the bet is valid, betAmount is subtracted from player.money
    player.money -= betAmount;

    let deck = deckOCards();

    player.createHand();
    dealer.createHand();
    // show player's hand and reveal one of the dealer's cards
    printBothHands(player.hand, dealer.hand, true);
    console.log("Your hand is [" + player.displayHand() + "] (" + player.calcSum() + "). The dealer has [X, " + dealer.displayHand()[0] + "].");

    if (check21() === 1) {
      return; //player or dealer has blackjack, end of round
        }

    let userPrompt = showPlayerOptions();
    playerTurn(userPrompt(),userPrompt);
    dealerTurn();
  } //gamePlay ends
  // instantiate user and dealer
  let player = new Player(1000);
  let dealer = new Player(0);

  //primary gameplay loop
  while (player.money > 0 && prompt('1. Deal or 2. Quit?') !== '2') {
    gamePlay();
    whoWins();
    console.log("Would you like to play another game?");
  }
} //blackjack ends

//invoke blackjack to begin the game
blackjack();
