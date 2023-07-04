import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appAuthDirective]',
})
export class AuthDirectiveDirective {
  permission: string | undefined;
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('window:load')
  checkPermissions() {
    // Assuming you have a permission variable that stores the user's permission
    const isAdmin = this.permission === 'Admin';

    if (!isAdmin) {
      this.renderer.removeChild(
        this.elementRef.nativeElement.parentNode,
        this.elementRef.nativeElement
      );
    }
  }
}
