import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { FormGroup, FormControl } from '@angular/forms';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ROPayment,
  PaymentGroupEnum,
  IntegratedPaymentRequestPayload,
  PaymentModeEnum,
  PaymentRequest,
  ROPaymentRequestStatus,
  PaymentDetails,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PaymentAirpayIntegrationPopupComponent } from '../payment-airpay-integration-popup/payment-airpay-integration-popup.component';
@Component({
  selector: 'poss-web-payment-ro-request-popup',
  templateUrl: './payment-ro-request-popup.component.html',
  styleUrls: ['./payment-ro-request-popup.component.scss']
})
export class PaymentRoRequestPopupComponent implements OnDestroy {
  ROFormGroup: FormGroup;
  ROResponse = [];
  sendLinkButtonText = 'SEND REQUEST';
  hasResponse = false;
  openPayments: PaymentDetails[] = [];
  destroy$ = new Subject();
  transactionIdArray: SelectDropDownOption[] = [];
  reasonLabel: string;
  sendLinkLabel: string;
  resendLinkLabel: string;
  newRequestLable: string;
  dateLabel: string;
  amountLabel: string;
  requestStatus: PaymentRequest[] = [];

  @Output() startPaymentEvent = new EventEmitter<any>();
  @Output() resendLinkEvent = new EventEmitter<any>();
  @Output() verifyTransactionEvent = new EventEmitter<any>();
  @Output() addROPayment = new EventEmitter<any>();

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

        'pw.paymentModeAirpay.date',
        'pw.roPayment.amountLable',
        'pw.roPayment.reasonLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.newRequestLable =
          translatedMessages['pw.paymentModeAirpay.newRequestText'];
        this.dateLabel = translatedMessages['pw.paymentModeAirpay.date'];
        this.amountLabel = translatedMessages['pw.roPayment.amountLable'];
        this.reasonLabel = translatedMessages['pw.roPayment.reasonLable'];
      });

    this.ROFormGroup = new FormGroup({
      amount: new FormControl('', [
        this.fieldValidatorsService.requiredField('Amount'),
        this.fieldValidatorsService.minAmount(
          1,
          this.amountLabel,
          this.data.currencyCode
        )
        // this.fieldValidatorsService.maxAmount(
        //   this.data.totalAmountDue,
        //   this.amountLabel,
        //   this.data.currencyCode
        // )
      ]),

      date: new FormControl(
        this.data.businessDate,
        this.fieldValidatorsService.requiredField(this.dateLabel)
      ),
      transactionID: new FormControl('New'),
      reason: new FormControl('', [
        this.fieldValidatorsService.reasonField(this.reasonLabel),
        this.fieldValidatorsService.requiredField(this.reasonLabel),
        this.fieldValidatorsService.minLength(5, this.reasonLabel)
      ])
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

        if (this.ROResponse.length > 0) {
          for (let i = 0; i < this.requestStatus?.length; i++) {
            if (
              this.requestStatus[i].id === this.ROResponse[0].id &&
              this.requestStatus[i].status === ROPaymentRequestStatus.APPROVED
            ) {
              this.addPayment(this.requestStatus[i]);
            }
            if (
              this.requestStatus[i].id === this.ROResponse[0].id &&
              this.requestStatus[i].status === ROPaymentRequestStatus.REJECTED
            ) {
              this.ROResponse[0] = this.requestStatus[i];
            }
          }
        }
      });
  }

  selectTransaction() {
    this.ROResponse = [];
    if (this.ROFormGroup.get('transactionID').value === 'New') {
      this.ROFormGroup.patchValue({
        amount: '',
        date: this.data.businessDate,
        reason: ''
      });
      this.hasResponse = false;
    } else {
      this.ROResponse.push(this.getSelectedTransactionDetails());
      this.ROFormGroup.patchValue({
        amount: this.ROResponse[0].amount,
        date: this.ROResponse[0].requestedDate,
        reason: this.ROResponse[0].requestedReason
      });
      this.hasResponse = true;
    }
  }
  getSelectedTransactionDetails() {
    const selectedDetails = this.requestStatus.filter(payment => {
      return payment.id === this.ROFormGroup.get('transactionID').value;
    });
    return { ...selectedDetails[0] };
  }
  sendLink() {
    if (!this.hasResponse) {
      const request: IntegratedPaymentRequestPayload = {
        amount: this.ROFormGroup.get('amount').value,
        customerId: this.data.customerID,
        paymentCode: PaymentModeEnum.RO_PAYMENT,
        requestedReason: this.ROFormGroup.get('reason').value
      };

      this.startPaymentEvent.emit(request);
      this.dialogRef.close(null);
    } else {
      this.resendLinkEvent.emit({
        id: this.ROResponse[0].id
      });
    }
  }

  addPayment(val) {
    const Payload = new ROPayment(this.data.paymentGroup, {
      amount: this.ROFormGroup.get('amount').value,
      instrumentDate: this.ROFormGroup.get('date').value,
      bankName: val.approvedBy,
      reference1: val.referenceId,
      reference2: val.id,
      remarks: this.ROFormGroup.get('reason').value
    });

    this.addROPayment.emit(Payload);
    this.dialogRef.close();
  }

  verify() {
    this.verifyTransactionEvent.emit(this.ROResponse[0].id);
  }
  close() {
    this.dialogRef.close(null);
  }
  getOrderStausColor(staus: string) {
    if (staus === ROPaymentRequestStatus.PENDING) {
      return 'pw-warning-color';
    } else if (staus === ROPaymentRequestStatus.APPROVED) {
      return 'pw-success-color';
    } else if (staus === ROPaymentRequestStatus.REJECTED) {
      return 'pw-error-color';
    }
  }

  enableAdd(): boolean {
    if (
      this.hasResponse &&
      this.ROFormGroup.get('amount').value <= this.data.totalAmountDue
    ) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
