import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Piece, PieceType, Player } from '../piece';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
	@ViewChild('logger',{static: true})
	private loggerDiv: ElementRef;
	@Input() movement: String;
	@Input() whitePiecesLost: Array<Piece> = new Array();
	@Input() blackPiecesLost: Array<Piece> = new Array();

	
	constructor() {}

	ngOnInit() {
	}
	async ngOnChanges(changes: SimpleChanges) {
		if(changes.movement !== undefined){
			if(changes.movement.currentValue === ""){
				return;
			}
			this.loggerDiv.nativeElement.innerHTML += changes.movement.currentValue;
			this.loggerDiv.nativeElement.scrollTop = this.loggerDiv.nativeElement.scrollHeight;
		}
	}

}
