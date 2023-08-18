import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-add-other-grf-popup',
  templateUrl: './add-other-grf-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOtherGrfPopupComponent implements OnInit, OnDestroy {
  grfFormGroup: FormGroup;
  currentMonth = moment().month();
  currentYear = moment().year();
  destroy$ = new Subject<null>();
  getCNDetails = new EventEmitter();
  otp = new EventEmitter();
  validateOTP = new EventEmitter();
  show = false;
  token: string;
  currentFiscalYear: number;
  grfNumberTran: string;
  fiscalYearTran: string;
  disableGenerateOTPButton = false;
  hasOtpValidated = false;
  constructor(
    public dialogRef: MatDialogRef<AddOtherGrfPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.grf.grfNoLabel', 'pw.grf.fiscalYearLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.grfNumberTran = translatedMsg['pw.grf.grfNoLabel'];
        this.fiscalYearTran = translatedMsg['pw.grf.fiscalYearLabel'];
      });
    this.disableGenerateOTPButton = data.disableGenerateOTPButton;
    this.hasOtpValidated = data.hasOtpValidated;
    if (this.disableGenerateOTPButton) {
      this.hasOtpValidated = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.grfCn) {
      this.grfFormGroup.patchValue({ grfNumber: this.data.grfCn.docNo });
      this.grfFormGroup.patchValue({
        fiscalYear: this.data.grfCn.fiscalYear
      });
    }
    if (this.data.hasOtpValidated) {
      this.grfFormGroup.patchValue({ otp: this.data.token });
    }
    this.currentFiscalYear = this.data.currentFiscalYear;
    const cnNumberCtrl = this.grfFormGroup.get('grfNumber');

    this.grfFormGroup
      .get('fiscalYear')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(fiscalYear => {
        if (
          !(fiscalYear === '' || fiscalYear == null) &&
          this.grfFormGroup.get('fiscalYear').errors === null
        ) {
          this.grfFormGroup.get('grfNumber').markAsTouched();
          cnNumberCtrl.setValidators([
            this.fieldValidatorsService.requiredField(this.grfNumberTran),
            this.fieldValidatorsService.numbersField(this.grfNumberTran)
          ]);
        } else {
          cnNumberCtrl.setValidators([
            this.fieldValidatorsService.numbersField(this.grfNumberTran)
          ]);
        }
        cnNumberCtrl.updateValueAndValidity({ emitEvent: false });
      });
    const fiscalYearCtrl = this.grfFormGroup.get('fiscalYear');
    this.grfFormGroup
      .get('grfNumber')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(cnNumber => {
        if (
          !(cnNumber === '' || cnNumber == null) &&
          this.grfFormGroup.get('grfNumber').errors === null
        ) {
          this.grfFormGroup.get('fiscalYear').markAsTouched();
          fiscalYearCtrl.setValidators([
            this.fieldValidatorsService.requiredField(this.fiscalYearTran),
            this.fieldValidatorsService.fiscalYearField(this.fiscalYearTran),
            this.fieldValidatorsService.max(
              this.currentFiscalYear,
              this.fiscalYearTran
            )
          ]);
        } else {
          fiscalYearCtrl.setValidators([
            this.fieldValidatorsService.fiscalYearField(this.fiscalYearTran),
            this.fieldValidatorsService.max(
              this.currentFiscalYear,
              this.fiscalYearTran
            )
          ]);
        }
        fiscalYearCtrl.updateValueAndValidity({ emitEvent: false });
      });
  }
  createForm() {
    this.grfFormGroup = new FormGroup({
      grfNumber: new FormControl('', [
        this.fieldValidatorsService.numbersField(this.grfNumberTran),
        this.fieldValidatorsService.requiredField(this.grfNumberTran)
      ]),
      fiscalYear: new FormControl(''),
      otp: new FormControl('')
    });
  }
  getDetails() {
    this.grfFormGroup.get('otp').reset();
    this.getCNDetails.emit({
      grfNumber: this.grfFormGroup.get('grfNumber').value,
      fiscalYear: this.grfFormGroup.get('fiscalYear').value
    });
  }
  generateOTP() {
    this.otp.emit(this.data.grfCn.id);
    this.grfFormGroup.get('otp').reset();
    this.show = true;
  }
  close() {
    this.dialogRef.close('CLOSE');
  }
  validate() {
    this.token = this.grfFormGroup.get('otp').value;
    this.validateOTP.emit({
      token: this.grfFormGroup.get('otp').value,
      id: this.data.grfCn.id
    });
  }
  add() {
    this.dialogRef.close('ADD');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
