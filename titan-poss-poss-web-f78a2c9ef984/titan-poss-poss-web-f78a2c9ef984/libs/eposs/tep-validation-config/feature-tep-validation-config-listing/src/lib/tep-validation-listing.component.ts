import {
  Component,
  OnDestroy,
  OnInit
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
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  TEPValidationConfigResult
} from '@poss-web/shared/models';
import {
  getConfigurationHomeRouteUrl,
  getTepValidationConfigDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { takeUntil } from 'rxjs/operators';
import { TepValidationConfigFacade } from '@poss-web/eposs/tep-validation-config/data-access-tep-validation-config';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-tep-validation-listing',
  templateUrl: './tep-validation-listing.component.html',
  styleUrls: ['./tep-validation-listing.component.scss']
})
export class TepValidationListingComponent implements OnInit, OnDestroy {
  constructor(
    private tepValidationConfigFacade: TepValidationConfigFacade,
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

  tepValidationConfigList$: Observable<TEPValidationConfigResult[]>;
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

  invalidSearch = false;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  resetSearch = false;

  ngOnInit(): void {
    this.hasError$ = this.tepValidationConfigFacade.getError();
    this.isLoading$ = this.tepValidationConfigFacade.getIsloading();
    this.tepValidationConfigList$ = this.tepValidationConfigFacade.getTepValidationConfigList();
    this.totalElements$ = this.tepValidationConfigFacade.getTotalElements();

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
        this.loadTepValidationConfigList();
      });

    this.tepValidationConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepValidationConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification(
            'pw.tepValidationConfig.TEPValidationConfigurationSaved'
          );
          this.clearSearch();
        }
      });

    this.tepValidationConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification(
              'pw.tepValidationConfig.TEPValidationConfigurationSaved'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
          this.loadTepValidationConfigList();
        }
      });
  }

  search(searchValue: string) {
    if (fieldValidation.alphabetWithSpaceField.pattern.test(searchValue)) {
      this.tepValidationConfigFacade.searchTepValidationConfig(
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
    this.loadTepValidationConfigList();
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

          this.tepValidationConfigFacade.updateTepValidationConfigDetails({
            configId: event.configId,
            isActive: event.isActive
          });
        } else this.loadTepValidationConfigList();
      });
  }

  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadTepValidationConfigList();
  }

  loadViewDetails(configId: string) {
    this.router.navigate([getTepValidationConfigDetailsRouteUrl(), configId], {
      queryParams: {
        showViewOnly: 'true'
      },
      queryParamsHandling: 'merge'
    });
  }

  loadDetails(configId: string) {
    this.router.navigate([getTepValidationConfigDetailsRouteUrl(), configId]);
  }

  loadTepValidationConfigList() {
    this.tepValidationConfigFacade.loadTepValidationConfigList(
      this.listingPageEvent
    );
  }

  errorHandler(error: CustomErrors) {
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
