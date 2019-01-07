import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'values' })
export class ValuesPipe implements PipeTransform {

  transform(obj: Object): any[] {
    return Object.values(obj).filter(o => !!o);
  }
}
