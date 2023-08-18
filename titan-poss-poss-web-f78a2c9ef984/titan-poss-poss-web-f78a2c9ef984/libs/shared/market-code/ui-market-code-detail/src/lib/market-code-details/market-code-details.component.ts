import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  MarketCodeEnums,
  MarketCodeDetails,
  MarketMaterialTypes
} from '@poss-web/shared/models';
import {
  MarketCodeMaster,
  MarketMaterialFactorsMaster
} from '@poss-web/shared/ui-master-form-models';
import {
  TEMPLATE8,
  TEMPLATE10
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-market-code-details',
  templateUrl: './market-code-details.component.html',
  styleUrls: ['./market-code-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketCodeDetailsComponent implements OnInit, OnDestroy {
  @Output() formDetails = new EventEmitter<any>();
  marketCode: string;
  marketDetails = new EventEmitter();
  marketMaterialFactors = new EventEmitter();
  @Output() data1 = new EventEmitter<any>();
  dialogData: any;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  public currentStyle: string[];
  public formFields: any;
  public formFields1: any;
  hasSaved = false;
  isActive = true;
  materialDetailsFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<MarketCodeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.dialogData = data;
  }

  ngOnInit() {
    this.cdr.markForCheck();
    if (this.dialogData.marketCode !== MarketCodeEnums.NEW) {
      this.readOnly = true;
    }
    const form = this.prepareSet();
    this.formFields = this.getInputsOfMarketCode(form);
    const marketMaterialFacatorsForm = this.prepareSet1();
    this.formFields1 = this.getInputs(marketMaterialFacatorsForm);
    this.currentStyle = this.getCssProp();
  }
  getCssProp() {
    const annot = (MarketCodeDetailsComponent as any).__annotations__;
    return annot[0].styles;
  }
  prepareSet() {
    const marketCode = new MarketCodeMaster(
      1,
      this.dialogData.marketCode === MarketCodeEnums.NEW
        ? ''
        : this.dialogData.marketCode,
      this.dialogData.description,
      // [
      //   {
      //     id: '1',
      //     name: 'pw.marketCode.isActive',
      //     checked:
      //       this.dialogData.marketCode === MarketCodeEnums.NEW
      //         ? true
      //         : this.dialogData.isActive
      //   }
      // ],
      this.fieldValidatorsService,
      this.translateService
    );
    return marketCode;
  }
  prepareSet1() {
    const goldaddAmount = this.dialogData.marketMaterialFacators.goldAddAmount
      ? this.dialogData.marketMaterialFacators.goldAddAmount.toString()
      : '0.00';
    const goldDeductAmount = this.dialogData.marketMaterialFacators
      .goldDeductAmount
      ? this.dialogData.marketMaterialFacators.goldDeductAmount.toString()
      : '0.00';
    const goldMarkupFactor = this.dialogData.marketMaterialFacators
      .goldMarkupFactor
      ? this.dialogData.marketMaterialFacators.goldMarkupFactor.toString()
      : '';
    const silveraddAmount = this.dialogData.marketMaterialFacators
      .silverAddAmount
      ? this.dialogData.marketMaterialFacators.silverAddAmount.toString()
      : '0.00';
    const silverDeductAmount = this.dialogData.marketMaterialFacators
      .silverDeductAmount
      ? this.dialogData.marketMaterialFacators.silverDeductAmount.toString()
      : '0.00';
    const silverMarkupFactor = this.dialogData.marketMaterialFacators
      .silverMarkupFactor
      ? this.dialogData.marketMaterialFacators.silverMarkupFactor.toString()
      : '';
    const platinumaddAmount = this.dialogData.marketMaterialFacators
      .platinumAddAmount
      ? this.dialogData.marketMaterialFacators.platinumAddAmount.toString()
      : '0.00';
    const platinumDeductAmount = this.dialogData.marketMaterialFacators
      .platinumDeductAmount
      ? this.dialogData.marketMaterialFacators.platinumDeductAmount.toString()
      : '0.00';
    const platinumMarkupFactor = this.dialogData.marketMaterialFacators
      .platinumMarkupFactor
      ? this.dialogData.marketMaterialFacators.platinumMarkupFactor.toString()
      : '';

    const f1MarkupFactor = this.dialogData.marketMaterialFacators.f1MarkupFactor
      ? this.dialogData.marketMaterialFacators.f1MarkupFactor.toString()
      : '0.00';
    const f2MarkupFactor = this.dialogData.marketMaterialFacators.f2MarkupFactor
      ? this.dialogData.marketMaterialFacators.f2MarkupFactor.toString()
      : '0.00';

    const marketMaterialFactors = new MarketMaterialFactorsMaster(
      2,
      goldMarkupFactor,
      goldaddAmount,
      goldDeductAmount,
      silverMarkupFactor,
      silveraddAmount,
      silverDeductAmount,
      platinumMarkupFactor,
      platinumaddAmount,
      platinumDeductAmount,
      f1MarkupFactor,
      f2MarkupFactor,
      this.fieldValidatorsService,
      this.translateService
    );
    return marketMaterialFactors;
  }
  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public getInputsOfMarketCode(form) {
    return {
      formConfig: this.setFormConfigOfMarketCodeDetailsForm(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfigOfMarketCodeDetailsForm() {
    return {
      formName: 'Market Code Form',
      formDesc: 'MarketCode',
      formTemplate: TEMPLATE10
    };
  }
  public setFormConfig() {
    return {
      formName: 'Market Code Form',
      formDesc: 'MarketCode',
      formTemplate: TEMPLATE8
    };
  }
  add(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.marketCode = formValues['1-marketCode'];
    const marketDetails: MarketCodeDetails = {
      marketCode: formValues['1-marketCode'],
      description: formValues['1-description'],
      isActive: true
    };
    this.onMarketCreate(marketDetails);
  }
  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    const materialTypes: MarketMaterialTypes = {
      goldAddAmount: formValues['2-goldAddAmount'],
      goldDeductAmount: formValues['2-goldDeductAmount'],
      goldMarkupFactor: formValues['2-goldMarkupFactor'],
      silverAddAmount: formValues['2-silverAddAmount'],
      silverDeductAmount: formValues['2-silverDeductAmount'],
      silverMarkupFactor: formValues['2-silverMarkupFactor'],
      platinumAddAmount: formValues['2-platinumAddAmount'],
      platinumDeductAmount: formValues['2-platinumDeductAmount'],
      platinumMarkupFactor: formValues['2-platinumMarkupFactor'],
      f1MarkupFactor: formValues['2-f1MarkupFactor'],
      f2MarkupFactor: formValues['2-f2MarkupFactor']
    };
    this.onMarketMaterialTypeCreate(materialTypes);
  }

  onMarketCreate(marketDetails) {
    let mode = '';
    if (this.dialogData.marketCode !== MarketCodeEnums.NEW) {
      mode = MarketCodeEnums.edit;
    } else {
      mode = MarketCodeEnums.new;
    }

    this.marketDetails.emit({
      marketDetails: marketDetails,
      mode: mode,
      type: MarketCodeEnums.marketDetails
    });
  }
  onMarketMaterialTypeCreate(materialTypes: MarketMaterialTypes) {
    let mode = '';
    let marketCode = '';
    if (this.dialogData.marketCode !== MarketCodeEnums.NEW) {
      mode = MarketCodeEnums.edit;
      marketCode = this.dialogData.marketCode;
    } else {
      mode = MarketCodeEnums.new;
      marketCode = this.marketCode;
    }

    this.dialogRef.close({
      marketCode: marketCode,
      materialTypes: materialTypes,
      mode: mode,
      type: MarketCodeEnums.materialTypes
    });
  }
  onClose() {
    this.dialogRef.close();
  }
  deleteButton() {
    this.dialogRef.close();
  }
  public formGroupCreated(formGroup) {
    this.materialDetailsFormGroup = formGroup;
    if (this.dialogData.marketCode !== 'NEW') {
      formGroup.get('1-marketCode').disable({ onlySelf: true });
      formGroup.get('1-description').disable({ onlySelf: true });
      //formGroup.get('1-isActive').disable({ onlySelf: true });
    }
  }
  public marketMaterialFacatorsFormCreated(formGroup) {
    if (this.dialogData.marketCode !== 'NEW') {
      formGroup.get('2-goldMarkupFactor').enable({ onlySelf: true });
      formGroup.get('2-goldAddAmount').enable({ onlySelf: true });
      formGroup.get('2-goldDeductAmount').enable({ onlySelf: true });
      formGroup.get('2-platinumMarkupFactor').enable({ onlySelf: true });
      formGroup.get('2-platinumAddAmount').enable({ onlySelf: true });
      formGroup.get('2-platinumDeductAmount').enable({ onlySelf: true });
      formGroup.get('2-silverMarkupFactor').enable({ onlySelf: true });
      formGroup.get('2-silverAddAmount').enable({ onlySelf: true });
      formGroup.get('2-silverDeductAmount').enable({ onlySelf: true });
      formGroup.get('2-f1MarkupFactor').enable({ onlySelf: true });
      formGroup.get('2-f2MarkupFactor').enable({ onlySelf: true });
    } else {
      formGroup.get('2-goldMarkupFactor').disable({ onlySelf: true });
      formGroup.get('2-goldAddAmount').disable({ onlySelf: true });
      formGroup.get('2-goldDeductAmount').disable({ onlySelf: true });
      formGroup.get('2-platinumMarkupFactor').disable({ onlySelf: true });
      formGroup.get('2-platinumAddAmount').disable({ onlySelf: true });
      formGroup.get('2-platinumDeductAmount').disable({ onlySelf: true });
      formGroup.get('2-silverMarkupFactor').disable({ onlySelf: true });
      formGroup.get('2-silverAddAmount').disable({ onlySelf: true });
      formGroup.get('2-silverDeductAmount').disable({ onlySelf: true });

      formGroup.get('2-f1MarkupFactor').disable({ onlySelf: true });
      formGroup.get('2-f2MarkupFactor').disable({ onlySelf: true });
    }
    this.dialogData.status
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          formGroup.get('2-goldMarkupFactor').enable({ onlySelf: true });
          formGroup.get('2-goldAddAmount').enable({ onlySelf: true });
          formGroup.get('2-goldDeductAmount').enable({ onlySelf: true });
          formGroup.get('2-platinumMarkupFactor').enable({ onlySelf: true });
          formGroup.get('2-platinumAddAmount').enable({ onlySelf: true });
          formGroup.get('2-platinumDeductAmount').enable({ onlySelf: true });
          formGroup.get('2-silverMarkupFactor').enable({ onlySelf: true });
          formGroup.get('2-silverAddAmount').enable({ onlySelf: true });
          formGroup.get('2-silverDeductAmount').enable({ onlySelf: true });
          formGroup.get('2-f1MarkupFactor').enable({ onlySelf: true });
          formGroup.get('2-f2MarkupFactor').enable({ onlySelf: true });
          this.materialDetailsFormGroup
            .get('1-marketCode')
            .disable({ onlySelf: true });
          this.materialDetailsFormGroup
            .get('1-description')
            .disable({ onlySelf: true });
          // this.materialDetailsFormGroup
          //   .get('1-isActive')
          //   .disable({ onlySelf: true });
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
