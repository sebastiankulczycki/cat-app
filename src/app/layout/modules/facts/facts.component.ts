import { Component, OnInit, inject } from '@angular/core';
import { Observable, filter, tap } from 'rxjs';
import { IFact } from 'src/app/shared/interfaces/facts.interface';
import { FactsService } from 'src/app/shared/services/facts/facts.service';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
  selector: 'app-cats',
  templateUrl: './facts.component.html',
  styleUrls: ['./facts.component.scss'],
})
export class FactsComponent implements OnInit {
  protected allFactsLoaded: boolean = false;
  protected masonryOptions: NgxMasonryOptions = {
    columnWidth: 'mat-card',
    gutter: 20,
  };

  private readonly factsService: FactsService = inject(FactsService);
  private readonly _facts$: Observable<IFact[]> = this.factsService.facts$;

  constructor() {}

  public ngOnInit(): void {
    this.getFacts();

    this._facts$
      .pipe(
        filter((facts: IFact[]) => facts.length > 0),
        tap(() => {
          this.allFactsLoaded = true;
        })
      )
      .subscribe();
  }

  protected getFacts(): void {
    this.factsService.getFacts(24);
  }

  protected get facts$(): Observable<IFact[]> {
    return this._facts$;
  }
}
