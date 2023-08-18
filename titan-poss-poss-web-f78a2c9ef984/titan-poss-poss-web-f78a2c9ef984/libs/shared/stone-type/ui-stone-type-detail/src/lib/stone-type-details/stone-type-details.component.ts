import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ViewChild,
  ComponentFactoryResolver,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { StoneTypeEnum } from '@poss-web/shared/models';
import { StoneTypeMaster } from '@poss-web/shared/ui-master-form-models';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-stone-type-details',
  templateUrl: './stone-type-details.component.html'
})
export class StoneTypeDetailsComponent implements OnInit, OnDestroy {
  dialogData: any;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  stoneTypeEnum: StoneTypeEnum;

  stoneTypeCode: string;
  description: string;
  karatageWeightPrint: string;
  isActive: boolean;

  public currentStyle: string[];
  public formFields: any;
  private show = false;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<StoneTypeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public dialog: MatDialog,
    private hf: HelperFunctions,
    private test: ComponentFactoryResolver
  ) {
    this.dialogData = data.newFormData;
  }

  @ViewChild('mainPopup')
  mainPopupref: ElementRef;

  ngOnInit() {
    if (this.dialogData.stoneTypeCode !== StoneTypeEnum.NEW) {
      this.readOnly = true;
    }

    const form = this.prepareSet(this.dialogData);
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onCreate() {
    let mode = '';
    if (this.dialogData.stoneTypeCode !== StoneTypeEnum.NEW) {
      mode = StoneTypeEnum.edit;
    } else {
      mode = StoneTypeEnum.new;
      this.isActive = true;
    }

    this.dialogRef.close({
      stoneTypeCode: this.stoneTypeCode,
      description: this.description,
      configDetails: {
        karatageWeightPrint: this.karatageWeightPrint
      },
      isActive: this.isActive,
      mode: mode
    });
  }

  onClose() {
    this.dialogRef.close();
  }
  prepareSet(data) {
    const stoneType = new StoneTypeMaster(
      1,
      this.dialogData.stoneTypeCode === 'NEW'
        ? ''
        : this.dialogData.stoneTypeCode,
      this.dialogData.description,
      [
        {
          id: 'Yes',
          name: 'pw.stoneType.radioYes',
          checked: this.dialogData.configDetails.karatageWeightPrint === 'Yes'
        },
        {
          id: 'No',
          name: 'pw.stoneType.radioNo',
          checked: this.dialogData.configDetails.karatageWeightPrint === 'No'
        }
      ],
      this.fieldValidatorsService,
      this.translateService
    );
    return stoneType;
  }

  getCssProp() {
    const annot = (StoneTypeDetailsComponent as any).__annotations__;
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
      formName: 'Stone Type Form',
      formDesc: 'Stone Type',
      formTemplate: TEMPLATE8
    };
  }
  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.stoneTypeCode = formValues['1-stoneTypeCode'];
    this.description = formValues['1-description'];
    this.karatageWeightPrint = formValues['1-karatageWeightPrint'];
    // this.isActive = formValues['1-IsActive'][0];
    this.onCreate();
  }

  deleteButton() {
    this.onClose();
  }

  hideModal() {
    this.mainPopupref.nativeElement.style.display = 'none';
  }
  showModal() {
    this.mainPopupref.nativeElement.style.display = '';
  }
  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.stoneTypeCode !== 'NEW') {
      formGroup.get('1-stoneTypeCode').disable({ onlySelf: true });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
