import { Component } from '@angular/core';
import { Cell } from './cell'
import { Piece, PieceType, Player } from './piece';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	board: Array<Array<Cell>> = new Array();
  
	ngOnInit() {
		for(var i = 0; i<64; i++){
			if(i%8 === 0){
				this.board.push([]);
			}
			this.board[Math.floor(i/8)].push(new Cell(i%8, Math.floor(i/8)));
		}
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
