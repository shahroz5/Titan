import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  TestBed,
  getTestBed,
  ComponentFixture,
  async,
  waitForAsync
} from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
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
import { BinRequestApprovalsPopupComponent } from './bin-request-approvals-popup.component';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

describe('Component: BinRequestApprovalsPopupComponent', () => {
  let component: BinRequestApprovalsPopupComponent;
  let fixture: ComponentFixture<BinRequestApprovalsPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      let mockData: any;
      mockData = {
        remarks: 'Required Urgently',
        status: 'APVL_REJECTED'
      };

      // refine the test module by declaring the test component
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          TranslateModule.forRoot(),
          FormsModule,
          MatDialogModule,
          MatIconModule,
          MatToolbarModule,
          MatMenuModule,
          MatButtonModule
        ],
        declarations: [BinRequestApprovalsPopupComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          FormBuilder,
          TranslateService,
          FieldValidatorsService,
          { provide: MAT_DIALOG_DATA, useValue: mockData },
          { provide: MatDialogRef, useValue: { close: (data: any) => {} } }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(BinRequestApprovalsPopupComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close() function ', () => {
    spyOn(component.dialogRef, 'close');

    component.onClose();

    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should call clearRemarks() function ', () => {
    spyOn(component.newBinRequestForm, 'reset');

    component.clearRemarks();

    expect(component.newBinRequestForm.reset).toHaveBeenCalled();
  });

  it('should call approvedRejected() function ', () => {
    const status = 'approve';
    spyOn(component.dialogRef, 'close');

    component.approvedRejected(status);

    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should call approvedRejected() function ', () => {
    const status = 'reject';
    spyOn(component.dialogRef, 'close');

    component.approvedRejected(status);

    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('remark field validity', () => {
    const remark = component.newBinRequestForm.controls['remarks'];
    expect(remark.valid).toBeTruthy();

    remark.setValue('');
    expect(remark.hasError('required')).toBeFalsy();

    remark.setValue('aaaaaaaaaaaaaaaaaaaa');
    expect(remark.hasError('maxLength')).toBeFalsy();
  });
});
