import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ComplexityCodeModel } from '@poss-web/shared/ui-master-form-models';
import { ComplexityCode, complexityCodeEnum } from '@poss-web/shared/models';
import { TEMPLATE8 } from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-complexity-code-detail',
  templateUrl: './complexity-code-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexityCodeDetailComponent implements OnInit {
  dialogData: ComplexityCode;
  complexityCode: string;
  description: string;
  isActive: boolean;
  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  constructor(
    public dialogRef: MatDialogRef<ComplexityCodeDetailComponent>,
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
    const complexityCode = new ComplexityCodeModel(
      1,
      this.dialogData.complexityCode
        ? this.dialogData.complexityCode === 'NEW'
          ? ''
          : this.dialogData.complexityCode
        : '',
      this.dialogData.description ? this.dialogData.description : '',

      this.fieldValidatorsService,
      this.translateService
    );

    return complexityCode;
  }

  getCssProp() {
    const annot = (ComplexityCodeDetailComponent as any).__annotations__;
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
      formName: 'Complexity Code Form',
      formDesc: 'Complexity Code',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.complexityCode = formValues['1-complexityCode'];
    this.description = formValues['1-description'];

    this.onCreate();
  }
  onCreate() {
    let mode = '';
    if (this.dialogData.complexityCode !== complexityCodeEnum.NEW) {
      mode = complexityCodeEnum.edit;
    } else {
      mode = complexityCodeEnum.new;
    }

    this.dialogRef.close({
      complexityCode: this.complexityCode,
      description: this.description,

      mode: mode
    });
  }
  deleteButton() {
    this.dialogRef.close();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.complexityCode !== 'NEW') {
      formGroup.get('1-complexityCode').disable({ onlySelf: true });
    }
  }
}
