import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-location-date-range',
  templateUrl: './location-date-range.component.html',
  styleUrls: ['./location-date-range.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationDateRangeComponent implements OnInit, OnDestroy {
  utcOffset = moment().startOf('day').utcOffset();
  form: FormGroup;
  currentDate = moment();
  offerStartDateLabel: string;
  offerEndDateLabel: string;
  destroy$ = new Subject();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<LocationDateRangeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.translateService
      .get([
        'pw.discountLocationMapping.offerStartDateLabel',
        'pw.discountLocationMapping.offerEndDateLabel',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.offerStartDateLabel =
          translatedLabels['pw.discountLocationMapping.offerStartDateLabel'];
        this.offerEndDateLabel =
          translatedLabels['pw.discountLocationMapping.offerEndDateLabel'];
      });
  }

  ngOnInit(): void {
    console.log(this.data.dateRange);

    this.form = new FormGroup({
      offerStartDate: new FormControl(
        moment(
          this.data?.dateRange ? this.data?.dateRange.offerStartDate : ''
        ).startOf('day'),
        [this.fieldValidatorsService.requiredField(this.offerStartDateLabel)]
      ),
      offerEndDate: new FormControl(
        moment(
          this.data?.dateRange ? this.data?.dateRange.offerEndDate : ''
        ).startOf('day'),
        this.fieldValidatorsService.requiredField(this.offerEndDateLabel)
      ),
    });
    this.form
      .get('offerStartDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.form.get('offerEndDate');
        const previousDate = moment(this.currentDate).subtract(1, 'days');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate'),
          this.fieldValidatorsService.requiredField(this.offerEndDateLabel),
          this.fieldValidatorsService.minDate(previousDate, 'EndDate'),
        ]);
        endDate.updateValueAndValidity();
      });
  }
  clear() {
    this.form.reset();
  }
  apply() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
