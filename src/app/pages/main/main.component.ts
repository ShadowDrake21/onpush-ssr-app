// Angular stuff
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// components
import { LinkComponent } from './components/link/link.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FontAwesomeModule, LinkComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {}
