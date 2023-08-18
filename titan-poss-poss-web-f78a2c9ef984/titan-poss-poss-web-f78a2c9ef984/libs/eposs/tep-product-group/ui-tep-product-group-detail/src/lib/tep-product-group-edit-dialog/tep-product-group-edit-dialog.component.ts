import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  AddTEPProductGroupsMapping,
  TEPProductGroupConfigEnum,
  TEPProductGroupMappingGridData
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-product-group-edit-dialog',
  templateUrl: './tep-product-group-edit-dialog.component.html',
  styles: [
    `
      .pw-mat-form-field {
        width: 100%;
      }

      .pw-margin-right {
        margin-right: 15px;
      }

      .pw-mb10 {
        margin-bottom: 10px;
      }
      .pw-ml10 {
        margin-left: 10px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepProductGroupEditDialogComponent implements OnInit, OnDestroy {
  isTepAllowed: string;
  goldDeductionPercent: string;
  silverDeductionPercent: string;
  platinumDeductionPercent: string;
  ucpDeductionPercent: string;
  ucpDeductionFlatValue: string;
  isStoneChargesApplicable: string;
  stoneDeductionPercent: string;
  isCMMandatory: string;
  cmUnavailableDeductionPercent: string;
  weightTolerancePercent: string;
  isQuantityEditable: string;
  isTEPSaleBin: string; //
  refundDeductionPercent: string;
  isFVTAllowed: string;
  fvtDeductionPercent: string;
  isCmDeductionAllowed: string;
  cmDeductionPercent: string;
  isCutPieceTepAllowed: string;
  isInterBrandTepAllowed: string;
  typeOfExchange: string;
  recoverDiscountPercent: string;
  isProportionedValue: string;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    public dialogRef: MatDialogRef<TepProductGroupEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TEPProductGroupMappingGridData
  ) {
    this.translationService
      .get([
        'pw.tepProductGroupConfig.configName',
        'pw.tepProductGroupConfig.productGroups',
        'pw.tepProductGroupConfig.tepAllowed',
        'pw.tepProductGroupConfig.goldDedPercent',
        'pw.tepProductGroupConfig.silverDedPercent',
        'pw.tepProductGroupConfig.platinumDedPercent',
        'pw.tepProductGroupConfig.ucpDedPercent',
        'pw.tepProductGroupConfig.ucpDedFlat',
        'pw.tepProductGroupConfig.stoneChargesApplicable',
        'pw.tepProductGroupConfig.stoneValueDeductionPercent',
        'pw.tepProductGroupConfig.cmMandatory',
        'pw.tepProductGroupConfig.dedPercentCMUnavail',
        'pw.tepProductGroupConfig.wtTolerancePercent',
        'pw.tepProductGroupConfig.transTEPsalebin',
        'pw.tepProductGroupConfig.refundDedPercent',
        'pw.tepProductGroupConfig.fullValueTEP',
        'pw.tepProductGroupConfig.fullValueTEPDedPercent',
        'pw.tepProductGroupConfig.isAllowedToEditQuantity',
        'pw.tepProductGroupConfig.isCutPieceAllowed',
        'pw.tepProductGroupConfig.isInterBrandAllowed',
        'pw.tepProductGroupConfig.typeOfExchange',
        'pw.tepProductGroupConfig.isProportionedValue',
        'pw.tepProductGroupConfig.discountRecoveryPercent',
        'pw.tepProductGroupConfig.remove',
        'pw.tepProductGroupConfig.isCmDeductionApplicable',
        'pw.tepProductGroupConfig.cmDeductionApplicable',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.isTepAllowed =
          translatedMsg['pw.tepProductGroupConfig.tepAllowed'];
        this.goldDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.goldDedPercent'];
        this.silverDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.silverDedPercent'];
        this.platinumDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.platinumDedPercent'];
        this.ucpDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.ucpDedPercent'];
        this.ucpDeductionFlatValue =
          translatedMsg['pw.tepProductGroupConfig.ucpDedFlat'];
        this.isStoneChargesApplicable =
          translatedMsg['pw.tepProductGroupConfig.stoneChargesApplicable'];
        this.stoneDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.stoneValueDeductionPercent'];
        this.isCMMandatory =
          translatedMsg['pw.tepProductGroupConfig.cmMandatory'];
        this.cmUnavailableDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.dedPercentCMUnavail'];
        this.weightTolerancePercent =
          translatedMsg['pw.tepProductGroupConfig.wtTolerancePercent'];
        this.isTEPSaleBin =
          translatedMsg['pw.tepProductGroupConfig.transTEPsalebin'];
        this.refundDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.refundDedPercent'];
        this.isFVTAllowed =
          translatedMsg['pw.tepProductGroupConfig.fullValueTEP'];
        this.fvtDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.fullValueTEPDedPercent'];
        this.isCmDeductionAllowed =
        translatedMsg['pw.tepProductGroupConfig.isCmDeductionApplicable'];
        this.cmDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.cmDeductionApplicable'];
        this.isQuantityEditable =
          translatedMsg['pw.tepProductGroupConfig.isAllowedToEditQuantity'];
        this.isCutPieceTepAllowed =
          translatedMsg['pw.tepProductGroupConfig.isCutPieceAllowed'];
        this.isInterBrandTepAllowed =
          translatedMsg['pw.tepProductGroupConfig.isInterBrandAllowed'];
        this.typeOfExchange =
          translatedMsg['pw.tepProductGroupConfig.typeOfExchange'];
        this.recoverDiscountPercent =
          translatedMsg['pw.tepProductGroupConfig.discountRecoveryPercent'];
        this.isProportionedValue =
          translatedMsg['pw.tepProductGroupConfig.isProportionedValue'];
      });
  }

  tepProductGroupConfigMapping: FormGroup;

  destroy$: Subject<null> = new Subject<null>();

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.tepProductGroupConfigMapping = new FormGroup({
      isTepAllowed: new FormControl(this.data.isTepAllowed),
      goldDeductionPercent: new FormControl(this.data.goldDeductionPercent, [
        this.fieldValidatorsService.requiredField(this.goldDeductionPercent),
        this.fieldValidatorsService.percentageField(this.goldDeductionPercent)
      ]),
      silverDeductionPercent: new FormControl(
        this.data.silverDeductionPercent,
        [
          this.fieldValidatorsService.requiredField(
            this.silverDeductionPercent
          ),
          this.fieldValidatorsService.percentageField(
            this.silverDeductionPercent
          )
        ]
      ),
      platinumDeductionPercent: new FormControl(
        this.data.platinumDeductionPercent,
        [
          this.fieldValidatorsService.requiredField(
            this.platinumDeductionPercent
          ),
          this.fieldValidatorsService.percentageField(
            this.platinumDeductionPercent
          )
        ]
      ),
      ucpDeductionPercent: new FormControl(this.data.ucpDeductionPercent, [
        this.fieldValidatorsService.requiredField(this.ucpDeductionPercent),
        this.fieldValidatorsService.percentageField(this.ucpDeductionPercent)
      ]),
      ucpDeductionFlatValue: new FormControl(this.data.ucpDeductionFlatValue, [
        this.fieldValidatorsService.requiredField(this.ucpDeductionFlatValue),
        this.fieldValidatorsService.amountField(this.ucpDeductionFlatValue)
      ]),
      isStoneChargesApplicable: new FormControl(
        this.data.isStoneChargesApplicable
      ),
      stoneDeductionPercent: new FormControl(
        { value: this.data.stoneDeductionPercent, disabled: true },
        [
          this.fieldValidatorsService.requiredField(this.stoneDeductionPercent),
          this.fieldValidatorsService.percentageField(
            this.stoneDeductionPercent
          )
        ]
      ),
      isCMMandatory: new FormControl(this.data.isCMMandatory),
      cmUnavailableDeductionPercent: new FormControl(
        this.data.cmUnavailableDeductionPercent,
        [
          this.fieldValidatorsService.requiredField(
            this.cmUnavailableDeductionPercent
          ),
          this.fieldValidatorsService.percentageField(
            this.cmUnavailableDeductionPercent
          )
        ]
      ),
      weightTolerancePercent: new FormControl(
        this.data.weightTolerancePercent,
        [
          this.fieldValidatorsService.requiredField(
            this.weightTolerancePercent
          ),
          this.fieldValidatorsService.percentageField(
            this.weightTolerancePercent
          )
        ]
      ),
      isTEPSaleBin: new FormControl(this.data.isTEPSaleBin),
      refundDeductionPercent: new FormControl(
        this.data.refundDeductionPercent,
        [
          this.fieldValidatorsService.requiredField(
            this.refundDeductionPercent
          ),
          this.fieldValidatorsService.percentageField(
            this.refundDeductionPercent
          )
        ]
      ),
      isFVTAllowed: new FormControl(this.data.isFVTAllowed),
      fvtDeductionPercent: new FormControl(this.data.fvtDeductionPercent, [
        this.fieldValidatorsService.requiredField(this.cmDeductionPercent),
        this.fieldValidatorsService.percentageField(this.cmDeductionPercent)
      ]),
      isCmDeductionAllowed: new FormControl(this.data.isCmDeductionAllowed),
      cmDeductionPercent: new FormControl(this.data.cmDeductionPercent, [
        this.fieldValidatorsService.requiredField(this.cmDeductionPercent),
        this.fieldValidatorsService.percentageField(this.cmDeductionPercent)
      ]),
      isCutPieceTepAllowed: new FormControl(this.data.isCutPieceTepAllowed),
      isInterBrandTepAllowed: new FormControl(this.data.isInterBrandTepAllowed),
      typeOfExchange: new FormControl(
        this.data.typeOfExchange,
        this.fieldValidatorsService.requiredField(this.typeOfExchange)
      ),
      recoverDiscountPercent: new FormControl(
        this.data.recoverDiscountPercent,
        [
          this.fieldValidatorsService.requiredField(
            this.recoverDiscountPercent
          ),
          this.fieldValidatorsService.percentageField(
            this.recoverDiscountPercent
          )
        ]
      ),
      isProportionedValue: new FormControl(this.data.isProportionedValue)
    });

    this.tepProductGroupConfigMapping
      .get('isStoneChargesApplicable')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (val) {
          this.tepProductGroupConfigMapping
            .get('stoneDeductionPercent')
            .setValue('0');
          this.tepProductGroupConfigMapping
            .get('stoneDeductionPercent')
            .enable({ onlySelf: true });
        } else {
          this.tepProductGroupConfigMapping
            .get('stoneDeductionPercent')
            .setValue('');
          this.tepProductGroupConfigMapping
            .get('stoneDeductionPercent')
            .disable({ onlySelf: true });
        }
      });

    if (this.data.isStoneChargesApplicable) {
      this.tepProductGroupConfigMapping
        .get('stoneDeductionPercent')
        .enable({ onlySelf: true });
    }

    if (!this.tepProductGroupConfigMapping
      .get('isCmDeductionAllowed').value) {
      this.tepProductGroupConfigMapping
        .get('isCmDeductionAllowed').setValue(false);
      this.tepProductGroupConfigMapping
          .get('cmDeductionPercent')
          .disable({ onlySelf: true });
    }
    this.tepProductGroupConfigMapping
      .get('isCmDeductionAllowed')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (val) {
          this.tepProductGroupConfigMapping
            .get('cmDeductionPercent')
            .setValue('0');
          this.tepProductGroupConfigMapping
            .get('cmDeductionPercent')
            .enable({ onlySelf: true });
        } else {
          this.tepProductGroupConfigMapping
            .get('cmDeductionPercent')
            .setValue('');
          this.tepProductGroupConfigMapping
            .get('cmDeductionPercent')
            .disable({ onlySelf: true });
        }
      });

    if (this.data.isCmDeductionAllowed) {
      this.tepProductGroupConfigMapping
        .get('cmDeductionPercent')
        .enable({ onlySelf: true });
    }

    this.tepProductGroupConfigMapping
      .get('ucpDeductionPercent')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (val) {

          this.tepProductGroupConfigMapping
            .get('ucpDeductionFlatValue')
            .disable({ onlySelf: true });
        } else if (
          this.tepProductGroupConfigMapping.get('ucpDeductionFlatValue')
            .disabled
        ) {
          this.tepProductGroupConfigMapping
            .get('ucpDeductionFlatValue')
            .enable({ onlySelf: true });
        }
      });

    this.tepProductGroupConfigMapping
      .get('ucpDeductionFlatValue')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (val) {

          this.tepProductGroupConfigMapping
            .get('ucpDeductionPercent')
            .disable({ onlySelf: true });
        } else if (
          this.tepProductGroupConfigMapping.get('ucpDeductionPercent').disabled
        ) {
          this.tepProductGroupConfigMapping
            .get('ucpDeductionPercent')
            .enable({ onlySelf: true });
        }
      });

    if (this.data.ucpDeductionPercent !== null) {
      this.tepProductGroupConfigMapping
        .get('ucpDeductionFlatValue')
        .disable({ onlySelf: true });
    }

    if (this.data.ucpDeductionFlatValue !== null) {
      this.tepProductGroupConfigMapping
        .get('ucpDeductionPercent')
        .disable({ onlySelf: true });
    }
    if (this.data.productGroups === '74') {
      this.tepProductGroupConfigMapping
        .get('weightTolerancePercent')
        .disable({ onlySelf: true });
    }

  }

  onSubmit() {
    if (this.tepProductGroupConfigMapping.valid) {
      const values = this.tepProductGroupConfigMapping.getRawValue();
      const addTEPProductGroupsMapping: AddTEPProductGroupsMapping = {
        updateProductGroups: [
          {
            configDetails: {
              data: values,
              type: TEPProductGroupConfigEnum.TEP_PRODUCT_CONFIG
            },
            id: this.data.uuid
          }
        ]
      };
      this.dialogRef.close(addTEPProductGroupsMapping);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClose() {
    this.dialogRef.close();
  }
}
