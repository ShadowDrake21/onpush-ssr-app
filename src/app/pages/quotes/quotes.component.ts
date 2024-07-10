import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { generateItemsCount } from '../../shared/utils/select.utils';
import {
  BehaviorSubject,
  concatMap,
  delay,
  EMPTY,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { IQuote } from '../../shared/models/quote.model';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass, AsyncPipe, FontAwesomeModule],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotesComponent implements AfterViewInit, OnDestroy {
  faTrash = faTrash;
  faEdit = faEdit;

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

  ngAfterViewInit(): void {
    // const quotesTable = this.table.nativeElement;
  }

  onChangeQuoteText(event: Event, quoteId: number) {
    const allQuotes = this.quotes$$.getValue();
    const updatedQuoteText = (event.target as HTMLInputElement).value;

    const updatedQuotes = allQuotes.map((quote) =>
      quote.id === quoteId ? { ...quote, quote: updatedQuoteText } : quote
    );

    this.quotes$$.next(updatedQuotes);
    this.cdRef.markForCheck();
  }

  generateItemsCount = generateItemsCount;

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
