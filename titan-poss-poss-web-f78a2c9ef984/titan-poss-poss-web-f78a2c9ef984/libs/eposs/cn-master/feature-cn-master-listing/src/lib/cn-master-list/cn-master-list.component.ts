import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  ConfigurationsMenuKeyEnum,
  CnMasterDetail,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { takeUntil } from 'rxjs/operators';
import {
  getConfigurationHomeRouteUrl,
  getCreditNoteMasterDetailRouteUrl,
  getCreditNoteMasterViewDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { CreditNoteMasterFacade } from '@poss-web/eposs/cn-master/data-access-cn-master';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-cn-master-list',
  templateUrl: './cn-master-list.component.html'
})
export class CnMasterListComponent implements OnInit, OnDestroy {
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  searchErrorCode: string;
  invalidSearch: boolean;
  creditNoteMasterList$: Observable<CnMasterDetail[]>;
  totalElements$: Observable<number>;
  noDataFoundMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private creditNoteMasterFacade: CreditNoteMasterFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.creditNoteMasterEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.creditNoteMasterEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.creditNoteMasterFacade.loadReset();
    this.isLoading$ = this.creditNoteMasterFacade.getIsloading();
    this.error$ = this.creditNoteMasterFacade.getError();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadCreditNoteMasterList();
        this.creditNoteMasterList$ = this.creditNoteMasterFacade.getCreditNoteMasterList();
        this.totalElements$ = this.creditNoteMasterFacade.getTotalElements();
      });

    this.creditNoteMasterFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification('pw.cnMaster.updatedMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadCreditNoteMasterList();
        } else this.overlayNotification.close();
      });

    this.creditNoteMasterFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  search(searchValue) {
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.invalidSearch = false;
      this.creditNoteMasterFacade.searchCreditNoteMasterList(searchValue);
    } else {
      this.invalidSearch = true;
    }
  }

  loadDetailPage(event) {
    if (event.isActive === true) {
      this.router.navigate([
        getCreditNoteMasterDetailRouteUrl(event.creditNoteType)
      ]);
    } else {
      this.router.navigate([
        getCreditNoteMasterViewDetailRouteUrl(event.creditNoteType)
      ]);
    }
  }

  loadViewPage(event) {
    this.router.navigate([
      getCreditNoteMasterViewDetailRouteUrl(event.creditNoteType)
    ]);
  }

  updateIsActivate(data) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = data.cnDetail.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.creditNoteMasterFacade.updateCreditNoteMasterDetail(data);
        } else this.loadCreditNoteMasterList();
      });
  }

  clearSearch(value?) {
    this.invalidSearch = false;
    this.loadCreditNoteMasterList();
  }

  loadCreditNoteMasterList() {
    this.creditNoteMasterFacade.loadCreditNoteMasterList(this.initialPageEvent);
  }
  loadPaginateData(event: PageEvent) {
    this.initialPageEvent = event;
    this.loadCreditNoteMasterList();
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  back() {
    this.creditNoteMasterFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CREDIT_NOTE_CONFIGURATION_MENU_KEY
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
