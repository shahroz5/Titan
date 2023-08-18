import {
  Component,
  Inject,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { TranslateService } from '@ngx-translate/core';
import { StockIssueAPIRequestTypesEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-history-advanced-search-popup',
  templateUrl: './history-advanced-search-popup.component.html',
  styleUrls: ['./history-advanced-search-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryAdvancedSearchPopupComponent implements OnInit, OnDestroy {
  currentDate = moment();
  currentYear = moment().year();
  currentMonth = moment().month();

  historyFilter: FormGroup;

  statusesList: string[] = ['ISSUED', 'CANCELLED'];
  status: string;
  requestType: StockIssueAPIRequestTypesEnum;
  stockIssueAPIRequestTypesEnumRef = StockIssueAPIRequestTypesEnum;

  private destroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<HistoryAdvancedSearchPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fieldValidatorService: FieldValidatorsService,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.requestType = data.requestType;
    this.historyFilter = new FormGroup({
      docFromDate: new FormControl(
        data ? moment(data.formData.docFromDate) : this.currentDate
      ),
      docToDate: new FormControl(
        data ? moment(data.formData.docToDate) : this.currentDate
      ),

      docNo: new FormControl(data ? data.formData.docNo : '', [
        this.fieldValidatorService.requestNumberField('Doc No.'),
        this.fieldValidatorService.maxLength(10, 'Doc No.')
      ]),
      fiscalYear: new FormControl(data ? data.formData.fiscalYear : '', [

      ]),
      locationCode: new FormControl(data ? data.formData.locationCode : '', [
        this.fieldValidatorService.locationCodeField('Location Code')
      ]),
      statuses: new FormControl(
        data.formData.statuses ? data.formData.statuses : []
      )
    });
  }
  ngOnInit() {
    const fiscalYearCtrl = this.historyFilter.get('fiscalYear');
    this.historyFilter.get('docNo').valueChanges.subscribe(docNo => {
      this.historyFilter.get('fiscalYear').markAsTouched();
      if (
        !(docNo === '' || docNo == null) &&
        this.historyFilter.get('docNo').errors === null
      ) {
        // fiscalYearCtrl.setValidators([
        //   this.fieldValidatorService.requiredField('Fiscal Year'),
        //   this.fieldValidatorService.numbersField('Fiscal Year'),
        //   this.fieldValidatorService.maxLength(4, 'Fiscal Year'),
        //   this.fieldValidatorService.minLength(4, 'Fiscal Year'),
        //   this.fieldValidatorService.max(
        //     Number(this.currentMonth) >= 3
        //       ? this.currentYear
        //       : this.currentYear - 1,
        //     'Fiscal Year'
        //   )
        // ]);
      } else {
        // fiscalYearCtrl.setValidators([
        //   this.fieldValidatorService.numbersField('Fiscal Year'),
        //   this.fieldValidatorService.maxLength(4, 'Fiscal Year'),
        //   this.fieldValidatorService.minLength(4, 'Fiscal Year'),
        //   this.fieldValidatorService.max(
        //     Number(this.currentMonth) >= 3
        //       ? this.currentYear
        //       : this.currentYear - 1,
        //     'Fiscal Year'
        //   )
        // ]);
      }
      fiscalYearCtrl.updateValueAndValidity();
    });
    this.historyFilter.get('fiscalYear').valueChanges.subscribe(value => {
      if (
        !(value === '' || value == null) &&
        this.historyFilter.get('fiscalYear').errors === null
      ) {
        const fromDate = moment(
          '01-04-' + this.historyFilter.get('fiscalYear').value,
          'DD-MM-YYYY'
        ).startOf('day');

        const toDate = moment(
          '31-03-' + (Number(this.historyFilter.get('fiscalYear').value) + 1),
          'DD-MM-YYYY'
        ).endOf('day');
        this.historyFilter.patchValue({
          docFromDate: fromDate,
          docToDate: toDate > this.currentDate ? this.currentDate : toDate
        });
      } else {
        this.historyFilter.patchValue({
          docFromDate: this.currentDate,
          docToDate: this.currentDate
        });
      }
    });

    this.historyFilter
      .get('docFromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.historyFilter.get('docToDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }
  apply() {
    this.dialogRef.close({
      docFromDate: moment(this.historyFilter.get('docFromDate').value)
        .startOf('day')
        .valueOf(),
      docToDate: moment(this.historyFilter.get('docToDate').value)
        .endOf('day')
        .valueOf(),
      docNo: this.historyFilter.get('docNo').value,
      fiscalYear:
        this.historyFilter.get('fiscalYear').value !== ''
          ? this.historyFilter.get('fiscalYear').value
          : null,
      locationCode:
        this.historyFilter.get('locationCode').value !== ''
          ? this.historyFilter.get('locationCode').value
          : null,
      statuses: this.historyFilter.get('statuses').value
    });
  }

  clear() {

    this.historyFilter.patchValue(
      {
        docFromDate: null,
        docToDate: null,
        docNo: null,
        fiscalYear: null,
        locationCode: null,
        statuses: []
      },
      { emitEvent: false }
    );
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * gets the status of the request and determines the status description
   * @param status : status of the request
   */
  getStatus(status: string) {
    let key = {
      status: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
      });
    return this.status;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
