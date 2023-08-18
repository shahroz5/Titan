import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BinToBinTransferItemListComponent } from './bin-to-bin-transfer-item-list.component';
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
import { BinToBinTransferItem } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-bin-to-bin-transfer-item',
  template: `
    Fake bin-to-bin-transfer-item
  `
})
export class FakeBinToBinTransferItemComponent {
  @Input() item: any;
  @Input() canSelect = false;
  @Input() canDelete = false;
  @Input() showSourceBin = false;
  @Input() showDestinationBin = false;
  @Input() bins: any[] = [];

  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
}

@Component({
  selector: 'poss-web-history-item',
  template: `
    Fake history-item
  `
})
export class FakeHistoryItemComponent {
  @Input() item: any;
}

class Page {
  // getter properties wait to query the DOM until called.
  get items() {
    return this.queryAll('poss-web-bin-to-bin-transfer-item');
  }
  get historyItems() {
    return this.queryAll('poss-web-history-item');
  }

  get errorItems() {
    return this.queryAll('.pw-list-card__error-border');
  }

  private fixture: ComponentFixture<BinToBinTransferItemListComponent>;

  constructor(fixture: ComponentFixture<BinToBinTransferItemListComponent>) {
    this.fixture = fixture;
  }

  private queryAll(selector: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css(selector));
  }
}

describe('BinToBinTransferItemListComponent', () => {
  let component: BinToBinTransferItemListComponent;
  let fixture: ComponentFixture<BinToBinTransferItemListComponent>;
  let page: Page;
  const testItems: BinToBinTransferItem[] = [
    {
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
      isStudded:true
    },
    {
      id: 'B948E97B-BBB8-4C77-9383-1712B570F711',
      itemCode: '511178VHIU1A01',
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
      isStudded:true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BinToBinTransferItemListComponent,
        FakeBinToBinTransferItemComponent,
        FakeHistoryItemComponent
      ],
      schemas: [],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: []
    });
    fixture = TestBed.createComponent(BinToBinTransferItemListComponent);
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

  describe('checkSameBinError', () => {
    it('should return false when item is not selected ', () => {
      const item = { ...component.itemList[0], isSelected: false };

      const result = component.checkSameBinError(item);

      expect(result).toBeFalsy();
    });

    it('should return false when item is selected and binCodes are not matching', () => {
      const item = {
        ...component.itemList[0],
        isSelected: true,
        binCode: 'BIN_CODE_1',
        destinationBinCode: 'BIN_CODE_2'
      };

      const result = component.checkSameBinError(item);

      expect(result).toBeFalsy();
    });

    it('should return true when item is selected and binCodes are matching', () => {
      const item = {
        ...component.itemList[0],
        isSelected: true,
        binCode: 'BIN_CODE_1',
        destinationBinCode: 'BIN_CODE_1'
      };

      const result = component.checkSameBinError(item);

      expect(result).toBeTruthy();
    });

    it('should render error item with error border ', () => {
      component.itemList[0] = {
        ...component.itemList[0],
        isSelected: true,
        binCode: 'BIN_CODE_1',
        destinationBinCode: 'BIN_CODE_1'
      };
      const expected = 1;

      fixture.detectChanges();

      const actualItems = page.errorItems.length;

      expect(actualItems).toEqual(expected);
    });

    it('should not render error border for other items ', () => {
      const expected = 0;

      component.itemList[0] = {
        ...component.itemList[0],
        isSelected: true,
        binCode: 'BIN_CODE_1',
        destinationBinCode: 'BIN_CODE_2'
      };

      fixture.detectChanges();

      const actualItems = page.errorItems.length;

      expect(actualItems).toEqual(expected);
    });
  });

  it('should not render item when count is 0', () => {
    const expected = 0;
    component.count = 0;

    fixture.detectChanges();

    const actualItems = page.items.length;

    const actualHistoryItems = page.historyItems.length;

    expect(actualItems).toEqual(expected);
    expect(actualHistoryItems).toEqual(expected);
  });

  it('Number rendered item should be equal to the number of items passed', () => {
    const expected = testItems.length;
    component.itemList = testItems;
    component.count = 10;

    fixture.detectChanges();

    const actual = page.items.length;

    expect(actual).toEqual(expected);
  });

  it('Number rendered item should be equal to the number of items passed for histroy', () => {
    const expected = testItems.length;
    component.itemList = testItems;
    component.count = 10;
    component.isHistory = true;

    fixture.detectChanges();

    const actual = page.historyItems.length;

    expect(actual).toEqual(expected);
  });
});
