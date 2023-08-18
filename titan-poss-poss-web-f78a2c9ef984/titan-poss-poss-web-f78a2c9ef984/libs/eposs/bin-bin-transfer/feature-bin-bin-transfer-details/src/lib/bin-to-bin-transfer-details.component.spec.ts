import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';

import { RouterTestingModule } from '@angular/router/testing';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BinToBinTransferDetailsComponent,
  searchShortcutKey,
  filterShortcutKey,
  sortShortcutKey,
  backShortcutKey,
  binSelectionShortcutKey,
  clearAllShortcutKey,
  selectAllShortcutKey,
  selectCurrentPageShortcutKey
} from './bin-to-bin-transfer-details.component';
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
  BinToBinTransferTypeEnum,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationEventType,
  BinToBinTransferConfirmTransferItemsRequest,
  BinToBinTransBinsferEnum,
  BinToBinTransProductGroupCodeEnum,
  BinToBinTransProductCategoryCodeEnum,
  BinToBinTransferItem,
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
import { SelectionDialogGridService } from '@poss-web/shared/components/ui-selection-dialog-grid';

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

  get clearAll() {
    return this.query('#clearAll');
  }

  private fixture: ComponentFixture<BinToBinTransferDetailsComponent>;

  constructor(fixture: ComponentFixture<BinToBinTransferDetailsComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('BinToBinTransferDetailsComponent', () => {
  let component: BinToBinTransferDetailsComponent;
  let fixture: ComponentFixture<BinToBinTransferDetailsComponent>;
  let binToBinTransferFacadeSpy;
  let appsettingFacadeSpy;
  let overlayNotificationServiceSpy;
  let selectionDialogServiceSpy;
  let filterServiceSpy;
  let sortServiceSpy;
  let page: Page;

  const dummyItem: BinToBinTransferItem = {
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

  beforeEach(() => {
    binToBinTransferFacadeSpy = jasmine.createSpyObj([
      'loadProductGroupOptions',
      'loadProductCategoryOptions',
      'loadSourceBinOptions',
      'getProductGroupOptions',
      'getProductCategoryOptions',
      'getSoruceBinOptions',
      'updateItemList',
      'changeSelectionOfAllItems',
      'getBins',
      'getIsLoadingBins',
      'getIsLoadingItemListGroup',
      'loadBins',
      'clearItems',
      'clearConfirmTransferResponse',
      'clearSelectedItemGroup',
      'getError',
      'loadItemGroup',
      'getSelectedItemListGroup',
      'getIsLoadingSelectedItemListGroupSuccess',
      'getItemList',
      'getIsLoadingItems',
      'getItemsTotalCount',
      'getConfirmTransferResponse',
      'getIsLoadingItemsSuccess',
      'loadItems',
      'confirmTransferAllItems',
      'confirmTransferItems',
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

    TestBed.configureTestingModule({
      declarations: [
        BinToBinTransferDetailsComponent,
        TranslatePipeStub,
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
          provide: SelectionDialogGridService,
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
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                value: 'Bangle',
                type: BinToBinTransferTypeEnum.BIN_CODE
              }
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(BinToBinTransferDetailsComponent);
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

    binToBinTransferFacadeSpy.getBins.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getError.and.returnValue(of(null));
    binToBinTransferFacadeSpy.getSelectedItemListGroup.and.returnValue(
      of(null)
    );
    binToBinTransferFacadeSpy.getIsLoadingSelectedItemListGroupSuccess.and.returnValue(
      of(true)
    );
    binToBinTransferFacadeSpy.getItemList.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getItemsTotalCount.and.returnValue(of(100));
    binToBinTransferFacadeSpy.getConfirmTransferResponse.and.returnValue(
      of(null)
    );
    binToBinTransferFacadeSpy.getIsLoadingItemsSuccess.and.returnValue(
      of(true)
    );

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
      expect(binToBinTransferFacadeSpy.loadSourceBinOptions).toHaveBeenCalled();
      expect(binToBinTransferFacadeSpy.loadBins).toHaveBeenCalled();
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

    it('should call mapToFilterOptions and set value to sourceBins when source bins are loaded', () => {
      component.sourceBinFilterLable = 'Source Bin';

      const sourceBins = ['Test1', 'Test2'];

      const sourceBinMappedData = [
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
        'Source Bin': sourceBinMappedData
      };

      const expected = result;
      binToBinTransferFacadeSpy.getSoruceBinOptions.and.returnValue(
        of(sourceBins)
      );
      spyOn<any>(component, 'mapToFilterOptions').and.returnValue(result);

      component.ngOnInit();

      expect(component['mapToFilterOptions']).toHaveBeenCalledWith(
        component.sourceBinFilterLable,
        sourceBinMappedData
      );
      expect(component['sourceBins']).toEqual(expected);
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
    component.type = BinToBinTransferTypeEnum.PRODUCT_CATEGORY;
    component.back();

    expect(component['router'].navigate).toHaveBeenCalledWith([
      getBintoBinTransferRouteUrl(BinToBinTransferTypeEnum.PRODUCT_CATEGORY)
    ]);
  });

  describe('onSearchClear', () => {
    it('should call loadItems by setting itemCode and lotNumber', () => {
      spyOn<any>(component, 'loadItems');

      component.onSearchClear();

      expect(component['loadItems']).toHaveBeenCalled();
      expect(component.itemCode).toBeNull();
      expect(component.lotNumber).toBeNull();
    });

    it('should set page to first', () => {
      spyOn<any>(component, 'loadItems');

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
      spyOn<any>(component, 'loadItems');

      component.openFilter();

      expect(component['loadItems']).toHaveBeenCalledWith();
      expect(component.itemListPageEvent).toEqual(component.initailPageEvent);
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
        ],
        [component.sourceBinFilterLable]: [
          { id: '1', description: 'Bangle', selected: true },
          { id: '2', description: 'Coin', selected: true }
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
      expect(optionsMap.get('binCode')).toEqual(
        filterData[component.sourceBinFilterLable].map(i => i.id)
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

      spyOn<any>(component, 'loadItems');

      component.openSortDailog();

      expect(component['loadItems']).toHaveBeenCalledWith();
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
      spyOn<any>(component, 'loadItems');

      component.openSortDailog();

      expect(component.sortBy).toEqual('totalWeight');
      expect(component.sortOrder).toEqual('ASC');

      component.openSortDailog();

      expect(component.sortBy).toEqual('totalQuantity');
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

  describe('openBinSelectionPopup', () => {
    it('should open bin selection popup', () => {
      selectionDialogServiceSpy.open.and.returnValue(of(null));
      spyOn<any>(component, 'showNotification');

      component.openBinSelectionPopup();

      expect(selectionDialogServiceSpy.open).toHaveBeenCalled();
    });

    it('should assign bin and call showNotification function', () => {
      const bin = {
        binCode: 'BIN_CODE',
        binGroupCode: 'BIN_GROUP_CODE'
      };
      spyOn<any>(component, 'showNotification');

      selectionDialogServiceSpy.open.and.returnValue(of(bin));

      component.openBinSelectionPopup();

      expect(component.selectedBin.binCode).toEqual(bin.binCode);
      expect(component.selectedBin.binGroupCode).toEqual(
        bin.binGroupCode
      );

      expect(component['showNotification']).toHaveBeenCalled();
    });

    it('should render button to open bin selection popup ', () => {
      fixture.detectChanges();

      expect(page.binSelection).not.toBeNull();
    });

    it('should call openBinSelectionPopup when click event is triggered ', () => {
      spyOn(component, 'openBinSelectionPopup');

      fixture.detectChanges();
      page.binSelection.triggerEventHandler('click', null);

      expect(component.openBinSelectionPopup).toHaveBeenCalled();
    });
  });

  describe('paginate', () => {
    it('should call loadItems setting page options', () => {
      spyOn<any>(component, 'loadItems');

      const pageEvent = {
        pageIndex: 12,
        pageSize: 19,
        length: 30
      };

      component.paginate(pageEvent);

      expect(component['loadItems']).toHaveBeenCalled();
      expect(component.itemListPageEvent).toEqual(pageEvent);
    });
  });

  describe('Search', () => {
    it('should set the search paramters and call load items', () => {
      spyOn<any>(component, 'loadItems');
      const itemCode = 'RET123';
      const lotNumber = 'LOT123';
      component.search({
        searchValue: itemCode,
        lotNumber: lotNumber,
        isValid: true
      });

      expect(component['loadItems']).toHaveBeenCalled();
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

    it('should show other notifcations on close error notifcation', () => {
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
      spyOn<any>(component, 'showNotification');

      component['errorHandler'](error);

      expect(component['showNotification']).toHaveBeenCalled();
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

    it('should open bin selection popup', () => {
      const command = new Command();
      command.name = binSelectionShortcutKey;
      spyOn(component, 'openBinSelectionPopup');
      component['shortcutEventHandler'](command);

      expect(component.openBinSelectionPopup).toHaveBeenCalled();
    });

    it('should reset the selection of items', () => {
      const command = new Command();
      command.name = clearAllShortcutKey;
      spyOn(component, 'resetSelection');
      component['shortcutEventHandler'](command);

      expect(component.resetSelection).toHaveBeenCalled();
    });

    it('should select all the items ', () => {
      const command = new Command();
      command.name = selectAllShortcutKey;
      spyOn(component.binToBinTransferForm, 'patchValue');
      component['shortcutEventHandler'](command);

      expect(component.binToBinTransferForm.patchValue).toHaveBeenCalledWith({
        selectItems: 'selectAll'
      });
    });

    it('should not select all the items if search or filter is applied', () => {
      component.itemCode = 'ITEM_CODE';
      const command = new Command();
      command.name = selectAllShortcutKey;
      spyOn(component.binToBinTransferForm, 'patchValue');
      component['shortcutEventHandler'](command);

      expect(component.binToBinTransferForm.patchValue).not.toHaveBeenCalled();
    });

    it('should select current page items ', () => {
      const command = new Command();
      command.name = selectCurrentPageShortcutKey;
      spyOn(component.binToBinTransferForm, 'patchValue');
      component['shortcutEventHandler'](command);

      expect(component.binToBinTransferForm.patchValue).toHaveBeenCalledWith({
        selectItems: 'selectCurrentPage'
      });
    });
  });

  describe('Notification', () => {
    describe('showNotifications', () => {
      beforeEach(() => {
        spyOn<any>(component, 'showConfirmReceiveSuccessNotification');
        spyOn<any>(component, 'showConfirmTransferNotification');
        spyOn<any>(component, 'showAssignDestinationBinNotification');
        spyOn<any>(component, 'showProductSelectNotification');
      });
      it('should call  showConfirmReceiveSuccessNotification after the success of transfer ', () => {
        const transferId = 1234;
        component.confirmTransferResponse = {
          transferId: transferId
        };

        component['showNotification']();

        expect(
          component['showConfirmReceiveSuccessNotification']
        ).toHaveBeenCalledWith(transferId);
      });

      it('should call  showProductSelectNotification  when no items are selected ', () => {
        component.itemList = [dummyItem, dummyItem, dummyItem];
        component.selectedItems = [];

        component['showNotification']();

        expect(component['showProductSelectNotification']).toHaveBeenCalled();
      });

      it('should call  showAssignDestinationBinNotification  when items are selected ', () => {
        component.selectedItems = [dummyItem, dummyItem, dummyItem];
        component['isSelectAll'] = false;

        component['showNotification']();

        expect(
          component['showAssignDestinationBinNotification']
        ).toHaveBeenCalledWith(3);
      });

      it('should call  showAssignDestinationBinNotification with total count', () => {
        component.selectedItems = [dummyItem, dummyItem];
        component.binToBinTransferForm.get('selectItems').setValue('selectAll');
        component.itemsTotalCount = 100;

        component['showNotification']();

        expect(
          component['showAssignDestinationBinNotification']
        ).toHaveBeenCalledWith(100);
      });

      it('should call  showConfirmTransferNotification  when items and destination bin is selected ', () => {
        component.selectedItems = [dummyItem, dummyItem, dummyItem];
        component['isSelectAll'] = false;
        component.selectedBin = {
          binCode: 'BIN_CODE',
          binGroupCode: 'BIN_GROUP'
        };

        component['showNotification']();

        expect(
          component['showConfirmTransferNotification']
        ).toHaveBeenCalledWith(3);
      });

      it('should call  showConfirmTransferNotification  when items and destination bin is selected ', () => {
        component.selectedItems = [dummyItem, dummyItem, dummyItem];
        component.binToBinTransferForm.get('selectItems').setValue('selectAll');
        component.itemsTotalCount = 100;

        component.selectedBin = {
          binCode: 'BIN_CODE',
          binGroupCode: 'BIN_GROUP'
        };

        component['showNotification']();

        expect(
          component['showConfirmTransferNotification']
        ).toHaveBeenCalledWith(100);
      });

      it('should call close if none of the condition matches', () => {
        component.selectedItems = [];
        component.selectedBin = null;
        component.confirmTransferResponse = null;
        component.itemList = [];

        component['showNotification']();

        expect(overlayNotificationServiceSpy.close).toHaveBeenCalled();
      });
    });
    it('showProgressNotification : should call overlay notifcation serivce properly ', () => {
      const key = 'pw.binToBinTransferNotificationMessages.progressMessage';
      overlayNotificationServiceSpy.show.and.returnValue({ events: of(null) });

      component['showProgressNotification']();

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.PROGRESS,
        message: key,
        hasBackdrop: true
      });
    });

    it('showProductSelectNotification : should call overlay notifcation serivce properly ', () => {
      const key =
        'pw.binToBinTransferNotificationMessages.productSelectMessage';
      overlayNotificationServiceSpy.show.and.returnValue({ events: of(null) });

      component['showProductSelectNotification']();

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.SIMPLE,
        message: key
      });
    });

    it('showAssignDestinationBinNotification : should call overlay notifcation serivce properly ', () => {
      const key =
        'pw.binToBinTransferNotificationMessages.assignDestinationBulkBinMessage';
      overlayNotificationServiceSpy.show.and.returnValue({ events: of(null) });

      component['showAssignDestinationBinNotification']();

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.SIMPLE,
        message: 0 + ' ' + key
      });
    });

    it('showConfirmTransferNotification : should call overlay notifcation serivce properly ', () => {
      const key =
        'pw.binToBinTransferNotificationMessages.confirmTransferMessage';
      const buttonKey =
        'pw.binToBinTransferNotificationMessages.confirmTransferButtonText';

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.CLOSE })
      });

      component['showConfirmTransferNotification']();

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.ACTION,
        message: 0 + ' ' + key,
        buttonText: buttonKey
      });
    });

    it('showConfirmTransferNotification : should call confirmTransferAllItems action if all itmes are selected ', () => {
      component.binToBinTransferForm.get('selectItems').setValue('selectAll');
      component.selectedBin = {
        binCode: 'BIN_CODE',
        binGroupCode: 'BIN_GROUP'
      };

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.TRUE })
      });

      component['showConfirmTransferNotification']();

      expect(
        binToBinTransferFacadeSpy.confirmTransferAllItems
      ).toHaveBeenCalledWith({
        type: component.type,
        value: component.value,
        destinationBinCode: component.selectedBin.binCode,
        destinationBinGroupCode: component.selectedBin.binGroupCode
      });
    });

    it('showConfirmTransferNotification : should call confirmTransferItems action if all itmes are not selected ', () => {
      component['isSelectAll'] = false;
      component.selectedBin = {
        binCode: 'BIN_CODE',
        binGroupCode: 'BIN_GROUP'
      };
      component.selectedItems = [dummyItem];
      const confirmTransferRequest: BinToBinTransferConfirmTransferItemsRequest = {
        request: {
          binItems: [
            {
              inventoryId: dummyItem.id,
              binGroupCode: component.selectedBin.binGroupCode,
              binCode: component.selectedBin.binCode
            }
          ]
        },
        remove: false
      };

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.TRUE })
      });

      component['showConfirmTransferNotification']();

      expect(
        binToBinTransferFacadeSpy.confirmTransferItems
      ).toHaveBeenCalledWith(confirmTransferRequest);
    });

    it('showConfirmTransferNotification : should call progress notification', () => {
      spyOn<any>(component, 'showProgressNotification');
      component.selectedBin = {
        binCode: 'BIN_CODE',
        binGroupCode: 'BIN_GROUP'
      };

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.TRUE })
      });

      component['showConfirmTransferNotification']();

      expect(component['showProgressNotification']).toHaveBeenCalled();
    });

    it('showConfirmReceiveSuccessNotification : should call overlay notifcation serivce properly ', () => {
      const key =
        'pw.binToBinTransferNotificationMessages.confirmTransferSuccessMessage';
      overlayNotificationServiceSpy.show.and.returnValue({ events: of(null) });

      component['showConfirmReceiveSuccessNotification'](1111);

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.SUCCESS,
        message: key + ' ' + 1111,
        hasBackdrop: true,
        hasClose: true
      });
    });

    it('showConfirmReceiveSuccessNotification : should clear confirm response on close ', () => {
      overlayNotificationServiceSpy.show.and.returnValue({ events: of(null) });

      component['showConfirmReceiveSuccessNotification'](1111);

      expect(
        binToBinTransferFacadeSpy.clearConfirmTransferResponse
      ).toHaveBeenCalled();
    });

    it('showConfirmReceiveSuccessNotification : should call back if all the items in the selected soruce bin are transfered to other bin ', () => {
      component.type = BinToBinTransferTypeEnum.BIN_CODE;
      component.binToBinTransferForm.get('selectItems').setValue('selectAll');
      spyOn(component, 'back');

      overlayNotificationServiceSpy.show.and.returnValue({ events: of(null) });

      component['showConfirmReceiveSuccessNotification'](1111);

      expect(component.back).toHaveBeenCalled();
    });
  });

  describe('Item', () => {
    it('loadItems : should call loadItems action', () => {
      const type = 'TEST_TYPE';
      const value = 'VALYE';
      const itemCode = 'CODE';
      const lotNumber = '2LOT1';
      const pageIndex = 2;
      const pageSize = 10;
      const sortBy = 'wty';
      const sortOrder = 'ASC';
      const filter = [];

      component.type = type;
      component.value = value;
      component.itemCode = itemCode;
      component.lotNumber = lotNumber;
      component.itemListPageEvent.pageIndex = pageIndex;
      component.itemListPageEvent.pageSize = pageSize;
      component.sortBy = sortBy;
      component.sortOrder = sortOrder;
      component.filter = filter;

      component['loadItems']();

      expect(binToBinTransferFacadeSpy.loadItems).toHaveBeenCalledWith({
        type,
        value,
        itemCode,
        lotNumber,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        filter
      });
    });
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

    it('onUpdateItem : should call updateItemList action', () => {
      component.onUpdateItem(dummyItem);

      expect(binToBinTransferFacadeSpy.updateItemList).toHaveBeenCalledWith(
        dummyItem
      );
    });

    it('should call onUpdateItem when updateItem event is triggered ', () => {
      spyOn(component, 'onUpdateItem');

      fixture.detectChanges();
      page.itemList.triggerEventHandler('updateItem', null);

      expect(component.onUpdateItem).toHaveBeenCalled();
    });
  });

  describe('resetSelection', () => {
    it('should call changeSelectionOfAllItems action', () => {
      const allItemsId = ['Item1', 'Item2'];
      component['allItemsId'] = allItemsId;
      component['resetSelection']();

      expect(
        binToBinTransferFacadeSpy.changeSelectionOfAllItems
      ).toHaveBeenCalledWith({
        idList: allItemsId,
        select: false,
        disable: false,
        resetBin: false
      });
    });

    it('should not render clear option when items are not selected', () => {
      fixture.detectChanges();
      component.selectedItems = [];
      fixture.detectChanges();

      expect(page.clearAll).toBeNull();
    });

    it('should render clear option when items are selected', () => {
      fixture.detectChanges();
      component.selectedItems = [dummyItem];
      fixture.detectChanges();

      expect(page.clearAll).not.toBeNull();
    });

    it('should call resetSelection on click ', () => {
      spyOn(component, 'resetSelection');

      fixture.detectChanges();
      component.selectedItems = [dummyItem];
      fixture.detectChanges();

      page.clearAll.triggerEventHandler('click', null);

      expect(component.resetSelection).toHaveBeenCalled();
    });
  });
  describe('checkAndSetSelectAll', () => {
    it('set as selected current page if all the items are selected and select all is set false', () => {
      spyOn(component.binToBinTransferForm, 'patchValue');
      component['isSelectAll'] = false;

      component['selectedItems'] = [dummyItem, dummyItem, dummyItem];
      component['itemList'] = [dummyItem, dummyItem, dummyItem];
      component['checkAndSetSelectAll']();

      expect(component.binToBinTransferForm.patchValue).toHaveBeenCalledWith({
        selectItems: 'selectCurrentPage'
      });
    });

    it('do not set as selected current page if all the items are selected and select all is set true', () => {
      spyOn(component.binToBinTransferForm, 'patchValue');
      component.binToBinTransferForm.get('selectItems').setValue('selectAll');

      component['selectedItems'] = [dummyItem, dummyItem, dummyItem];
      component['itemList'] = [dummyItem, dummyItem, dummyItem];
      component['checkAndSetSelectAll']();
      expect(component.binToBinTransferForm.patchValue).not.toHaveBeenCalled();
    });

    it('clear selection if all the items are not selected', () => {
      component.binToBinTransferForm
        .get('selectItems')
        .setValue('selectCurrentPage');
      component['isSelectAll'] = false;

      component['selectedItems'] = [dummyItem, dummyItem];
      component['itemList'] = [dummyItem, dummyItem, dummyItem];
      component['checkAndSetSelectAll']();

      expect(
        !!component.binToBinTransferForm.get('selectItems').value
      ).toBeFalsy();
    });
  });

  describe('calculateSelectedItemsData', () => {
    it('should calculate total qty and value of the selected items', () => {
      const expectedQty = dummyItem.availableQuantity * 3;
      const expectedValue = dummyItem.availableValue * 3;

      component['isSelectAll'] = false;
      component.itemGroup = {
        id: '11',
        name: '75',
        products: 2,
        totalValue: 417059.68,
        totalWeight: 145.667,
        currencyCode: 'INR',
        weightUnit: 'gms',
        description: 'Plain Jewellery with Stones'
      };
      component['selectedItems'] = [dummyItem, dummyItem, dummyItem];

      component['calculateSelectedItemsData']();

      expect(component.selectedQuantity).toEqual(expectedQty);
      expect(component.selectedValue).toEqual(expectedValue);
    });

    it('should set total qty and value if all selected', () => {
      component.binToBinTransferForm.get('selectItems').setValue('selectAll');

      component.itemGroup = {
        id: '11',
        name: '75',
        products: 2,
        totalValue: 417059.68,
        totalWeight: 145.667,
        currencyCode: 'INR',
        weightUnit: 'gms',
        description: 'Plain Jewellery with Stones'
      };
      component['selectedItems'] = [dummyItem, dummyItem, dummyItem];

      component['calculateSelectedItemsData']();

      expect(component.selectedQuantity).toEqual(component.itemGroup.products);
      expect(component.selectedValue).toEqual(component.itemGroup.totalValue);
    });
  });

  describe('loader', () => {
    it('should show loader if any of the operation is in progress', () => {
      binToBinTransferFacadeSpy.getIsLoadingBins.and.returnValue(of(false));
      binToBinTransferFacadeSpy.getIsLoadingItemListGroup.and.returnValue(
        of(true)
      );
      binToBinTransferFacadeSpy.getIsLoadingItems.and.returnValue(of(true));

      fixture.detectChanges();

      expect(page.loader).not.toBeNull();
    });

    it('should not show loader if any of the operation is in progress', () => {
      binToBinTransferFacadeSpy.getIsLoadingBins.and.returnValue(of(false));
      binToBinTransferFacadeSpy.getIsLoadingItemListGroup.and.returnValue(
        of(false)
      );
      binToBinTransferFacadeSpy.getIsLoadingItems.and.returnValue(of(false));
      fixture.detectChanges();

      expect(page.loader).toBeNull();
    });
  });

  describe('Componet Init', () => {
    beforeEach(() => {
      spyOn<any>(component, 'errorHandler');
      spyOn<any>(component, 'resetSelection');
      spyOn<any>(component, 'showNotification');
      spyOn<any>(component, 'checkAndSetSelectAll');
      spyOn<any>(component, 'calculateSelectedItemsData');
      spyOn<any>(component, 'loadItems');
      spyOn<any>(component, 'back');
    });

    it('should send actions to  load item group', () => {
      component['componentInit']();

      expect(binToBinTransferFacadeSpy.loadItemGroup).toHaveBeenCalledWith({
        type: component.type,
        value: component.value
      });
    });

    it('should load item group and set it to itemGroup  ', () => {
      const itemGroup = {
        id: '11',
        name: '75',
        products: 2,
        totalValue: 417059.68,
        totalWeight: 145.667,
        currencyCode: 'INR',
        weightUnit: 'gms',
        description: 'Plain Jewellery with Stones'
      };
      binToBinTransferFacadeSpy.getSelectedItemListGroup.and.returnValue(
        of(itemGroup)
      );

      component['componentInit']();

      expect(component.itemGroup).toEqual(itemGroup);
    });

    it('Should load items after loading item group ', () => {
      binToBinTransferFacadeSpy.getIsLoadingSelectedItemListGroupSuccess.and.returnValue(
        of(true)
      );

      component['componentInit']();

      expect(component['loadItems']).toHaveBeenCalled();
    });

    it('Should navigate back if item group is not loaded to do transfer of all the items in it', () => {
      binToBinTransferFacadeSpy.getIsLoadingSelectedItemListGroupSuccess.and.returnValue(
        of(false)
      );

      component['componentInit']();

      expect(component['back']).toHaveBeenCalled();
    });

    it('Should set qty and value and check for selection of all then show notifcation after loading items ', () => {
      binToBinTransferFacadeSpy.getItemList.and.returnValue(
        of([dummyItem, dummyItem])
      );

      component['componentInit']();

      expect(component['calculateSelectedItemsData']).toHaveBeenCalled();
      expect(component['showNotification']).toHaveBeenCalled();
      expect(component['checkAndSetSelectAll']).toHaveBeenCalled();
    });

    it('Should select all the items if select all option is set', () => {
      component.binToBinTransferForm.get('selectItems').setValue('selectAll');
      binToBinTransferFacadeSpy.getIsLoadingItemsSuccess.and.returnValue(
        of(true)
      );

      component['componentInit']();

      expect(
        binToBinTransferFacadeSpy.changeSelectionOfAllItems
      ).toHaveBeenCalledWith({
        idList: component['allItemsId'],
        select: true,
        disable: true,
        resetBin: false
      });
    });

    it('Should reset selection of the items if select all option is not set', () => {
      component.binToBinTransferForm.get('selectItems').setValue('');
      binToBinTransferFacadeSpy.getIsLoadingItemsSuccess.and.returnValue(
        of(true)
      );

      component['componentInit']();

      expect(component.resetSelection).toHaveBeenCalled();
    });

    it('Should show confirmation notifcation after success of transfer ', () => {
      component.itemGroup = {
        id: '11',
        name: '75',
        products: 2,
        totalValue: 417059.68,
        totalWeight: 145.667,
        currencyCode: 'INR',
        weightUnit: 'gms',
        description: 'Plain Jewellery with Stones'
      };
      binToBinTransferFacadeSpy.getConfirmTransferResponse.and.returnValue(
        of({
          transferId: 1223
        })
      );

      component['componentInit']();

      expect(component['showNotification']).toHaveBeenCalled();
    });

    it('Should reload the seleted item group after success of transfer ', () => {
      component.itemGroup = {
        id: '11',
        name: '75',
        products: 2,
        totalValue: 417059.68,
        totalWeight: 145.667,
        currencyCode: 'INR',
        weightUnit: 'gms',
        description: 'Plain Jewellery with Stones'
      };
      binToBinTransferFacadeSpy.getConfirmTransferResponse.and.returnValue(
        of({
          transferId: 1223
        })
      );

      component['componentInit']();

      expect(binToBinTransferFacadeSpy.loadItemGroup).toHaveBeenCalledWith({
        type: component.type,
        value: component.value
      });
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

    describe('Bin selection', () => {
      it('should not have option of source bin', () => {
        const bins = [
          {
            binCode: 'ABC',
            binGroupCode: 'ABC_BG'
          },
          {
            binCode: 'TEST',
            binGroupCode: 'TEST_BG'
          },
          {
            binCode: 'TEPSALE',
            binGroupCode: 'TEPSALE'
          }
        ];
        binToBinTransferFacadeSpy.getBins.and.returnValue(of(bins));
        const bincode = 'ABC';
        component.type = BinToBinTransferTypeEnum.BIN_CODE;
        component.value = bincode;

        component['componentInit']();

        const count = component.binsForSelection.filter(b => b.binCode === bincode)
          .length;

        expect(count).toEqual(0);
      });

      it('should have option of TEP SALE incase of coins product group', () => {
        const bins = [
          {
            binCode: 'ABC',
            binGroupCode: 'ABC_BG'
          },
          {
            binCode: 'TEST',
            binGroupCode: 'TEST_BG'
          },
          {
            binCode: 'TEPSALE',
            binGroupCode: 'TEPSALE'
          }
        ];
        binToBinTransferFacadeSpy.getBins.and.returnValue(of(bins));
        component.type = BinToBinTransferTypeEnum.PRODUCT_GROUP;
        component.value = BinToBinTransProductGroupCodeEnum.GOLD_COIN;

        component['componentInit']();

        const count = component.binsForSelection.filter(
          b => b.binCode === BinToBinTransBinsferEnum.TEP_SALE
        ).length;

        expect(count).toEqual(1);
      });

      it('should have option of TEP SALE incase of coins product category', () => {
        const bins = [
          {
            binCode: 'ABC',
            binGroupCode: 'ABC_BG'
          },
          {
            binCode: 'TEST',
            binGroupCode: 'TEST_BG'
          },
          {
            binCode: 'TEPSALE',
            binGroupCode: 'TEPSALE'
          }
        ];
        binToBinTransferFacadeSpy.getBins.and.returnValue(of(bins));
        component.type = BinToBinTransferTypeEnum.PRODUCT_CATEGORY;
        component.value = BinToBinTransProductCategoryCodeEnum.COIN;

        component['componentInit']();

        const count = component.binsForSelection.filter(
          b => b.binCode === BinToBinTransBinsferEnum.TEP_SALE
        ).length;

        expect(count).toEqual(1);
      });

      it('should not have option of TEP SALE incase not a coins product group', () => {
        const bins = [
          {
            binCode: 'ABC',
            binGroupCode: 'ABC_BG'
          },
          {
            binCode: 'TEST',
            binGroupCode: 'TEST_BG'
          },
          {
            binCode: 'TEPSALE',
            binGroupCode: 'TEPSALE'
          }
        ];
        binToBinTransferFacadeSpy.getBins.and.returnValue(of(bins));
        component.type = BinToBinTransferTypeEnum.PRODUCT_GROUP;
        component.value = 'OTHERS';

        component['componentInit']();

        const count = component.binsForSelection.filter(
          b => b.binCode === BinToBinTransBinsferEnum.TEP_SALE
        ).length;

        expect(count).toEqual(0);
      });

      it('should not have option of TEP SALE incase not a coins product Category', () => {
        const bins = [
          {
            binCode: 'ABC',
            binGroupCode: 'ABC_BG'
          },
          {
            binCode: 'TEST',
            binGroupCode: 'TEST_BG'
          },
          {
            binCode: 'TEPSALE',
            binGroupCode: 'TEPSALE'
          }
        ];
        binToBinTransferFacadeSpy.getBins.and.returnValue(of(bins));
        component.type = BinToBinTransferTypeEnum.PRODUCT_CATEGORY;
        component.value = 'OTHER';

        component['componentInit']();

        const count = component.binsForSelection.filter(
          b => b.binCode === BinToBinTransBinsferEnum.TEP_SALE
        ).length;

        expect(count).toEqual(0);
      });
    });
  });
});
