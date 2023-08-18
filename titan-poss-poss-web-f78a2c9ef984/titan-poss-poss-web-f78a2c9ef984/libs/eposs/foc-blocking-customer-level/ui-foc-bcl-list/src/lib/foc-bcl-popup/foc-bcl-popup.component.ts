import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-foc-bcl-popup',
  templateUrl: './foc-bcl-popup.component.html',
  styleUrls: ['./foc-bcl-popup.component.scss']
})
export class FOCBCLPopupComponent implements OnInit, OnDestroy {
  addFormGroup: FormGroup;
  currentDate = moment();
  destroy$ = new Subject<null>();
  mobileNoTranslatedMsg: string;
  focItemCodeTranslatedMsg: string;
  quantityaTranslatedMsg: string;
  approvedByTranslatedMsg: string;
  remarksTranslatedMsg: string;
  constructor(
    public dialogRef: MatDialogRef<FOCBCLPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.focBlockingCustomerLevel.mobileNumberLabel',
        'pw.focBlockingCustomerLevel.focItemCode',
        'pw.focBlockingCustomerLevel.quantityLabel',
        'pw.focBlockingCustomerLevel.approvedByLabel',
        'pw.focBlockingCustomerLevel.remarksLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.mobileNoTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.mobileNumberLabel'];
        this.focItemCodeTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.focItemCode'];
        this.quantityaTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.quantityLabel'];
        this.quantityaTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.quantityLabel'];
        this.approvedByTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.approvedByLabel'];
        this.remarksTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.remarksLabel'];
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
  creatForm() {
    console.log('data123', this.data);
    this.addFormGroup = new FormGroup({
      rangeFormGroup: new FormGroup({
        startDate: new FormControl(
          this.data ? moment(this.data?.fromDate) : ''
        ),
        endDate: new FormControl(this.data ? moment(this.data?.toDate) : '')
      }),
      mobileNo: new FormControl(this.data ? this.data?.mobileNumber : '', [
        this.fieldValidatorsService.requiredField(this.mobileNoTranslatedMsg),
        this.fieldValidatorsService.mobileField(this.mobileNoTranslatedMsg)
      ]),
      focItemCode: new FormControl(this.data ? this.data?.focItemCode : '', [
        this.fieldValidatorsService.itemCodeField(this.focItemCodeTranslatedMsg)
      ]),
      quantity: new FormControl(this.data ? this.data?.quantity : '', [
        this.fieldValidatorsService.quantityField(this.quantityaTranslatedMsg)
      ]),
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
      remarks: this.addFormGroup.get('remarks').value,
      mobileNo: this.addFormGroup.get('mobileNo').value,
      focItemCode: this.addFormGroup.get('focItemCode').value,
      quantity: this.addFormGroup.get('quantity').value
    });
  }

  close() {
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
