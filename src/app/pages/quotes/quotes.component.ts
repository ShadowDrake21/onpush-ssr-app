import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { generateItemsCount } from '../../shared/utils/select.utils';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { EMPTY, Observable } from 'rxjs';
import { IQuote } from '../../shared/models/quote.model';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    DataViewModule,
    SkeletonModule,
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
  ],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotesComponent {
  private apiService = inject(ApiService);
  private cdRef = inject(ChangeDetectorRef);

  customQuote: string = '';
  selectedRandomCount: SelectItem = { label: `${1}`, value: 1 };
  actionTitle: string = 'Fetch!';

  layout: string = 'list';

  quotes$: Observable<IQuote[]> = EMPTY;

  onFetchRandom() {
    this.quotes$ = this.apiService.getRandomQuote();
  }

  generateItemsCount = generateItemsCount;
}
