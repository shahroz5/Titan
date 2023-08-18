import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { RegionsData, RegionEnum } from '@poss-web/shared/models';
import { RegionMasterModel } from '@poss-web/shared/ui-master-form-models';
import {
  HelperFunctions,
  TEMPLATE8
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-region-details',
  templateUrl: './region-details.component.html',
  styleUrls: ['./region-details.component.scss']
})
export class RegionDetailsComponent implements OnInit {
  dialogData: RegionsData;
  corporateTownForm: FormGroup;
  readOnly: boolean;

  public currentStyle: string[];
  public formFields: any;
  regionCode: any;
  description: any;
  isActive: any;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<RegionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private hf: HelperFunctions,
    public dialog: MatDialog
  ) {
    this.dialogData = data.data;
  }

  ngOnInit() {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onSave() {
    let mode = '';
    if (this.data.mode === 'edit') {
      mode = RegionEnum.edit;
    } else {
      mode = RegionEnum.new;
      this.isActive = true;
    }
    this.dialogRef.close({
      mode: mode,
      regionCode: this.regionCode,
      description: this.description,
      isActive: this.isActive
    });
  }

  onClose() {
    this.dialogRef.close();
  }


  prepareSet() {
    const townDetails = new RegionMasterModel(
      1,
      this.dialogData.regionCode,
      this.dialogData.description,
      this.fieldValidatorsService,
      this.translateService
    );

    return townDetails;
  }
  getCssProp() {
    const annot = (RegionDetailsComponent as any).__annotations__;
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
      formName: 'Corporate Town Details Form',
      formDesc: 'Corporate Town',
      formTemplate: TEMPLATE8
    };
  }
  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.regionCode = formValues['1-regionCode'];
    this.description = formValues['1-description'];
    // this.isActive = formValues['1-IsActive'];
    this.onSave();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.data.mode === 'edit') {
      formGroup.get('1-regionCode').disable({ onlySelf: true });
    }
  }

  deleteButton() {
    this.onClose();
  }
}
