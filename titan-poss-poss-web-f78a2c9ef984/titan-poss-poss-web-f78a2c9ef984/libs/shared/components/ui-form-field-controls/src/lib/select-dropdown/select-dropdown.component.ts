import { MatSelect } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { SelectDropDownOption } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDropdownComponent implements OnChanges {
  @Input() control = new FormControl();
  @Input() placeholder: string;
  @Input() options: SelectDropDownOption[] = [];
  @Input() disabled = false;
  @Input() required = false;
  @Input() isTooltip = false;

  @Output() selectionChange = new EventEmitter();
  @Output() openedChange = new EventEmitter();

  @ViewChild('dropdown') dropdownRef: MatSelect;

  @ViewChild('dropdown', { read: ElementRef })
  private dropdownElementRef: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      if (this.disabled) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }
  }

  focus() {
    this.dropdownElementRef?.nativeElement?.focus();
  }

  getReference() {
    return this.dropdownRef;
  }

  getTooltipDescription(value) {
    const description = this.options.filter(option =>
      option.value === value ? option.description : null
    )[0]?.description;
     
    return description ? description: null;
  }
}
