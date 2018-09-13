import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Meta } from './meta.interface';




@Injectable({ providedIn: 'root' })
export class MetaService {

  host = `${environment.host}${environment.port?':':''}${environment.port}/`;
  url = `${this.host}assets/meta-information.json`;
  result: Meta.Result;
  constructor(private http: HttpClient) { }

  getMeta(): Observable<Meta.Result> {
    return this.http.get<Meta.Result>(this.url);
  }
}
