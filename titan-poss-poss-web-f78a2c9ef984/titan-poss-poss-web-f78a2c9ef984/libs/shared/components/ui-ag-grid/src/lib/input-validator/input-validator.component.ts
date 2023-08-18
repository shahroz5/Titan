import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-input-validator',
  templateUrl: './input-validator.component.html',
  styleUrls: ['./input-validator.component.scss']
})
export class InputValidatorComponent implements ICellEditorAngularComp {
  inputValidatorForm: FormGroup;
  autocomplete = 'off';
  oldValue: any;
  params: any;
  @ViewChild('input1') amountElement: ElementRef;
  @ViewChild('input2') percentElement: ElementRef;
  @ViewChild('input3') inputElement: ElementRef;
  enableFocus: boolean;

  private specialKeys: Array<string> = ['Tab'];

  constructor(private formbuilder: FormBuilder) {}

  agInit(params: any) {
    this.params = params;
    this.inputValidatorForm = this.formbuilder.group({
      inputValue: [
        typeof params.value === 'object'
          ? params.value.value
            ? params.value.value
            : ''
          : params.value,
        params.context.validators[`${params.colDef.field}`]
      ]
    });
    this.oldValue = this.inputValidatorForm.value.inputValue;
    if (params?.context?.focusOn) {
      if (params?.column?.colId === params?.context?.focusOn) {
        this.enableFocus = true;
      } else {
        this.enableFocus = false;
      }
    } else {
      this.enableFocus = true;
    }
    if (params?.context?.disableCell) {
      this.inputValidatorForm.disable();
    }
  }

  getValue() {
    this.amountElement?.nativeElement?.blur();
    this.percentElement?.nativeElement?.blur();
    this.inputElement?.nativeElement?.blur();
    return {
      value: this.inputValidatorForm.value.inputValue,
      isValid: this.inputValidatorForm.valid,
      oldValue: this.oldValue
    };
  }

  afterGuiAttached() {
    if (this.enableFocus) {
      this.amountElement?.nativeElement?.focus();
      this.percentElement?.nativeElement?.focus();
      this.inputElement?.nativeElement?.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      event.stopPropagation();
      return;
    }
  }

  unFocusedEvent(){
    if(this.params?.context?.gridApi){
      this.params.context.gridApi.stopEditing();
      this.params.context.gridApi.clearFocusedCell();
    }
  }
}
