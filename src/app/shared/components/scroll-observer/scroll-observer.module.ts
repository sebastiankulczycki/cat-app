import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollObserverComponent } from './scroll-observer.component';
import { ScrollObserverDirective } from '../../directives/scroll-observer.directive';

@NgModule({
  declarations: [ScrollObserverComponent, ScrollObserverDirective],
  imports: [CommonModule],
  exports: [ScrollObserverComponent],
})
export class ScrollObserverModule {}
