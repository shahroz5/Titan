import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockReceiveHistoryPopupComponent } from './stock-receive-history-popup.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
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
// TODO : Added only basic unit tests
describe('StockReceiveHistoryPopupComponent', () => {
  let component: StockReceiveHistoryPopupComponent;
  let fixture: ComponentFixture<StockReceiveHistoryPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockReceiveHistoryPopupComponent, TranslatePipeStub],
      schemas: [],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: [
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
        {
          provide: MatDialogRef,
          useValue: {
            close: (data: any) => {}
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            advancedFilter: {
              advancedFilter: {},
              isL1L2Store: true,
              isL3Store: true
            }
          }
        },
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
    fixture = TestBed.createComponent(StockReceiveHistoryPopupComponent);
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
    spyOn(component.historyFilter, 'patchValue');

    component.clear();

    expect(component.historyFilter.patchValue).toHaveBeenCalled();
  });

  it('should send form data on apply', () => {
    spyOn(component.dialogRef, 'close');

    const stnNumber = '1122';
    const docNo = '92828';
    const fiscalYear = '2019';
    const sourceLocationCode = 'URB';
    const docFromDate = moment();
    const docToDate = moment();

    component.historyFilter.patchValue({
      stnNumber: stnNumber,
      docNo: docNo,
      fiscalYear: fiscalYear,
      sourceLocationCode: sourceLocationCode,
      docFromDate: docFromDate,
      docToDate: docToDate
    });

    const result = {
      stnNumber: stnNumber,
      docNumber: docNo,
      fiscalYear: fiscalYear,
      sourceLocationCode: sourceLocationCode,
      docFromDate: moment(
        component.historyFilter.get('rangeFormGroup').get('docFromDate').value
      )
        .startOf('day')
        .valueOf(),
      docToDate: moment(
        component.historyFilter.get('rangeFormGroup').get('docToDate').value
      )
        .endOf('day')
        .valueOf()
    };

    component.apply();

    expect(component.dialogRef.close).toHaveBeenCalledWith(result);
  });
});
