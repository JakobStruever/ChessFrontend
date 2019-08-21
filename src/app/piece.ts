export enum PieceType {
	NoPiece,
    Pawn,
    Rook,
    Knight,
    Bishop,
	Queen,
	King
}

export enum Player{
	None,
	Human,
	AI
}

export class Piece{
	type: PieceType;
	owner: Player;
	jiggle: boolean;
	
	constructor(t: PieceType, o: Player, j: boolean){
		this.type = t;
		this.owner = o;
		this.jiggle = j;
	}
}