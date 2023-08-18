import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  ListingActiveDeactiveStatus,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  TEPProductGroupConfigDetails
} from '@poss-web/shared/models';
import {
  getConfigurationHomeRouteUrl,
  getTepProductGroupConfigDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TepProductGroupConfigFacade } from '@poss-web/eposs/tep-product-group/data-access-tep-product-group';
import { fromEvent, Observable, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ErrorEnums } from '@poss-web/shared/util-error';

@Component({
  selector: 'poss-web-tep-product-group-listing',
  templateUrl: './tep-product-group-listing.component.html'
})
export class TepProductGroupListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private tepProductGroupConfigFacade: TepProductGroupConfigFacade,
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

  tepProductGroupConfigList$: Observable<TEPProductGroupConfigDetails[]>;
  isLoading$: Observable<boolean>;
  isActiveToggle$: Observable<boolean>;
  destroy$ = new Subject<null>();

  pageSize: number[];
  totalElements$: Observable<number>;
  hasError$: Observable<CustomErrors>;

  searchErrorCode = ErrorEnums.ERR_CORE_038;

  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  searchData = '';
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  ngOnInit(): void {
    this.hasError$ = this.tepProductGroupConfigFacade.getError();
    this.isLoading$ = this.tepProductGroupConfigFacade.getIsloading();
    this.tepProductGroupConfigList$ = this.tepProductGroupConfigFacade.getTepProductGroupConfigList();
    this.totalElements$ = this.tepProductGroupConfigFacade.getTotalElements();

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
        this.loadTepProductGroupConfigList();
      });

    this.tepProductGroupConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepProductGroupConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification(
            'pw.tepProductGroupConfig.TEPProductGroupConfigurationSaved'
          );
          this.clearSearch();
        }
      });

    this.tepProductGroupConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification(
              'pw.tepProductGroupConfig.TEPProductGroupConfigurationUpdated'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
          this.loadTepProductGroupConfigList();
        }
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.searchData = searchValue.toUpperCase();
          this.search();
        } else {
          this.clearSearch();
        }
      });
  }

  search() {
    this.listingPageEvent.pageIndex = 0;
    this.loadTepProductGroupConfigList();
  }
  clearSearch() {
    this.searchForm.reset();
    this.searchData='';
    this.listingPageEvent.pageIndex = 0;
    this.loadTepProductGroupConfigList();
  }

  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.TEP_CONFIGURATIONS_MENU_KEY
      }
    });
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
          this.toggleStatus = event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.tepProductGroupConfigFacade.updateTepProductGroupConfigDetails({
            configId: event.configId,
            isActive: event.isActive
          });
        } else this.loadTepProductGroupConfigList();
      });
  }

  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadTepProductGroupConfigList();
  }

  loadDetailsView(configId: string) {
    this.router.navigate(
      [getTepProductGroupConfigDetailsRouteUrl(), configId],
      {
        queryParams: {
          showViewOnly: 'true'
        },
        queryParamsHandling: 'merge'
      }
    );
  }
  loadDetails(configId: string) {
    this.router.navigate([getTepProductGroupConfigDetailsRouteUrl(), configId]);
  }

  loadTepProductGroupConfigList() {
    this.tepProductGroupConfigFacade.loadTepProductGroupConfigList({
      description: this.searchData,
      pageIndex: this.listingPageEvent.pageIndex,
      pageSize: this.listingPageEvent.pageSize
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
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
