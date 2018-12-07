import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Result as MetaResult,
  Component as MetaComponent,
} from '@sketchmine/code-analyzer/lib/@types';

@Injectable({ providedIn: 'root' })
export class MetaService {

  host = `${environment.host}${environment.port?':':''}${environment.port}/`;
  url = `${this.host}assets/meta-information.json`;
  meta: Observable<MetaComponent[]> = undefined;
  constructor(private http: HttpClient) { }

  getMeta(): Observable<MetaComponent[]> {
    if (!this.meta) {
      this.meta = this.http.get<MetaResult>(this.url).pipe(map((result: MetaResult) =>
          Object.values(result.components)));
    }
    return this.meta;
  }
}
