import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Replaces :EMOTE: tokens with <img> tags pointing to /assets/emotes/<name>.<ext>
 *
 * Usage examples:
 *  [innerHTML]="'Welcome :Quack: to DuckHub :Bruh:' | emote:28:'align-middle'"
 *  [innerHTML]="'Animated :Bruh: and static :Quack:' | emote:24:'align-middle':'png':{ Bruh: 'gif' }"
 *
 * Params:
 *  - size: number (px) → width/height inline
 *  - extraClass: string of classes for <img>
 *  - defaultExt: 'png' | 'gif' | 'webp' ... (applies to all tokens unless overridden)
 *  - extOverrides: Record<string, string> → per-emote extension (case-insensitive keys)
 */
@Pipe({
  name: 'emote',
  standalone: true,
  pure: true,
})
export class EmotePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(
    input: string | null | undefined,
    size = 24,
    extraClass = '',
    defaultExt = 'png',
    extOverrides?: Record<string, string>
  ): SafeHtml {
    if (!input) return '';

    // Normalize override keys to lowercase for case-insensitive matching
    const overrides: Record<string, string> = {};
    if (extOverrides) {
      for (const k of Object.keys(extOverrides)) {
        overrides[k.toLowerCase()] = extOverrides[k];
      }
    }

    const re = /:([A-Za-z0-9_-]+):/g;

    const html = input.replace(re, (_m, rawName: string) => {
      const fileName = rawName.toLowerCase();
      const ext = overrides[fileName] ?? defaultExt;
      const cls = `emote ${extraClass}`.trim();
      const alt = rawName; // keep original case as alt/title
      return `<img src="/assets/emotes/${fileName}.${ext}" alt="${alt}" title="${alt}" class="${cls}" style="width:${size}px;height:${size}px;" loading="lazy">`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
