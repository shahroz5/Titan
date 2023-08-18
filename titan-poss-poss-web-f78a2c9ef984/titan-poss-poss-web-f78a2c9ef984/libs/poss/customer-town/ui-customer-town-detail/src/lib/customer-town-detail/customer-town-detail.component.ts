import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CustomerTown,
  CustomerStateDetails,
  CustomerTownEnum
} from '@poss-web/shared/models';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';
import { CustomerTownModel } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-customer-town-detail',
  templateUrl: './customer-town-detail.component.html'
})
export class CustomerTownDetailComponent implements OnInit, OnDestroy {
  dialogData: CustomerTown;
  stateDropdown: CustomerStateDetails[];
  readOnly: boolean;

  public currentStyle: string[];
  public formFields: any;
  state: any;
  description: any;
  townName: any;
  townCode: any;
  destroy$: Subject<null> = new Subject<null>();
  isActive: boolean;
  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<CustomerTownDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private hf: HelperFunctions,
    public dialog: MatDialog
  ) {
    this.dialogData = data.data;
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit') {
      this.readOnly = true;
    }
    const form = this.prepareSet(this.dialogData, this.data.state);
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }
  prepareSet(data, state) {
    if (data.stateName) {
      state = this.hf.patchValue(
        state,
        'description',
        'selected',
        data.stateName ? data.stateName : '',
        true
      );
    }

    const townDetails = new CustomerTownModel(
      1,
      state,
      this.dialogData.description,
      this.fieldValidatorsService,
      this.translateService
    );
    return townDetails;
  }
  getCssProp() {
    const annot = (CustomerTownDetailComponent as any).__annotations__;
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
      formName: 'Customer Town Details Form',
      formDesc: 'Customer Town',
      formTemplate: TEMPLATE8
    };
  }
  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.state = formValues['1-state'];
    this.townName = formValues['1-townName'];
    // this.isActive = formValues['1-IsActive'][0];
    this.onSave();
  }
  deleteButton() {
    this.onClose();
  }
  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    let mode = '';
    if (this.data.mode === 'edit') {
      mode = CustomerTownEnum.edit;
    } else {
      mode = CustomerTownEnum.new;
      this.isActive = true;
    }
    this.dialogRef.close({
      stateName: this.state,
      isActive: this.isActive,
      townCode: this.dialogData.townCode,
      description: this.townName,
      mode: mode
    });
  }
  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.description !== '') {
      formGroup.get('1-state').disable({ onlySelf: true });
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
