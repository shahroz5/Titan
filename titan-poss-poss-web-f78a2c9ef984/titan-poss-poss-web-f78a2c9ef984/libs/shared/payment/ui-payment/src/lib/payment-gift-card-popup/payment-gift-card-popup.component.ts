import {
  Component,
  OnInit,
  Inject,
  EventEmitter,
  Output,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import {
  PaymentType,
  QCGC,
  PaymentGroupEnum,
  QCGCCardDetails,
  ProductGroupMappingOption,
  PaymentDetails
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-gift-card-popup',
  templateUrl: './payment-gift-card-popup.component.html',
  styleUrls: ['./payment-gift-card-popup.component.scss']
})
export class PaymentGiftCardPopupComponent implements OnInit, OnDestroy {
  @Output() add = new EventEmitter<PaymentType>();
  @Output() getQCGCBalance = new EventEmitter<string>();
  @Output() resetQCGC = new EventEmitter();
  @Output() addQCGCPayment = new EventEmitter<any>();

  trackData = '';
  sequence = [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23];
  finaltrackData = '';
  lastKeyStrokeTime: any;
  regexNumber: RegExp = new RegExp('^[0-9]$');
  cardNumber = '';
  productList: string[];
  amountFormControl: FormControl;
  public activeTab = 0;
  @ViewChild('focusAmount')
  focusAmount: ElementRef;
  cardPin: FormControl;
  destroy$ = new Subject();
  cardDetails: QCGCCardDetails;
  amountLabel = 'amount';

  clearCardNumberField = true;
  isScan = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentGiftCardPopupComponent>,
    private fieldValidatorsService: FieldValidatorsService,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      QCGCData$: Subject<any>;
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      productDesc: any;
      businessDate: string;
      paymentDetails$: Observable<PaymentDetails[]>;
    }
  ) {
    this.data.QCGCData$.pipe(takeUntil(this.destroy$)).subscribe(x => {
      this.cardDetails = x.currentValue;
      if (this.cardDetails) {
        this.isScan ? this.cardPin.disable() : this.cardPin.enable();

        this.amountFormControl = new FormControl(
          this.cardDetails.amount,
          this.createValidators()
        );

        if (!this.cardDetails.partialRedemption) {
          this.amountFormControl.disable();
        }
      }
    });

    this.cardPin = new FormControl('', [
      this.fieldValidatorsService.numbersField('Card Pin'),
      this.fieldValidatorsService.requiredField('Card Pin')

      //this.fieldValidatorsService.maxLength(6,'Card Pin')
    ]);
  }

  ngOnInit() {
    this.cardPin.disable();

    if (this.data && this.data.paymentDetails$) {
      this.data.paymentDetails$
        .pipe(takeUntil(this.destroy$))
        .subscribe(paymentDetails => {
          if (paymentDetails.length > 0) {
            this.delete();
          }
        });
    }
  }
  createValidators() {
    const validators = [
      this.fieldValidatorsService.requiredField(this.amountLabel),
      this.fieldValidatorsService.minAmount(
        1,
        this.amountLabel,
        this.data.currencyCode
      ),
      this.fieldValidatorsService.maxAmount(
        Number(this.cardDetails.amount),
        this.amountLabel,
        this.data.currencyCode
      )
    ];

    return validators;
  }

  addPayment() {
    if (
      (this.finaltrackData.length === 26 || this.cardPin.value) &&
      this.cardDetails &&
      this.amountFormControl.value > 0
    ) {
      this.addQCGCPayment.emit(
        new QCGC(this.data.paymentGroup, {
          amount: this.amountFormControl.value,
          instrumentNo: this.cardDetails.cardNumber,
          instrumentType: 'QCGC',
          reference1:
            this.finaltrackData.length === 26
              ? this.finaltrackData
              : this.cardPin.value,

          otherDetails: {},
          reference2: this.cardDetails.cardType,
          bankName: this.cardDetails.paymentCategoryName,
          instrumentDate: this.data.businessDate
        })
      );
      // this.dialogRef.close(
      //   new QCGC(this.data.paymentGroup, {
      //     amount: this.amountFormControl.value,
      //     instrumentNo: this.cardDetails.cardNumber,
      //     instrumentType: 'QCGC',
      //     reference1:
      //       this.finaltrackData.length === 26
      //         ? this.finaltrackData
      //         : this.cardPin.value,

      //     otherDetails: {},
      //     reference2: this.cardDetails.cardType,
      //     bankName: this.cardDetails.paymentCategoryName,
      //     instrumentDate: this.data.businessDate
      //   })
      // );
      //this.delete();
      // this.cardPin.reset();
    } else {
      this.cardPin.markAllAsTouched();
    }
  }
  onGetBalance() {
    if (this.cardNumber.length > 0) {
      this.getQCGCBalance.emit(this.cardNumber);
      this.trackData = '';
      // this.clearCardNumberField
      //   ? (this.clearCardNumberField = false)
      //   : (this.clearCardNumberField = true);
    }
  }
  close() {
    this.dialogRef.close(null);
  }

  delete() {
    this.resetQCGC.emit();
    this.clearCardNumberField
      ? (this.clearCardNumberField = false)
      : (this.clearCardNumberField = true);
    this.finaltrackData = '';
    this.cardNumber = '';
    this.cardPin.reset();
    this.cardPin.disable();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCardNumber(value: any): void {
    if (!value.error) {
      this.cardNumber = value.cardNumber;
    }
  }

  getScanCardNumber(value: any): void {
    if (value.trackdata.length === 26) {
      this.finaltrackData = value.trackdata;
      this.cardNumber = value.cardNumber;
    }
  }

  setScan(isScan: boolean) {
    this.isScan = isScan;
    this.delete();
  }

  addButtonEnabled() {
    if (!this.isScan) {
      if (
        this.cardPin.invalid ||
        !this.cardDetails ||
        this.cardPin.value.length !== 6 ||
        this.amountFormControl.invalid
      ) {
        return true;
      } else {
        return false;
      }
    } else if (this.isScan) {
      if (
        this.cardPin.invalid ||
        !this.cardDetails ||
        this.amountFormControl.invalid
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  onTabChange($event) {
    // this.productList = [];
  }

  getFilteredArray(
    array1: ProductGroupMappingOption[],
    array2: ProductGroupMappingOption[]
  ): ProductGroupMappingOption[] {
    const array2Ids: string[] = array2.map(data => data.id);
    return array1.filter(ele => !array2Ids.includes(ele.id));
  }
  onselected(group) {
    this.activeTab = 1;

    this.productList = group;
  }
}
