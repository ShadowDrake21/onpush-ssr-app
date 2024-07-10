import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { generateItemsCount } from '../../shared/utils/select.utils';
import { EMPTY, Observable } from 'rxjs';
import { IQuote } from '../../shared/models/quote.model';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass, AsyncPipe],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotesComponent {
  private apiService = inject(ApiService);
  private cdRef = inject(ChangeDetectorRef);

  customQuote: string = '';
  selectedRandomCount: number = 1;
  actionTitle: string = 'Fetch!';

  quotes$: Observable<IQuote[]> = EMPTY;

  onFetchRandom() {
    this.quotes$ = this.apiService.getRandomQuote();
  }

  generateItemsCount = generateItemsCount;
}
