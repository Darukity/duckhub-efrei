import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'form[focusInvalid]',
  standalone: true,
})
export class FocusInvalidDirective {
  @HostListener('submit', ['$event'])
  onSubmit(e: Event) {
    const form = e.target as HTMLElement;
    const invalid = form.querySelector<HTMLElement>('.ng-invalid, [aria-invalid="true"]');
    if (invalid && typeof invalid.focus === 'function') invalid.focus();
  }
}
