import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CorporateTown,
  StateDetails,
  CorporateTownEnum
} from '@poss-web/shared/models';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';
import { CorporateTownModel } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-corporate-town-details',
  templateUrl: './corporate-town-details.component.html',
  styleUrls: ['./corporate-town-details.component.scss']
})
export class CorporateTownDetailsComponent implements OnInit {
  dialogData: CorporateTown;
  stateDropdown: StateDetails[];
  readOnly: boolean;
  //regionDropdown: RegionDetails[];

  public currentStyle: string[];
  public formFields: any;
  state: any;
  description: any;
  townName: any;
  region: any;
  townCode: any;
  destroy$: Subject<null> = new Subject<null>();
  isActive: any;

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<CorporateTownDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private hf: HelperFunctions,
    public dialog: MatDialog
  ) {
    this.dialogData = data.data;
  }

  ngOnInit() {
    if (this.data.mode === 'edit') {
      this.readOnly = true;
    }
    const form = this.prepareSet(this.dialogData, this.data.state);
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onSave() {
    let mode = '';
    if (this.data.mode === 'edit') {
      mode = CorporateTownEnum.edit;
    } else {
      mode = CorporateTownEnum.new;
      this.isActive = true;
    }
    this.dialogRef.close({
      stateId: this.state,
      townCode: this.dialogData.townId,
      description: this.townName,
      isActive: this.isActive,
      mode: mode
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  prepareSet(data, state) {
    if (data.stateId) {
      state = this.hf.patchValue(
        state,
        'description',
        'selected',
        data.stateName,
        true
      );
    }

    const townDetails = new CorporateTownModel(
      1,
      state,
      this.dialogData.description,
      this.dialogData.eghsRefTownId,
      this.fieldValidatorsService,
      this.translateService
    );
    return townDetails;
  }
  getCssProp() {
    const annot = (CorporateTownDetailsComponent as any).__annotations__;
    return annot && annot[0].styles;
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: 'Corporate Town Details Form',
      formDesc: 'Corporate Town',
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

  public formGroupCreated(formGroup: FormGroup) {
    formGroup.get('1-eghsRefTownId').disable({ onlySelf: true });
    if (this.dialogData.description !== '') {
      formGroup.get('1-state').disable({ onlySelf: true });
    }
  }
}
