import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Library as MetaLibrary,
  Component as MetaComponent,
} from '@sketchmine/code-analyzer/lib/@types';

const META_URL = '/assets/meta-information.json';

@Injectable({ providedIn: 'root' })
export class MetaService {

  meta: Observable<MetaComponent[]> = undefined;

  constructor(private http: HttpClient) { }

  getMeta(): Observable<MetaComponent[]> {
    if (!this.meta) {
      this.meta = this.http.get<MetaLibrary>(META_URL).pipe(map((result: MetaLibrary) =>
          Object.values(result.components)));
    }
    return this.meta;
  }
}
