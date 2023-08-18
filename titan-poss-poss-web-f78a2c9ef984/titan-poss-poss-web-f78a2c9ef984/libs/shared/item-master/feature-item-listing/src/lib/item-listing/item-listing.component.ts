import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import {
  ListingPageData,
  MasterMenuKeyEnum,
  LocationSettingAttributesEnum,
  AppTypesEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventType
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { takeUntil, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ItemFacade } from '@poss-web/shared/item-master/data-access-item-master';
import {
  getItemDetailsRouteUrl,
  getBoutiqueItemDetailsRouteUrl,
  getMasterHomeRouteUrl
} from '@poss-web/shared/util-site-routes';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { POSS_APP_TYPE } from '@poss-web/shared/util-config';
import {
  SelectionDailogOption
} from '@poss-web/shared/components/ui-selection-dialog';
@Component({
  selector: 'poss-web-item-listing',
  templateUrl: './item-listing.component.html'
})
export class ItemListingComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<null>();
  itemPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };

  pageSizeOptions: number[] = [];
  minPageSize: number;

  itemError$: Observable<CustomErrors>;
  itemListing$: Observable<ListingPageData[]>;
  isLoading$: Observable<boolean>;
  itemCount$: Observable<number>;
  itemByItemCode$: Observable<any>;
  searchErrorCode: string;

  filterItemData;
  filterLoaded: boolean;
  filterForm: FormGroup;
  isEmpty = false;
  cfaProductCode: string;
  // pricingTypes: Lov[];
  pricingTypes;
  proguctGroupSelection: SelectionDailogOption[] = [];
  selectedproguctGroup: SelectionDailogOption;

  currencyCode: string;
  dropDown: any;
  noDataFoundMessage: any;

  constructor(
    private appsettingFacade: AppsettingFacade,
    private itemFacade: ItemFacade,
    public router: Router,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public locationSettingsFacade: LocationSettingsFacade,

    @Inject(POSS_APP_TYPE) private appType
  ) {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.clearFilter === false
    ) {
      console.log('dont clear');
    } else {
      this.filterLoaded = false;
      this.itemFacade.loadResetFilter();
    }

    this.translate
      .get(['pw.global.noDataFoundMessage'], {
        entityName: 'Items'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.noDataFoundMessage =
          translatedMessages['pw.global.noDataFoundMessage'];
      });
  }

  ngOnInit() {
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.cfaProductCode = null;

    // To maintain the search filters

    this.itemFacade
      .getItemFilter()
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterData => {
        if (filterData) {
          this.filterItemData = filterData;
          this.filterLoaded = true;
        } else {
          this.filterItemData = null;
          this.filterLoaded = false;
        }
      });
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.itemPageEvent.pageSize = pageSize;
        if (this.filterLoaded) this.loadItemFilterDetails();
      });
    this.itemFacade.loadCFAproductCodes();
    this.itemFacade.loadPricingTypes('PRICINGTYPE');
    this.isLoading$ = this.itemFacade.getisLoading();
    this.itemListing$ = this.itemFacade.getitemDetailsListing();
    this.itemCount$ = this.itemFacade.getTotalitemDetails();
    this.itemError$ = this.itemFacade.getError();
    this.itemFacade
      .getCFAproductCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.proguctGroupSelection = data.map(productGroup => ({
            id: productGroup.productGroupCode,
            description:
              productGroup.productGroupCode + ' - ' + productGroup.description
          }));
        }
      });
    this.itemFacade
      .getPricingTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pricingTypes = [];
        if (data) {
          var resdata= data.slice(0,2)
          resdata.forEach(type => {
            this.pricingTypes.push({
              value: type.code,
              description: type.code
            });
          });
        }
      });
    this.searchErrorCode = ErrorEnums.ERR_PRO_002;
    this.itemFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.itemFacade.resetItemDetailsByitemCode();
          });
      });
  }

  applyFilter(filterPayload) {
    this.filterLoaded = true;
    this.itemPageEvent = this.initialPageEvent;
    this.itemFacade.StoreItemFilter(filterPayload);
    this.filterItemData = filterPayload;
    this.loadItemFilterDetails();
  }
  clear(event) {
    if (event) {
      this.filterLoaded = false;
      this.itemFacade.loadResetFilter();
      this.itemFacade.loadPricingTypes('PRICINGTYPE');
    }
  }

  loadItemFilterDetails() {
    this.itemFacade.loadItemFilter({
      filterPayload: this.filterItemData ? this.filterItemData : null,
      paginate: this.itemPageEvent
    });
  }
  paginate(pageEvent: PageEvent) {
    this.itemPageEvent = pageEvent;
    if (this.filterLoaded) this.loadItemFilterDetails();
  }
  backArrow() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu:
          this.appType === AppTypesEnum.POSS
            ? MasterMenuKeyEnum.BOUTIQUE_MENU_KEY
            : MasterMenuKeyEnum.PRODUCT_MASTERS_MENU_KEY
      }
    });
  }

  getItemCode(itemCode: string) {
    if (this.appType === 'EPOSS')
      this.router.navigate([getItemDetailsRouteUrl(itemCode)]);
    else if (this.appType === 'POSS') {
      this.router.navigate([getBoutiqueItemDetailsRouteUrl(itemCode)]);
    }
  }

  // addnew() {
  //   this.router.navigate([getItemDetailsRouteUrl('new')]);
  // }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    }
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
