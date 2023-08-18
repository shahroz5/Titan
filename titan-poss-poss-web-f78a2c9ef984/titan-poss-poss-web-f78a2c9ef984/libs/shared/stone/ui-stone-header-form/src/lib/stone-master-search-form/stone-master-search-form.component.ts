import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-stone-master-search-form',
  templateUrl: './stone-master-search-form.component.html'
})
export class StoneMasterSearchFormComponent implements OnInit, OnChanges {
  filterForm: FormGroup;
  @Input() filterStoneData;
  @Input() currencyCode;
  @Input() pricingTypes;
  @Output() formData = new EventEmitter<any>();
  @Output() clearFormData = new EventEmitter<any>();
  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      fromStdValue: new FormControl(
        this.filterStoneData?.fromStdValue
          ? this.filterStoneData?.fromStdValue
          : null,
        [
          this.fieldValidatorsService.amountField('Price'),
          this.fieldValidatorsService.minAmount(1, 'Price', this.currencyCode)
        ]
      ),
      toStdValue: new FormControl(
        this.filterStoneData?.toStdValue
          ? this.filterStoneData?.toStdValue
          : null,
        [
          this.fieldValidatorsService.amountField('Price'),
          this.fieldValidatorsService.minAmount(1, 'Price', this.currencyCode)
        ]
      ),
      color: new FormControl(
        this.filterStoneData?.color ? this.filterStoneData?.color : null,
        this.fieldValidatorsService.colorField('Stone Color')
      ),
      stoneTypeCode: new FormControl(
        this.filterStoneData?.stoneTypeCode
          ? this.filterStoneData?.stoneTypeCode
          : null,
        this.fieldValidatorsService.stoneTypeCodeField('Stone Type Code')
      ),
      quality: new FormControl(
        this.filterStoneData?.quality ? this.filterStoneData?.quality : null,
        this.fieldValidatorsService.stoneQualityField('Stone Quality')
      ),
      ratePerCarat: new FormControl(
        this.filterStoneData?.ratePerCarat
          ? this.filterStoneData?.ratePerCarat
          : null,
        [
          this.fieldValidatorsService.amountField('Rate Per Karat'),
          this.fieldValidatorsService.minAmount(
            1,
            'Rate Per Karat',
            this.currencyCode
          )
        ]
      ),
      stoneCode: new FormControl(
        this.filterStoneData?.stoneCode
          ? this.filterStoneData?.stoneCode
          : null,
        this.fieldValidatorsService.stoneCodeField('Stone Code')
      )
    });
    this.setValidation();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterStoneData']) this.filterStoneData = this.filterStoneData;
  }
  setValidation() {
    const fromPrice = this.filterForm.get('fromStdValue').value;
    const toPrice = this.filterForm.get('toStdValue');

    this.filterForm.get('fromStdValue').valueChanges.subscribe(startPrice => {
      console.log('hello2');
      this.filterForm.get('toStdValue').markAsTouched();
      if (
        !(startPrice === '' || startPrice === null) &&
        this.filterForm.get('fromStdValue').errors === null
      ) {
        console.log(startPrice, 'startPrice');

        console.log('hello3');
        toPrice.setValidators([
          this.fieldValidatorsService.requiredField('To Price'),
          this.fieldValidatorsService.amountField('To Price'),
          this.fieldValidatorsService.minAmount(
            startPrice,
            'To Price',
            this.currencyCode
          )
        ]);
      } else {
        toPrice.setValidators([
          this.fieldValidatorsService.amountField('To Price'),
          this.fieldValidatorsService.minAmount(
            startPrice,
            'To Price',
            this.currencyCode
          )
        ]);
      }
      console.log(this.filterForm.get('toStdValue').errors);

      toPrice.updateValueAndValidity();
    });
  }
  applyFilter() {
    const values = this.filterForm.getRawValue();
    const filterPayload = {
      stoneCode: values.stoneCode ? values.stoneCode : null,
      fromStdValue: values.fromStdValue ? values.fromStdValue : null,
      toStdValue: values.toStdValue ? values.toStdValue : null,
      stoneTypeCode: values.stoneTypeCode ? values.stoneTypeCode : null,
      color: values.color ? values.color : null,
      quality: values.quality ? values.quality : null,
      ratePerCarat: values.ratePerCarat ? values.ratePerCarat : null
    };
    this.filterStoneData = filterPayload;
    this.formData.emit(filterPayload);
  }
  clear() {
    this.filterForm.patchValue({
      color: null,
      fromStdValue: null,
      quality: null,
      ratePerCarat: null,
      stoneCode: null,
      stoneTypeCode: null,
      toStdValue: null
    });
    this.clearFormData.emit(true);
  }
}
