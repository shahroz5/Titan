import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';

import { BrandMasterFacade } from '@poss-web/shared/brand/data-access-brand';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  OverlayNotificationType,
  MasterMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  BrandMasterDetails,
  CustomErrors,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import {
  getMasterHomeRouteUrl,
  getBrandDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

import { takeUntil, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'poss-web-brand-listing',
  templateUrl: './brand-listing.component.html'
})
export class BrandListingComponent implements OnInit, OnDestroy {
  brandList$: Observable<BrandMasterDetails[]>;
  isLoading$: Observable<boolean>;
  isActiveToggle$: Observable<boolean>;
  destroy$ = new Subject<null>();
  searchErrorCode: string;
  invalidSearch: boolean;

  pageSize: number[];
  totalElements$: Observable<number>;
  hasError$: Observable<CustomErrors>;
  resetSearch = false;

  brandMasterListingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  toggleStatus: boolean;

  constructor(
    private route: ActivatedRoute,
    private brandMasterFacade: BrandMasterFacade,
    private router: Router,
    private appsettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.brandCode'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.brandCode']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageNonVerifiedItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  noDataFoundMessageNonVerifiedItems: string;

  search(searchValue: string) {
    if (fieldValidation.brandCodeField.pattern.test(searchValue)) {
      this.brandMasterFacade.searchBrand(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    // this.searchForm.reset();
    this.loadBrandMasterList();
  }

  updateIsActive(event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = event.isActive;
          this.brandMasterFacade.updateBrandMasterDetails({
            brandCode: event.brandCode,
            isActive: event.isActive
          });
        } else this.loadBrandMasterList();
      });
  }
  loadDetailsPage(brandCode: string) {
    if (brandCode) {
      this.router.navigate([getBrandDetailsRouteUrl(brandCode)]);
    }
  }
  loadViewDetailsPage(brandCode: string) {
    if (brandCode) {
      this.router.navigate([getBrandDetailsRouteUrl(brandCode)], {
        queryParams: {
          showViewOnly: 'true'
        },
        queryParamsHandling: 'merge'
      });
    }
  }
  ngOnInit() {
    this.hasError$ = this.brandMasterFacade.getError();
    //this.searchErrorCode = ErrorEnums.ERR_CORE_023;
    this.searchErrorCode = ErrorEnums.ERR_PRO_001;
    this.isLoading$ = this.brandMasterFacade.getIsloading();

    this.brandList$ = this.brandMasterFacade.getBrandMasterList();
    this.totalElements$ = this.brandMasterFacade.getTotalElements();

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.brandMasterListingPageEvent.pageSize = data;
        this.loadBrandMasterList();
      });

    this.brandMasterFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.brandMasterFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          if (this.toggleStatus) {
            this.showNotification('pw.global.listActivated');
          } else {
            this.showNotification('pw.global.listDeactivated');
          }

          this.clearSearch();
        }
      });
  }

  loadBrandMasterList() {
    this.brandMasterFacade.loadBrandMasterList(
      this.brandMasterListingPageEvent
    );
  }
  paginate(pageEvent: PageEvent) {
    this.brandMasterListingPageEvent = pageEvent;
    this.loadBrandMasterList();
  }
  addnew() {
    this.router.navigate([getBrandDetailsRouteUrl('NEW')]);
  }

  back() {
    // this.router.navigate([getProductMasterDashboardRouteUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_MASTERS_MENU_KEY
      }
    });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      // We are not showing error for location not found from search.
      return;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  showNotification(key: string) {
    // this.translate
    //   .get(key)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((translatedMessage: string) => {
    //     this.overlayNotification
    //       .show({
    //         type: OverlayNotificationType.TIMER,
    //         message: translatedMessage,
    //         time: 2000,
    //         hasBackdrop: true
    //       })
    //       .events.subscribe((eventType: OverlayNotificationEventType) => {
    //         this.overlayNotification.close();
    //       });
    //   });

    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
