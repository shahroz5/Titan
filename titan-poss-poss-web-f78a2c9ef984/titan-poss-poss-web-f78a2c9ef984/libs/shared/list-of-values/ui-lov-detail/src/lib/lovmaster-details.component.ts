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
import { FormGroup } from '@angular/forms';
import {
  LovMaster,
  LovMasterType,
  LovMasterEnum
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';
import { LovMasterModel } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-lovmaster-details',
  templateUrl: './lovmaster-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LovmasterDetailsComponent implements OnInit, OnDestroy {
  dialogData: LovMaster;
  lovMasterType: LovMasterType[] = [];

  lovType: string;
  lovCode: string;
  description: string;
  isActive: boolean;

  destroy$: Subject<null> = new Subject<null>();

  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private hf: HelperFunctions,
    public dialogRef: MatDialogRef<LovmasterDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data.data;
    data.lovMasterType.forEach(element => {
      this.lovMasterType.push({
        value: element.value,
        name: this.translateService.instant(element.name)
      });
    });
  }

  ngOnInit() {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  /// below is dynamic form specific code

  prepareSet() {
    this.lovMasterType = this.lovMasterType.map(data => {
      return {
        name: data.name,
        value: data.value.split('|')[0]
      };
    });

    this.lovMasterType = this.hf.patchValue(
      this.lovMasterType,
      'value',
      'selected',
      this.dialogData.lovType,
      true
    );

    const lovMasterModel = new LovMasterModel(
      1,
      this.lovMasterType,
      this.dialogData.lovName,
      this.dialogData.description,
      // [{ id: '1', name: 'Is Active', checked: this.dialogData.isActive }],
      this.fieldValidatorsService,
      this.translateService
    );
    return lovMasterModel;
  }

  getCssProp() {
    const annot = (LovmasterDetailsComponent as any).__annotations__;
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

  onCreate() {
    let mode = '';
    if (this.dialogData.lovName) {
      mode = LovMasterEnum.edit;
    } else {
      mode = LovMasterEnum.new;
    }

    const data: { mode: string; data: LovMaster } = {
      mode,
      data: {
        lovType: this.lovType,
        lovName: this.lovCode,
        description: this.description,
        isActive: this.isActive
      }
    };

    this.dialogRef.close(data);
  }
  onClose() {
    this.dialogRef.close();
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    console.log('Log: addButton -> formValues', formValues);
    this.lovType = formValues['1-lovType'];
    this.lovCode = formValues['1-lovCode'];
    this.description = formValues['1-desctiption'];
    this.isActive = true; //formValues['1-isActive'][0];
    this.onCreate();
  }

  deleteButton() {
    this.onClose();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.lovName) {
      formGroup.get('1-lovType').disable({ onlySelf: true });
      formGroup.get('1-lovCode').disable({ onlySelf: true });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
