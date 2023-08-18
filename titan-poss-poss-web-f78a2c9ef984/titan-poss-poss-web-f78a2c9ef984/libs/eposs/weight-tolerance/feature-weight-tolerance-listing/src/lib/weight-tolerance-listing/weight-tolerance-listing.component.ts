import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  ConfigDetails,
  OverlayNotificationServiceAbstraction,
  weightToleranceEnum,
  ConfigurationsMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import {
  OverlayNotificationType,
  OverlayNotificationEventType
} from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ErrorEnums } from '@poss-web/shared/util-error';

import {
  getConfigurationHomeRouteUrl,
  getWeightToleranceDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Subject, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { WeightToleranceFacade } from '@poss-web/eposs/weight-tolerance/data-access-weight-tolerance';
@Component({
  selector: 'poss-web-weight-tolerance-listing',
  templateUrl: './weight-tolerance-listing.component.html'
})
export class WeightToleranceListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  searchErrorCode: string;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number[];
  isSearching$: Observable<boolean>;
  configList$: Observable<ConfigDetails[]>;
  totalElements$: Observable<number>;
  configDetailsListingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  searchedData$: Observable<ConfigDetails>;
  hasError$: Observable<CustomErrors>;
  searchData = '';
  invalidSearch: boolean;
  noDataFoundMessage: string;
  constructor(
    private alertPopupService: AlertPopupServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private weightToleranceFacade: WeightToleranceFacade,
    private router: Router,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.weightToleranceEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.weightToleranceEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.weightToleranceFacade.loadReset();
    this.hasError$ = this.weightToleranceFacade.getError();

    this.searchErrorCode = ErrorEnums.ERR_INV_002;
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.configDetailsListingPageEvent.pageSize = data;
        this.loadConfigDetails();
      });

    this.configList$ = this.weightToleranceFacade.getConfigList();
    this.totalElements$ = this.weightToleranceFacade.getTotalElements();
    this.isLoading$ = this.weightToleranceFacade.getIsLoading();
    this.weightToleranceFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.weightToleranceFacade
      .getIsUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.loadConfigDetails();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.weightTolerance.updateMsg');
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

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.searchData = searchValue;
          this.search();
        } else {
          this.clearSearch();
        }
      });
  }

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  updateIsActive(updateIsActive) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = updateIsActive.data.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.weightToleranceFacade.updateIsActive(updateIsActive);
        } else {
          this.loadConfigDetails();
        }
      });
  }

  search() {
    if (fieldValidation.nameWithSpaceField.pattern.test(this.searchData)) {
      this.invalidSearch = false;
      this.configDetailsListingPageEvent.pageIndex = 0;
      this.loadConfigDetails();
    } else {
      this.invalidSearch = true;
    }
  }

  clearSearch() {
    this.invalidSearch = false;
    this.weightToleranceFacade.loadReset();
    this.searchForm.reset();
    this.searchData='';
    this.configDetailsListingPageEvent.pageIndex = 0;
    this.loadConfigDetails();
  }

  addNew() {
    this.router.navigate([
      getWeightToleranceDetailRouteUrl(weightToleranceEnum.new)
    ]);
  }
  loadConfigDetails() {
    this.weightToleranceFacade.loadConfigList({
      description: this.searchData,
      pageIndex: this.configDetailsListingPageEvent.pageIndex,
      pageSize: this.configDetailsListingPageEvent.pageSize
    });
  }
  loadSelectedWeightToleranceView(configId: string) {
    this.router.navigate([getWeightToleranceDetailRouteUrl(configId)], {
      queryParams: {
        showViewOnly: 'true'
      },
      queryParamsHandling: 'merge'
    });
  }
  loadSelectedWeightTolerance(configId: string) {
    this.router.navigate([getWeightToleranceDetailRouteUrl(configId)]);
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
  paginate(pageEvent: PageEvent) {
    this.configDetailsListingPageEvent = pageEvent;
    this.loadConfigDetails();
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

  back() {
    this.weightToleranceFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.INVENTORY_CONFIGURATION_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
