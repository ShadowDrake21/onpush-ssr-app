// Angular stuff
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, delay, shareReplay, Subscription, tap } from 'rxjs';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

// components
import { ListSkeletonComponent } from '@shared/components/list-skeleton/list-skeleton.component';

// services
import { ApiService } from '@services/api.service';

// interfaces
import { IQuote } from '@shared/models/quote.model';

// utils
import { generateItemsCount } from '@shared/utils/select.utils';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
    FontAwesomeModule,
    ListSkeletonComponent,
  ],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotesComponent implements OnDestroy {
  faTrash = faTrash;
  faEdit = faEdit;
  faDownload = faDownload;

  @ViewChild('quotesTable') table!: ElementRef<HTMLTableElement>;

  private apiService = inject(ApiService);
  private cdRef = inject(ChangeDetectorRef);

  private quotes$$ = new BehaviorSubject<IQuote[]>([]);

  customQuote: string = '';
  selectedRandomCount: number = 1;

  quotes$ = this.quotes$$.asObservable();
  actionTitle$$ = new BehaviorSubject<string>('Fetch!');

  editQuote: number | null = null;

  private subscriptions: Subscription[] = [];

  onCreateCustomQuote() {
    const existingQuotes = this.quotes$$.getValue();
    const newQuote = {
      id: new Date().getTime(),
      quote: this.customQuote,
      author: 'Me',
    };
    this.quotes$$.next([...existingQuotes, newQuote]);
    this.customQuote = '';
    this.cdRef.markForCheck();
  }

  onFetchRandom() {
    const randomQuoteSubscription = this.apiService
      .getRandomQuote(this.selectedRandomCount)
      .pipe(
        delay(600),
        tap((quotes) => this.quotes$$.next(quotes)),
        tap(() => {
          if (this.actionTitle$$.getValue() === 'Fetch!')
            this.actionTitle$$.next('Regenerate!');
          this.cdRef.markForCheck();
        }),
        shareReplay()
      )
      .subscribe();

    this.subscriptions.push(randomQuoteSubscription);
  }

  onQuoteRemove(id: number) {
    const updatedTodos = this.quotes$$
      .getValue()
      .filter((quote) => quote.id !== id);
    this.quotes$$.next(updatedTodos);

    if (!updatedTodos.length) {
      this.actionTitle$$.next('Fetch!');
    }
    this.cdRef.markForCheck();
  }

  onChangeQuoteField(event: Event, quoteId: number, field: keyof IQuote) {
    const allQuotes = this.quotes$$.getValue();
    const updatedField = (event.target as HTMLInputElement).value;

    const updatedQuotes = allQuotes.map((quote) =>
      quote.id === quoteId ? { ...quote, [field]: updatedField } : quote
    );

    this.quotes$$.next(updatedQuotes);
    this.cdRef.markForCheck();
  }

  onTableDownload() {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(this.quotes$$.getValue())], {
      type: 'text/plain',
    });
    a.href = URL.createObjectURL(file);
    a.download = 'table.json';
    a.click();
  }

  generateItemsCount = generateItemsCount;

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
