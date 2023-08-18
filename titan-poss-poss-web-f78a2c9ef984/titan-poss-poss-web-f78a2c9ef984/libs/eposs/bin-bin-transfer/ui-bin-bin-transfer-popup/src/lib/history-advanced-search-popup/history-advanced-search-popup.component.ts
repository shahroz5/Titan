import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-history-advanced-search-popup',
  templateUrl: './history-advanced-search-popup.component.html',
  styleUrls: ['./history-advanced-search-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryAdvancedSearchPopupComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  historyFilterForm: FormGroup;
  currentDate = moment();
  currentYear = moment().year();
  currentMonth = moment().month();
  docNoLabel: string;
  year: number;
  docNo: any;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translateService
      .get(['pw.binToBinTransfer.docNoLable'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.docNoLabel = translatedLabels['pw.binToBinTransfer.docNoLable'];
      });

    this.historyFilterForm = new FormGroup({
      rangeFormGroup: new FormGroup({
        fromDate: new FormControl(moment(data.formData.startDate)),
        toDate: new FormControl(moment(data.formData.endDate))
      }),

      fiscalYear: new FormControl(
        data.formData.fiscalYear ? data.formData.fiscalYear : '',
        [
          // this.fieldValidatorsService.numbersField('Fiscal Year'),
          // this.fieldValidatorsService.maxLength(4, 'Fiscal Year'),
          // this.fieldValidatorsService.minLength(4, 'Fiscal Year'),
          // this.fieldValidatorsService.max(
          //   Number(this.currentMonth) >= 3
          //     ? this.currentYear
          //     : this.currentYear - 1,
          //   'Fiscal Year'
          // )
        ]
      ),
      issueDocNo: new FormControl(
        data.formData.issueDocNo,
        this.fieldValidatorsService.requestNumberField(this.docNoLabel)
      )
    });
  }

  ngOnInit() {
    this.setValidation();
    this.historyFilterForm.get('fiscalYear').valueChanges.subscribe(fyear => {
      if (
        !(fyear === '' || fyear == null) &&
        this.historyFilterForm.get('fiscalYear').errors === null
      ) {
        console.log(
          this.historyFilterForm.get('issueDocNo').errors,
          'checkerror'
        );
        const fromDate = moment(
          this.historyFilterForm.get('fiscalYear').value + '-04' + '-01'
        ).startOf('day');

        this.year = this.historyFilterForm.get('fiscalYear').value;
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
  }
  setValidation() {
    this.docNo = this.historyFilterForm.get('issueDocNo').value;
    // if (!(this.docNo === null || this.docNo === '')) {
    //   const fisCalYearCtrl2 = this.historyFilterForm.get('fiscalYear');
    //   fisCalYearCtrl2.setValidators([
    //     this.fieldValidatorsService.requiredField('Fiscal Year'),
    //     // Validators.required,
    //     this.fieldValidatorsService.numbersField('Fiscal Year'),
    //     this.fieldValidatorsService.maxLength(4, 'Fiscal Year'),
    //     this.fieldValidatorsService.minLength(4, 'Fiscal Year'),
    //     this.fieldValidatorsService.max(
    //       Number(this.currentMonth) >= 3
    //         ? this.currentYear
    //         : this.currentYear - 1,
    //       'Fiscal Year'
    //     )
    //   ]);
    // }
    const fisCalYearCtrl = this.historyFilterForm.get('fiscalYear');
    this.historyFilterForm
      .get('issueDocNo')
      .valueChanges.subscribe(issueDocNo => {
        this.historyFilterForm.get('fiscalYear').markAsTouched();
        if (
          !(issueDocNo === '' || issueDocNo == null) &&
          this.historyFilterForm.get('issueDocNo').errors === null
        ) {
          // fisCalYearCtrl.setValidators([
          //   // Validators.required,
          //   this.fieldValidatorsService.requiredField('Fiscal Year'),
          //   this.fieldValidatorsService.numbersField('Fiscal Year'),
          //   this.fieldValidatorsService.maxLength(4, 'Fiscal Year'),
          //   this.fieldValidatorsService.minLength(4, 'Fiscal Year'),
          //   this.fieldValidatorsService.max(
          //     Number(this.currentMonth) >= 3
          //       ? this.currentYear
          //       : this.currentYear - 1,
          //     'Fiscal Year'
          //   )
          // ]);
        } else {
          // fisCalYearCtrl.setValidators([
          //   this.fieldValidatorsService.numbersField('Fiscal Year'),
          //   this.fieldValidatorsService.maxLength(4, 'Fiscal Year'),
          //   this.fieldValidatorsService.minLength(4, 'Fiscal Year'),
          //   this.fieldValidatorsService.max(this.currentYear, 'Fiscal Year'),
          //   this.fieldValidatorsService.max(
          //     Number(this.currentMonth) >= 3
          //       ? this.currentYear
          //       : this.currentYear - 1,
          //     'Fiscal Year'
          //   )
          // ]);
        }

        fisCalYearCtrl.updateValueAndValidity();
      });

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
      fiscalYear: this.historyFilterForm.get('fiscalYear').value,
      issueDocNo: this.historyFilterForm.get('issueDocNo').value
    });
  }

  clear() {
    // this.historyFilterForm.reset();
    this.historyFilterForm.patchValue({
      issueDocNo: null,
      fiscalYear: null,
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
