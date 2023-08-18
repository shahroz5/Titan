import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionsData, SubRegionEnum } from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import {
  HelperFunctions,
  TEMPLATE8
} from '@poss-web/shared/components/ui-dynamic-form';
import { SubRegionMasterModel } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-sub-region-details',
  templateUrl: './sub-region-details.component.html',
  styleUrls: ['./sub-region-details.component.scss']
})
export class SubRegionDetailsComponent implements OnInit {
  dialogData: RegionsData;
  corporateTownForm: FormGroup;
  readOnly: boolean;

  public currentStyle: string[];
  public formFields: any;
  regionCode: any;
  description: any;
  isActive: any;

  destroy$: Subject<null> = new Subject<null>();
  parentRegionCode: any;

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<SubRegionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private hf: HelperFunctions,
    public dialog: MatDialog
  ) {
    this.dialogData = data.editData;
  }

  ngOnInit() {
    const form = this.prepareSet(this.dialogData, this.data.dropdown);
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onSave() {
    let mode = '';
    if (this.data.mode === 'edit') {
      mode = SubRegionEnum.edit;
    } else {
      mode = SubRegionEnum.new;
      this.isActive = true;
    }
    console.log(this.isActive, 'this.isActive');

    this.dialogRef.close({
      mode: mode,
      parentRegionCode: this.parentRegionCode,
      subRegionCode: this.regionCode,
      description: this.description,
      isActive: this.isActive
    });
  }

  onClose() {
    this.dialogRef.close();
  }


  prepareSet(data, regionCode) {
    console.log(data, regionCode, 'in prepare');

    // console.log(this.dialogData,"shfkhkh");

    if (data.regionCode) {
      regionCode = this.hf.patchValue(
        regionCode,
        'regionCode',
        'selected',
        data.parentRegionCode,
        true
      );
    }
    const subRegionDetails = new SubRegionMasterModel(
      1,
      regionCode,
      this.dialogData.regionCode,
      this.dialogData.description,
      this.fieldValidatorsService,
      this.translateService
    );

    return subRegionDetails;
  }
  getCssProp() {
    const annot = (SubRegionDetailsComponent as any).__annotations__;
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
    this.parentRegionCode = formValues['1-parentRegionCode'];
    this.regionCode = formValues['1-regionCode'];
    this.description = formValues['1-description'];
    // this.isActive = formValues['1-IsActive'];
    this.onSave();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.data.mode === 'edit') {
      formGroup.get('1-regionCode').disable({ onlySelf: true });
      formGroup.get('1-parentRegionCode').disable({ onlySelf: true });
    }
  }

  deleteButton() {
    this.onClose();
  }
}
