import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true,
})
export class ImageFallbackDirective {
  @Input() appImageFallback: string = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800';

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  loadFallback() {
    this.el.nativeElement.src = this.appImageFallback;
  }
}
