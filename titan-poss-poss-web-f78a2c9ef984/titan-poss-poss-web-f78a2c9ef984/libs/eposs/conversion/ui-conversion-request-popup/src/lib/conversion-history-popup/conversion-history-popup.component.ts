import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { InStockConversionTypesEnum } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-conversion-history-popup',
  templateUrl: './conversion-history-popup.component.html',
  styleUrls: ['./conversion-history-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversionHistoryPopupComponent implements OnInit, OnDestroy {
  currentDate = moment();
  statusesList: { id: string; value: string }[] = [
    { id: 'CLOSED', value: 'CLOSED' },
    { id: 'APVL_REJECTED', value: 'APPROVAL_REJECTED' }
  ];

  destroy$: Subject<null> = new Subject<null>();
  historyFilter: FormGroup;
  status: string;
  currentYear = moment().year();
  currentMonth = moment().month();
  fiscalYear: number;
  inStockConversionTypesEnumRef = InStockConversionTypesEnum;

  constructor(
    public dialogRef: MatDialogRef<ConversionHistoryPopupComponent>,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.historyFilter = new FormGroup({
      rangeFormGroup: new FormGroup({
        requestFromDate: new FormControl(
          moment(data.advancedFilter.requestFromDate)
        ),
        requestToDate: new FormControl(
          moment(data.advancedFilter.requestToDate)
        )
      }),

      fiscalYear: new FormControl(data ? data.advancedFilter.fiscalYear : null),
      docNo: new FormControl(
        data ? data.advancedFilter.docNo : null,
        this.fieldValidatorsService.requestNumberField('Doc No')
      ),
      statuses: new FormControl(data ? data.advancedFilter.statuses : [])
    });
  }

  ngOnInit() {
    this.historyFilter
      .get('rangeFormGroup')
      .get('requestFromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.historyFilter
          .get('rangeFormGroup')
          .get('requestToDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });

    const fiscalYearCtrl = this.historyFilter.get('fiscalYear');

    this.historyFilter.get('docNo').valueChanges.subscribe(doc => {
      this.historyFilter.get('fiscalYear').markAsTouched();

      fiscalYearCtrl.updateValueAndValidity();
    });
    this.historyFilter.get('fiscalYear').valueChanges.subscribe(value => {
      if (
        !(value === '' || value == null) &&
        this.historyFilter.get('fiscalYear').errors === null
      ) {
        this.fiscalYear = this.historyFilter.get('fiscalYear').value;
        const fromDate = moment(
          this.historyFilter.get('fiscalYear').value + '-04' + '-01'
        ).startOf('day');

        const toDate = moment(++this.fiscalYear + '-03' + '-31').endOf('day');
        this.historyFilter.patchValue({
          rangeFormGroup: {
            requestFromDate: fromDate,
            requestToDate: toDate > this.currentDate ? this.currentDate : toDate
          }
        });
      } else {
        this.historyFilter.patchValue({
          rangeFormGroup: {
            requestFromDate: this.currentDate,
            requestToDate: this.currentDate
          }
        });
      }
    });
  }

  apply() {
    this.dialogRef.close({
      requestFromDate: moment(
        this.historyFilter.get('rangeFormGroup').get('requestFromDate').value
      )
        .startOf('day')
        .valueOf(),
      requestToDate: moment(
        this.historyFilter.get('rangeFormGroup').get('requestToDate').value
      )
        .endOf('day')
        .valueOf(),

      fiscalYear: this.historyFilter.get('fiscalYear').value
        ? this.historyFilter.get('fiscalYear').value
        : null,
      docNo: this.historyFilter.get('docNo').value
        ? this.historyFilter.get('docNo').value
        : null,
      statuses: this.historyFilter.get('statuses').value
        ? this.historyFilter.get('statuses').value
        : []
    });
  }

  clear() {
    this.historyFilter.get('fiscalYear').setValidators([]);
    this.historyFilter.patchValue(
      {
        rangeFormGroup: {
          requestFromDate: null,
          requestToDate: null
        },

        fiscalYear: null,
        statuses: [],
        docNo: null
      },
      { emitEvent: false }
    );
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
