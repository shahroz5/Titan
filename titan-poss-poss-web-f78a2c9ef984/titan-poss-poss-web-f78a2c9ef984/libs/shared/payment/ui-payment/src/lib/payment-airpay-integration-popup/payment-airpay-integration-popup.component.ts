import {
  ChangeDetectionStrategy,
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
  AirpayIntegratedPayment,
  PaymentDetails,
  PaymentGroupEnum,
  PaymentModeEnum,
  PaymentStatusEnum,
  SelectDropDownOption,
  PaymentRequest,
  IntegratedPaymentRequestPayload,
  RequestStatus,
  ROPaymentRequestStatus
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-airpay-integration-popup',
  templateUrl: './payment-airpay-integration-popup.component.html'
})
export class PaymentAirpayIntegrationPopupComponent implements OnDestroy {
  airpayFormGroup: FormGroup;
  airpayResponse = [];
  sendLinkButtonText = 'SEND LINK';
  hasResponse = false;
  openPayments: PaymentDetails[] = [];
  destroy$ = new Subject();
  transactionIdArray: SelectDropDownOption[] = [];

  sendLinkLabel: string;
  resendLinkLabel: string;
  newRequestLable: string;
  dateLabel: string;
  amountLabel: string;
  requestStatus: PaymentRequest[] = [];

  @Output() startPaymentEvent = new EventEmitter<any>();
  @Output() resendLinkEvent = new EventEmitter<any>();
  @Output() verifyTransactionEvent = new EventEmitter<any>();
  @Output() addAirpayPayment = new EventEmitter<any>();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<PaymentAirpayIntegrationPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      totalAmountDue: number;
      customer: any;
      airpayResponseData$: Subject<any>;
      openAirpayPaymentsDetails$: Subject<PaymentDetails[]>;
      businessDate: string;
      requestStatus$: Subject<PaymentRequest[]>;
      customerID: string;
    }
  ) {
    this.translate
      .get([
        'pw.paymentModeAirpay.sendLinkText',
        'pw.paymentModeAirpay.reSendLink',
        'pw.paymentModeAirpay.newRequestText',
        'pw.paymentModeAirpay.amount',
        'pw.paymentModeAirpay.date'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.sendLinkLabel =
          translatedMessages['pw.paymentModeAirpay.sendLinkText'];
        this.resendLinkLabel =
          translatedMessages['pw.paymentModeAirpay.reSendLink'];

        this.newRequestLable =
          translatedMessages['pw.paymentModeAirpay.newRequestText'];
        this.dateLabel = translatedMessages['pw.paymentModeAirpay.date'];
        this.amountLabel = translatedMessages['pw.paymentModeAirpay.amount'];
      });
    this.airpayFormGroup = new FormGroup({
      amount: new FormControl('', [
        this.fieldValidatorsService.requiredField('Amount'),
        this.fieldValidatorsService.minAmount(
          1,
          this.amountLabel,
          this.data.currencyCode
        ),
        this.fieldValidatorsService.maxAmount(
          this.data.totalAmountDue,
          this.amountLabel,
          this.data.currencyCode
        )
      ]),

      date: new FormControl(
        this.data.businessDate,
        this.fieldValidatorsService.requiredField(this.dateLabel)
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
        if (this.airpayResponse.length > 0) {
          for (let i = 0; i < this.requestStatus?.length; i++) {
            if (
              this.requestStatus[i].id === this.airpayResponse[0].id &&
              this.requestStatus[i].status === ROPaymentRequestStatus.COMPLETED
            ) {
              this.addPayment(this.requestStatus[i].id);
            }
            if (
              this.requestStatus[i].id === this.airpayResponse[0].id &&
              this.requestStatus[i].status === ROPaymentRequestStatus.FAILED
            ) {
              this.airpayResponse[0] = this.requestStatus[i];
            }
          }
        }
      });
  }

  selectTransaction() {
    this.airpayResponse = [];
    if (this.airpayFormGroup.get('transactionID').value === 'New') {
      this.airpayFormGroup.patchValue({
        amount: '',
        date: this.data.businessDate
      });
      this.hasResponse = false;
      this.sendLinkButtonText = this.sendLinkLabel;
    } else {
      this.airpayResponse.push(this.getSelectedTransactionDetails());
      this.airpayFormGroup.patchValue({
        amount: this.airpayResponse[0].amount,
        date: this.airpayResponse[0].requestedDate
      });
      this.hasResponse = true;
      this.sendLinkButtonText = this.resendLinkLabel;
    }
  }
  getSelectedTransactionDetails() {
    const selectedDetails = this.requestStatus.filter(payment => {
      return payment.id === this.airpayFormGroup.get('transactionID').value;
    });
    return { ...selectedDetails[0] };
  }
  sendLink() {
    if (!this.hasResponse) {
      const request: IntegratedPaymentRequestPayload = {
        amount: this.airpayFormGroup.get('amount').value,
        customerId: this.data.customerID,
        paymentCode: PaymentModeEnum.AIRPAY,
        instrumentDate: this.airpayFormGroup.get('date').value
      };

      this.startPaymentEvent.emit(request);
      this.dialogRef.close(null);
    } else {
      this.resendLinkEvent.emit({
        id: this.airpayResponse[0].id
      });
    }
  }

  addPayment(val) {
    const Payload = new AirpayIntegratedPayment(this.data.paymentGroup, {
      amount: this.airpayFormGroup.get('amount').value,
      instrumentDate: this.airpayFormGroup.get('date').value,
      otherDetails: {
        data: {
          paymentRequestId: val
        },
        type: PaymentModeEnum.AIRPAY
      }
    });
    this.addAirpayPayment.emit(Payload);
    this.dialogRef.close();
  }
  verify() {
    this.verifyTransactionEvent.emit(this.airpayResponse[0].id);
  }
  close() {
    this.dialogRef.close(null);
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
