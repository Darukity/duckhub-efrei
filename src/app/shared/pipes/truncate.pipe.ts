import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true, pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, max = 120, suffix = '…'): string {
    const v = value ?? '';
    return v.length > max ? v.slice(0, max).trimEnd() + suffix : v;
  }
}
