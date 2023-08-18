import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { stateEnum } from '@poss-web/shared/models';
import { StateMasterModel } from '@poss-web/shared/ui-master-form-models';
import {
  HelperFunctions,
  TEMPLATE8
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-state-details',
  templateUrl: './state-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateDetailsComponent implements OnInit {
  dialogData: any;

  readOnly: boolean;
  public currentStyle: string[];
  public formFields: any;
  public formFields1: any;
  country: any;
  isUnionTerritory: any;
  description: string;
  stateCode: number;
  isActive: any;
  stateId: any;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public dialogRef: MatDialogRef<StateDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private hf: HelperFunctions,
    public dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
  ) {
    this.dialogData = data.data;
  }

  ngOnInit() {
    const form = this.prepareSet(this.dialogData, this.data.countryDropdown);
    this.formFields = this.getInputs(form);

    this.currentStyle = this.getCssProp();
  }

  onClose() {
    this.dialogRef.close();
  }

  prepareSet(dialogData, countryCode) {
    if (dialogData.countryCode) {
      countryCode = this.hf.patchValue(
        countryCode,
        'countryCode',
        'selected',
        dialogData.countryCode,
        true
      );
    }

    const stateDetails = new StateMasterModel(
      1,
      countryCode,
      [
        {
          id: 'false',
          name: 'pw.states.isState',
          checked: !this.dialogData.isUnionTerritory
            ? !this.dialogData.isUnionTerritory
            : false
        },
        {
          id: 'true',
          name: 'pw.states.isUT',
          checked: this.dialogData.isUnionTerritory
            ? this.dialogData.isUnionTerritory
            : false
        }
      ],
      this.dialogData.stateCode === 'NEW' ? '' : this.dialogData.stateCode,
      this.dialogData.description ? this.dialogData.description : '',
      this.dialogData.eghsRefStateId !== null
        ? this.dialogData.eghsRefStateId
        : null,
      this.fieldValidatorsService,
      this.translateService
    );

    return stateDetails;
  }

  getCssProp() {
    const annot = (StateDetailsComponent as any).__annotations__;
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
      formName: 'State Details Form',
      formDesc: 'State Town',
      formTemplate: TEMPLATE8
    };
  }
  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.country = formValues['1-country'];
    this.isUnionTerritory = formValues['1-isUnionTerritory'];
    this.stateCode = formValues['1-stateCode'];
    this.description = formValues['1-description'];

    this.onSave();
  }

  onSave() {
    let mode = '';

    if (this.dialogData.stateCode !== stateEnum.NEW) {
      mode = stateEnum.edit;
      this.stateId = this.dialogData.stateId;
    } else {
      mode = stateEnum.NEW;
    }
    this.dialogRef.close({
      countryCode: this.country,
      isUnionTerritory: this.isUnionTerritory,
      stateCode: this.stateCode,
      description: this.description,
      mode: mode,
      stateId: this.stateId
    });
  }

  public formGroupCreated(formGroup: FormGroup) {
    // if (this.data.mode === 'edit') {
    formGroup.get('1-eghsRefStateId').disable({ onlySelf: true });
    // }
    // if (this.dialogData.isUnionTerritory) {
    //   formGroup.get('1-stateCode').setValue({ onlySelf: true });
    // }
  }

  deleteButton() {
    this.dialogRef.close();
  }
}
