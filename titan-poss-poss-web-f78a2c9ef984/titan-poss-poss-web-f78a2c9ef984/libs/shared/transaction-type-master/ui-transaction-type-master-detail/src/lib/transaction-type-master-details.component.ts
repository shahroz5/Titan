import { Component, OnInit, Inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { TransactionTypeMasterDetails, ProductCategoryEnum } from '@poss-web/shared/models';
import { TEMPLATE8 } from '@poss-web/shared/components/ui-dynamic-form';
import { TransactionTypeMaster } from '@poss-web/shared/ui-master-form-models';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-transaction-type-master-details',
  templateUrl: './transaction-type-master-details.component.html',
  styleUrls: ['./transaction-type-master-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionTypeMasterDetailsComponent implements OnInit, OnDestroy {

  dialogData: TransactionTypeMasterDetails;
  destroy$: Subject<null> = new Subject<null>();

  code: string;
  value: string;
  isActive: boolean;

  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  constructor(

    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<TransactionTypeMasterDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
    console.log('Log: TransactionTypeMasterDetailsComponent -> data', data);
  }

  ngOnInit() {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onCreate() {
    let mode = '';
    if (this.dialogData.code !== ProductCategoryEnum.NEW) {
      mode = ProductCategoryEnum.edit;
    } else {
      mode = ProductCategoryEnum.new;
    }

    this.dialogRef.close({
      code: this.code,
      value: this.value,
      isActive: this.isActive,
      mode: mode
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  /// below is dynamic form specific code

  prepareSet() {
    const taxMaster = new TransactionTypeMaster(
      1,
      this.dialogData.code === 'NEW' ? '' : this.dialogData.code,
      this.dialogData.value,
      [
        {
          id: '1',
          name: 'pw.transactionType.isActiveLabel',
          checked: this.dialogData.code === 'NEW' ? true : this.dialogData.isActive
        }
      ],
      this.fieldValidatorsService,
      this.translateService
    );
    return taxMaster;
  }

  getCssProp() {
    const annot = (TransactionTypeMasterDetailsComponent as any).__annotations__;
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
      formName: 'Product Category Form',
      formDesc: 'Product Category',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.code = formValues['1-code'];
    this.value = formValues['1-value'];
    this.isActive = formValues['1-IsActive'][0];
    this.onCreate();
    // this.tabOne.emit(formData);
  }

  deleteButton() {
    this.onClose();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.code !== 'NEW') {
      formGroup.get('1-code').disable({ onlySelf: true });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
