import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { TaxClassDetails, ProductCategoryEnum } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TEMPLATE8 } from '@poss-web/shared/components/ui-dynamic-form';
import { TaxClass } from '@poss-web/shared/ui-master-form-models';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-tax-class-details',
  templateUrl: './tax-class-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxClassDetailsComponent implements OnInit, OnDestroy {
  dialogData: TaxClassDetails;
  destroy$: Subject<null> = new Subject<null>();

  taxClassCode: string;
  description: string;
  isActive: boolean;

  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<TaxClassDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
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
    if (this.dialogData.taxClassCode !== ProductCategoryEnum.NEW) {
      mode = ProductCategoryEnum.edit;
    } else {
      mode = ProductCategoryEnum.new;
    }

    this.dialogRef.close({
      taxClassCode: this.taxClassCode,
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
    const taxMaster = new TaxClass(
      1,
      this.dialogData.taxClassCode === 'NEW'
        ? ''
        : this.dialogData.taxClassCode,
      this.dialogData.description,
      // [
      //   {
      //     id: '1',
      //     name: 'pw.taxClass.isActiveLabel',
      //     checked: this.dialogData.taxClassCode === 'NEW' ? true : this.dialogData.isActive
      //   }
      // ],
      this.fieldValidatorsService,
      this.translateService
    );
    return taxMaster;
  }

  getCssProp() {
    const annot = (TaxClassDetailsComponent as any).__annotations__;
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
    this.taxClassCode = formValues['1-taxClassCode'];
    this.description = formValues['1-desctiption'];
    this.isActive = true; //formValues['1-IsActive'][0];
    this.onCreate();
    // this.tabOne.emit(formData);
  }

  deleteButton() {
    this.onClose();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.taxClassCode !== 'NEW') {
      formGroup.get('1-taxClassCode').disable({ onlySelf: true });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
