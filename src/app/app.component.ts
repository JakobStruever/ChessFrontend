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
	whitePiecesLost: Array<Piece> = new Array();
	blackPiecesLost: Array<Piece> = new Array();
	gameOver: boolean = true;
	private pieceClicked: boolean = false;
	private lastCellClicked: Cell;
	private availableCells :Array<string> = new Array();
	logMessage: string ="";
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
	
	startNewMatch(){
		this.gameOver = false;
		this.whitePiecesLost = [];
		this.blackPiecesLost = [];
		this.resetBoard();
		this.apiService.startNewMatch();
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
		//Check if a piece was beaten, if so, let the logger know
		if(this.board[toPoint.y][toPoint.x].pieceOnCell.owner != Player.None){
			var lostPiece = new Piece(this.board[toPoint.y][toPoint.x].pieceOnCell.type, this.board[toPoint.y][toPoint.x].pieceOnCell.owner, false)
			if(lostPiece.owner == Player.Human){
				this.whitePiecesLost.push(lostPiece);
			}else if(lostPiece.owner == Player.AI){
				this.blackPiecesLost.push(lostPiece);				
			}
		}
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
		//this.apiService.startNewMatch();
		//Establishes the board
		for(var i = 0; i<64; i++){
			if(i%8 === 0){
				this.board.push([]);
			}
			this.board[Math.floor(i/8)].push(new Cell(i%8, Math.floor(i/8)));
		}
		this.fillSideBoards();
		//Places all pieces on the board
		//this.resetBoard();
	}
	
	fillSideBoards(){
		for(var i = 0; i<8; i++){
			this.whitePiecesLost.push(new Piece(PieceType.Pawn, Player.Human, false));
			this.blackPiecesLost.push(new Piece(PieceType.Pawn, Player.AI, false));
		}
		for(var i = 0; i<2; i++){
			this.whitePiecesLost.push(new Piece(PieceType.Knight, Player.Human, false));
			this.blackPiecesLost.push(new Piece(PieceType.Knight, Player.AI, false));
		}
		for(var i = 0; i<2; i++){
			this.whitePiecesLost.push(new Piece(PieceType.Bishop, Player.Human, false));
			this.blackPiecesLost.push(new Piece(PieceType.Bishop, Player.AI, false));
		}
		for(var i = 0; i<2; i++){
			this.whitePiecesLost.push(new Piece(PieceType.Rook, Player.Human, false));
			this.blackPiecesLost.push(new Piece(PieceType.Rook, Player.AI, false));
		}

		this.whitePiecesLost.push(new Piece(PieceType.Queen, Player.Human, false));
		this.blackPiecesLost.push(new Piece(PieceType.Queen, Player.AI, false));

		this.whitePiecesLost.push(new Piece(PieceType.King, Player.Human, false));
		this.blackPiecesLost.push(new Piece(PieceType.King, Player.AI, false));
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
					this.board[i][j].pieceOnCell = new Piece(PieceType.Pawn, Player.None, false);
				//Place Rest
				}else if(i%7 === 0){
					if(j%7 === 0){
						this.board[i][j].pieceOnCell = new Piece(PieceType.Rook, Player.None, false);
					}else if(j === 1 || j === 6){
						this.board[i][j].pieceOnCell = new Piece(PieceType.Knight, Player.None, false);	
					}else if(j === 2 || j === 5){
						this.board[i][j].pieceOnCell = new Piece(PieceType.Bishop, Player.None, false);			
					}else if(j === 3){
						this.board[i][j].pieceOnCell = new Piece(PieceType.Queen, Player.None, false);	
					}else if(j === 4){
						this.board[i][j].pieceOnCell = new Piece(PieceType.King, Player.None, false);					
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
