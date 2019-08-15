import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Cell } from '../cell';
import { Piece, Player } from '../piece';

@Component({
	selector: 'app-cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
	@Input() cell: Cell;
	@Output() clicked = new EventEmitter<Cell>();
	available: boolean;
	constructor() {
	}
	
	cellClicked(){
		this.clicked.emit(this.cell);
	}
	
	ngOnInit() {
	}
	
	ngOnChanges(changes: SimpleChanges) {
		this.available = changes.cell.currentValue.available;
	}
}

