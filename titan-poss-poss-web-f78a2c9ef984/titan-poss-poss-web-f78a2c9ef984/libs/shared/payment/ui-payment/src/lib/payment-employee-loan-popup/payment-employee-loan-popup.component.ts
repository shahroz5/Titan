import {
  Component,
  Inject,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { EmployeeLoanConfigList, EmployeeLoanPayment, LoadEmployeeDetailsPayload, OTPTypeEnum, OverlayNotificationServiceAbstraction, OverlayNotificationType, PaymentDetails, PaymentGroupEnum, PaymentModeEnum } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-employee-loan-popup',
  templateUrl: './payment-employee-loan-popup.component.html',
  styleUrls: [],
})
export class PaymentEmployeeLoanPopupComponent implements OnInit  {

  @Output() loadEmpLoanDetails = new EventEmitter<LoadEmployeeDetailsPayload>();
  @Output() addPayment = new EventEmitter<any>();
  @Output() invokeOTP = new EventEmitter();
  employeeCode: FormControl;
  paymentCollected: FormControl;
  OTPFiledFormControl: FormControl;

  destroy$ = new Subject();
  empLoanDetails: EmployeeLoanConfigList;
  isOtpGeneratedForEmpLoan = false;
  paymentCollectedLabel: string;
  otpLabel: string;
  selectCustomerAlertMessage: string;

  constructor(
    public dialogRef: MatDialogRef<PaymentEmployeeLoanPopupComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    private currencyFormatterService: CurrencyFormatterService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translationService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: {
      empLoanDetails$: Observable<EmployeeLoanConfigList>,
      isOtpGeneratedForEmpLoan$: Observable<any>;
      paymentDetails$: Observable<PaymentDetails[]>;
      businessDate: string,
      currencyCode: string,
      paymentGroup: PaymentGroupEnum,
      paymentMode: PaymentModeEnum,
      transactionTotalAmount: number,
      customerID: string,
    }
  ) {
    this.translationService
      .get([
        'pw.employeeLoanConfiguration.paymentCollectedLabel',
        'pw.employeeLoanConfiguration.otpLabel',
        'pw.employeeLoanConfiguration.selectCustomerAlert',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.paymentCollectedLabel = translatedMsg['pw.employeeLoanConfiguration.paymentCollectedLabel'];
        this.otpLabel = translatedMsg['pw.employeeLoanConfiguration.otpLabel'];
        this.selectCustomerAlertMessage = translatedMsg['pw.employeeLoanConfiguration.selectCustomerAlert'];
      });
  }

  ngOnInit(): void {
    this.employeeCode = new FormControl();
    this.paymentCollected = new FormControl();

    this.OTPFiledFormControl = new FormControl('', [
      this.fieldValidatorsService.requiredField(this.otpLabel),
      this.fieldValidatorsService.numbersField(this.otpLabel)
    ]);
    this.data.empLoanDetails$.pipe(takeUntil(this.destroy$))
    .subscribe(x => {
      if (x && this.employeeCode.value) {
        this.empLoanDetails = x;
        const paymentAmount = (this.data.transactionTotalAmount - (this.data.transactionTotalAmount * this.empLoanDetails.marginPercentage)/100);
        this.paymentCollected.setValidators(this.createAmountValidators(this.currencyRoundOff(paymentAmount)));
        this.paymentCollected.setValue(this.currencyRoundOff(paymentAmount));
      }
    })
    this.paymentCollected.valueChanges.pipe(takeUntil(this.destroy$))
    .subscribe(x => {
      if (this.isOtpGeneratedForEmpLoan) {
        this.OTPFiledFormControl.enable();
      } else {
        this.OTPFiledFormControl.disable();
      }
    })
    this.data.isOtpGeneratedForEmpLoan$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOptGenerated => {
        this.isOtpGeneratedForEmpLoan = isOptGenerated;
        if (this.isOtpGeneratedForEmpLoan) {
          this.OTPFiledFormControl.enable();
        } else {
          this.OTPFiledFormControl.disable();
        }
      });
    this.data.paymentDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentDetails => {
        if (paymentDetails.length > 0) {
          if (paymentDetails.some(x => x.paymentCode === PaymentModeEnum.EMPLOYEE_LOAN)) {
            this.close();
          }
        }
      })
  }
  getEmpLoanDetails() {
    if (this.data.customerID) {
      this.OTPFiledFormControl.setValue(null);
      const empDetailsPayload: LoadEmployeeDetailsPayload = {
        empId: this.employeeCode.value,
        customerId: this.data.customerID
      };
      this.loadEmpLoanDetails.emit(empDetailsPayload);
    } else {
      this.showAlertNotification(this.selectCustomerAlertMessage);
    }
  }

  addLoanPayment() {
    const empLoanPayment = {
      reference1: this.OTPFiledFormControl.value,
      reference2: this.empLoanDetails.empCode,
      reference3: true,
      amount: this.paymentCollected.value,
      instrumentNo: this.data.customerID,
      instrumentType: this.data.paymentMode,
      instrumentDate: this.data.businessDate,
    };

    this.addPayment.emit(new EmployeeLoanPayment(this.data.paymentGroup, empLoanPayment));
  }

  generateOTP() {
    this.invokeOTP.emit({ id: this.empLoanDetails.customerId, type: OTPTypeEnum.EMPLOYEE_LOAN });
  }

  createAmountValidators(MaxAmount: number) {
    return [
      this.fieldValidatorsService.requiredField(this.paymentCollectedLabel),
      this.fieldValidatorsService.minAmount(
        1,
        this.paymentCollectedLabel,
        this.data.currencyCode
      ),
      this.fieldValidatorsService.maxAmount(
        MaxAmount,
        this.paymentCollectedLabel,
        this.data.currencyCode
      )
    ];

  }

  showAlertNotification(message: string): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        hasBackdrop: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  currencyRoundOff(amount) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.data.currencyCode,
      false,
      true
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  close() {
    this.dialogRef.close(null);
  }
}
