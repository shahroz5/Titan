import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  ContextTypeEnum,
  MetalTypeEnum,
  MetalRatesPayload,
  LocationSummaryList,
  MetalRates,
  GenerateBoutiquePasswordForManualBillRequest,
  GenerateBoutiquePasswordForGoldRateRequest,
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateBoutiquePasswordForGoldRateResponse,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  TransactionTypes,
  TxnTypeEnum
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';

@Component({
  selector: 'poss-web-boutique-generate-password',
  templateUrl: './boutique-generate-password.component.html',
  styleUrls: ['./boutique-generate-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoutiqueGeneratePasswordComponent
  implements OnInit, OnChanges, OnDestroy {
  generateBoutiquePasswordForm: FormGroup = new FormGroup({});
  @Output() generateBoutiquePasswordForManualBill = new EventEmitter<
    GenerateBoutiquePasswordForManualBillRequest
  >();
  @Output() generateBoutiquePasswordForGoldRate = new EventEmitter<
    GenerateBoutiquePasswordForGoldRateRequest
  >();
  @Output() getMaterialRate = new EventEmitter<MetalRatesPayload>();
  @Input() generateBoutiquePasswordForManualBillResponse$: Observable<
    GenerateBoutiquePasswordForManualBillResponse
  >;
  @Input() generateBoutiquePasswordForGoldRateResponse$: Observable<
    GenerateBoutiquePasswordForGoldRateResponse
  >;
  @Input() materialRates$: Observable<MetalRates[]>;
  @Input() locationCodes$: Observable<LocationSummaryList[]>;
  @Input() documentTypes: TransactionTypes[];
  @Input() clearPriceEvent: Observable<null>;
  @Input() contextType: string;
  currentDate = moment();
  minDate = moment('00010101');
  destroy$: Subject<null> = new Subject<null>();
  show = false;
  goldRates = [];
  platinumRates = [];
  silverRates = [];
  weightCode = 'gms';
  locationCodeLabel: string;
  goldRateLabel: string;
  platinumRateLabel: string;
  silverRateLabel: string;
  goldWeightLabel: string;
  platinumWeightLabel: string;
  silverWeightLabel: string;
  billDateLabel: string;
  remarksLabel: string;
  billNumberLabel: string;
  billValueLabel: string;
  documentTypeLabel: string;
  approvedByLabel: string;
  businessDateLabel: string;
  @Input() currencyCode: string;
  searchLocationPlaceHolder: string;
  selectLocationLableText: string;
  locationForSelection: SelectionDailogOption[] = [];
  contextTypeEnumRef = ContextTypeEnum;
  @ViewChild(FormGroupDirective) private formGroupDirective: FormGroupDirective;
  documentTypesOptions = [];
  isGeneratePassword: boolean;
  disableGeneratePassword = false;
  txnTypeEnumRef = TxnTypeEnum;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    private selectionDialog: SelectionDialogService,
    private currencyFormatterService: CurrencyFormatterService,
    private cdr: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.passwordConfig.locationCodePlaceHolder',
        'pw.passwordConfig.goldRateLabel',
        'pw.passwordConfig.platinumRateLabel',
        'pw.passwordConfig.silverRateLabel',
        'pw.passwordConfig.goldWeightLabel',
        'pw.passwordConfig.platinumWeightLabel',
        'pw.passwordConfig.silverWeightLabel',
        'pw.passwordConfig.billDateLabel',
        'pw.passwordConfig.remarksLabel',
        'pw.passwordConfig.billNumberLabel',
        'pw.passwordConfig.billValueLabel',
        'pw.passwordConfig.documentTypeLabel',
        'pw.passwordConfig.selectLocationPlaceHolder',
        'pw.passwordConfig.searchByLocationPlaceHolder',
        'pw.passwordConfig.approvedByLabel',
        'pw.passwordConfig.businessDateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.locationCodeLabel =
          translatedMsg['pw.passwordConfig.locationCodePlaceHolder'];
        this.goldRateLabel = translatedMsg['pw.passwordConfig.goldRateLabel'];
        this.platinumRateLabel =
          translatedMsg['pw.passwordConfig.platinumRateLabel'];
        this.silverRateLabel =
          translatedMsg['pw.passwordConfig.silverRateLabel'];
        this.goldWeightLabel =
          translatedMsg['pw.passwordConfig.goldWeightLabel'];
        this.platinumWeightLabel =
          translatedMsg['pw.passwordConfig.platinumWeightLabel'];
        this.silverWeightLabel =
          translatedMsg['pw.passwordConfig.silverWeightLabel'];
        this.billDateLabel = translatedMsg['pw.passwordConfig.billDateLabel'];
        this.remarksLabel = translatedMsg['pw.passwordConfig.remarksLabel'];
        this.billNumberLabel =
          translatedMsg['pw.passwordConfig.billNumberLabel'];
        this.billValueLabel = translatedMsg['pw.passwordConfig.billValueLabel'];
        this.documentTypeLabel =
          translatedMsg['pw.passwordConfig.documentTypeLabel'];
        this.selectLocationLableText =
          translatedMsg['pw.passwordConfig.selectLocationPlaceHolder'];
        this.searchLocationPlaceHolder =
          translatedMsg['pw.passwordConfig.searchByLocationPlaceHolder'];
        this.approvedByLabel =
          translatedMsg['pw.passwordConfig.approvedByLabel'];
        this.businessDateLabel =
          translatedMsg['pw.passwordConfig.businessDateLabel'];
      });
  }

  ngOnInit(): void {
    this.generateBoutiquePasswordForm = this.createForm();
    this.generateBoutiquePasswordForManualBillResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: GenerateBoutiquePasswordForManualBillResponse) => {
        if (data) {
          this.generateBoutiquePasswordForm
            .get(['password'])
            .patchValue(data.password);
          this.disableForm();
          if (data.isOld) {
            const passwordAlreadyGeneratedMsgKey =
              'pw.passwordConfig.passwordAlreadyGeneratedMsg';
            this.showErrorMessage(passwordAlreadyGeneratedMsgKey);
          }
        }
      });
    this.generateBoutiquePasswordForGoldRateResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: GenerateBoutiquePasswordForGoldRateResponse) => {
        if (data) {
          this.generateBoutiquePasswordForm
            .get(['password'])
            .patchValue(data.password);
          this.disableForm();
        }
      });
    this.materialRates$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: MetalRates[]) => {
        if (data !== null) {
          this.goldRates = [];
          this.platinumRates = [];
          this.silverRates = [];
          data.forEach(materialData => {
            if (
              materialData.metalTypeCode === MetalTypeEnum.GOLD &&
              this.generateBoutiquePasswordForm.value.metalRates.gold
                .materialTypeCode !== null
            ) {
              this.goldRates.push({
                value: materialData.ratePerUnit,
                description:
                  this.currencyFormatterService.format(
                    materialData.ratePerUnit
                  ) + `(${materialData.priceType})`
              });
              this.generateBoutiquePasswordForm
                .get(['metalRates', 'gold', 'ratePerUnit'])
                .patchValue(this.goldRates[0].value);
            }
            if (
              materialData.metalTypeCode === MetalTypeEnum.PLATINUM &&
              this.generateBoutiquePasswordForm.value.metalRates.platinum
                .materialTypeCode !== null
            ) {
              this.platinumRates.push({
                value: materialData.ratePerUnit,
                description:
                  this.currencyFormatterService.format(
                    materialData.ratePerUnit
                  ) + `(${materialData.priceType})`
              });
              this.generateBoutiquePasswordForm
                .get(['metalRates', 'platinum', 'ratePerUnit'])
                .patchValue(this.platinumRates[0].value);
            }
            if (
              materialData.metalTypeCode === MetalTypeEnum.SILVER &&
              this.generateBoutiquePasswordForm.value.metalRates.silver
                .materialTypeCode !== null
            ) {
              this.silverRates.push({
                value: materialData.ratePerUnit,
                description:
                  this.currencyFormatterService.format(
                    materialData.ratePerUnit
                  ) + `(${materialData.priceType})`
              });
              this.generateBoutiquePasswordForm
                .get(['metalRates', 'silver', 'ratePerUnit'])
                .patchValue(this.silverRates[0].value);
            }
          });
        }
      });

    this.generateBoutiquePasswordForm
      .get(['locationCode'])
      .valueChanges.subscribe(val => {
        if (val) {
          this.resetMetalField();
          this.disableMetalRateFields();
          this.generateBoutiquePasswordForm.patchValue({ password: null });
        }
      });

    this.generateBoutiquePasswordForm
      .get(['manualBillDate'])
      .valueChanges.subscribe(val => {
        if (val) {
          this.formGroupDirective.resetForm();
          this.resetMetalRates();
          this.disableMetalRateFields();
          this.generateBoutiquePasswordForm.patchValue(
            {
              manualBillDate: val
            },
            { emitEvent: false }
          );
        }
      });

    this.locationCodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });

    this.clearPriceEvent.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.goldRates = [];
      this.platinumRates = [];
      this.silverRates = [];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contextType'] && this.contextType) {
      if (this.generateBoutiquePasswordForm && this.formGroupDirective) {
        this.enableMainFields();
        this.resetMetalRates();
        this.disableMetalRateFields();
        this.formGroupDirective.resetForm();
        if (this.contextType === ContextTypeEnum.GOLD_RATE) {
          this.generateBoutiquePasswordForm.get(['txnType']).disable();
          this.generateBoutiquePasswordForm.get(['manualBillNo']).disable();
          this.generateBoutiquePasswordForm.get(['manualBillValue']).disable();
          this.generateBoutiquePasswordForm.get(['approvedBy']).disable();
          this.generateBoutiquePasswordForm.get(['isBimetal']).disable();
          this.generateBoutiquePasswordForm
            .get(['manualBillDate'])
            .clearValidators();
          this.generateBoutiquePasswordForm
            .get(['manualBillDate'])
            .setValidators([
              this.fieldValidatorsService.requiredField(this.businessDateLabel)
            ]);
          this.generateBoutiquePasswordForm
            .get(['manualBillDate'])
            .updateValueAndValidity();
        } else {
          this.generateBoutiquePasswordForm.get(['txnType']).enable();
          this.generateBoutiquePasswordForm.get(['manualBillNo']).enable();
          this.generateBoutiquePasswordForm.get(['manualBillValue']).enable();
          this.generateBoutiquePasswordForm.get(['approvedBy']).enable();
          this.generateBoutiquePasswordForm.get(['isBimetal']).enable();
          this.generateBoutiquePasswordForm
            .get(['manualBillDate'])
            .clearValidators();
          this.generateBoutiquePasswordForm
            .get(['manualBillDate'])
            .setValidators([
              this.fieldValidatorsService.requiredField(this.billDateLabel)
            ]);
          this.generateBoutiquePasswordForm
            .get(['manualBillDate'])
            .updateValueAndValidity();
        }
      }
    }

    if (changes['documentTypes']) {
      this.documentTypesOptions = [];
      this.documentTypes.forEach(element => {
        this.documentTypesOptions.push({
          value: element.transactionType,
          description: element.transactionType + ' - ' + element.description
        });
      });
    }
  }

  createForm() {
    return new FormGroup({
      locationCode: new FormControl(null, [
        this.fieldValidatorsService.requiredField(this.locationCodeLabel)
      ]),
      metalRates: new FormGroup({
        gold: new FormGroup({
          isSelected: new FormControl(false),
          materialTypeCode: new FormControl(null),
          totalMetalWeight: new FormControl({ value: '', disabled: true }, [
            this.fieldValidatorsService.requiredField(this.goldWeightLabel),
            this.fieldValidatorsService.min(0.001, this.goldWeightLabel)
          ]),
          ratePerUnit: new FormControl({ value: '', disabled: true }, [
            this.fieldValidatorsService.requiredField(this.goldRateLabel)
          ])
        }),
        platinum: new FormGroup({
          isSelected: new FormControl(false),
          materialTypeCode: new FormControl(null),
          totalMetalWeight: new FormControl({ value: '', disabled: true }, [
            this.fieldValidatorsService.requiredField(this.platinumWeightLabel),
            this.fieldValidatorsService.min(0.001, this.platinumWeightLabel)
          ]),
          ratePerUnit: new FormControl({ value: '', disabled: true }, [
            this.fieldValidatorsService.requiredField(this.platinumRateLabel)
          ])
        }),
        silver: new FormGroup({
          isSelected: new FormControl(false),
          materialTypeCode: new FormControl(null),
          totalMetalWeight: new FormControl({ value: '', disabled: true }, [
            this.fieldValidatorsService.requiredField(this.silverWeightLabel),
            this.fieldValidatorsService.min(0.001, this.silverWeightLabel)
          ]),
          ratePerUnit: new FormControl({ value: '', disabled: true }, [
            this.fieldValidatorsService.requiredField(this.silverRateLabel)
          ])
        })
      }),
      manualBillDate: new FormControl(moment().format(), [
        this.fieldValidatorsService.requiredField(this.billDateLabel)
      ]),
      remarks: new FormControl(null, [
        this.fieldValidatorsService.requiredField(this.remarksLabel),
        this.fieldValidatorsService.remarkField(this.remarksLabel)
      ]),
      manualBillNo: new FormControl(
        {
          value: null,
          disabled:
            this.contextType === ContextTypeEnum.GOLD_RATE ? true : false
        },
        [
          this.fieldValidatorsService.requiredField(this.billNumberLabel),
          this.fieldValidatorsService.maxLength(20, this.billNumberLabel),
          this.fieldValidatorsService.alphaNumericField(this.billNumberLabel)
        ]
      ),
      manualBillValue: new FormControl(
        {
          value: null,
          disabled:
            this.contextType === ContextTypeEnum.GOLD_RATE ? true : false
        },
        [
          // this.fieldValidatorsService.requiredField(this.billValueLabel),
          this.fieldValidatorsService.min(1, this.billValueLabel)
        ]
      ),
      txnType: new FormControl(
        {
          value: null,
          disabled:
            this.contextType === ContextTypeEnum.GOLD_RATE ? true : false
        },
        [this.fieldValidatorsService.requiredField(this.documentTypeLabel)]
      ),
      password: new FormControl(null),
      approvedBy: new FormControl(
        {
          value: null,
          disabled:
            this.contextType === ContextTypeEnum.GOLD_RATE ? true : false
        },
        [
          this.fieldValidatorsService.requiredField(this.approvedByLabel),
          this.fieldValidatorsService.employeeNameField(this.approvedByLabel)
        ]
      ),
      isBimetal: new FormControl(
        {
          value: false,
          disabled:
            this.contextType === ContextTypeEnum.MANUAL_BILL ? true : false
        }
      )
    });
  }

  generatePassword() {
    this.isGeneratePassword = true;
    if (this.contextType === ContextTypeEnum.MANUAL_BILL) {
      const generateBoutiquePasswordRequest = {
        locationCode: this.generateBoutiquePasswordForm.value.locationCode.split(
          ' ',
          1
        )[0],
        metalRates: {
          J:
            this.generateBoutiquePasswordForm.value.metalRates.gold
              .materialTypeCode !== null
              ? {
                  metalTypeCode: MetalTypeEnum.GOLD,
                  totalMetalWeight: +this.generateBoutiquePasswordForm.value
                    .metalRates.gold.totalMetalWeight,
                  ratePerUnit: this.currencyRoundOff(
                    this.generateBoutiquePasswordForm.value.metalRates.gold
                      .ratePerUnit
                  )
                }
              : undefined,
          L:
            this.generateBoutiquePasswordForm.value.metalRates.platinum
              .materialTypeCode !== null
              ? {
                  metalTypeCode: MetalTypeEnum.PLATINUM,
                  totalMetalWeight: +this.generateBoutiquePasswordForm.value
                    .metalRates.platinum.totalMetalWeight,
                  ratePerUnit: this.currencyRoundOff(
                    this.generateBoutiquePasswordForm.value.metalRates.platinum
                      .ratePerUnit
                  )
                }
              : undefined,
          P:
            this.generateBoutiquePasswordForm.value.metalRates.silver
              .materialTypeCode !== null
              ? {
                  metalTypeCode: MetalTypeEnum.SILVER,
                  totalMetalWeight: +this.generateBoutiquePasswordForm.value
                    .metalRates.silver.totalMetalWeight,
                  ratePerUnit: this.currencyRoundOff(
                    this.generateBoutiquePasswordForm.value.metalRates.silver
                      .ratePerUnit
                  )
                }
              : undefined
        },
        manualBillDate: moment(
          this.generateBoutiquePasswordForm.value.manualBillDate
        ).valueOf(),
        remarks: this.generateBoutiquePasswordForm.value.remarks,
        manualBillNo: this.generateBoutiquePasswordForm.value.manualBillNo,
        manualBillValue: this.generateBoutiquePasswordForm.value
          .manualBillValue,
        txnType: this.generateBoutiquePasswordForm.value.txnType,
        approvedBy: this.generateBoutiquePasswordForm.value.approvedBy,
        isBimetal: 
          this.generateBoutiquePasswordForm.value?.isBimetal 
            ? this.generateBoutiquePasswordForm.value?.isBimetal 
            : false
      };
      this.generateBoutiquePasswordForManualBill.emit(
        generateBoutiquePasswordRequest
      );
    } else if (this.contextType === ContextTypeEnum.GOLD_RATE) {
      const generateBoutiquePasswordRequest = {
        locationCode: this.generateBoutiquePasswordForm.value.locationCode.split(
          ' ',
          1
        )[0],
        metalRates: {
          J:
            this.generateBoutiquePasswordForm.value.metalRates.gold
              .materialTypeCode !== null
              ? {
                  metalTypeCode: MetalTypeEnum.GOLD,
                  ratePerUnit: this.currencyRoundOff(
                    this.generateBoutiquePasswordForm.value.metalRates.gold
                      .ratePerUnit
                  )
                }
              : undefined,
          L:
            this.generateBoutiquePasswordForm.value.metalRates.platinum
              .materialTypeCode !== null
              ? {
                  metalTypeCode: MetalTypeEnum.PLATINUM,
                  ratePerUnit: this.currencyRoundOff(
                    this.generateBoutiquePasswordForm.value.metalRates.platinum
                      .ratePerUnit
                  )
                }
              : undefined,
          P:
            this.generateBoutiquePasswordForm.value.metalRates.silver
              .materialTypeCode !== null
              ? {
                  metalTypeCode: MetalTypeEnum.SILVER,
                  ratePerUnit: this.currencyRoundOff(
                    this.generateBoutiquePasswordForm.value.metalRates.silver
                      .ratePerUnit
                  )
                }
              : undefined
        },
        applicableDate: moment(
          this.generateBoutiquePasswordForm.value.manualBillDate
        ).valueOf(),
        remarks: this.generateBoutiquePasswordForm.value.remarks
      };

      this.generateBoutiquePasswordForGoldRate.emit(
        generateBoutiquePasswordRequest
      );
    }
  }

  checkBoxSelected(materialType: string, event: MatCheckboxChange) {
    if (event.checked) {
      this.overlayNotification.close();
      if (this.contextType === ContextTypeEnum.MANUAL_BILL) {
        this.generateBoutiquePasswordForm
          .get(['metalRates', materialType, 'totalMetalWeight'])
          .enable();
      } else {
        this.generateBoutiquePasswordForm
          .get(['metalRates', materialType, 'totalMetalWeight'])
          .disable();
      }
      this.generateBoutiquePasswordForm
        .get(['metalRates', materialType, 'ratePerUnit'])
        .enable();
      this.generateBoutiquePasswordForm
        .get(['metalRates', materialType, 'materialTypeCode'])
        .patchValue(materialType);
      this.getRate();
    } else {
      this.generateBoutiquePasswordForm
        .get(['metalRates', materialType, 'totalMetalWeight'])
        .disable();
      this.generateBoutiquePasswordForm
        .get(['metalRates', materialType, 'ratePerUnit'])
        .disable();
      this.generateBoutiquePasswordForm
        .get(['metalRates', materialType, 'materialTypeCode'])
        .patchValue(null);
      this.generateBoutiquePasswordForm
        .get(['metalRates', materialType, 'ratePerUnit'])
        .patchValue(null);
      this.generateBoutiquePasswordForm
        .get(['metalRates', materialType, 'totalMetalWeight'])
        .patchValue(null);
    }
  }

  getRate() {
    if (this.generateBoutiquePasswordForm.value.locationCode === null) {
      const locationMsgkey = 'pw.passwordConfig.locationCodeRequiredMsg';
      this.showErrorMessage(locationMsgkey);
    } else if (
      this.generateBoutiquePasswordForm.value.metalRates.gold
        .materialTypeCode === null &&
      this.generateBoutiquePasswordForm.value.metalRates.platinum
        .materialTypeCode === null &&
      this.generateBoutiquePasswordForm.value.metalRates.silver
        .materialTypeCode === null
    ) {
      const metalPriceMsgKey = 'pw.passwordConfig.metalRatesRequiredMsg';
      this.showErrorMessage(metalPriceMsgKey);
    } else if (
      this.generateBoutiquePasswordForm.value.manualBillDate === null
    ) {
      if (this.contextType === ContextTypeEnum.GOLD_RATE) {
        const businessDateMsgKey = 'pw.passwordConfig.businessDateRequiredMsg';
        this.showErrorMessage(businessDateMsgKey);
      } else {
        const billDateMsgKey = 'pw.passwordConfig.billDateRequiredMsg';
        this.showErrorMessage(billDateMsgKey);
      }
    } else {
      this.getMaterialRate.emit({
        applicableDate: moment(
          this.generateBoutiquePasswordForm.value.manualBillDate
        ).valueOf(),
        locationCode: this.generateBoutiquePasswordForm.value.locationCode.split(
          ' ',
          1
        )[0]
      });
    }
  }

  getPassword() {
    return this.generateBoutiquePasswordForm.get('password').value;
  }

  onSubmit() {
    if (this.generateBoutiquePasswordForm.valid) {
      // save data
      if (
        this.generateBoutiquePasswordForm.value.metalRates.gold
          .materialTypeCode === null &&
        this.generateBoutiquePasswordForm.value.metalRates.platinum
          .materialTypeCode === null &&
        this.generateBoutiquePasswordForm.value.metalRates.silver
          .materialTypeCode === null
      ) {
        const selectMetalRatesMsg = 'pw.passwordConfig.selectMetalRatesMsg';
        this.showErrorMessage(selectMetalRatesMsg);
      } else {
        this.openConfirmDialogForSave();
      }
    } else {
      this.validateAllFields(this.generateBoutiquePasswordForm);
    }
  }

  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  reset(generateBoutiquePasswordFormDirective: FormGroupDirective) {
    if (this.contextType === ContextTypeEnum.MANUAL_BILL) {
      this.enableSubFields();
    }
    this.enableMainFields();
    generateBoutiquePasswordFormDirective.resetForm();
    this.resetMetalRates();
    this.disableMetalRateFields();
  }

  showErrorMessage(message: string) {
    const key = message;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true, // optional,
            message: translatedMessage
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }

  showPassword() {
    this.show = !this.show;
  }

  openConfirmDialogForSave() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.passwordConfig.dataNotEnteredMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.generatePassword();
        }
      });
  }

  openLocationSelectionPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.generateBoutiquePasswordForm
            .get(['locationCode'])
            .patchValue(selectedOption.description);
        }
      });
  }

  disableMetalRateFields() {
    if (this.contextType === ContextTypeEnum.MANUAL_BILL) {
      this.generateBoutiquePasswordForm
        .get(['metalRates', 'gold', 'totalMetalWeight'])
        .disable();
      this.generateBoutiquePasswordForm
        .get(['metalRates', 'platinum', 'totalMetalWeight'])
        .disable();
      this.generateBoutiquePasswordForm
        .get(['metalRates', 'silver', 'totalMetalWeight'])
        .disable();
    }
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'ratePerUnit'])
      .disable();

    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'ratePerUnit'])
      .disable();

    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'ratePerUnit'])
      .disable();
  }

  resetMetalRates() {
    this.overlayNotification.close();
    this.goldRates = [];
    this.platinumRates = [];
    this.silverRates = [];
    this.generateBoutiquePasswordForm.get(['metalRates']).reset();
    this.generateBoutiquePasswordForm.get(['metalRates']).setErrors(null);
    this.generateBoutiquePasswordForm
      .get(['metalRates'])
      .updateValueAndValidity();
  }

  resetMetalField() {
    this.overlayNotification.close();
    this.goldRates = [];
    this.platinumRates = [];
    this.silverRates = [];
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'isSelected'])
      .reset();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'isSelected'])
      .reset();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'isSelected'])
      .reset();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'ratePerUnit'])
      .reset();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'ratePerUnit'])
      .reset();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'ratePerUnit'])
      .reset();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'ratePerUnit'])
      .setErrors(null);
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'ratePerUnit'])
      .setErrors(null);
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'ratePerUnit'])
      .setErrors(null);
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'ratePerUnit'])
      .updateValueAndValidity();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'ratePerUnit'])
      .updateValueAndValidity();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'ratePerUnit'])
      .updateValueAndValidity();
  }

  currencyRoundOff(amount) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  txnTypeChange() {
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'totalMetalWeight'])
      .reset();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'totalMetalWeight'])
      .reset();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'totalMetalWeight'])
      .reset();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'totalMetalWeight'])
      .setErrors(null);
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'totalMetalWeight'])
      .setErrors(null);
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'totalMetalWeight'])
      .setErrors(null);
    this.generateBoutiquePasswordForm.get('password').reset();
    this.generateBoutiquePasswordForm.get('manualBillNo').reset();
    this.generateBoutiquePasswordForm.get('manualBillValue').reset();
    this.generateBoutiquePasswordForm.get('password').setErrors(null);
    this.generateBoutiquePasswordForm.get('manualBillNo').setErrors(null);
    this.generateBoutiquePasswordForm.get('manualBillValue').setErrors(null);
    this.generateBoutiquePasswordForm.get('password').updateValueAndValidity();
    this.generateBoutiquePasswordForm
      .get('manualBillNo')
      .updateValueAndValidity();
    this.generateBoutiquePasswordForm
      .get('manualBillValue')
      .updateValueAndValidity();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'totalMetalWeight'])
      .clearValidators();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'totalMetalWeight'])
      .clearValidators();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'totalMetalWeight'])
      .clearValidators();
    if (this.generateBoutiquePasswordForm.get('txnType').value === TxnTypeEnum.GRF) {
      this.generateBoutiquePasswordForm
        .get(['metalRates', 'gold', 'totalMetalWeight'])
        .setValidators([
          this.fieldValidatorsService.min(0.001, this.goldWeightLabel)
        ]);
      this.generateBoutiquePasswordForm
        .get(['metalRates', 'platinum', 'totalMetalWeight'])
        .setValidators([
          this.fieldValidatorsService.min(0.001, this.platinumWeightLabel)
        ]);
      this.generateBoutiquePasswordForm
        .get(['metalRates', 'silver', 'totalMetalWeight'])
        .setValidators([
          this.fieldValidatorsService.min(0.001, this.silverWeightLabel)
        ]);
    } else {
      this.generateBoutiquePasswordForm
        .get(['metalRates', 'gold', 'totalMetalWeight'])
        .setValidators([
          this.fieldValidatorsService.requiredField(this.goldWeightLabel),
          this.fieldValidatorsService.min(0.001, this.goldWeightLabel)
        ]);
      this.generateBoutiquePasswordForm
        .get(['metalRates', 'platinum', 'totalMetalWeight'])
        .setValidators([
          this.fieldValidatorsService.requiredField(this.platinumWeightLabel),
          this.fieldValidatorsService.min(0.001, this.platinumWeightLabel)
        ]);
      this.generateBoutiquePasswordForm
        .get(['metalRates', 'silver', 'totalMetalWeight'])
        .setValidators([
          this.fieldValidatorsService.requiredField(this.silverWeightLabel),
          this.fieldValidatorsService.min(0.001, this.silverWeightLabel)
        ]);
    }
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'totalMetalWeight'])
      .updateValueAndValidity();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'totalMetalWeight'])
      .updateValueAndValidity();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'totalMetalWeight'])
      .updateValueAndValidity();
    let txnType = this.generateBoutiquePasswordForm.get('txnType').value;
    if(
      txnType === 'GEP' ||
      txnType === 'GRF' ||
      txnType === 'TCS Payment' 
    ){
      this.generateBoutiquePasswordForm.get('isBimetal').reset();
      this.generateBoutiquePasswordForm.get('isBimetal').disable();
      const bimetalNotAllowedMsgKey = 'pw.passwordConfig.bimetalNotAllowedMsg';
      this.showErrorMessage(bimetalNotAllowedMsgKey);
    } else{
      this.generateBoutiquePasswordForm.get('isBimetal').enable();
    }
  }

  disableForm() {
    this.disableMetalRateFields();
    this.generateBoutiquePasswordForm.get('txnType').disable();
    this.generateBoutiquePasswordForm.get('manualBillNo').disable();
    this.generateBoutiquePasswordForm.get('manualBillValue').disable();
    this.generateBoutiquePasswordForm.get('approvedBy').disable();
    this.generateBoutiquePasswordForm.get('remarks').disable();
    this.generateBoutiquePasswordForm.get('isBimetal').disable();
    this.generateBoutiquePasswordForm
      .get('locationCode')
      .disable({ emitEvent: false });
    this.generateBoutiquePasswordForm
      .get('manualBillDate')
      .disable({ emitEvent: false });
    this.disableGeneratePassword = true;
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'isSelected'])
      .disable();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'isSelected'])
      .disable();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'isSelected'])
      .disable();
  }

  enableMainFields() {
    this.enableMetalRateFields();
    this.generateBoutiquePasswordForm.get('remarks').enable();
    this.generateBoutiquePasswordForm
      .get('locationCode')
      .enable({ emitEvent: false });
    this.generateBoutiquePasswordForm
      .get('manualBillDate')
      .enable({ emitEvent: false });
    this.disableGeneratePassword = false;
  }

  enableSubFields() {
    this.generateBoutiquePasswordForm.get('txnType').enable();
    this.generateBoutiquePasswordForm.get('manualBillNo').enable();
    this.generateBoutiquePasswordForm.get('manualBillValue').enable();
    this.generateBoutiquePasswordForm.get('approvedBy').enable();
    this.generateBoutiquePasswordForm.get('isBimetal').enable();
  }

  enableMetalRateFields() {
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'gold', 'isSelected'])
      .enable();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'silver', 'isSelected'])
      .enable();
    this.generateBoutiquePasswordForm
      .get(['metalRates', 'platinum', 'isSelected'])
      .enable();
  }

  ngOnDestroy(): void {
    this.reset(this.formGroupDirective);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
