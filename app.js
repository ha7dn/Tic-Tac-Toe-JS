var origBoard; //array of X and O
const human = 'O';
const AI    = 'X';
//winning combinations
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
]; 

const cells = [...document.querySelectorAll('.cell')];
startGame();

function startGame() {
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys());
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', turnClick, false);
    });
}

// human plays turn
function turnClick(square)
{
    //check if cell has been played
    if (typeof origBoard[square.target.id === 'number']) 
    {
        turn(square.target.id, human);
        if (!checkTie()) 
        {
            turn(bestSpot(), AI);
        }    
    }
    
}


//palyer takes a turn
function turn(squareId, player) 
{
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) 
    {
        gameOver(gameWon);    
    }    
}

function checkWin(board, player) 
{
    /* reduce method:
    * reduces an array to a single value
    * executes a provided funcion for each value(left to right)
    * the return is stored in an accumulator
    * it DOES NOT change the original array
    * Array.reduce(function(total, currentVaue, currentIndex, arr), initialValue)
    * */

    // finds every index(cell) the player has used(plays)
    let plays = board.reduce((acc, val ,index) => 
                            (val === player) ? acc.concat(index) : acc, []);    
    let gameWon = null;
    for(let [index, combo] of winCombos.entries())
    {
        // has player played completed a winning combo
        if(combo.every(elem => plays.indexOf(elem) > -1)) 
        {
            // index = winning combo, player = who won 
            gameWon = {index: index, player: player};
            break;
        }
       
    }

    return gameWon;
}

function gameOver(gameWon) 
{
    // highlight the winning combo
    for (let index of winCombos[gameWon.index])
    {
        document.getElementById(index).style.backgroundColor = 
                                            (gameWon.player === human ? 'blue' : 'red');
    }

    // disables the click on cells
    cells.forEach(cell => {
        cell.removeEventListener('click', turnClick, false);
    });

    declareWinner(gameWon.player === human ? 'You Win!' : 'You Lose!');
}

function declareWinner(whoWon) 
{
    document.querySelector('.endgame').style.display   = 'block';
    document.querySelector('.endgame .text').innerText = whoWon;
}

function emptySquares() 
{
     return origBoard.filter(c => typeof c === 'number');    
}

function bestSpot()
{
    return minimax(origBoard, AI).index;
}

function checkTie() 
{
    if(emptySquares().length === 0)
    {
        cells.forEach(cell => {
            cell.style.backgroundColor = 'green';
            cell.removeEventListener('click', turnClick, false);
        });
        declareWinner('Tie Game!');
        return true;
    }
    return false;
}

function minimax(tempBoard, player) 
{
	var freeSpots = emptySquares();

    if (checkWin(tempBoard, human)) 
    {
		return {score: -10};
    } 
    else if (checkWin(tempBoard, AI)) 
    {
		return {score: 10};
    } 
    else if (freeSpots.length === 0) 
    {
		return {score: 0};
	}
	var moves = [];
    for (var i = 0; i < freeSpots.length; i++) 
    {
		var move = {};
		move.index = tempBoard[freeSpots[i]];
		tempBoard[freeSpots[i]] = player;

        if (player == AI) 
        {
			var result = minimax(tempBoard, human);
			move.score = result.score;
        } 
        else 
        {
			var result = minimax(tempBoard, AI);
			move.score = result.score;
		}

		tempBoard[freeSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
    if(player === AI) 
    {
		var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) 
        {
            if (moves[i].score > bestScore) 
            {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
    } 
    else 
    {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

