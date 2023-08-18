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
  ConfigTypeEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl,
  geGRNWeightValueConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { GRNWeightValueConfigFacade } from '@poss-web/eposs/grn-tolerance-config/data-access-grn-tolerance-config';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
@Component({
  selector: 'poss-web-weight-value-config-listing',
  templateUrl: './weight-value-config-listing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightValueConfigListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  permissions$: Observable<any[]>;
  ADD_EDIT_PERMISSION = 'Configurations_grnToleranceConfig_addEditPermission';
  VIEW_PERMISSION = 'Configurations_grnToleranceConfig_viewPermission';

  constructor(
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private weightValueConfigFacade: GRNWeightValueConfigFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
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

  @ViewChild('searchBox')
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  noDataFoundMessage: string;

  ngOnInit() {
    this.translate
      .get(['pw.entity.grnWeightValueConfigEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.grnWeightValueConfigEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessages: any) => {
            this.noDataFoundMessage =
              translatedMessages['pw.global.noDataFoundMessage'];
          });
      });

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
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  paginate(pageEvent: PageEvent) {
    this.listPageEvent = pageEvent;
    this.loadWeightValueConfigList();
  }

  loadWeightValueConfigList() {
    this.weightValueConfigFacade.loadWeightValueConfigListing(
      this.listPageEvent
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
    this.router.navigate([geGRNWeightValueConfigDetailRouteUrl(event)]);
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDetails() {
    this.router.navigate([
      geGRNWeightValueConfigDetailRouteUrl(WeightValueConfigConstants.NEW)
    ]);
  }

  search(searchValue: string) {
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.weightValueConfigFacade.searchWeightValueConfigListing(
        searchValue.toUpperCase()
      );
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
          this.toggleStatus = $event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.weightValueConfigFacade.editWeightValueConfigDetails({
            isActive: $event.isActive,
            ruleId: $event.ruleId,
            ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG
          });
        } else this.loadWeightValueConfigList();
      });
  }
  openViewPage(id) {
    this.router.navigate([geGRNWeightValueConfigDetailRouteUrl(id)], {
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
