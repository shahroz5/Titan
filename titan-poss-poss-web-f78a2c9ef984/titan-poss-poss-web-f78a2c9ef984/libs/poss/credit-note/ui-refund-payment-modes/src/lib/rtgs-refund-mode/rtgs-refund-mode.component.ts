import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-rtgs-refund-mode',
  templateUrl: './rtgs-refund-mode.component.html',
  styleUrls: []
})
export class RtgsRefundModeComponent implements OnInit, OnDestroy {
  @Input() selectedRefundModeDetails: FormArray;

  rtgsDetailsFormGroup: FormGroup;
  accountHoldersNameLabel: string;
  bankNameLabel: string;
  accountNumberLabel: string;
  branchLabel: string;
  ifscCodeLabel: string;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.creditNote.accountHoldersName',
        'pw.creditNote.bankName',
        'pw.creditNote.accountNumber',
        'pw.creditNote.branch',
        'pw.creditNote.ifscCode'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.accountHoldersNameLabel =
          translatedMsg['pw.creditNote.accountHoldersName'];
        this.bankNameLabel = translatedMsg['pw.creditNote.bankName'];
        this.accountNumberLabel = translatedMsg['pw.creditNote.accountNumber'];
        this.branchLabel = translatedMsg['pw.creditNote.branch'];
        this.ifscCodeLabel = translatedMsg['pw.creditNote.ifscCode'];
      });
  }

  ngOnInit(): void {
    this.rtgsDetailsFormGroup = this.createForm();
    this.selectedRefundModeDetails.push(this.rtgsDetailsFormGroup);
  }

  createForm(): FormGroup {
    return new FormGroup({
      accountHoldersName: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.accountHoldersNameLabel),
        this.fieldValidatorsService.customerNameField(
          this.accountHoldersNameLabel
        )
      ]),
      bankName: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.bankNameLabel),
        this.fieldValidatorsService.bankNameField(this.bankNameLabel)
      ]),
      accountNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.accountNumberLabel),
        this.fieldValidatorsService.numbersField(this.accountNumberLabel)
      ]),
      branch: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.branchLabel)
      ]),
      ifscCode: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.ifscCodeLabel),
        this.fieldValidatorsService.ifscCodeField(this.ifscCodeLabel)
      ])
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
