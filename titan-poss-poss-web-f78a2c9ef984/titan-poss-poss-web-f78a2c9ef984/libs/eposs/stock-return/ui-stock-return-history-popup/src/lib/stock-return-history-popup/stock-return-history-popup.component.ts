import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-stock-return-history-popup',
  templateUrl: './stock-return-history-popup.component.html',
  styleUrls: ['./stock-return-history-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReturnHistoryPopupComponent implements OnInit, OnDestroy {

  fiscalYear: number;
  currentYear = moment().year();

  private destroy$ = new Subject();
  currentMonth = moment().month();

  historyFilter: FormGroup;
  invoiceNoTranLabel: string;
  fiscalYearTranLabel: string;
  currentFiscalYear: number;
  constructor(
    public dialogRef: MatDialogRef<StockReturnHistoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.stockIssue.invoiceLabel', 'pw.stockIssue.fiscalYearLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.invoiceNoTranLabel = translatedMsg['pw.stockIssue.invoiceLabel'];
        this.fiscalYearTranLabel =
          translatedMsg['pw.stockIssue.fiscalYearLabel'];
      });
    this.currentFiscalYear = data.currentFiscalYear;
    this.historyFilter = new FormGroup({
      rangeFormGroup: new FormGroup({
        docFromDate: new FormControl(moment(data.advanceFilter.docFromDate)),
        docToDate: new FormControl(moment(data.advanceFilter.docToDate))
      }),

      invoiceNumber: new FormControl(
        data.advanceFilter.invoiceNumber,
        this.fieldValidatorsService.requestNumberField(this.invoiceNoTranLabel)
      ),
      fiscalYear: new FormControl(data ? data.advanceFilter.fiscalYear : null, [
        this.fieldValidatorsService.fiscalYearField(this.fiscalYearTranLabel),
        this.fieldValidatorsService.max(
          this.currentFiscalYear,
          this.fiscalYearTranLabel
        )
      ])
    });
  }

  ngOnInit() {
    const invoiceNumber = this.historyFilter.get('invoiceNumber').value;
    if (invoiceNumber !== null) {
      const fisCalYearCtrl2 = this.historyFilter.get('fiscalYear');
      fisCalYearCtrl2.setValidators([
        this.fieldValidatorsService.requiredField(this.fiscalYearTranLabel),
        this.fieldValidatorsService.fiscalYearField(this.fiscalYearTranLabel),
        this.fieldValidatorsService.max(
          this.currentFiscalYear,
          this.fiscalYearTranLabel
        )
      ]);
    }
    const fiscalYearCtrl = this.historyFilter.get('fiscalYear');
    this.historyFilter
      .get('invoiceNumber')
      .valueChanges.subscribe(invoiceNum => {
        this.historyFilter.get('fiscalYear').markAsTouched();
        if (
          !(invoiceNum === '' || invoiceNum == null) &&
          this.historyFilter.get('invoiceNumber').errors === null
        ) {
          fiscalYearCtrl.setValidators([
            this.fieldValidatorsService.requiredField(this.fiscalYearTranLabel),
            this.fieldValidatorsService.fiscalYearField(
              this.fiscalYearTranLabel
            ),
            this.fieldValidatorsService.max(
              this.currentFiscalYear,
              this.fiscalYearTranLabel
            )
          ]);
        } else {
          fiscalYearCtrl.setValidators([
            this.fieldValidatorsService.fiscalYearField(
              this.fiscalYearTranLabel
            ),
            this.fieldValidatorsService.max(
              this.currentFiscalYear,
              this.fiscalYearTranLabel
            )
          ]);
        }
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
            docFromDate: fromDate,
            docToDate:
              toDate > this.data.bussinessDay ? this.data.bussinessDay : toDate
          }
        });
      } else {
        this.historyFilter.patchValue({
          rangeFormGroup: {
            docFromDate: this.data.bussinessDay,
            docToDate: this.data.bussinessDay
          }
        });
      }
    });

    this.historyFilter
      .get('rangeFormGroup')
      .get('docFromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.historyFilter
          .get('rangeFormGroup')
          .get('docToDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }

  apply() {
    this.dialogRef.close({
      docFromDate: moment(
        this.historyFilter.get('rangeFormGroup').get('docFromDate').value
      )
        .startOf('day')
        .valueOf(),
      docToDate: moment(
        this.historyFilter.get('rangeFormGroup').get('docToDate').value
      )
        .endOf('day')
        .valueOf(),
      invoiceNumber: this.historyFilter.get('invoiceNumber').value
        ? this.historyFilter.get('invoiceNumber').value
        : null,
      fiscalYear: this.historyFilter.get('fiscalYear').value
        ? this.historyFilter.get('fiscalYear').value
        : null
    });
  }

  clear() {
    this.historyFilter.get('fiscalYear').setValidators([]);
    this.historyFilter.patchValue(
      {
        rangeFormGroup: {
          docFromDate: null,
          docToDate: null
        },
        invoiceNumber: null,
        fiscalYear: null
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
