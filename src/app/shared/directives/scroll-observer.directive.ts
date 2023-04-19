import {
  Directive,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[scrollObserver]',
})
export class ScrollObserverDirective implements AfterViewInit, OnDestroy {
  @Output() positionReached = new EventEmitter<boolean>();

  private observer: IntersectionObserver;

  constructor(private el: ElementRef) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.positionReached.emit(true);
          }
        });
      },
      { threshold: 1 }
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.observer.observe(this.el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
