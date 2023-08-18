import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import {
  ProductCategory,
  CustomErrors,
  ProductCategoryDetails,
  ProductCategoryEnum,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { OverlayNotificationType } from '@poss-web/shared/models';

import { ErrorEnums } from '@poss-web/shared/util-error';
import { ProductCategoryDetailsComponent } from '@poss-web/shared/product-category/ui-product-category-detail';
import { ProductCategoryFacade } from '@poss-web/shared/product-category/data-access-product-category';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { ProductCategoryViewComponent } from '@poss-web/shared/product-category/ui-product-category-view';

@Component({
  selector: 'poss-web-product-category-listing',
  templateUrl: './product-category-listing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryListingComponent implements OnInit, OnDestroy {
  @Output() formEmit = new EventEmitter<any>();
  pageSize: any;
  destroy$ = new Subject<null>();

  productCategoryPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  isLoading$: Observable<boolean>;
  productCategoryListing$: Observable<ProductCategory[]>;
  productCategoryCount$: Observable<number>;

  hasError$: Observable<CustomErrors>;

  searchErrorCode: string;

  productCategoryDetailsByCode$: ProductCategoryDetails;

  invalidSearch = false;
  orgCode: string;
  viewMode: boolean;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  clearSearchVar = false;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private productCategoryFacade: ProductCategoryFacade,
    private profileDataFacade: ProfileDataFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.productCategoryCode'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.productCategoryCode']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageNonVerifiedItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  noDataFoundMessageNonVerifiedItems: string;

  ngOnInit() {
    this.profileDataFacade
      .getOrgCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgCode => {
        this.orgCode = orgCode;
      });

    this.productCategoryFacade.resetproductCategoryDialogData();
    this.hasError$ = this.productCategoryFacade.getError();
    this.searchErrorCode = ErrorEnums.ERR_PRO_005;
    this.productCategoryFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.productCategoryPageEvent.pageSize = pageSize;
        this.loadProductCategoryDetails();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
        //this.locationListingPageEvent.pageSize = this.pageSize;
        // this.loadLocationList();
      });

    this.isLoading$ = this.productCategoryFacade.getisLoading();
    this.productCategoryListing$ = this.productCategoryFacade.getproductCategoryDetailsListing();
    this.productCategoryCount$ = this.productCategoryFacade.getTotalproductCategoryDetails();

    this.productCategoryFacade
      .getproductCategorySaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data1 => {
        if (data1) {
          this.loadAndShowNotification('pw.productCategory.successMsg');
        }
      });

    this.productCategoryFacade
      .getproductCategoryEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        if (data2) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.loadAndShowNotification('pw.productCategory.editSuccessMsg');
            this.clearSearchVar = true;
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.loadAndShowNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.loadAndShowNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        }
      });

    this.productCategoryFacade
      .getproductCategoryDetailsByproductCategoryCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.viewMode) {
            const dialogRef = this.dialog.open(ProductCategoryViewComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });
          } else {
            this.productCategoryDetailsByCode$ = data;
            const dialogRef = this.dialog.open(
              ProductCategoryDetailsComponent,
              {
                width: '500px',
                height: 'auto',
                data: this.productCategoryDetailsByCode$,
                disableClose: true
              }
            );

            dialogRef.afterClosed().subscribe(formData => {
              if (formData) {
                this.alertPopupService
                  .open({
                    type: AlertPopupTypeEnum.CONFIRM,
                    message: 'pw.alertPopup.saveConfirmation'
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((res: boolean) => {
                    if (res) {
                      this.createProductCategoryFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
      });
  }

  loadAndShowNotification(notificationKey: string) {
    this.loadProductCategoryDetails();
    this.showNotification(notificationKey);
  }

  loadProductCategoryDetails() {
    this.productCategoryFacade.loadProductCategoryDetailsListing(
      this.productCategoryPageEvent
    );
  }

  getProductCategoryCodeView(productCategoryCode: string) {
    this.viewMode = true;
    this.productCategoryFacade.loadProductCategoryDetailsByproductCategoryCode(
      productCategoryCode
    );
  }
  getProductCategoryCode(productCategoryCode: string) {
    this.viewMode = false;
    if (productCategoryCode !== ProductCategoryEnum.NEW) {
      this.productCategoryFacade.loadProductCategoryDetailsByproductCategoryCode(
        productCategoryCode
      );
    } else {
      const newFormData: ProductCategoryDetails = {
        productCategoryCode: ProductCategoryEnum.NEW,
        description: '',
        isActive: false,
        orgCode: this.orgCode,
        isConversionEnabled: false,
        hallmarkQuantity: 0,
        hallmarkDetails: {
          type: 'HALLMARK_DETAILS',
          data: {
            hallmarkingCharges: '0',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          }
        }
      };
      const dialogRef = this.dialog.open(ProductCategoryDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: newFormData,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                this.createProductCategoryFormDetails(data);
              }
            });
        }
      });
    }
  }

  createProductCategoryFormDetails(data: any) {
    // this.searchForm.reset();
    this.clearSearchVar = true;
    if (data.mode === ProductCategoryEnum.new) {
      this.productCategoryFacade.saveproductCategoryFormDetails({
        productCategoryCode: data.productCode,
        description: data.description,
        orgCode: this.orgCode, // data.orgCode,
        isActive: data.isActive,
        isConversionEnabled: data.isConversionEnabled,
        hallmarkQuantity: data.hallmarkQuantity,
        hallmarkDetails: {
          data: {
            hallmarkingCharges: data.hallmarkDetails.data.hallmarkingCharges,
            isAllowedForHallmarking:
              data.hallmarkDetails.data.isAllowedForHallmarking,
            isFOCForHallmarkingCharges:
              data.hallmarkDetails.data.isFOCForHallmarkingCharges
          },
          type: data.hallmarkDetails.type
        }
      });
    } else if (data.mode === ProductCategoryEnum.edit) {
      this.productCategoryFacade.editproductCategoryFormDetails({
        productCategoryCode: data.productCode,
        description: data.description,
        orgCode: this.orgCode, // data.orgCode,
        isActive: data.isActive,
        isConversionEnabled: data.isConversionEnabled,
        hallmarkQuantity: data.hallmarkQuantity,
        hallmarkDetails: {
          data: {
            hallmarkingCharges: data.hallmarkDetails.data.hallmarkingCharges,
            isAllowedForHallmarking:
              data.hallmarkDetails.data.isAllowedForHallmarking,
            isFOCForHallmarkingCharges:
              data.hallmarkDetails.data.isFOCForHallmarkingCharges
          },
          type: data.hallmarkDetails.type
        }
      });
    }
  }

  search(searchValue: string) {
    if (fieldValidation.alphaNumericField.pattern.test(searchValue)) {
      this.productCategoryFacade.searchProductCategor(
        searchValue.toUpperCase()
      );
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    // this.searchForm.reset();
    this.invalidSearch = false;
    this.loadProductCategoryDetails();
  }

  paginate(pageEvent: PageEvent) {
    this.productCategoryPageEvent = pageEvent;
    this.loadProductCategoryDetails();
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
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
    // (event: OverlayNotificationEventRef) => {
    //   if (event.eventType === OverlayNotificationEventType.CLOSE) {
    //   }
    // }
  }

  backArrow() {
    // this.router.navigate([getProductMasterDashboardRouteUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_MASTERS_MENU_KEY
      }
    });
    this.productCategoryFacade.resetproductCategoryDialogData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  omit_special_char($event: KeyboardEvent) {
    const pattern = /^[-_A-Za-z0-9]$/;
    return pattern.test($event.key);
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
          // this.searchForm.reset();
          this.clearSearchVar = true;
          this.toggleStatus = event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.productCategoryFacade.editproductCategoryFormDetails({
            productCategoryCode: event.productCategoryCode,
            description: null,
            orgCode: null,
            isActive: event.isActive,
            isConversionEnabled: event.isConversionEnabled,
            hallmarkQuantity: event.hallmarkQuantity,
            hallmarkDetails: {
              data: {
                hallmarkingCharges:
                  event.hallmarkDetails.data.hallmarkingCharges,
                isAllowedForHallmarking:
                  event.hallmarkDetails.data.isAllowedForHallmarking,
                isFOCForHallmarkingCharges:
                  event.hallmarkDetails.data.isFOCForHallmarkingCharges
              },
              type: event.hallmarkDetails.type
            }
          });
        }
      });
  }
}
