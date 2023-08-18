import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PriceGroupModel } from '@poss-web/shared/ui-master-form-models';
import { TEMPLATE8 } from '@poss-web/shared/components/ui-dynamic-form';
import { priceGroupEnum, DialogDataPriceGroup } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-price-group-detail',
  templateUrl: './price-group-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceGroupDetailComponent implements OnInit, OnDestroy {
  dialogData: DialogDataPriceGroup;
  priceGroup: string;
  description: string;
  isActive: boolean;
  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  destroy$: Subject<null> = new Subject<null>();
  constructor(
    public dialogRef: MatDialogRef<PriceGroupDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
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
    const priceGroup = new PriceGroupModel(
      1,
      this.dialogData.priceGroupDetail
        ? this.dialogData.priceGroupDetail.priceGroup === 'NEW'
          ? ''
          : this.dialogData.priceGroupDetail.priceGroup
        : '',
      this.dialogData.priceGroupDetail
        ? this.dialogData.priceGroupDetail.description
        : '',

      this.fieldValidatorsService,
      this.translateService
    );

    return priceGroup;
  }

  getCssProp() {
    const annot = (PriceGroupDetailComponent as any).__annotations__;
    return annot[0].styles;
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: 'Price Group Form',
      formDesc: 'Price Group',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.priceGroup = formValues['1-priceGroup'];
    this.description = formValues['1-description'];

    this.onCreate();
  }
  onCreate() {
    let mode = '';
    if (this.dialogData.priceGroupDetail.priceGroup !== priceGroupEnum.NEW) {
      mode = priceGroupEnum.edit;
    } else {
      mode = priceGroupEnum.new;
    }

    this.dialogRef.close({
      priceGroup: this.priceGroup,
      description: this.description,

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
    if (this.dialogData.priceGroupDetail.priceGroup !== 'NEW') {
      formGroup.get('1-priceGroup').disable({ onlySelf: true });
    }
  }
}
