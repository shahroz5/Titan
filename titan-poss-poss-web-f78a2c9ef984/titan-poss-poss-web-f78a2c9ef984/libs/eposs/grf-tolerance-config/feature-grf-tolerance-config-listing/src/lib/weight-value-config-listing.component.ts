import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, take, debounceTime } from 'rxjs/operators';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  CustomErrors,
  OverlayNotificationType,
  WeightValueConfigDetails,
  WeightValueConfigConstants,
  ConfigurationsMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus,
  LoadWeightValueConfigListingPayload
} from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl,
  getWeightValueConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { WeightValueConfigFacade } from '@poss-web/eposs/grf-tolerance-config/data-access-grf-tolerance-config';

@Component({
  selector: 'poss-web-weight-value-config-listing',
  templateUrl: './weight-value-config-listing.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightValueConfigListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  noDataFoundMessage: string;

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private weightValueConfigFacade: WeightValueConfigFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.grfWeightValueConfig'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.grfWeightValueConfig']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  invalidSearch = false;
  pageSize: number[];
  listPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  weightValueConfigListing$: Observable<WeightValueConfigDetails[]>;
  WeightValueConfigListCount$: Observable<number>;
  searchErrorCode = ErrorEnums.ERR_PAY_007;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  ngOnInit() {
    this.weightValueConfigFacade.loadReset();
    this.hasError$ = this.weightValueConfigFacade.getError();
    this.isLoading$ = this.weightValueConfigFacade.getIsLoading();
    this.WeightValueConfigListCount$ = this.weightValueConfigFacade.getWeightValueConfigTotal();
    this.weightValueConfigListing$ = this.weightValueConfigFacade.getWeightValueConfigListing();

    this.weightValueConfigFacade
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
        this.listPageEvent.pageSize = pageSize;
        this.loadWeightValueConfigList();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.weightValueConfigFacade
      .getWeightValueConfigDetailsEdited()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.weightValueConfig.successMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadWeightValueConfigList();
        }
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        this.listPageEvent.pageIndex = 0;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  paginate(pageEvent: PageEvent) {
    this.listPageEvent = pageEvent;
    const searchValue = this.searchForm.value.searchValue;
    if (searchValue) {
      this.search(searchValue);
    } else {
      this.loadWeightValueConfigList();
    }
  }

  loadWeightValueConfigList(searchParam?: string) {
    let payload: LoadWeightValueConfigListingPayload =  {
      pageIndex: this.listPageEvent.pageIndex,
      pageSize: this.listPageEvent.pageSize,
      searchDescription: searchParam
    }
    this.weightValueConfigFacade.loadWeightValueConfigListing(
      payload
    );
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

            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  getId(event: string) {
    this.router.navigate([getWeightValueConfigDetailRouteUrl(event)]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDetails() {
    this.router.navigate([
      getWeightValueConfigDetailRouteUrl(WeightValueConfigConstants.NEW)
    ]);
  }

  search(searchValue: string) {
    if (fieldValidation.alphaNumericField.pattern.test(searchValue)) {
      this.loadWeightValueConfigList(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.loadWeightValueConfigList();
  }

  updateIsActive($event: any) {
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

          this.weightValueConfigFacade.editWeightValueConfigDetails({
            isActive: $event.isActive,
            ruleId: $event.ruleId,
            ruleType: WeightValueConfigConstants.GRF_CONFIGURATION
          });
        } else {
          this.loadWeightValueConfigList();
        }
      });
  }
  openViewPage(id) {
    this.router.navigate([getWeightValueConfigDetailRouteUrl(id)], {
      queryParams: { showViewOnly: 'true' },
      queryParamsHandling: 'merge'
    });
  }

  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }
}
