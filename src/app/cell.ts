import { Piece, PieceType, Player } from './piece';
export class Cell{
	positionX: number;
	positionY: number;
	pieceOnCell: Piece;
	available: boolean = false;
	
	constructor(x: number, y: number) {
		this.positionX = x;
		this.positionY = y;
		this.pieceOnCell= {type: PieceType.NoPiece, owner:Player.None}
	}
}