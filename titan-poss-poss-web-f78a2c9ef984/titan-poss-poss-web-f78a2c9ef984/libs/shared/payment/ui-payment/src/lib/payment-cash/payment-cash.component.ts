import { FormControl } from '@angular/forms';
import {
  PaymentType,
  CashPayment,
  PaymentGroupEnum,
  CashLimitDetails,
  MaxCashAmountDetails
} from '@poss-web/shared/models';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payment-cash',
  templateUrl: './payment-cash.component.html',
  styleUrls: ['./payment-cash.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentCashComponent implements OnInit, OnChanges, OnDestroy {
  @Input() paymentGroup: PaymentGroupEnum;
  @Input() maxCashLimit = 0;
  @Input() maxCashLimitDetails: CashLimitDetails;
  @Input() enable: boolean;
  @Input() currencyCode: string;
  @Input() totalAmountDue = 0;
  @Input() hasCashPayment = false;
  @Input() isLoading = false;
  @Input() cashAmountMaxCap: MaxCashAmountDetails;
  @Input() setFocus = false;
  @ViewChild('cashInput')
  cashInput: ElementRef;

  @Output() add = new EventEmitter<PaymentType>();

  destroy$ = new Subject();
  amountLabel: string;
  showCashlimitError = false;

  get maxLimit() {
    if (this.maxCashLimit == null) {
      return this.totalAmountDue;
    }
    return this.maxCashLimit < this.totalAmountDue
      ? this.maxCashLimit
      : this.totalAmountDue;
  }

  amountFormControl: FormControl;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get('pw.paymentCash.amountLabel')
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: any) => {
        this.amountLabel = translatedMessage;
      });
  }

  ngOnInit() {
    this.amountFormControl = new FormControl(null, this.createValidators());
    this.checkForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enable'] && !!this.amountFormControl) {
      this.checkForm();
      this.checkForCashLimitError();
    }

    if (changes['maxCashLimit'] && !!this.amountFormControl) {
      this.amountFormControl.setValidators(this.createValidators());
      this.reset();
      this.checkForCashLimitError();
    }

    if (changes['totalAmountDue'] && !!this.amountFormControl) {
      this.amountFormControl.setValidators(this.createValidators());
      this.reset();
      this.checkForCashLimitError();
    }
    if (changes['hasCashPayment']) {
      this.checkForCashLimitError();
    }

    if (changes['isLoading']) {
      this.checkForCashLimitError();
    }

    if (changes['setFocus']) {
      if (this.setFocus) {
        setTimeout(() => {
          this.cashInput.nativeElement.focus();
        }, 100);
      }
    }
  }

  checkForCashLimitError() {
    if (
      !this.isLoading &&
      !this.enable &&
      this.totalAmountDue > 0 &&
      this.hasCashPayment
    ) {
      this.showCashlimitError = true;
    } else {
      this.showCashlimitError = false;
    }
  }

  checkForm() {
    this.reset();
    if (this.enable) {
      this.amountFormControl.enable();
    } else {
      this.amountFormControl.disable();
    }
  }

  createValidators() {
    let validators = [];
    if (this.maxLimit === this.totalAmountDue) {
      return (validators = [
        this.fieldValidatorsService.requiredField(this.amountLabel),
        this.fieldValidatorsService.minAmount(
          1,
          this.amountLabel,
          this.currencyCode
        ),
        this.fieldValidatorsService.maxAmount(
          Math.floor(this.maxLimit),
          this.amountLabel,
          this.currencyCode
        )
      ]);
    } else if (this.maxCashLimitDetails?.amountCheck === true) {
      return (validators = [
        this.fieldValidatorsService.requiredField(this.amountLabel),
        this.fieldValidatorsService.minAmount(
          1,
          this.amountLabel,
          this.currencyCode
        ),
        this.fieldValidatorsService.eligibleCashMax(
          Math.floor(this.maxLimit),
          this.amountLabel,
          this.currencyCode
        )
      ]);
    } else if (this.maxCashLimitDetails?.amountCheck === false) {
      return (validators = [
        this.fieldValidatorsService.requiredField(this.amountLabel),
        this.fieldValidatorsService.minAmount(
          1,
          this.amountLabel,
          this.currencyCode
        ),
        this.fieldValidatorsService.pmlaCashMax(
          Math.floor(this.maxLimit),
          this.amountLabel,
          this.currencyCode
        )
      ]);
    }
  }

  addPayment() {
    if (
      this.amountFormControl.enabled &&
      this.amountFormControl.valid &&
      !!this.amountFormControl.value
    ) {
      this.add.emit(
        new CashPayment(this.paymentGroup, {
          amount: this.amountFormControl.value
        })
      );
    } else {
      this.amountFormControl.markAllAsTouched();
    }
  }

  reset() {
    this.amountFormControl.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
