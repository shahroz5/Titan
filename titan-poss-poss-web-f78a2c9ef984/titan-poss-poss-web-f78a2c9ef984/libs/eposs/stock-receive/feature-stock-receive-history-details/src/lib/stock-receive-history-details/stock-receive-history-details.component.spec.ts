import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';

import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  StockReceiveHistoryDetailsComponent,
  searchShortcutKey,
  filterShortcutKey,
  sortShortcutKey,
  backShortcutKey
} from './stock-receive-history-details.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Pipe,
  PipeTransform,
  NO_ERRORS_SCHEMA,
  DebugElement
} from '@angular/core';
import { StockReceiveFacade } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  OverlayNotificationServiceAbstraction,
  ItemDetailPopupserviceAbstraction,
  StockReceiveTypesEnum,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationEventType,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { FilterService } from '@poss-web/shared/components/ui-filter-dialog';
import { SortDialogService } from '@poss-web/shared/components/ui-sort-dialog';
import { ActivatedRoute } from '@angular/router';
import { ItemSearchComponent } from '@poss-web/shared/item/ui-item-search';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import {
  getStockReceiveRouteUrl,
  getNotFoundRouteUrl
} from '@poss-web/shared/util-site-routes';
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
  get courierReceivedDate() {
    return this.query('mat-form-field');
  }

  get filter() {
    return this.query('#filter');
  }

  get sort() {
    return this.query('#sort');
  }
  get loader() {
    return this.query('poss-web-loader');
  }

  get search() {
    return this.query('poss-web-item-search');
  }

  get itemList() {
    return this.query('poss-web-stock-receive-item-list');
  }

  get assignBinToAll() {
    return this.query('button');
  }

  private fixture: ComponentFixture<StockReceiveHistoryDetailsComponent>;

  constructor(fixture: ComponentFixture<StockReceiveHistoryDetailsComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('StockReceiveHistoryDetailsComponent', () => {
  let component: StockReceiveHistoryDetailsComponent;
  let fixture: ComponentFixture<StockReceiveHistoryDetailsComponent>;
  let stockReceiveFacadeSpy;
  let appsettingFacadeSpy;
  let overlayNotificationServiceSpy;
  let selectionDialogServiceSpy;
  let profiledatafacadeSpy;
  let filterServiceSpy;
  let sortServiceSpy;
  let itemDetailPopupserviceSpy;
  let page: Page;

  beforeEach(() => {
    stockReceiveFacadeSpy = jasmine.createSpyObj([
      'resetError',
      'loadStuddedProductGroups',
      'loadProductGroups',
      'loadProductCategories',
      'getProductGroups',
      'getProductCategories',
      'loadItems',
      'getIsLoadingSelectedStock',
      'getItems',
      'getIsItemsLoading',
      'getIsItemsLoaded',
      'getItemsCount',
      'getError',
      'loadSelectedStock',
      'getSelectedStock',
      'loadSelectedInvoice',
      'getSelectedInvoice'
    ]);
    appsettingFacadeSpy = jasmine.createSpyObj([
      'getPageSizeOptions',
      'getMaxFilterLimit',
      'getMaxSortLimit',
      'getPageSize'
    ]);
    overlayNotificationServiceSpy = jasmine.createSpyObj(['show', 'close']);
    selectionDialogServiceSpy = jasmine.createSpyObj(['open']);
    profiledatafacadeSpy = jasmine.createSpyObj([
      'getBoutiqueType',
      'isL1Boutique',
      'isL2Boutique',
      'isL3Boutique'
    ]);
    filterServiceSpy = jasmine.createSpyObj(['openDialog']);
    sortServiceSpy = jasmine.createSpyObj(['openDialog']);
    itemDetailPopupserviceSpy = jasmine.createSpyObj(['open']);

    TestBed.configureTestingModule({
      declarations: [
        StockReceiveHistoryDetailsComponent,
        TranslatePipeStub,
        DateFromatterPipeStub,
        WeightFromatterPipeStub,
        CurrencyFormatterPipeStub
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        CommonCustomMaterialModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: StockReceiveFacade,
          useValue: stockReceiveFacadeSpy
        },
        {
          provide: AppsettingFacade,
          useValue: appsettingFacadeSpy
        },
        {
          provide: OverlayNotificationServiceAbstraction,
          useValue: overlayNotificationServiceSpy
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
        },
        {
          provide: ShortcutServiceAbstraction,
          useValue: {
            commands: of(new Command())
          }
        },
        {
          provide: SelectionDialogService,
          useValue: selectionDialogServiceSpy
        },
        {
          provide: ProfileDataFacade,
          useValue: profiledatafacadeSpy
        },
        {
          provide: FilterService,
          useValue: filterServiceSpy
        },
        {
          provide: SortDialogService,
          useValue: sortServiceSpy
        },
        {
          provide: ItemDetailPopupserviceAbstraction,
          useValue: itemDetailPopupserviceSpy
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                _id: 'Test123',
                type: 'factory',
                tab: 'verified'
              }
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(StockReceiveHistoryDetailsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);

    component['searchRef'] = new ItemSearchComponent(
      new FormBuilder(),
      new BarcodeReaderService()
    );

    component.selectedStock = {
      id: 111,
      srcDocNo: 111,
      srcLocationCode: 'TestLocation',
      type: 'courier',
      courierDetails: {
        type: 'TEST',
        data: {
          companyName: 'Test',
          docketNumber: 'Test',
          lockNumber: 'Test',
          roadPermitNumber: 'Test',
          employeeId: 'Test',
          employeeMobileNumber: 'Test',
          employeeName: 'Test'
        }
      },
      orderType: 'R',
      courierReceivedDate: moment(),
      totalAvailableValue: 10,
      totalAvailableWeight: 10,
      totalAvailableQuantity: 10,
      totalMeasuredQuantity: 10,
      totalMeasuredValue: 10,
      totalMeasuredWeight: 10,
      srcDocDate: moment(),
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'issued',
      srcFiscalYear: 2020,
      destDocDate: moment(),
      destDocNo: 111,
      destLocationCode: 'TestCode',
      srcLocationDescription: 'Description',
      destLocationDescription: 'Description'
    };

    spyOn(component['router'], 'navigate');
    appsettingFacadeSpy.getMaxFilterLimit.and.returnValue(of(5));
    appsettingFacadeSpy.getPageSizeOptions.and.returnValue(of([5, 10, 25, 50]));
    appsettingFacadeSpy.getMaxSortLimit.and.returnValue(of(1));
    stockReceiveFacadeSpy.getProductGroups.and.returnValue(of([]));
    stockReceiveFacadeSpy.getProductCategories.and.returnValue(of([]));
    profiledatafacadeSpy.getBoutiqueType.and.returnValue(of('L1'));
    profiledatafacadeSpy.isL1Boutique.and.returnValue(of(true));
    profiledatafacadeSpy.isL2Boutique.and.returnValue(of(false));
    profiledatafacadeSpy.isL3Boutique.and.returnValue(of(false));
    appsettingFacadeSpy.getPageSize.and.returnValue(of(10));
    stockReceiveFacadeSpy.getIsItemsLoaded.and.returnValue(of(false));
    stockReceiveFacadeSpy.getItems.and.returnValue(of([]));
    stockReceiveFacadeSpy.getError.and.returnValue(of(null));
    stockReceiveFacadeSpy.getSelectedStock.and.returnValue(of(null));
    stockReceiveFacadeSpy.getSelectedInvoice.and.returnValue(of(null));
    stockReceiveFacadeSpy.getItemsCount.and.returnValue(of(10));
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('onInit', () => {
    beforeEach(() => {
      spyOn<any>(component, 'componentInit');
    });
    it('should send action to reset-error, load product-category  and product-Groups', () => {
      component.ngOnInit();

      expect(stockReceiveFacadeSpy.resetError).toHaveBeenCalled();
      expect(stockReceiveFacadeSpy.loadProductGroups).toHaveBeenCalled();
      expect(stockReceiveFacadeSpy.loadStuddedProductGroups).toHaveBeenCalled();
      expect(stockReceiveFacadeSpy.loadProductCategories).toHaveBeenCalled();
    });

    it('should send shortcut events to shortcutEventHandler', () => {
      spyOn<any>(component, 'shortcutEventHandler');
      profiledatafacadeSpy.isL1Boutique.and.returnValue(of(false));
      profiledatafacadeSpy.isL2Boutique.and.returnValue(of(true));

      component.ngOnInit();

      expect(component['shortcutEventHandler']).toHaveBeenCalled();
    });

    it('should call mapToFilterOptions and set value to productGroups when Product Groups are loaded', () => {
      component.productGroupFilterLable = 'Product Groups';

      const productGroups = [
        {
          description: 'Test1',
          productGroupCode: 'Test1'
        },
        { description: 'Test2', productGroupCode: 'Test2' }
      ];

      const productGroupsMappedData = [
        {
          id: 'Test1',
          description: 'Test1',
          selected: false
        },
        {
          id: 'Test2',
          description: 'Test2',
          selected: false
        }
      ];

      const result = {
        'Product Groups': productGroupsMappedData
      };

      const expected = result;
      stockReceiveFacadeSpy.getProductGroups.and.returnValue(of(productGroups));
      spyOn<any>(component, 'mapToFilterOptions').and.returnValue(result);

      component.ngOnInit();

      expect(component['mapToFilterOptions']).toHaveBeenCalledWith(
        component.productGroupFilterLable,
        productGroupsMappedData
      );
      expect(component.productGroups).toEqual(expected);
    });

    it('should call mapToFilterOptions and set value to productCategories when Product Categories are loaded', () => {
      component.productCategoryFilterLable = 'Product Category';

      const productCategory = [
        {
          description: 'Test1',
          productCategoryCode: 'Test1'
        },
        { description: 'Test2', productCategoryCode: 'Test2' }
      ];

      const productCategoryMappedData = [
        {
          id: 'Test1',
          description: 'Test1',
          selected: false
        },
        {
          id: 'Test2',
          description: 'Test2',
          selected: false
        }
      ];

      const result = {
        'Product Category': productCategoryMappedData
      };

      const expected = result;
      stockReceiveFacadeSpy.getProductCategories.and.returnValue(
        of(productCategory)
      );
      spyOn<any>(component, 'mapToFilterOptions').and.returnValue(result);

      component.ngOnInit();

      expect(component['mapToFilterOptions']).toHaveBeenCalledWith(
        component.productCategoryFilterLable,
        productCategoryMappedData
      );
      expect(component.productCategories).toEqual(expected);
    });

    it('should load appsetting data and call component init function', () => {
      component.ngOnInit();

      expect(component['componentInit']).toHaveBeenCalled();
    });
  });

  it('should navigate to stock-receive list page on back', () => {
    const type = 'factory';
    component.requestType = type;

    component.back();

    expect(component['router'].navigate).toHaveBeenCalledWith(
      [getStockReceiveRouteUrl(StockReceiveTypesEnum.HISTORY), type],
      { state: { clearFilter: false } }
    );
  });

  describe('clearSearchItems', () => {
    it('should call loadItems by setting itemCode and lotNumber null', () => {
      spyOn<any>(component, 'loadItems');
      spyOn<any>(component['searchRef'], 'reset');

      component.clearSearchItems();

      expect(component['loadItems']).toHaveBeenCalled();
      expect(component.itemCode).toBeNull();
      expect(component.lotNumber).toBeNull();
    });

    it('should set page to first', () => {
      spyOn<any>(component, 'loadItems');
      spyOn<any>(component['searchRef'], 'reset');

      component.clearSearchItems();

      expect(component['itemsPageEvent']).toEqual(component.initailPageEvent);
    });

    it('should call item-search reset', () => {
      spyOn<any>(component, 'loadItems');
      spyOn<any>(component['searchRef'], 'reset');

      component.clearSearchItems();

      expect(component['searchRef'].reset).toHaveBeenCalled();
    });
  });

  describe('paginate', () => {
    it('should call loadItems setting page options', () => {
      spyOn<any>(component, 'loadItems');
      spyOn<any>(component['searchRef'], 'reset');

      const pageEvent = {
        pageIndex: 12,
        pageSize: 19,
        length: 30
      };

      component.paginate(pageEvent);

      expect(component['loadItems']).toHaveBeenCalled();
      expect(component.itemsPageEvent).toEqual(pageEvent);
    });
  });

  describe('shortcutEventHandler', () => {
    it('should focus on search', () => {
      const command = new Command();
      command.name = searchShortcutKey;
      spyOn<any>(component['searchRef'], 'focus');
      component['shortcutEventHandler'](command);

      expect(component['searchRef'].focus).toHaveBeenCalled();
    });

    it('should open filter popup', () => {
      const command = new Command();
      command.name = filterShortcutKey;
      spyOn(component, 'openFilter');
      component['shortcutEventHandler'](command);

      expect(component.openFilter).toHaveBeenCalled();
    });

    it('should open sort popup', () => {
      const command = new Command();
      command.name = sortShortcutKey;
      spyOn(component, 'openSortDailog');
      component['shortcutEventHandler'](command);

      expect(component.openSortDailog).toHaveBeenCalled();
    });

    it('should navigate back', () => {
      const command = new Command();
      command.name = backShortcutKey;
      spyOn(component, 'back');
      component['shortcutEventHandler'](command);

      expect(component.back).toHaveBeenCalled();
    });
  });

  describe('Item', () => {
    it('searchItems : should set the search paramters and call load items', () => {
      spyOn<any>(component, 'loadItems');
      const itemCode = 'RET123';
      const lotNumber = 'LOT123';
      component.searchItems({
        searchValue: itemCode,
        lotNumber: lotNumber,
        isValid: true
      });

      expect(component['loadItems']).toHaveBeenCalled();
      expect(component.itemCode).toEqual(itemCode);
      expect(component.lotNumber).toEqual(lotNumber);
      expect(component.itemsPageEvent).toEqual(component.initailPageEvent);
    });

    it('should render item list ', () => {
      fixture.detectChanges();

      expect(page.itemList).not.toBeNull();
    });

    it('should call paginate when search paginator is triggered ', () => {
      spyOn(component, 'paginate');

      fixture.detectChanges();
      page.itemList.triggerEventHandler('paginator', null);

      expect(component.paginate).toHaveBeenCalled();
    });
  });

  describe('errorHandler', () => {
    it('should open error notifcation', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      overlayNotificationServiceSpy.show.and.returnValue({ events: of() });

      component['errorHandler'](error);

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error,
        hasBackdrop: false
      });
    });

    it('should set back if stock-not found', () => {
      const error: CustomErrors = {
        code: 'ERR-INV-029',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      overlayNotificationServiceSpy.show.and.returnValue({ events: of() });

      component['errorHandler'](error);

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error,
        hasBackdrop: true
      });
    });

    it('should navigate back  if stock-not found ', () => {
      const error: CustomErrors = {
        code: 'ERR-INV-029',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({
          eventType: OverlayNotificationEventType.CLOSE
        })
      });
      spyOn(component, 'back');

      component['errorHandler'](error);

      expect(component.back).toHaveBeenCalled();
    });
  });

  describe('openFilter', () => {
    it('should open filter dialog ', () => {
      filterServiceSpy.openDialog.and.returnValue(of({ actionfrom: 'close' }));

      component.openFilter();

      expect(filterServiceSpy.openDialog).toHaveBeenCalledWith(
        component.maxFilterLimit,
        component.filterData
      );
    });

    it('should call load items on apply and set to first page', () => {
      filterServiceSpy.openDialog.and.returnValue(
        of({ actionfrom: 'apply', data: null })
      );
      spyOn<any>(component, 'loadItems');

      component.openFilter();

      expect(component['loadItems']).toHaveBeenCalledWith();
      expect(component.itemsPageEvent).toEqual(component.initailPageEvent);
    });

    it('should extract the selected options and convert to an arry', () => {
      component.productGroupFilterLable = 'Product Group';
      component.productCategoryFilterLable = 'Product Category';
      const filterData = {
        [component.productGroupFilterLable]: [
          { id: '123451', description: '123451 desc', selected: true },
          { id: 'BD', description: '800 - S01BDAA', selected: true }
        ],
        [component.productCategoryFilterLable]: [
          { id: 'B6', description: 'Bi-Metal Plain', selected: true },
          { id: '7', description: 'Clocky', selected: true }
        ]
      };
      filterServiceSpy.openDialog.and.returnValue(
        of({
          actionfrom: 'apply',
          data: filterData
        })
      );
      spyOn<any>(component, 'loadItems');

      component.openFilter();

      const optionsMap = new Map();
      component.filter.forEach(e => optionsMap.set(e.key, e.value));
      expect(optionsMap.get('productCategory')).toEqual(
        filterData[component.productCategoryFilterLable].map(i => i.id)
      );
      expect(optionsMap.get('productGroup')).toEqual(
        filterData[component.productGroupFilterLable].map(i => i.id)
      );
    });
    it('should render filter option', () => {
      fixture.detectChanges();

      expect(page.filter).not.toBeNull();
    });

    it('should call openFilter on click ', () => {
      spyOn(component, 'openFilter');

      fixture.detectChanges();
      page.filter.triggerEventHandler('click', null);

      expect(component.openFilter).toHaveBeenCalled();
    });
  });

  describe('openSortDailog', () => {
    it('should open filter dialog ', () => {
      sortServiceSpy.openDialog.and.returnValue(of({ actionfrom: 'close' }));

      component.openSortDailog();

      expect(sortServiceSpy.openDialog).toHaveBeenCalledWith(
        component.maxSortLimit,
        component.sortData
      );
    });
    it('should call load items on apply and set to first page', () => {
      sortServiceSpy.openDialog.and.returnValue(
        of({ actionfrom: 'apply', data: null })
      );

      spyOn<any>(component, 'loadItems');

      component.openSortDailog();

      expect(component['loadItems']).toHaveBeenCalledWith();
      expect(component.itemsPageEvent).toEqual(component.initailPageEvent);
    });

    it('should extract the selected options  and set sort', () => {
      sortServiceSpy.openDialog.and.returnValues(
        of({
          actionfrom: 'apply',
          data: [
            {
              id: 0,
              sortByColumnName: 'Gross Wt.',
              sortAscOrder: true
            }
          ]
        }),
        of({
          actionfrom: 'apply',
          data: [
            {
              id: 1,
              sortByColumnName: 'Qty.',
              sortAscOrder: false
            }
          ]
        })
      );
      spyOn<any>(component, 'loadItems');

      component.openSortDailog();

      expect(component.sortBy).toEqual('issuedWeight');
      expect(component.sortOrder).toEqual('asc');

      component.openSortDailog();

      expect(component.sortBy).toEqual('issuedQuantity');
      expect(component.sortOrder).toEqual('DESC');
    });

    it('should render sort option', () => {
      fixture.detectChanges();

      expect(page.sort).not.toBeNull();
    });

    it('should call openSortDailog on click ', () => {
      spyOn(component, 'openSortDailog');

      fixture.detectChanges();
      page.sort.triggerEventHandler('click', null);

      expect(component.openSortDailog).toHaveBeenCalled();
    });
  });

  describe('Componet Init', () => {
    beforeEach(() => {
      spyOn<any>(component, 'errorHandler');
      spyOn<any>(component, 'loadItems');
    });

    it('should call error handler on error', () => {
      component.isL3Store = true;

      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      stockReceiveFacadeSpy.getError.and.returnValue(of(error));

      component['componentInit']();

      expect(component['errorHandler']).toHaveBeenCalledWith(error);
    });

    it('should call loadSelectedStock for L1/L2', () => {
      component.isL1L2Store = true;
      const stockId = '123';

      component.stockId = stockId;
      component.historyAPIType = 'TEST';

      component['componentInit']();

      expect(stockReceiveFacadeSpy.loadSelectedStock).toHaveBeenCalledWith({
        id: stockId,
        type: StockReceiveTypesEnum.HISTORY,
        historyAPIType: component.historyAPIType
      });
    });

    it('should set the selected stock and call load items L1/L2', () => {
      const selectedStock = { ...component.selectedStock, id: 122212 };
      stockReceiveFacadeSpy.getSelectedStock.and.returnValue(of(selectedStock));
      component.isL1L2Store = true;
      const stockId = '123';

      component.stockId = stockId;

      component['componentInit']();

      expect(component.loadItems).toHaveBeenCalled();
      expect(component.selectedStock).toEqual(selectedStock);
    });

    it('should call loadSelectedInvoice for L3', () => {
      component.isL3Store = true;
      const stockId = '123';

      component.stockId = stockId;
      component.historyAPIType = 'TEST';

      component['componentInit']();

      expect(stockReceiveFacadeSpy.loadSelectedInvoice).toHaveBeenCalledWith({
        id: stockId,
        type: StockReceiveTypesEnum.HISTORY,
        historyAPIType: component.historyAPIType
      });
    });

    it('should set the selected stock and call load items L3', () => {
      const selectedStock = { ...component.selectedStock, id: 122212 };
      stockReceiveFacadeSpy.getSelectedInvoice.and.returnValue(
        of(selectedStock)
      );
      component.isL3Store = true;
      const stockId = '123';

      component.stockId = stockId;

      component['componentInit']();

      expect(component.loadItems).toHaveBeenCalled();
      expect(component.selectedStock).toEqual(selectedStock);
    });

    it('should assign the counts after loading the total counts ', () => {
      const result = 19;
      stockReceiveFacadeSpy.getItemsCount.and.returnValue(of(result));

      component['componentInit']();

      expect(component.itemsCount).toEqual(result);
    });
  });

  describe('loader', () => {
    it('should show loader if any of the operation is in progress', () => {
      stockReceiveFacadeSpy.getIsItemsLoading.and.returnValue(of(false));
      stockReceiveFacadeSpy.getIsLoadingSelectedStock.and.returnValue(of(true));

      fixture.detectChanges();

      expect(page.loader).not.toBeNull();
    });

    it('should not show loader if any of the operation is no in progress', () => {
      stockReceiveFacadeSpy.getIsItemsLoading.and.returnValue(of(false));
      stockReceiveFacadeSpy.getIsLoadingSelectedStock.and.returnValue(
        of(false)
      );
      fixture.detectChanges();

      expect(page.loader).toBeNull();
    });
  });

  describe('Search', () => {
    it('should render item search', () => {
      fixture.detectChanges();

      expect(page.search).not.toBeNull();
    });

    it('should call searchItems when search event is triggered ', () => {
      spyOn(component, 'searchItems');

      fixture.detectChanges();
      page.search.triggerEventHandler('search', null);

      expect(component.searchItems).toHaveBeenCalled();
    });

    it('should call clearSearchItems when clear event is triggered ', () => {
      spyOn(component, 'clearSearchItems');

      fixture.detectChanges();
      page.search.triggerEventHandler('clear', null);

      expect(component.clearSearchItems).toHaveBeenCalled();
    });
  });
});
