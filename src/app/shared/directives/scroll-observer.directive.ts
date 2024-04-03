import {
  Directive,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';

@Directive({
  selector: '[scrollObserver]',
})
export class ScrollObserverDirective implements AfterViewInit, OnDestroy {
  @Output() public readonly positionReached: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  private _observer!: IntersectionObserver;
  private readonly el: ElementRef = inject(ElementRef);

  public constructor() {
    this._observer = this._setObserver();
  }

  public ngAfterViewInit(): void {
    this._observeElement();
  }

  public ngOnDestroy() {
    this._observer.disconnect();
  }

  private _setObserver(): IntersectionObserver {
    return new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.positionReached.emit(true);
          }
        });
      },
      { threshold: 1 }
    );
  }

  private _observeElement(): void {
    setTimeout(() => {
      this._observer.observe(this.el.nativeElement);
    }, 0);
  }
}
