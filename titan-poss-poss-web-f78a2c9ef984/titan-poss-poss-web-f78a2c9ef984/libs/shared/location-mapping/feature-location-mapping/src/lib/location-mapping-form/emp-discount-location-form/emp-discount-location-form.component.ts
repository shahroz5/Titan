import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-emp-discount-location-form',
  templateUrl: './emp-discount-location-form.component.html'
})
export class EmpDiscountLocationFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  currentDate = moment();
  offerStartDateLabel: string;
  offerEndDateLabel: string;
  previewStartDateLabel: string;
  previewEndDateLabel: string;
  destroy$ = new Subject();

  @Output() formReady = new EventEmitter<FormGroup>();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      q1Enable: new FormControl(false),
      q2Enable: new FormControl(false),
      q3Enable: new FormControl(false),
      q4Enable: new FormControl(false),
      q1Value: new FormControl(
        null,
        this.fieldValidatorsService.amountField('Q1 Value')
      ),
      q2Value: new FormControl(
        null,
        this.fieldValidatorsService.amountField('Q2 Value')
      ),
      q3Value: new FormControl(
        null,
        this.fieldValidatorsService.amountField('Q3 Value')
      ),
      q4Value: new FormControl(
        null,
        this.fieldValidatorsService.amountField('Q4 Value')
      ),

      isActive: new FormControl(true)
    });
    this.form.controls['q1Value'].disable();
    this.form.controls['q2Value'].disable();
    this.form.controls['q3Value'].disable();
    this.form.controls['q4Value'].disable();

    // this.form.controls['q1Value'].setValidators((control: FormControl) =>
    //   !control.value && this.form.controls['q1Enable'].value === true
    //     ? { invalid: true }
    //     : null
    // );
    // this.form.controls['q2Value'].setValidators((control: FormControl) =>
    //   !control.value && this.form.controls['q2Enable'].value === true
    //     ? { invalid: true }
    //     : null
    // );
    // this.form.controls['q3Value'].setValidators((control: FormControl) =>
    //   !control.value && this.form.controls['q3Enable'].value === true
    //     ? { invalid: true }
    //     : null
    // );
    // this.form.controls['q4Value'].setValidators((control: FormControl) =>
    //   !control.value && this.form.controls['q4Enable'].value === true
    //     ? { invalid: true }
    //     : null
    // );
    this.formReady.emit(this.form);
  }

  selectionChange(checked) {
    this.form.patchValue({ isActive: checked });
  }

  q1ValueChange(checked) {
    if (checked === true) {
      this.form.controls['q1Value'].enable();
    } else {
      this.form.controls['q1Value'].disable();
      this.form.controls['q1Value'].setValue('');
    }
  }

  q2ValueChange(checked) {
    if (checked === true) {
      this.form.controls['q2Value'].enable();
    } else {
      this.form.controls['q2Value'].disable();
      this.form.controls['q2Value'].setValue('');
    }
  }

  q3ValueChange(checked) {
    if (checked === true) {
      this.form.controls['q3Value'].enable();
    } else {
      this.form.controls['q3Value'].disable();
      this.form.controls['q3Value'].setValue('');
    }
  }

  q4ValueChange(checked) {
    if (checked === true) {
      this.form.controls['q4Value'].enable();
    } else {
      this.form.controls['q4Value'].disable();
      this.form.controls['q4Value'].setValue('');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
