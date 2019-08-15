var CTX; //Canvas context

//Main logic path
$(document).ready(function(){
	
	//Get canvas context and sets format
	var canvas = $('canvas')[0];
	CTX = canvas.getContext("2d");
	
	var initialBoardSize = 10;
	var boardAnswer;
	var boardProblem;
	var boardCurrent;
	var rowTotal;
	var columnTotal;

	InitializeNewBoard(initialBoardSize);
	DrawGrid(initialBoardSize);
	
});

//Initializes board variables according to board size
function InitializeNewBoard(size){
	boardAnswer = new Array(size);
	boardProblem = new Array(size);
	boardCurrent = new Array(size);
	rowTotal = new Array(size);
	columnTotal = new Array(size);
	
	for(var i = 0; i < size; i++){
		boardAnswer[i] = new Array(size);
		boardProblem[i] = new Array(size);
		boardCurrent[i] = new Array(size);
		rowTotal[i] = 0;
		columnTotal[i] = 0;
		for(var j = 0; j < size; j++){
			boardAnswer[i][j] = "empty";
			boardProblem[i][j] = "empty";
			boardCurrent[i][j] = "empty";
		}
	}
}

function DrawGrid(size){
	var gridSize = (500.0/size);
	CTX.fillStyle = "black";
	CTX.rect(10,10,500.5,500.5);
	CTX.fill();
	for (var i = 0; i < size; i++) { //Draw grid
		for(var j = 0; j < size; j++){
			CTX.beginPath();
			CTX.fillStyle="white";
			CTX.rect( gridSize*i + 11, gridSize*j + 11, gridSize-1.5, gridSize-1.5);
			CTX.fill();
			CTX.closePath();
			CTX.fillStyle="black";
		}
	}
	
	CTX.font = "30px Arial";
	
	for(var i = 0; i < size; i++){ //Displays row and column totals
		CTX.fillText(rowTotal[i],520,gridSize*i+gridSize/2+21);
		CTX.fillText(columnTotal[i],gridSize*i+gridSize/2+2,540);
	}
}


/*
Logic flow:

Initialize board:
	Inputs: Size
	Outputs: Answer board
	Interactivity: Draws empty board of correct size
	Disables all other buttons while generating, moves on to create problem state
	
	Draw empty grid to screen
	Initialize empty problem and answer boards to empty
	Create answer board function
	
Create Problem:
	Inputs: Difficulty, Size
	Outputs: Problem board, Current Board
	Interactivity: Draws problem board
	Disables all other buttons while generating
	Moves to ready state, enables button interactivity
	
Help:
	Can be clicked on in any state except Initialize and Create Problem to move to help.html page
	Returns back to main page on button click
	
Guess:
	Togglable state
	Only Changes blank spaces or other guess clues

Solution:
	If problem was not entered, show and check solution
	else, try to solve the entered problem

Enter Problem:
	Problem, Answer, and Current Board reinitialized
	Clicking changes current grid square or number

Restart:
	Sets Current Board to Problem board

Ready:
	Main state, no button for this one
	
*/