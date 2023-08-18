import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-razorpay-refund-mode',
  templateUrl: './razorpay-refund-mode.component.html',
  styleUrls: []
})
export class RazorpayRefundModeComponent implements OnInit, OnDestroy {

  @Input() selectedRefundModeDetails: FormArray;

  razorpayDetailsFormGroup: FormGroup;
  tanishqTransactionIdLabel: string;
  razorpayTransactionIdLabel: string;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.creditNote.tanishqTransactionId',
        'pw.creditNote.razorpayTransactionId'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.tanishqTransactionIdLabel =
          translatedMsg['pw.creditNote.tanishqTransactionId'];
        this.razorpayTransactionIdLabel =
          translatedMsg['pw.creditNote.razorpayTransactionId'];
      });
  }

  ngOnInit(): void {
    this.razorpayDetailsFormGroup = this.createForm();
    this.selectedRefundModeDetails.push(this.razorpayDetailsFormGroup);
  }

  createForm(): FormGroup {
    return new FormGroup({
      tanishqTransactionId: new FormControl('', [
        this.fieldValidatorsService.requiredField(
          this.tanishqTransactionIdLabel
        )
      ]),
      razorpayTransactionId: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.razorpayTransactionIdLabel)
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
