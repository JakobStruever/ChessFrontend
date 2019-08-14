import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CellComponent } from './cell/cell.component';
import { PieceComponent } from './piece/piece.component';

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    PieceComponent
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
