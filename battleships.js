/* 
*  Row/Column text size decrease on larger boards (>20) Different equations as well?
*  Guess Mode
*  Enter Mode/Solve Entered Problem Mode
*/
$(document).ready(function(){	
	let canvas = $('canvas')[0];
	CTX = canvas.getContext("2d");
	
	let initialBoardSize = 10;
	loading = true;
	
	NewProblem(initialBoardSize);
});


//Board creation/initialization functions
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

async function DisplayBoard(board){
	let canvas = $('canvas')[0];
	CTX.clearRect(0,0,canvas.width,canvas.height);
	let size = board.length;
	let gridSize = (500.0/size);
	CTX.fillStyle = "black";
	CTX.rect(10,10,500.5,500.5);
	CTX.fill();
	
	let differenceMode = (typeof boardDifference !== 'undefined') ? boardDifference != null : false;
	
	for (let i = 0; i < size; i++) { //Draw grid
		for(let j = 0; j < size; j++){
			CTX.beginPath();
			CTX.fillStyle = !differenceMode ? "white" : boardDifference[j][i] ? "lightcoral" : "white";
			CTX.rect( gridSize*i + 11, gridSize*j + 11, gridSize-1.5, gridSize-1.5);
			CTX.fill();
			CTX.closePath();
			CTX.fillStyle="black";
		}
	}
	
	boardDifference = null;
	
	//Resolve unknown pieces
	for(let i = 0; i < 2; i++){ //2 iterations to go back over unknowns
		for(let row = 0; row < size; row++){
			for(let column = 0; column < size; column++){
				if(boardQuestion[row][column] == "empty" && board[row][column] != "water" && board[row][column] != "empty"){
					if(row > 0){
						if(board[row-1][column]=="unknown" || board[row-1][column]=="center" || board[row-1][column]=="upEnd"){
							if(row + 1 < size){
								if(board[row+1][column]=="unknown" || board[row+1][column]=="center" || board[row+1][column]=="downEnd"){
									board[row][column] = "center";
								}
								else if(board[row+1][column]=="water"){
									board[row][column] = "downEnd";
								}
							}
							else{
								board[row][column] = "downEnd";
							}
						}
						else if(board[row-1][column]=="water"){
							if(row + 1 < size){
								if(board[row+1][column]=="unknown" || board[row+1][column]=="center" || board[row+1][column]=="downEnd"){
									board[row][column] = "upEnd";
								}
							}
						}
					}
					else{
						if(row + 1 < size){
							if(board[row+1][column]=="unknown" || board[row+1][column]=="center" || board[row+1][column]=="downEnd"){
								board[row][column] = "upEnd";
							}
						}
					}
					if(column > 0){
						if(board[row][column-1]=="unknown" || board[row][column-1]=="center" || board[row][column-1]=="leftEnd"){
							if(column + 1 < size){
								if(board[row][column+1]=="unknown" || board[row][column+1]=="center" || board[row][column+1]=="rightEnd"){
									board[row][column] = "center";
								}
								else if(board[row][column+1]=="water"){
									board[row][column] = "rightEnd";
								}
							}
							else{
								board[row][column] = "rightEnd";
							}
						}
						else if(board[row][column-1]=="water"){
							if(column + 1 < size){
								if(board[row][column+1]=="unknown" || board[row][column+1]=="center" || board[row][column+1]=="rightEnd"){	
									board[row][column] = "leftEnd";
								}
							}
						}
					}
					else{
						if(column + 1 < size){
							if(board[row][column+1]=="unknown" || board[row][column+1]=="center" || board[row][column+1]=="rightEnd"){
								board[row][column] = "leftEnd";
							}
						}
					}
					//Submarine check
					if(row > 0){
						if(board[row-1][column] == "water"){
							if(row + 1 < size){
								if(board[row+1][column] == "water"){
									if(column > 0){
										if(board[row][column-1] == "water"){
											if(column + 1 < size){
												if(board[row][column+1] == "water"){
													board[row][column] = "submarine";
												}
											}
											else{
												board[row][column] = "submarine";
											}
										}
									}
									else{
										if(column + 1 < size){
											if(board[row][column+1] == "water"){
												board[row][column] = "submarine";
											}
										}
										else{
											board[row][column] = "submarine";
										}
									}
								}
							}
							else{
								if(column > 0){
									if(board[row][column-1] == "water"){
										if(column + 1 < size){
											if(board[row][column+1] == "water"){
												board[row][column] = "submarine";
											}
										}
										else{
											board[row][column] = "submarine";
										}
									}
								}
								else{
									if(column + 1 < size){
										if(board[row][column+1] == "water"){
											board[row][column] = "submarine";
										}
									}
									else{
										board[row][column] = "submarine";
									}
								}
							}
						}
					}
					else{
						if(row + 1 < size){
							if(board[row+1][column] == "water"){
								if(column > 0){
									if(board[row][column-1] == "water"){
										if(column + 1 < size){
											if(board[row][column+1] == "water"){
												board[row][column] = "submarine";
											}
										}
										else{
											board[row][column] = "submarine";
										}
									}
								}
								else{
									if(column + 1 < size){
										if(board[row][column+1] == "water"){
											board[row][column] = "submarine";
										}
									}
									else{
										board[row][column] = "submarine";
									}
								}
							}
						}
						else{
							if(column > 0){
								if(board[row][column-1] == "water"){
									if(column + 1 < size){
										if(board[row][column+1] == "water"){
											board[row][column] = "submarine";
										}
									}
									else{
										board[row][column] = "submarine";
									}
								}
							}
							else{
								if(column + 1 < size){
									if(board[row][column+1] == "water"){
										board[row][column] = "submarine";
									}
								}
								else{
									board[row][column] = "submarine";
								}
							}
						}
					}
				}
			}
		}	
	}
	
	solved = true;
	
	for(let row = 0; row < size; row++){
		for(let col = 0; col < size; col++){
			if(board[col][row] != boardAnswer[col][row]){
				solved = false;
			}
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
					CTX.arc((row+.5)*gridSize + 10,(col+.5)*gridSize + 10,10*gridSize/50,0,2*Math.PI,false);
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
			
	await sleep(10);		
	if(solved && !differenceMode){
		alert("Puzzle solved!");
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
		
		if(!BoardSolver()){
			//replace removed square
			boardQuestion[row][column] = removedSquare;
		}
	}
	
	boardWork = new Array(size);
	for(let i = 0; i < size; i++){
		boardWork[i] = new Array(size);
		for(let j = 0; j < size; j++){
			boardWork[i][j] = boardQuestion[i][j];
		}
	}
	
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


//Main logic for creating a new problem/solving an entered problem
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


//Button Events
$("#btnHelp").click(function(){
	location.href = 'help.html';
});

$("#btnReset").click(function(){
	let size = boardQuestion.length;
	for(let i = 0; i < size; i++){
		for(let j = 0; j < size; j++){
			boardWork[i][j] = boardQuestion[i][j];
		}
	}
	
	DisplayBoard(boardWork);
});

$("#btnSolution").click(function() {
	let size = boardAnswer.length;
	boardDifference = new Array(size);
	for(let i = 0; i < size; i++){
		boardDifference[i] = new Array(size);
		for(let j = 0; j < size; j++){
			if(boardWork[i][j] == boardAnswer[i][j]){
				boardDifference[i][j] = false;
			}
			else{
				boardDifference[i][j] = true;
			}
		}
	}
	DisplayBoard(boardAnswer);
});

$("#NewProblemSubmitButton").click(function(){
	let size = $("#size")[0].value;
	if(isNaN(size)){
		$("#size")[0].value = "";
		$("#size")[0].placeholder = "Please enter a number.";
	}
	else{
		let Size = Number(size);
		console.log(Size);
		console.log(parseInt(Size,10));
		console.log(Size === parseInt(Size,10));
		$("#size")[0].placeholder = "";
		if(Size <= 0){
			$("#size")[0].value = "";
			$("#size")[0].placeholder = "Please enter a positive number.";
		}
		else if(!(Size === parseInt(Size,10))){
			$("#size")[0].value = "";
			$("#size")[0].placeholder = "Please enter a whole number.";
		}
		else{//Good problem
			NewProblem(size);
			$("#NewProblemModal").modal('hide');
		}
	}
});


//Helper functions
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

$("canvas").click(function(){
	let canvas = $("canvas");
	let canoffset = canvas.offset();
	let canWidth = canvas[0].offsetWidth;
	let canHeight = canvas[0].offsetHeight;
	let x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
	let y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
		
	let size = boardQuestion.length;

	console.log(x + "," + y);

	let ratio = canWidth/552.0;

	x = Math.floor( (x-10)/(500*ratio/size) );
	y = Math.floor( (y-10)/(500*ratio/size) );

	let column = x < 0 ? NaN : x >= size ? NaN : x;
	let row = y < 0 ? NaN : y >= size ? NaN : y;

	console.log("row: " + row + ", column: " + column);

	if(!isNaN(row) && !isNaN(column)){
		if(boardQuestion[row][column] == "empty"){ //Allowable click
			if(boardWork[row][column] == "empty"){
				boardWork[row][column] = "water";
			}
			else if(boardWork[row][column] == "water"){
				boardWork[row][column] = "unknown";
			}
			else{
				boardWork[row][column] = "empty";
			}
			DisplayBoard(boardWork);
		}
	}
	
})