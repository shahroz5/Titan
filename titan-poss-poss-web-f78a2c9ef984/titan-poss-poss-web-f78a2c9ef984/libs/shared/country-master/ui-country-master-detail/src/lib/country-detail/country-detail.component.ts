import { Component, OnInit, Inject, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { CountryEnum } from '@poss-web/shared/models';
import { CountryDetailsMaster } from '@poss-web/shared/ui-master-form-models';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { POSS_WEB_MONTHS } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-country-detail',
  templateUrl: './country-detail.component.html'
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  @Input() currencyCodes: Observable<any>;
  dialogData: any;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  countryEnum: CountryEnum;

  countryCode: string;
  description: string;
  currencyCode: string;
  dateFormat: string;
  fiscalYearStart: string;
  isdCode: string;
  phoneLength: string;
  locale: string;
  timeFormat: string;
  fiscalYear: number;
  weightUnit: string;
  stoneWeightUnit: string;
  isActive: true;

  public currentStyle: string[];
  public formFields: any;
  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<CountryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(POSS_WEB_MONTHS) public months,
    fb: FormBuilder,
    public dialog: MatDialog,
    private hf: HelperFunctions
  ) {
    this.dialogData = data.countryDetailsByCode;
  }

  ngOnInit() {
    if (this.dialogData.countryCode !== CountryEnum.NEW) {
      this.readOnly = true;
    }

    const form = this.prepareSet(this.data.currencyDropdown);

    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }
  onCreate() {
    let mode = '';
    if (this.dialogData.countryCode !== CountryEnum.NEW) {
      mode = CountryEnum.edit;
    } else {
      mode = CountryEnum.new;
    }
    this.dialogRef.close({
      countryCode: this.countryCode,
      description: this.description,
      currencyCode: this.currencyCode,
      dateFormat: this.dateFormat,
      fiscalYearStart: this.fiscalYearStart,
      isdCode: this.isdCode,
      phoneLength: this.phoneLength,
      locale: this.locale,
      timeFormat: this.timeFormat,
      fiscalYear: this.fiscalYear,
      weightUnit: this.weightUnit,
      stoneWeightUnit: this.stoneWeightUnit,
      isActive: this.isActive,
      mode: mode
    });
  }
  onClose() {
    this.dialogRef.close();
  }
  prepareSet(dropdown) {
    console.log(this.dialogData);

    const currencyCodeDetails = this.preapareCurrencyCode(dropdown);
    const timeFormats = this.preapareTimeFormat(this.data.timeFormats);
    const dateFormats = this.preapareDateFormat(this.data.dateFormats);
    const months = this.prepareMonth();
    const country = new CountryDetailsMaster(
      1,
      this.dialogData.countryCode === 'NEW' ? '' : this.dialogData.countryCode,
      this.dialogData.description ? this.dialogData.description : '',
      currencyCodeDetails,
      dateFormats,
      months,
      this.dialogData.isdCode ? this.dialogData.isdCode : '',
      this.dialogData.phoneLength ? this.dialogData.phoneLength : '',
      this.dialogData.locale ? this.dialogData.locale : '',
      timeFormats,
      this.dialogData.fiscalYear ? this.dialogData.fiscalYear : '',
      this.dialogData.weightUnit ? this.dialogData.weightUnit : '',
      this.dialogData.stoneWeightUnit ? this.dialogData.stoneWeightUnit : '',

      this.fieldValidatorsService,
      this.translateService
    );
    return country;
  }
  preapareCurrencyCode(dropDown) {
    const currencyCodes: { id: string; name: string }[] = [];
    for (const currency of dropDown) {
      currencyCodes.push({
        id: currency.id,
        name: currency.name
      });
    }
    const currencyCode = this.hf.patchValue(
      currencyCodes,
      'id',
      'selected',
      this.dialogData.currencyCode ? this.dialogData.currencyCode : '',
      true
    );
    console.log(currencyCode);
    return currencyCode;
  }
  preapareTimeFormat(dropDown) {
    console.log(dropDown, 'time');

    const timeFormats: { id: string; name: string }[] = [];
    for (const data of dropDown) {
      timeFormats.push({
        id: data.code,
        name: data.value
      });
    }

    const timeFormat = this.hf.patchValue(
      timeFormats,
      'id',
      'selected',
      this.dialogData.timeFormat ? this.dialogData.timeFormat : '',
      true
    );
    console.log(timeFormat);
    return timeFormat;
  }
  preapareDateFormat(dropDown) {
    console.log(dropDown, 'date');
    const dateFormats: { id: string; name: string }[] = [];
    for (const data of dropDown) {
      dateFormats.push({
        id: data.code,
        name: data.value
      });
    }
    const dateFormat = this.hf.patchValue(
      dateFormats,
      'id',
      'selected',
      this.dialogData.dateFormat ? this.dialogData.dateFormat : '',
      true
    );
    console.log(dateFormat);
    return dateFormat;
  }
  prepareMonth() {
    const month = this.hf.patchValue(
      this.months,
      'id',
      'selected',
      this.dialogData.fiscalYearStart ? this.dialogData.fiscalYearStart : '',
      true
    );
    console.log(month);
    return month;
  }
  getCssProp() {
    const annot = (CountryDetailComponent as any).__annotations__;
    if (annot) {
      return annot[0].styles;
    }
  }
  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: 'Country Form',
      formDesc: 'COUNTRY',
      formTemplate: TEMPLATE8
    };
  }
  addButton(formGroup: FormGroup) {
    console.log(formGroup, 'formGroup');

    const formValues = formGroup.getRawValue();
    this.countryCode = formValues['1-countryCode'];
    this.description = formValues['1-countryName'];
    this.currencyCode = formValues['1-currencyCode'];
    this.dateFormat = formValues['1-dateFormat'];
    this.fiscalYearStart = formValues['1-fiscalMonthStart']
      ? formValues['1-fiscalMonthStart']
      : null;
    this.isdCode = formValues['1-isdCode'];
    this.phoneLength = formValues['1-phoneLength'];
    this.locale = formValues['1-locale'];
    this.timeFormat = formValues['1-timeFormat'];
    this.fiscalYear = formValues['1-fiscalYear'];
    this.weightUnit = formValues['1-weightUnit'];
    this.stoneWeightUnit = formValues['1-stoneWeightUnit'];
    // this.isActive = formValues['1-IsActive'][0];
    this.onCreate();
  }
  deleteButton() {
    this.onClose();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.countryCode !== 'NEW') {
      formGroup.get('1-countryCode').disable({ onlySelf: true });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
