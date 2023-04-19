import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[scrollObserver]',
})
export class ScrollObserverDirective implements OnDestroy {
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

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

//   ngAfterViewInit(): void {
//     this.ngZone.runOutsideAngular(() => {
//       setTimeout(() => {
//         window.addEventListener('scroll', () => this.onScroll());
//       }, 0);
//     });
//   }

//   ngOnDestroy(): void {
//     this.ngZone.runOutsideAngular(() => {
//       window.removeEventListener('scroll', () => this.onScroll());
//     });
//   }

//   onScroll(): void {
//     console.log(window.scrollY + window.innerHeight);
//     console.log(this.el.nativeElement.offsetHeight);
//     if (
//       window.scrollY + window.innerHeight ===
//       this.el.nativeElement.offsetHeight
//     ) {
//       console.log('run');

//       this.ngZone.run(() => {
//         console.log('run');
//         this.factsService.getFacts(24);
//       });
//     }
