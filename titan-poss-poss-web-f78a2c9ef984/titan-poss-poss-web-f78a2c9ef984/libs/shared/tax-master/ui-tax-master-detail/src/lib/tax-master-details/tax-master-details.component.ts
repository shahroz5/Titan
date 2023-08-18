import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { TaxMasterDetails, ProductCategoryEnum } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TEMPLATE8 } from '@poss-web/shared/components/ui-dynamic-form';
import { TaxMaster } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-tax-master-details',
  templateUrl: './tax-master-details.component.html',
  styleUrls: ['./tax-master-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxMasterDetailsComponent implements OnInit, OnDestroy {
  dialogData: TaxMasterDetails;
  destroy$: Subject<null> = new Subject<null>();

  taxCode: string;
  description: string;
  isActive: boolean;

  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<TaxMasterDetailsComponent>,
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
    if (this.dialogData.taxCode !== ProductCategoryEnum.NEW) {
      mode = ProductCategoryEnum.edit;
    } else {
      mode = ProductCategoryEnum.new;
    }

    this.dialogRef.close({
      taxCode: this.taxCode,
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
    const taxMaster = new TaxMaster(
      1,
      this.dialogData.taxCode === 'NEW' ? '' : this.dialogData.taxCode,
      this.dialogData.description,
      // [
      //   {
      //     id: '1',
      //     name: 'pw.taxMaster.isActiveLabel',
      //     checked: this.dialogData.taxCode === 'NEW' ? true : this.dialogData.isActive
      //   }
      // ],
      this.fieldValidatorsService,
      this.translateService
    );
    return taxMaster;
  }

  getCssProp() {
    const annot = (TaxMasterDetailsComponent as any).__annotations__;
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
    this.taxCode = formValues['1-taxCode'];
    this.description = formValues['1-desctiption'];
    this.isActive = true; // formValues['1-IsActive'][0];
    this.onCreate();
    // this.tabOne.emit(formData);
  }

  deleteButton() {
    this.onClose();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.taxCode !== 'NEW') {
      formGroup.get('1-taxCode').disable({ onlySelf: true });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
