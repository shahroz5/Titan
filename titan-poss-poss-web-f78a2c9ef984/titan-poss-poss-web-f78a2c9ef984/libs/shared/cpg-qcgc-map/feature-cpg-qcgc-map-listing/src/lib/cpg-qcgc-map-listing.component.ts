import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { CPGProductGroupForQCGCFacade } from '@poss-web/shared/cpg-qcgc-map/data-access-cpg-qcgc-map';
import {
  CustomErrors,
  OverlayNotificationType,
  CPGProductGroupConfigForQCGCDetails,
  CPGProductGroupConfigForQCGCConstants,
  ConfigurationsMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl,
  getDetailsCPGProductGroupConfigForQCGCRouteUrl
} from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-cpg-qcgc-map-listing',
  templateUrl: './cpg-qcgc-map-listing.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CpgQcgcMapListingComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private cdr: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction,
    private cpgProductGrpupFacade: CPGProductGroupForQCGCFacade
  ) {
    this.translate
      .get(['pw.entity.configName'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.configName']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageNonVerifiedItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  noDataFoundMessageNonVerifiedItems: string;

  invalidSearch = false;
  pageSize: number[];
  listPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };
  destroy$ = new Subject<null>();
  searchData = '';
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  cpgproductGroupConfigListing$: Observable<
    CPGProductGroupConfigForQCGCDetails[]
  >;
  cpgproductGroupConfigListCount$: Observable<number>;
  searchErrorCode = ErrorEnums.ERR_PAY_007;
  productMappingErrorCode = ErrorEnums.ERR_PAY_009;
  resetSearch = false;

  ngOnInit() {
    this.hasError$ = this.cpgProductGrpupFacade.getError();
    this.isLoading$ = this.cpgProductGrpupFacade.getIsLoading();
    this.cpgproductGroupConfigListCount$ = this.cpgProductGrpupFacade.getTotalCPGProductGroupConfig();
    this.cpgproductGroupConfigListing$ = this.cpgProductGrpupFacade.getCPGProductGroupConfigListing();

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.listPageEvent.pageSize = pageSize;
        this.loadCPGConfigList();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.cpgProductGrpupFacade
      .getCPGProductGroupConfigDetailsEditedResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.resetSearch = true;
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.cpgProductGroupConfig.successMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        }
      });

    this.cpgProductGrpupFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  paginate(pageEvent: PageEvent) {
    this.listPageEvent = pageEvent;
    this.loadCPGConfigList();
  }

  loadCPGConfigList() {
    this.cpgProductGrpupFacade.loadCPGProductGroupConfigListing({
      ...this.listPageEvent,
      searchData: this.searchData
    });
  }

  errorHandler(error: CustomErrors) {
    if (
      error.code === this.searchErrorCode ||
      error.code === this.productMappingErrorCode
    ) {
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

  showNotification(key: string) {
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
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  updateIsActive($event: any) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          let selectedCpgGroup;
          this.cpgproductGroupConfigListing$
            .pipe(takeUntil(this.destroy$))
            .subscribe(list => {
              if (list) {
                selectedCpgGroup = list.find(
                  element =>
                    element.paymentCategoryName === $event.paymentCategoryName
                );
              }
            });
          this.toggleStatus = $event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          if (selectedCpgGroup) {
            selectedCpgGroup = {
              ...selectedCpgGroup,
              isActive: $event.isActive
            };
            this.cpgProductGrpupFacade.editCPGProductGroupConfigDetails(
              selectedCpgGroup
            );
          }
        } else this.loadCPGConfigList();
      });
  }

  getIdView($event: string) {
    this.router.navigate(
      [getDetailsCPGProductGroupConfigForQCGCRouteUrl(), $event],
      {
        queryParams: {
          showViewOnly: 'true'
        },
        queryParamsHandling: 'merge'
      }
    );
  }

  getId($event: string) {
    this.router.navigate([
      getDetailsCPGProductGroupConfigForQCGCRouteUrl(),
      $event
    ]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDetails() {
    this.router.navigate([
      getDetailsCPGProductGroupConfigForQCGCRouteUrl(),
      CPGProductGroupConfigForQCGCConstants.NEW
    ]);
  }

  search(searchValue: string) {
    if (fieldValidation.cpgGroupNameField.pattern.test(searchValue)) {
      this.searchData = searchValue.toUpperCase();

      this.listPageEvent.pageIndex = 0;
      this.loadCPGConfigList();

      this.invalidSearch = false;
      this.cdr.detectChanges();
    } else {
      this.invalidSearch = true;
      this.cdr.detectChanges();
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchData = '';
    this.listPageEvent.pageIndex = 0;

    this.loadCPGConfigList();
  }

  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }
}
