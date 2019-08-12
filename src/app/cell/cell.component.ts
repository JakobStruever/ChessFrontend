import { Component, OnInit, Input } from '@angular/core';
import { Cell } from '../cell';

@Component({
	selector: 'app-cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
	@Input() cell: Cell;
	constructor() {
	}

	ngOnInit() {
	}
	
}

