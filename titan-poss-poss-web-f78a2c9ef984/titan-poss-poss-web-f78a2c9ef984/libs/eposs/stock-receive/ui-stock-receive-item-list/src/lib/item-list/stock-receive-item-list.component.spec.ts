import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockReceiveItemListComponent } from './stock-receive-item-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  DebugElement
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { By } from '@angular/platform-browser';
import { StockReceiveItem } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-stock-receive-item',
  template: `
    Fake stock-receive-item
  `
})
export class FakeStockReceiveItemComponent {
  @Input() item: any;
  @Input() isVerified: boolean; // verified/nonVerified
  @Input() binGroupCode: string;
  @Input() binCodes: any[];
  @Input() remarks: any[];
  @Input() parentForm: any;

  @Output() verify = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() validate = new EventEmitter<any>();
  @Output() itemDetails = new EventEmitter<any>();
}

@Component({
  selector: 'poss-web-stock-receive-history-item',
  template: `
    Fake stock-receive-history-item
  `
})
export class FakeStockReceiveHistoryItemComponent {
  @Input() item: any;
}

class Page {
  // getter properties wait to query the DOM until called.
  get stockReceiveItems() {
    return this.queryAll('poss-web-stock-receive-item');
  }
  get stockReceiveHistoryItems() {
    return this.queryAll('poss-web-stock-receive-history-item');
  }
  private fixture: ComponentFixture<StockReceiveItemListComponent>;

  constructor(fixture: ComponentFixture<StockReceiveItemListComponent>) {
    this.fixture = fixture;
  }

  private queryAll(selector: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css(selector));
  }
}

describe('StockReceiveItemListComponent', () => {
  let component: StockReceiveItemListComponent;
  let fixture: ComponentFixture<StockReceiveItemListComponent>;
  let page: Page;
  const testItems: StockReceiveItem[] = [
    {
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
    },
    {
      id: '23SW23',
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
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StockReceiveItemListComponent,
        FakeStockReceiveItemComponent,
        FakeStockReceiveHistoryItemComponent
      ],
      schemas: [],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: []
    });
    fixture = TestBed.createComponent(StockReceiveItemListComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should call send page event on call of paginate', () => {
    const nextPageEvent: PageEvent = {
      pageIndex: 10,
      pageSize: 2,
      length: 20
    };

    const expected = nextPageEvent;

    let actual: PageEvent;
    component.paginator.subscribe(result => {
      actual = result;
    });

    component.paginate(nextPageEvent);

    expect(actual).toEqual(expected);
  });

  it('should track by item id', () => {
    const expected = testItems[0].id;

    const actual = component.trackBy(1, testItems[0]);

    expect(actual).toEqual(expected);
  });

  it('should retrun min page size ', () => {
    component.pageSizeOptions = [40, 5, 10, 20];
    const expected = 5;

    const actual = component.getMinPageSize();

    expect(actual).toEqual(expected);
  });

  it('should retrun pev page event where no element in the current page', () => {
    spyOn(component, 'paginate');
    component.pageEvent.pageIndex = 1;

    component.ngOnChanges({
      itemList: {
        currentValue: [],
        previousValue: ['Item1', 'Item2'],
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.paginate).toHaveBeenCalled();
  });

  it('should call parentFormDirty with if the form is dirty when form value changes', () => {
    const expected = !component.parentForm.pristine;

    let actual: boolean;
    component.parentFormDirty.subscribe(result => {
      actual = result;
    });

    component.parentForm.reset();

    expect(actual).toEqual(expected);
  });

  it('should not render item when count is 0', () => {
    const expected = 0;
    component.count = 0;

    fixture.detectChanges();

    const actualItems = page.stockReceiveItems.length;

    const actualHistoryItems = page.stockReceiveHistoryItems.length;

    expect(actualItems).toEqual(expected);
    expect(actualHistoryItems).toEqual(expected);
  });

  it('Number rendered item should be equal to the number of items passed', () => {
    const expected = testItems.length;
    component.itemList = testItems;
    component.count = 10;

    fixture.detectChanges();

    const actual = page.stockReceiveItems.length;

    expect(actual).toEqual(expected);
  });

  it('Number rendered item should be equal to the number of items passed for histroy', () => {
    const expected = testItems.length;
    component.itemList = testItems;
    component.count = 10;
    component.isHistory = true;

    fixture.detectChanges();

    const actual = page.stockReceiveHistoryItems.length;

    expect(actual).toEqual(expected);
  });
});
