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
import {
  PaymentType,
  CardPayment,
  PaymentGroupEnum,
  PaymentConfig,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() enable: boolean;
  @Input() payeeBanks: string[] = [];
  @Input() paymentGroup: PaymentGroupEnum;
  @Input() currencyCode: string;
  @Input() totalAmountDue = 0;
  @Input() config: PaymentConfig;
  @Input() businessDate: string;
  @Input() setFocus = false;
  @ViewChild('cardInput')
  cardInput: ElementRef;

  @Output() add = new EventEmitter<PaymentType>();
  payeeBankOptions: SelectDropDownOption[] = [];

  filteredPayerbanksOptions: Observable<string[]>;
  cardForm: FormGroup;
  destroy$ = new Subject();
  amountLabel: string;
  edcBankLabel: string;
  cardBankLabel: string;
  cardTypeLabel: string;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.paymentCard.amountLabel',
        'pw.paymentCard.edcBankLabel',
        'pw.paymentCard.cardBankLabel',
        'pw.paymentCard.cardTypeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.amountLabel = translatedMessages['pw.paymentCard.amountLabel'];
        this.edcBankLabel = translatedMessages['pw.paymentCard.edcBankLabel'];
        this.cardBankLabel = translatedMessages['pw.paymentCard.cardBankLabel'];
        this.cardTypeLabel = translatedMessages['pw.paymentCard.cardTypeLabel'];
      });
  }

  createPayeeBankOptions() {
    this.payeeBankOptions = this.payeeBanks.map(card => ({
      description: card,
      value: card
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payeeBanks']) {
      this.createPayeeBankOptions();
    }

    if (changes['enable'] && !!this.cardForm) {
      this.checkForm();
    }

    if (changes['totalAmountDue'] && !!this.cardForm) {
      this.cardForm.get('amount').setValidators(this.createAmountValidators());
      this.reset();
    }

    if (changes['config'] && !!this.cardForm) {
      this.cardForm
        .get('payerBankName')
        .setValidators(this.createPayerBankValidators());
      this.cardForm
        .get('cardType')
        .setValidators(this.createCardTypeValidators());
      this.reset();
    }

    if (changes['setFocus']) {
      if (this.setFocus) {
        setTimeout(() => {
          this.cardInput.nativeElement.focus();
        }, 100);
      }
    }
  }

  checkForm() {
    this.reset();
    if (this.enable) {
      this.cardForm.enable();
    } else {
      this.cardForm.disable();
    }
  }

  createAmountValidators() {
    const validators = [
      this.fieldValidatorsService.requiredField(this.amountLabel),
      this.fieldValidatorsService.minAmount(
        1,
        this.amountLabel,
        this.currencyCode
      ),
      this.fieldValidatorsService.maxAmount(
        this.totalAmountDue,
        this.amountLabel,
        this.currencyCode
      )
    ];
    return validators;
  }

  createPayerBankValidators() {
    const validators = [
      this.fieldValidatorsService.bankNameField(this.cardBankLabel)
    ];
    if (this.config.isBankMandatory) {
      validators.push(
        this.fieldValidatorsService.requiredField(this.cardBankLabel)
      );
    }
    return validators;
  }

  createCardTypeValidators() {
    const validators = [];
    if (this.config.isCardTypeMandatory) {
      validators.push(
        this.fieldValidatorsService.requiredField(this.cardTypeLabel)
      );
    }
    return validators;
  }

  ngOnInit() {
    this.createPayeeBankOptions();

    this.cardForm = new FormGroup({
      amount: new FormControl(null, this.createAmountValidators()),
      payeeBankName: new FormControl(
        null,
        this.fieldValidatorsService.requiredField(this.edcBankLabel)
      ),
      payerBankName: new FormControl(null, this.createPayerBankValidators()),
      cardType: new FormControl(null, this.createCardTypeValidators())
    });

    this.filteredPayerbanksOptions = this.cardForm
      .get('payerBankName')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filteredPayerbanks(value))
      );

    this.checkForm();
  }

  addPayment() {
    if (
      this.cardForm.enabled &&
      this.cardForm.valid &&
      !!this.cardForm.get('amount').value
    ) {
      this.add.emit(
        new CardPayment(this.paymentGroup, {
          amount: this.cardForm.get('amount').value,
          instrumentDate: this.businessDate,
          instrumentType: this.cardForm.get('cardType').value,
          bankName: this.cardForm.get('payeeBankName').value,
          reference1: this.cardForm.get('payerBankName').value
        })
      );
    } else {
      this.cardForm.markAllAsTouched();
    }
  }

  reset() {
    this.cardForm.reset();
  }

  private filteredPayerbanks(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.config.payerBanks.filter(
      bank => bank.toLowerCase().indexOf(filterValue) === 0
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
