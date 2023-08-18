import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  OverlayNotificationType,
  OverlayNotificationEventType,
  MasterMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  CFAProductsResponse
} from '@poss-web/shared/models';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { takeUntil, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { CFAProductCodeFacade } from '@poss-web/shared/cfa-product/data-access-cfa-product';
import {
  getMasterHomeRouteUrl,
  getCFAProductsByCodeRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
export enum ProductGroupEnum {
  NEW = 'new'
}
@Component({
  selector: 'poss-web-cfa-product-code-listing',
  templateUrl: './cfa-product-code-listing.component.html'
})
export class CfaProductCodeListingComponent implements OnInit, OnDestroy {
  CFAProductCodeListing$: Observable<CFAProductsResponse[]>;
  searchErrorCode: string;
  totalElements$: Observable<number>;
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  CFAProductCodePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize: number;
  invalidSearch = false;

  noDataFoundMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  ADD_EDIT_PRODUCT_GROUP_PERMISSIONS =
    'ProductGroup Master - Add/Edit ProductGroup Master';
  permissions$: Observable<any[]>;
  constructor(
    private router: Router,
    private CFAProductFacade: CFAProductCodeFacade,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.translate
      .get(['pw.entity.productGroupEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.productGroupEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.CFAProductFacade.resetCFAProducts();
    this.searchErrorCode = ErrorEnums.ERR_PRO_004;
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.CFAProductCodePageEvent.pageSize = pageSize;
        this.loadCFAProductCodeListing();
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

    this.CFAProductCodeListing$ = this.CFAProductFacade.getCFAProductCodeListing();
    this.totalElements$ = this.CFAProductFacade.getTotalElements();
    this.isLoading$ = this.CFAProductFacade.getIsLoading();
    this.hasError$ = this.CFAProductFacade.getHasError();
    this.CFAProductFacade.getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.CFAProductFacade.getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotifications('pw.CFAProduct.UpdateSuccessMessage');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotifications('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotifications('pw.global.listDeactivated');
          }
          this.loadCFAProductCodeListing();
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
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.CFAProductFacade.resetCFAProducts();
          });
      });
  }

  showSaveNotification(errorMessage: string) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: errorMessage,
        hasBackdrop: true
      })
      .events.subscribe((eventType: OverlayNotificationEventType) => {
        this.CFAProductFacade.resetCFAProducts();
      });
  }

  search(searchValue: string) {
    if (fieldValidation.productGroupCodeField.pattern.test(searchValue)) {
      this.CFAProductFacade.searchCFAProdcut(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.loadCFAProductCodeListing();
  }
  loadCFAProductCodeListing() {
    this.CFAProductFacade.loadCFAProductCodeListing(
      this.CFAProductCodePageEvent
    );
  }
  back() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_MASTERS_MENU_KEY
      }
    });
    this.CFAProductFacade.resetCFAProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  paginate(pageEvent: PageEvent) {
    this.CFAProductCodePageEvent = pageEvent;
    this.loadCFAProductCodeListing();
  }
  emitProductGroupCode(productGroupCode) {
    this.router.navigate([getCFAProductsByCodeRouteUrl()], {
      queryParams: {
        productGroupCode: productGroupCode
      }
    });
  }
  addnew() {
    this.router.navigate([getCFAProductsByCodeRouteUrl()], {
      queryParams: {
        productGroupCode: ProductGroupEnum.NEW
      }
    });
  }
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
  viewDetailsPage(productGroupCode) {
    this.router.navigate([getCFAProductsByCodeRouteUrl()], {
      queryParams: {
        productGroupCode: productGroupCode,
        showViewOnly: 'true'
      },
      queryParamsHandling: 'merge'
    });
  }

  toggleButton($event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = $event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.CFAProductFacade.updateCFAProducts({
            productGroupCode: $event.CFAProductCode,
            data: {
              isActive: $event.isActive
            }
          });
        } else this.loadCFAProductCodeListing();
      });
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
