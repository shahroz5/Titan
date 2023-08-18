import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';

import { RouterTestingModule } from '@angular/router/testing';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  BinToBinTransferListComponent,
  searchListShortcutKey,
  searchItemShortcutKey,
  filterShortcutKey,
  sortShortcutKey,
  backShortcutKey,
  binSelectionShortcutKey,
  clearAllShortcutKey,
  selectAllShortcutKey,
  cardListShortcutKey,
  dropDownShortcutKey
} from './bin-to-bin-transfer-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Pipe,
  PipeTransform,
  NO_ERRORS_SCHEMA,
  DebugElement,
  NgZone
} from '@angular/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  OverlayNotificationServiceAbstraction,
  BinToBinTransferTypeEnum,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationEventType,
  BinToBinTransBinsferEnum,
  BinToBinTransferItemListGroup,
  BinToBinTransferItem,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { of, BehaviorSubject } from 'rxjs';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { FilterService } from '@poss-web/shared/components/ui-filter-dialog';
import { SortDialogService } from '@poss-web/shared/components/ui-sort-dialog';
import { ActivatedRoute } from '@angular/router';
import {
  ItemSearchComponent,
  ItemSearchListComponent
} from '@poss-web/shared/item/ui-item-search';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BinToBinTransferFacade } from '@poss-web/eposs/bin-bin-transfer/data-access-bin-bin-transfer';
import {
  getBintoBinTransferRouteUrl,
  getInStockHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { SelectionDialogGridService } from '@poss-web/shared/components/ui-selection-dialog-grid';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';

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
  name: 'dateFormatter'
})
class DateFromatterPipeStub implements PipeTransform {
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

  get searchItem() {
    return this.query('poss-web-item-search');
  }

  get historySearchBox() {
    return this.query('input');
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

  private fixture: ComponentFixture<BinToBinTransferListComponent>;

  constructor(fixture: ComponentFixture<BinToBinTransferListComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('BinToBinTransferListComponent', () => {
  let component: BinToBinTransferListComponent;
  let fixture: ComponentFixture<BinToBinTransferListComponent>;
  let binToBinTransferFacadeSpy;
  let appsettingFacadeSpy;
  let overlayNotificationServiceSpy;
  let selectionDialogServiceSpy;
  let filterServiceSpy;
  let sortServiceSpy;
  let page: Page;
  let permissionFacadeSpy;
  let elementPermissionServiceSpy;
  let permissionServiceSpy;
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
    isSelected: true,
    isDisabled: false,
    destinationBinGroupCode: null,
    destinationBinCode: null,
    isStudded: true
  };

  const dummyItemGroup = [
    {
      id: '11',
      name: '71',
      products: 16,
      totalValue: 826133.1,
      totalWeight: 269.728,
      currencyCode: 'INR',
      weightUnit: 'gms',
      description: 'Test Data'
    }
  ];

  const dummyHistoryHeader = {
    id: '111',
    transactionType: 'BIN_BIN',
    locationCode: 'URB',
    srcDocNo: 123,
    srcFiscalYear: 2019,
    srcDocDate: moment(),
    destDocNo: 1223,
    destDocDate: '11-MAR-2020',
    totalAvailableQuantity: 10,
    totalMeasuredQuantity: 10,
    locationCodeDescription: 'Desc',
    totalAvailableValue: 1000,
    totalMeasuredValue: 1000,
    totalAvailableWeight: 1000,
    totalMeasuredWeight: 1000,
    carrierDetails: {},
    weightUnit: 'gms',
    currencyCode: 'INR',
    status: 'OPEN',
    destFiscalYear: 2019,
    remarks: 'Remarks',
    otherDetails: {}
  };

  beforeEach(() => {
    permissionServiceSpy = jasmine.createSpyObj(['hasPermission']);
    elementPermissionServiceSpy = jasmine.createSpyObj(['loadPermission']);
    permissionFacadeSpy = jasmine.createSpyObj(['getPermissionforURL']);
    binToBinTransferFacadeSpy = jasmine.createSpyObj([
      'resetAdvanceFilter',
      'searchItems',
      'searchItemGroups',
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
      'getError',
      'getItemList',
      'getConfirmTransferResponse',
      'confirmTransferItems',
      'resetLoadedHistory',
      'updateDestinationBinForSelectedItems',
      'clearSearchedItems',
      'clearItemsGroups',
      'getSearchedItemList',
      'getIsBinToBinHistoryLoading',
      'getBinToBinHistoryCount',
      'getBinToBinHistory',
      'getIsSearchingItems',
      'getHasSearchedItems',
      'getSearchedItemListGroups',
      'getSearchedItemListGroupsTotalCount',
      'getSourceBins',
      'getSourceBinsTotalCount',
      'getProductGroups',
      'getProductGroupsTotalCount',
      'getProductCategory',
      'getProductCategoryTotalCount',
      'addToItemList',
      'deleteFromItemList',
      'deleteSelectedItems',
      'loadSourceBins',
      'loadProductsCategory',
      'loadProductsGroups',
      'loadBinToBinHistory',
      'loadStuddedProductGroups',
      'getHistoryFilterData',
      'loadHistoryFilterData'
    ]);
    appsettingFacadeSpy = jasmine.createSpyObj([
      'getMaxFilterLimit',
      'getMaxSortLimit',
      'getMaxProductInList'
    ]);
    overlayNotificationServiceSpy = jasmine.createSpyObj(['show', 'close']);
    selectionDialogServiceSpy = jasmine.createSpyObj(['open']);

    filterServiceSpy = jasmine.createSpyObj(['openDialog']);
    sortServiceSpy = jasmine.createSpyObj(['openDialog']);

    TestBed.configureTestingModule({
      declarations: [
        BinToBinTransferListComponent,
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
          provide: LocationSettingsFacade,
          useValue: {
            getLocationSetting: () => of(123)
          }
        },

        {
          provide: AuthFacade,
          useValue: {
            isUserLoggedIn: () => of(true)
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
          provide: PermissionService,
          useValue: permissionServiceSpy
        },
        {
          provide: ElementPermissionService,
          useValue: elementPermissionServiceSpy
        },

        {
          provide: PermissionFacade,
          useValue: permissionFacadeSpy
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
    fixture = TestBed.createComponent(BinToBinTransferListComponent);
    component = fixture.componentInstance;
    component['cardListComponentRef'] = new CardListComponent(
      new BreakpointObserver(
        new MediaMatcher(new Platform(null)),
        new NgZone({})
      )
    );
    page = new Page(fixture);
    component['searchRef'] = new ItemSearchComponent(
      new FormBuilder(),
      new BarcodeReaderService()
    );

    const translateService: any = {
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
    };
    component['searchListRef'] = new ItemSearchListComponent(translateService);

    spyOn(component['router'], 'navigate');

    binToBinTransferFacadeSpy.getProductGroupOptions.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getProductCategoryOptions.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getSoruceBinOptions.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getSearchedItemList.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getIsBinToBinHistoryLoading.and.returnValue(
      of(false)
    );
    binToBinTransferFacadeSpy.getBinToBinHistory.and.returnValue(
      of([dummyHistoryHeader])
    );
    binToBinTransferFacadeSpy.getSourceBins.and.returnValue(
      of([dummyItemGroup])
    );
    binToBinTransferFacadeSpy.getProductGroups.and.returnValue(
      of([dummyItemGroup])
    );
    binToBinTransferFacadeSpy.getProductCategory.and.returnValue(
      of([dummyItemGroup])
    );

    binToBinTransferFacadeSpy.getBins.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getError.and.returnValue(of(null));
    binToBinTransferFacadeSpy.getItemList.and.returnValue(of([]));
    binToBinTransferFacadeSpy.getConfirmTransferResponse.and.returnValue(
      of(null)
    );
    binToBinTransferFacadeSpy.getHistoryFilterData.and.returnValue(of(null));

    elementPermissionServiceSpy.loadPermission.and.returnValue(
      of({ transactionCodes: [] })
    );
    permissionFacadeSpy.getPermissionforURL.and.returnValue(
      of({ transactionCodes: [] })
    );
    appsettingFacadeSpy.getMaxFilterLimit.and.returnValue(of(5));
    appsettingFacadeSpy.getMaxSortLimit.and.returnValue(of(1));
    appsettingFacadeSpy.getMaxProductInList.and.returnValue(of(50));
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('onInit', () => {
    beforeEach(() => {
      spyOn<any>(component, 'shortcutEventHandler');
      spyOn<any>(component, 'addToItemList');
      spyOn(component, 'loadItemCart');
      spyOn<any>(component, 'checkAndSetSelectAll');
      spyOn<any>(component, 'showNotification');
      spyOn<any>(component, 'errorHandler');
      spyOn<any>(component, 'loadHistory');
      spyOn<any>(component, 'initialize');
    });
    it('should send action to load source bins , product-category  and product-Groups', () => {
      component.ngOnInit();

      expect(
        binToBinTransferFacadeSpy.loadProductGroupOptions
      ).toHaveBeenCalled();
      expect(
        binToBinTransferFacadeSpy.loadProductCategoryOptions
      ).toHaveBeenCalled();
      expect(binToBinTransferFacadeSpy.loadBins).toHaveBeenCalled();
    });

    it('should send shortcut events to shortcutEventHandler', () => {
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
      const maxFilterLimit = 10;
      const maxSortLimit = 2;
      const maxProductInList = 50;

      appsettingFacadeSpy.getMaxFilterLimit.and.returnValue(of(maxFilterLimit));
      appsettingFacadeSpy.getMaxSortLimit.and.returnValue(of(maxSortLimit));
      appsettingFacadeSpy.getMaxProductInList.and.returnValue(
        of(maxProductInList)
      );

      component.ngOnInit();

      expect(component['maxFilterLimit']).toEqual(maxFilterLimit);
      expect(component['maxSortLimit']).toEqual(maxSortLimit);
      expect(component['maxProductInList']).toEqual(maxProductInList);
    });

    it('should load the destination bins', () => {
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
          binCode: 'TEST1',
          binGroupCode: 'TEST1'
        }
      ];
      binToBinTransferFacadeSpy.getBins.and.returnValue(of(bins));

      component.ngOnInit();

      expect(component.binsForSelection.length).toEqual(3);
    });

    it('should not have option of TEP SALE in bins', () => {
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

      component.ngOnInit();

      const count = component.binsForSelection.filter(
        b => b.binCode === BinToBinTransBinsferEnum.TEP_SALE
      ).length;

      expect(count).toEqual(0);
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

      component.ngOnInit();

      expect(component['errorHandler']).toHaveBeenCalledWith(error);
    });

    it('Should show confirmation notifcation after success of transfer and clear the loaded item groups ', () => {
      binToBinTransferFacadeSpy.getConfirmTransferResponse.and.returnValue(
        of({
          transferId: 1223
        })
      );

      component.ngOnInit();

      expect(component['showNotification']).toHaveBeenCalled();
      expect(binToBinTransferFacadeSpy.clearItemsGroups).toHaveBeenCalled();
    });

    it('Searched item list : Should add directly if only one item ', () => {
      const items = [dummyItem];
      binToBinTransferFacadeSpy.getSearchedItemList.and.returnValue(of(items));
      spyOn<any>(component['searchListRef'], 'reset');

      component.ngOnInit();

      expect(component['addToItemList']).toHaveBeenCalledWith(items);
    });

    it('Searched item list : Should add to list if more than one item  and should not add to the cart ', () => {
      const items = [dummyItem, dummyItem];
      binToBinTransferFacadeSpy.getSearchedItemList.and.returnValue(of(items));
      spyOn<any>(component['searchListRef'], 'reset');

      component.ngOnInit();

      expect(component['addToItemList']).not.toHaveBeenCalled();
      expect(component.searchedItemList).toEqual(items);
    });

    it('Searched item list : Should set list to empty if no result found ', () => {
      const items = [];
      binToBinTransferFacadeSpy.getSearchedItemList.and.returnValue(of(items));
      spyOn<any>(component['searchListRef'], 'reset');

      component.ngOnInit();

      expect(component['addToItemList']).not.toHaveBeenCalled();
      expect(component.searchedItemList).toEqual([]);
    });

    it('Item list : Should load the cart and check for selection', () => {
      const items = [dummyItem];
      binToBinTransferFacadeSpy.getItemList.and.returnValue(of(items));

      component.ngOnInit();

      expect(component.loadItemCart).toHaveBeenCalled();
      expect(component['checkAndSetSelectAll']).toHaveBeenCalled();
    });

    it('Should  call method to load history if history tab is seleted', () => {
      component.type = BinToBinTransferTypeEnum.HISTORY;

      component.ngOnInit();

      expect(component['loadHistory']).toHaveBeenCalled();
    });

    it('Should  call method to load bin to bin related data if bin to bin tab is seleted', () => {
      component.type = BinToBinTransferTypeEnum.HISTORY;

      component.ngOnInit();

      expect(component['loadHistory']).toHaveBeenCalled();
    });
  });

  it('should navigate to bin to bin  list page on back', () => {
    component.back();

    expect(component['router'].navigate).toHaveBeenCalledWith([
      getInStockHomeRouteUrl()
    ]);
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
      spyOn<any>(component, 'loadItemCart');

      component.openFilter();

      expect(component['loadItemCart']).toHaveBeenCalledWith();
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
      spyOn<any>(component, 'loadItemCart');

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

    // TODO : Yet to fix
    xit('should render filter option in variant type and cart is not empty', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      fixture.detectChanges();

      expect(page.filter).not.toBeNull();
    });

    // TODO : Yet to fix
    xit('should not render filter option in variant type and cart is empty', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      fixture.detectChanges();

      expect(page.filter).toBeNull();
    });

    // TODO : Yet to fix
    xit('should not render filter option if other than variant type ', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);

      fixture.detectChanges();

      expect(page.filter).toBeNull();
    });

    // TODO : Yet to fix
    xit('should call openFilter on click ', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);
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

      spyOn<any>(component, 'loadItemCart');

      component.openSortDailog();

      expect(component['loadItemCart']).toHaveBeenCalledWith();
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
      spyOn<any>(component, 'loadItemCart');

      component.openSortDailog();

      expect(component.sortBy).toEqual('availableWeight');
      expect(component.sortOrder).toEqual('ASC');

      component.openSortDailog();

      expect(component.sortBy).toEqual('availableQuantity');
      expect(component.sortOrder).toEqual('DESC');
    });

    // TODO : Yet to fix

    xit('should render sort option in variant type and cart is not empty', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      fixture.detectChanges();

      expect(page.sort).not.toBeNull();
    });

    // TODO : Yet to fix
    xit('should not render sort option in variant type and cart is empty', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      fixture.detectChanges();

      expect(page.sort).toBeNull();
    });

    // TODO : Yet to fix
    xit('should not render button to open bin selection popup other than variant type ', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);

      fixture.detectChanges();

      expect(page.binSelection).toBeNull();
    });

    xit('should call openSortDailog on click ', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);
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

    it('should assign bin', () => {
      const bin = {
        binCode: 'BIN_CODE',
        binGroupCode: 'BIN_GROUP_CODE'
      };

      selectionDialogServiceSpy.open.and.returnValue(of(bin));

      component.openBinSelectionPopup();

      expect(component.selectedBin.binCode).toEqual(bin.binCode);
      expect(component.selectedBin.binGroupCode).toEqual(bin.binGroupCode);
    });

    it('should call update bin action ', () => {
      const bin = {
        binCode: 'BIN_CODE',
        binGroupCode: 'BIN_GROUP_CODE'
      };
      component.selectedItemsId = ['ITEM1', 'ITEM2'];

      selectionDialogServiceSpy.open.and.returnValue(of(bin));

      component.openBinSelectionPopup();

      expect(
        binToBinTransferFacadeSpy.updateDestinationBinForSelectedItems
      ).toHaveBeenCalledWith({
        idList: component.selectedItemsId,
        destinationBinCode: bin.binCode,
        destinationBinGroupCode: bin.binGroupCode
      });
    });

    xit('should render button to open bin selection popup in variant type and cart is not empty', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      fixture.detectChanges();

      expect(page.binSelection).not.toBeNull();
    });

    it('should not render button to open bin selection popup in variant type and cart is empty', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      fixture.detectChanges();

      expect(page.binSelection).toBeNull();
    });

    it('should not render button to open bin selection popup other than variant type ', () => {
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);
      spyOn(component, 'ngOnInit');

      fixture.detectChanges();

      expect(page.binSelection).toBeNull();
    });

    xit('should call openBinSelectionPopup when click event is triggered ', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);
      spyOn(component, 'openBinSelectionPopup');

      fixture.detectChanges();
      page.binSelection.triggerEventHandler('click', null);

      expect(component.openBinSelectionPopup).toHaveBeenCalled();
    });
  });

  describe('Search items ', () => {
    it('should set the search paramters and call load items', () => {
      spyOn<any>(component, 'loadItemCart');
      spyOn<any>(component, 'resetSelection');

      const itemCode = 'RET123';
      const lotNumber = 'LOT123';
      component.searchInCart({
        searchValue: itemCode,
        lotNumber: lotNumber,
        isValid: true
      });

      expect(component['loadItemCart']).toHaveBeenCalled();
      expect(component['resetSelection']).toHaveBeenCalled();
      expect(component.itemCode).toEqual(itemCode);
      expect(component.lotNumber).toEqual(lotNumber);
    });

    xit('should render item search', () => {
      component.allItemList = [dummyItem];
      spyOn(component, 'ngOnInit');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      fixture.detectChanges();

      expect(page.searchItem).not.toBeNull();
    });

    xit('should call searchItems when search event is triggered ', () => {
      component.allItemList = [dummyItem];
      spyOn(component, 'ngOnInit');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      spyOn(component, 'searchInCart');

      fixture.detectChanges();
      page.searchItem.triggerEventHandler('search', null);

      expect(component.searchInCart).toHaveBeenCalled();
    });
    it('Variant Type : should call action to search the items', () => {
      spyOn<any>(component, 'showNotification');
      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.VARIANT_CODE);

      component.allItemList = [dummyItem];
      component['maxProductInList'] = 10;

      const searchData = {
        searchValue: '1232',
        lotNumber: 'L1223',
        isValid: true
      };
      component.search(searchData);

      expect(binToBinTransferFacadeSpy.searchItems).toHaveBeenCalledWith({
        itemCode: searchData.searchValue,
        lotNumber: searchData.lotNumber
      });
    });

    it('Variant Type : should not call action to search the items if max cart limit is reached, instead show error notification', () => {
      spyOn<any>(component, 'showNotification');
      spyOn<any>(component['searchListRef'], 'reset');

      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.VARIANT_CODE);

      component.allItemList = [dummyItem, dummyItem];
      component['maxProductInList'] = 2;

      const searchData = {
        searchValue: '1232',
        lotNumber: 'L1223',
        isValid: true
      };
      component.search(searchData);

      expect(binToBinTransferFacadeSpy.searchItems).not.toHaveBeenCalled();
      expect(component.hasReachedMaxLimit).toBeTruthy();
      expect(component['showNotification']).toHaveBeenCalled();
    });

    it('Item Group : should call action to search the Item Group', () => {
      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.BIN_CODE);

      const searchData = {
        searchValue: '1232',
        lotNumber: 'L1223',
        isValid: true
      };
      component.search(searchData);

      expect(binToBinTransferFacadeSpy.searchItemGroups).toHaveBeenCalledWith({
        type: BinToBinTransferTypeEnum.BIN_CODE,
        pageIndex: 0,
        pageSize: component.pageSize,
        value: searchData.searchValue
      });
    });

    it('Item Group : should load searched data and its count', () => {
      const count = 11;

      const data = [
        {
          id: '11',
          name: '71',
          products: 16,
          totalValue: 826133.1,
          totalWeight: 269.728,
          currencyCode: 'INR',
          weightUnit: 'gms',
          description: 'Test Data'
        }
      ];
      component.searchedItemListGroups$ = new BehaviorSubject<
        BinToBinTransferItemListGroup[]
      >(data);
      component.searchedItemListGroupsTotalCount$ = new BehaviorSubject<number>(
        count
      );

      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.PRODUCT_CATEGORY);

      const searchData = {
        searchValue: '1232',
        lotNumber: 'L1223',
        isValid: true
      };
      component.search(searchData);

      component.itemGroups$.subscribe(res => {
        expect(res).toEqual(data);
      });

      component.itemGroupsTotalCount$.subscribe(res => {
        expect(res).toEqual(count);
      });
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
    it('should focus on search list', () => {
      const command = new Command();
      command.name = searchListShortcutKey;
      spyOn<any>(component['searchListRef'], 'focus');
      component['shortcutEventHandler'](command);

      expect(component['searchListRef'].focus).toHaveBeenCalled();
    });

    it('should focus on search item in variant type and atleast one item is added to the cart', () => {
      const command = new Command();
      command.name = searchItemShortcutKey;
      component.allItemList = [dummyItem];
      spyOn<any>(component['searchRef'], 'focus');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);
      component['shortcutEventHandler'](command);

      expect(component['searchRef'].focus).toHaveBeenCalled();
    });
    it('should not focus on search item in other than variant type', () => {
      const command = new Command();
      command.name = searchItemShortcutKey;
      spyOn<any>(component['searchRef'], 'focus');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);
      component['shortcutEventHandler'](command);

      expect(component['searchRef'].focus).not.toHaveBeenCalled();
    });

    it('should not focus on search item in variant type and cart is empty', () => {
      const command = new Command();
      command.name = searchItemShortcutKey;
      component.allItemList = [];
      spyOn<any>(component['searchRef'], 'focus');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);
      component['shortcutEventHandler'](command);

      expect(component['searchRef'].focus).not.toHaveBeenCalled();
    });

    it('should open filter popup  in variant type and atleast one item is added to the cart', () => {
      const command = new Command();
      command.name = filterShortcutKey;
      component.allItemList = [dummyItem];
      spyOn(component, 'openFilter');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      component['shortcutEventHandler'](command);
      expect(component.openFilter).toHaveBeenCalled();
    });

    it('should not open filter popup in other than variant type', () => {
      const command = new Command();
      command.name = filterShortcutKey;
      component.allItemList = [dummyItem];
      spyOn(component, 'openFilter');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);

      component['shortcutEventHandler'](command);
      expect(component.openFilter).not.toHaveBeenCalled();
    });

    it('should not open filter popup in variant type and cart is empty', () => {
      const command = new Command();
      command.name = filterShortcutKey;
      component.allItemList = [];
      spyOn(component, 'openFilter');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      component['shortcutEventHandler'](command);
      expect(component.openFilter).not.toHaveBeenCalled();
    });

    it('should open sort popup in variant type and atleast one item is added to the cart', () => {
      const command = new Command();
      command.name = sortShortcutKey;
      component.allItemList = [dummyItem];
      spyOn(component, 'openSortDailog');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      component['shortcutEventHandler'](command);
      expect(component.openSortDailog).toHaveBeenCalled();
    });

    it('should not open sort popup in other than variant type', () => {
      const command = new Command();
      command.name = sortShortcutKey;
      component.allItemList = [dummyItem];
      spyOn(component, 'openSortDailog');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);

      component['shortcutEventHandler'](command);
      expect(component.openSortDailog).not.toHaveBeenCalled();
    });

    it('should not open sort popup in variant type and cart is empty', () => {
      const command = new Command();
      command.name = sortShortcutKey;
      component.allItemList = [];
      spyOn(component, 'openSortDailog');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      component['shortcutEventHandler'](command);
      expect(component.openSortDailog).not.toHaveBeenCalled();
    });

    it('should navigate back', () => {
      const command = new Command();
      command.name = backShortcutKey;
      spyOn(component, 'back');
      component['shortcutEventHandler'](command);

      expect(component.back).toHaveBeenCalled();
    });

    it('should open bin selection popup in variant type and atleast one item is added to the cart', () => {
      const command = new Command();
      command.name = binSelectionShortcutKey;
      component.allItemList = [dummyItem];
      component.selectedItems = [dummyItem];

      spyOn(component, 'openBinSelectionPopup');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      component['shortcutEventHandler'](command);

      expect(component.openBinSelectionPopup).toHaveBeenCalled();
    });

    it('should not bin selection in other than variant type', () => {
      const command = new Command();
      command.name = binSelectionShortcutKey;
      component.allItemList = [dummyItem];
      spyOn(component, 'openBinSelectionPopup');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);

      component['shortcutEventHandler'](command);
      expect(component.openBinSelectionPopup).not.toHaveBeenCalled();
    });

    it('should not bin selection in variant type and cart is empty', () => {
      const command = new Command();
      command.name = binSelectionShortcutKey;
      component.allItemList = [];
      spyOn(component, 'openBinSelectionPopup');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      component['shortcutEventHandler'](command);
      expect(component.openBinSelectionPopup).not.toHaveBeenCalled();
    });

    it('should reset the selection of items in variant type and atleast one item is added to the cart', () => {
      const command = new Command();
      command.name = clearAllShortcutKey;
      component.allItemList = [dummyItem];
      spyOn(component, 'resetSelection');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      component['shortcutEventHandler'](command);

      expect(component.resetSelection).toHaveBeenCalled();
    });

    it('should not reset the selection of items  in other than variant type', () => {
      const command = new Command();
      command.name = clearAllShortcutKey;
      component.allItemList = [dummyItem];
      spyOn(component, 'resetSelection');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);

      component['shortcutEventHandler'](command);
      expect(component.resetSelection).not.toHaveBeenCalled();
    });

    it('should not reset the selection of items in variant type and cart is empty', () => {
      const command = new Command();
      command.name = clearAllShortcutKey;
      component.allItemList = [];
      spyOn(component, 'resetSelection');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      component['shortcutEventHandler'](command);
      expect(component.resetSelection).not.toHaveBeenCalled();
    });

    it('should select all the items  in variant type and atleast one item is added to the cart ', () => {
      const command = new Command();
      command.name = selectAllShortcutKey;
      spyOn(component.binToBinTransferForm, 'patchValue');
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);
      component['shortcutEventHandler'](command);

      expect(component.binToBinTransferForm.patchValue).toHaveBeenCalledWith({
        selectItems: 'selectAll'
      });
    });
    it('should not select all the items  in other than variant type', () => {
      const command = new Command();
      command.name = selectAllShortcutKey;
      component.allItemList = [dummyItem];
      spyOn(component.binToBinTransferForm, 'patchValue');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);

      component['shortcutEventHandler'](command);
      expect(component.binToBinTransferForm.patchValue).not.toHaveBeenCalled();
    });

    it('should notselect all the items in variant type and cart is empty', () => {
      const command = new Command();
      command.name = selectAllShortcutKey;
      component.allItemList = [];
      spyOn(component.binToBinTransferForm, 'patchValue');
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      component['shortcutEventHandler'](command);
      expect(component.binToBinTransferForm.patchValue).not.toHaveBeenCalled();
    });

    it('should focus card-list other than variant type', () => {
      const command = new Command();
      command.name = cardListShortcutKey;
      spyOn(component, 'isSelectByGroup').and.returnValue(true);
      spyOn<any>(component['cardListComponentRef'], 'focus');
      component['shortcutEventHandler'](command);

      expect(component['cardListComponentRef'].focus).toHaveBeenCalled();
    });
  });

  describe('Notification', () => {
    describe('showNotifications', () => {
      beforeEach(() => {
        spyOn<any>(component, 'showConfirmReceiveSuccessNotification');
        spyOn<any>(component, 'showConfirmTransferNotification');
        spyOn<any>(component, 'showAssignDestinationBinNotification');
        spyOn<any>(component, 'showProductSelectNotification');
        spyOn<any>(component, 'showMaximumProductsPerRequestLimitNotification');
        spyOn<any>(component, 'showSameDestinationBinErrorNotification');
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

      it('should call  showMaximumProductsPerRequestLimitNotification max error is set', () => {
        component.hasReachedMaxLimit = true;
        component['showNotification']();

        expect(
          component['showMaximumProductsPerRequestLimitNotification']
        ).toHaveBeenCalled();
      });

      it('should call  showProductSelectNotification when no items are selected ', () => {
        component.itemList = [dummyItem, dummyItem, dummyItem];
        component.selectedItems = [];

        component['showNotification']();

        expect(component['showProductSelectNotification']).toHaveBeenCalled();
      });

      it('should call  showConfirmTransferNotification  when items and destination bin is selected ', () => {
        component.selectedItems = [dummyItem, dummyItem, dummyItem];
        spyOn<any>(component, 'allAssignedWithBins').and.returnValue(true);

        component['showNotification']();

        expect(
          component['showConfirmTransferNotification']
        ).toHaveBeenCalledWith(3);
      });

      it('should show error when any product has same source and desination bin', () => {
        component.selectedItems = [dummyItem, dummyItem, dummyItem];
        spyOn<any>(component, 'allAssignedWithBins').and.returnValue(false);
        spyOn<any>(component, 'checkSameBinError').and.returnValue(true);

        component['showNotification']();

        expect(
          component['showSameDestinationBinErrorNotification']
        ).toHaveBeenCalled();
      });

      it('should show notifcation to select the destination bin with no of selected items', () => {
        component.selectedItems = [dummyItem, dummyItem, dummyItem];
        spyOn<any>(component, 'allAssignedWithBins').and.returnValue(false);

        component['showNotification']();

        expect(
          component['showAssignDestinationBinNotification']
        ).toHaveBeenCalledWith(3);
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
        'pw.binToBinTransferNotificationMessages.assignDestinationBinMessage';
      const buttonKey =
        'pw.binToBinTransferNotificationMessages.removeButtonText';

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.FALSE })
      });

      component['showAssignDestinationBinNotification']();

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.ACTION,
        message: 0 + ' ' + key,
        buttonText: buttonKey
      });
    });

    it('showAssignDestinationBinNotification : should send action to delete the items ', () => {
      spyOn(component, 'deleteSelectedItems');

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.TRUE })
      });

      component['showAssignDestinationBinNotification']();

      expect(component.deleteSelectedItems).toHaveBeenCalled();
    });

    it('showMaximumProductsPerRequestLimitNotification : should call overlay notifcation serivce properly ', () => {
      const key =
        'pw.binToBinTransferNotificationMessages.maximumProductsLimitMessage';

      component['maxProductInList'] = 50;
      spyOn<any>(component, 'showNotification');

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.FALSE })
      });

      component['showMaximumProductsPerRequestLimitNotification']();

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.TIMER,
        message: key
      });
    });

    it('showMaximumProductsPerRequestLimitNotification : On Close, should reset and show other notification ', () => {
      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.FALSE })
      });
      spyOn<any>(component, 'showNotification');

      component['showMaximumProductsPerRequestLimitNotification']();

      expect(component.hasReachedMaxLimit).toBeFalsy();
      expect(component['showNotification']).toHaveBeenCalled();
    });

    it('showSameDestinationBinErrorNotification : should call overlay notifcation serivce properly ', () => {
      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.FALSE })
      });

      component['showSameDestinationBinErrorNotification']();

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.SIMPLE,
        message: 'pw.errorMessages.ERR-BTB-SAME-BIN'
      });
    });

    it('showConfirmTransferNotification : should call overlay notifcation serivce properly ', () => {
      const key =
        'pw.binToBinTransferNotificationMessages.confirmTransferMessage';
      const buttonKey1 =
        'pw.binToBinTransferNotificationMessages.confirmTransferButtonText';
      const buttonKey2 =
        'pw.binToBinTransferNotificationMessages.removeButtonText';

      spyOn<any>(component, 'showProgressNotification');
      spyOn(component, 'deleteSelectedItems');

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ eventType: OverlayNotificationEventType.CLOSE })
      });

      component['showConfirmTransferNotification']();

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.MULTI_ACTION,
        message: 0 + ' ' + key,
        buttons: [
          {
            id: 1,
            text: buttonKey1,
            css: 'pw-accent-btn'
          },
          {
            id: 2,
            text: buttonKey2,
            css: 'pw-primary-btn'
          }
        ]
      });
    });

    it('showConfirmTransferNotification : should call confirm action and show progress notifcation if confirm button is clicked', () => {
      spyOn<any>(component, 'showProgressNotification');
      spyOn(component, 'deleteSelectedItems');
      component['selectedItems'] = [dummyItem];
      const expectedRequest = {
        request: {
          binItems: [
            {
              inventoryId: 'B948E97B-BBB8-4C77-9383-1712B570F713',
              binGroupCode: null,
              binCode: null
            }
          ]
        },
        remove: true
      };

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ selectedId: 1 })
      });

      component['showConfirmTransferNotification']();

      expect(component['showProgressNotification']).toHaveBeenCalled();
      expect(
        binToBinTransferFacadeSpy.confirmTransferItems
      ).toHaveBeenCalledWith(expectedRequest);
    });

    it('showConfirmTransferNotification : should call delete action and delete button is clicked', () => {
      spyOn<any>(component, 'showProgressNotification');
      spyOn(component, 'deleteSelectedItems');

      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({ selectedId: 2 })
      });

      component['showConfirmTransferNotification']();

      expect(component.deleteSelectedItems).toHaveBeenCalled();
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
  });

  describe('resetSelection', () => {
    it('should call changeSelectionOfAllItems action', () => {
      const allItemsId = ['Item1', 'Item2'];
      component['itemListId'] = allItemsId;

      component['resetSelection']();

      expect(
        component.binToBinTransferForm.get('selectItems').value
      ).toBeNull();
      expect(
        binToBinTransferFacadeSpy.changeSelectionOfAllItems
      ).toHaveBeenCalledWith({
        idList: allItemsId,
        select: false,
        disable: false,
        resetBin: true
      });
    });

    it('should not render clear option when is not variant type', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(false);

      fixture.detectChanges();

      expect(page.clearAll).toBeNull();
    });

    it('should not render clear option when items are not selected', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      component.selectedItems = [];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      fixture.detectChanges();

      expect(page.clearAll).toBeNull();
    });

    xit('should render clear option when items are selected', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      component.selectedItems = [dummyItem];
      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);

      fixture.detectChanges();

      expect(page.clearAll).not.toBeNull();
    });

    xit('should call resetSelection on click ', () => {
      spyOn(component, 'ngOnInit');
      component.allItemList = [dummyItem];
      component.selectedItems = [dummyItem];

      spyOn(component, 'isSelectByVariantCode').and.returnValue(true);
      spyOn(component, 'resetSelection');

      fixture.detectChanges();

      page.clearAll.triggerEventHandler('click', null);

      expect(component.resetSelection).toHaveBeenCalled();
    });
  });

  describe('checkAndSetSelectAll', () => {
    it('set as all selected by checking all the items are selected', () => {
      component['selectedItems'] = [dummyItem, dummyItem, dummyItem];
      component['itemList'] = [dummyItem, dummyItem, dummyItem];
      component['checkAndSetSelectAll']();

      expect(component.binToBinTransferForm.value.selectItems).toEqual(
        'selectAll'
      );
    });

    it('clear selection if all the items are not selected', () => {
      component.binToBinTransferForm.get('selectItems').setValue('selectAll');

      component['selectedItems'] = [dummyItem, dummyItem];
      component['itemList'] = [dummyItem, dummyItem, dummyItem];
      component['checkAndSetSelectAll']();

      expect(
        !!component.binToBinTransferForm.get('selectItems').value
      ).toBeFalsy();
    });
  });

  describe('Assgined Bin Validation ', () => {
    it('allAssignedWithBins : Should return true if any item is assgined with destination bin selected and source and destination bin is not same ', () => {
      component['selectedItems'] = [
        { ...dummyItem, binCode: 'BINCODE1', destinationBinCode: 'BINCODE2' },
        { ...dummyItem, binCode: 'BINCODE1', destinationBinCode: 'BINCODE2' }
      ];

      expect(component['allAssignedWithBins']()).toBeTruthy();
    });

    it('allAssignedWithBins : Should return false if any item is not assgined with destination bin', () => {
      component['selectedItems'] = [
        { ...dummyItem, destinationBinCode: 'BINCODE1' },
        { ...dummyItem, destinationBinCode: null }
      ];

      expect(component['allAssignedWithBins']()).toBeFalsy();
    });

    it('allAssignedWithBins : Should return false if any item is assgined with destination bin and same as source bin', () => {
      component['selectedItems'] = [
        { ...dummyItem, binCode: 'BINCODE1', destinationBinCode: 'BINCODE1' },
        { ...dummyItem, binCode: 'BINCODE1', destinationBinCode: 'BINCODE2' }
      ];

      expect(component['allAssignedWithBins']()).toBeFalsy();
    });

    it('checkSameBinError : Should return true if any item has same destination and source bin selected', () => {
      component['selectedItems'] = [
        { ...dummyItem, binCode: 'BINCODE1', destinationBinCode: 'BINCODE1' },
        { ...dummyItem, binCode: 'BINCODE1', destinationBinCode: 'BINCODE2' }
      ];

      expect(component['checkSameBinError']()).toBeTruthy();
    });

    it('checkSameBinError: Should return false if any all item has same different destination and source bin selected', () => {
      component['selectedItems'] = [
        { ...dummyItem, binCode: 'BINCODE1', destinationBinCode: 'BINCODE2' },
        { ...dummyItem, binCode: 'BINCODE1', destinationBinCode: 'BINCODE2' }
      ];

      expect(component['checkSameBinError']()).toBeFalsy();
    });
  });

  describe('loader', () => {
    it('should show loader if any of the operation is in progress', () => {
      binToBinTransferFacadeSpy.getIsLoadingBins.and.returnValue(of(true));
      binToBinTransferFacadeSpy.getIsLoadingItemListGroup.and.returnValue(
        of(false)
      );
      binToBinTransferFacadeSpy.getIsSearchingItems.and.returnValue(of(false));

      component.isLoadingHistory = false;
      fixture.detectChanges();

      expect(page.loader).not.toBeNull();
    });

    it('should not show loader if any of the operation is in progress', () => {
      binToBinTransferFacadeSpy.getIsLoadingBins.and.returnValue(of(false));
      binToBinTransferFacadeSpy.getIsLoadingItemListGroup.and.returnValue(
        of(false)
      );
      binToBinTransferFacadeSpy.getIsSearchingItems.and.returnValue(of(false));

      component.isLoadingHistory = false;

      fixture.detectChanges();

      expect(page.loader).toBeNull();
    });
  });

  describe('advancedFilter', () => {
    it('should open dialog', () => {
      spyOn(component, 'loadHistory');
      spyOn(component['dialog'], 'open').and.returnValue({
        afterClosed: () => of(null)
      });

      component.advancedFilter();

      expect(component['dialog'].open).toHaveBeenCalled();
    });

    it('should reset the loaded data and load new data based on filter', () => {
      spyOn(component, 'loadHistory');
      spyOn(component['dialog'], 'open').and.returnValue({
        afterClosed: () => of({ data: 'Test' })
      });

      component.advancedFilter();

      expect(
        binToBinTransferFacadeSpy.loadHistoryFilterData
      ).toHaveBeenCalled();
      expect(component.loadHistory).toHaveBeenCalled();
    });
  });

  describe('changeBinToBinTransferType', () => {
    it('should load Bin to Bin Tab', () => {
      const newType = BinToBinTransferTypeEnum.BIN_CODE;
      component.type = BinToBinTransferTypeEnum.HISTORY;
      spyOn(component, 'loadHistory');
      spyOn<any>(component, 'initialize');

      component.changeBinToBinTransferType(newType);

      expect(component['initialize']).toHaveBeenCalled();
    });

    it('should load Bin to Bin History Tab', () => {
      const newType = BinToBinTransferTypeEnum.HISTORY;
      component.type = BinToBinTransferTypeEnum.BIN_CODE;
      spyOn(component, 'loadHistory');
      spyOn<any>(component, 'initialize');

      component.changeBinToBinTransferType(newType);

      expect(component.loadHistory).toHaveBeenCalled();
    });

    it('should not load if click on the same tab', () => {
      const newType = BinToBinTransferTypeEnum.BIN_CODE;
      component.type = BinToBinTransferTypeEnum.BIN_CODE;
      spyOn(component, 'loadHistory');
      spyOn<any>(component, 'initialize');

      component.changeBinToBinTransferType(newType);

      expect(component['initialize']).not.toHaveBeenCalled();
    });

    it('should navigate to the tab url', () => {
      const newType = BinToBinTransferTypeEnum.BIN_CODE;
      component.type = BinToBinTransferTypeEnum.HISTORY;
      spyOn(component, 'loadHistory');
      spyOn<any>(component, 'initialize');

      component.changeBinToBinTransferType(newType);

      expect(component['router'].navigate).toHaveBeenCalledWith([
        getBintoBinTransferRouteUrl(newType)
      ]);
    });
  });

  describe('Item Cart operations', () => {
    it('addToItemList : Should send action to add items to the cart', () => {
      spyOn(component, 'clearAll');
      spyOn(component, 'resetSelection');

      const items = [dummyItem];

      component['addToItemList'](items);

      expect(binToBinTransferFacadeSpy.addToItemList).toHaveBeenCalledWith(
        items
      );
    });

    it('addToItemList : Should call method to clear the search and filter options ', () => {
      spyOn(component, 'clearAll');
      spyOn(component, 'resetSelection');
      const items = [dummyItem];

      component['addToItemList'](items);

      expect(component.clearAll).toHaveBeenCalled();
    });

    it('addToItemList : Should call method to reset the selection when search or filter is applied ', () => {
      component.itemCode = '1234';
      spyOn(component, 'clearAll');
      spyOn(component, 'resetSelection');
      const items = [dummyItem];

      component['addToItemList'](items);

      expect(component.resetSelection).toHaveBeenCalled();
    });
    it('onDelete : Should call action to delete an item and reset the common selected bin ', () => {
      const itemId = '12343';

      component['onDelete'](itemId);

      expect(component.selectedBin).toBeNull();
      expect(binToBinTransferFacadeSpy.deleteFromItemList).toHaveBeenCalledWith(
        itemId
      );
    });

    it('onUpdateItem : Should call action to update an item and reset the common selected bin', () => {
      const item = dummyItem;

      component['onUpdateItem'](item);
      expect(component.selectedBin).toBeNull();
      expect(binToBinTransferFacadeSpy.updateItemList).toHaveBeenCalledWith(
        item
      );
    });

    it('onSearchItemsSelected : Should call method to add to the cart if cart is not reached to max limit', () => {
      const items = [dummyItem, dummyItem, dummyItem];
      spyOn<any>(component, 'showNotification');
      spyOn<any>(component, 'addToItemList');
      spyOn<any>(component['searchListRef'], 'reset');

      component['maxProductInList'] = 5;
      component.allItemList = [dummyItem, dummyItem];

      component['onSearchItemsSelected'](items);

      expect(component['addToItemList']).toHaveBeenCalledWith(items);
    });

    it('onSearchItemsSelected : Should not call method to add to the cart if cart is not reached to max limit', () => {
      const items = [dummyItem, dummyItem, dummyItem];
      spyOn<any>(component, 'showNotification');
      spyOn<any>(component, 'addToItemList');
      spyOn<any>(component['searchListRef'], 'reset');

      component['maxProductInList'] = 3;
      component.allItemList = [dummyItem, dummyItem];

      component['onSearchItemsSelected'](items);

      expect(component['addToItemList']).not.toHaveBeenCalled();
    });

    it('onSearchItemsSelected : Should show error notification if cart is reached to max limit', () => {
      const items = [dummyItem, dummyItem, dummyItem];
      spyOn<any>(component, 'showNotification');
      spyOn<any>(component, 'addToItemList');
      spyOn<any>(component['searchListRef'], 'reset');

      component['maxProductInList'] = 3;
      component.allItemList = [dummyItem, dummyItem];

      component['onSearchItemsSelected'](items);

      expect(component.hasReachedMaxLimit).toBeTruthy();

      expect(component['showNotification']).toHaveBeenCalled();
    });

    it('onSearchItemsSelected : Should reset the entered item code if cart is reached to max limit', () => {
      const items = [dummyItem, dummyItem, dummyItem];
      spyOn<any>(component, 'showNotification');
      spyOn<any>(component, 'addToItemList');
      spyOn<any>(component['searchListRef'], 'reset');

      component['maxProductInList'] = 3;
      component.allItemList = [dummyItem, dummyItem];

      component['onSearchItemsSelected'](items);

      expect(component['searchListRef'].reset).toHaveBeenCalled();
    });

    it('onSearchItemsSelected : Should reset the entered item code if cart is reached to max limit', () => {
      const itemsId = ['ITEM1', 'ITEM2', 'ITEM3'];

      component.selectedItemsId = itemsId;

      component['deleteSelectedItems']();

      expect(
        binToBinTransferFacadeSpy.deleteSelectedItems
      ).toHaveBeenCalledWith(itemsId);
    });

    it('loadItemCart : should call methods to search the items in the cart', () => {
      spyOn<any>(component, 'searchInItems').and.returnValue([]);
      spyOn<any>(component, 'filterItems').and.returnValue([]);
      spyOn<any>(component, 'sortItems').and.returnValue([]);

      const itemCode = '1292';
      const lotNumber = 'LJ112';
      const allItemList = [dummyItem, dummyItem];
      component.itemCode = itemCode;
      component.lotNumber = lotNumber;
      component.allItemList = allItemList;

      component['loadItemCart']();

      expect(component.searchInItems).toHaveBeenCalledWith(
        allItemList,
        itemCode,
        lotNumber
      );
    });

    it('loadItemCart : should call methods to filter the items in the cart', () => {
      spyOn<any>(component, 'searchInItems').and.returnValue([]);
      spyOn<any>(component, 'filterItems').and.returnValue([]);
      spyOn<any>(component, 'sortItems').and.returnValue([]);

      const filter = [
        {
          key: 'productGroup',
          value: ['FILTER1']
        }
      ];
      const allItemList = [dummyItem, dummyItem];
      component.allItemList = allItemList;

      component.filter = filter;

      component['loadItemCart']();

      expect(component.filterItems).toHaveBeenCalledWith(allItemList, filter);
    });

    it('loadItemCart : should call methods to sort the items in the cart', () => {
      spyOn<any>(component, 'searchInItems').and.returnValue([]);
      spyOn<any>(component, 'filterItems').and.returnValue([]);
      spyOn<any>(component, 'sortItems').and.returnValue([]);

      const sortBy = 'weight';
      const sortOrder = 'ASC';

      const allItemList = [dummyItem, dummyItem];
      component.sortBy = sortBy;
      component.sortOrder = sortOrder;
      component.allItemList = allItemList;

      component['loadItemCart']();

      expect(component.sortItems).toHaveBeenCalledWith(
        allItemList,
        sortBy,
        sortOrder
      );
    });

    it('loadItemCart : should create array with items id', () => {
      spyOn<any>(component, 'searchInItems').and.returnValue([]);
      spyOn<any>(component, 'filterItems').and.returnValue([]);
      spyOn<any>(component, 'sortItems').and.returnValue([]);

      const allItemList = [dummyItem];

      component.allItemList = allItemList;

      component['loadItemCart']();

      expect(component.itemListId).toEqual([dummyItem.id]);
    });

    it('loadItemCart : should  not search, filter or sort if parameters are not set ', () => {
      spyOn<any>(component, 'searchInItems').and.returnValue([]);
      spyOn<any>(component, 'filterItems').and.returnValue([]);
      spyOn<any>(component, 'sortItems').and.returnValue([]);

      const allItemList = [dummyItem, dummyItem];
      const sortBy = null;
      const sortOrder = null;
      const itemCode = null;
      const lotNumber = null;
      const filter = [];

      component.itemCode = itemCode;
      component.lotNumber = lotNumber;
      component.sortBy = sortBy;
      component.sortOrder = sortOrder;
      component.filter = filter;
      component.allItemList = allItemList;

      component['loadItemCart']();

      expect(component.sortItems).not.toHaveBeenCalled();
      expect(component.filterItems).not.toHaveBeenCalled();
      expect(component.searchInItems).not.toHaveBeenCalled();
    });

    it('searchInItems : should search in item list based on itemcode passed', () => {
      const itemList = [
        { ...dummyItem, itemCode: '1111', lotNumber: 'L101' },
        { ...dummyItem, itemCode: '1111', lotNumber: 'L102' },
        ,
        { ...dummyItem, itemCode: '1121', lotNumber: 'L103' }
      ];
      const itemCode = '1111';
      const lotNumber = null;

      expect(
        component.searchInItems(itemList, itemCode, lotNumber).length
      ).toEqual(2);
    });
    it('searchInItems : should search in item list based on itemcode and lot number passed', () => {
      const itemList = [
        { ...dummyItem, itemCode: '1111', lotNumber: 'L101' },
        { ...dummyItem, itemCode: '1111', lotNumber: 'L102' },
        ,
        { ...dummyItem, itemCode: '1121', lotNumber: 'L103' }
      ];
      const itemCode = '1111';
      const lotNumber = 'L101';

      expect(
        component.searchInItems(itemList, itemCode, lotNumber).length
      ).toEqual(1);
    });

    it('filterItems : should filter itmes in item list based on filter data passed', () => {
      const itemList = [
        { ...dummyItem, productGroup: 'GROUP1' },
        { ...dummyItem, productGroup: 'GROUP2' },
        ,
        { ...dummyItem, productGroup: 'GROUP3' }
      ];
      const filter = [
        {
          key: 'productGroup',
          value: ['GROUP1', 'GROUP2']
        }
      ];

      expect(component.filterItems(itemList, filter).length).toEqual(2);
    });

    it('filterItems : should filter itmes in item list based on filter data passed (Mulpitple)', () => {
      const itemList = [
        { ...dummyItem, productGroup: 'GROUP1', productCategory: 'CATEGORY1' },
        { ...dummyItem, productGroup: 'GROUP2', productCategory: 'CATEGORY1' },
        ,
        { ...dummyItem, productGroup: 'GROUP3', productCategory: 'CATEGORY1' }
      ];
      const filter = [
        {
          key: 'productGroup',
          value: ['GROUP1']
        },
        {
          key: 'productCategory',
          value: ['CATEGORY1']
        }
      ];

      expect(component.filterItems(itemList, filter).length).toEqual(1);
    });

    it('sortItems : should sortItems itmes in item list based on sort data passed (ASC)', () => {
      const itemList = [
        { ...dummyItem, id: '0', stdWeight: 10.2 },
        { ...dummyItem, id: '1', stdWeight: 12.2 },

        { ...dummyItem, id: '2', stdWeight: 10.2 }
      ];
      const sortBy = 'stdWeight';
      const sortOrder = 'ASC';

      expect(component.sortItems(itemList, sortBy, sortOrder)[0].id).toEqual(
        '0'
      );
      expect(component.sortItems(itemList, sortBy, sortOrder)[1].id).toEqual(
        '2'
      );
      expect(component.sortItems(itemList, sortBy, sortOrder)[2].id).toEqual(
        '1'
      );
    });

    it('sortItems : should sortItems itmes in item list based on sort data passed (DESC)', () => {
      const itemList = [
        { ...dummyItem, id: '0', stdWeight: 10.2 },
        { ...dummyItem, id: '1', stdWeight: 8 },

        { ...dummyItem, id: '2', stdWeight: 12.11 }
      ];
      const sortBy = 'stdWeight';
      const sortOrder = 'DESC';

      expect(component.sortItems(itemList, sortBy, sortOrder)[0].id).toEqual(
        '2'
      );
      expect(component.sortItems(itemList, sortBy, sortOrder)[1].id).toEqual(
        '0'
      );
      expect(component.sortItems(itemList, sortBy, sortOrder)[2].id).toEqual(
        '1'
      );
    });
  });

  describe('History search', () => {
    beforeEach(() => {
      spyOn<any>(component, 'loadList');
      spyOn<any>(component, 'clearHistorySearch');

      spyOn(component, 'ngOnInit');
    });

    it('should render search box', () => {
      fixture.detectChanges();

      expect(page.historySearchBox).not.toBeNull();
    });

    it('should search for valid input', fakeAsync(() => {
      const srcNo = '10001';
      fixture.detectChanges();
      page.historySearchBox.nativeElement.value = srcNo;
      page.historySearchBox.nativeElement.dispatchEvent(new Event('input'));
      tick(2000);

      expect(component['loadList']).toHaveBeenCalled();
    }));

    it('should clear search on empty input', fakeAsync(() => {
      const srcNo = '';
      fixture.detectChanges();
      page.historySearchBox.nativeElement.value = srcNo;
      page.historySearchBox.nativeElement.dispatchEvent(new Event('input'));
      tick(2000);

      expect(component['clearHistorySearch']).toHaveBeenCalled();
    }));

    // it('should show empty result on invalid input and should not call search', fakeAsync(() => {
    //   spyOn<any>(component, 'searchStocks');
    //   spyOn(component, 'clearSearch');

    //   const stnNo = 'AA11111';
    //   fixture.detectChanges();
    //   page.searchBox.nativeElement.value = stnNo;
    //   page.searchBox.nativeElement.dispatchEvent(new Event('input'));

    //   tick(2000);

    //   expect(component.showNoResultsFoundNaN).toBeTruthy();
    //   expect(component['searchStocks']).not.toHaveBeenCalled();
    //   expect(component['clearSearch']).not.toHaveBeenCalled();
    // }));
  });

  describe('Clear Data and Search Result', () => {
    it('clearHistorySearch : should clear history search', () => {
      component.searchValue = 111;
      spyOn<any>(component, 'loadList');

      component.clearHistorySearch();

      expect(component.searchValue).toEqual(0);
      expect(binToBinTransferFacadeSpy.resetLoadedHistory).toHaveBeenCalled();
    });

    it('clearHistorySearch : should load the history after resetting the search', () => {
      spyOn<any>(component, 'loadList');

      component.clearHistorySearch();

      expect(component.loadList).toHaveBeenCalled();
    });

    it('clearSearchofCart : should reset the search parameters', () => {
      spyOn<any>(component, 'resetSelection');
      spyOn<any>(component, 'loadItemCart');

      component.clearSearchofCart();

      expect(component.itemCode).toBeNull();
      expect(component.lotNumber).toBeNull();
    });

    it('clearSearchofCart : should load the cart items after resetting the search parameters', () => {
      spyOn<any>(component, 'resetSelection');
      spyOn<any>(component, 'loadItemCart');

      component.clearSearchofCart();

      expect(component.resetSelection).toHaveBeenCalled();
      expect(component.loadItemCart).toHaveBeenCalled();
    });

    it('clearAll : should reset the search, filter and sort parameters', () => {
      spyOn<any>(component, 'loadItemCart');

      component.clearAll();

      expect(component.itemCode).toBeNull();
      expect(component.lotNumber).toBeNull();
      expect(component.sortBy).toBeNull();
      expect(component.sortOrder).toBeNull();
      expect(component.sortData).toEqual([]);
      expect(component.selectedBin).toBeNull();
      expect(component.filter).toEqual([]);
      expect(component.filterData).toEqual({});
    });

    it('clearAll : should load the cart items after resetting the search parameters', () => {
      spyOn<any>(component, 'loadItemCart');

      component.clearAll();

      expect(component.loadItemCart).toHaveBeenCalled();
    });

    it('onSearchClear : (Source Bin / Product group / Product category) should load items groups', () => {
      spyOn<any>(component, 'isSelectByGroup').and.returnValue(true);
      spyOn<any>(component, 'initialize');

      component.onSearchClear();

      expect(component['initialize']).toHaveBeenCalled();
    });

    it('onSearchClear : ( Variant Type ) should send action to clear the searched item load items groups', () => {
      spyOn<any>(component, 'isSelectByGroup').and.returnValue(false);
      spyOn<any>(component, 'initialize');

      component.onSearchClear();

      expect(binToBinTransferFacadeSpy.clearSearchedItems).toHaveBeenCalled();
    });
  });

  describe('onSelected', () => {
    it('should navigate to the Item Group details page', () => {
      component.type = BinToBinTransferTypeEnum.BIN_CODE;
      const data = {
        name: 'TESTNAME',
        id: 'TESTID'
      };

      component.onSelected(data);

      expect(component['router'].navigate).toHaveBeenCalledWith([data.name], {
        relativeTo: component['activatedRoute']
      });
    });

    it('should navigate to the History details page', () => {
      component.type = BinToBinTransferTypeEnum.HISTORY;
      const data = {
        name: 'TESTNAME',
        id: 'TESTID'
      };

      component.onSelected(data);

      expect(component['router'].navigate).toHaveBeenCalledWith([data.id], {
        relativeTo: component['activatedRoute']
      });
    });
  });

  it('loadHistory : Should clear the filter options and load the history', () => {
    spyOn(component, 'loadList');

    component.loadHistory();

    expect(component.loadList).toHaveBeenCalledWith(0);
  });

  describe('initialize', () => {
    it('Variant Type : should reset the selection and focus the search bar', () => {
      spyOn(component, 'resetSelection');
      spyOn<any>(component['searchListRef'], 'focus');
      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.VARIANT_CODE);

      component['initialize']();

      expect(component.resetSelection).toHaveBeenCalled();

      expect(component['searchListRef'].focus).toHaveBeenCalled();
    });

    it('Soruce Bin Group : should load soruce bin group and its count', () => {
      spyOn(component, 'loadList');
      const count = 11;
      const data = dummyItemGroup;
      component.sourceBins$ = new BehaviorSubject<
        BinToBinTransferItemListGroup[]
      >(data);
      component.sourceBinsTotalCount$ = new BehaviorSubject<number>(count);

      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.BIN_CODE);

      component['initialize']();

      component.itemGroups$.subscribe(res => {
        expect(res).toEqual(data);
      });

      component.itemGroupsTotalCount$.subscribe(res => {
        expect(res).toEqual(count);
      });
    });

    it('Product Group : should load Product Group and its count', () => {
      spyOn(component, 'loadList');
      const count = 11;

      const data = dummyItemGroup;
      component.productGroups$ = new BehaviorSubject<
        BinToBinTransferItemListGroup[]
      >(data);
      component.productGroupsTotalCount$ = new BehaviorSubject<number>(count);

      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.PRODUCT_GROUP);

      component['initialize']();

      component.itemGroups$.subscribe(res => {
        expect(res).toEqual(data);
      });

      component.itemGroupsTotalCount$.subscribe(res => {
        expect(res).toEqual(count);
      });
    });

    it('Product Category  Group : should load Product Category  group and its count', () => {
      spyOn(component, 'loadList');
      const count = 11;

      const data = dummyItemGroup;
      component.productCategory$ = new BehaviorSubject<
        BinToBinTransferItemListGroup[]
      >(data);
      component.productCategoryTotalCount$ = new BehaviorSubject<number>(count);

      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.PRODUCT_CATEGORY);

      component['initialize']();

      component.itemGroups$.subscribe(res => {
        expect(res).toEqual(data);
      });

      component.itemGroupsTotalCount$.subscribe(res => {
        expect(res).toEqual(count);
      });
    });

    it('Should call inital load with page index 0', () => {
      spyOn(component, 'loadList');
      component.isProducCategoryLoadedOnce = false;
      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.PRODUCT_CATEGORY);

      component['initialize']();

      expect(component['loadList']).toHaveBeenCalledWith(0);
    });

    it('Should not call inital load if loaded once', () => {
      spyOn(component, 'loadList');
      component.isProductGroupsLoadedOnce = true;
      component.binToBinTransferForm
        .get('type')
        .setValue(BinToBinTransferTypeEnum.PRODUCT_GROUP);

      component['initialize']();

      expect(component['loadList']).not.toHaveBeenCalled();
    });
  });

  describe('loadList', () => {
    it('Should call action to load source bins', () => {
      const type = BinToBinTransferTypeEnum.BIN_CODE;
      const pageSize = 8;
      component.initialPageSize = pageSize;
      component.type = type;
      component.binToBinTransferForm.get('type').setValue(type);
      const pageIndex = 0;

      component['loadList'](pageIndex);

      expect(binToBinTransferFacadeSpy.loadSourceBins).toHaveBeenCalledWith({
        type: type,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
    });

    it('Should call action to load product categories', () => {
      const type = BinToBinTransferTypeEnum.PRODUCT_CATEGORY;
      const pageSize = 8;
      component.initialPageSize = pageSize;
      component.type = type;
      component.binToBinTransferForm.get('type').setValue(type);
      const pageIndex = 0;

      component['loadList'](pageIndex);

      expect(
        binToBinTransferFacadeSpy.loadProductsCategory
      ).toHaveBeenCalledWith({
        type: type,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
    });

    it('Should call action to load product groups', () => {
      const type = BinToBinTransferTypeEnum.PRODUCT_GROUP;
      const pageSize = 8;
      component.initialPageSize = pageSize;
      component.type = type;
      component.binToBinTransferForm.get('type').setValue(type);
      const pageIndex = 0;

      component['loadList'](pageIndex);

      expect(binToBinTransferFacadeSpy.loadProductsGroups).toHaveBeenCalledWith(
        {
          type: type,
          pageIndex: pageIndex,
          pageSize: pageSize
        }
      );
    });

    it('Should call action to load history data', () => {
      const type = BinToBinTransferTypeEnum.HISTORY;
      const pageSize = 8;
      component.initialPageSize = pageSize;
      component.type = type;
      component.searchValue = 1212;
      const pageIndex = 0;

      component['loadList'](pageIndex);

      expect(binToBinTransferFacadeSpy.loadBinToBinHistory).toHaveBeenCalled();
    });
  });
});
