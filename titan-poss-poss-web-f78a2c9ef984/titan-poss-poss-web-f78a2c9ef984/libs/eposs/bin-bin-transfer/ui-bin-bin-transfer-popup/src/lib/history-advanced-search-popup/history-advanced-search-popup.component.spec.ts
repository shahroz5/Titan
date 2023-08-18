import { TranslateService } from '@ngx-translate/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryAdvancedSearchPopupComponent } from './history-advanced-search-popup.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pipe, PipeTransform, Input, Directive } from '@angular/core';
import * as moment from 'moment';
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
@Directive({
  selector: '[possWebDateRangePickerMd]'
})
class DatePickerStub {
  @Input() maxDate;
  @Input() showDropdowns;
  @Input() singleDatePicker;
}

// TODO : Added only basic unit tests
describe('HistoryAdvancedSearchPopupComponent', () => {
  let component: HistoryAdvancedSearchPopupComponent;
  let fixture: ComponentFixture<HistoryAdvancedSearchPopupComponent>;

  const popupData = {
    startDate: null,
    endDate: null,
    fiscalYear: 2019,
    issueDocNo: 2018
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HistoryAdvancedSearchPopupComponent,
        TranslatePipeStub,
        DatePickerStub
      ],
      schemas: [],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: _ => {}
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: popupData
        },
        {
          provide: CurrencyFormatterService,
          useValue: {
            format: (currency: any) => currency
          }
        },

        {
          provide: POSS_WEB_CURRENCY_CODE,
          useValue: 'IND'
        },
        {
          provide: TranslateService,
          useValue: {
            get: (data1: any) => {
              let result = {};
              if (data1 instanceof Array) {
                for (let i = 0; i < data1.length; i++) {
                  result = {
                    ...result,
                    [data1[i]]: data1[i]
                  };
                }
                return of(result);
              } else {
                return of(data1);
              }
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(HistoryAdvancedSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should call close the dialog on close', () => {
    spyOn(component.dialogRef, 'close');

    component.close();

    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should call reset historyFilter clear', () => {
    spyOn(component.historyFilterForm, 'patchValue');

    component.clear();

    expect(component.historyFilterForm.patchValue).toHaveBeenCalled();
  });

  it('should send form data on apply', () => {
    spyOn(component.dialogRef, 'close');

    const fiscalYear = '2019';
    const issueDocNo = 111;
    const startDate = moment();
    const endDate = moment();

    component.historyFilterForm.patchValue({
      fiscalYear: fiscalYear,
      issueDocNo: issueDocNo,
      startDate: startDate,
      endDate: endDate
    });

    const result = {
      fiscalYear: fiscalYear,
      issueDocNo: issueDocNo,
      startDate: moment(
        component.historyFilterForm.get('rangeFormGroup').get('fromDate').value
      )
        .startOf('day')
        .valueOf(),
      endDate: moment(
        component.historyFilterForm.get('rangeFormGroup').get('toDate').value
      )
        .endOf('day')
        .valueOf()
    };

    component.apply();

    expect(component.dialogRef.close).toHaveBeenCalledWith(result);
  });
});
