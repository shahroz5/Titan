import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { TranslateService } from '@ngx-translate/core';
import {
  BankDepositRequest,
  SharedBodEodFeatureServiceAbstraction
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-bank-deposit-filter',
  templateUrl: './bank-deposit-filter.component.html'
})
export class BankDepositFilterComponent implements OnInit {
  @Output() loadSelectedDateRange = new EventEmitter<BankDepositRequest>();
  @Output() getLocationCode = new EventEmitter();
  @ViewChild('fromInput', {
    read: MatInput
  })
  fromInput: MatInput;

  @ViewChild('toInput', {
    read: MatInput
  })
  toInput: MatInput;

  rangeFormGroup: FormGroup;
  locationCodeFormGroup: FormGroup;
  currentDate = moment();
  dateRangeRequest: BankDepositRequest;
  dateRangeLabel: string;
  destroy$: Subject<null> = new Subject<null>();
  isEmptyValue = null;
  bussinessDay: any;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bussinessDay = moment(data);
      });
    this.translate
      .get(['pw.viewBankDeposit.dateRangeLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.rangeFormGroup = new FormGroup({
          fromDate: new FormControl(
            '',
            this.fieldValidatorsService.requiredField(
              translatedMessages['pw.viewBankDeposit.dateRangeLabel']
            )
          ),
          toDate: new FormControl(
            '',
            this.fieldValidatorsService.requiredField(
              translatedMessages['pw.viewBankDeposit.dateRangeLabel']
            )
          )
        });
      });
  }

  ngOnInit(): void {
    this.rangeFormGroup
      .get('toDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(mode => {
        const fromDate = moment(this.rangeFormGroup.get('fromDate').value);
        const toDate = moment(this.rangeFormGroup.get('toDate').value);
        const differenceDays = toDate.diff(fromDate, 'days');
        if (differenceDays >= 90) {
          this.rangeFormGroup
            .get('fromDate')
            .setErrors({ valid: false, differenceValid: true });
          this.rangeFormGroup
            .get('toDate')
            .setErrors({ valid: false, differenceValid: true });
          this.rangeFormGroup.updateValueAndValidity();
        }
      });

    this.rangeFormGroup
      .get('fromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('date', data);
        const endDate = this.rangeFormGroup.get('toDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }

  cancel() {
    this.rangeFormGroup.reset();
    this.dateRangeRequest = null;
    this.loadSelectedDateRange.emit(this.dateRangeRequest);
  }

  search() {
    const formData = this.rangeFormGroup.getRawValue();
    this.dateRangeRequest = {
      fromDate: Number(formData.fromDate),
      toDate: Number(formData.toDate)
    };
    this.loadSelectedDateRange.emit(this.dateRangeRequest);
  }
}
