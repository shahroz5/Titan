import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil, take, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  MetalTypeEnum,
  ManualBillRequest,
  ValidationTypesEnum,
  OverlayNotificationEventType,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  TransactionTypeEnum,
  TxnTypeEnum
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

const dateFormat = 'YYYYMMDD';

@Component({
  selector: 'poss-web-manual-validate-form',
  templateUrl: './manual-validate-form.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualValidateFormComponent implements OnInit, OnDestroy {
  validatePasswordForm: FormGroup = new FormGroup({});
  billNumberLabel: string;
  billValueLabel: string;
  billDateLabel: string;
  goldWeightLabel: string;
  goldRateLabel: string;
  platinumWeightLabel: string;
  platinumRateLabel: string;
  silverWeightLabel: string;
  silverRateLabel: string;
  reasonLabel: string;
  passwordLabel: string;
  approvedByLabel: string;
  show = false;
  @Output() validateBill = new EventEmitter<ManualBillRequest>();
  @Input() customerId: string;
  @Input() currencyCode: string;
  @Input() bussinessDay: number;
  destroy$: Subject<null> = new Subject<null>();
  weightCode = 'gm';
  weightCodes = 'gms';
  formDataArray = [];
  gold = {};
  platinum = {};
  silver = {};
  error = false;
  currentDate: any;
  @Input() txnType: string;
  @Input() permit = '';

  TxnTypesEnumRef = TransactionTypeEnum;

  permissions$: Observable<any[]>;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public dialog: MatDialog,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    private currencyFormatterService: CurrencyFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.manualCashMemo.billNumberLabel',
        'pw.manualCashMemo.billValueLabel',
        'pw.manualCashMemo.billDateLabel',
        'pw.manualCashMemo.goldWeightLabel',
        'pw.manualCashMemo.goldRateLabel',
        'pw.manualCashMemo.platinumWeightLabel',
        'pw.manualCashMemo.platinumRateLabel',
        'pw.manualCashMemo.silverWeightLabel',
        'pw.manualCashMemo.silverRateLabel',
        'pw.manualCashMemo.reasonLabel',
        'pw.manualCashMemo.passwordLabel',
        'pw.manualCashMemo.approvedByLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.billNumberLabel =
          translatedMsg['pw.manualCashMemo.billNumberLabel'];
        this.billValueLabel = translatedMsg['pw.manualCashMemo.billValueLabel'];
        this.billDateLabel = translatedMsg['pw.manualCashMemo.billDateLabel'];
        this.goldWeightLabel =
          translatedMsg['pw.manualCashMemo.goldWeightLabel'];
        this.goldRateLabel = translatedMsg['pw.manualCashMemo.goldRateLabel'];
        this.platinumWeightLabel =
          translatedMsg['pw.manualCashMemo.platinumWeightLabel'];
        this.platinumRateLabel =
          translatedMsg['pw.manualCashMemo.platinumRateLabel'];
        this.silverWeightLabel =
          translatedMsg['pw.manualCashMemo.silverWeightLabel'];
        this.silverRateLabel =
          translatedMsg['pw.manualCashMemo.silverRateLabel'];
        this.reasonLabel = translatedMsg['pw.manualCashMemo.reasonLabel'];
        this.passwordLabel = translatedMsg['pw.manualCashMemo.passwordLabel'];
        this.approvedByLabel =
          translatedMsg['pw.manualCashMemo.approvedByLabel'];
      });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.currentDate = this.bussinessDay ? moment(this.bussinessDay) : null;
    this.validatePasswordForm = this.createForm();
    this.validatePasswordForm
      .get(['manualBillDate'])
      .valueChanges.subscribe(val => {
        if (val) {
          this.overlayNotification.close();
          this.validatePasswordForm.get(['goldRate']).patchValue(null);
          this.validatePasswordForm.get(['platinumRate']).patchValue(null);
          this.validatePasswordForm.get(['silverRate']).patchValue(null);
        }
      });

    // this.validateWeightAndRate();
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  createForm() {
    return new FormGroup({
      validationType: new FormControl(ValidationTypesEnum.PASSWORD_VALIDATION),
      manualBillNo: new FormControl(null, [
        this.fieldValidatorsService.requiredField(this.billNumberLabel),
        this.fieldValidatorsService.maxLength(20, this.billNumberLabel),
        this.fieldValidatorsService.alphaNumericField(this.billNumberLabel)
      ]),
      manualBillDate: new FormControl(moment(this.bussinessDay).format(), [
        this.fieldValidatorsService.requiredField(this.billDateLabel)
      ]),
      manualBillValue: new FormControl(null, [
        // this.fieldValidatorsService.requiredField(this.billValueLabel),
        this.fieldValidatorsService.min(1, this.billValueLabel)
      ]),
      goldWeight: new FormControl(null),
      goldRate: new FormControl(null, [
        this.fieldValidatorsService.minAmount(
          1,
          this.goldRateLabel,
          this.currencyCode
        )
      ]),
      silverWeight: new FormControl(null),
      silverRate: new FormControl(
        null,
        this.fieldValidatorsService.minAmount(
          1,
          this.silverRateLabel,
          this.currencyCode
        )
      ),
      platinumWeight: new FormControl(null),
      platinumRate: new FormControl(
        null,
        this.fieldValidatorsService.minAmount(
          1,
          this.platinumRateLabel,
          this.currencyCode
        )
      ),
      remarks: new FormControl(null, [
        this.fieldValidatorsService.requiredField(this.reasonLabel),
        this.fieldValidatorsService.remarkField(this.reasonLabel)
      ]),
      approvedBy: new FormControl(null, [
        this.fieldValidatorsService.requiredField(this.approvedByLabel),
        this.fieldValidatorsService.employeeNameField(this.approvedByLabel)
      ]),
      password: new FormControl(null, [
        this.fieldValidatorsService.requiredField(this.passwordLabel)
      ]),
      isBimetal: new FormControl({
        value: false,
        disabled:
          this.txnType === 'GEP' ||
          this.txnType === 'GRF' ||
          this.txnType === 'TCS Payment'
            ? true
            : false
      })
    });
  }

  onSubmit() {
    this.gold = null;
    this.platinum = null;
    this.silver = null;
    this.error = false;
    if (this.validatePasswordForm.valid) {
      this.formDataArray.push({});

      console.log(this.validatePasswordForm);
      // save data
      if (
        this.validatePasswordForm.value.goldWeight === null &&
        this.validatePasswordForm.value.silverWeight === null &&
        this.validatePasswordForm.value.platinumWeight === null &&
        (this.validatePasswordForm.value.goldRate === null ||
          this.validatePasswordForm.value.goldRate?.length <= 0) &&
        (this.validatePasswordForm.value.silverRate === null ||
          this.validatePasswordForm.value.silverRate?.length <= 0) &&
        (this.validatePasswordForm.value.platinumRate === null ||
          this.validatePasswordForm.value.platinumRate?.length <= 0)
      ) {
        const selectMetalRatesMsg = 'pw.passwordConfig.selectMetalRatesMsg';
        this.showErrorMessage(selectMetalRatesMsg);
      } else {
        if (
          this.validatePasswordForm.value.goldWeight ||
          this.validatePasswordForm.value.goldRate
        ) {
          if (
            this.validatePasswordForm.value.goldRate !== '0' &&
            this.validatePasswordForm.value.goldRate !== null &&
            this.validatePasswordForm.value.goldRate !== ''
          ) {
            if (this.txnType === TxnTypeEnum.GRF) {
              this.gold = {
                metalTypeCode: MetalTypeEnum.GOLD,
                ratePerUnit: this.currencyRoundOff(
                  this.validatePasswordForm.value.goldRate
                ),
                totalMetalWeight: +this.validatePasswordForm.value.goldWeight
              };
            } else {
              if (
                this.validatePasswordForm.value.goldWeight !== '0.000' &&
                this.validatePasswordForm.value.goldWeight !== null &&
                this.validatePasswordForm.value.goldWeight !== ''
              ) {
                this.gold = {
                  metalTypeCode: MetalTypeEnum.GOLD,
                  ratePerUnit: this.currencyRoundOff(
                    this.validatePasswordForm.value.goldRate
                  ),
                  totalMetalWeight: +this.validatePasswordForm.value.goldWeight
                };
              } else if (
                this.validatePasswordForm.value.goldWeight !== '0.000'
              ) {
                const selectMetalRatesMsg2 =
                  'pw.passwordConfig.selectMetalRatesMsg2';
                this.showErrorMessage(selectMetalRatesMsg2);
                return;
              }
            }
          } else if (this.validatePasswordForm.value.goldRate !== '0') {
            const selectMetalRatesMsg3 =
              'pw.passwordConfig.selectMetalRatesMsg3';
            this.showErrorMessage(selectMetalRatesMsg3);
            return;
          }
        }
        if (
          this.validatePasswordForm.value.platinumWeight ||
          this.validatePasswordForm.value.platinumRate
        ) {
          if (
            this.validatePasswordForm.value.platinumRate !== '0' &&
            this.validatePasswordForm.value.platinumRate !== null &&
            this.validatePasswordForm.value.platinumRate !== ''
          ) {
            if (this.txnType === TxnTypeEnum.GRF) {
              this.platinum = {
                metalTypeCode: MetalTypeEnum.PLATINUM,
                ratePerUnit: this.currencyRoundOff(
                  this.validatePasswordForm.value.platinumRate
                ),
                totalMetalWeight: +this.validatePasswordForm.value
                  .platinumWeight
              };
            } else {
              if (
                this.validatePasswordForm.value.platinumWeight !== '0.000' &&
                this.validatePasswordForm.value.platinumWeight !== null &&
                this.validatePasswordForm.value.platinumWeight !== ''
              ) {
                this.platinum = {
                  metalTypeCode: MetalTypeEnum.PLATINUM,
                  ratePerUnit: this.currencyRoundOff(
                    this.validatePasswordForm.value.platinumRate
                  ),
                  totalMetalWeight: +this.validatePasswordForm.value
                    .platinumWeight
                };
              } else if (
                this.validatePasswordForm.value.platinumWeight !== '0.000'
              ) {
                const selectMetalRatesMsg2 =
                  'pw.passwordConfig.selectMetalRatesMsg2';
                this.showErrorMessage(selectMetalRatesMsg2);
                return;
              }
            }
          } else if (this.validatePasswordForm.value.platinumRate !== '0') {
            const selectMetalRatesMsg3 =
              'pw.passwordConfig.selectMetalRatesMsg3';
            this.showErrorMessage(selectMetalRatesMsg3);
            return;
          }
        }
        if (
          this.validatePasswordForm.value.silverWeight ||
          this.validatePasswordForm.value.silverRate
        ) {
          if (
            this.validatePasswordForm.value.silverRate !== '0' &&
            this.validatePasswordForm.value.silverRate !== null &&
            this.validatePasswordForm.value.silverRate !== ''
          ) {
            if (this.txnType === TxnTypeEnum.GRF) {
              this.silver = {
                metalTypeCode: MetalTypeEnum.SILVER,
                ratePerUnit: this.currencyRoundOff(
                  this.validatePasswordForm.value.silverRate
                ),
                totalMetalWeight: +this.validatePasswordForm.value.silverWeight
              };
            } else {
              if (
                this.validatePasswordForm.value.silverWeight !== '0.000' &&
                this.validatePasswordForm.value.silverWeight !== null &&
                this.validatePasswordForm.value.silverWeight !== ''
              ) {
                this.silver = {
                  metalTypeCode: MetalTypeEnum.SILVER,
                  ratePerUnit: this.currencyRoundOff(
                    this.validatePasswordForm.value.silverRate
                  ),
                  totalMetalWeight: +this.validatePasswordForm.value
                    .silverWeight
                };
              } else if (
                this.validatePasswordForm.value.silverWeight !== '0.000'
              ) {
                const selectMetalRatesMsg2 =
                  'pw.passwordConfig.selectMetalRatesMsg2';
                this.showErrorMessage(selectMetalRatesMsg2);
                return;
              }
            }
          } else if (this.validatePasswordForm.value.silverRate !== '0') {
            const selectMetalRatesMsg3 =
              'pw.passwordConfig.selectMetalRatesMsg3';
            this.showErrorMessage(selectMetalRatesMsg3);
            return;
          }
        }

        if (
          (this.gold !== null ||
            this.silver !== null ||
            this.platinum !== null) &&
          this.error === false
        ) {
          this.openConfirmDialogForSave();
        } else {
          const selectMetalRatesMsg = 'pw.passwordConfig.selectMetalRatesMsg';
          this.showErrorMessage(selectMetalRatesMsg);
        }
      }
    } else {
      this.validateAllFields(this.validatePasswordForm);
    }
  }

  validateManualBill() {
    // if (this.customerId === null) {
    //   this.openCustomerNotSelectedDialog();
    // } else {
    const manualBillRequest: any = {
      manualBillDetails: {
        approvedBy: this.validatePasswordForm.value.approvedBy,
        manualBillDate: moment(
          this.validatePasswordForm.value.manualBillDate
        ).valueOf(),
        manualBillNo: this.validatePasswordForm.value.manualBillNo,
        manualBillValue: this.validatePasswordForm.value.manualBillValue,
        metalRates: {
          J: this.gold !== null ? this.gold : undefined,
          L: this.platinum !== null ? this.platinum : undefined,
          P: this.silver !== null ? this.silver : undefined
        },
        password: this.validatePasswordForm.value.password,
        remarks: this.validatePasswordForm.value.remarks,
        isBimetal: this.validatePasswordForm.value?.isBimetal
          ? this.validatePasswordForm.value?.isBimetal
          : false
      },
      validationType: this.validatePasswordForm.value.validationType
    };
    this.validateBill.emit(manualBillRequest);
    // }
  }

  showErrorMessage(message: string) {
    // this.overlayNotification.close();
    this.error = true;
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
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.error = false;
            }
          });
      });
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

  openConfirmDialogForSave() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.passwordConfig.dataNotEnteredMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.validateManualBill();
        }
      });
  }

  openCustomerNotSelectedDialog() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.manualCashMemo.selectCutomerMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  validateWeightAndRate() {
    this.validatePasswordForm
      .get(['goldWeight'])
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(val => {
        if (val) {
          this.validatePasswordForm
            .get(['goldRate'])
            .setValidators([
              this.fieldValidatorsService.requiredField(this.goldRateLabel)
            ]);
          this.validatePasswordForm.get(['goldRate']).updateValueAndValidity();
        }
      });
    this.validatePasswordForm
      .get(['goldRate'])
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(val => {
        if (val) {
          this.validatePasswordForm
            .get(['goldWeight'])
            .setValidators([
              this.fieldValidatorsService.requiredField(this.goldWeightLabel),
              this.fieldValidatorsService.min(0.001, this.goldWeightLabel)
            ]);
          this.validatePasswordForm
            .get(['goldWeight'])
            .updateValueAndValidity();
        }
      });
    this.validatePasswordForm
      .get(['platinumWeight'])
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(val => {
        if (val) {
          this.validatePasswordForm
            .get(['platinumRate'])
            .setValidators([
              this.fieldValidatorsService.requiredField(this.platinumRateLabel)
            ]);
          this.validatePasswordForm
            .get(['platinumRate'])
            .updateValueAndValidity();
        }
      });
    this.validatePasswordForm
      .get(['platinumRate'])
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(val => {
        if (val) {
          this.validatePasswordForm
            .get(['platinumWeight'])
            .setValidators([
              this.fieldValidatorsService.requiredField(
                this.platinumWeightLabel
              ),
              this.fieldValidatorsService.min(0.001, this.platinumWeightLabel)
            ]);
          this.validatePasswordForm
            .get(['platinumWeight'])
            .updateValueAndValidity();
        }
      });
    this.validatePasswordForm
      .get(['silverWeight'])
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(val => {
        if (val) {
          this.validatePasswordForm
            .get(['silverRate'])
            .setValidators([
              this.fieldValidatorsService.requiredField(this.silverRateLabel)
            ]);
          this.validatePasswordForm
            .get(['silverRate'])
            .updateValueAndValidity();
        }
      });
    this.validatePasswordForm
      .get(['silverRate'])
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(val => {
        if (val) {
          this.validatePasswordForm
            .get(['silverWeight'])
            .setValidators([
              this.fieldValidatorsService.requiredField(this.silverWeightLabel),
              this.fieldValidatorsService.min(0.001, this.silverWeightLabel)
            ]);
          this.validatePasswordForm
            .get(['silverWeight'])
            .updateValueAndValidity();
        }
      });
  }

  showPassword() {
    this.show = !this.show;
  }

  reset(validatePasswordFormDirective: FormGroupDirective) {
    validatePasswordFormDirective.resetForm();
    this.validatePasswordForm
      .get(['validationType'])
      .patchValue(ValidationTypesEnum.PASSWORD_VALIDATION);
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

  getMaxDate(date: number) {
    console.log('get max date');
    return moment(date);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
