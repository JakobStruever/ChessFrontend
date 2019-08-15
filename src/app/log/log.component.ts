import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
	@ViewChild('logger')
	private loggerDiv: ElementRef;
	@Input() movement: String;
	//logContent: string = "";
	constructor() { }

	ngOnInit() {
	}
	
	async ngOnChanges(changes: SimpleChanges) {
		if(changes.movement.currentValue === ""){
			return;
		}
		this.loggerDiv.nativeElement.innerHTML += changes.movement.currentValue;
		//this.logContent += changes.movement.currentValue;
		this.loggerDiv.nativeElement.scrollTop = this.loggerDiv.nativeElement.scrollHeight;
	}

}
