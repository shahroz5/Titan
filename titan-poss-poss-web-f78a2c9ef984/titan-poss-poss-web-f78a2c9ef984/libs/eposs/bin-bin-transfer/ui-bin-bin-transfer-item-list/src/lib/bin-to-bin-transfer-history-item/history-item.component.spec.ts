import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryItemComponent } from './history-item.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Pipe, PipeTransform, NO_ERRORS_SCHEMA } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

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

@Pipe({
  name: 'weightFormatter'
})
class WeightFromatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'currencyFormatter'
})
class CurrencyFormatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('HistoryItemComponent', () => {
  let component: HistoryItemComponent;
  let fixture: ComponentFixture<HistoryItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HistoryItemComponent,
        TranslatePipeStub,
        DateFromatterPipeStub,
        WeightFromatterPipeStub,
        CurrencyFormatterPipeStub
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: [
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
    fixture = TestBed.createComponent(HistoryItemComponent);
    component = fixture.componentInstance;
    component.item = {
      id: 'B948E97B-BBB8-4C77-9383-1712B570F713',
      itemCode: '511178VHIU1A00',
      lotNumber: '2EA001188',
      mfgDate: moment(),
      productCategory: 'V',
      productGroup: '71',
      productCategoryDesc: 'BANGLES',
      productGroupDesc: 'Gold Plain',
      binCode: 'CHAIN',
      binGroupCode: 'STN',
      stdValue: 88213.86,
      stdWeight: 28.75,
      currencyCode: 'INR',
      weightUnit: 'gms',
      imageURL: '/productcatalogue/ProductImages/1178VHI.jpg',
      itemDetails: {},
      availableWeight: 28.75,
      availableValue: 88213.86,
      availableQuantity: 1,
      isSelected: false,
      isDisabled: false,
      destinationBinGroupCode: null,
      destinationBinCode: null,
      isStudded: true
    };
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });
});
