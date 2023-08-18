import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-stock-receive-history-popup',
  templateUrl: './stock-receive-history-popup.component.html',
  styleUrls: ['./stock-receive-history-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReceiveHistoryPopupComponent implements OnInit, OnDestroy {
  isL1L2Store: boolean;
  isL3Store: boolean;
  currentDate = moment();
  fiscalYear: number;
  private destroy$ = new Subject();
  currentYear = moment().year();
  currentMonth = moment().month();
  stnNoTranLabel: string;
  invoiceTranLabel: string;
  docNoTranLabel: string;
  fiscalTranYearLabel: string;
  sourceLocationTranLabel: string;

  historyFilter: FormGroup;
  currentFiscalYear: number;
  constructor(
    public dialogRef: MatDialogRef<StockReceiveHistoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.stockReceive.stnNoLable',
        'pw.stockReceive.invoiceNoLable',
        'pw.stockReceive.docNo',
        'pw.stockReceive.fiscalYearLabel',
        'pw.stockReceive.sourceLocationCodeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.stnNoTranLabel = translatedMsg['pw.stockReceive.stnNoLable'];
        this.invoiceTranLabel = translatedMsg['pw.stockReceive.invoiceNoLable'];
        this.docNoTranLabel = translatedMsg['pw.stockReceive.docNo'];
        this.fiscalTranYearLabel =
          translatedMsg['pw.stockReceive.fiscalYearLabel'];
        this.sourceLocationTranLabel =
          translatedMsg['pw.stockReceive.sourceLocationCodeLabel'];
      });
    this.currentDate = moment(this.data.bussinessDay);
    this.isL1L2Store = this.data.isL1L2Store;
    this.isL3Store = this.data.isL3Store;
    this.currentFiscalYear = this.data.currentFiscalYear;
    this.historyFilter = new FormGroup({
      rangeFormGroup: new FormGroup({
        docFromDate: new FormControl(moment(data.advancedFilter.docFromDate)),
        docToDate: new FormControl(moment(data.advancedFilter.docToDate))
      }),
      stnNumber: new FormControl(
        data ? data.advancedFilter.stnNumber : '',
        this.fieldValidatorsService.requestNumberField(
          this.isL1L2Store ? this.stnNoTranLabel : this.invoiceTranLabel
        )
      ),
      docNo: new FormControl(
        data.advancedFilter.docNumber,
        this.fieldValidatorsService.requestNumberField(this.docNoTranLabel)
      ),
      fiscalYear: new FormControl(
        data ? data.advancedFilter.fiscalYear : null
        // [
        //   this.fieldValidatorsService.fiscalYearField(this.fiscalTranYearLabel),
        //   this.fieldValidatorsService.max(
        //     this.currentFiscalYear,
        //     this.fiscalTranYearLabel
        //   )
        // ]
      ),
      sourceLocationCode: new FormControl(
        data ? data.advancedFilter.sourceLocationCode : '',
        [
          this.fieldValidatorsService.locationCodeField(
            this.sourceLocationTranLabel
          )
        ]
      )
    });
  }

  ngOnInit() {
    const docNo = this.historyFilter.get('docNo').value;
    if (docNo !== null) {
      const fisCalYearCtrl2 = this.historyFilter.get('fiscalYear');
      fisCalYearCtrl2.setValidators([
        this.fieldValidatorsService.requiredField(this.fiscalTranYearLabel),
        this.fieldValidatorsService.fiscalYearField(this.fiscalTranYearLabel),
        this.fieldValidatorsService.max(
          this.currentFiscalYear,
          this.fiscalTranYearLabel
        )
      ]);
    }

    const fiscalYearCtrl = this.historyFilter.get('fiscalYear');

    this.historyFilter.get('docNo').valueChanges.subscribe(doc => {
      this.historyFilter.get('fiscalYear').markAsTouched();
      if (
        !(doc === '' || doc == null) &&
        this.historyFilter.get('docNo').errors === null
      ) {
        fiscalYearCtrl.setValidators([
          this.fieldValidatorsService.requiredField(this.fiscalTranYearLabel),
          this.fieldValidatorsService.fiscalYearField(this.fiscalTranYearLabel),
          this.fieldValidatorsService.max(
            this.currentFiscalYear,
            this.fiscalTranYearLabel
          )
        ]);
      } else {
        fiscalYearCtrl.setValidators([
          this.fieldValidatorsService.fiscalYearField(this.fiscalTranYearLabel),
          this.fieldValidatorsService.max(
            this.currentFiscalYear,
            this.fiscalTranYearLabel
          )
        ]);
      }
      fiscalYearCtrl.updateValueAndValidity();
    });

    this.historyFilter.get('fiscalYear').valueChanges.subscribe(value => {
      this.fiscalYear = this.historyFilter.get('fiscalYear').value;
      if (
        !(value === '' || value == null) &&
        this.historyFilter.get('fiscalYear').errors === null
      ) {
        const fromDate = moment(this.fiscalYear + '-04' + '-01').startOf('day');

        const toDate = moment(++this.fiscalYear + '-03' + '-31').endOf('day');
        this.historyFilter.patchValue({
          rangeFormGroup: {
            docFromDate: fromDate,
            docToDate: toDate > this.currentDate ? this.currentDate : toDate
          }
        });
      } else {
        this.historyFilter.patchValue({
          rangeFormGroup: {
            docFromDate: this.currentDate,
            docToDate: this.currentDate
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
      stnNumber: this.historyFilter.get('stnNumber').value
        ? this.historyFilter.get('stnNumber').value
        : null,
      fiscalYear: this.historyFilter.get('fiscalYear').value
        ? this.historyFilter.get('fiscalYear').value
        : null,
      sourceLocationCode: this.historyFilter.get('sourceLocationCode').value
        ? this.historyFilter.get('sourceLocationCode').value
        : null,
      docNumber: this.historyFilter.get('docNo').value
        ? this.historyFilter.get('docNo').value
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
        stnNumber: null,
        docNo: null,
        fiscalYear: null,
        sourceLocationCode: null
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
