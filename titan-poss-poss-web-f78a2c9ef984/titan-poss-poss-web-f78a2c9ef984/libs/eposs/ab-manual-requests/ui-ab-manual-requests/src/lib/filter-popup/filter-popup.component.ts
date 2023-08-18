import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss']
})
export class FilterPopupComponent implements OnInit, OnDestroy {
  historyFilterForm: FormGroup;

  destroy$: Subject<null> = new Subject<null>();
  interBoutiqueTransferRequestType: any;
  selectall: boolean;
  year: number;
  currentDate = moment();
  currentYear = moment().year();
  historyFilterStartDate: any;
  historyFilterEndDate: any;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.historyFilterForm = new FormGroup({
      rangeFormGroup: new FormGroup({
        fromDate: new FormControl(moment(data.formData.startDate)),
        toDate: new FormControl(moment(data.formData.endDate))
      }),
      reqFiscalYear: new FormControl(
        data.formData.reqFiscalYear ? data.formData.reqFiscalYear : '',

        [
          this.fieldValidatorsService.fiscalYearField('Fiscal Year'),
          this.fieldValidatorsService.max(
            Number(data?.currentFiscalYear),
            'Fiscal Year'
          )
        ]
      ),

      location: new FormControl(
        data.formData.location ? data.formData.location : '',
        [this.fieldValidatorsService.alphabetsField('Location')]
      )
    });
  }

  setValidation() {
    const fisCalYearCtrl = this.historyFilterForm.get('reqFiscalYear');
  }
  ngOnInit() {
    this.setValidation();
    this.historyFilterForm
      .get('reqFiscalYear')
      .valueChanges.subscribe(fyear => {
        if (
          !(fyear === '' || fyear == null) &&
          this.historyFilterForm.get('reqFiscalYear').errors === null
        ) {
          const fromDate = moment(
            this.historyFilterForm.get('reqFiscalYear').value + '-04' + '-01'
          ).startOf('day');

          this.year = this.historyFilterForm.get('reqFiscalYear').value;
          ++this.year;
          const toDate = moment(this.year + '-03' + '-31').endOf('day');
          this.historyFilterForm.patchValue({
            rangeFormGroup: {
              fromDate: fromDate,
              toDate: toDate > this.currentDate ? this.currentDate : toDate
            }
          });
          console.log(fromDate, toDate);
        } else {
          this.historyFilterForm.patchValue({
            rangeFormGroup: {
              fromDate: this.currentDate,
              toDate: this.currentDate
            }
          });
        }
      });

    this.historyFilterForm
      .get('rangeFormGroup')
      .get('fromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        const endDate = this.historyFilterForm
          .get('rangeFormGroup')
          .get('toDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(date, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }

  apply() {
    this.dialogRef.close({
      reqFiscalYear: this.historyFilterForm.get('reqFiscalYear').value,
      location: this.historyFilterForm.get('location').value,

      startDate: moment(
        this.historyFilterForm.get('rangeFormGroup').get('fromDate').value
      ).startOf('day'),
      endDate: moment(
        this.historyFilterForm.get('rangeFormGroup').get('toDate').value
      ).endOf('day')
    });
  }
  clear() {
    this.historyFilterForm.patchValue({
      reqFiscalYear: null,
      location: '',
      rangeFormGroup: {
        fromDate: null,
        toDate: null
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
