import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { CnRefundAmountDetails } from 'libs/shared/models/src/lib/credit-note/credit-note.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cc-refund-mode',
  templateUrl: './cc-refund-mode.component.html',
  styleUrls: []
})
export class CcRefundModeComponent implements OnInit, OnDestroy {
  @Input() selectedRefundModeDetails: FormArray;
  @Input() refundDetails: CnRefundAmountDetails;

  ccDetailsFormGroup: FormGroup;
  approvalCodeLabel: string;
  tidNumberLabel: string;
  acquiredBankLabel: string;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.creditNote.approvalCode',
        'pw.creditNote.tidNumber',
        'pw.creditNote.acquiredBank'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.approvalCodeLabel = translatedMsg['pw.creditNote.approvalCode'];
        this.tidNumberLabel = translatedMsg['pw.creditNote.tidNumber'];
        this.acquiredBankLabel = translatedMsg['pw.creditNote.acquiredBank'];
      });
  }

  ngOnInit(): void {
    this.ccDetailsFormGroup = this.createForm();
    this.selectedRefundModeDetails.push(this.ccDetailsFormGroup);
  }

  createForm(): FormGroup {
    return new FormGroup({
      approvalCode: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.approvalCodeLabel)
      ]),
      tidNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.tidNumberLabel)
      ]),
      acquiredBank: new FormControl(this.refundDetails?.acquiredBank)
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
