import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { TepExceptionConfigFacade } from '@poss-web/eposs/tep-exception-config/data-access-tep-exception-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  OverlayNotificationType,
  TEPExceptionConfig,
  ConfigurationsMenuKeyEnum,
  TEPExceptionConfigFilter,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus,
  CustomErrors,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  getConfigurationHomeRouteUrl,
  getTepExchangeConfigDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { TepExceptionFilterComponent } from '@poss-web/eposs/tep-exception-config/ui-tep-exception-config-list';

@Component({
  selector: 'poss-web-tep-exception-config-listing',
  templateUrl: './tep-exception-config-listing.component.html'
})
export class TepExceptionConfigListingComponent implements OnInit, OnDestroy {
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  constructor(
    private tepExceptionConfigFacade: TepExceptionConfigFacade,
    private dialog: MatDialog,
    private router: Router,
    private appsettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
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

  tepExceptionConfigList$: Observable<TEPExceptionConfig[]>;
  isLoading$: Observable<boolean>;
  isActiveToggle$: Observable<boolean>;
  destroy$ = new Subject<null>();


  pageSize: number[];
  totalElements$: Observable<number>;
  hasError$: Observable<CustomErrors>;

  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  hasFilter = false;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  tEPExceptionConfigFilter: TEPExceptionConfigFilter;
  searchErrorCode = ErrorEnums.ERR_CORE_038;

  ngOnInit(): void {
    this.hasError$ = this.tepExceptionConfigFacade.getError();

    this.isLoading$ = this.tepExceptionConfigFacade.getIsloading();

    this.tepExceptionConfigList$ = this.tepExceptionConfigFacade.getTepExceptionConfigList();
    this.totalElements$ = this.tepExceptionConfigFacade.getTotalElements();

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
        this.listingPageEvent.pageSize = data;
        this.loadTepExceptionConfigList();
      });

    this.tepExceptionConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepExceptionConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification(
            'pw.tepExceptionConfig.TEPExceptionConfigurationSaved'
          );

        }
      });

    this.tepExceptionConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        console.log('toggle');
        this.loadTepExceptionConfigList();
        if (saved) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification(
              'pw.tepExceptionConfig.TEPExceptionConfigurationSaved'
            );
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
  }



  loadDetails(configId: string) {
    this.router.navigate([getTepExchangeConfigDetailsRouteUrl(), configId]);
  }
  loadDetailsView(configId: string) {
    this.router.navigate([getTepExchangeConfigDetailsRouteUrl(), configId], {
      queryParams: {
        showViewOnly: 'true'
      },
      queryParamsHandling: 'merge'
    });
  }

  updateIsActive(event: { configId: string; isActive: boolean }) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.tepExceptionConfigFacade.updateTepExceptionConfigDetails(event);
        } else this.loadTepExceptionConfigList();
      });
  }

  openFilter() {
    const dialogRef = this.dialog.open(TepExceptionFilterComponent, {
      width: '550px',
      height: 'auto',
      data: this.tEPExceptionConfigFilter,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((data: TEPExceptionConfigFilter) => {
      if (data) {
        this.tEPExceptionConfigFilter = data;
        if (data.configName || data.variantCode) {
          this.hasFilter = true;
          this.tepExceptionConfigFacade.searchTepExceptionConfig(data);
        } else {
          this.hasFilter = false;
          this.loadTepExceptionConfigList();
        }
      }
    });
  }

  loadTepExceptionConfigList() {
    this.tepExceptionConfigFacade.loadTepExceptionConfigList(
      this.listingPageEvent
    );
  }
  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadTepExceptionConfigList();
  }

  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.TEP_CONFIGURATIONS_MENU_KEY
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
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.subscribe(() => {
            this.overlayNotification.close();
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
