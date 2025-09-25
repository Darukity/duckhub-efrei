import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComicsService } from '../services/comics.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
    standalone: true,
    selector: 'app-comic-list',
    imports: [RouterLink, TruncatePipe],
    template: `
        <h1 class="text-xlarge font-bold mx-auto w-full text-center mb-4">Comics</h1>

        <div class="flex flex-wrap gap-6 justify-around">
            @for (c of svc.comics(); track c.id) {
                <a [routerLink]="['/comics', c.slug]" class="group border-0 w-[30rem] min-w-0 overflow-hidden hover:shadow flex-shrink-0">
                    <img [src]="c.coverUrl" [alt]="c.title" class="w-full rounded-3xl aspect-[3/5] object-cover" />
                    <div class="p-3">
                        <h2 class="font-semibold text-center group-hover:underline">{{ c.title | truncate:40 }}</h2>
                    </div>
                </a>
            }
        </div>
    `
})
export class ComicListComponent implements OnInit {
    svc = inject(ComicsService);
    ngOnInit() { this.svc.load(); }
}
