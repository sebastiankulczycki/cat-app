import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-scroll-observer',
  templateUrl: './scroll-observer.component.html',
  styleUrls: ['./scroll-observer.component.scss'],
})
export class ScrollObserverComponent {
  @Output('positionReached') public positionReached: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  protected onPositionReached(): void {
    this.positionReached.emit(true);
  }
}
