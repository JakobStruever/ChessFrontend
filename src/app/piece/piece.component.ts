import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Piece, PieceType, Player} from '../piece'
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';


@Component({
	selector: 'app-piece',
	animations: [
		trigger('jiggle',[
			state('normal', style({
				position: 'relative',
				top: '50%' ,
				left: '50%' ,
				transform: 'translate(-50%, -50%)',
			})),
			state('normal2', style({
				position: 'relative',
				top: '50%' ,
				left: '50%' ,
				transform: 'translate(-50%, -50%)',
			})),
			transition('normal => normal2' , [
				animate ('820ms', 
					keyframes([
						style({ transform: 'translate3d(-49%,-50%,0)' }),
						style({ transform: 'translate3d(-52%,-50%,0)' }),
						style({ transform: 'translate3d(-48%,-50%,0)' }),
						style({ transform: 'translate3d(-54%,-50%,0)' }),
						style({ transform: 'translate3d(-48%,-50%,0)' }),
						style({ transform: 'translate3d(-54%,-50%,0)' }),
						style({ transform: 'translate3d(-48%,-50%,0)' }),
						style({ transform: 'translate3d(-52%,-50%,0)' }),
						style({ transform: 'translate3d(-49%,-50%,0)' }),
					])
				),
			]),
			transition('normal2 => normal' , [
				animate ('1ms'),
			]),
		]),
	],
	templateUrl: './piece.component.html',
	styleUrls: ['./piece.component.css']
	
})
export class PieceComponent implements OnInit {
  @Input() piece: Piece;
  jiggle: boolean;
  imagePath: string;
  shouldRender: boolean = false;
  constructor() { 
  }
	ngOnChanges(changes: SimpleChanges) {
		console.log(changes.piece.currentValue.jiggle);
		if(changes.piece.currentValue.type !== PieceType.NoPiece){
			if(changes.piece.currentValue.jiggle){
				this.jiggle = false;
				this.jiggle = true;
			}
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
