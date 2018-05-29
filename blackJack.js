function blackjack() {
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
        if (cur === 'J' || cur === 'Q' || cur === 'K') {
          sum += 10;
          return sum;
        } else if (cur === 'A') {
          sum += 11;
          return sum;
        } else {
          sum += cur;
          return sum;
        }
      }, 0);
      if (cardSum > 21 && this.hand.includes('A')) cardSum -= 10;
      return cardSum;
    }
    } //class ends

  //-----------------------------START functions for cards and shuffle-------------------------------

  function deckOCards() {
    const deck = ['A','A','A','A',2,2,2,2,3,3,3,3,4,
                  4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,
                  8,8,9,9,9,9,10,10,10,10,'J','J','J',
                  'J','Q','Q','Q','Q','K','K','K','K'];
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

  let outcomes = () => {
    console.log("Player: [" + player.hand + "] (" + player.calcSum() + ") | Dealer: ["
                    + dealer.hand + "] (" + dealer.calcSum() + ")");
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
        console.log("Dealer wins! Dealer has " + dealer.hand);
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
      console.log("You stand with [" + player.hand + "] (" + player.calcSum() + "). It is now the dealer's turn.");
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
          console.log("Double down! Your hand is now [" + player.hand + "] with a value of " + player.calcSum() + ".");
          stand();
          return;
        } else { // else if player hits
          player.hit();
          console.log("Hit! Your hand is now [" + player.hand + "] with a value of " + player.calcSum() + ".");
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
    console.log("Your hand is [" + player.hand + "] (" + player.calcSum() + "). The dealer has [" + dealer.hand[0] + ", X].");

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
