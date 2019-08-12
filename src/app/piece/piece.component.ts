import { Component, OnInit, Input } from '@angular/core';
import { Piece, PieceType, Player} from '../piece'
@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {
  @Input() piece: Piece;
  imagePath: string;
  shouldRender: boolean = false;
  constructor() { 
  }
	ngOnChanges(changes: SimpleChanges) {
		if(changes.piece.currentValue.type !== PieceType.NoPiece){
			this.shouldRender = true;
			let tmpPath: string = "../../assets/";
			switch(changes.piece.currentValue.type){
				case PieceType.Pawn:
				tmpPath += "Pawn";
				break;
				case PieceType.Rook:
				tmpPath += "Rook";
				break;
				case PieceType.Knight:
				tmpPath += "Knight";
				break;
				case PieceType.Bishop:
				tmpPath += "Bishop";
				break;
				case PieceType.Queen:
				tmpPath += "Queen";
				break;
				case PieceType.King:
				tmpPath += "King";
				break;
			}
			if(changes.piece.currentValue.owner === Player.Human){
				tmpPath += "Wh.svg";
			}else if(changes.piece.currentValue.owner === Player.AI){
				tmpPath += "Bl.svg";
			}
			this.imagePath = tmpPath;
		}else{
			this.shouldRender = false;
		}
	}
  ngOnInit() {
  }

}
