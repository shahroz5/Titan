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
  selector: 'poss-web-discount-date-range',
  templateUrl: './discount-date-range.component.html',
  styleUrls: ['./discount-date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountDateRangeComponent implements OnInit, OnDestroy {
  utcOffset = moment().startOf('day').utcOffset();
  form: FormGroup;
  currentDate = moment();
  offerStartDateLabel: string;
  offerEndDateLabel: string;
  previewStartDateLabel: string;
  previewEndDateLabel: string;
  destroy$ = new Subject();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<DiscountDateRangeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.translateService
      .get([
        'pw.discountLocationMapping.offerStartDateLabel',
        'pw.discountLocationMapping.offerEndDateLabel',
        'pw.discountLocationMapping.previewStartDateLabel',
        'pw.discountLocationMapping.previewEndDateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.offerStartDateLabel =
          translatedLabels['pw.discountLocationMapping.offerStartDateLabel'];
        this.offerEndDateLabel =
          translatedLabels['pw.discountLocationMapping.offerEndDateLabel'];
        this.previewStartDateLabel =
          translatedLabels['pw.discountLocationMapping.previewStartDateLabel'];
        this.previewEndDateLabel =
          translatedLabels['pw.discountLocationMapping.previewEndDateLabel'];
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
      previewStartDate: new FormControl(
        {
          value: moment(
            this.data?.dateRange ? this.data?.dateRange.previewStartDate : ''
          ).startOf('day'),
          disabled: true
        },
        this.fieldValidatorsService.requiredField(this.previewStartDateLabel)
      ),
      previewEndDate: new FormControl(
        {
          value: moment(
            this.data?.dateRange ? this.data?.dateRange.previewEndDate : ''
          ).startOf('day'),
          disabled: true
        },
        this.fieldValidatorsService.requiredField(this.previewEndDateLabel)
      )
    });
    const offerEndCtrl = this.form.get('offerEndDate');
    offerEndCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.form.get('previewStartDate').enable();
      this.form.get('previewEndDate').enable();
    });

    this.form
      .get('previewStartDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.form.get('previewEndDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate'),
          this.fieldValidatorsService.requiredField(this.previewEndDateLabel)
        ]);
        endDate.updateValueAndValidity();
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
          this.fieldValidatorsService.minDate(previousDate, 'EndDate')
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
