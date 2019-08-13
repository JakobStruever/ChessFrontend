import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


interface GameStartResponse{
	game_id: string,
	status: string,
	_id: string
}

interface ListPossibleMovesResponse{
	moves: Array<string>,
	_id: string
}

interface Point{
	x: number,
	y: number
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
  })
};

@Injectable({
  providedIn: 'root'
})


export class APIService {
	private gameID: string;
	constructor(private http: HttpClient) { }
	
	startNewMatch(){
		this.http.get<GameStartResponse>("https://chess-api-chess.herokuapp.com/api/v1/chess/one").subscribe((val) => {this.gameID = val.game_id});
	}
	
	async getPossibleMoves(position: string){
		const params = new HttpParams()
			.set('game_id', this.gameID)
			.set('position', position);
		return this.http.post<ListPossibleMovesResponse>("http://chess-api-chess.herokuapp.com/api/v1/chess/one/moves", params, httpOptions).toPromise();
	}
	
	//Translates from Array Indices to Chessboard notation (i.e. x:6 and y:7 becomes "g1")
	translatePosIntoString(x: number, y: number): string{
		return (String.fromCharCode(x+97)+""+(8-y));
	}
	
	translateStringIntoPos(s: string): Point{
		var p = {x: s.charCodeAt(0)-(+97), y: 8-(+s.charAt(1))};
		return p;
	}
	
	
}
