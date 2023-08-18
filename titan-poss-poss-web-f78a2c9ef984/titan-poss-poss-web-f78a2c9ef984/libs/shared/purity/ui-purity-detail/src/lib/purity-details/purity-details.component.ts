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

import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  purityEnum,
  DialogDataPurity,
  MetalTypeEnum
} from '@poss-web/shared/models';
import { PurityModel } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-purity-details',
  templateUrl: './purity-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurityDetailsComponent implements OnInit, OnDestroy {
  materialCode: string;
  purity: string;
  description: string;
  offset: string;
  karat: string;
  isActive: boolean;
  isDisplayed: boolean;
  dialogData: DialogDataPurity;
  destroy$: Subject<null> = new Subject<null>();

  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code
  constructor(
    public hf: HelperFunctions,
    public dialogRef: MatDialogRef<PurityDetailsComponent>,
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
    const materialTypes = this.prepareMetalType(this.dialogData.materialTypes);

    const purity = new PurityModel(
      1,
      materialTypes,
      this.dialogData.purity.purity,
      this.dialogData.purity.karat,
      this.dialogData.purity.offset,
      this.dialogData.purity.description,

      [
        {
          id: '1',
          name: 'pw.purity.isDisplayed',
          checked:
            this.dialogData.purity.materialCode === purityEnum.NEW
              ? true
              : this.dialogData.purity.isDisplayed
        }
      ],
      this.fieldValidatorsService,
      this.translateService
    );

    return purity;
  }

  prepareMetalType(materialTypes) {
    const materialTypesData: { id: string; name: string }[] = [];
    for (const materialData of materialTypes) {
      materialTypesData.push({
        id: materialData.materialCode,
        name: materialData.materialCode
      });
    }

    const materialType = this.hf.patchValue(
      materialTypesData,
      'id',
      'selected',
      this.dialogData.purity ? this.dialogData.purity.materialCode : '',
      true
    );
    return materialType;
  }

  getCssProp() {
    const annot = (PurityDetailsComponent as any).__annotations__;
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
      formName: 'Purity Form',
      formDesc: 'Purity Type',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.materialCode = formValues['1-materialCode'];
    this.purity = formValues['1-purity'];
    this.karat = formValues['1-karat'];
    this.offset = formValues['1-offset'];
    this.description = formValues['1-description'];

    this.isDisplayed = formValues['1-isDisplayed'][0];

    this.onCreate();
  }
  onCreate() {
    let mode = '';
    let id;
    if (this.dialogData.purity.materialCode !== purityEnum.NEW) {
      mode = purityEnum.edit;
      id = this.dialogData.purity.id;
    } else {
      mode = purityEnum.new;
    }

    this.dialogRef.close({
      id: id,
      materialCode: this.materialCode,
      purity: this.purity,
      karat: this.karat,
      offset: this.offset,
      description: this.description,

      isDisplayed: this.isDisplayed,
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
    if (
      this.dialogData.purity.materialCode !== MetalTypeEnum.GOLD &&
      this.dialogData.purity.materialCode !== 'GOLD'
    ) {
      formGroup.get('1-karat').disable({ onlySelf: true });
    }

    formGroup.get('1-materialCode').valueChanges.subscribe(val => {
      if (val !== MetalTypeEnum.GOLD && val !== 'GOLD') {
        formGroup.get('1-karat').disable({ onlySelf: true });
      } else {
        formGroup.get('1-karat').enable({ onlySelf: true });
      }
    });
    if (this.dialogData.purity.materialCode !== 'NEW') {
      formGroup.get('1-materialCode').disable({ onlySelf: true });
      formGroup.get('1-purity').disable({ onlySelf: true });
    }
  }
}
