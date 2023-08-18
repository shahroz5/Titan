import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ViewChild,
  ComponentFactoryResolver,
  ElementRef,
  Input
} from '@angular/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';

import { ComplexityPriceGroupEnum } from '@poss-web/shared/models';
import { ComplexityPriceGroupMaster } from '@poss-web/shared/ui-master-form-models';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';

@Component({
  selector: 'poss-web-complexity-pricegroup-details',
  templateUrl: './complexity-pricegroup-details.component.html'
})
export class ComplexityPricegroupDetailsComponent implements OnInit, OnDestroy {
  @Input() complexityCodes: Observable<any>;
  @Input() priceGroups: Observable<any>;
  dialogData: any;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  complexityPriceGroupEnum: ComplexityPriceGroupEnum;

  id: string;
  complexityCode: string;
  priceGroup: string;
  makingChargesPerUnit: string;
  makingChargesPerGram: string;
  wastagePercentage: string;
  makingChargesPercentage: string;

  public currentStyle: string[];
  public formFields: any;
  private show = false;

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<ComplexityPricegroupDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public dialog: MatDialog,
    private hf: HelperFunctions,
    private test: ComponentFactoryResolver
  ) {
    this.dialogData = data;
  }

  @ViewChild('mainPopup')
  mainPopupref: ElementRef;

  ngOnInit() {
    if (this.dialogData.newFormData.id !== ComplexityPriceGroupEnum.NEW) {
      this.readOnly = true;
    }
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onCreate() {
    let mode = '';
    if (this.dialogData.newFormData.id !== ComplexityPriceGroupEnum.NEW) {
      mode = ComplexityPriceGroupEnum.edit;
    } else {
      mode = ComplexityPriceGroupEnum.new;
    }

    this.dialogRef.close({
      id: this.dialogData.newFormData.id,
      complexityCode: this.complexityCode,
      priceGroup: this.priceGroup,
      makingChargesPerUnit: this.makingChargesPerUnit,
      makingChargesPerGram: this.makingChargesPerGram,
      wastagePercentage: this.wastagePercentage,
      makingChargesPercentage: this.makingChargesPercentage,
      mode: mode
    });
  }

  onClose() {
    this.dialogRef.close();
  }
  prepareSet() {
    const complexityCodeDetails = this.prepareComplexityCode(
      this.dialogData.complexityCode
    );
    const priceGroupDetails = this.preparePriceGroup(
      this.dialogData.priceGroup
    );
    const complexityPricegroup = new ComplexityPriceGroupMaster(
      1,
      complexityCodeDetails,
      priceGroupDetails,
      this.dialogData.newFormData.makingChargesPerUnit,
      this.dialogData.newFormData.makingChargesPerGram,
      this.dialogData.newFormData.wastagePercentage,
      this.dialogData.newFormData.makingChargesPercentage,
      this.fieldValidatorsService,
      this.translateService
    );
    return complexityPricegroup;
  }

  prepareComplexityCode(complexityCodeDetails) {
    const complexity = this.hf.patchValue(
      complexityCodeDetails,
      'id',
      'selected',
      this.dialogData.newFormData.complexityCode
        ? this.dialogData.newFormData.complexityCode
        : '',
      true
    );

    return complexity;
  }

  preparePriceGroup(priceGroupDetails) {
    const priceGroup = this.hf.patchValue(
      priceGroupDetails,
      'id',
      'selected',
      this.dialogData.newFormData.priceGroup
        ? this.dialogData.newFormData.priceGroup
        : '',
      true
    );

    return priceGroup;
  }

  getCssProp() {
    const annot = (ComplexityPricegroupDetailsComponent as any).__annotations__;
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
      formName: 'Complexity Price Group Form',
      formDesc: 'Complexity Price Group',
      formTemplate: TEMPLATE8
    };
  }
  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();

    this.complexityCode = formValues['1-complexityCode'];
    this.priceGroup = formValues['1-priceGroup'];
    this.makingChargesPerUnit = formValues['1-makingChargesPerUnit'];
    this.makingChargesPerGram = formValues['1-makingChargesPerGram'];
    this.wastagePercentage = formValues['1-wastagePercentage'];
    this.makingChargesPercentage = formValues['1-makingChargesPercentage'];

    this.onCreate();
  }

  deleteButton() {
    this.onClose();
  }

  // hideModal() {
  //   this.mainPopupref.nativeElement.style.display = 'none';
  // }
  // showModal() {
  //   this.mainPopupref.nativeElement.style.display = '';
  // }
  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.newFormData.id !== 'NEW') {
      formGroup.get('1-complexityCode').disable({ onlySelf: true });
      formGroup.get('1-priceGroup').disable({ onlySelf: true });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
