import { Component, OnInit } from '@angular/core';
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
  facts$: Observable<IFact[]> = this.factsService.facts$;
  allFactsLoaded: boolean = false;

  masonryOptions: NgxMasonryOptions = {
    columnWidth: 'mat-card',
    gutter: 20,
  };

  constructor(private factsService: FactsService) {}

  ngOnInit(): void {
    this.getFacts();

    this.facts$
      .pipe(
        filter((facts) => facts.length > 0),
        tap(() => {
          this.allFactsLoaded = true;
        })
      )
      .subscribe();
  }

  getFacts(): void {
    this.factsService.getFacts(24);
  }
}
