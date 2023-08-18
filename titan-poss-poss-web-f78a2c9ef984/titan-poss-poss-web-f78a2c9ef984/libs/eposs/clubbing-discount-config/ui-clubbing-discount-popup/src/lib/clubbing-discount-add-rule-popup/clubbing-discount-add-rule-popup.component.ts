import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'poss-web-clubbing-discount-add-rule-popup',
  templateUrl: './clubbing-discount-add-rule-popup.component.html'
})
export class ClubbingDiscountAddRulePopupComponent implements OnInit {
  formGroup: FormGroup;
  type1Codes: any;
  type2Codes: any;
  type3Codes: any;
  typeArray: any;
  valid = true;
  type1Options: Observable<string[]>;
  type2Options: Observable<string[]>;
  type3Options: Observable<string[]>;

  constructor(
    public dialogRef: MatDialogRef<ClubbingDiscountAddRulePopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.formGroup = new FormGroup({
      type1: new FormControl(''),
      type2: new FormControl(''),
      type3: new FormControl('')
    });
  }

  ngOnInit() {
    this.type1Codes = this.data.type1;
    this.type2Codes = this.data.type2;
    this.type3Codes = this.data.type3;
    this.type1Options = this.formGroup.get('type1').valueChanges.pipe(
      startWith(''),
      map(value => this._filterType1(value))
    );
    this.type2Options = this.formGroup.get('type2').valueChanges.pipe(
      startWith(''),
      map(value => this._filterType2(value))
    );
    this.type3Options = this.formGroup.get('type3').valueChanges.pipe(
      startWith(''),
      map(value => this._filterType3(value))
    );

    this.formGroup.valueChanges.subscribe(data => {
      const values = data;
      this.typeArray = [];
      Object.values(values).forEach(val => {
        if (val !== '') {
          this.typeArray.push(val);
        }
      });
      if (this.typeArray.length > 1) {
        console.log('if');
        this.valid = false;
      } else {
        console.log('else');
        this.valid = true;
      }
    });
  }
  private _filterType1(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.type1Codes.filter(
      t1 => t1.discountCode.toLowerCase().indexOf(filterValue) === 0
    );
  }
  private _filterType2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.type2Codes.filter(
      t2 => t2.discountCode.toLowerCase().indexOf(filterValue) === 0
    );
  }
  private _filterType3(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.type3Codes.filter(
      t3 => t3.discountCode.toLowerCase().indexOf(filterValue) === 0
    );
  }
  clearField(type) {
    switch (type) {
      case 'type1':
        this.formGroup.get('type1').setValue('');
        break;
      case 'type2':
        this.formGroup.get('type2').setValue('');
        break;
      case 'type3':
        this.formGroup.get('type3').setValue('');
        break;
    }
  }
  apply() {
    const values = this.formGroup.getRawValue();


    this.dialogRef.close({
      type1: values.type1 ? values.type1 : null,
      type2: values.type2 ? values.type2 : null,
      type3: values.type3 ? values.type3 : null
    });
  }
  close() {
    this.dialogRef.close();
  }
}
