import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';

import { RouterTestingModule } from '@angular/router/testing';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HistoryDetailsComponent,
  searchShortcutKey,
  filterShortcutKey,
  sortShortcutKey,
  backShortcutKey
} from './history-details.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Pipe,
  PipeTransform,
  NO_ERRORS_SCHEMA,
  DebugElement
} from '@angular/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  OverlayNotificationServiceAbstraction,
  ItemDetailPopupserviceAbstraction,
  BinToBinTransferTypeEnum,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationEventType,
  BinToBinTransferHistoryItemHeader,
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
import { By } from '@angular/platform-browser';
import { BinToBinTransferFacade } from '@poss-web/eposs/bin-bin-transfer/data-access-bin-bin-transfer';
import { getBintoBinTransferRouteUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
@Pipe({
  name: 'translate'
})
class TranslatePipeStub implements PipeTransform {
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

@Pipe({
  name: 'dateFormatter'
})
class DateFromatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

class Page {
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
    return this.query('poss-web-bin-to-bin-transfer-item-list');
  }

  get binSelection() {
    return this.query('button');
  }

  private fixture: ComponentFixture<HistoryDetailsComponent>;

  constructor(fixture: ComponentFixture<HistoryDetailsComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('HistoryDetailsComponent', () => {
  let component: HistoryDetailsComponent;
  let fixture: ComponentFixture<HistoryDetailsComponent>;
  let binToBinTransferFacadeSpy;
  let appsettingFacadeSpy;
  let overlayNotificationServiceSpy;
  let selectionDialogServiceSpy;
  let filterServiceSpy;
  let sortServiceSpy;
  let itemDetailPopupserviceSpy;
  let page: Page;

  beforeEach(() => {
    binToBinTransferFacadeSpy = jasmine.createSpyObj([
      'loadProductGroupOptions',
      'loadProductCategoryOptions',
      'loadSourceBinOptions',
      'getProductGroupOptions',
      'getProductCategoryOptions',
      'getSoruceBinOptions',
      'getError',
      'clearItems',
      'getItemList',
      'getIsLoadingItems',
      'getIsLoadingItemsSuccess',
      'getIsLoadingSelectedHistory',
      'getItemsTotalCount',
      'loadSelectedHistory',
      'getSelectedHistory',
      'getHasSelectedHistory',
      'loadStuddedProductGroups'
    ]);
    appsettingFacadeSpy = jasmine.createSpyObj([
      'getPageSizeOptions',
      'getMaxFilterLimit',
      'getMaxSortLimit',
      'getPageSize'
    ]);
    overlayNotificationServiceSpy = jasmine.createSpyObj(['show', 'close']);
    selectionDialogServiceSpy = jasmine.createSpyObj(['open']);

    filterServiceSpy = jasmine.createSpyObj(['openDialog']);
    sortServiceSpy = jasmine.createSpyObj(['openDialog']);
    itemDetailPopupserviceSpy = jasmine.createSpyObj(['open']);

    TestBed.configureTestingModule({
      declarations: [
        HistoryDetailsComponent,
        TranslatePipeStub,
        WeightFromatterPipeStub,
        CurrencyFormatterPipeStub,
        DateFromatterPipeStub
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        CommonCustomMaterialModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: BinToBinTransferFacade,
          useValue: binToBinTransferFacadeSpy
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
                _value: 'Bangle',
                type: BinToBinTransferTypeEnum.HISTORY
              }
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(HistoryDetailsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    component['searchRef'] = new ItemSearchComponent(
      new FormBuilder(),
      new BarcodeReaderService()
    );

    spyOn(component['router'], 'navigate');
    binToBinTransferFacadeSpy.getProductGroupOptions.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getProductCategoryOptions.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getSoruceBinOptions.and.returnValue(of([]));

    binToBinTransferFacadeSpy.getItemsTotalCount.and.returnValue(of(10));
    binToBinTransferFacadeSpy.getSelectedHistory.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getHasSelectedHistory.and.returnValue(of(false));
    binToBinTransferFacadeSpy.getError.and.returnValue(of(null));

    appsettingFacadeSpy.getMaxFilterLimit.and.returnValue(of(5));
    appsettingFacadeSpy.getPageSizeOptions.and.returnValue(of([5, 10, 25, 50]));
    appsettingFacadeSpy.getMaxSortLimit.and.returnValue(of(1));
    appsettingFacadeSpy.getPageSize.and.returnValue(of(10));
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
  describe('onInit', () => {
    beforeEach(() => {
      spyOn<any>(component, 'componentInit');
    });
    it('should send action to load source bins product-category  and product-Groups', () => {
      component.ngOnInit();

      expect(
        binToBinTransferFacadeSpy.loadProductGroupOptions
      ).toHaveBeenCalled();
      expect(
        binToBinTransferFacadeSpy.loadProductCategoryOptions
      ).toHaveBeenCalled();
    });

    it('should send shortcut events to shortcutEventHandler', () => {
      spyOn<any>(component, 'shortcutEventHandler');

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
      binToBinTransferFacadeSpy.getProductGroupOptions.and.returnValue(
        of(productGroups)
      );
      spyOn<any>(component, 'mapToFilterOptions').and.returnValue(result);

      component.ngOnInit();

      expect(component['mapToFilterOptions']).toHaveBeenCalledWith(
        component.productGroupFilterLable,
        productGroupsMappedData
      );
      expect(component['productGroups']).toEqual(expected);
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
      binToBinTransferFacadeSpy.getProductCategoryOptions.and.returnValue(
        of(productCategory)
      );
      spyOn<any>(component, 'mapToFilterOptions').and.returnValue(result);

      component.ngOnInit();

      expect(component['mapToFilterOptions']).toHaveBeenCalledWith(
        component.productCategoryFilterLable,
        productCategoryMappedData
      );
      expect(component['productCategories']).toEqual(expected);
    });

    it('should load appsetting data and call component init function', () => {
      const pageSize = 12;
      const maxFilterLimit = 10;
      const maxSortLimit = 2;
      const pageSizeOptions = [10, 10, 5];

      appsettingFacadeSpy.getMaxFilterLimit.and.returnValue(of(maxFilterLimit));
      appsettingFacadeSpy.getPageSizeOptions.and.returnValue(
        of(pageSizeOptions)
      );
      appsettingFacadeSpy.getMaxSortLimit.and.returnValue(of(maxSortLimit));
      appsettingFacadeSpy.getPageSize.and.returnValue(of(pageSize));

      component.ngOnInit();

      expect(component.initailPageEvent.pageSize).toEqual(pageSize);
      expect(component['maxFilterLimit']).toEqual(maxFilterLimit);
      expect(component['maxSortLimit']).toEqual(maxSortLimit);
      expect(component.pageSizeOptions).toEqual(pageSizeOptions);

      expect(component['componentInit']).toHaveBeenCalled();
    });
  });

  it('should navigate to bin to bin  list page on back', () => {
    component.back();

    expect(component['router'].navigate).toHaveBeenCalledWith(
      [getBintoBinTransferRouteUrl(BinToBinTransferTypeEnum.HISTORY)],
      { state: { clearFilter: false } }
    );
  });

  describe('onSearchClear', () => {
    it('should call loadItems by setting itemCode and lotNumber', () => {
      spyOn<any>(component, 'loadHistoryItems');

      component.onSearchClear();

      expect(component['loadHistoryItems']).toHaveBeenCalled();
      expect(component.itemCode).toBeNull();
      expect(component.lotNumber).toBeNull();
    });

    it('should set page to first', () => {
      spyOn<any>(component, 'loadHistoryItems');

      component.onSearchClear();

      expect(component['itemListPageEvent']).toEqual(
        component.initailPageEvent
      );
    });

    it('should call onSearchClear when search clear is triggered ', () => {
      spyOn(component, 'onSearchClear');

      fixture.detectChanges();
      page.search.triggerEventHandler('clear', null);

      expect(component.onSearchClear).toHaveBeenCalled();
    });
  });

  describe('openFilter', () => {
    it('should open filter dialog ', () => {
      filterServiceSpy.openDialog.and.returnValue(of({ actionfrom: 'close' }));

      component.openFilter();

      expect(filterServiceSpy.openDialog).toHaveBeenCalledWith(
        component['maxFilterLimit'],
        component['filterData']
      );
    });

    it('should call load items on apply and set to first page', () => {
      filterServiceSpy.openDialog.and.returnValue(
        of({ actionfrom: 'apply', data: null })
      );
      spyOn<any>(component, 'loadHistoryItems');

      component.openFilter();

      expect(component['loadHistoryItems']).toHaveBeenCalledWith();
      expect(component.itemListPageEvent).toEqual(component.initailPageEvent);
    });

    it('should extract the selected options and convert to an array', () => {
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
      spyOn<any>(component, 'loadHistoryItems');

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
        component['maxSortLimit'],
        component['sortData']
      );
    });
    it('should call load items on apply and set to first page', () => {
      sortServiceSpy.openDialog.and.returnValue(
        of({ actionfrom: 'apply', data: null })
      );

      spyOn<any>(component, 'loadHistoryItems');

      component.openSortDailog();

      expect(component['loadHistoryItems']).toHaveBeenCalledWith();
      expect(component.itemListPageEvent).toEqual(component.initailPageEvent);
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
      spyOn<any>(component, 'loadHistoryItems');

      component.openSortDailog();

      expect(component.sortBy).toEqual('issuedWeight');
      expect(component.sortOrder).toEqual('ASC');

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

  describe('paginate', () => {
    it('should call loadItems setting page options', () => {
      spyOn<any>(component, 'loadHistoryItems');

      const pageEvent = {
        pageIndex: 12,
        pageSize: 19,
        length: 30
      };

      component.paginate(pageEvent);

      expect(component['loadHistoryItems']).toHaveBeenCalled();
      expect(component.itemListPageEvent).toEqual(pageEvent);
    });
  });

  describe('Search', () => {
    it('should set the search paramters and call load items', () => {
      spyOn<any>(component, 'loadHistoryItems');
      const itemCode = 'RET123';
      const lotNumber = 'LOT123';
      component.search({
        searchValue: itemCode,
        lotNumber: lotNumber,
        isValid: true
      });

      expect(component['loadHistoryItems']).toHaveBeenCalled();
      expect(component.itemCode).toEqual(itemCode);
      expect(component.lotNumber).toEqual(lotNumber);
      expect(component.itemListPageEvent).toEqual(component.initailPageEvent);
    });

    it('should render item search', () => {
      fixture.detectChanges();

      expect(page.search).not.toBeNull();
    });

    it('should call searchItems when search event is triggered ', () => {
      spyOn(component, 'search');

      fixture.detectChanges();
      page.search.triggerEventHandler('search', null);

      expect(component.search).toHaveBeenCalled();
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
        error: error
      });
    });

    it('should set has notifcations to false on close error notifcation', () => {
      const error: CustomErrors = {
        code: 'ERR-INV-019',
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

      component['errorHandler'](error);

      expect(component.hasNotification).toBeFalsy();
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

  describe('Componet Init', () => {
    beforeEach(() => {
      spyOn<any>(component, 'errorHandler');
      spyOn<any>(component, 'loadHistoryItems');
    });

    it('should send actions to  selected history ', () => {
      component['componentInit']();

      expect(
        binToBinTransferFacadeSpy.loadSelectedHistory
      ).toHaveBeenCalledWith({
        id: component['activatedRoute'].snapshot.params['_value']
      });
    });

    it('should send actions to  selected history items ', () => {
      binToBinTransferFacadeSpy.getHasSelectedHistory.and.returnValue(of(true));

      component['componentInit']();

      expect(component['loadHistoryItems']).toHaveBeenCalled();
    });

    it('should load items count and set it to itemsTotalCount ', () => {
      const count = 11;
      binToBinTransferFacadeSpy.getItemsTotalCount.and.returnValue(of(count));

      component['componentInit']();

      expect(component.itemsTotalCount).toEqual(count);
    });

    it('should load items and set it to itesm ', () => {
      const items: BinToBinTransferHistoryItemHeader = {
        id: 'TestId',
        transactionType: 'BTB',
        locationCode: 'URB',
        srcDocNo: 111,
        srcFiscalYear: 2020,
        srcDocDate: moment(),
        destDocNo: 12122,
        destDocDate: '12-MAR-2020',
        totalAvailableQuantity: 10,
        totalMeasuredQuantity: 10,
        locationCodeDescription: 'Desc',
        totalAvailableValue: 10,
        totalMeasuredValue: 10,
        totalAvailableWeight: 10,
        totalMeasuredWeight: 10,
        carrierDetails: {},
        weightUnit: 'gms',
        currencyCode: 'INR',
        status: 'status',
        destFiscalYear: 2019,
        remarks: 'remarks',
        otherDetails: {}
      };
      binToBinTransferFacadeSpy.getSelectedHistory.and.returnValue(of(items));

      component['componentInit']();

      expect(component.item).toEqual(items);
    });

    it('should call error handler on error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      binToBinTransferFacadeSpy.getError.and.returnValue(of(error));

      component['componentInit']();

      expect(component['errorHandler']).toHaveBeenCalledWith(error);
    });
  });

  describe('Item', () => {
    it('should render items', () => {
      fixture.detectChanges();

      expect(page.itemList).not.toBeNull();
    });

    it('should call paginate when paginator event is triggered ', () => {
      spyOn(component, 'paginate');

      fixture.detectChanges();
      page.itemList.triggerEventHandler('paginator', null);

      expect(component.paginate).toHaveBeenCalled();
    });
  });

  describe('loader', () => {
    it('should show loader if any of the operation is in progress', () => {
      binToBinTransferFacadeSpy.getIsLoadingSelectedHistory.and.returnValue(
        of(false)
      );
      binToBinTransferFacadeSpy.getIsLoadingItems.and.returnValue(of(true));

      fixture.detectChanges();

      expect(page.loader).not.toBeNull();
    });

    it('should not show loader if any of the operation is in progress', () => {
      binToBinTransferFacadeSpy.getIsLoadingSelectedHistory.and.returnValue(
        of(false)
      );
      binToBinTransferFacadeSpy.getIsLoadingItems.and.returnValue(of(false));
      fixture.detectChanges();

      expect(page.loader).toBeNull();
    });
  });
});
