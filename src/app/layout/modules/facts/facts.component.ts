import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

  masonryOptions: NgxMasonryOptions = {
    columnWidth: 'mat-card',
    gutter: 20,
  };

  constructor(private factsService: FactsService) {}

  ngOnInit(): void {
    this.getFacts();
  }

  getFacts(): void {
    this.factsService.getFacts(24);
  }

  getTextHeight(text: string): string {
    const height = Math.ceil(text.length / 25) * 20; // 50 - liczba znaków na wiersz, 20px - wysokość pojedynczego wiersza
    return `${height}px`;
  }
}
