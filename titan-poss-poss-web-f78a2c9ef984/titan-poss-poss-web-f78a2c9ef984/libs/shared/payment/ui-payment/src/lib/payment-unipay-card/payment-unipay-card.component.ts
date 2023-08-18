import {
  Component,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { UniPayPayment, PaymentGroupEnum } from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-payment-unipay-card',
  templateUrl: './payment-unipay-card.component.html',
  styleUrls: ['./payment-unipay-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentUnipayCardComponent implements OnChanges {
  @Input() paymentGroup: PaymentGroupEnum;
  @Input() currencyCode: string;
  @Input() totalAmountDue = 0;
  @Input() enable: boolean;
  @Input() resetValuesEvent: Observable<boolean>;

  @Output() add = new EventEmitter<UniPayPayment>();
  @Output() testPaymentUnipay = new EventEmitter<any>();
  uniPayFormControl = new FormControl(null, this.createValidators());
  destroy$: Subject<null> = new Subject<null>();

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalAmountDue'] && !!this.uniPayFormControl) {
      this.uniPayFormControl.setValidators(this.createValidators());
      this.reset();
    }

    if (changes['enable'] && !!this.uniPayFormControl) {
      this.checkForm();
    }
  }

  ngOnInit() {
    this.resetValuesEvent?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('reset unipay');
      if (data) {
        this.reset();
      }
    });
  }

  checkForm() {
    this.reset();
    if (this.enable) {
      this.uniPayFormControl.enable();
    } else {
      this.uniPayFormControl.disable();
    }
  }

  createValidators() {
    const validators = [
      this.fieldValidatorsService.requiredField('Amount'),
      this.fieldValidatorsService.minAmount(1, 'Amount', this.currencyCode),
      this.fieldValidatorsService.maxAmount(
        this.totalAmountDue,
        'Amount',
        this.currencyCode
      )
    ];

    return validators;
  }

  addPayment() {
    if (this.uniPayFormControl.enabled && this.uniPayFormControl.valid) {
      this.add.emit(
        new UniPayPayment(this.paymentGroup, {
          amount: this.uniPayFormControl.value
        })
      );
    } else {
      this.uniPayFormControl.markAllAsTouched();
    }
  }

  reset() {
    this.uniPayFormControl.reset();
  }
  //will be removed after Testing
  testPayment() {
    this.testPaymentUnipay.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
