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
  @Input('showList') public listId!: string;

  private _rootElRect!: DOMRect;
  private _listElement!: HTMLElement;

  private readonly _renderer!: Renderer2;

  constructor(
    private readonly el: ElementRef,
    private readonly rendererFactory: RendererFactory2
  ) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  public ngAfterViewInit(): void {
    this._setListStyles();
    this._addListOnClickListener();
  }

  private _setListStyles(): void {
    this._listElement = <HTMLElement>document.getElementById(this.listId);
    this._renderer.setStyle(this._listElement, 'position', 'absolute');
    this._renderer.setStyle(this._listElement, 'top', '0');
    this._renderer.setStyle(this._listElement, 'left', '0');
    this._renderer.setStyle(this._listElement, 'opacity', '0');
    this._renderer.setStyle(this._listElement, 'z-index', '999');
  }

  private _addListOnClickListener(): void {
    this._renderer.listen(this._listElement, 'mouseleave', () => {
      this._renderer.setStyle(this._listElement, 'opacity', '0');
    });
  }

  @HostListener('click', ['$event'])
  private _onClick(event: MouseEvent): void {
    event.preventDefault();
    this._setListPosition();
    this._setListVisibility();
  }

  private _setListPosition(): void {
    this._rootElRect = this.el.nativeElement.getBoundingClientRect();
    const listRect = this._listElement.getBoundingClientRect();
    this._renderer.setStyle(
      this._listElement,
      'top',
      `${this._rootElRect.top + this._rootElRect.height + 5}px`
    );
    this._renderer.setStyle(
      this._listElement,
      'left',
      `${this._rootElRect.right - listRect.width - this._rootElRect.width}px`
    );
  }

  private _setListVisibility(): void {
    const displayValue = this._listElement.style.opacity === '1' ? '0' : '1';
    this._renderer.setStyle(this._listElement, 'opacity', displayValue);
  }
}
