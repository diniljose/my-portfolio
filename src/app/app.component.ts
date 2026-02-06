import { Component, inject, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchService } from './core/services';
import { CommandPaletteComponent } from './shared/components/command-palette/command-palette.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommandPaletteComponent],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <router-outlet />
    <app-command-palette />
  `,
  styles: [`:host { display: block; min-height: 100vh; }`],
})
export class AppComponent {
  private searchService = inject(SearchService);

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.searchService.toggle();
    }
  }
}
