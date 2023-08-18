import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';

import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  StockReceiveDetailsComponent,
  searchShortcutKey,
  filterShortcutKey,
  sortShortcutKey,
  backShortcutKey,
  binSelectionShortcutKey
} from './stock-receive-details.component';
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
  StockReceiveTabEnum,
  OverlayNotificationType,
  OverlayNotificationEventType,
  StockReceiveItemToUpdate,
  CustomErrors,
  StockReceiveItemStatusEnum,
  Command,
  ShortcutServiceAbstraction,
  SharedBodEodFeatureServiceAbstraction
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { FilterService } from '@poss-web/shared/components/ui-filter-dialog';
import { SortDialogService } from '@poss-web/shared/components/ui-sort-dialog';
import { NavigationEnd, ActivatedRoute } from '@angular/router';
import { ItemSearchComponent } from '@poss-web/shared/item/ui-item-search';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import {
  getStockReceiveRouteUrl,
  getNotFoundRouteUrl
} from '@poss-web/shared/util-site-routes';
import { By } from '@angular/platform-browser';
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
    return this.query('#binSelection');
  }

  private fixture: ComponentFixture<StockReceiveDetailsComponent>;

  constructor(fixture: ComponentFixture<StockReceiveDetailsComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('StockReceiveDetailsComponent', () => {
  let component: StockReceiveDetailsComponent;
  let fixture: ComponentFixture<StockReceiveDetailsComponent>;
  let stockReceiveFacadeSpy;
  let appsettingFacadeSpy;
  let overlayNotificationServiceSpy;
  let selectionDialogServiceSpy;
  let profiledatafacadeSpy;
  let filterServiceSpy;
  let sortServiceSpy;
  let itemDetailPopupserviceSpy;
  let page: Page;
  let authFacadeSpy;
  let bodEodFeatureServiceSpy;

  beforeEach(() => {
    stockReceiveFacadeSpy = jasmine.createSpyObj([
      'resetError',
      'loadProductGroups',
      'loadProductCategories',
      'getSearchReset',
      'getProductGroups',
      'getProductCategories',
      'clearItems',
      'loadItemsTotalCount',
      'assignBinToAllItems',
      'verifyAllItems',
      'updateItem',
      'verifyItem',
      'validateItem',
      'loadItems',
      'loadItemsTotalCount',
      'getIsLoadingSelectedStock',
      'getIsLoadingBinGroups',
      'getIsLoadingRemarks',
      'getItems',
      'getIsItemsLoading',
      'getIsItemsLoaded',
      'getItemsCount',
      'getItemsTotalCountLoaded',
      'getIsItemsTotalCountLoading',
      'getRemarks',
      'getError',
      'loadBinCodes',
      'loadRemarks',
      'getBinCodes',
      'loadSelectedStock',
      'getSelectedStock',
      'loadSelectedInvoice',
      'getSelectedInvoice',
      'getIsVerifyingAllItemSuccess',
      'getIsAssigningBinToAllItems',
      'getConfirmedStock',
      'getTotalCounts',
      'getIsAssigningBinToAllItemsSuccess',
      'confirmStock',
      'loadStuddedProductGroups',
      'getIsItemsLoading'
    ]);
    appsettingFacadeSpy = jasmine.createSpyObj([
      'getPageSizeOptions',
      'getMaxFilterLimit',
      'getMaxSortLimit',
      'getPageSize'
    ]);

    bodEodFeatureServiceSpy = jasmine.createSpyObj(['getBusinessDayDate']);

    authFacadeSpy = jasmine.createSpyObj(['isUserLoggedIn']);
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
        StockReceiveDetailsComponent,
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
          provide: AuthFacade,
          useValue: authFacadeSpy
        },
        {
          provide: SharedBodEodFeatureServiceAbstraction,
          useValue: bodEodFeatureServiceSpy
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
    fixture = TestBed.createComponent(StockReceiveDetailsComponent);
    page = new Page(fixture);
    component = fixture.componentInstance;

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

    spyOn(component['router'], 'navigate').and.returnValue({ then: () => {} });

    bodEodFeatureServiceSpy.getBusinessDayDate.and.returnValue(of(moment()));
    authFacadeSpy.isUserLoggedIn.and.returnValue(of(true));
    stockReceiveFacadeSpy.getSearchReset.and.returnValue(of());
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
    stockReceiveFacadeSpy.getItemsCount.and.returnValue(of(10));
    stockReceiveFacadeSpy.getIsItemsLoaded.and.returnValue(of(false));
    stockReceiveFacadeSpy.getBinCodes.and.returnValue(of([]));
    stockReceiveFacadeSpy.getItems.and.returnValue(of([]));
    stockReceiveFacadeSpy.getError.and.returnValue(of(null));
    stockReceiveFacadeSpy.getSelectedStock.and.returnValue(of(null));
    stockReceiveFacadeSpy.getSelectedInvoice.and.returnValue(of(null));
    stockReceiveFacadeSpy.getIsAssigningBinToAllItemsSuccess.and.returnValue(
      of(false)
    );

    stockReceiveFacadeSpy.getIsItemsLoading.and.returnValue(of(false));

    stockReceiveFacadeSpy.getIsVerifyingAllItemSuccess.and.returnValue(
      of(null)
    );

    stockReceiveFacadeSpy.getConfirmedStock.and.returnValue(of(null));
    stockReceiveFacadeSpy.getTotalCounts.and.returnValue(
      of({
        nonVerifiedItemsTotalCount: 0,
        verifiedItemsTotalCount: 11,
        isLoaded: true
      })
    );
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

    xit('should switch the tab whem tab parms changes in the url', () => {
      spyOn<any>(component['router'].events, 'next').and.returnValue(
        of(new NavigationEnd(1, '/dummy', '/dummy'))
      );

      spyOn(component, 'changeTab');
      component.ngOnInit();

      expect(component.changeTab).toHaveBeenCalled();
    });

    it('should send shortcut events to shortcutEventHandler', () => {
      spyOn<any>(component, 'shortcutEventHandler');
      profiledatafacadeSpy.isL1Boutique.and.returnValue(of(false));
      profiledatafacadeSpy.isL2Boutique.and.returnValue(of(true));

      component.ngOnInit();

      expect(component['shortcutEventHandler']).toHaveBeenCalled();
    });

    it('should  call clearSearchItems if reset flag is set in state ', () => {
      stockReceiveFacadeSpy.getSearchReset.and.returnValue(of({ reset: true }));
      profiledatafacadeSpy.isL1Boutique.and.returnValue(of(false));
      profiledatafacadeSpy.isL2Boutique.and.returnValue(of(false));
      profiledatafacadeSpy.isL3Boutique.and.returnValue(of(true));
      spyOn(component, 'clearSearchItems');

      component.ngOnInit();

      expect(component.clearSearchItems).toHaveBeenCalled();
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

    it('should load appsetting data and call component int function', () => {
      component.ngOnInit();

      expect(component['componentInit']).toHaveBeenCalled();
    });
  });

  it('should navigate to stock-receive list page on back', () => {
    const type = 'factory';
    component.type = type;

    component.back();

    expect(component['router'].navigate).toHaveBeenCalledWith([
      getStockReceiveRouteUrl(type)
    ]);
  });

  describe('changeTab', () => {
    it('should not call loadItems if new tab is same as current tab', () => {
      spyOn<any>(component, 'loadItems');
      spyOn<any>(component, 'createLoadCountPayLoad');
      component.tab = StockReceiveTabEnum.NON_VERIFIED;

      component.changeTab(StockReceiveTabEnum.NON_VERIFIED);

      expect(component['loadItems']).not.toHaveBeenCalled();
    });

    it('should navigae to respective tab', () => {
      spyOn<any>(component, 'loadItems');
      spyOn<any>(component, 'createLoadCountPayLoad');
      spyOn<any>(component['searchRef'], 'reset');

      component.changeTab(StockReceiveTabEnum.VERIFIED);

      expect(component['router'].navigate).toHaveBeenCalledWith(
        ['..', component.tab],
        {
          relativeTo: component['activatedRoute']
        }
      );
    });
  });

  describe('clearSearchItems', () => {
    it('should call loadItems by setting itemCode and lotNumber to null', () => {
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

  describe('onParentFormDirty', () => {
    it('should call onParentFormDirty by setting isDirty property', () => {
      spyOn<any>(component, 'showNotifications');

      component.onParentFormDirty(true);

      expect(component['showNotifications']).toHaveBeenCalled();
      expect(component.isParentFormDirty).toBeTruthy();
    });
  });

  describe('openBinSelectionPopup', () => {
    it('should open bin selection popup', () => {
      selectionDialogServiceSpy.open.and.returnValue(of(null));
      spyOn<any>(component, 'showProgressNotification');

      component.openBinSelectionPopup({ stopPropagation: () => {} });

      expect(selectionDialogServiceSpy.open).toHaveBeenCalled();
    });

    it('should call assign to all items action selecting the bincode', () => {
      const expected = 'ABCD';
      spyOn<any>(component, 'showProgressNotification');
      spyOn(component, 'updateItem');
      selectionDialogServiceSpy.open.and.returnValue(of({ id: expected }));

      component.openBinSelectionPopup();

      expect(component.selectedBinCode).toEqual(expected);
      expect(component['showProgressNotification']).toHaveBeenCalled();
      expect(stockReceiveFacadeSpy.assignBinToAllItems).toHaveBeenCalled();
    });

    it('should render button to open bin selection popup ', () => {
      stockReceiveFacadeSpy.getItemsTotalCountLoaded.and.returnValue(of(true));
      stockReceiveFacadeSpy.getTotalCounts.and.returnValue(
        of({
          nonVerifiedItemsTotalCount: 0,
          verifiedItemsTotalCount: 11,
          isLoaded: true
        })
      );
      component.tab = StockReceiveTabEnum.VERIFIED;

      fixture.detectChanges();

      expect(page.assignBinToAll).not.toBeNull();
    });

    it('should not render button to open bin selection popup if all the products are not verified ', () => {
      stockReceiveFacadeSpy.getTotalCounts.and.returnValue(
        of({
          nonVerifiedItemsTotalCount: 12,
          verifiedItemsTotalCount: 11,
          isLoaded: true
        })
      );
      stockReceiveFacadeSpy.getItemsTotalCountLoaded.and.returnValue(of(true));
      component.tab = StockReceiveTabEnum.VERIFIED;

      fixture.detectChanges();

      expect(page.assignBinToAll).toBeNull();
    });

    it('should call openBinSelectionPopup when click event is triggered ', () => {
      stockReceiveFacadeSpy.getItemsTotalCountLoaded.and.returnValue(of(true));
      stockReceiveFacadeSpy.getTotalCounts.and.returnValue(
        of({
          nonVerifiedItemsTotalCount: 0,
          verifiedItemsTotalCount: 11,
          isLoaded: true
        })
      );
      component.tab = StockReceiveTabEnum.VERIFIED;

      spyOn(component, 'openBinSelectionPopup');

      fixture.detectChanges();
      page.assignBinToAll.triggerEventHandler('click', null);

      expect(component.openBinSelectionPopup).toHaveBeenCalled();
    });
  });

  describe('Reason fo delay logic', () => {
    it('should be true if the delay is more than configured hours', () => {
      component.selectedStock.srcDocDate = moment().subtract(49, 'h');
      component.businessDate = moment();

      const result = component['checkForDelay']().hasDelay;

      expect(result).toBeTruthy();
    });

    it('should be false if the delay is more than configured hours', () => {
      component.selectedStock.srcDocDate = moment().subtract(46, 'h');
      component.businessDate = moment();

      const result = component['checkForDelay']().hasDelay;

      expect(result).toBeFalsy();
    });

    it('should be false if the delay is equal to configured hours', () => {
      component.selectedStock.srcDocDate = moment()
        .subtract(48, 'h')
        .add(1, 'minute');
      component.businessDate = moment();

      const result = component['checkForDelay']().hasDelay;

      expect(result).toBeFalsy();
    });

    it('should  send the actual delay', () => {
      const expected = 48;
      component.selectedStock.srcDocDate = moment().subtract(expected, 'h');
      component.businessDate = moment();

      const result = component['checkForDelay']().delay;

      expect(result).toBeCloseTo(expected);
    });
  });

  describe('Notification', () => {
    describe('showNotifications', () => {
      beforeEach(() => {
        spyOn<any>(component, 'showVerifyAllNotification');
        spyOn<any>(component, 'showConfirmReceiveNotificationTranslator');
        spyOn<any>(component, 'showVerifiedItemCountNotification');
      });
      it('should call overlay close when error is not shown ', () => {
        component.isShowingErrorNotifcation = false;

        component['showNotifications']();

        expect(overlayNotificationServiceSpy.close).toHaveBeenCalled();
      });

      it('should not call overlay close when error is not shown ', () => {
        component.isShowingErrorNotifcation = true;

        component['showNotifications']();

        expect(overlayNotificationServiceSpy.close).not.toHaveBeenCalled();
      });

      it('should call verify all notifcation in non verified tab when search or filter is not applied  and item count is more than 0 ', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.NON_VERIFIED;
        component.itemCode = null;
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 10;
        component.isParentFormDirty = false;

        component['showNotifications']();

        expect(component['showVerifyAllNotification']).toHaveBeenCalled();
      });

      it('should not call verify all notifcation in verified tab ', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.VERIFIED;
        component.itemCode = null;
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 10;
        component.isParentFormDirty = false;

        component['showNotifications']();

        expect(component['showVerifyAllNotification']).not.toHaveBeenCalled();
      });

      it('should not call verify all notifcation in when item count is 0 ', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.NON_VERIFIED;
        component.itemCode = null;
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 0;
        component.isParentFormDirty = false;

        component['showNotifications']();

        expect(component['showVerifyAllNotification']).not.toHaveBeenCalled();
      });

      it('should not call verify all notifcation in when search is applied ', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.NON_VERIFIED;
        component.itemCode = '11111';
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 10;
        component.isParentFormDirty = false;

        component['showNotifications']();

        expect(component['showVerifyAllNotification']).not.toHaveBeenCalled();
      });

      it('should not call verify all notifcation in when items values are modified ', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.NON_VERIFIED;
        component.itemCode = null;
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 10;
        component.isParentFormDirty = true;

        component['showNotifications']();

        expect(component['showVerifyAllNotification']).not.toHaveBeenCalled();
      });

      it('should call confirm notification in verified tab and all products are verfied', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.VERIFIED;

        component.itemCode = null;
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 0;
        component.verifiedItemsTotalCount = 10;

        component['showNotifications']();

        expect(
          component['showConfirmReceiveNotificationTranslator']
        ).toHaveBeenCalled();
      });

      it('should not call confirm notification in non verified tab', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.NON_VERIFIED;

        component.itemCode = null;
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 0;
        component.verifiedItemsTotalCount = 10;

        component['showNotifications']();

        expect(
          component['showConfirmReceiveNotificationTranslator']
        ).not.toHaveBeenCalled();
      });

      it('should not call confirm notification if search or filter is applied', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.VERIFIED;

        component.itemCode = 'sss';
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 0;
        component.verifiedItemsTotalCount = 10;

        component['showNotifications']();

        expect(
          component['showConfirmReceiveNotificationTranslator']
        ).not.toHaveBeenCalled();
      });

      it('should not call confirm notification if all items are not verified', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.VERIFIED;

        component.itemCode = null;
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 10;
        component.verifiedItemsTotalCount = 10;

        component['showNotifications']();

        expect(
          component['showConfirmReceiveNotificationTranslator']
        ).not.toHaveBeenCalled();
      });

      it('should show count of items left to be veried if all items are not verified', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.VERIFIED;
        component.isverifiedCountShownOnce = false;

        component.itemCode = null;
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 10;
        component.verifiedItemsTotalCount = 10;

        component['showNotifications']();

        expect(
          component['showVerifiedItemCountNotification']
        ).toHaveBeenCalled();
      });

      it('should show count of items left to be veried only once', () => {
        component.isItemLoadedOnce = true;
        component.tab = StockReceiveTabEnum.VERIFIED;
        component.isverifiedCountShownOnce = true;

        component.itemCode = null;
        component.lotNumber = null;
        component.filter = [];
        component.nonVerifiedItemsTotalCount = 10;
        component.verifiedItemsTotalCount = 10;

        component['showNotifications']();

        expect(
          component['showVerifiedItemCountNotification']
        ).not.toHaveBeenCalled();
      });
    });
    it('showProgressNotification : should call overlay notifcation serivce properly ', () => {
      const key = 'pw.stockReceiveNotificationMessages.progressMessage';
      overlayNotificationServiceSpy.show.and.returnValue({ events: of(null) });

      component['showProgressNotification']();

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.PROGRESS,
        message: key,
        hasBackdrop: true
      });
    });

    it('showConfirmReceiveSuccessNotification : should call overlay notifcation serivce properly ', () => {
      const key =
        'pw.stockReceiveNotificationMessages.confirmReceiveSuccessMessage';

      spyOn(component, 'back');
      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({
          eventType: OverlayNotificationEventType.CLOSE,
          data: null
        })
      });
      const documentNumber = 123;

      component['showConfirmReceiveSuccessNotification'](documentNumber);

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.CUSTOM,
        message: key + ' ' + documentNumber,
        hasBackdrop: true,
        hasClose: true,
        template: component['confirmSuccessNotificationTemplate']
      });
    });

    it('showVerifiedItemCountNotification : should call overlay notifcation serivce properly ', () => {
      const key =
        'pw.stockReceiveNotificationMessages.verifiedProductsCountMessage';
      spyOn(component, 'back');
      overlayNotificationServiceSpy.show.and.returnValue({
        events: of({
          eventType: OverlayNotificationEventType.CLOSE,
          data: null
        })
      });
      const count = 123;

      component['showVerifiedItemCountNotification'](count);

      expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
        type: OverlayNotificationType.SIMPLE,
        message: count + ' ' + key,
        hasClose: true
      });
    });

    describe('showVerifyAllNotification', () => {
      it('should call overlay notifcation serivce properly ', () => {
        const key =
          'pw.stockReceiveNotificationMessages.nonVerifiedProductsCountMessage';
        const buttonTextKey =
          'pw.stockReceiveNotificationMessages.verifyAllButtonText';
        overlayNotificationServiceSpy.show.and.returnValue({
          events: of({
            eventType: OverlayNotificationEventType.CLOSE,
            data: null
          })
        });
        const count = 0;

        component['showVerifyAllNotification']();

        expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
          type: OverlayNotificationType.ACTION,
          message: count + ' ' + key,
          buttonText: buttonTextKey
        });
      });

      it(' should call verifyAllItems action', () => {
        overlayNotificationServiceSpy.show.and.returnValue({
          events: of({
            eventType: OverlayNotificationEventType.TRUE,
            data: null
          })
        });
        const count = 123;

        component['showVerifyAllNotification'](count);

        expect(stockReceiveFacadeSpy.verifyAllItems).toHaveBeenCalled();
      });
    });
    it('showConfirmReceiveNotificationTranslator : should call showConfirmReceiveNotification', () => {
      spyOn<any>(component, 'showConfirmReceiveNotification');

      component['showConfirmReceiveNotificationTranslator']();

      expect(component['showConfirmReceiveNotification']).toHaveBeenCalled();
    });

    describe('showConfirmReceiveNotification', () => {
      it('should call overlay notifcation serivce properly ', () => {
        const key =
          'pw.stockReceiveNotificationMessages.confirmReceiveButtonText';

        overlayNotificationServiceSpy.show.and.returnValue({
          events: of({
            eventType: OverlayNotificationEventType.CLOSE,
            data: null
          })
        });
        const message = 'Confirm';

        component['showConfirmReceiveNotification'](message);

        expect(overlayNotificationServiceSpy.show).toHaveBeenCalledWith({
          type: OverlayNotificationType.ACTION,
          message: message,
          buttonText: key,
          hasRemarks: true
        });
      });

      it('should call confirmReceive action if no receving delay for l1 or l2 stores', () => {
        spyOn<any>(component, 'confirmReceive');
        spyOn<any>(component, 'checkForDelay').and.returnValue({
          hasDelay: false
        });
        component.stockForm.get('courierReceivedDate').setValue(moment());

        component.isL1L2Store = true;

        const remarks = 'Remarks';
        overlayNotificationServiceSpy.show.and.returnValue({
          events: of({
            eventType: OverlayNotificationEventType.TRUE,
            data: remarks
          })
        });
        const message = 'Confirm';

        component['showConfirmReceiveNotification'](message);

        expect(component['checkForDelay']).toHaveBeenCalled();
        expect(component['confirmReceive']).toHaveBeenCalledWith(remarks);
      });

      it('should call openReasonForDelayPopup action if no receving delay for l1 or l2 stores', () => {
        spyOn<any>(component, 'openReasonForDelayPopup');
        spyOn<any>(component, 'checkForDelay').and.returnValue({
          hasDelay: true
        });

        component.stockForm.get('courierReceivedDate').setValue(moment());

        component.isL1L2Store = true;

        const remarks = 'Remarks';
        overlayNotificationServiceSpy.show.and.returnValue({
          events: of({
            eventType: OverlayNotificationEventType.TRUE,
            data: remarks
          })
        });
        const message = 'Confirm';

        component['showConfirmReceiveNotification'](message);

        expect(component['checkForDelay']).toHaveBeenCalled();
        expect(component['openReasonForDelayPopup']).toHaveBeenCalledWith(
          remarks
        );
      });

      it('should call confirmReceive action for l3 without checking for the delay', () => {
        spyOn<any>(component, 'confirmReceive');
        spyOn<any>(component, 'checkForDelay').and.returnValue({
          hasDelay: false
        });

        component.stockForm.get('courierReceivedDate').setValue(moment());

        component.isL3Store = true;

        const remarks = 'Remarks';
        overlayNotificationServiceSpy.show.and.returnValue({
          events: of({
            eventType: OverlayNotificationEventType.TRUE,
            data: remarks
          })
        });
        const message = 'Confirm';

        component['showConfirmReceiveNotification'](message);

        expect(component['checkForDelay']).not.toHaveBeenCalled();
        expect(component['confirmReceive']).toHaveBeenCalledWith(remarks);
      });
      it('should call error notifcation if courier Received Date is invalid', () => {
        spyOn<any>(component, 'confirmReceive');
        spyOn<any>(component, 'openReasonForDelayPopup');
        spyOn<any>(component, 'checkForDelay').and.returnValue({
          hasDelay: false
        });
        spyOn<any>(component, 'showConfirmReceiveNotificationTranslator');

        component.isL1L2Store = true;
        component.stockForm.get('courierReceivedDate').setValue(null);

        overlayNotificationServiceSpy.show.and.returnValue({
          events: of({
            eventType: OverlayNotificationEventType.TRUE
          })
        });
        const message = 'Confirm';

        component['showConfirmReceiveNotification'](message);

        expect(component['checkForDelay']).not.toHaveBeenCalled();
        expect(component['confirmReceive']).not.toHaveBeenCalled();
        expect(component['openReasonForDelayPopup']).not.toHaveBeenCalled();
        expect(
          component['showConfirmReceiveNotificationTranslator']
        ).toHaveBeenCalled();
      });
    });
  });

  describe('openReasonForDelayPopup', () => {
    it('should open a dialog', () => {
      spyOn<any>(component['dialog'], 'open').and.returnValue({
        afterClosed: () => of(true)
      });

      component['openReasonForDelayPopup']('remarks');

      expect(component['dialog'].open).toHaveBeenCalled();
    });

    it('should call confirmReceive on confirm with remarks and reason for delay', () => {
      const reasonForDelay = 'Reason';
      const remaks = 'Remarks';

      spyOn<any>(component['dialog'], 'open').and.returnValue({
        afterClosed: () => of({ type: 'confirm', data: reasonForDelay })
      });

      spyOn<any>(component, 'confirmReceive');

      component['openReasonForDelayPopup'](remaks);

      expect(component['confirmReceive']).toHaveBeenCalledWith(
        remaks,
        reasonForDelay
      );
    });

    it('should show other notification on close', () => {
      const remaks = 'Remarks';

      spyOn<any>(component['dialog'], 'open').and.returnValue({
        afterClosed: () => of({ type: 'close', data: null })
      });

      spyOn<any>(component, 'showNotifications');

      component['openReasonForDelayPopup'](remaks);

      expect(component['showNotifications']).toHaveBeenCalled();
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
      component.nonVerifiedItemsTotalCount = 0;
      component.verifiedItemsTotalCount = 10;
      component.tab = StockReceiveTabEnum.VERIFIED;

      const command = new Command();
      command.name = binSelectionShortcutKey;
      spyOn(component, 'openBinSelectionPopup');
      component['shortcutEventHandler'](command);

      expect(component.openBinSelectionPopup).toHaveBeenCalled();
    });

    it('should not open bin selection popup in non verified tab', () => {
      component.nonVerifiedItemsTotalCount = 0;
      component.verifiedItemsTotalCount = 10;
      component.tab = StockReceiveTabEnum.NON_VERIFIED;
      const command = new Command();
      command.name = binSelectionShortcutKey;
      spyOn(component, 'openBinSelectionPopup');
      component['shortcutEventHandler'](command);

      expect(component.openBinSelectionPopup).not.toHaveBeenCalled();
    });

    it('should not open bin selection popup if all the products are not verified', () => {
      component.verifiedItemsTotalCount = 10;
      component.nonVerifiedItemsTotalCount = 0;
      component.tab = StockReceiveTabEnum.NON_VERIFIED;
      const command = new Command();
      command.name = binSelectionShortcutKey;
      spyOn(component, 'openBinSelectionPopup');
      component['shortcutEventHandler'](command);

      expect(component.openBinSelectionPopup).not.toHaveBeenCalled();
    });
  });

  describe('Item', () => {
    it('updateItem : should call updateItem action', () => {
      const data: StockReceiveItemToUpdate = {
        id: 'Test123',
        newUpdate: {
          binCode: 'TestBinCode',
          binGroupCode: 'TestBinGroupCode',
          measuredWeight: 10,
          remarks: 'Remarks',
          itemDetails: {}
        },
        actualDetails: {
          binCode: 'TestBinCode',
          binGroupCode: 'TestBinGroupCode',
          measuredWeight: 10,
          remarks: 'Remarks',
          itemDetails: {}
        }
      };

      const expected = {
        storeType: component.storeType,
        type: component.selectedStock.type,
        id: component.selectedStock.id,
        itemId: data.id,
        newUpdate: data.newUpdate,
        actualDetails: data.actualDetails
      };
      component.updateItem(data);

      expect(stockReceiveFacadeSpy.updateItem).toHaveBeenCalledWith(expected);
    });
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

    it('validateItem : should call validateItem action', () => {
      const data = {
        itemId: 'Test123',
        productGroupCode: 'TestPGC',
        availableWeight: 10,
        measuredWeight: 11,
        measuredQuantity: 2,
        availableQuantity: 2
      };

      component.validateItem(data);

      expect(stockReceiveFacadeSpy.validateItem).toHaveBeenCalledWith(data);
    });
    it('verifyItem :should call verifyItem action', () => {
      spyOn<any>(component, 'creatItemLoadPayload').and.returnValue(null);
      const data: StockReceiveItemToUpdate = {
        id: 'Test123',
        newUpdate: {
          binCode: 'TestBinCode',
          binGroupCode: 'TestBinGroupCode',
          measuredWeight: 10,
          remarks: 'Remarks',
          itemDetails: {}
        },
        actualDetails: {
          binCode: 'TestBinCode',
          binGroupCode: 'TestBinGroupCode',
          measuredWeight: 10,
          remarks: 'Remarks',
          itemDetails: {}
        }
      };

      const expected = {
        storeType: component.storeType,
        type: component.selectedStock.type,
        id: component.selectedStock.id,
        itemId: data.id,
        newUpdate: data.newUpdate,
        actualDetails: data.actualDetails,
        loadItemsPayload: null,
        loadTemsCountPayload: {
          storeType: component.storeType,
          id: component.selectedStock.id,
          type: component.selectedStock.type
        }
      };
      component.verifyItem(data);

      expect(stockReceiveFacadeSpy.verifyItem).toHaveBeenCalledWith(expected);
    });

    it('loadItems : should call loadItems action', () => {
      const data = {
        id: 'Test123'
      };
      component.storeType = 'L1';

      spyOn<any>(component, 'creatItemLoadPayload').and.returnValue(data);

      component['loadItems']();

      expect(stockReceiveFacadeSpy.loadItems).toHaveBeenCalledWith(data);
    });

    it('creatItemLoadPayload : should call create item load payload action', () => {
      component.itemsPageEvent = component.initailPageEvent;
      component.tab = StockReceiveTabEnum.VERIFIED;
      component.storeType = 'L1';
      component.itemsCount = 1;
      component.itemCode = '1112';

      let actual = component['creatItemLoadPayload']();
      expect(actual.status).toBe(StockReceiveItemStatusEnum.VERIFIED);

      component.tab = StockReceiveTabEnum.NON_VERIFIED;

      actual = component['creatItemLoadPayload'](true);

      expect(actual.status).toBe(StockReceiveItemStatusEnum.ISSUED);
      expect(actual.isSearchReset).toBeTruthy();
    });

    it('should render item list ', () => {
      fixture.detectChanges();

      expect(page.itemList).not.toBeNull();
    });

    it('should call verifyItem when verify event is triggered ', () => {
      spyOn(component, 'verifyItem');

      fixture.detectChanges();
      page.itemList.triggerEventHandler('verify', null);

      expect(component.verifyItem).toHaveBeenCalled();
    });

    it('should call updateItem when search update is triggered ', () => {
      spyOn(component, 'updateItem');

      fixture.detectChanges();
      page.itemList.triggerEventHandler('update', null);

      expect(component.updateItem).toHaveBeenCalled();
    });

    it('should call paginate when search paginator is triggered ', () => {
      spyOn(component, 'paginate');

      fixture.detectChanges();
      page.itemList.triggerEventHandler('paginator', null);

      expect(component.paginate).toHaveBeenCalled();
    });

    it('should call onParentFormDirty when parentFormDirty event is triggered ', () => {
      spyOn(component, 'onParentFormDirty');

      fixture.detectChanges();
      page.itemList.triggerEventHandler('parentFormDirty', null);

      expect(component.onParentFormDirty).toHaveBeenCalled();
    });

    it('should call validateItem when validate event is triggered ', () => {
      spyOn(component, 'validateItem');

      fixture.detectChanges();
      page.itemList.triggerEventHandler('validate', null);

      expect(component.validateItem).toHaveBeenCalled();
    });
  });

  it('initialLoad : should call loadItems and count', () => {
    const data = {
      id: 'Test123'
    };

    spyOn<any>(component, 'createLoadCountPayLoad').and.returnValue(data);
    spyOn<any>(component, 'loadItems');

    component['initialLoad']();

    expect(stockReceiveFacadeSpy.loadItemsTotalCount).toHaveBeenCalledWith(
      data
    );
    expect(component['loadItems']).toHaveBeenCalled();
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

    it('should navigate back  if stock-not found and stock is already verified', () => {
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
      spyOn<any>(component, 'showNotifications');

      component['errorHandler'](error);

      expect(component['showNotifications']).toHaveBeenCalled();
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
      spyOn<any>(component, 'showNotifications');
      spyOn<any>(component, 'initialLoad');
      spyOn<any>(component, 'changeTab');
      spyOn<any>(component, 'errorHandler');
      spyOn<any>(component, 'showConfirmReceiveSuccessNotification');
      spyOn<any>(component, 'loadItems');
    });

    it('should send actions to load bin-groups, remarks ', () => {
      component['componentInit']();

      expect(stockReceiveFacadeSpy.loadBinCodes).toHaveBeenCalled();
      expect(stockReceiveFacadeSpy.loadRemarks).toHaveBeenCalled();
    });

    it('should show notifcation once the items are loaded  ', () => {
      stockReceiveFacadeSpy.getIsItemsLoaded.and.returnValue(of(true));

      component['componentInit']();

      expect(component['showNotifications']).toHaveBeenCalled();
    });

    it('should  load the bincodes', () => {
      component.isL1L2Store = true;

      const binCodes = [
        {
          binCode: 'BinCode1',
          description: 'BinCode1'
        },
        {
          binCode: 'BinCode2',
          description: 'BinCode2'
        }
      ];
      stockReceiveFacadeSpy.getBinCodes.and.returnValue(of(binCodes));

      component['componentInit']();

      expect(component.binCodes).toEqual(binCodes);
      expect(component.binsForSelection.length).toEqual(binCodes.length);
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
      const stockType = 'factory';
      const stockAPIType = 'FAC_BTQ';

      component.stockId = stockId;
      component.type = stockType;

      component['componentInit']();

      expect(stockReceiveFacadeSpy.loadSelectedStock).toHaveBeenCalledWith({
        id: stockId,
        type: stockAPIType
      });
    });

    it('should set the selected stock and call load items L1/L2', () => {
      const selectedStock = { ...component.selectedStock, id: 122212 };
      stockReceiveFacadeSpy.getSelectedStock.and.returnValue(of(selectedStock));
      component.isL1L2Store = true;
      const stockId = '123';
      const stockType = 'boutique';

      component.stockId = stockId;
      component.type = stockType;

      component['componentInit']();

      expect(component['initialLoad']).toHaveBeenCalled();
      expect(component.selectedStock).toEqual(selectedStock);
    });

    it('should call loadSelectedInvoice for L3', () => {
      component.isL3Store = true;
      const stockId = '123';
      const stockType = 'cfa';
      const stockAPIType = 'CFA_BTQ';

      component.stockId = stockId;
      component.type = stockType;

      component['componentInit']();

      expect(stockReceiveFacadeSpy.loadSelectedInvoice).toHaveBeenCalledWith({
        id: stockId,
        type: stockAPIType
      });
    });

    it('should set the selected stock and call load items L3', () => {
      const selectedStock = { ...component.selectedStock, id: 122212 };
      stockReceiveFacadeSpy.getSelectedInvoice.and.returnValue(
        of(selectedStock)
      );
      component.isL3Store = true;
      const stockId = '123';
      const stockType = 'cfa';

      component.stockId = stockId;
      component.type = stockType;

      component['componentInit']();

      expect(component['initialLoad']).toHaveBeenCalled();
      expect(component.selectedStock).toEqual(selectedStock);
    });

    it('should switch verify tab after verifying all the items  ', () => {
      stockReceiveFacadeSpy.getIsVerifyingAllItemSuccess.and.returnValue(
        of(true)
      );

      component['componentInit']();

      expect(component.changeTab).toHaveBeenCalledWith(
        StockReceiveTabEnum.VERIFIED
      );
    });

    it('should assign the counts after loading the total counts ', () => {
      const result = {
        nonVerifiedItemsTotalCount: 10,
        verifiedItemsTotalCount: 11,
        isLoaded: true
      };
      stockReceiveFacadeSpy.getTotalCounts.and.returnValue(of(result));

      component['componentInit']();

      expect(component.changeTab).not.toHaveBeenCalledWith(
        StockReceiveTabEnum.VERIFIED
      );
      expect(component.nonVerifiedItemsTotalCount).toEqual(
        result.nonVerifiedItemsTotalCount
      );
      expect(component.verifiedItemsTotalCount).toEqual(
        result.verifiedItemsTotalCount
      );
      expect(component['showNotifications']).toHaveBeenCalled();
    });

    it('should switch to the verify tab if all are verified  ', () => {
      const result = {
        nonVerifiedItemsTotalCount: 0,
        verifiedItemsTotalCount: 11,
        isLoaded: true
      };
      stockReceiveFacadeSpy.getTotalCounts.and.returnValue(of(result));

      component['componentInit']();

      expect(component.changeTab).toHaveBeenCalledWith(
        StockReceiveTabEnum.VERIFIED
      );
      expect(component['showNotifications']).toHaveBeenCalled();
    });

    it('should load items after assigning the binCodes to all the items', () => {
      stockReceiveFacadeSpy.getIsAssigningBinToAllItemsSuccess.and.returnValue(
        of(true)
      );

      component['componentInit']();

      expect(component['loadItems']).toHaveBeenCalled();
    });

    it('should show success notifcation after confirm', () => {
      const result = {
        destDocNo: 123
      };
      stockReceiveFacadeSpy.getConfirmedStock.and.returnValue(of(result));

      component['componentInit']();

      expect(
        component['showConfirmReceiveSuccessNotification']
      ).toHaveBeenCalledWith(result.destDocNo);
      expect(component.destDocNo).toEqual(result.destDocNo);
    });
  });

  describe('confirmReceive', () => {
    const remarks = 'Remarks';
    const reason = 'Reason';

    beforeEach(() => {
      spyOn<any>(component, 'showProgressNotification');
    });
    it('should show showProgressNotification', () => {
      component.isL1L2Store = true;
      component.stockForm.get('courierReceivedDate').setValue(moment());

      component['confirmReceive'](remarks);
      expect(component['showProgressNotification']).toHaveBeenCalled();
    });

    it('should call confirmStock with required data for L1/L2', () => {
      component.storeType = 'L1';
      component.isL1L2Store = true;
      const courierReceivedDate = moment();
      component.stockForm
        .get('courierReceivedDate')
        .setValue(courierReceivedDate);
      const confirmReceiveData = {
        courierReceivedDate: courierReceivedDate.format(),
        reasonForDelay: reason,
        remarks: remarks
      };
      component['confirmReceive'](remarks, reason);
      expect(stockReceiveFacadeSpy.confirmStock).toHaveBeenCalledWith({
        storeType: component.storeType,
        type: component.selectedStock.type,
        id: component.selectedStock.id,
        confirmReceive: confirmReceiveData
      });
    });

    it('should call confirmStock with required data for L3', () => {
      component.storeType = 'L3';
      component.isL3Store = true;
      const courierReceivedDate = moment();
      component.stockForm
        .get('courierReceivedDate')
        .setValue(courierReceivedDate);
      const confirmReceiveData = {
        receivedDate: courierReceivedDate.format(),
        remarks
      };
      component['confirmReceive'](remarks, reason);
      expect(stockReceiveFacadeSpy.confirmStock).toHaveBeenCalledWith({
        storeType: component.storeType,
        type: component.selectedStock.type,
        id: component.selectedStock.id,
        confirmReceive: confirmReceiveData
      });
    });
  });

  it('should render option to choose courier received date', () => {
    fixture.detectChanges();

    expect(page.courierReceivedDate).not.toBeNull();
  });

  describe('loader', () => {
    it('should show loader if any of the operation is in progress', () => {
      stockReceiveFacadeSpy.getIsLoadingBinGroups.and.returnValue(of(false));
      stockReceiveFacadeSpy.getIsLoadingSelectedStock.and.returnValue(
        of(false)
      );
      stockReceiveFacadeSpy.getIsLoadingRemarks.and.returnValue(of(false));
      stockReceiveFacadeSpy.getIsItemsTotalCountLoading.and.returnValue(
        of(false)
      );
      stockReceiveFacadeSpy.getIsItemsLoading.and.returnValue(of(true));

      fixture.detectChanges();

      expect(page.loader).not.toBeNull();
    });

    it('should not show loader if any of the operation is not in progress', () => {
      stockReceiveFacadeSpy.getIsLoadingBinGroups.and.returnValue(of(false));
      stockReceiveFacadeSpy.getIsLoadingSelectedStock.and.returnValue(
        of(false)
      );
      stockReceiveFacadeSpy.getIsLoadingRemarks.and.returnValue(of(false));
      stockReceiveFacadeSpy.getIsItemsTotalCountLoading.and.returnValue(
        of(false)
      );
      stockReceiveFacadeSpy.getIsItemsLoading.and.returnValue(of(false));

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
