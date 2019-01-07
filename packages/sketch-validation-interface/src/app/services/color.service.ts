import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommunicationService } from './communication.service';
import { MatSnackBar } from '@angular/material';

const REPO_URL = 'github/'; // 'https://github.com/Dynatrace/sketchmine/';
const COLORS_FILE = 'Dynatrace/sketchmine/blob/master/packages/sketch-validator/tests/fixtures/_colors.scss';

@Injectable({
  providedIn: 'root',
})
export class ColorService {

  private colorsUrl = `${REPO_URL}${COLORS_FILE}`;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private communication: CommunicationService,
    private snackBar: MatSnackBar,
  ) {
    this.headers = new HttpHeaders();
    this.headers.set('Content-Type', 'text/plain; charset=utf-8');
    this.headers.set('Access-Control-Allow-Origin', '*');
  }

  getColors(): Observable<string> {
    return this.http.get(
      this.colorsUrl,
      { headers: this.headers, responseType: 'text' },
    ).pipe(
      catchError(this.handleError<string>('getColors', '')),
    );
  }

  private log(message: string) {
    this.communication.inform(`ColorService: ${message}`);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackBar.open('🚨 Could not load the colors definition file!');
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
