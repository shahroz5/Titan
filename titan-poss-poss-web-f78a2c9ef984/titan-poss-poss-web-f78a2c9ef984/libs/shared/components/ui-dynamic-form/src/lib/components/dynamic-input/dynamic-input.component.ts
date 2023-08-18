import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { SelectOption } from '../../inputs/SelectOption';

@Component({
  selector: 'poss-web-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
  providers: []
})
export class DynamicInputComponent implements OnInit, AfterViewInit {
  @Input() field: any;

  @Input() form: FormGroup;
  @Input() style: string[];

  @Output() selectChange: EventEmitter<any> = new EventEmitter();
  @Output() radioChange: EventEmitter<any> = new EventEmitter();
  @Output() checkboxChange: EventEmitter<any> = new EventEmitter();
  @Output() selectRefreshClick: EventEmitter<string> = new EventEmitter();

  checkBoxArray: any[][] = [];

  dateTimePicker = '';
  datePicker = '';
  currentDate: any;
  statusOfToggle: boolean;
  constructor(
    private elRef: ElementRef,
    private selectionDialog: SelectionDialogService
  ) {}
  @ViewChild('selectionInput') selectionInput?: ElementRef;
  @ViewChild('dateTimeInput') dateTimeInput?: ElementRef;
  @ViewChild('dateInput') dateInput?: ElementRef;

  ngOnInit(): void {
    if (this.field.controlType === 'checkbox') {
      this.checkBoxArray[this.field.name] = this.field.options;
    }
    if (
      this.field.controlType === 'select' ||
      this.field.controlType === 'refreshSelect'
    ) {
      this.field.options = this.getSelectOptions(this.field.options);
    }

    if (this.field.min) {
      this.currentDate = moment();
    } else {
      this.currentDate = '';
    }
  }

  ngAfterViewInit() {
    if (typeof this.style !== 'undefined') {
      this.createStyle(this.style.join(' '));
    }
  }

  createStyle(style: string): void {
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(style));
    this.elRef.nativeElement.appendChild(styleElement);
  }

  getMinDate() {
    if (this.field.min) {
      let minDate =  Object.keys(this.form.controls).find(x => {
        let control =  this.form.controls[x] as any;
        return control.label  === this.field.min
      })
      if (minDate) {
        return this.form.controls[minDate].value
      } else {
        return this.currentDate = moment();
      }
    } else {
      return this.currentDate = '';
    }
  }

  public isValid(): boolean {
    return this.form.controls[this.field.name].valid;
  }

  onChange(selectedVal: any, name: string) {
    this.selectChange.emit({ selectedVal: selectedVal.value, name });
  }

  radioClick(name: string, value: string) {
    this.radioChange.emit({ name, value });
  }

  innerSelectChange(obj: { selectedVal: string; name: string }) {
    this.selectChange.emit(obj);
  }

  innerRadioChange(obj: { name: string; value: string }) {
    this.radioChange.emit(obj);
  }

  selectRefreshClickEvent(fieldName: string) {
    this.selectRefreshClick.emit(fieldName);
  }

  onSelectionClicked(selOptions: SelectOption[]) {
    const options: SelectionDailogOption[] = selOptions.map(data => {
      const newOptions: SelectionDailogOption = {
        id: data.value,
        description: data.label
      };
      return newOptions;
    });
    this.selectionDialog
      .open({
        title: 'Select',
        placeholder: 'Search',
        options
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          const input = this.selectionInput.nativeElement;
          input.value = selectedOption.id;
          input.dispatchEvent(new Event('input'));
        }
      });
  }

  clearSelectionClicked() {
    const input = this.selectionInput.nativeElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));
  }

  onDateTimeSelectChange(dateTime: string) {
    const input = this.dateTimeInput.nativeElement;
    input.value = dateTime;
    input.dispatchEvent(new Event('input'));
  }

  onDateSelectChange(date: string) {
    const input = this.dateInput.nativeElement;
    input.value = date;
    input.dispatchEvent(new Event('input'));
  }

  checkboxClick(name: string, value: string, option: any[], index: number) {
    this.checkboxChange.emit({ name, value, option, index });
  }

  innerCheckboxChanged(
    obj: { selectedVal: string; name: string; subformName: string },
    subformName: string
  ) {
    obj.subformName = subformName;
    this.checkboxChange.emit(obj);
  }

  isRequired(field: any) {
    let req = false;
    try {
      req = !!this.form.controls[field.name]
        .validator(field.name)
        .hasOwnProperty('required');
    } catch (e) {}
    return req;
  }

  getSelectOptions(
    options: { value: string; label?: string; description?: string }[]
  ) {
    return options.map(data => {
      return { value: data.value, description: data.label || data.description };
    });
  }
}
