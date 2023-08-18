import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  PriceGroupMaster,
  CustomErrors,
  priceGroupEnum,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus,
  OverlayNotificationType,
} from '@poss-web/shared/models';
import { PriceGroupFacade } from '@poss-web/shared/price-group/data-access-price-group';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PriceGroupDetailComponent } from '@poss-web/shared/price-group/ui-price-group-detail';
import { PriceGroupViewComponent } from '@poss-web/shared/price-group/ui-price-group-view';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-price-group-listing',
  templateUrl: './price-group-listing.component.html'
})
export class PriceGroupListingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  searchErrorCode: string;
  hasError$: Observable<CustomErrors>;
  invalidSearch: boolean;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  priceGroupMasterList$: Observable<PriceGroupMaster[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  noDataFoundMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    private dialog: MatDialog,
    private priceGroupFacade: PriceGroupFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.priceGroupEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.priceGroupEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnInit() {
    this.priceGroupFacade.loadReset();
    this.searchErrorCode = ErrorEnums.ERR_PRO_011;
    // this.searchErrorCode = ErrorEnums.ERR_CORE_023;
    this.isLoading$ = this.priceGroupFacade.getIsloading();
    this.hasError$ = this.priceGroupFacade.getHasError();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadPriceGroupMasterList();
        this.priceGroupMasterList$ = this.priceGroupFacade.getPriceGroupMasterList();
        this.totalElements$ = this.priceGroupFacade.getTotalElements();
      });

    this.priceGroupFacade
      .getPriceGroupByPriceGroupCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(priceGroup => {
        if (priceGroup) {
          if (this.viewMode) {
            this.dialog.open(PriceGroupViewComponent, {
              width: '500px',
              height: 'auto',
              data: {
                priceGroupDetail: priceGroup
              },
              disableClose: true
            });
          } else {
            const dialogRef = this.dialog.open(PriceGroupDetailComponent, {
              width: '500px',
              height: 'auto',
              data: {
                priceGroupDetail: priceGroup
              },
              disableClose: true
            });

            dialogRef
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(formData => {
                if (formData) {
                  this.alertPopupService
                    .open({
                      type: AlertPopupTypeEnum.CONFIRM,
                      message: 'pw.alertPopup.saveConfirmation'
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res: boolean) => {
                      if (res) {
                        this.priceGroupFormDetails(formData);
                      }
                    });
                }
              });
          }
        }
      });

    this.priceGroupFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.loadPriceGroupMasterList();
          this.showSuccessMessageNotification('pw.priceGroup.saveSuccessMsg');
        } else this.overlayNotification.close();
      });
    this.priceGroupFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.priceGroup.updateSuccessMsg'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        } else this.overlayNotification.close();
      });
    this.priceGroupFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  search(searchValue) {
    if (fieldValidation.priceGroupCodeField.pattern.test(searchValue)) {
      this.priceGroupFacade.searchPriceGroupList(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadPriceGroupMasterList();
  }
  loadPriceGroupMasterList() {
    this.priceGroupFacade.loadPriceGroupMasterListing(this.initialPageEvent);
  }
  loadPaginateData(event: PageEvent) {
    this.initialPageEvent = event;
    this.loadPriceGroupMasterList();
  }

  updateIsActive(obj) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = obj.data.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.priceGroupFacade.updatePriceGroupByPriceGroupCode(obj);
        } else {
          this.loadPriceGroupMasterList();
        }
      });
  }

  viewMode: boolean;
  view(priceGroupCode: string) {
    this.viewMode = true;
    this.priceGroupFacade.loadPriceGroupByPriceGroupCode(priceGroupCode);
  }
  addNew(priceGroupCode: string) {
    this.viewMode = false;
    if (priceGroupCode !== priceGroupEnum.NEW) {
      this.priceGroupFacade.loadPriceGroupByPriceGroupCode(priceGroupCode);
    } else {
      const neFormData: PriceGroupMaster = {
        priceGroup: priceGroupEnum.NEW,
        description: ''
      };
      const dialogRef = this.dialog.open(PriceGroupDetailComponent, {
        width: '500px',
        height: 'auto',
        data: {
          priceGroupDetail: neFormData
        },
        disableClose: true
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.alertPopup.saveConfirmation'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res) {
                  this.priceGroupFormDetails(data);
                }
              });
          }
        });
    }
  }

  priceGroupFormDetails(data: any) {
    if (data.mode === priceGroupEnum.new) {
      this.priceGroupFacade.savePriceGroup({
        priceGroup: data.priceGroup,
        description: data.description,
        isActive: true
      });
    } else if (data.mode === priceGroupEnum.edit) {
      this.priceGroupFacade.updatePriceGroupByPriceGroupCode({
        priceGroup: data.priceGroup,
        data: {
          description: data.description
        }
      });
    }
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.subscribe();
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
  back() {
    // this.router.navigate([getProductPricingDashboardUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_PRICING_MENU_KEY
      }
    });
    this.priceGroupFacade.loadReset();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
