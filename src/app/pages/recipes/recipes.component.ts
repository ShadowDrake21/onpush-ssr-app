import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApiService } from '@services/api.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { IRecipe, IRecipeWithAddInfo } from '@shared/models/recipe.model';
import { ReusableCardComponent } from '@shared/components/reusable-card/reusable-card.component';
import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fromNumberToArr } from '@shared/utils/array.utils';
import { inputClasses, recipesSpanClasses } from '@shared/classes/ui.classes';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    ReusableCardComponent,
    AsyncPipe,
    JsonPipe,
    FormsModule,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent implements OnInit {
  inputClasses = inputClasses;
  recipesSpanClasses = recipesSpanClasses;

  private apiService = inject(ApiService);

  recipesWithInfo$!: Observable<IRecipeWithAddInfo>;
  searchTermControl = new FormControl<string>('');

  recipesPerPage: number = 2;
  visibleRecipes = signal<IRecipe[]>([]);

  currentPaginationPagesSig = signal(1);
  totalRecipes: number = 0;

  ngOnInit(): void {
    this.searchRecipe();
  }

  searchRecipe() {
    this.recipesWithInfo$ = this.searchTermControl.valueChanges.pipe(
      startWith(this.searchTermControl.value),
      debounceTime(700),
      filter((term) => !!term),
      distinctUntilChanged(),
      switchMap((term) => this.apiService.searchRecipe(term || '')),
      tap((result) => {
        this.totalRecipes = result.total;
        this.setVisibleRecipes();
      }),
      shareReplay(1)
    );
  }

  setVisibleRecipes() {
    const startIndex =
      (this.currentPaginationPagesSig() - 1) * this.recipesPerPage;
    const endIndex = startIndex + this.recipesPerPage;
    this.recipesWithInfo$.subscribe(({ recipes }) => {
      this.visibleRecipes.set(recipes.slice(startIndex, endIndex));
    });
  }

  onNextOrPrevPage(action: 'next' | 'prev') {
    if (action === 'next') {
      if (
        this.currentPaginationPagesSig() * this.recipesPerPage <
        this.totalRecipes
      ) {
        this.currentPaginationPagesSig.set(
          this.currentPaginationPagesSig() + 1
        );
        this.setVisibleRecipes();
      }
    } else {
      if (this.currentPaginationPagesSig() > 1) {
        this.currentPaginationPagesSig.set(
          this.currentPaginationPagesSig() - 1
        );
        this.setVisibleRecipes();
      }
    }
  }

  changePaginationPage(pageNum: number) {
    if (
      pageNum > 0 &&
      (pageNum - 1) * this.recipesPerPage < this.totalRecipes
    ) {
      this.currentPaginationPagesSig.set(pageNum);
      this.setVisibleRecipes();
    }
  }

  fromNumberToArr = fromNumberToArr;
}
