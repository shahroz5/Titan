import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockReceiveHistoryItemComponent } from './stock-receive-history-item.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Pipe,
  PipeTransform,
  NO_ERRORS_SCHEMA,
  DebugElement
} from '@angular/core';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

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
class Page {
  private fixture: ComponentFixture<StockReceiveHistoryItemComponent>;

  constructor(fixture: ComponentFixture<StockReceiveHistoryItemComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('StockReceiveHistoryItemComponent', () => {
  let component: StockReceiveHistoryItemComponent;
  let fixture: ComponentFixture<StockReceiveHistoryItemComponent>;
  let page: Page;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StockReceiveHistoryItemComponent,
        TranslatePipeStub,
        DateFromatterPipeStub,
        WeightFromatterPipeStub,
        CurrencyFormatterPipeStub
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: [
        {
          provide: WeightFormatterService,
          useValue: {
            format: (data: any) => data
          }
        }
      ]
    });
    fixture = TestBed.createComponent(StockReceiveHistoryItemComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    component.item = {
      id: '23SW22',
      binCode: 'TestBinCode',
      itemCode: '1233NXB992',
      itemDetails: {},
      stdValue: 10,
      stdWeight: 10,
      lotNumber: '121212',
      mfgDate: moment(),
      status: 'issued',
      availableValue: 10,
      availableWeight: 10,
      currencyCode: 'INR',
      weightUnit: 'gms',
      imageURL: 'http://test.com',
      measuredQuantity: 10,
      measuredWeight: 10,
      binGroupCode: 'TestBinGroupCode',
      availableQuantity: 10,
      orderType: 'P',
      productCategory: 'TestProductCategory',
      productGroup: 'TestProductGroup',
      productCategoryDesc: 'TestProductCategoryDesc',
      productGroupDesc: 'TestProductGroupDesc',
      remarks: 'TestRemarks',
      isUpdating: false,
      isUpdatingSuccess: null,
      isValidating: false,
      isValidatingSuccess: null,
      isValidatingError: false,
      isStudded: true
    };
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should call createForm onInit and assign it to itemForm', () => {
    const expectedForm = new FormGroup({});
    spyOn(component, 'createForm').and.returnValue(expectedForm);

    component.ngOnInit();

    expect(component.createForm).toHaveBeenCalledWith(component.item);
    expect(component.itemForm).toEqual(expectedForm);
  });

  it('createForm should create and return form', () => {
    const expected = component.item;

    const form = component.createForm(component.item);
    expect(form.get('id').value).toEqual(expected.id);
    expect(form.get('measuredQuantity').value).toEqual(
      expected.measuredQuantity
    );
    expect(form.get('measuredWeight').value).toEqual(expected.measuredWeight);
    expect(form.get('binGroupCode').value).toEqual(expected.binGroupCode);
    expect(form.get('binCode').value).toEqual(expected.binCode);
    expect(form.get('remarks').value).toEqual(expected.remarks);
  });

  it('should call weightFormatter while assigning measuredWeight value', () => {
    const expected = 10000;
    spyOn(component['weightFormatter'], 'format').and.returnValue(expected);

    component.itemForm = component['createForm'](component.item);

    expect(component.itemForm.get('measuredWeight').value).toEqual(expected);
  });
});
