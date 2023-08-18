import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { SelectDropDownOption } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-refresh-dropdown',
  templateUrl: './refresh-dropdown.component.html',
  styleUrls: ['./refresh-dropdown.component.scss']
})
export class RefreshDropdownComponent implements OnChanges {
  @Input() control = new FormControl();
  @Input() placeholder: string;
  @Input() options: SelectDropDownOption[] = [];
  @Input() disabled = false;
  @Input() required = false;

  @Output() selectionChange = new EventEmitter();
  @Output() openedChange = new EventEmitter();
  @Output() refreshClick = new EventEmitter();

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

  refresh(event: any) {
    event.stopPropagation();
    this.refreshClick.emit(true);
  }
}
