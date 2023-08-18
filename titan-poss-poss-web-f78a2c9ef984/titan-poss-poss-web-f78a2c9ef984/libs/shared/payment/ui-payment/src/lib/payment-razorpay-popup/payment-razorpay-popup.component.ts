import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  PaymentDetails,
  PaymentGroupEnum,
  PaymentModeEnum,
  PaymentStatusEnum,
  RazorPayIntegratedPayment,
  RazorPayPayment,
  SelectDropDownOption,
  PaymentRequest,
  IntegratedPaymentRequestPayload,
  ROPaymentRequestStatus
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-razorpay-popup',
  templateUrl: './payment-razorpay-popup.component.html'
})
export class PaymentRazorpayPopupComponent implements OnDestroy {
  razorpayFormGroup: FormGroup;
  razorpayResponse = [];
  sendLinkButtonText = 'SEND LINK';
  hasResponse = false;
  openPayments: PaymentDetails[] = [];
  destroy$ = new Subject();
  transactionIdArray: SelectDropDownOption[] = [];

  sendLinkLabel: string;
  resendLinkLabel: string;
  newRequestLable: string;
  requestStatus: PaymentRequest[] = [];
  @Output() startPaymentEvent = new EventEmitter<any>();
  @Output() resendLinkEvent = new EventEmitter<any>();
  @Output() verifyTransactionEvent = new EventEmitter<any>();
  @Output() addRazorpayPayment = new EventEmitter<any>();
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<PaymentRazorpayPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      totalAmountDue: number;
      customer: any;
      razorpayResponseData$: Subject<any>;
      openRazorpayPaymentsDetails$: Subject<PaymentDetails[]>;
      businessDate: string;
      customerID: string;
      requestStatus$: Subject<PaymentRequest[]>;
    }
  ) {
    this.translate
      .get([
        'pw.paymentModeRazorpay.sendLinkText',
        'pw.paymentModeRazorpay.reSendLink',
        'pw.paymentModeRazorpay.newRequestText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.sendLinkLabel =
          translatedMessages['pw.paymentModeRazorpay.sendLinkText'];
        this.resendLinkLabel =
          translatedMessages['pw.paymentModeRazorpay.reSendLink'];

        this.newRequestLable =
          translatedMessages['pw.paymentModeRazorpay.newRequestText'];
      });
    this.razorpayFormGroup = new FormGroup({
      amount: new FormControl('', [
        this.fieldValidatorsService.requiredField('Amount'),
        this.fieldValidatorsService.minAmount(
          1,
          'Amount',
          this.data.currencyCode
        ),
        this.fieldValidatorsService.maxAmount(
          this.data.totalAmountDue,
          'Amount',
          this.data.currencyCode
        )
      ]),

      date: new FormControl(
        this.data.businessDate,
        this.fieldValidatorsService.requiredField('Date')
      ),
      transactionID: new FormControl('New')
    });
    this.data?.requestStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(requestStatus => {
        this.requestStatus = requestStatus;
        this.transactionIdArray = [
          { value: 'New', description: this.newRequestLable }
        ];

        for (const request of requestStatus) {
          this.transactionIdArray.push({
            value: request.id,
            description: request.referenceId,
            status: this.getOrderStausColor(request.status)
          });
        }

        if (this.razorpayResponse.length > 0) {
          for (let i = 0; i < this.requestStatus?.length; i++) {
            if (
              this.requestStatus[i].id === this.razorpayResponse[0].id &&
              this.requestStatus[i].status === 'COMPLETED'
            ) {
              this.addPayment(this.requestStatus[i].id);
            }
            if (
              this.requestStatus[i].id === this.razorpayResponse[0].id &&
              this.requestStatus[i].status === ROPaymentRequestStatus.FAILED
            ) {
              this.razorpayResponse[0] = this.requestStatus[i];
            }
          }
        }
      });

    this.data.openRazorpayPaymentsDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payments => {
        this.transactionIdArray = [
          { value: 'New', description: this.newRequestLable }
        ];
        this.openPayments = payments;
        for (const payment of this.openPayments) {
          this.transactionIdArray.push({
            value: payment.id,
            description: payment.reference2,
            status: this.getOrderStausColor(payment.status)
          });
        }
      });
    // this.data.razorpayResponseData$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(response => {
    //     if (response && response.length > 0) {
    //       this.razorpayResponse = response;
    //       if (this.razorpayResponse[0].status !== PaymentStatusEnum.OPEN) {
    //         this.addPayment();
    //       }
    //       this.hasResponse = true;
    //       this.sendLinkButtonText = this.resendLinkLabel;
    //     } else {
    //       this.hasResponse = false;
    //       this.sendLinkButtonText = this.sendLinkLabel;
    //     }
    //   });
  }

  selectTransaction() {
    this.razorpayResponse = [];
    if (this.razorpayFormGroup.get('transactionID').value === 'New') {
      this.razorpayFormGroup.patchValue({
        amount: '',
        date: this.data.businessDate
      });
      this.hasResponse = false;
      this.sendLinkButtonText = this.sendLinkLabel;
    } else {
      this.razorpayResponse.push(this.getSelectedTransactionDetails());
      this.razorpayFormGroup.patchValue({
        amount: this.razorpayResponse[0].amount,
        date: this.razorpayResponse[0].requestedDate
      });
      this.hasResponse = true;
      this.sendLinkButtonText = this.resendLinkLabel;
    }
  }
  getOrderStausColor(staus: string) {
    if (
      staus === ROPaymentRequestStatus.OPEN ||
      staus === ROPaymentRequestStatus.IN_PROGRESS
    ) {
      return 'pw-warning-color';
    } else if (staus === ROPaymentRequestStatus.COMPLETED) {
      return 'pw-success-color';
    } else if (staus === ROPaymentRequestStatus.FAILED) {
      return 'pw-error-color';
    }
  }
  getSelectedTransactionDetails() {
    const selectedDetails = this.requestStatus.filter(payment => {
      return payment.id === this.razorpayFormGroup.get('transactionID').value;
    });
    return { ...selectedDetails[0] };
  }
  sendLink() {
    if (!this.hasResponse) {
      const request: IntegratedPaymentRequestPayload = {
        amount: this.razorpayFormGroup.get('amount').value,
        customerId: this.data.customerID,
        paymentCode: PaymentModeEnum.RAZOR_PAY,
        instrumentDate: this.razorpayFormGroup.get('date').value
      };

      this.startPaymentEvent.emit(request);
      this.dialogRef.close(null);
    } else {
      this.resendLinkEvent.emit({
        id: this.razorpayResponse[0].id
      });
    }
  }

  addPayment(val) {
    const payload = new RazorPayIntegratedPayment(this.data.paymentGroup, {
      amount: this.razorpayFormGroup.get('amount').value,
      instrumentDate: this.razorpayFormGroup.get('date').value,
      otherDetails: {
        data: {
          paymentRequestId: val
        },
        type: PaymentModeEnum.RAZOR_PAY
      }
    });
    this.addRazorpayPayment.emit(payload);
    this.dialogRef.close();
  }
  verify() {
    this.verifyTransactionEvent.emit(this.razorpayResponse[0].id);
  }
  close() {
    this.dialogRef.close(null);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
