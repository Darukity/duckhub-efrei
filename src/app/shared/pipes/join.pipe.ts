import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'join', standalone: true, pure: true })
export class JoinPipe implements PipeTransform {
  transform(value: unknown[] | null | undefined, sep = ', '): string {
    if (!value || value.length === 0) return '';
    return value.join(sep);
  }
}
