import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-airpay-refund-mode',
  templateUrl: './airpay-refund-mode.component.html',
  styleUrls: []
})
export class AirpayRefundModeComponent implements OnInit, OnDestroy {
  @Input() selectedRefundModeDetails: FormArray;

  airpayDetailsFormGroup: FormGroup;
  tanishqTransactionIdLabel: string;
  airpayTransactionIdLabel: string;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.creditNote.tanishqTransactionId',
        'pw.creditNote.airpayTransactionId'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.tanishqTransactionIdLabel =
          translatedMsg['pw.creditNote.tanishqTransactionId'];
        this.airpayTransactionIdLabel =
          translatedMsg['pw.creditNote.airpayTransactionId'];
      });
  }

  ngOnInit(): void {
    this.airpayDetailsFormGroup = this.createForm();
    this.selectedRefundModeDetails.push(this.airpayDetailsFormGroup);
  }

  createForm(): FormGroup {
    return new FormGroup({
      tanishqTransactionId: new FormControl('', [
        this.fieldValidatorsService.requiredField(
          this.tanishqTransactionIdLabel
        )
      ]),
      airpayTransactionId: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.airpayTransactionIdLabel)
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
