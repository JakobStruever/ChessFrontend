import { Component } from '@angular/core';
import { Cell } from './cell'
import { Piece, PieceType, Player } from './piece';
import { APIService } from './api.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	board: Array<Array<Cell>> = new Array();
	private pieceClicked: boolean = false;
	private lastCellClicked: Cell;
	private availableCells :Array<string> = new Array();
	private logMessage: string ="";
	private turn: number = 1;
	constructor(private apiService: APIService){ }
	
	async onClicked(emitter: Cell){
		if(emitter.pieceOnCell.owner === Player.Human){
			var val = await this.apiService.getPossibleMoves(this.apiService.translatePosIntoString(emitter.positionX, emitter.positionY));
			this.stopDisplayingAvailableMoves();
			if(val.moves.length > 0){
				this.displayAvailableMoves(val.moves);
				this.lastCellClicked = emitter;
				this.pieceClicked = true;
			}else{
				this.board[emitter.positionY][emitter.positionX].pieceOnCell = {type: emitter.pieceOnCell.type, owner: emitter.pieceOnCell.owner, jiggle: true};
			}
		}else if(this.pieceClicked){
			if(emitter.available){
				//move the piece
				await this.apiService.makeMove(this.apiService.translatePosIntoString(this.lastCellClicked.positionX, this.lastCellClicked.positionY), this.apiService.translatePosIntoString(emitter.positionX, emitter.positionY));
				this.movePiece(this.apiService.translatePosIntoString(this.lastCellClicked.positionX, this.lastCellClicked.positionY), this.apiService.translatePosIntoString(emitter.positionX, emitter.positionY));
				this.stopDisplayingAvailableMoves();

				var move = await this.apiService.makeAIMove();
				this.movePiece(move.from, move.to);
			}else{
				this.stopDisplayingAvailableMoves();
			}
			this.pieceClicked = false;
		}
	}
	
	displayAvailableMoves(list: Array<string>){
		for(var i=0; i<list.length;i++){
			var point = this.apiService.translateStringIntoPos(list[i]);
			if(point.x > 7 || point.x <0 || point.y >7 || point.y<0){
				continue;
			}
			var oldCell = this.board[point.y][point.x];
			this.board[point.y][point.x] = {positionX: oldCell.positionX, positionY: oldCell.positionY, pieceOnCell: oldCell.pieceOnCell, available: true};
		}
		this.availableCells = list;
	}
	
	stopDisplayingAvailableMoves(){
		for(var i=0; i<this.availableCells.length; i++){
			var point = this.apiService.translateStringIntoPos(this.availableCells[i]);	
			if(point.x > 7 || point.x <0 || point.y >7 || point.y<0){
				continue;
			}
			var oldCell = this.board[point.y][point.x];
			this.board[point.y][point.x] = {positionX: oldCell.positionX, positionY: oldCell.positionY, pieceOnCell: oldCell.pieceOnCell, available: false};
		}
		this.availableCells = [];
	}
	
	async movePiece(from: string, to: string){
		var fromPoint = this.apiService.translateStringIntoPos(from);
		var toPoint = this.apiService.translateStringIntoPos(to);
		this.board[toPoint.y][toPoint.x].pieceOnCell = {type: this.board[fromPoint.y][fromPoint.x].pieceOnCell.type, owner: this.board[fromPoint.y][fromPoint.x].pieceOnCell.owner, jiggle: false};
		this.board[fromPoint.y][fromPoint.x].pieceOnCell = {owner: Player.None, type: PieceType.NoPiece, jiggle: false};
		var resp = await this.apiService.checkmate();
		this.logMessage = this.composeLogMessage(from, to, resp.status === "check mate");
		this.turn++;
	}
	
	composeLogMessage(from: string, to: string, gameOver: boolean): string{
		var message = "Turn "+ this.turn+": ";		
		var currentPlayer = "";
		if(this.turn%2 === 0){
			currentPlayer = "Black";
		}else{
			currentPlayer = "White"
		}
		message += currentPlayer;
		message += " moved from "+ from + " to " + to+ "<br>";
		if(gameOver){
			message += "Checkmate! "+ currentPlayer +" wins!"
		}
		return message;
	}
	
	ngOnInit() {
		//Gets a game id from the Backend API
		this.apiService.startNewMatch();
		//Establishes the board
		for(var i = 0; i<64; i++){
			if(i%8 === 0){
				this.board.push([]);
			}
			this.board[Math.floor(i/8)].push(new Cell(i%8, Math.floor(i/8)));
		}
		//Places all pieces on the board
		this.resetBoard();
	}
	
	resetBoard(){
		this.placePieces();
		this.assignPieces();
	}
	
	placePieces(){
		for(var i = 0; i<8; i++){
			for(var j = 0; j<8; j++){
				//Place Pawns
				if(i===1 || i===6){
					this.board[i][j].pieceOnCell.type = PieceType.Pawn;		
				//Place Rest
				}else if(i%7 === 0){
					if(j%7 === 0){
						this.board[i][j].pieceOnCell.type = PieceType.Rook;					
					}else if(j === 1 || j === 6){
						this.board[i][j].pieceOnCell.type = PieceType.Knight;					
					}else if(j === 2 || j === 5){
						this.board[i][j].pieceOnCell.type = PieceType.Bishop;					
					}else if(j === 3){
						this.board[i][j].pieceOnCell.type = PieceType.Queen;					
					}else if(j === 4){
						this.board[i][j].pieceOnCell.type = PieceType.King;					
					}
				}
			}
		}
	}
	
	assignPieces(){
		for(var i = 0; i<8; i++){
			for(var j = 0; j<8; j++){
				if(i===0 || i===1){
					this.board[i][j].pieceOnCell.owner = Player.AI;
				}else if(i===6 || i===7){
					this.board[i][j].pieceOnCell.owner = Player.Human;
				}
			}
		}

	}
}
