import {
  Component,
  OnInit,
  Inject,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  GiftVoucher,
  GiftVoucherInputField,
  GiftVoucherStatusDropdownEnum,
  GvStatusList,
  PaymentGroupEnum,
  PaymentModeEnum,
  PaymentType,
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-payment-gift-voucher-popup',
  templateUrl: './payment-gift-voucher-popup.component.html',
  styleUrls: ['./payment-gift-voucher-popup.component.scss']
  //  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentGiftVoucherPopupComponent implements OnInit {
  destroy$ = new Subject();
  cardList: GvStatusList[] = [];
  clearCardNumberField = true;
  redeemableGVCount = 0;
  nonRedeemableGVCount = 0;
  redeemableGVvalue = 0;
  redeemableGVList: GvStatusList[] = [];
  nonRedeemableGVList: GvStatusList[] = [];
  productList: string[];
  cardNumber = '';

  isScan = false;
  @Output() add = new EventEmitter<PaymentType>();
  @Output() getGVBalance = new EventEmitter<string>();
  @Output() removeGV = new EventEmitter<string>();
  @Output() resetGV = new EventEmitter();
  public activeTab = 0;
  filterSelected = GiftVoucherInputField.MANUAL_VALUE;
  InputTypes = GiftVoucherInputField;
  dropDownvalues = [
    {
      description: GiftVoucherInputField.MANUAL_CODE,
      value: GiftVoucherInputField.MANUAL_VALUE,
      isActive: true
    },
    {
      description: GiftVoucherInputField.SCAN_CODE,
      value: GiftVoucherInputField.SCAN_VALUE,
      isActive: true
    }
  ];
  gvForm: FormGroup;
  regexNumber: RegExp = fieldValidation.gcScannedCode.pattern;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,

    public dialogRef: MatDialogRef<PaymentGiftVoucherPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      GVData$: Subject<any>;
      paymentGroup: PaymentGroupEnum;
      currencyCode: string;
      mutipleGVsearch: boolean;
      businessDate: string;
    }
  ) {
    this.data.GVData$.pipe(takeUntil(this.destroy$)).subscribe(x => {
      this.redeemableGVvalue = 0;
      this.redeemableGVList = x.currentValue
        ? x.currentValue
            .filter(
              value =>
                value.status === GiftVoucherStatusDropdownEnum.REDEEMABLE_CODE
            )
            .map(gv => {
              this.redeemableGVvalue += gv.totalValue;
              return gv;
            })
        : [];

      this.nonRedeemableGVList = x.currentValue
        ? x.currentValue.filter(
            value =>
              value.status !== GiftVoucherStatusDropdownEnum.REDEEMABLE_CODE
          )
        : [];

      // this.cardList = x.currentValue ? x.currentValue : [];
    });
  }

  ngOnInit() {
    this.gvForm = new FormGroup({
      giftVoucher: new FormControl('', [
        Validators.required,
        this.fieldValidatorsService.numbersField('Gift Voucher'),
        this.fieldValidatorsService.requiredField('Gift Voucher')
      ]),
      dropDownvalues: new FormControl(this.filterSelected)
    });
  }

  setScan(isScan: boolean) {
    this.isScan = isScan;
    this.delete();
  }
  close() {
    this.dialogRef.close(null);
  }
  statusChange(value: GiftVoucherInputField) {
    this.filterSelected = value;
    this.delete();
  }
  remove(value) {
    this.removeGV.emit(value);
  }

  delete() {
    this.resetGV.emit();
    this.clearCardNumberField
      ? (this.clearCardNumberField = false)
      : (this.clearCardNumberField = true);
  }

  onGetBalance() {
    this.getGVBalance.emit(this.cardNumber);
    this.clearCardNumberField
      ? (this.clearCardNumberField = false)
      : (this.clearCardNumberField = true);
    this.cardNumber = '';
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addButtonEnabled() {
    return false;
  }

  getDetailButtonEnabled() {
    if (this.gvForm.get('giftVoucher').value.length === 9) {
      return false;
    }
    return true;
  }
  // @HostListener('keydown', ['$event'])
  // keyEvent(event: KeyboardEvent): void {
  //   //comment

  //   if (this.regexNumber.test(event.key)) {
  //     this.trackData += event.key;
  //     //Length of trackData when scanned is 26 and card number is 16
  //     if (this.trackData.length > 8) {
  //       this.gvForm.get('giftVoucher').setValue('');
  //       this.gvForm.get('giftVoucher').setValue(this.trackData);
  //       this.trackData = '';
  //       this.gvForm.updateValueAndValidity();
  //     }
  //   } else {
  //     this.trackData = '';
  //   }
  // }

  getCardNumber(value: any): void {
    if (!value.error) {
      if (!value.cardNumber) {
        this.cardNumber = '';
      } else {
        this.cardNumber = value.cardNumber;
      }
    }
  }

  getScanCardNumber(value: any): void {
    if (value) {
      this.cardNumber = value.cardNumber;
    } else {
      this.cardNumber = '';
    }
  }

  onselected(group) {
    this.activeTab = 1;
    this.productList = [group];
  }

  onTabChange($event) {
    // this.productList = [];
  }

  addPayment() {
    this.dialogRef.close(
      new GiftVoucher(this.data.paymentGroup, {
        instrumentType: PaymentModeEnum.GIFT_VOUCHER,
        instrumentDate: this.data.businessDate
      })
    );
  }
}
