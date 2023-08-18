import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/Operators';
import { Subject } from 'rxjs';
import { TEPExceptionTypeEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-exception-popup',
  templateUrl: './tep-exception-popup.component.html',
  styleUrls: ['./tep-exception-popup.component.scss']
})
export class TepExceptionPopupComponent implements OnInit {
  submit = new EventEmitter();
  tepExceptionFormGroup: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  deductionPercentageageLabel: string;
  flatTepExhangeValueLabel: string;
  variantCodeLabel: string;
  approvedByLabel: string;
  valueForLabel: string;
  tepExceptionDetails: any;
  variantCode: string;
  maxFlatTepException: number;
  constructor(
    public dialogRef: MatDialogRef<TepExceptionPopupComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.variantCode = data.variantCode;
    this.maxFlatTepException = data.maxFlatTepException;
    this.translate
      .get([
        'pw.tepExceptionConfig.deductionPercentageage',
        'pw.tepExceptionConfig.flatTepExhangeValue',
        'pw.tepExceptionConfig.variantCode',
        'pw.tepExceptionConfig.approvedBy',
        'pw.tepExceptionConfig.valueFor'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.deductionPercentageageLabel =
          translatedMessages['pw.tepExceptionConfig.deductionPercentageage'];
        this.flatTepExhangeValueLabel =
          translatedMessages['pw.tepExceptionConfig.flatTepExhangeValue'];
        this.variantCodeLabel =
          translatedMessages['pw.tepExceptionConfig.variantCode'];
        this.approvedByLabel =
          translatedMessages['pw.tepExceptionConfig.approvedBy'];
        this.valueForLabel =
          translatedMessages['pw.tepExceptionConfig.valueFor'];
      });
  }

  ngOnInit(): void {
    this.tepExceptionFormGroup = new FormGroup({
      deductionPercentage: new FormControl('', [
        this.fieldValidatorsService.min(0, this.deductionPercentageageLabel),
        this.fieldValidatorsService.max(100, this.deductionPercentageageLabel),
        this.fieldValidatorsService.percentageField(
          this.deductionPercentageageLabel
        )
      ]),
      exceptionTypeRadioGroup: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.valueForLabel)
      ]),
      flatTepExchangeAmount: new FormControl('', [
        this.fieldValidatorsService.min(0, this.flatTepExhangeValueLabel),
        this.fieldValidatorsService.max(
          this.maxFlatTepException,
          this.flatTepExhangeValueLabel
        ),
        this.fieldValidatorsService.amountField(this.flatTepExhangeValueLabel)
      ]),
      approvedBy: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.approvedByLabel),
        this.fieldValidatorsService.nameWithSpaceField(this.approvedByLabel)
      ])
    });
    this.tepExceptionFormGroup
      .get('exceptionTypeRadioGroup')
      .valueChanges.subscribe(val => {
        if (val === '') {
          this.tepExceptionFormGroup.get('deductionPercentage').disable();
          this.tepExceptionFormGroup.get('flatTepExchangeAmount').disable();
        } else if (val === TEPExceptionTypeEnum.DEDUCTIONPERCENTAGE) {
          this.tepExceptionFormGroup.get('flatTepExchangeAmount').setValue('0');
          this.tepExceptionFormGroup.get('flatTepExchangeAmount').disable();
          this.tepExceptionFormGroup.get('deductionPercentage').enable();
        } else {
          this.tepExceptionFormGroup.get('deductionPercentage').setValue('0');
          this.tepExceptionFormGroup.get('deductionPercentage').disable();
          this.tepExceptionFormGroup.get('flatTepExchangeAmount').enable();
        }
      });
  }

  onClose() {
    this.dialogRef.close(false);
  }

  save() {
    this.submit.emit({
      deductionPercent: this.tepExceptionFormGroup.get('deductionPercentage')
        .value,
      flatTepExchangeAmount: this.tepExceptionFormGroup.get(
        'flatTepExchangeAmount'
      ).value,
      approvedBy: this.tepExceptionFormGroup.get('approvedBy').value,
      variantCode: this.variantCode
    });
  }
}
