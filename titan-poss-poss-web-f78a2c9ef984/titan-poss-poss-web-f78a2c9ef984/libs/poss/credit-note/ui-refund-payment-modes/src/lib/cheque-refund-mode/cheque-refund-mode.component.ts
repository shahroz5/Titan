import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CnRefundAmountDetails } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cheque-refund-mode',
  templateUrl: './cheque-refund-mode.component.html',
  styleUrls: []
})
export class ChequeRefundModeComponent implements OnInit, OnDestroy {
  @Input() selectedRefundModeDetails: FormArray;
  @Input() refundDetails: CnRefundAmountDetails;

  chequeDetailsFormGroup: FormGroup;
  nameAsPerBankRecordLabel: string;
  chequeNoLabel: string;
  payeeNameLabel: string;
  bankNameLabel: string;
  micrCodeLabel: string;
  customerBankAccountNameLabel: string;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.creditNote.nameAsPerBankRecord',
        'pw.creditNote.chequeNo',
        'pw.creditNote.payeeName',
        'pw.creditNote.bankName',
        'pw.creditNote.micrCode',
        'pw.creditNote.customerBankAccountNameLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.nameAsPerBankRecordLabel =
          translatedMsg['pw.creditNote.nameAsPerBankRecord'];
        this.chequeNoLabel = translatedMsg['pw.creditNote.chequeNo'];
        this.payeeNameLabel = translatedMsg['pw.creditNote.payeeName'];
        this.bankNameLabel = translatedMsg['pw.creditNote.bankName'];
        this.micrCodeLabel = translatedMsg['pw.creditNote.micrCode'];
        this.customerBankAccountNameLabel =
          translatedMsg['pw.creditNote.customerBankAccountNameLabel'];
      });
  }

  ngOnInit(): void {
    this.chequeDetailsFormGroup = this.createForm();
    this.selectedRefundModeDetails.push(this.chequeDetailsFormGroup);
  }

  createForm(): FormGroup {
    return new FormGroup({
      // nameAsPerBankRecord: new FormControl('', [
      //   this.fieldValidatorsService.requiredField(
      //     this.nameAsPerBankRecordLabel
      //   ),
      //   this.fieldValidatorsService.alphabetWithSpaceField(
      //     this.nameAsPerBankRecordLabel
      //   )
      // ]),
      // chequeNumber: new FormControl('', [
      //   this.fieldValidatorsService.requiredField(this.chequeNoLabel),
      //   this.fieldValidatorsService.chequeDDNoField(this.chequeNoLabel)
      // ]),
      // payeeName: new FormControl('', [
      //   this.fieldValidatorsService.requiredField(this.payeeNameLabel),
      //   this.fieldValidatorsService.customerNameField(this.payeeNameLabel)
      // ]),
      bankName: new FormControl('', [
        this.fieldValidatorsService.requiredField(
          this.customerBankAccountNameLabel
        ),
        this.fieldValidatorsService.customerNameField(
          this.customerBankAccountNameLabel
        ),
        this.fieldValidatorsService.maxLength(
          50,
          this.customerBankAccountNameLabel
        )
      ])
      // micrCode: new FormControl('', [
      //   this.fieldValidatorsService.requiredField(this.micrCodeLabel)
      // ])
    });
  }
  ngOnDestroy() {
    while (this.selectedRefundModeDetails.length !== 0) {
      this.selectedRefundModeDetails.clear();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
