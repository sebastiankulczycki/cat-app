import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { NgxMasonryModule } from 'ngx-masonry';

import {
  FACTS_SERVICE,
  FactsService,
} from '../../../shared/services/facts/facts.service';
import { ScrollObserverModule } from 'src/app/shared/components/scroll-observer/scroll-observer.module';

import { FactsComponent } from './facts.component';
import { FactsRoutingModule } from './facts.routing.module';

@NgModule({
  declarations: [FactsComponent],
  imports: [
    CommonModule,
    FactsRoutingModule,
    MatCardModule,
    NgxMasonryModule,
    ScrollObserverModule,
  ],
  providers: [{ provide: FACTS_SERVICE, useValue: FactsService }],
})
export class FactsModule {}
