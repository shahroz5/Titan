import { Directive, OnInit, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[possWebInput]'
})
export class PossWebInputDirective implements OnInit {
  defaultValue: any = this.control.value;

  constructor(private control: NgControl, private elementRef: ElementRef) {}

  ngOnInit() {
    this.defaultValue = this.control.control.value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
    if (event.key === 'Escape') {
      this.control.control.setValue(this.defaultValue);
    }
  }

  @HostListener('change', [])
  onChange() {
    if (
      this.elementRef &&
      this.elementRef.nativeElement &&
      this.elementRef.nativeElement.type === 'number'
    ) {
      this.elementRef.nativeElement.focus();
    }
  }
}
