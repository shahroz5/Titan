import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import {
  StateTaxConfigurationListingData,
  CustomErrors,
  OverlayNotificationType,
  StateTaxConfigurationStateDetails,
  ConfigurationsMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { StateTaxConfigurationFacade } from '@poss-web/eposs/state-tax-config/data-access-state-tax-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl,
  getStateTaxConfigurationDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-state-tax-config-listing',
  templateUrl: './state-tax-config-listing.component.html'
})
export class StateTaxConfigListingComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private stateTaxConfigurationFacade: StateTaxConfigurationFacade
  ) {
    this.translate
      .get(['pw.entity.stateName'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.stateName']
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
  searchData = '';
  pageSize: number[];
  listPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  stateTaxConfigurationListing$: Observable<StateTaxConfigurationListingData[]>;
  stateTaxConfigurationListCount$: Observable<number>;
  searchErrorCode = ErrorEnums.ERR_LOC_004;
  resetSearch = false;

  ngOnInit() {
    this.hasError$ = this.stateTaxConfigurationFacade.getError();
    this.isLoading$ = this.stateTaxConfigurationFacade.getIsLoading();

    this.stateTaxConfigurationFacade
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
        this.loadStateTaxConfigurationList();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.stateTaxConfigurationFacade
      .getTaxDetailsStateDetailsEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data1 => {
        if (data1) {
          this.loadStateTaxConfigurationList();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.statetaxconfiguration.updateMsg');
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

    this.stateTaxConfigurationListing$ = this.stateTaxConfigurationFacade.getStateTaxConfigurationListing();

    this.stateTaxConfigurationListCount$ = this.stateTaxConfigurationFacade.getTotalListingCount();
  }

  loadStateTaxConfigurationList() {
    this.stateTaxConfigurationFacade.loadStateTaxConfigurationListing(
      this.listPageEvent,
      this.searchData
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

  paginate(pageEvent: PageEvent) {
    this.listPageEvent = pageEvent;
    this.loadStateTaxConfigurationList();
  }

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  updateIsActive($event: StateTaxConfigurationStateDetails) {
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
          this.stateTaxConfigurationFacade.editStateTaxConfigurationStateDetails(
            {
              isActive: $event.isActive,
              stateCode: $event.stateCode,
              stateId: $event.stateId,
              stateName: $event.stateName,
              stateTaxCode: $event.stateTaxCode,
              taxComponent: null
            },
            $event.id
          );
        } else this.loadStateTaxConfigurationList();
      });
  }

  getIdView($event: string) {
    this.router.navigate([getStateTaxConfigurationDetailsRouteUrl(), $event], {
      queryParams: {
        showViewOnly: 'true'
      },
      queryParamsHandling: 'merge'
    });
  }
  getId($event: string) {
    this.router.navigate([getStateTaxConfigurationDetailsRouteUrl(), $event]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  search(searchValue: string) {
    if (fieldValidation.alphaNumericWithSpaceField.pattern.test(searchValue)) {
      this.invalidSearch = false;
      this.searchData = searchValue.toUpperCase()
      this.listPageEvent = { ...this.listPageEvent, pageIndex : 0};
      this.loadStateTaxConfigurationList();
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchData='';
    this.listPageEvent = { ...this.listPageEvent, pageIndex : 0};
    this.loadStateTaxConfigurationList();
  }

  loadDetails() {
    this.router.navigate([getStateTaxConfigurationDetailsRouteUrl()]);
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

  backArrow() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.TAX_CONFIGURATIONS_MENU_KEY
      }
    });
  }
}
