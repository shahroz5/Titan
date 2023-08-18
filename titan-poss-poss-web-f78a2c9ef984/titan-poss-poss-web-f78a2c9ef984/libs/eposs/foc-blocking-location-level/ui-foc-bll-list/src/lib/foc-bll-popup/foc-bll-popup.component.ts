import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-foc-bll-popup',
  templateUrl: './foc-bll-popup.component.html'
})
export class FocBllPopupComponent implements OnInit, OnDestroy {
  addFormGroup: FormGroup;
  currentDate = moment();
  destroy$ = new Subject<null>();
  remarksTranslatedMsg: string;
  approvedByTranslatedMsg: string;
  constructor(
    public dialogRef: MatDialogRef<FocBllPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.focBlockingLocationLevel.remarksLabel',
        'pw.focBlockingLocationLevel.approvedByLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.remarksTranslatedMsg =
          translatedMsg['pw.focBlockingLocationLevel.remarksLabel'];
        this.approvedByTranslatedMsg =
          translatedMsg['pw.focBlockingLocationLevel.approvedByLabel'];
      });
  }

  ngOnInit(): void {
    this.creatForm();
    this.addFormGroup
      .get('rangeFormGroup')
      .get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.addFormGroup.get('rangeFormGroup').get('endDate');
        const previousDate = moment(this.currentDate).subtract(1, 'days');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate'),
          this.fieldValidatorsService.requiredField('EndDate'),
          this.fieldValidatorsService.minDate(previousDate, 'EndDate'),
          this.startDateValidator(data)
        ]);
        endDate.updateValueAndValidity();
      });
  }

  startDateValidator(selectedDate: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const previousDate = moment(this.currentDate).subtract(1, 'days');
      if (
        !moment(selectedDate).isSame(moment(this.data.fromDate)) &&
        moment(selectedDate).isBefore(previousDate)
      ) {
        return { invalidDateSelected: true };
      } else {
        return null;
      }
    };
  }

  creatForm() {
    console.log('data123', this.data);
    this.addFormGroup = new FormGroup({
      rangeFormGroup: new FormGroup({
        startDate: new FormControl(
          this.data ? moment(this.data?.fromDate) : ''
        ),
        endDate: new FormControl(this.data ? moment(this.data?.toDate) : '')
      }),
      approvedBy: new FormControl(this.data ? this.data?.approvedBy : '', [
        this.fieldValidatorsService.nameWithSpaceField(
          this.approvedByTranslatedMsg
        )
      ]),
      isCMMandatory: new FormControl(
        this.data ? this.data?.isCMMandatory : false
      ),
      remarks: new FormControl(this.data ? this.data?.remarks : '', [
        this.fieldValidatorsService.remarkField(this.remarksTranslatedMsg)
      ]),
      isActive: new FormControl(this.data ? this.data?.isActive : true)
    });
  }
  selectionChange(checked) {
    this.addFormGroup.patchValue({ isActive: checked });
  }
  apply() {
    this.dialogRef.close({
      startDate: moment(
        this.addFormGroup.get('rangeFormGroup').get('startDate').value
      )
        .startOf('day')
        .valueOf(),
      endDate: moment(
        this.addFormGroup.get('rangeFormGroup').get('endDate').value
      )
        .endOf('day')
        .valueOf(),
      approvedBy: this.addFormGroup.get('approvedBy').value,
      isCMMandatory: this.addFormGroup.get('isCMMandatory').value,
      isActive: this.addFormGroup.get('isActive').value,
      remarks: this.addFormGroup.get('remarks').value
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  close() {
    this.dialogRef.close();
  }
}
