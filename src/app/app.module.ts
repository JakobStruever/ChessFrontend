import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CellComponent } from './cell/cell.component';
import { PieceComponent } from './piece/piece.component';
import { LogComponent } from './log/log.component';

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    PieceComponent,
    LogComponent
  ],
  imports: [
    BrowserModule,
	BrowserAnimationsModule,
	HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
