import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-date-range-form',
  templateUrl: './date-range-form.component.html'
})
export class DateRangeFormComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<DateRangeFormComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  form: FormGroup;
  currentDate = moment();
  startFromDateLabel: string;
  endsOnDateLabel: string;

  destroy$ = new Subject();

  ngOnInit(): void {
    this.translateService
      .get([
        'pw.locationMapping.offerStartDateLabel',
        'pw.locationMapping.offerEndDateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.startFromDateLabel =
          translatedLabels['pw.locationMapping.startFromDateLabel'];
        this.endsOnDateLabel =
          translatedLabels['pw.locationMapping.endsOnDateLabel'];
      });
    console.log('data', this.data);
    this.form = new FormGroup({
      startFromDate: new FormControl(
        this.data ? moment(this.data.startDate) : ''
      ),
      endsOnDate: new FormControl(this.data ? moment(this.data.endDate) : ''),
      status: new FormControl(true)
    });

    this.form
      .get('startFromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('date', data);
        const endDate = this.form.get('endsOnDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }
  apply() {
    this.dialogRef.close({
      data: {
        startFromDate: this.form.get('startFromDate').value
          ? this.form.get('startFromDate').value
          : null,
        endsOnDate: this.form.get('endsOnDate').value
          ? this.form.get('endsOnDate').value
          : null,
        status: this.form.get('status').value
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
  changeEvent(changeEvent) {
    this.form.get('status').patchValue(changeEvent.checked);
  }
}
