/* 
*  Row/Column text size decrease on larger boards (>20)
*  Click on squares input
*  Guess Mode
*  Enter Mode
*  Solution/Solve Entered Problem Mode
*  Manually Enter New Problem with board size
*  Restart problem
*/
$(document).ready(function(){
	let canvas = $('canvas')[0];
	CTX = canvas.getContext("2d");
	
	let initialBoardSize = 10;
	loading = true;
	
	NewProblem(initialBoardSize);
});

function InitializeNewBoard(size){
	boardAnswer = new Array(size);
	rowTotal = new Array(size);
	columnTotal = new Array(size);
	
	for(let i = 0; i < size; i++){
		boardAnswer[i] = new Array(size);
		rowTotal[i] = 0;
		columnTotal[i] = 0;
		for(let j = 0; j < size; j++){
			boardAnswer[i][j] = "water";
		}
	}
}

function DisplayBoard(board){
	let canvas = $('canvas')[0];
	CTX.clearRect(0,0,canvas.width,canvas.height);
	let size = board.length;
	let gridSize = (500.0/size);
	CTX.fillStyle = "black";
	CTX.rect(10,10,500.5,500.5);
	CTX.fill();
	for (let i = 0; i < size; i++) { //Draw grid
		for(let j = 0; j < size; j++){
			CTX.beginPath();
			CTX.fillStyle="white";
			CTX.rect( gridSize*i + 11, gridSize*j + 11, gridSize-1.5, gridSize-1.5);
			CTX.fill();
			CTX.closePath();
			CTX.fillStyle="black";
		}
	}
		
	for(let row = 0; row < size; row++){
		for(let col = 0; col < size; col++){
			switch(board[col][row]){
				case "water":
					CTX.font = "bold " + 30*gridSize/50 + "px Arial";
					CTX.fillText("~~~",gridSize*(row) + 8.881 - .2677*gridSize/50,gridSize*(col+.5) + 10 - 5*gridSize/50);
					CTX.fillText("~~~",gridSize*(row) + 8.881 - .2677*gridSize/50,gridSize*(col+.5) + 10 + 10*gridSize/50);
					CTX.fillText("~~~",gridSize*(row) + 8.881 - .2677*gridSize/50,gridSize*(col+.5) + 10 + 25*gridSize/50);
				break;
				case "leftEnd":
					CTX.fillRect(gridSize*(row+.5) + 10,(col+.5)*gridSize + 10 - 20*gridSize/50,20*gridSize/50,40*gridSize/50);
					CTX.beginPath();
					CTX.arc((row+.5)*gridSize + 10,(col+.5)*gridSize + 10,20*gridSize/50,0,2*Math.PI,false);
					CTX.fill();
				break;
				case "downEnd":
					CTX.fillRect(gridSize*(row+.5) + 10 - 20*gridSize/50,(col+.5)*gridSize + 10 - 20*gridSize/50,40*gridSize/50,20*gridSize/50);
					CTX.beginPath();
					CTX.arc((row+.5)*gridSize + 10,(col+.5)*gridSize + 10,20*gridSize/50,0,2*Math.PI,false);
					CTX.fill();
				break;
				case "rightEnd":
					CTX.fillRect(gridSize*(row+.5) + 10 - 20*gridSize/50,gridSize*(col+.5) + 10 - 40*gridSize/100,20*gridSize/50,40*gridSize/50);
					CTX.beginPath();
					CTX.arc((row+.5)*gridSize + 10,(col+.5)*gridSize + 10,20*gridSize/50,0,2*Math.PI,false);
					CTX.fill();
				break;
				case "upEnd":
					CTX.fillRect(gridSize*(row+.5) + 10 - 20*gridSize/50,(col+.5)*gridSize + 10,40*gridSize/50,20*gridSize/50);
					CTX.beginPath();
					CTX.arc((row+.5)*gridSize + 10,(col+.5)*gridSize + 10,20*gridSize/50,0,2*Math.PI,false);
					CTX.fill();
				break;
				case "center":
					CTX.fillRect(gridSize*(row+.5) + 10 - 20*gridSize/50,(col+.5)*gridSize + 10 - 20*gridSize/50,40*gridSize/50,40*gridSize/50);
				break;
				case "submarine":
					CTX.beginPath();
					CTX.arc((row+.5)*gridSize + 10,(col+.5)*gridSize + 10,20*gridSize/50,0,2*Math.PI,false);
					CTX.fill();
				break;
				case "hint":
				break;
				case "unknown":
					CTX.beginPath();
					CTX.arc((row+1)*gridSize - 15,(col+1)*gridSize - 15,10,0,2*Math.PI,false);
					CTX.fill();
				break;
			}
		}
	}
	
	CTX.font = "30px Arial"; //Dynamically change this (Or at least to a reasonable extent above 20 or so) OR Limit board size??????? Buttons on drop down?? Better to not generalize ship counts????
	
	for(let i = 0; i < size; i++){ //Displays row and column totals
		if(rowTotal[i] > 9){
			CTX.fillText(rowTotal[i],510,gridSize*i+gridSize/2+21);
		}
		else{
			CTX.fillText(rowTotal[i],520,gridSize*i+gridSize/2+21);
		}
		if(columnTotal[i] > 9){
			CTX.fillText(columnTotal[i],gridSize*i+gridSize/2+2-10,540);
		}
		else{
			CTX.fillText(columnTotal[i],gridSize*i+gridSize/2+2,540);
		}
	}
}

function CreateAnswerBoard(size){
	let shipLengths = [];
	let Ships = [];
	let ShipRow = 0;
	let ShipColumn = 0;
	let ShipLength = 0;
	let ShipDirection = "horizontal";
	
	//Set number of ships in each board size
	shipLengths.push( Math.round(1.2933*Math.log(size) + .6072) < 0 ? 0 : Math.round(1.2933*Math.log(size) + .6072) ); //1
	shipLengths.push( Math.round(1.5145*Math.log(size) - .5418) < 0 ? 0 : Math.round(1.5145*Math.log(size) - .5418) ); //2
	shipLengths.push( Math.round(1.7672*Math.log(size) - 2.0668) < 0 ? 0 : Math.round(1.7672*Math.log(size) - 2.0668) ); //3
	shipLengths.push( Math.round(.9643*Math.log(size) - .9853) < 0 ? 0 : Math.round(.9643*Math.log(size) - .9853) ); //4
	shipLengths.push( Math.round(2.3755*Math.log(size) - 5.2686) < 0 ? 0 : Math.round(2.3755*Math.log(size) - 5.2686) ); //5
	
	//sizes that don't match equations (Look into new equations??)
	if(size == 2){
		shipLengths = [1,0,0,0,0];
	}
	else if(size == 5){
		shipLengths = [3,2,1,0,0];
	}
	
	let invalidPlacement = false;
	for(let i = 5; i > 0; i--){ //Iterate through all the sizes of ships
		ShipLength = i;
		for(let j = 0; j < shipLengths[i-1]; j++){ //Iterate through the total number of ships of a specified size	
			let iterationCount = 0;		
			do
			{
				invalidPlacement = false;
				ShipDirection = Math.floor(Math.random()*2) == 0 ? "horizontal" : "vertical";
				
				//Check if proposed ship placement intersects current ships
				if(ShipDirection == "horizontal"){
					ShipRow = Math.floor(Math.random()*size); //random integer between the edge of the board and the farthest start of the longest ship
					ShipColumn = Math.floor(Math.random()*(size-i+1));
					if(ShipColumn > 0){ //Check if spaces before the ship are water
						if(boardAnswer[ShipRow][ShipColumn - 1] != "water"){
							invalidPlacement = true;
						}
						if(ShipRow + 1 < size){
							if(boardAnswer[ShipRow + 1][ShipColumn - 1] != "water"){
								invalidPlacement = true;
							}
						}
						if(ShipRow > 0){
							if(boardAnswer[ShipRow - 1][ShipColumn - 1] != "water"){
								invalidPlacement = true;
							}
						}
					}
					for(let k = 0; k < ShipLength; k++){ //Iterate through spaces of potential ship placement
						if(boardAnswer[ShipRow][ShipColumn + k] != "water"){
							invalidPlacement = true;
						}
						if(ShipRow + 1 < size){
							if(boardAnswer[ShipRow + 1][ShipColumn + k] != "water"){
								invalidPlacement = true;
							}
						}
						if(ShipRow > 0){
							if(boardAnswer[ShipRow - 1][ShipColumn + k] != "water"){
								invalidPlacement = true;
							}
						}
					}
					if(ShipColumn + ShipLength < size){ //Check if spaces after the ship are water
						if(boardAnswer[ShipRow][ShipColumn + ShipLength] != "water"){
							invalidPlacement = true;
						}
						if(ShipRow + 1 < size){
							if(boardAnswer[ShipRow + 1][ShipColumn + ShipLength] != "water"){
							invalidPlacement = true;
							}
						}
						if(ShipRow > 0){
							if(boardAnswer[ShipRow - 1][ShipColumn + ShipLength] != "water"){
							invalidPlacement = true;
							}
						}
					}
				}
				else{
					ShipRow = Math.floor(Math.random()*(size-i+1)); //random integer between the edge of the board and the farthest start of the longest ship
					ShipColumn = Math.floor(Math.random()*size);
					if(ShipRow > 0){ //Check if spaces before the ship are water
						if(boardAnswer[ShipRow - 1][ShipColumn] != "water"){
							invalidPlacement = true;
						}
						if(ShipColumn + 1 < size){
							if(boardAnswer[ShipRow - 1][ShipColumn + 1] != "water"){
								invalidPlacement = true;
							}
						}
						if(ShipColumn > 0){
							if(boardAnswer[ShipRow - 1][ShipColumn - 1] != "water"){
								invalidPlacement = true;
							}
						}
					}
					for(let k = 0; k < ShipLength; k++){
						if(boardAnswer[ShipRow + k][ShipColumn] != "water"){
							invalidPlacement = true;
						}
						if(ShipColumn + 1 < size){
							if(boardAnswer[ShipRow + k][ShipColumn + 1] != "water"){
							invalidPlacement = true;
							}
						}
						if(ShipColumn > 0){
							if(boardAnswer[ShipRow + k][ShipColumn - 1] != "water"){
							invalidPlacement = true;
							}
						}
					}
					if(ShipRow + ShipLength < size){ //Check if spaces after the ship are water
						if(boardAnswer[ShipRow + ShipLength][ShipColumn] != "water"){
							invalidPlacement = true;
						}
						if(ShipColumn + 1 < size){
							if(boardAnswer[ShipRow + ShipLength][ShipColumn + 1] != "water"){
								invalidPlacement = true;
							}
						}
						if(ShipColumn > 0){
							if(boardAnswer[ShipRow + ShipLength][ShipColumn - 1] != "water"){
								invalidPlacement = true;
							}
						}
					}
				}
				//For 6 size boards
				iterationCount++;
				if(iterationCount > 10){ //Can't find right spot
					i = 5;
					j = shipLengths[i-1];
					iterationCount = 0;
					for(let k = 0; k < size; k++){
						for(let l = 0; l < size; l++){
							boardAnswer[k][l] = "water";
						}
					}
					break;
				}
			} 
			while(invalidPlacement);	
			
			//board has been reset b/c of placement restrictions
			if(iterationCount > 0){		
				//Add ship to list of ships			
				Ships.push({Length:ShipLength,Row:ShipRow,Column:ShipColumn,Direction:ShipDirection});
			
				//Assign pieces of added ship to answer board
				if(ShipDirection == "horizontal"){
					if(ShipLength == 1){
						boardAnswer[ShipRow][ShipColumn] = "submarine";
					}
					else{
						for(let k = 0; k < ShipLength; k++){
							if(k == 0){
								boardAnswer[ShipRow][ShipColumn + k] = "leftEnd";
							}
							else if(k == ShipLength - 1){
								boardAnswer[ShipRow][ShipColumn + k] = "rightEnd";
							}
							else{
								boardAnswer[ShipRow][ShipColumn + k] = "center";
							}
						}
					}
				}
				else{
					if(ShipLength == 1){
						boardAnswer[ShipRow][ShipColumn] = "submarine";
					}
					else{
						for(let k = 0; k < ShipLength; k++){
							if(k == 0){
								boardAnswer[ShipRow + k][ShipColumn] = "upEnd";
							}
							else if(k == ShipLength - 1){
								boardAnswer[ShipRow + k][ShipColumn] = "downEnd";
							}
							else{
								boardAnswer[ShipRow + k][ShipColumn] = "center";
							}
						}
					}
				}
			}
		}
	}
	for(let i = 0; i < size; i++){
		for(let j = 0; j < size; j++){
			if(boardAnswer[i][j] != "water"){
				rowTotal[i]++;
				columnTotal[j]++;
			}
		}
	}
}

function CreateQuestionBoard(boardAnswer){
	let size = boardAnswer.length;
	boardQuestion = new Array(size);
	for(let i = 0; i < size; i++){
		boardQuestion[i] = new Array(size);
		for(let j = 0; j < size; j++){
			boardQuestion[i][j] = boardAnswer[i][j];
		}
	}
	
	var randomSquares = new Array(size*size);
	
	for(let i = 0; i < size*size; i++){
		randomSquares[i] = i;
	}
	
	//Shuffle randomSquares
	let counter = randomSquares.length;
	while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = randomSquares[counter];
        randomSquares[counter] = randomSquares[index];
        randomSquares[index] = temp;
    }
	
	for(let i = 0; i < size*size; i++){
		
		//remove random square
		row = randomSquares[i]%size;
		column = (randomSquares[i] - row)/size;
		
		let removedSquare = boardQuestion[row][column];
		boardQuestion[row][column] = "empty";
		DisplayBoard(boardQuestion);
		
		if(!BoardSolver()){
			//replace removed square
			boardQuestion[row][column] = removedSquare;
		}
		DisplayBoard(boardQuestion);
	}
	
}

function BoardSolver(){
	let size = boardQuestion.length;
	let boardSolution = new Array(size);
	for(let i = 0; i < size; i++){
		boardSolution[i] = new Array(size);
		for(let j = 0; j < size; j++){
			boardSolution[i][j] = boardQuestion[i][j];
		}
	}
	
	//Check if all that is left to be placed in a row is water or ships
	for(let row = 0; row < size; row++){
		let currentShipCount = 0;
		let emptySpaceCount = 0;
		for(let column = 0; column < size; column++){
			if(boardSolution[row][column] != 'empty' && boardSolution[row][column] != 'water'){ //Counts the number of ships and empty spaces in a row
				currentShipCount++;
			}
			if(boardSolution[row][column] == 'empty'){
				emptySpaceCount++;
			}
		}
		if(currentShipCount == rowTotal[row]){ //If the ship count matches the row total, the empty spaces are water
			for(let column = 0; column < size; column++){
				if(boardSolution[row][column] == 'empty'){
					boardSolution[row][column] = 'water';
				}
			}
		}
		else if(emptySpaceCount == rowTotal[row] - currentShipCount){ //If the remaining empty spaces are all ships
			for(let column = 0; column < size; column++){
				if(boardSolution[row][column] == 'empty'){
					boardSolution[row][column] = 'unknown';
				}
			}
		}
	}
	
	//If the number of ships in a column is equal to the total, the rest of the spaces are water
	for(let column = 0; column < size; column++){
		let currentShipCount = 0;
		let emptySpaceCount = 0;
		for(let row = 0; row < size; row++){
			if(boardSolution[row][column] != 'empty' && boardSolution[row][column] != 'water'){ //Counts the number of ships and empty spaces in a column
				currentShipCount++;
			}
			if(boardSolution[row][column] == 'empty'){
				emptySpaceCount++;
			}
		}
		if(currentShipCount == columnTotal[column]){ //If the ship count matches the row total, the empty spaces are water
			for(let row = 0; row < size; row++){
				if(boardSolution[row][column] == 'empty'){
					boardSolution[row][column] = 'water';
				}
			}
		}
		else if(emptySpaceCount == columnTotal[column] - currentShipCount){ //If the remaining empty spaces are all ships
			for(let row = 0; row < size; row++){
				if(boardSolution[row][column] == 'empty'){
					boardSolution[row][column] = 'unknown';
				}
			}
		}
	}
	
	//Check if solution board and answer board are the same and return the result
	for(let row = 0; row < size; row++){
		for(let column = 0; column < size; column++){
			if( (boardAnswer[row][column] != boardSolution[row][column]) && !(boardSolution[row][column] == 'unknown' && boardAnswer[row][column] != 'water') ){
				return false;
			}
		}
	}
	return true;
}

async function NewProblem(size){
	InitializeNewBoard(size);
	ToggleLoading();
	await sleep(10);
	CreateAnswerBoard(size);
	CreateQuestionBoard(boardAnswer);
	DisplayBoard(boardQuestion);
	ToggleLoading();
}

//Button Events
$("#btnHelp").click(function(){
	location.href = 'help.html';
});

$("#NewProblemSubmitButton").click(function(){
	let size = $("#size")[0].value;
	if(isNaN(size)){
		$("#size")[0].value = "Please enter a number.";
	}
	else{
		let Size = Number(size);
		console.log(Size);
		console.log(parseInt(Size,10));
		console.log(Size === parseInt(Size,10));
		if(Size < 0){
			$("#size")[0].value = "Please enter a positive number.";
		}
		else if(!(Size === parseInt(Size,10))){
			$("#size")[0].value = "Please enter a whole number.";
		}
		else{//Good problem
			NewProblem(size);
			$("#NewProblemModal").modal('hide');
		}
	}
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ToggleLoading(){
	loading = !loading;
	if(loading){
		document.getElementById("loader").style.display = "none";
	}
	else{
		document.getElementById("loader").style.display = "block";
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