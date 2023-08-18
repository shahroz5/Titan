import {
  Component,
  OnInit,
  OnDestroy,
  Inject
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-config-details',
  templateUrl: './config-details.component.html'
})
export class ConfigDetailsComponent implements OnInit, OnDestroy {
  form: FormGroup;

  destroy$ = new Subject();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private dialogRef: MatDialogRef<ConfigDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      q1Enable: new FormControl(
        this.data?.q1Enable ? this.data?.q1Enable : false
      ),
      q2Enable: new FormControl(
        this.data?.q2Enable ? this.data?.q2Enable : false
      ),
      q3Enable: new FormControl(
        this.data?.q3Enable ? this.data?.q3Enable : false
      ),
      q4Enable: new FormControl(
        this.data?.q4Enable ? this.data?.q4Enable : false
      ),
      q1Value: new FormControl(this.data?.q1Value ? this.data?.q1Value : null, [
        this.fieldValidatorsService.numbersField('Q1 Value')
      ]),
      q2Value: new FormControl(this.data?.q2Value ? this.data?.q2Value : null, [
        this.fieldValidatorsService.numbersField('Q2 Value')
      ]),
      q3Value: new FormControl(this.data?.q3Value ? this.data?.q3Value : null, [
        this.fieldValidatorsService.numbersField('Q3 Value')
      ]),
      q4Value: new FormControl(this.data?.q4Value ? this.data?.q4Value : null, [
        this.fieldValidatorsService.numbersField('Q4 Value')
      ])
    });

    const obj = {
      quarter1: null,
      quarter2: null,
      quarter3: null,
      quarter4: null
    };

    obj.quarter1 = {
      start: moment().month(3).startOf('month'),
      end: moment().month(5).endOf('month')
    };
    obj.quarter2 = {
      start: moment().month(6).startOf('month'),
      end: moment().month(8).endOf('month')
    };
    obj.quarter3 = {
      start: moment().month(9).startOf('month'),
      end: moment().month(11).endOf('month')
    };
    obj.quarter4 = {
      start: moment().month(0).startOf('month').add(1, 'years'),
      end: moment().month(2).endOf('month').add(1, 'years')
    };

    if (this.data?.q1Enable) {
      this.form.controls['q1Value'].enable();
    } else {
      this.form.controls['q1Value'].disable();
    }

    if (this.data?.q2Enable) {
      this.form.controls['q2Value'].enable();
    } else {
      this.form.controls['q2Value'].disable();
    }

    if (this.data?.q3Enable) {
      this.form.controls['q3Value'].enable();
    } else {
      this.form.controls['q3Value'].disable();
    }

    if (this.data?.q4Enable) {
      this.form.controls['q4Value'].enable();
    } else {
      this.form.controls['q4Value'].disable();
    }

    if (
      moment()
        .quarter(moment().quarter())
        .startOf('quarter')
        .isSame(obj.quarter2.start)
    ) {
      this.form.controls['q1Enable'].disable();
      this.form.controls['q1Value'].disable();
    } else if (
      moment()
        .quarter(moment().quarter())
        .startOf('quarter')
        .isSame(obj.quarter3.start)
    ) {
      this.form.controls['q2Enable'].disable();
      this.form.controls['q1Enable'].disable();
      this.form.controls['q1Value'].disable();
      this.form.controls['q2Value'].disable();
    } else if (
      moment()
        .quarter(moment().quarter())
        .startOf('quarter')
        .isSame(obj.quarter4.start)
    ) {
      this.form.controls['q1Enable'].disable();
      this.form.controls['q2Enable'].disable();
      this.form.controls['q3Enable'].disable();
      this.form.controls['q1Value'].disable();
      this.form.controls['q2Value'].disable();
      this.form.controls['q3Value'].disable();
    }
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

  clear() {
    this.form.reset();
  }
  apply() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
