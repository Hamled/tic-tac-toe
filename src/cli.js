import Game from './game';
import prompt from 'prompt';

// Get the necessary information for this play session
const sessionSetup = function(callback) {
  const promptSchema = {
    properties: {
      playerX: {
        description: 'Enter the first player\'s name',
        default: 'Player X'
      },
      playerO: {
        description: 'Enter the second player\'s name',
        default: 'Player O'
      }
    }
  };

  prompt.get(promptSchema, function(err, result) {
    if(err) {
      process.exit(err);
    }

    callback({
      playerX: result.playerX,
      playerO: result.playerO
    });
  });
};

const printHelp = function() {
  console.log('Available commands:');
  console.log('? - Print this help');
  console.log('restart - Start a new game immediately');
  console.log('exit - Leave the program');
  console.log('While a game is active, you can also enter a valid board position (1-9):');
  console.log(' 1 | 2 | 3 ');
  console.log('---+---+---');
  console.log(' 4 | 5 | 6 ');
  console.log('---+---+---');
  console.log(' 7 | 8 | 9 ');
  console.log('');
  console.log('');
};

// Run a single instance of the game loop:
// 1. display board
// 2. ask for input
// 3. make move
const gameLoop = function(session) {
  const gameFromSession = function(session) {
    return new Game({
      playerX: session.playerX,
      playerO: session.playerO
    });
  };

  const promptSchema = function(game) {
    const commandSchema = game.get('outcome') === null ? {
      description: game.currentPlayer() + ' make a move, or ? for help',
      pattern: /^([1-9]|restart|exit|\?)$/,
      message: 'Input must be a valid board position, or ? for help',
      required: true
    } : {
      description: 'Enter restart for a new game, or exit to stop playing',
      pattern: /^(restart|exit|\?)$/,
      message: 'Input must be either restart or exit',
      required: true
    };

    return {
      properties: {
        command: commandSchema
      }
    };
  };

  // Always start with a game
  if(!session.game) {
    session.game = gameFromSession(session);
  }

  // Display the current board
  session.game.printBoard();

  // Indicate if anyone has won
  const outcome = session.game.get('outcome');
  if(outcome !== null) {
    process.stdout.write('Game over! ');

    if(outcome === Game.EMPTY_CELL) {
      console.log(' It\'s a tie.');
    } else {
      console.log(` ${outcome} is the winner.`);
    }
  }

  prompt.get(promptSchema(session.game), function(err, result) {
    if(err) {
      process.exit(err);
    }

    if(result.command == '?') {
      printHelp();
    } else if(result.command == 'exit') {
      console.log('Thanks for playing, goodbye!');
      process.exit(0);
    } else if(result.command == 'restart') {
      console.log('Starting a new game...');
      session.game = gameFromSession(session);
    } else {
      const move = Number.parseInt(result.command);
      try {
        session.game.play(move - 1); // Game expects 0-8, we ask for 1-9
      } catch(e) {
        console.log('You cannot make that move.');
      }
    }

    // Run the next iteration of the loop
    gameLoop(session);
  });
};

// The beginning of the application code
const main = function() {
  console.log("Welcome to Tic-Tac-Toe!");

  prompt.start();
  const session = sessionSetup(gameLoop);
};

// Start running the application immediately
main();
