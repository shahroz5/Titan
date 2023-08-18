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
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  MetalTypeEnum,
  ManualBillRequest,
  ValidationTypesEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';

const dateFormat = 'YYYYMMDD';

@Component({
  selector: 'poss-web-manual-approval-form',
  templateUrl: './manual-approval-form.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualApprovalFormComponent implements OnInit, OnDestroy {
  requestApprovalForm: FormGroup = new FormGroup({});
  currentDate: any;
  billNumberLabel: string;
  billValueLabel: string;
  billDateLabel: string;
  goldRateLabel: string;
  platinumRateLabel: string;
  silverRateLabel: string;
  reasonLabel: string;
  passwordLabel: string;
  approvedByLabel: string;
  abcoDateLabel: string;
  enableABCODatePicker: boolean;
  weightCode = 'gm';
  @Output() validateBill = new EventEmitter<ManualBillRequest>();
  @Input() customerId: string;
  @Input() currencyCode: string;
  @Input() txnType: string;
  destroy$: Subject<null> = new Subject<null>();
  TxnTypesEnumRef = TransactionTypeEnum;
  @Input() bussinessDay: number;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public dialog: MatDialog,
    private currencyFormatterService: CurrencyFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.manualCashMemo.billNumberLabel',
        'pw.manualCashMemo.billValueLabel',
        'pw.manualCashMemo.billDateLabel',
        'pw.manualCashMemo.goldRateLabel',
        'pw.manualCashMemo.platinumRateLabel',
        'pw.manualCashMemo.silverRateLabel',
        'pw.manualCashMemo.reasonLabel',
        'pw.manualCashMemo.approvedByLabel',
        'pw.manualCashMemo.abcoDateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.billValueLabel = translatedMsg['pw.manualCashMemo.billValueLabel'];
        this.billNumberLabel =
          translatedMsg['pw.manualCashMemo.billNumberLabel'];
        this.goldRateLabel = translatedMsg['pw.manualCashMemo.goldRateLabel'];
        this.platinumRateLabel =
          translatedMsg['pw.manualCashMemo.platinumRateLabel'];
        this.silverRateLabel =
          translatedMsg['pw.manualCashMemo.silverRateLabel'];
        this.reasonLabel = translatedMsg['pw.manualCashMemo.reasonLabel'];
        this.approvedByLabel =
          translatedMsg['pw.manualCashMemo.approvedByLabel'];
        this.abcoDateLabel = translatedMsg['pw.manualCashMemo.abcoDateLabel'];
      });
  }

  ngOnInit() {
    this.currentDate = this.bussinessDay ? moment(this.bussinessDay) : null;
    this.requestApprovalForm = this.createForm();
    this.requestApprovalForm
      .get(['manualBillDate'])
      .valueChanges.subscribe(val => {
        if (val) {
          this.overlayNotification.close();
          this.requestApprovalForm.get(['goldRate']).patchValue(null);
          this.requestApprovalForm.get(['platinumRate']).patchValue(null);
          this.requestApprovalForm.get(['silverRate']).patchValue(null);
          this.requestApprovalForm.get(['ABCODate']).patchValue(null);
        }
      });
  }

  createForm() {
    return new FormGroup({
      validationType: new FormControl(ValidationTypesEnum.REQUEST_APPROVAL),
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
      goldRate: new FormControl(
        null,
        this.fieldValidatorsService.minAmount(
          1,
          this.goldRateLabel,
          this.currencyCode
        )
      ),
      silverRate: new FormControl(
        null,
        this.fieldValidatorsService.minAmount(
          1,
          this.silverRateLabel,
          this.currencyCode
        )
      ),
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
      ABCODate: new FormControl(null, [
        this.fieldValidatorsService.max(
          this.requestApprovalForm.value.manualBillDate,
          this.abcoDateLabel
        )
      ])
    });
  }

  onSubmit() {
    if (this.requestApprovalForm.valid) {
      // save data
      if (
        (this.requestApprovalForm.value.goldRate === null ||
          this.requestApprovalForm.value.goldRate?.length <= 0) &&
        (this.requestApprovalForm.value.silverRate === null ||
          this.requestApprovalForm.value.silverRate?.length <= 0) &&
        (this.requestApprovalForm.value.platinumRate === null ||
          this.requestApprovalForm.value.platinumRate?.length <= 0)
      ) {
        const selectMetalRatesMsg = 'pw.passwordConfig.selectMetalRatesMsg';
        this.showErrorMessage(selectMetalRatesMsg);
      } else {
        if (this.customerId === null) {
          this.openCustomerNotSelectedDialog();
        } else {
          this.openConfirmDialogForSave();
        }
      }
    } else {
      this.validateAllFields(this.requestApprovalForm);
    }
  }

  validateManualBill() {
    let gold = {};
    let platinum = {};
    let silver = {};

    if (this.requestApprovalForm.value.goldRate?.length > 0) {
      gold = {
        metalTypeCode: MetalTypeEnum.GOLD,
        ratePerUnit: this.currencyRoundOff(
          this.requestApprovalForm.value.goldRate
        ),
        totalMetalWeight: 0
      };
    }
    if (this.requestApprovalForm.value.platinumRate?.length > 0) {
      platinum = {
        metalTypeCode: MetalTypeEnum.PLATINUM,
        ratePerUnit: this.currencyRoundOff(
          this.requestApprovalForm.value.platinumRate
        ),
        totalMetalWeight: 0
      };
    }
    if (this.requestApprovalForm.value.silverRate?.length > 0) {
      silver = {
        metalTypeCode: MetalTypeEnum.SILVER,
        ratePerUnit: this.currencyRoundOff(
          this.requestApprovalForm.value.silverRate
        ),
        totalMetalWeight: 0
      };
    }

    const manualBillRequest: any = {
      manualBillDetails: {
        approvedBy: this.requestApprovalForm.value.approvedBy,
        manualBillDate: moment(
          this.requestApprovalForm.value.manualBillDate
        ).valueOf(),
        manualBillNo: this.requestApprovalForm.value.manualBillNo,
        manualBillValue: this.requestApprovalForm.value.manualBillValue,
        metalRates: {
          J: this.requestApprovalForm.value.goldRate ? gold : undefined,
          L: this.requestApprovalForm.value.platinumRate ? platinum : undefined,
          P: this.requestApprovalForm.value.silverRate ? silver : undefined
        },
        remarks: this.requestApprovalForm.value.remarks,
        frozenRateDate: this.enableABCODatePicker
          ? moment(this.requestApprovalForm.value.ABCODate).valueOf()
          : null,
        isFrozenRate: this.enableABCODatePicker
      },
      validationType: this.requestApprovalForm.value.validationType
    };
    this.validateBill.emit(manualBillRequest);
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

  selectCheckBox(checkBoxEvent: boolean) {
    this.enableABCODatePicker = checkBoxEvent;
    if (this.enableABCODatePicker) {
      this.requestApprovalForm
        .get(['ABCODate'])
        .setValidators([
          this.fieldValidatorsService.requiredField(this.abcoDateLabel)
        ]);
      this.requestApprovalForm.get(['ABCODate']).updateValueAndValidity();
    } else {
      this.requestApprovalForm.get(['ABCODate']).clearValidators();
      this.requestApprovalForm.get(['ABCODate']).updateValueAndValidity();
    }
  }

  reset(requestApprovalFormDirective: FormGroupDirective) {
    requestApprovalFormDirective.resetForm();
    this.requestApprovalForm
      .get(['validationType'])
      .patchValue(ValidationTypesEnum.REQUEST_APPROVAL);
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
    return moment(date);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
