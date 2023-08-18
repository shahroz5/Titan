import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-value-percentage',
  templateUrl: './value-percentage.component.html',
  styleUrls: ['./value-percentage.component.scss']
})
export class ValuePercentageComponent implements ICellEditorAngularComp {
  form: FormGroup;
  oldValue: any;
  params: any;
  currencyCode: any;
  @ViewChild('input1') amountElement: ElementRef;
  @ViewChild('input2') percentElement: ElementRef;

  enableMaxValidtion = false;
  constructor(
    private formbuilder: FormBuilder,
    private fieldValidatorService: FieldValidatorsService
  ) {}

  agInit(params: any) {
    if (params.context?.enableMaxValidtion) {
      this.enableMaxValidtion = true;
    }

    if (params.context?.currencyCode) {
      this.currencyCode = params.context?.currencyCode;
    }

    this.params = params;
    this.createForm(
      params.value.isPercent,
      params.value.value,
      params.value.percentage,
      params.value.maxValue
    );

    this.oldValue = params.value;
  }

  createForm(isPercent, value, percentage, maxValue) {
    this.form = this.formbuilder.group({
      value: [isPercent ? (percentage ? percentage : value) : value]
    });
    if (!this.enableMaxValidtion) {
      if (!isPercent) {
        this.form
          .get('value')
          .setValidators(this.params.context.validators[`amount`]);
      } else {
        this.form
          .get('value')
          .setValidators(this.params.context.validators[`percentage`]);
      }
    } else {
      if (!isPercent) {
        this.form
          .get('value')
          .setValidators([
            ...this.params.context.validators[`amount`],
            this.fieldValidatorService.maxAmount(
              maxValue,
              'Amount',
              this.currencyCode
            )
          ]);
      } else {
        this.form
          .get('value')
          .setValidators([
            ...this.params.context.validators[`percentage`],
            this.fieldValidatorService.max(maxValue, 'Percentage')
          ]);
      }
    }
  }

  getValue() {
    this.amountElement?.nativeElement?.blur();
    this.percentElement?.nativeElement?.blur();
    if (!this.enableMaxValidtion) {
      return {
        ...this.oldValue,
        value: this.form.value.value,
        isValid: this.form.valid
      };
    } else {
      if (this.params.value.isPercent) {
        return {
          ...this.oldValue,
          percentage: +this.form.value.value,
          isValid: this.form.valid
        };
      } else {
        return {
          ...this.oldValue,
          value: +this.form.value.value,
          isValid: this.form.valid
        };
      }
    }
  }

  afterGuiAttached() {
    this.amountElement?.nativeElement?.focus();
    this.percentElement?.nativeElement?.focus();
  }

  unFocusedEvent(){
    if(this.params?.context?.gridApi){
      this.params.context.gridApi.stopEditing();
      this.params.context.gridApi.clearFocusedCell();
    }
  }
}
