import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { subBrandEnum, DialogDataSubbrand } from '@poss-web/shared/models';

import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';
import { SubBrandModel } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-subbrand-details',
  templateUrl: './subbrand-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubbrandDetailsComponent implements OnInit, OnDestroy {
  dialogData: DialogDataSubbrand;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  subBrandEnum: subBrandEnum;
  brandCode: string;
  description: string;
  parentBrandCode: string;
  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code
  constructor(
    private hf: HelperFunctions,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SubbrandDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService,
    fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.dialogData = data;
  }

  ngOnInit() {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }
  onClose() {
    this.dialogRef.close();
  }

  prepareSet() {
    const parentBrands = this.prepareParentBrands(
      this.dialogData.parentBrandDetails
    );

    const subBrand = new SubBrandModel(
      1,
      this.dialogData.subBrandDetails
        ? this.dialogData.subBrandDetails.brandCode === 'NEW'
          ? ''
          : this.dialogData.subBrandDetails.brandCode
        : '',

      this.dialogData
        ? this.dialogData.subBrandDetails
          ? this.dialogData.subBrandDetails.description
          : ''
        : '',

      parentBrands,

      this.fieldValidatorsService,
      this.translateService
    );

    return subBrand;
  }

  prepareParentBrands(parentBrands) {
    const parentBrandMasters: { id: string; name: string }[] = [];
    for (const parentBranddata of parentBrands) {
      parentBrandMasters.push({
        id: parentBranddata.brandCode,
        name: parentBranddata.brandCode
      });
    }

    const parentBrand = this.hf.patchValue(
      parentBrandMasters,
      'id',
      'selected',
      this.dialogData.subBrandDetails
        ? this.dialogData.subBrandDetails.parentBrandCode
        : '',
      true
    );

    return parentBrand;
  }
  getCssProp() {
    const annot = (SubbrandDetailsComponent as any).__annotations__;
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
      formName: 'Sub Brand Form',
      formDesc: 'Sub Brand',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.brandCode = formValues['1-subbrandCode'];
    this.description = formValues['1-description'];

    this.parentBrandCode = formValues['1-parentBrandCode'];

    this.onCreate();
  }
  onCreate() {
    let mode = '';
    if (this.dialogData.subBrandDetails.brandCode !== subBrandEnum.NEW) {
      mode = subBrandEnum.edit;
    } else {
      mode = subBrandEnum.new;
    }

    this.dialogRef.close({
      brandCode: this.brandCode,
      description: this.description,
      parentBrandCode: this.parentBrandCode,

      mode: mode
    });
  }
  deleteButton() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.subBrandDetails.brandCode !== 'NEW') {
      formGroup.get('1-subbrandCode').disable({ onlySelf: true });
    }
  }
}
