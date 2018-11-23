import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AMP } from '../../../../src/angular-meta-parser/meta-information.d';

@Injectable({ providedIn: 'root' })
export class MetaService {

  host = `${environment.host}${environment.port?':':''}${environment.port}/`;
  url = `${this.host}assets/meta-information.json`;
  meta: Observable<AMP.Component[]> = undefined;
  constructor(private http: HttpClient) { }

  getMeta(): Observable<AMP.Component[]> {
    if (!this.meta) {
      this.meta = this.http.get<AMP.Result>(this.url).pipe(map((result: AMP.Result) =>
          Object.values(result.components)));
    }
    return this.meta;
  }
}
