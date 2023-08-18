import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';

import { MetalTypeModel } from '@poss-web/shared/ui-master-form-models';
import {
  materialTypeEnum,
  DialogDataMaterialType
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-metal-type-details',
  templateUrl: './metal-type-details.component.html',
  styleUrls: ['./metal-type-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetalTypeDetailsComponent implements OnInit, OnDestroy {
  dialogData: DialogDataMaterialType;
  materialCode: string;
  description: string;

  isActive: boolean;
  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  destroy$: Subject<null> = new Subject<null>();
  constructor(
    public dialogRef: MatDialogRef<MetalTypeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public hf: HelperFunctions,
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
    const metalType = new MetalTypeModel(
      1,
      this.dialogData.materialType
        ? this.dialogData.materialType.materialCode === 'NEW'
          ? ''
          : this.dialogData.materialType.materialCode
        : '',

      this.dialogData.materialType
        ? this.dialogData.materialType.description
        : '',

      this.fieldValidatorsService,
      this.translateService
    );

    return metalType;
  }

  getCssProp() {
    const annot = (MetalTypeDetailsComponent as any).__annotations__;
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
      formName: 'Metal Type Form',
      formDesc: 'Metal Type',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();

    this.materialCode = formValues['1-materialCode'];

    this.description = formValues['1-description'];

    this.onCreate();

    // this.tabOne.emit(formData);
  }
  onCreate() {
    let mode = '';
    if (this.dialogData.materialType.materialCode !== materialTypeEnum.NEW) {
      mode = materialTypeEnum.edit;
    } else {
      mode = materialTypeEnum.new;
    }

    this.dialogRef.close({
      materialCode: this.materialCode,

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
    if (this.dialogData.materialType.materialCode !== 'NEW') {
      formGroup.get('1-materialCode').disable({ onlySelf: true });
    }
  }
}
