import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { StockReceiveListComponent } from './stock-receive-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Pipe,
  PipeTransform,
  NO_ERRORS_SCHEMA,
  DebugElement,
  Directive,
  Input,
  NgZone
} from '@angular/core';
import { StockReceiveFacade } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  CustomErrors,
  StockReceiveTypesEnum,
  StockReceiveAPITypesEnum,
  StockReceiveTabEnum,
  Command,
  ShortcutServiceAbstraction,
  SharedBodEodFeatureServiceAbstraction
} from '@poss-web/shared/models';
import { of } from 'rxjs';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

import { By } from '@angular/platform-browser';
import { InventoryHomeFacade } from '@poss-web/eposs/inventory-home/data-access-inventory-home';
import {
  getInventoryHomeRouteUrl,
  getStockReceiveRouteUrl,
  getStockReceiveHistoryRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Platform } from '@angular/cdk/platform';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';

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
  name: 'currencyFormatter'
})
class CurrencyFormatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Directive({
  selector: '[possWebDateRangePickerMd]'
})
class DatePickerStub {
  @Input() maxDate;
  @Input() showDropdowns;
}

class Page {
  get boutiquetypeDropdown() {
    return this.query('#boutiquetypeDropdown');
  }

  get historyBoutiquetypeDropdown() {
    return this.query('#historyBoutiquetypeDropdown');
  }

  get typeRadioButtons() {
    return this.query('mat-radio-group');
  }

  get searchBox() {
    return this.query('#searchBox');
  }

  get historySearch() {
    return this.query('#historySearch');
  }

  get clearSearchButton() {
    return this.query('.pw-close-icon-16');
  }

  get loader() {
    return this.query('poss-web-loader');
  }

  get cardList() {
    return this.query('poss-web-card-list');
  }

  private fixture: ComponentFixture<StockReceiveListComponent>;

  constructor(fixture: ComponentFixture<StockReceiveListComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('StockReceiveListComponent', () => {
  let component: StockReceiveListComponent;
  let fixture: ComponentFixture<StockReceiveListComponent>;
  let stockReceiveFacadeSpy;
  let inventoryHomeFacadeSpy;
  let overlayNotificationServiceSpy;
  let profiledatafacadeSpy;
  let permissionFacadeSpy;
  let elementPermissionServiceSpy;
  let permissionServiceSpy;
  let authFacadeSpy;
  let bodEodFeatureServiceSpy;

  let page: Page;

  beforeEach(() => {
    permissionServiceSpy = jasmine.createSpyObj(['hasPermission']);
    elementPermissionServiceSpy = jasmine.createSpyObj(['loadPermission']);
    permissionFacadeSpy = jasmine.createSpyObj(['getPermissionforURL']);
    stockReceiveFacadeSpy = jasmine.createSpyObj([
      'resetAdvanceFilter',
      'resetStockReceiveHistory',
      'resetError',
      'clearStocks',
      'clearPendingBoutiqueSTN',
      'loadPendingFactorySTN',
      'loadPendingBoutiqueSTN',
      'loadPendingCFAInvoice',
      'loadStockReceiveHistory',
      'loadPendingMerchandiseSTN',
      'loadStockReceiveInvoiceHistory',
      'getError',
      'searchClear',
      'getIsSearchingStocks',
      'getHasSearchStockResults',
      'getIsSearchingInvoices',
      'getHasSearchInvoiceResults',
      'getSearchStockResults',
      'getSearchInvoiceResults',
      'getHistoryTotalElements',
      'getIsLoadingPendingFactorySTN',
      'getIsLoadingPendingBoutiqueSTN',
      'getILoadingPendingMerchandiseSTN',
      'getIsLoadingHistory',
      'getIsLoadingPendingCFAInvoice',
      'searchPendingStocks',
      'searchPendingInvoices',
      'getStockReceiveHistory',
      'getPendingFactorySTN',
      'getPendingBoutiqueSTN',
      'getPendingCFAInvoice',
      'getPendingMerchandiseSTN',
      'getHistoryType',
      'storeHistoryType',
      'storeAdvancedFilterData',
      'getAdvancedFilter',
      'clearSearchResult',
      'getOracleFetchInfo',
      'fetchSTNFromOracle',
      'fetchInvoiceFromOracle'
    ]);
    inventoryHomeFacadeSpy = jasmine.createSpyObj([
      'getIsLoadingCount',
      'resetError',
      'getError',
      'loadStockTransferNoteCount',
      'loadReceiveInvoiceCount',
      'getPendingFactorySTNCount',
      'getPendingBoutiqueSTNCount',
      'getPendingMerchandiseSTNcount',
      'getPendingCFASTNCount'
    ]);
    overlayNotificationServiceSpy = jasmine.createSpyObj(['show', 'close']);
    profiledatafacadeSpy = jasmine.createSpyObj([
      'getBoutiqueType',
      'isL1Boutique',
      'isL2Boutique',
      'isL3Boutique'
    ]);

    bodEodFeatureServiceSpy = jasmine.createSpyObj(['getBusinessDayDate']);

    authFacadeSpy = jasmine.createSpyObj(['isUserLoggedIn']);
    TestBed.configureTestingModule({
      declarations: [
        StockReceiveListComponent,
        TranslatePipeStub,
        DateFromatterPipeStub,
        CurrencyFormatterPipeStub,
        DatePickerStub
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
          provide: InventoryHomeFacade,
          useValue: inventoryHomeFacadeSpy
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
          provide: ShortcutServiceAbstraction,
          useValue: {
            commands: of(new Command()),
            open: () => {}
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
          provide: AuthFacade,
          useValue: authFacadeSpy
        },
        {
          provide: SharedBodEodFeatureServiceAbstraction,
          useValue: bodEodFeatureServiceSpy
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
          provide: ProfileDataFacade,
          useValue: profiledatafacadeSpy
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
                type: 'factory'
              }
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(StockReceiveListComponent);
    component = fixture.componentInstance;

    component['cardListComponentRef'] = new CardListComponent(
      new BreakpointObserver(
        new MediaMatcher(new Platform(null)),
        new NgZone({})
      )
    );
    page = new Page(fixture);
    spyOn(component['router'], 'navigate');
    bodEodFeatureServiceSpy.getBusinessDayDate.and.returnValue(of(moment()));
    authFacadeSpy.isUserLoggedIn.and.returnValue(of(true));
    profiledatafacadeSpy.getBoutiqueType.and.returnValue(of('L1'));
    profiledatafacadeSpy.isL1Boutique.and.returnValue(of(true));
    profiledatafacadeSpy.isL2Boutique.and.returnValue(of(false));
    profiledatafacadeSpy.isL3Boutique.and.returnValue(of(false));

    stockReceiveFacadeSpy.getError.and.returnValue(of(null));
    inventoryHomeFacadeSpy.getError.and.returnValue(of(null));

    stockReceiveFacadeSpy.getIsLoadingPendingFactorySTN.and.returnValue(
      of(false)
    );
    stockReceiveFacadeSpy.getIsLoadingPendingBoutiqueSTN.and.returnValue(
      of(false)
    );
    stockReceiveFacadeSpy.getIsLoadingPendingCFAInvoice.and.returnValue(
      of(false)
    );
    stockReceiveFacadeSpy.getILoadingPendingMerchandiseSTN.and.returnValue(
      of(false)
    );

    stockReceiveFacadeSpy.getOracleFetchInfo.and.returnValue(of(null));

    stockReceiveFacadeSpy.getIsLoadingHistory.and.returnValue(of(false));
    stockReceiveFacadeSpy.getStockReceiveHistory.and.returnValue(of([]));
    stockReceiveFacadeSpy.getPendingFactorySTN.and.returnValue(of([]));
    stockReceiveFacadeSpy.getPendingBoutiqueSTN.and.returnValue(of([]));
    stockReceiveFacadeSpy.getPendingCFAInvoice.and.returnValue(of([]));
    stockReceiveFacadeSpy.getPendingMerchandiseSTN.and.returnValue(of([]));
    stockReceiveFacadeSpy.getHistoryType.and.returnValue(of('factory'));
    stockReceiveFacadeSpy.getAdvancedFilter.and.returnValue(of(null));
    elementPermissionServiceSpy.loadPermission.and.returnValue(
      of({ transactionCodes: [] })
    );
    permissionFacadeSpy.getPermissionforURL.and.returnValue(
      of({ transactionCodes: [] })
    );
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('back : should navigate to inventory home page', () => {
    component.back();

    expect(component['router'].navigate).toHaveBeenCalledWith([
      getInventoryHomeRouteUrl()
    ]);
  });

  it('errorHandler : should open error notifcation', () => {
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

  describe('onInit', () => {
    beforeEach(() => {
      spyOn<any>(component, 'componentInit');
      spyOn<any>(component, 'loadHistory');
      spyOn(component, 'clearSearch');
      spyOn<any>(component, 'shortcutEventHandler');
    });
    it('should send action to reset-error and to clear stocks', () => {
      component.ngOnInit();

      expect(stockReceiveFacadeSpy.resetError).toHaveBeenCalled();
      expect(inventoryHomeFacadeSpy.resetError).toHaveBeenCalled();
      expect(stockReceiveFacadeSpy.clearStocks).toHaveBeenCalled();
    });

    it('should send shortcut events to shortcutEventHandler', () => {
      component.ngOnInit();

      expect(component['shortcutEventHandler']).toHaveBeenCalled();
    });

    it('should call component init', () => {
      component.ngOnInit();
      expect(component['componentInit']).toHaveBeenCalled();
    });

    it('should fetch and assign to profile info variables', () => {
      profiledatafacadeSpy.getBoutiqueType.and.returnValue(of('L2'));
      profiledatafacadeSpy.isL1Boutique.and.returnValue(of(false));
      profiledatafacadeSpy.isL2Boutique.and.returnValue(of(true));
      profiledatafacadeSpy.isL3Boutique.and.returnValue(of(false));

      component.ngOnInit();

      expect(component.storeType).toEqual('L2');
      expect(component.isL1L2Store).toEqual(true);
      expect(component.isL3Store).toEqual(false);
    });
  });

  describe('openHistoryFilter', () => {
    it('should open dialog', () => {
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(null)
      });
      component.openHistoryFilter();
      expect(component.dialog.open).toHaveBeenCalled();
    });

    it('should assign filter data to a variable', () => {
      const result = {
        destDocNo: 1234,
        sourceLocationCode: 'URB',
        fiscalYear: 2019,
        stnNumber: 1234
      };

      component.advanceFilter = result;

      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(result)
      });

      spyOn<any>(component, 'loadHistory');

      component.openHistoryFilter();
      expect(component.advanceFilter).toEqual(result);
    });

    it('should call loadHistory filters selected', () => {
      const result = { data: 'Filters' };
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(result)
      });
      spyOn<any>(component, 'loadHistory');

      component.openHistoryFilter();
      expect(component['loadHistory']).toHaveBeenCalled();
    });
  });

  describe('STN search', () => {
    beforeEach(() => {
      spyOn<any>(component, 'componentInit');
      spyOn<any>(component, 'shortcutEventHandler');
    });

    it('should render search box', () => {
      fixture.detectChanges();

      expect(page.searchBox).not.toBeNull();
    });

    it('should search for valid input', fakeAsync(() => {
      spyOn<any>(component, 'searchStocks');

      const stnNo = 10001;
      fixture.detectChanges();
      page.searchBox.nativeElement.value = stnNo;
      page.searchBox.nativeElement.dispatchEvent(new Event('input'));
      tick(2000);

      expect(component['searchStocks']).toHaveBeenCalled();
    }));

    it('should clear search on empty input', fakeAsync(() => {
      spyOn(component, 'clearSearch');

      const stnNo = '';
      fixture.detectChanges();
      page.searchBox.nativeElement.value = stnNo;
      page.searchBox.nativeElement.dispatchEvent(new Event('input'));
      tick(2000);

      expect(component['clearSearch']).toHaveBeenCalled();
    }));

    it('should call clearSearchResult for invalid input', fakeAsync(() => {
      spyOn<any>(component, 'searchStocks');
      spyOn(component, 'clearSearch');

      const stnNo = 'AA11111';
      fixture.detectChanges();
      page.searchBox.nativeElement.value = stnNo;
      page.searchBox.nativeElement.dispatchEvent(new Event('input'));

      tick(2000);

      expect(component['searchStocks']).not.toHaveBeenCalled();
      expect(stockReceiveFacadeSpy.clearSearchResult).toHaveBeenCalled();
    }));

    it('clearSearch : should send search clear action and reset the search value', () => {
      spyOn(component.searchFormControl, 'reset');

      component.clearSearch();

      expect(component.searchFormControl.reset).toHaveBeenCalled();

      expect(stockReceiveFacadeSpy.searchClear).toHaveBeenCalled();
    });

    it('From Factory : should send action to search STN with correct parameters ', () => {
      const stnNumber = '1233';
      component.isL1L2Store = true;
      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;
      const expected = {
        srcDocnumber: stnNumber,
        type: StockReceiveAPITypesEnum.FAC_BTQ
      };
      component['searchStocks'](stnNumber);

      expect(stockReceiveFacadeSpy.searchPendingStocks).toHaveBeenCalledWith(
        expected
      );
    });
    it('From Other Boutiques : should send action to search STN with correct parameters ', () => {
      const stnNumber = '1233';
      component.isL1L2Store = true;
      component.stockReceiveType = StockReceiveTypesEnum.BTQ_BTQ;
      const expected = {
        srcDocnumber: stnNumber,
        type: StockReceiveAPITypesEnum.BTQ_BTQ
      };
      component['searchStocks'](stnNumber);

      expect(stockReceiveFacadeSpy.searchPendingStocks).toHaveBeenCalledWith(
        expected
      );
    });

    it('From Merchandise : should send action to search STN with correct parameters ', () => {
      const stnNumber = '1233';
      component.isL1L2Store = true;
      component.stockReceiveType = StockReceiveTypesEnum.MER_BTQ;
      const expected = {
        srcDocnumber: stnNumber,
        type: StockReceiveAPITypesEnum.MER_BTQ
      };
      component['searchStocks'](stnNumber);

      expect(stockReceiveFacadeSpy.searchPendingStocks).toHaveBeenCalledWith(
        expected
      );
    });

    it('From CFA : should send action to search STN with correct parameters L3', () => {
      const stnNumber = '1233';
      component.isL3Store = true;
      component.stockReceiveType = StockReceiveTypesEnum.CFA_BTQ;
      const expected = {
        srcDocnumber: stnNumber,
        type: StockReceiveAPITypesEnum.CFA_BTQ
      };
      component['searchStocks'](stnNumber);

      expect(stockReceiveFacadeSpy.searchPendingInvoices).toHaveBeenCalledWith(
        expected
      );
    });
  });

  describe('componentInit', () => {
    beforeEach(() => {
      spyOn<any>(component, 'errorHandler');
      spyOn(component, 'navigateToTabs');
      spyOn<any>(component, 'getStocks');
    });
    it('should call get stocks method', () => {
      component['componentInit']();

      expect(component['getStocks']).toHaveBeenCalled();
    });

    it('should fetch all store data', () => {
      stockReceiveFacadeSpy.getIsLoadingPendingFactorySTN.and.returnValue(
        of(false)
      );
      stockReceiveFacadeSpy.getIsLoadingPendingBoutiqueSTN.and.returnValue(
        of(true)
      );
      stockReceiveFacadeSpy.getIsLoadingHistory.and.returnValue(of(true));
      stockReceiveFacadeSpy.getIsLoadingPendingCFAInvoice.and.returnValue(
        of(false)
      );

      component['componentInit']();

      expect(component.isLoadingPendingFactorySTN).toBeFalsy();
      expect(component.isLoadingPendingBoutiqueSTN).toBeTruthy();
      expect(component.isLoadingPendingCFAInvoice).toBeFalsy();
      expect(component.isLoadingStockReceiveHistory).toBeTruthy();
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
  });

  describe('loader', () => {
    beforeEach(() => {
      spyOn(component, 'navigateToTabs');
      spyOn<any>(component, 'errorHandler');
      spyOn<any>(component, 'getStocks');
    });

    it('should show loader if any of the operation is in progress', () => {
      stockReceiveFacadeSpy.getIsSearchingInvoices.and.returnValue(of(false));
      stockReceiveFacadeSpy.getIsSearchingStocks.and.returnValue(of(false));
      inventoryHomeFacadeSpy.getIsLoadingCount.and.returnValue(of(false));

      stockReceiveFacadeSpy.getIsLoadingPendingFactorySTN.and.returnValue(
        of(false)
      );
      stockReceiveFacadeSpy.getIsLoadingPendingBoutiqueSTN.and.returnValue(
        of(false)
      );
      stockReceiveFacadeSpy.getIsLoadingHistory.and.returnValue(of(true));
      stockReceiveFacadeSpy.getIsLoadingPendingCFAInvoice.and.returnValue(
        of(false)
      );

      fixture.detectChanges();

      expect(page.loader).not.toBeNull();
    });

    it('should no show loader if any of the operation is in progress', () => {
      stockReceiveFacadeSpy.getIsSearchingInvoices.and.returnValue(of(false));
      stockReceiveFacadeSpy.getIsSearchingStocks.and.returnValue(of(false));
      inventoryHomeFacadeSpy.getIsLoadingCount.and.returnValue(of(false));

      stockReceiveFacadeSpy.getIsLoadingPendingFactorySTN.and.returnValue(
        of(false)
      );
      stockReceiveFacadeSpy.getIsLoadingPendingBoutiqueSTN.and.returnValue(
        of(false)
      );
      stockReceiveFacadeSpy.getIsLoadingHistory.and.returnValue(of(false));
      stockReceiveFacadeSpy.getIsLoadingPendingCFAInvoice.and.returnValue(
        of(false)
      );

      fixture.detectChanges();

      expect(page.loader).toBeNull();
    });
  });
  describe('shortcutEventHandler', () => {
    beforeEach(() => {
      spyOn<any>(component, 'errorHandler');
      spyOn(component, 'navigateToTabs');
      spyOn<any>(component, 'getStocks');
      spyOn<any>(component, 'loadHistory');
    });

    it('should navigate back', () => {
      const command = new Command();
      command.name = 'StockReceiveListComponent.BACK';
      spyOn(component, 'back');
      component['shortcutEventHandler'](command);

      expect(component.back).toHaveBeenCalled();
    });

    it('should focus card-list', () => {
      const command = new Command();
      command.name = 'StockReceiveListComponent.CARD_LIST';
      spyOn<any>(component['cardListComponentRef'], 'focus');
      component['shortcutEventHandler'](command);

      expect(component['cardListComponentRef'].focus).toHaveBeenCalled();
    });

    it('should focus on search', () => {
      fixture.detectChanges();

      const command = new Command();
      command.name = 'StockReceiveListComponent.MAIN_SEARCH';
      spyOn<any>(component['searchBox'].nativeElement, 'focus');

      component['shortcutEventHandler'](command);

      expect(component['searchBox'].nativeElement.focus).toHaveBeenCalled();
    });

    it('should open   History Filter', () => {
      component.stockReceiveType = StockReceiveTypesEnum.HISTORY;

      const command = new Command();
      command.name = 'StockReceiveListComponent.FILTER';
      spyOn<any>(component, 'openHistoryFilter');

      component['shortcutEventHandler'](command);

      expect(component['openHistoryFilter']).toHaveBeenCalled();
    });

    it('should open shortcut popup', () => {
      const command = new Command();
      command.name = 'Global.SHORTCUT_HELP';
      spyOn<any>(component, 'openShortcut');

      component['shortcutEventHandler'](command);

      expect(component['openShortcut']).toHaveBeenCalled();
    });

    it('should switch to stock-receive factory  tab', () => {
      component.tabRef = {
        nativeElement: { children: [{ id: 'receiveFromFactoryTab' }] }
      };
      const command = new Command();
      command.name = 'Common.TAB_1';
      spyOn<any>(component, 'changeStockReceiveType');

      component['shortcutEventHandler'](command);

      expect(component['changeStockReceiveType']).toHaveBeenCalledWith(
        StockReceiveTypesEnum.FAC_BTQ
      );
    });

    it('should switch to stock-receive boutique tab', () => {
      component.tabRef = {
        nativeElement: { children: [{ id: 'receiveFromBoutiqueTab' }] }
      };
      const command = new Command();
      command.name = 'Common.TAB_1';
      spyOn<any>(component, 'changeStockReceiveType');

      component['shortcutEventHandler'](command);

      expect(component['changeStockReceiveType']).toHaveBeenCalledWith(
        StockReceiveTypesEnum.BTQ_BTQ
      );
    });

    it('should switch to stock-receive Merchandise tab', () => {
      component.tabRef = {
        nativeElement: { children: [{ id: 'receiveFromMerchandiseTab' }] }
      };
      const command = new Command();
      command.name = 'Common.TAB_1';
      spyOn<any>(component, 'changeStockReceiveType');

      component['shortcutEventHandler'](command);

      expect(component['changeStockReceiveType']).toHaveBeenCalledWith(
        StockReceiveTypesEnum.MER_BTQ
      );
    });

    it('should switch to stock-receive Cfa tab', () => {
      component.tabRef = {
        nativeElement: { children: [{ id: 'receiveFromCfaTab' }] }
      };
      const command = new Command();
      command.name = 'Common.TAB_1';
      spyOn<any>(component, 'changeStockReceiveType');

      component['shortcutEventHandler'](command);

      expect(component['changeStockReceiveType']).toHaveBeenCalledWith(
        StockReceiveTypesEnum.CFA_BTQ
      );
    });

    it('should switch to stock-receive History tab', () => {
      component.tabRef = {
        nativeElement: { children: [{ id: 'receiveFromHistoryTab' }] }
      };
      const command = new Command();
      command.name = 'Common.TAB_1';
      spyOn<any>(component, 'changeStockReceiveType');

      component['shortcutEventHandler'](command);

      expect(component['changeStockReceiveType']).toHaveBeenCalledWith(
        StockReceiveTypesEnum.HISTORY
      );
    });
  });
  describe('loadStocks', () => {
    beforeEach(() => {
      spyOn<any>(component, 'shortcutEventHandler');
    });
    it('From Factory : should send action to load STN with correct parameters ', () => {
      const pageIndex = 20;
      component.pageSize = 10;
      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;
      component.isLoadingPendingFactorySTN = false;
      component.isPendingFactorySTNLoadedOnce = true;

      const expected = {
        pageIndex: pageIndex,
        pageSize: component.pageSize
      };
      component['loadStocks'](pageIndex);

      expect(stockReceiveFacadeSpy.loadPendingFactorySTN).toHaveBeenCalledWith(
        expected
      );
    });

    it('From Factory : should load cards of initial pageSize for the first time  ', () => {
      const pageIndex = 20;

      component.initalPageSize = 8;
      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;
      component.isLoadingPendingFactorySTN = false;
      component.isPendingFactorySTNLoadedOnce = false;

      const expected = {
        pageIndex: pageIndex,
        pageSize: component.initalPageSize
      };
      component['loadStocks'](pageIndex);

      expect(stockReceiveFacadeSpy.loadPendingFactorySTN).toHaveBeenCalledWith(
        expected
      );
    });

    it('From Other boutiques : should send action to load STN with correct parameters ', () => {
      const pageIndex = 20;
      component.pageSize = 10;
      component.stockReceiveType = StockReceiveTypesEnum.BTQ_BTQ;
      component.isLoadingPendingBoutiqueSTN = false;
      component.isPendingBoutiqueSTNLoadedOnce = true;

      const expected = {
        pageIndex: pageIndex,
        pageSize: component.pageSize
      };
      component['loadStocks'](pageIndex);

      expect(stockReceiveFacadeSpy.loadPendingBoutiqueSTN).toHaveBeenCalledWith(
        expected
      );
    });

    it('From Other boutiques : should load cards of initial pageSize for the first time  ', () => {
      const pageIndex = 20;
      component.initalPageSize = 8;
      component.stockReceiveType = StockReceiveTypesEnum.BTQ_BTQ;
      component.isLoadingPendingBoutiqueSTN = false;
      component.isPendingBoutiqueSTNLoadedOnce = false;

      const expected = {
        pageIndex: pageIndex,
        pageSize: component.initalPageSize
      };
      component['loadStocks'](pageIndex);

      expect(stockReceiveFacadeSpy.loadPendingBoutiqueSTN).toHaveBeenCalledWith(
        expected
      );
    });

    it('From Merchandise : should send action to load STN with correct parameters ', () => {
      const pageIndex = 20;
      component.pageSize = 10;
      component.stockReceiveType = StockReceiveTypesEnum.MER_BTQ;
      component.isLoadingPendingMerchandiseSTN = false;
      component.isPendingMerchandiseLoadedOnce = true;

      const expected = {
        pageIndex: pageIndex,
        pageSize: component.pageSize
      };
      component['loadStocks'](pageIndex);

      expect(
        stockReceiveFacadeSpy.loadPendingMerchandiseSTN
      ).toHaveBeenCalledWith(expected);
    });

    it('From Merchandise : should load cards of initial pageSize for the first time  ', () => {
      const pageIndex = 20;
      component.initalPageSize = 8;
      component.stockReceiveType = StockReceiveTypesEnum.MER_BTQ;
      component.isLoadingPendingMerchandiseSTN = false;
      component.isPendingMerchandiseLoadedOnce = false;

      const expected = {
        pageIndex: pageIndex,
        pageSize: component.initalPageSize
      };
      component['loadStocks'](pageIndex);

      expect(
        stockReceiveFacadeSpy.loadPendingMerchandiseSTN
      ).toHaveBeenCalledWith(expected);
    });

    it('From CFA : should send action to load STN with correct parameters ', () => {
      const pageIndex = 20;
      component.pageSize = 10;
      component.stockReceiveType = StockReceiveTypesEnum.CFA_BTQ;
      component.isLoadingPendingCFAInvoice = false;
      component.isPendingCFAInvoiceLoadedOnce = true;

      const expected = {
        pageIndex: pageIndex,
        pageSize: component.pageSize
      };
      component['loadStocks'](pageIndex);

      expect(stockReceiveFacadeSpy.loadPendingCFAInvoice).toHaveBeenCalledWith(
        expected
      );
    });

    it('From CFA : should load cards of initial pageSize for the first time  ', () => {
      const pageIndex = 20;
      component.initalPageSize = 8;
      component.stockReceiveType = StockReceiveTypesEnum.CFA_BTQ;
      component.isLoadingPendingCFAInvoice = false;
      component.isPendingCFAInvoiceLoadedOnce = false;

      const expected = {
        pageIndex: pageIndex,
        pageSize: component.initalPageSize
      };
      component['loadStocks'](pageIndex);

      expect(stockReceiveFacadeSpy.loadPendingCFAInvoice).toHaveBeenCalledWith(
        expected
      );
    });

    it('History L1/L2 : should send action to load STN with correct parameters ', () => {
      spyOn<any>(component, 'createHistoryPayLoad');
      const pageIndex = 20;
      component.isL1L2Store = true;
      component.stockReceiveType = StockReceiveTypesEnum.HISTORY;
      component.isLoadingStockReceiveHistory = false;

      component['loadStocks'](pageIndex);

      expect(component['createHistoryPayLoad']).toHaveBeenCalledWith(pageIndex);
      expect(stockReceiveFacadeSpy.loadStockReceiveHistory).toHaveBeenCalled();
    });

    it('History L3 : should send action to load STN with correct parameters ', () => {
      spyOn<any>(component, 'createHistoryPayLoad');
      const pageIndex = 20;
      component.isL3Store = true;
      component.stockReceiveType = StockReceiveTypesEnum.HISTORY;
      component.isLoadingStockReceiveHistory = false;

      component['loadStocks'](pageIndex);

      expect(component['createHistoryPayLoad']).toHaveBeenCalledWith(pageIndex);
      expect(
        stockReceiveFacadeSpy.loadStockReceiveInvoiceHistory
      ).toHaveBeenCalled();
    });
  });

  describe('onSelected', () => {
    it('should navigate to the STN details page on clicking the STN card', () => {
      const stock = { id: 1234 };
      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;

      component.onSelected(stock);

      expect(component['router'].navigate).toHaveBeenCalledWith([
        getStockReceiveRouteUrl(component.stockReceiveType),
        stock.id,
        StockReceiveTabEnum.NON_VERIFIED
      ]);
    });

    it('L1/L2 : should navigate to the STN history details page on clicking the history STN card', () => {
      const stock = { id: 1234 };
      component.stockReceiveType = StockReceiveTypesEnum.HISTORY;
      component.historyType = StockReceiveTypesEnum.BTQ_BTQ;
      component.isL1L2Store = true;

      component.onSelected(stock);

      expect(component['router'].navigate).toHaveBeenCalledWith([
        getStockReceiveRouteUrl(component.stockReceiveType),
        component.historyType,
        stock.id
      ]);
    });

    it('L3 : should navigate to the STN history details page on clicking the history STN card', () => {
      const stock = { id: 1234 };
      component.stockReceiveType = StockReceiveTypesEnum.HISTORY;
      component.historyType = StockReceiveTypesEnum.CFA_BTQ;
      component.isL3Store = true;

      component.onSelected(stock);

      expect(component['router'].navigate).toHaveBeenCalledWith([
        getStockReceiveRouteUrl(component.stockReceiveType),
        component.historyType,
        stock.id
      ]);
    });
  });

  describe('createHistoryPayLoad', () => {
    it('should return StockReceiveHistoryPayload', () => {
      const pageIndex = 10;
      const startDate = component.currentDate.startOf('day').valueOf();
      const endDate = component.currentDate.endOf('day').valueOf();

      component.isStockReceiveHistoryLoaddedOnce = true;
      component.isL1L2Store = true;

      const payload = component['createHistoryPayLoad'](pageIndex);

      expect(payload.pageIndex).toEqual(pageIndex);
      expect(payload.pageSize).toEqual(component.pageSize);
      expect(payload.data.dateRangeType).toEqual('CUSTOM');
      expect(payload.data.actionType).toEqual('RECEIVE');
      expect(payload.data.startDate).toEqual(startDate);
      expect(payload.data.endDate).toEqual(endDate);
    });

    it('should map  advanceFilter data', () => {
      const pageIndex = 10;
      component.isStockReceiveHistoryLoaddedOnce = false;
      component.isL1L2Store = true;
      const advanceFilter = {
        destDocNo: 1234,
        sourceLocationCode: 'URB',
        fiscalYear: 2019,
        stnNumber: 1234
      };

      component.advanceFilter = advanceFilter;

      const payload = component['createHistoryPayLoad'](pageIndex);

      expect(payload.data.srcDocNo).toEqual(advanceFilter.stnNumber);
      expect(payload.data.srcFiscalYear).toEqual(null);
      expect(payload.data.locationCode).toEqual(
        advanceFilter.sourceLocationCode
      );
    });

    it('should specify transfer type for L1/L2', () => {
      const pageIndex = 10;
      const historyAPIType = StockReceiveAPITypesEnum.FAC_BTQ;
      component.isStockReceiveHistoryLoaddedOnce = false;
      component.isL1L2Store = true;
      component.historyAPIType = historyAPIType;

      const payload = component['createHistoryPayLoad'](pageIndex);

      expect(payload.transferType).toEqual(historyAPIType);
    });

    it('should specify transfer type  as CFA for L3', () => {
      const pageIndex = 10;
      const historyAPIType = StockReceiveAPITypesEnum.CFA_BTQ;
      component.isStockReceiveHistoryLoaddedOnce = false;
      component.isL3Store = true;
      component.historyAPIType = historyAPIType;

      const payload = component['createHistoryPayLoad'](pageIndex);

      expect(payload.transferType).toEqual(historyAPIType);
    });
  });

  describe('getStocks', () => {
    it('L1/L2 : should load STN counts', () => {
      component.isL1L2Store = true;
      spyOn(component, 'loadCount');

      component['getStocks']();

      expect(component.loadCount).toHaveBeenCalledWith(true);
    });

    it('should set isloaded flag to true after loading STN from factory for first time', () => {
      component.isL1L2Store = true;
      stockReceiveFacadeSpy.getPendingFactorySTN.and.returnValue(
        of([{ stnId: 'Test123' }])
      );

      component['getStocks']();

      expect(component.isPendingFactorySTNLoadedOnce).toBeTruthy();
    });

    it('should set isloaded flag to true after loading STN from other botiques for first time', () => {
      component.isL1L2Store = true;
      stockReceiveFacadeSpy.getPendingBoutiqueSTN.and.returnValue(
        of([{ stnId: 'Test123' }])
      );

      component['getStocks']();

      expect(component.isPendingBoutiqueSTNLoadedOnce).toBeTruthy();
    });

    it('L3 : should load Invoice counts ', () => {
      component.isL3Store = true;
      spyOn(component, 'loadCount');

      component['getStocks']();

      expect(component.loadCount).toHaveBeenCalledWith(false);
    });

    it('should set isloaded flag to true after loading Invoices from CFA for first time', () => {
      component.isL3Store = true;
      stockReceiveFacadeSpy.getPendingCFAInvoice.and.returnValue(
        of([{ stnId: 'Test123' }])
      );

      component['getStocks']();

      expect(component.isPendingCFAInvoiceLoadedOnce).toBeTruthy();
    });

    it('should set isloaded flag to true after loading Hoistory for first time', () => {
      component.isL1L2Store = true;
      stockReceiveFacadeSpy.getStockReceiveHistory.and.returnValue(
        of([{ stnId: 'Test123' }])
      );

      component['getStocks']();

      expect(component.isStockReceiveHistoryLoaddedOnce).toBeTruthy();
    });
  });

  describe('changeStockReceiveType', () => {
    beforeEach(() => {
      spyOn<any>(component, 'loadHistory');
      spyOn(component, 'loadStocks');
    });

    it('should change the routes to factory history tab', () => {
      component.isL1L2Store = true;

      component['changeStockReceiveType'](StockReceiveTypesEnum.HISTORY);

      expect(component['router'].navigate).toHaveBeenCalledWith([
        getStockReceiveHistoryRouteUrl()
      ]);
    });

    it('should load stocks if the tab is other than history', () => {
      component.isL1L2Store = true;

      component['changeStockReceiveType'](StockReceiveTypesEnum.BTQ_BTQ);

      expect(component.loadStocks).toHaveBeenCalled();
    });

    it('should not call load stocks if the new tab is same as the current tab', () => {
      component.isL1L2Store = true;

      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;

      component['changeStockReceiveType'](StockReceiveTypesEnum.FAC_BTQ);

      expect(component.loadStocks).not.toHaveBeenCalled();
    });

    it('should not call load stocks if STNs are loaded once from merchandise', () => {
      component.isL1L2Store = true;

      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;
      component.isPendingMerchandiseLoadedOnce = true;

      component['changeStockReceiveType'](StockReceiveTypesEnum.MER_BTQ);

      expect(component.loadStocks).not.toHaveBeenCalled();
    });

    it('should not call load stocks if STNs are loaded once from factory', () => {
      component.stockReceiveType = StockReceiveTypesEnum.MER_BTQ;
      component.isPendingFactorySTNLoadedOnce = true;

      component['changeStockReceiveType'](StockReceiveTypesEnum.FAC_BTQ);

      expect(component.loadStocks).not.toHaveBeenCalled();
    });

    it('should not call load stocks if Invocie are loaded once from CFA', () => {
      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;
      component.isPendingCFAInvoiceLoadedOnce = true;

      component['changeStockReceiveType'](StockReceiveTypesEnum.CFA_BTQ);

      expect(component.loadStocks).not.toHaveBeenCalled();
    });
  });

  describe('navigateToTabs', () => {
    beforeEach(() => {
      spyOn(component, 'changeStockReceiveType');
    });
    it('L1/L2 : should call changeStockReceiveType on vaild type', () => {
      component.isL1L2Store = true;
      component.navigateToTabs();
      expect(component.changeStockReceiveType).toHaveBeenCalled();
    });

    it('L3 : should call changeStockReceiveType on vaild type', () => {
      component.isL3Store = true;
      component['activatedRoute'].snapshot.params['type'] = 'cfa';

      component.navigateToTabs();
      expect(component.changeStockReceiveType).toHaveBeenCalled();
    });
  });

  describe('Card List', () => {
    beforeEach(() => {
      spyOn(component, 'changeStockReceiveType');
      spyOn(component, 'loadStocks');
      spyOn(component, 'onSelected');
    });
    it('Should render card list', () => {
      component.isL1L2Store = true;
      fixture.detectChanges();
      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;
      fixture.detectChanges();

      expect(page.cardList).not.toBeNull();
    });

    it('Should call load stocks on load event', () => {
      component.isL1L2Store = true;
      fixture.detectChanges();
      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;
      fixture.detectChanges();

      page.cardList.triggerEventHandler('loadMore', null);

      expect(component.loadStocks).toHaveBeenCalled();
    });

    it('Should call onSelected on STN selection', () => {
      component.isL1L2Store = true;
      fixture.detectChanges();
      component.stockReceiveType = StockReceiveTypesEnum.FAC_BTQ;
      fixture.detectChanges();
      page.cardList.triggerEventHandler('selected', null);

      expect(component.onSelected).toHaveBeenCalled();
    });
  });

  describe('Open ShortCut', () => {
    it('Should open shortcut popup', () => {
      spyOn(component['shortcutService'], 'open');

      component.openShortcut();

      expect(component['shortcutService'].open).toHaveBeenCalled();
    });
  });

  describe('Search Key Check', () => {
    it('Should return true for numbers (Other than CFA)', () => {
      const data = new KeyboardEvent('keydown', { key: '1' });

      expect(component.searchKeyCheck(data)).toBeTruthy();
    });

    it('Should return false for other than number (Other than CFA)', () => {
      const data = new KeyboardEvent('keydown', { key: '#' });

      expect(component.searchKeyCheck(data)).toBeFalsy();
    });

    it('Should return true for numbers (CFA)', () => {
      component.stockReceiveType = StockReceiveTypesEnum.CFA_BTQ;
      const data = new KeyboardEvent('keydown', { key: '1' });

      expect(component.searchKeyCheck(data)).toBeTruthy();
    });

    it('Should return true for alphabets (CFA)', () => {
      component.stockReceiveType = StockReceiveTypesEnum.CFA_BTQ;

      const data = new KeyboardEvent('keydown', { key: 'A' });

      expect(component.searchKeyCheck(data)).toBeTruthy();
    });

    it('Should return false for other than alphabets and number (CFA)', () => {
      component.stockReceiveType = StockReceiveTypesEnum.CFA_BTQ;

      const data = new KeyboardEvent('keydown', { key: '#' });

      expect(component.searchKeyCheck(data)).toBeFalsy();
    });
  });

  describe('Select History Type', () => {
    it('Should set from Factory history type', () => {
      const newType = StockReceiveTypesEnum.FAC_BTQ;
      component.historyAPIType = StockReceiveAPITypesEnum.BTQ_BTQ;
      component.historyType = StockReceiveTypesEnum.BTQ_BTQ;

      component.selectHistoryType(newType);

      expect(component.historyType).toEqual(newType);
      expect(component.historyAPIType).toEqual(
        StockReceiveAPITypesEnum.FAC_BTQ
      );
    });

    it('Should set from Botique history type', () => {
      const newType = StockReceiveTypesEnum.BTQ_BTQ;
      component.historyAPIType = StockReceiveAPITypesEnum.FAC_BTQ;
      component.historyType = StockReceiveTypesEnum.FAC_BTQ;

      component.selectHistoryType(newType);

      expect(component.historyType).toEqual(newType);
      expect(component.historyAPIType).toEqual(
        StockReceiveAPITypesEnum.BTQ_BTQ
      );
    });

    it('Should set from Merchandise history type', () => {
      const newType = StockReceiveTypesEnum.MER_BTQ;
      component.historyAPIType = StockReceiveAPITypesEnum.BTQ_BTQ;
      component.historyType = StockReceiveTypesEnum.BTQ_BTQ;

      component.selectHistoryType(newType);

      expect(component.historyType).toEqual(newType);
      expect(component.historyAPIType).toEqual(
        StockReceiveAPITypesEnum.MER_BTQ
      );
    });
  });

  describe('Validate Search', () => {
    it('Should return true for numbers (Other than CFA)', () => {
      const data = '11234';

      expect(component.validateSearch(data)).toBeTruthy();
    });

    it('Should return false for other than number (Other than CFA)', () => {
      const data = '1A12';

      expect(component.validateSearch(data)).toBeFalsy();
    });

    it('Should return true for numbers (CFA)', () => {
      component.stockReceiveType = StockReceiveTypesEnum.CFA_BTQ;
      const data = '1234';

      expect(component.validateSearch(data)).toBeTruthy();
    });

    it('Should return true for alphabets (CFA)', () => {
      component.stockReceiveType = StockReceiveTypesEnum.CFA_BTQ;

      const data = '1A12';

      expect(component.validateSearch(data)).toBeTruthy();
    });

    it('Should return false for other than alphabets and number (CFA)', () => {
      component.stockReceiveType = StockReceiveTypesEnum.CFA_BTQ;

      const data = '1A12@$';

      expect(component.validateSearch(data)).toBeFalsy();
    });
  });

  describe('Fetch fom Oracle', () => {
    it('Should call fetchSTNFromOracle', () => {
      const searchedSrcDocNumber = 1243;

      component.searchedSrcDocNumber = searchedSrcDocNumber;
      component.fetchSTNFromOracle();

      expect(stockReceiveFacadeSpy.fetchSTNFromOracle).toHaveBeenCalledWith(
        searchedSrcDocNumber,
        StockReceiveAPITypesEnum.FAC_BTQ
      );
    });

    it('Should call fetchSTNFromOracle', () => {
      const searchedSrcDocNumber = 1243;

      component.searchedSrcDocNumber = searchedSrcDocNumber;
      component.fetchInvoiceFromOracle();

      expect(stockReceiveFacadeSpy.fetchInvoiceFromOracle).toHaveBeenCalledWith(
        searchedSrcDocNumber,
        StockReceiveAPITypesEnum.CFA_BTQ
      );
    });
  });

  describe('History search', () => {
    it('Should call loadHistory ', () => {
      component.searchFormControl.setValue('1234');
      spyOn(component, 'loadHistory');

      component['historySearch']();

      expect(component.loadHistory).toHaveBeenCalled();
    });

    it('Should call resetStockReceiveHistory ', () => {
      component.searchFormControl.setValue('1234@#');

      component['historySearch']();

      expect(stockReceiveFacadeSpy.resetStockReceiveHistory).toHaveBeenCalled();
    });

    it('Should call resetStockReceiveHistory ', () => {
      spyOn(component, 'clearSearch');

      component.searchFormControl.setValue('');

      component['historySearch']();

      expect(component.clearSearch).toHaveBeenCalled();
    });
  });
});
