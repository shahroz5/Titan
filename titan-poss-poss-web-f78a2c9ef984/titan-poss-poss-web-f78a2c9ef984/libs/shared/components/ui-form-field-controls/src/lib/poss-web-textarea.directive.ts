import { Directive, OnInit, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'textarea[possWebTextarea]'
})
export class PossWebTextareaDirective implements OnInit {
  defaultValue: any = this.control.value;

  constructor(private control: NgControl) {}

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
}
