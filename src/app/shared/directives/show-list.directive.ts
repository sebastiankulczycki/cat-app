import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

@Directive({
  selector: '[showList]',
})
export class ShowListDirective implements AfterViewInit {
  @Input('showList')
  listId!: string;

  rootElRect: any;
  listElement!: HTMLElement;

  windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  private renderer: Renderer2;

  constructor(private el: ElementRef, rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngAfterViewInit(): void {
    this.listElement = <HTMLElement>document.getElementById(this.listId);
    this.renderer.setStyle(this.listElement, 'position', 'absolute');
    this.renderer.setStyle(this.listElement, 'top', '0');
    this.renderer.setStyle(this.listElement, 'left', '0');
    this.renderer.setStyle(this.listElement, 'opacity', '0');
    this.renderer.setStyle(this.listElement, 'z-index', '999');
    this.renderer.listen(this.listElement, 'mouseleave', () => {
      this.renderer.setStyle(this.listElement, 'opacity', '0');
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    this.rootElRect = this.el.nativeElement.getBoundingClientRect();
    const listRect = this.listElement.getBoundingClientRect();
    this.renderer.setStyle(
      this.listElement,
      'top',
      `${this.rootElRect.top + this.rootElRect.height + 5}px`
    );
    this.renderer.setStyle(
      this.listElement,
      'left',
      `${this.rootElRect.right - listRect.width - this.rootElRect.width}px`
    );

    const displayValue = this.listElement.style.opacity === '1' ? '0' : '1';
    this.renderer.setStyle(this.listElement, 'opacity', displayValue);
  }
}
