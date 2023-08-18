import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  BinGroupDetails,
  BinCodeSaveModel
  // BinGroupDropdown
} from '@poss-web/shared/models';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { BinCodeMaster } from '@poss-web/shared/ui-master-form-models';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-bin-code-dialog',
  templateUrl: './bin-code-dialog.component.html',
  styleUrls: ['./bin-code-dialog.component.scss']
})
export class BinCodeDialogComponent implements OnInit {
  binCodeNewForm: FormGroup;
  binGrouipDropdown: BinGroupDetails[];
  readOnly: boolean;
  binCodeSave: BinCodeSaveModel;

  public currentStyle: string[];
  public formFields: any;
  binGroup: string;
  binCode: string;
  description: string;
  isActive: boolean;
  requestedBin: string;
  destroy$: Subject<null> = new Subject<null>();
  // binGroupDropDownList = BinGroupDropdown;

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<BinCodeDialogComponent>,
    private router: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    fb: FormBuilder,
    public dialog: MatDialog,
    private hf: HelperFunctions
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.requestedBin = params.binCode;
    });
    let form;
    if (this.dialogData.editData) {
      form = this.prepareSet(this.dialogData, this.dialogData.dropDown);
    } else {
      form = this.prepareSet(this.dialogData, this.dialogData.dropDown);
    }

    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  prepareSet(data, binGroup) {
    console.log(this.dialogData.dropDown, 'test');

    if (data.binGroup) {
      binGroup = this.hf.patchValue(
        binGroup,
        'binGroupCode',
        'selected',
        data.binGroup,
        true
      );
    }

    if (this.dialogData.editData) {
      const binCode = new BinCodeMaster(
        1,
        binGroup,
        this.dialogData.editData.binCode
          ? this.dialogData.editData.binCode
          : '',
        this.dialogData.editData.description
          ? this.dialogData.editData.description
          : '',
        this.fieldValidatorsService,
        this.translateService
      );

      return binCode;
    } else {
      const binCode = new BinCodeMaster(
        1,
        binGroup,
        '',
        '',
        this.fieldValidatorsService,
        this.translateService
      );

      return binCode;
    }
  }

  onConfirm() {
    let mode = '';
    if (this.dialogData.editData) {
      mode = 'edit';
      this.isActive = this.dialogData.editData.isActive;
    } else {
      mode = 'new';
      this.isActive = true;
    }
    this.dialogRef.close({
      binCode: this.binCode,
      binGroupCode: this.binGroup,
      isActive: this.isActive,
      description: this.description,
      mode: mode
    });
  }

  getCssProp() {
    const annot = (BinCodeDialogComponent as any).__annotations__;
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
      formName: 'Bin Code Form',
      formDesc: 'Bin Code',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    console.log(formValues, 'formValues');

    if (this.dialogData.defaultDropdown) {
      this.binGroup = this.dialogData.defaultDropdown;
      this.binCode = formValues['1-binCode'];
      this.description = formValues['1-description'];
    } else {
      this.binGroup = formValues['1-binGroup'];
      this.binCode = formValues['1-binCode'];
      this.description = formValues['1-description'];
    }
    this.onConfirm();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.editData !== null) {
      formGroup.get('1-binGroup').disable({ onlySelf: true });
      formGroup.get('1-binCode').disable({ onlySelf: true });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  deleteButton() {
    this.onClose();
  }
}
