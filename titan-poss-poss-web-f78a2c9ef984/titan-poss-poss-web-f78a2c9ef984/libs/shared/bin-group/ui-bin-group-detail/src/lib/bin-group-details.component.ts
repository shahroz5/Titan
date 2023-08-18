import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { BinGroupDetails, BinGroupEnum } from '@poss-web/shared/models';
import { TEMPLATE8 } from '@poss-web/shared/components/ui-dynamic-form';
import { BinGroupMaster } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-bin-group-details',
  templateUrl: './bin-group-details.component.html',
  styleUrls: ['./bin-group-details.component.scss']
})
export class BinGroupDetailsComponent implements OnInit {
  dialogData: BinGroupDetails;
  binGroupDetailsForm: FormGroup;
  groupBinDetails$: Observable<BinGroupDetails>;
  isLoading$: Observable<boolean>;
  binGroupSaveResponse$: Observable<BinGroupDetails>;
  binGroupCode: string;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  binGroupEnum: BinGroupEnum;
  hotKeyPressed = true;

  public currentStyle: string[];
  public formFields: any;
  description: string;

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<BinGroupDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }

  ngOnInit() {
    if (this.dialogData.binGroupCode !== BinGroupEnum.NEW) {
      this.readOnly = true;
    }
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onCreate() {
    let mode = '';
    if (this.dialogData.binGroupCode !== BinGroupEnum.NEW) {
      mode = BinGroupEnum.edit;
    } else {
      mode = BinGroupEnum.new;
    }
    this.dialogRef.close({
      binGroupCode: this.binGroupCode,
      description: this.description,
      isActive: this.dialogData.isActive,
      mode: mode
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onClear() {
    if (this.dialogData.binGroupCode !== BinGroupEnum.NEW) {
      this.binGroupDetailsForm.controls['1-description'].reset();
    } else {
      this.binGroupDetailsForm.reset();
    }
  }
  prepareSet() {
    const binGroup = new BinGroupMaster(
      1,
      this.dialogData.binGroupCode === 'NEW'
        ? ''
        : this.dialogData.binGroupCode,
      this.dialogData.description,
      this.fieldValidatorsService,
      this.translateService
    );
    return binGroup;
  }

  getCssProp() {
    const annot = (BinGroupDetailsComponent as any).__annotations__;
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
      formName: 'Bin Group Form',
      formDesc: 'Bin Group',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    this.hotKeyPressed = false;
    const formValues = formGroup.getRawValue();
    this.binGroupCode = formValues['1-BinGroupCode'];
    this.description = formValues['1-desctiption'];
    this.onCreate();
  }

  deleteButton() {
    this.onClose();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.binGroupCode !== 'NEW') {
      formGroup.get('1-BinGroupCode').disable({ onlySelf: true });
    }
  }
}
