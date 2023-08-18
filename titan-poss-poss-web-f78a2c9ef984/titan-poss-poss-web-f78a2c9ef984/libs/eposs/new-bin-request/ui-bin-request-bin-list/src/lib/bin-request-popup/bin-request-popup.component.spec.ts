import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  TestBed,
  getTestBed,
  ComponentFixture,
  waitForAsync
} from '@angular/core/testing';

import { BinRequestPopupComponent } from './bin-request-popup.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

describe('BinRequestPopupComponent', () => {
  let component: BinRequestPopupComponent;
  let fixture: ComponentFixture<BinRequestPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      let mockData: any;
      mockData = {
        bin: 'studded',
        remarks: 'Required Urgently'
      };

      TestBed.configureTestingModule({
        declarations: [BinRequestPopupComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          FormBuilder,
          TranslateService,
          FieldValidatorsService,
          { provide: MAT_DIALOG_DATA, useValue: mockData },
          { provide: MatDialogRef, useValue: { close: (data: any) => {} } }
        ],
        imports: [
          ReactiveFormsModule,
          TranslateModule.forRoot(),
          FormsModule,
          MatDialogModule,
          MatIconModule,
          MatToolbarModule,
          MatMenuModule,
          MatButtonModule
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BinRequestPopupComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create BinRequestPopup Component', () => {
    expect(component).toBeTruthy();
  });
  it('should call Close function ', () => {
    spyOn(component.dialogRef, 'close');

    component.onClose();

    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('form invalid when empty', () => {
    expect(component.newBinRequestForm.valid).toBeFalsy();
  });

  it('bin field validity', () => {
    const bin = component.newBinRequestForm.controls['bin'];
    expect(bin.valid).toBeFalsy();

    bin.setValue('');
    expect(bin.hasError('required')).toBeTruthy();

    //  bin.setValue("aaaaaaaaaaaaaaaaaaaaaa");
    //  expect(bin.hasError('maxLength')).toBeTruthy();
  });

  it('remark field validity', () => {
    const remark = component.newBinRequestForm.controls['remarks'];
    expect(remark.valid).toBeFalsy();

    remark.setValue('');
    expect(remark.hasError('required')).toBeTruthy();

    // remark.setValue("aaaaaaaaaaaaaaaaaaaa");
    //  expect(remark.hasError('maxLength')).toBeTruthy();
  });

  it('should call requestBin()  function ', () => {
    const binRequest = {
      bin: 'abc',
      remarks: 'argf'
    };
    spyOn(component.newBinRequestForm, 'markAllAsTouched');

    component.requestBin();

    expect(component.newBinRequestForm.markAllAsTouched).toHaveBeenCalled();
  });
});
