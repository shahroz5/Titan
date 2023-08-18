import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockReceiveReasonForDelayPopupComponent } from './stock-receive-reason-for-delay-popup.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

@Pipe({
  name: 'translate'
})
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'dateFormatter'
})
class DateFromatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('StockReceiveReasonForDelayPopupComponent', () => {
  let component: StockReceiveReasonForDelayPopupComponent;
  let fixture: ComponentFixture<StockReceiveReasonForDelayPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StockReceiveReasonForDelayPopupComponent,
        TranslatePipeStub,
        DateFromatterPipeStub
      ],
      schemas: [],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (data: any) => {}
          },
        },
        {
          provide: CurrencyFormatterService,
          useValue: {
            format: (data: any) => data
          }
        },

        {
          provide: POSS_WEB_CURRENCY_CODE,
          useValue: 'IND'
        },
        { provide: MAT_DIALOG_DATA, useValue: { date: '12-MAR-2020' } },
        {
          provide: TranslateService,
          useValue: {
            get: (data: any) => {
              let result = {};
              if (data instanceof Array) {
                for (let i = 0; i < data.length; i++) {
                  result = {
                    ...result,
                    [data[i]]: data[i]
                  };
                }
                return of(result);
              } else {
                return of(data);
              }
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(StockReceiveReasonForDelayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should call dialog close on close is called with proper arguments', () => {
    spyOn(component.dialogRef, 'close');
    const expected = { type: 'close' };

    component.close();

    expect(component.dialogRef.close).toHaveBeenCalledWith(expected);
  });

  it('should call dialog close with reason for delay popup on confirm', () => {
    spyOn(component.dialogRef, 'close');
    const expected = { type: 'confirm', data: 'Reason' };
    component.reasonForDelayForm.setValue({
      reason: expected.data
    });

    component.confirm();

    expect(component.dialogRef.close).toHaveBeenCalledWith(expected);
  });

  it('should not call dialog close with reason for delay popup on confirm when reason is not valid', () => {
    spyOn(component.dialogRef, 'close');
    component.reasonForDelayForm.setValue({
      reason: '@s(!!!S'
    });

    component.confirm();
    expect(component.dialogRef.close).not.toHaveBeenCalled();
  });

  it('form should be valid', () => {
    component.reasonForDelayForm.setValue({
      reason: 'reason'
    });
    expect(component.reasonForDelayForm.valid).toBeTruthy();
  });

  it('form should be invalid', () => {
    component.reasonForDelayForm.setValue({
      reason: '@s(!!!S'
    });
    expect(component.reasonForDelayForm.invalid).toBeTruthy();

    component.reasonForDelayForm.setValue({
      reason: ''
    });
    expect(component.reasonForDelayForm.invalid).toBeTruthy();

    component.reasonForDelayForm.setValue({
      reason:
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    });
    expect(component.reasonForDelayForm.invalid).toBeTruthy();
  });

  it('should render courier date', () => {
    const expected = component.data.date;

    const actual = fixture.debugElement.query(By.css('.d-flex')).nativeElement
      .textContent;
    expect(actual).toContain(expected);
  });

  it(`should call confirm when confirm button is clicked`, () => {
    spyOn(component, 'confirm');

    const button = fixture.debugElement.query(By.css('.pw-accent-btn'));
    button.triggerEventHandler('click', null);

    expect(component.confirm).toHaveBeenCalled();
  });

  it(`should call close when close button is clicked`, () => {
    spyOn(component, 'close');

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(component.close).toHaveBeenCalled();
  });

  it(`should have inital focus on textarea`, () => {
    const actual = fixture.debugElement.query(By.css(':focus'));
    const expected = fixture.debugElement.query(By.css('textarea'));
    expect(actual).toEqual(expected);
  });

  it(`should have show error when form is invalid`, () => {
    component.reasonForDelayForm.setValue({
      reason: '@s(!!!S'
    });
    component.reasonForDelayForm.get('reason').markAsTouched();

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('mat-error').length).toBe(1);
  });
});
