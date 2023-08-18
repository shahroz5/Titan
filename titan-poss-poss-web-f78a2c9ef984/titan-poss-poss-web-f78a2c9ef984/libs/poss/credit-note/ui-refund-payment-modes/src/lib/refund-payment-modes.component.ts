import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  CnRefundAmountDetails,
  CnRefundPaymentData,
  RefundOptionTypes,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-refund-payment-modes',
  templateUrl: './refund-payment-modes.component.html',
  styleUrls: ['./refund-payment-modes.component.scss']
})
export class RefundPaymentModesComponent
  implements OnChanges, OnInit, OnDestroy {
  @Input() refundDeductionAmount = 0;
  @Input() netRefundAmount = 0;
  @Input() amount = 0;
  @Input() refundPaymentMode = null;
  @Input() allowedRefundPaymentModes: SelectDropDownOption[] = [];
  @Input() refundAmountDetails: CnRefundAmountDetails;
  @Input() creditNoteDetails;
  @Output() cnRefundPaymentData: EventEmitter<
    CnRefundPaymentData
  > = new EventEmitter<CnRefundPaymentData>();
  @Output() isPaymentFormValid: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  refundTypeLabel: string;
  refundFormGroup: FormGroup;
  parentForm: FormArray;
  selectedRefundType = '';
  refundOptionTypes = RefundOptionTypes;
  refundPaymentModes: SelectDropDownOption[] = [];
  voidUnipayLabel: string;
  refundDetails: CnRefundAmountDetails;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.translate
      .get(['pw.creditNote.refundTypeLabel', 'pw.creditNote.voidUnipayLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.refundTypeLabel = translatedMsg['pw.creditNote.refundTypeLabel'];
        this.voidUnipayLabel = translatedMsg['pw.creditNote.voidUnipayLabel'];
      });

    this.parentForm = new FormArray([]);

    this.refundFormGroup = this.fb.group({
      refundTypeSelected: [
        '',
        this.fieldValidatorsService.requiredField(this.refundTypeLabel)
      ]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If Cash Payment Mode is allowed, then make it default/selected
    if (changes['allowedRefundPaymentModes']) {
      this.selectCashRefundMode();
    }

    if (changes['refundPaymentMode']) {
      this.refundPaymentMode = this.creditNoteDetails.isUnipay
        ? null
        : this.refundPaymentMode;
    }
  }

  ngOnInit(): void {
    this.refundFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        console.log('CN REFUND FORM GROUP:', this.refundFormGroup);
        this.selectedRefundType = value.refundTypeSelected;
        this.validatePaymentDetails();
      });

    this.parentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedRefundModeFormDetails => {
        console.log(
          'CN parentForm FORM Array: selectedRefundModeFormDetails',
          this.parentForm
        );
        this.validatePaymentDetails();
      });

    this.selectCashRefundMode();
  }

  selectCashRefundMode() {
    if (this.allowedRefundPaymentModes) {
      this.selectedRefundType = '';
      this.allowedRefundPaymentModes.forEach(paymentMode => {
        if (paymentMode.value === RefundOptionTypes.CASH) {
          this.selectedRefundType = paymentMode.value;

          this.refundFormGroup
            .get('refundTypeSelected')
            .patchValue(paymentMode.value);
          this.refundFormGroup.updateValueAndValidity();
        }
      });
      this.refundPaymentModes = [...this.allowedRefundPaymentModes];

      if (this.creditNoteDetails?.isUnipay) {
        this.refundPaymentModes.push({
          value: RefundOptionTypes.VOID_UNIPAY,
          description: this.voidUnipayLabel
        });
      }
    }
  }

  validatePaymentDetails() {
    if (this.refundFormGroup.valid && this.parentForm.valid) {
      let refundPaymentData: CnRefundPaymentData;
      let otherRefundPaymentDetails;

      switch (this.selectedRefundType) {
        case RefundOptionTypes.CHEQUE:
          otherRefundPaymentDetails = {
            chequeNumber: this.parentForm?.value[0]?.chequeNumber,
            payeeName: this.parentForm?.value[0]?.payeeName,
            bankName: this.parentForm?.value[0]?.bankName,
            micrCode: this.parentForm?.value[0]?.micrCode
          };
          break;
        case RefundOptionTypes.RTGS:
        case RefundOptionTypes.RO_RTGS:
          otherRefundPaymentDetails = {
            accountHoldersName: this.parentForm?.value[0]?.accountHoldersName,
            bankName: this.parentForm?.value[0]?.bankName,
            accountNumber: this.parentForm?.value[0]?.accountNumber,
            branch: this.parentForm?.value[0]?.branch,
            ifscCode: this.parentForm?.value[0]?.ifscCode
          };
          break;
        case RefundOptionTypes.AIRPAY:
          otherRefundPaymentDetails = {
            tanishqTransactionId: this.parentForm?.value[0]
              ?.tanishqTransactionId,
            airpayTransactionId: this.parentForm?.value[0]?.airpayTransactionId
          };
          break;
        case RefundOptionTypes.RAZORPAY:
          otherRefundPaymentDetails = {
            tanishqTransactionId: this.parentForm?.value[0]
              ?.tanishqTransactionId,
            razorpayTransactionId: this.parentForm?.value[0]
              ?.razorpayTransactionId
          };
          break;
        case RefundOptionTypes.CARD:
          otherRefundPaymentDetails = {
            approvalCode: this.parentForm?.value[0]?.approvalCode,
            tidNumber: this.parentForm?.value[0]?.tidNumber,
            acquiredBank: this.parentForm?.value[0]?.acquiredBank
          };
          break;
        case RefundOptionTypes.VOID_UNIPAY:
          otherRefundPaymentDetails = {
            hostName: this.creditNoteDetails?.paymentDetails?.data?.hostname,
            unipayId: this.creditNoteDetails?.paymentDetails?.data?.unipayID,
            txnId: this.creditNoteDetails?.paymentDetails?.data?.paymentId,
            date: this.creditNoteDetails?.paymentDetails?.data?.txnDate,
            bankInvoiceNumber: this.creditNoteDetails?.paymentDetails?.data
              ?.bankInvoiceNo,
            originalDocDate: this.creditNoteDetails?.originalDocDate,
            amount: this.creditNoteDetails?.amount
          };
          break;
        default:
          // For CASH, RO_PAYMENT, WALLET... payment refund modes
          otherRefundPaymentDetails = {};
          break;
      }

      refundPaymentData = {
        paymentCode:
          this.refundPaymentMode === RefundOptionTypes.RO_PAYMENT
            ? this.refundPaymentMode
            : this.selectedRefundType,
        instrumentType:
          this.refundPaymentMode === RefundOptionTypes.RO_PAYMENT
            ? this.selectedRefundType
            : null,
        paymentGroup:
          this.selectedRefundType === RefundOptionTypes.WALLET
            ? 'WALLET'
            : 'REGULAR',
        refundAmount:
          this.refundPaymentMode === RefundOptionTypes.VOID_UNIPAY
            ? this.amount
            : this.netRefundAmount,
        otherDetails: otherRefundPaymentDetails
      };

      this.isPaymentFormValid.emit(true);
      this.cnRefundPaymentData.emit(refundPaymentData);
    } else {
      this.refundFormGroup.markAllAsTouched();
      this.parentForm.markAllAsTouched();
      this.isPaymentFormValid.emit(false);
    }
  }

  onRefundTypeChanged(event: any) {
    console.log('Refund Type Changed', event);
    this.selectedRefundType = event.value;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
