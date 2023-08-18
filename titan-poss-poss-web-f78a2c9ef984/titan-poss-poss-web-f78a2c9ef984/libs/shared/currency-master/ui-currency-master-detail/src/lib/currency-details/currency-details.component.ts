import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
  ComponentFactoryResolver,
  ElementRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CurrencyDetailsEnum } from '@poss-web/shared/models';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { CurrencyDetailsMaster } from '@poss-web/shared/ui-master-form-models';

@Component({
  selector: 'poss-web-currency-details',
  templateUrl: './currency-details.component.html'
})
export class CurrencyDetailsComponent implements OnInit, OnDestroy {
  dialogData: any;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  CurrencyDetailsEnum: CurrencyDetailsEnum;
  currencyCode: string;
  currencySymbol: string;
  description: string;
  isActive: boolean;

  public currentStyle: string[];
  public formFields: any;

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<CurrencyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public dialog: MatDialog,
    private hf: HelperFunctions,
    private test: ComponentFactoryResolver
  ) {
    this.dialogData = data;
    console.log(data, 'daaaaaa');
  }

  @ViewChild('mainPopup')
  mainPopupref: ElementRef;

  ngOnInit() {
    if (this.dialogData.currencyCode !== CurrencyDetailsEnum.NEW) {
      this.readOnly = true;
    }
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }
  onCreate() {
    let mode = '';
    if (this.dialogData.currencyCode !== CurrencyDetailsEnum.NEW) {
      mode = CurrencyDetailsEnum.edit;
    } else {
      mode = CurrencyDetailsEnum.new;
      this.isActive = true;
    }
    this.dialogRef.close({
      currencyCode: this.currencyCode,
      currencySymbol: this.currencySymbol,
      description: this.description,
      isActive: this.isActive,
      mode: mode
    });
  }
  onClose() {
    this.dialogRef.close();
  }
  prepareSet() {
    const Currency = new CurrencyDetailsMaster(
      1,
      this.dialogData.currencyCode === 'NEW'
        ? ''
        : this.dialogData.currencyCode,
      this.dialogData.description ? this.dialogData.description : '',
      this.dialogData.currencySymbol ? this.dialogData.currencySymbol : '',

      this.fieldValidatorsService,
      this.translateService
    );
    {
      console.log(Currency, 'ck3');
      return Currency;
    }
  }
  // prepareCountry(dropDown) {
  //   const Country: { id: string; name: string }[] = [];
  //   for (const country of dropDown) {
  //     Country.push({
  //       id: country.id,
  //       name: country.name
  //     });
  //   }

  //   const dropDownValues = this.hf.patchValue(
  //     Country,
  //     'id',
  //     'selected',
  //     this.dialogData.description ? this.dialogData.description : '',
  //     true
  //   );

  //   return dropDownValues;
  // }
  // prepareCurrencySymbol(dropDown) {
  //   const CurrencySymbol: { id: string; name: string }[] = [];
  //   for (const currency of dropDown) {
  //     CurrencySymbol.push({
  //       id: currency.id,
  //       name: currency.name
  //     });
  //   }

  //   const dropDownValues = this.hf.patchValue(
  //     CurrencySymbol,
  //     'id',
  //     'selected',
  //     this.dialogData.currencySymbol ? this.dialogData.currencySymbol : '',
  //     true
  //   );

  //   return dropDownValues;
  // }
  // prepareUnicode(dropDown) {
  //   console.log(dropDown,"dropdata");

  //   const Unicode: { id: string; name: string }[] = [];
  //   for (const unicode of dropDown) {
  //     Unicode.push({
  //       id: unicode.id,
  //       name: unicode.name
  //     });
  //   }

  //   const dropDownValues = this.hf.patchValue(
  //     Unicode,
  //     'id',
  //     'selected',
  //     this.dialogData.unicode ? this.dialogData.unicode : '',
  //     true
  //   );

  //   return dropDownValues;
  // }
  getCssProp() {
    const annot = (CurrencyDetailsComponent as any).__annotations__;
    if (annot) {
      console.log(annot[0], annot[0].styles, 'check');
      return annot[0] && annot[0].styles;
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
      formName: 'Currency Details Form',
      formDesc: 'Currency Details',
      formTemplate: TEMPLATE8
    };
  }
  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    console.log('formvalues', formValues);
    this.currencyCode = formValues['1-currencyCode'];
    // this.country = formValues['1-country'];
    this.currencySymbol = formValues['1-currencySymbol'];
    this.description = formValues['1-description'];
    // this.isActive = formValues['1-IsActive'][0];
    this.onCreate();
  }
  deleteButton() {
    this.onClose();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.currencyCode !== 'NEW') {
      formGroup.get('1-currencyCode').disable({ onlySelf: true });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
