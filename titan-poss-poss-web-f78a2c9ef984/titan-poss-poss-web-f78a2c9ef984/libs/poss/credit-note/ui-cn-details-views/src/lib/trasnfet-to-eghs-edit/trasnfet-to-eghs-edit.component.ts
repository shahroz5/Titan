import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CNSearchEnum, CreditNoteDetails } from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';

@Component({
  selector: 'poss-web-trasnfet-to-eghs-edit',
  templateUrl: './trasnfet-to-eghs-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrasnfetToEghsEditComponent implements OnInit, OnDestroy {
  @Input() creditNoteDetails: CreditNoteDetails;
  @Output() transferAmount = new EventEmitter<number>();
  @Output() accountNumber = new EventEmitter<number>();
  @Output() isAccountNumReq = new EventEmitter<boolean>();

  CNSearchEnumRef = CNSearchEnum;
  statusColor: string;
  destroy$ = new Subject<null>();
  transferFormGroup: FormGroup;
  hidden = true;
  trasnferAmountTranLabel: string;
  accountNumberTranLabel: string;
  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private currencyFormatterService: CurrencyFormatterService
  ) {
    this.translate
      .get([
        'pw.creditNote.amountTransferLabel',
        'pw.creditNote.accountNumberLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.trasnferAmountTranLabel =
          translatedMsg['pw.creditNote.amountTransferLabel'];
        this.accountNumberTranLabel =
          translatedMsg['pw.creditNote.accountNumberLabel'];
      });
  }

  ngOnInit(): void {
    this.createForm();
    this.transferFormGroup
      .get('transferAmount')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((transferAmount: number) => {
        if (transferAmount) {
          this.transferAmount.emit(transferAmount);
        }
      });
    this.transferFormGroup
      .get('accountNumber')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((accountNumber: number) => {
        if (accountNumber) {
          if (!this.hidden) {
            this.accountNumber.emit(accountNumber);
            this.isAccountNumReq.emit(true);
          }
          else {
            this.accountNumber.emit(null);
            this.isAccountNumReq.emit(false);
          }
        }
      });
  }
  createForm() {
    this.transferFormGroup = new FormGroup({
      transferAmount: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.trasnferAmountTranLabel),
        this.fieldValidatorsService.amountField(this.trasnferAmountTranLabel),
        this.fieldValidatorsService.max(
          Number(this.creditNoteDetails.amount),
          this.trasnferAmountTranLabel
        ),
        this.fieldValidatorsService.max(
          Number(this.creditNoteDetails.maxGhsAmount),
          this.trasnferAmountTranLabel
        ),
        this.fieldValidatorsService.min(1, this.trasnferAmountTranLabel)
      ]),
      accountNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.accountNumberTranLabel),
        this.fieldValidatorsService.numbersField(this.accountNumberTranLabel),
        this.fieldValidatorsService.maxLength(20, this.accountNumberTranLabel)
      ])
    });
    this.transferFormGroup.get('transferAmount').markAllAsTouched();
    this.transferFormGroup.get('accountNumber').markAllAsTouched();
    if (this.creditNoteDetails.isPaymentForEGHS) {
      this.transferFormGroup.get('transferAmount').setValue(this.creditNoteDetails.maxGhsAmount);
      this.transferFormGroup.get('transferAmount').disable();
      this.transferAmount.emit(+this.creditNoteDetails.maxGhsAmount);
    }
  }

  getStatusColor(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }
  change($event) {
    if ($event.value === 'Yes') {
      this.hidden = false;
      this.isAccountNumReq.emit(true);
    } else {
      this.hidden = true;
      this.accountNumber.emit(null);
      this.isAccountNumReq.emit(false);
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
