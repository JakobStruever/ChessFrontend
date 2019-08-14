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
}