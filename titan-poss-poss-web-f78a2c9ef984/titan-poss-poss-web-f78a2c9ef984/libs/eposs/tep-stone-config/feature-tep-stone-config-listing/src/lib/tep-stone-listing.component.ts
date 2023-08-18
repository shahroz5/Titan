import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { TepStoneConfigFacade } from '@poss-web/eposs/tep-stone-config/data-access-tep-stone-config';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  ListingActiveDeactiveStatus,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  TEPStoneConfig
} from '@poss-web/shared/models';
import {
  getConfigurationHomeRouteUrl,
  getTepStoneConfigDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ErrorEnums } from '@poss-web/shared/util-error';

@Component({
  selector: 'poss-web-tep-stone-listing',
  templateUrl: './tep-stone-listing.component.html'
})
export class TepStoneListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private tepStoneConfigFacade: TepStoneConfigFacade,
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

  tepStoneConfigList$: Observable<TEPStoneConfig[]>;
  isLoading$: Observable<boolean>;
  isActiveToggle$: Observable<boolean>;
  destroy$ = new Subject<null>();
  searchErrorCode = ErrorEnums.ERR_CORE_038;

  pageSize: number[];
  totalElements$: Observable<number>;
  hasError$: Observable<CustomErrors>;

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

  ngOnInit(): void {
    this.hasError$ = this.tepStoneConfigFacade.getError();
    this.isLoading$ = this.tepStoneConfigFacade.getIsloading();

    this.tepStoneConfigList$ = this.tepStoneConfigFacade.getTepStoneConfigList();

    this.totalElements$ = this.tepStoneConfigFacade.getTotalElements();

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
        this.loadTepStoneConfigList();
      });

    this.tepStoneConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepStoneConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification('pw.tepStoneConfig.TEPStoneConfigurationSaved');
        }
      });

    this.tepStoneConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification(
              'pw.tepStoneConfig.TEPStoneConfigurationUpdated'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadTepStoneConfigList();
        }
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

  loadDetails(configId: string) {
    this.router.navigate([getTepStoneConfigDetailsRouteUrl(), configId]);
  }

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
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
          this.tepStoneConfigFacade.updateTepStoneConfigDetails(event);
        } else this.loadTepStoneConfigList();
      });
  }

  loadTepStoneConfigList() {
    this.tepStoneConfigFacade.loadTepStoneConfigList(this.listingPageEvent);
  }
  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadTepStoneConfigList();
  }

  search(searchValue: string) {
    this.tepStoneConfigFacade.searchTepStoneConfig(searchValue);
  }
  clearSearch() {
    this.searchForm.reset();
    this.loadTepStoneConfigList();
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
  openViewPage(configId) {
    this.router.navigate([getTepStoneConfigDetailsRouteUrl(), configId], {
      queryParams: { showViewOnly: 'true' },
      queryParamsHandling: 'merge'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
