import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { InterBoutiqueTransferRequestTypesEnum } from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-history-advanced-search-popup',
  templateUrl: './history-advanced-search-popup.component.html',
  styleUrls: ['./history-advanced-search-popup.component.scss']
})
export class HistoryAdvancedSearchPopupComponent implements OnInit, OnDestroy {
  historyFilterForm: FormGroup;
  interBoutiqueTransferRequestTypesEnumRef = InterBoutiqueTransferRequestTypesEnum;
  radioType = InterBoutiqueTransferRequestTypesEnum.REQUESTDATE;
  historyfilterFormControl = new FormControl(
    InterBoutiqueTransferRequestTypesEnum.ACCEPTEDDATE
  );
  destroy$: Subject<null> = new Subject<null>();
  interBoutiqueTransferRequestType: any;
  selectall: boolean;
  currentDate = moment();
  currentYear = moment().year();
  currentMonth = moment().month();
  status: string;
  year: number;
  statusesList: string[] = [
    'ISSUED',
    'ACPT_REJECTED',
    'APVL_REJECTED',
    'EXPIRED',
    'CANCELLED',
    'ACCEPTED'
  ];
  docNoLabel: string;
  docNo: any;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get(['pw.interboutiqueTransfer.docNoLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.docNoLabel =
          translatedLabels['pw.interboutiqueTransfer.docNoLabel'];
      });
    this.historyFilterForm = new FormGroup({
      dateType: new FormControl(
        data.formData.dateType
          ? data.formData.dateType
          : InterBoutiqueTransferRequestTypesEnum.REQUESTDATE
      ),
      rangeFormGroup: new FormGroup({
        fromDate: new FormControl(moment(data.formData.startDate)),
        toDate: new FormControl(moment(data.formData.endDate))
      }),

      reqFiscalYear: new FormControl(
        data.formData.reqFiscalYear ? data.formData.reqFiscalYear : ''
      ),
      reqDocNo: new FormControl(data.formData.reqDocNo, [
        this.fieldValidatorsService.requestNumberField(this.docNoLabel)
      ]),

      locationCode: new FormControl(
        data.formData.locationCode ? data.formData.locationCode : null,
        this.fieldValidatorsService.locationCodeField('locationCode')
      ),
      statuses: new FormControl(
        data.formData.statuses ? data.formData.statuses : []
      ),
    });
    this.historyfilterFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        if (this.interBoutiqueTransferRequestType !== type) {
          this.interBoutiqueTransferRequestType =
            InterBoutiqueTransferRequestTypesEnum.HISTORY;
          if (type === InterBoutiqueTransferRequestTypesEnum.ACCEPTEDDATE) {
            this.radioType = InterBoutiqueTransferRequestTypesEnum.ACCEPTEDDATE;
          } else {
            this.radioType = InterBoutiqueTransferRequestTypesEnum.REQUESTDATE;
          }
        }
      });
  }

  ngOnInit() {
    this.historyFilterForm
      .get('dateType')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data === this.interBoutiqueTransferRequestTypesEnumRef.ACCEPTEDDATE) {
          this.radioType = InterBoutiqueTransferRequestTypesEnum.ACCEPTEDDATE;
        } else if (
          data === this.interBoutiqueTransferRequestTypesEnumRef.REQUESTDATE
        ) {
          this.radioType = InterBoutiqueTransferRequestTypesEnum.REQUESTDATE;
        }
      });

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
      .subscribe(data => {
        const endDate = this.historyFilterForm
          .get('rangeFormGroup')
          .get('toDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
    this.setValidation();
  }

  setValidation() {
    this.docNo = this.historyFilterForm.get('reqDocNo').value;

    const fisCalYearCtrl = this.historyFilterForm.get('reqFiscalYear');
    this.historyFilterForm.get('reqDocNo').valueChanges.subscribe(reqDocNo => {
      this.historyFilterForm.get('reqFiscalYear').markAsTouched();

      fisCalYearCtrl.updateValueAndValidity();
    });
  }

  apply() {
    console.log(this.historyFilterForm.value,'form value')
    this.dialogRef.close({
      reqFiscalYear: this.historyFilterForm.get('reqFiscalYear').value,
      reqDocNo: this.historyFilterForm.get('reqDocNo').value,
      locationCode:
        this.historyFilterForm.get('locationCode').value !== ''
          ? this.historyFilterForm.get('locationCode').value
          : null,
      statuses: this.historyFilterForm.get('statuses').value,

      startDate: moment(
        this.historyFilterForm.get('rangeFormGroup').get('fromDate').value
      )
        .startOf('day')
        .valueOf(),
      endDate: moment(
        this.historyFilterForm.get('rangeFormGroup').get('toDate').value
      )
        .endOf('day')
        .valueOf(),
        dateType: this.historyFilterForm.get('dateType').value
    });
  }
  clear() {

    this.historyFilterForm.patchValue({
      reqDocNo: null,
      reqFiscalYear: null,
      locationCode: null,
      statuses: [],
      rangeFormGroup: {
        fromDate: null,
        toDate: null
      },
      dateType: InterBoutiqueTransferRequestTypesEnum.REQUESTDATE
    });

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
