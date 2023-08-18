import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[possWebBlockCopyPaste]'
})
export class BlockCopyPasteDirective {
  @Input('possWebBlockCopyPaste') value: boolean;

  @HostListener('contextmenu', ['$event'])
  @HostListener('paste', ['$event'])
  @HostListener('copy', ['$event'])
  @HostListener('cut', ['$event'])
  onEvent(event) {
    if (this.value) {
      event.preventDefault();
    }
  }
}
