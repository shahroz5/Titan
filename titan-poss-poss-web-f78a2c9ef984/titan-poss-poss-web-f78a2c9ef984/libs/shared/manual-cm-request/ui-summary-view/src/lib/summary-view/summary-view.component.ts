import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  Inject
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: []
})
export class SummaryViewComponent implements OnInit, OnDestroy {
  weightUnit = 'gms';
  currecnyCode = 'INR';
  remarksFormControl: FormControl;
  productQty = 0;
  coinQty = 0;

  get totalQty(): number {
    return this.productQty + this.coinQty;
  }

  productWeight = 0;
  coinWeight = 0;

  get totalWeight(): number {
    return this.productWeight + this.coinWeight;
  }

  productDisc = 0;
  coinDisc = 0;

  get totalDisc(): number {
    return this.productDisc + this.coinDisc;
  }

  productAmt = 0;
  coinAmt = 0;
  taxAmt = 0;
  totalAmt = 0;
  totalDiscount = 0;
  roundOff = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  totalTcsAmt = 0;
  otherCharges = 0;

  get totalAmount(): number {
    return this.totalAmt;
  }
  @Input() cmRequestDetails$: Observable<any>;
  destroy$: Subject<null> = new Subject<null>();
  cmRequestDetails: any;
  cmItemDetails = [];
  @Output() isApprove = new EventEmitter<any>();
  remarksLabel: string;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string
  ) {
    this.translate
      .get(['pw.passwordConfig.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.remarksLabel = translatedMsg['pw.passwordConfig.remarksLabel'];
      });
  }

  ngOnInit() {
    this.remarksFormControl = new FormControl(null, [
      this.fieldValidatorsService.requiredField(this.remarksLabel),
      this.fieldValidatorsService.remarkField(this.remarksLabel),
      this.fieldValidatorsService.minLength(5, this.remarksLabel),
      this.fieldValidatorsService.maxLength(250, this.remarksLabel)
    ]);
    this.cmRequestDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.cmRequestDetails = data?.headerData?.data;
          this.cmItemDetails = data?.approvedData?.data?.itemList;

          if (this.cmItemDetails.length !== 0) {
            this.taxAmt = this.cmRequestDetails.totalTax;
            this.totalAmt = this.cmRequestDetails.finalValue;
            this.totalDiscount = this.cmRequestDetails.totalDiscount;
            this.roundOff = this.cmRequestDetails.roundingVariance
              ? this.cmRequestDetails.roundingVariance > 0
                ? this.cmRequestDetails.roundingVariance
                : -this.cmRequestDetails.roundingVariance
              : 0;
            this.hallmarkCharges = this.cmRequestDetails.hallmarkCharges;
            this.hallmarkDiscount = this.cmRequestDetails.hallmarkDiscount;
            this.totalTcsAmt = this.cmRequestDetails.tcsToBeCollected ? this.cmRequestDetails.tcsToBeCollected : 0;
            this.otherCharges = this.cmRequestDetails?.otherCharges?.data?.value;
            this.cmItemDetails.forEach(element => {
              if (element?.productGroupCode === this.coinCode) {
                this.coinQty = this.coinQty + element?.totalQuantity;
                this.coinWeight = this.coinWeight + element?.totalWeight;
                this.coinDisc = this.coinDisc + element?.totalDiscount;
                this.coinAmt = this.coinAmt + element?.totalValue;
              } else {
                this.productQty = this.productQty + element?.totalQuantity;
                this.productWeight = this.productWeight + element?.totalWeight;
                this.productDisc = this.productDisc + element?.totalDiscount;
                this.productAmt = this.productAmt + element?.totalValue;
              }
            });
          }
        }
      });
  }

  clear() {
    this.isApprove.emit({
      isApprove: false,
      remarks: this.remarksFormControl.value
    });
  }

  confirm() {
    this.isApprove.emit({
      isApprove: true,
      remarks: this.remarksFormControl.value
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
