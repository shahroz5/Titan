import { BinDetailsRequestTypesEnum } from '@poss-web/shared/models';
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
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-bin-details-advanced-filter',
  templateUrl: './bin-details-advanced-filter.component.html',
  styleUrls: ['./bin-details-advanced-filter.component.scss']
})
export class BinDetailsAdvancedFilterComponent implements OnInit, OnDestroy {
  historyFilterForm: FormGroup;
  interBoutiqueTransferRequestTypesEnumRef = BinDetailsRequestTypesEnum;

  destroy$: Subject<null> = new Subject<null>();
  interBoutiqueTransferRequestType: any;
  selectall: boolean;
  year: number;
  currentDate = moment();
  currentYear = moment().year();
  status: string;
  statusesList: string[] = ['APPROVED', 'APVL_REJECTED'];
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
    console.log('data', data);
    this.historyFilterForm = new FormGroup({
      rangeFormGroup: new FormGroup({
        fromDate: new FormControl(moment(data.formData.startDate)),
        toDate: new FormControl(moment(data.formData.endDate))
      }),
      reqFiscalYear: new FormControl(
        data.formData.reqFiscalYear ? data.formData.reqFiscalYear : ''
      ),

      statuses: new FormControl(
        data.formData.statuses ? data.formDatastatuses : []
      )
    });
  }

  ngOnInit() {

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

  setValidation() {
    //const fisCalYearCtrl = this.historyFilterForm.get('reqFiscalYear');
    // fisCalYearCtrl.setValidators([
    //   this.fieldValidatorsService.numbersField('Fiscal Year'),
    //   this.fieldValidatorsService.maxLength(4, 'Fiscal Year'),
    //   this.fieldValidatorsService.minLength(4, 'Fiscal Year'),
    //   this.fieldValidatorsService.max(this.currentYear, 'Fiscal Year')
    // ]);
    //fisCalYearCtrl.updateValueAndValidity();
    // this.historyFilterForm
    //   .get('fromDate')
    //   .valueChanges.pipe(takeUntil(this.destroy$))
    //   .subscribe((value: any) => {
    //     if (
    //       this.historyFilterForm.get('fromDate').value >
    //       this.historyFilterForm.get('toDate').value
    //     ) {
    //       this.historyFilterForm.patchValue({
    //         endDate: this.currentDate
    //       });
    //     }
    //   });
  }

  apply() {
    this.dialogRef.close({
      reqFiscalYear: this.historyFilterForm.get('reqFiscalYear').value,
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
        .valueOf()
    });
  }
  clear() {
    this.historyFilterForm.patchValue({
      reqFiscalYear: null,
      statuses: [],
      rangeFormGroup: {
        fromDate: null,
        toDate: null
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

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
