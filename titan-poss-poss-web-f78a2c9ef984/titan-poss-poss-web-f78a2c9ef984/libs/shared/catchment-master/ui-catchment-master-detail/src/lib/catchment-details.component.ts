import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TEMPLATE8 } from '@poss-web/shared/components/ui-dynamic-form';
import { CatchmentDetails, CatchmentEnum } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { CatchmentModel } from '@poss-web/shared/ui-master-form-models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-catchment-details',
  templateUrl: './catchment-details.component.html'
})
export class CatchmentDetailsComponent implements OnInit, OnDestroy {
  dialogData: CatchmentDetails;
  destroy$: Subject<null> = new Subject<null>();

  catchmentCode: string;
  description: string;
  isActive: boolean;

  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<CatchmentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }

  ngOnInit() {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onCreate() {
    let mode = '';
    if (this.dialogData.catchmentCode !== CatchmentEnum.NEW) {
      mode = CatchmentEnum.edit;
    } else {
      mode = CatchmentEnum.new;
    }

    this.dialogRef.close({
      catchmentCode: this.catchmentCode,
      description: this.description,
      isActive: this.isActive,
      mode: mode
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  /// below is dynamic form specific code

  prepareSet() {
    const taxMaster = new CatchmentModel(
      1,
      this.dialogData.catchmentCode === 'NEW'
        ? ''
        : this.dialogData.catchmentCode,
      this.dialogData.description,
      // [
      //   {
      //     id: '1',
      //     name: 'pw.taxClass.isActiveLabel',
      //     checked: this.dialogData.catchmentCode === 'NEW' ? true : this.dialogData.isActive
      //   }
      // ],
      this.fieldValidatorsService,
      this.translateService
    );
    return taxMaster;
  }

  getCssProp() {
    return [''];
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: '',
      formDesc: '',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.catchmentCode = formValues['1-catchmentCode'];
    this.description = formValues['1-desctiption'];
    this.isActive = true; // formValues['1-IsActive'][0];
    this.onCreate();
    // this.tabOne.emit(formData);
  }

  deleteButton() {
    this.onClose();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.catchmentCode !== 'NEW') {
      formGroup.get('1-catchmentCode').disable({ onlySelf: true });
    }
    if (this.dialogData.isEditable === false) {
      formGroup.get('1-desctiption').disable({ onlySelf: true });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
