import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject, fromEvent } from 'rxjs';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  ConfigurationsMenuKeyEnum,
  ResidualWeightConfigResponse,
  SelectDropDownOption,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ResidualWeightConfigFacade } from '@poss-web/eposs/residual-weight-config/data-access-residual-weight-config';
import {
  getConfigurationHomeRouteUrl,
  getResidualWeightToleranceDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-residual-weight-config-list',
  templateUrl: './residual-weight-config-list.component.html'
})
export class ResidualWeightConfigListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  residualWeightConfigList$: Observable<any[]>;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  totalElements$: Observable<number>;
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
  searchData = '';
  noDataFoundMessage;
  orderTypeFormControl = new FormControl('advance');
  orderTypesArray: SelectDropDownOption[] = [
    {
      value: 'advance',
      description: 'Advance Booking'
    }
  ];
  ADD_EDIT_PERMISSION =
    'ABConfigurations_residualWeightToleranceConfig_addEditPermission';
  VIEW_PERMISSION =
    'ABConfigurations_residualWeightToleranceConfig_viewPermission';
  permissions$: Observable<any[]>;

  constructor(
    private residualWeightConfigFacade: ResidualWeightConfigFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.translate
      .get(['pw.entity.configurationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.configurationEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
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
  ngOnInit(): void {
    this.residualWeightConfigFacade.loadReset();
    this.isLoading$ = this.residualWeightConfigFacade.getIsloading();
    this.error$ = this.residualWeightConfigFacade.getError();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadResidualWeightConfigList();
        this.residualWeightConfigList$ = this.residualWeightConfigFacade.getResidualWeightConfigList();
        this.totalElements$ = this.residualWeightConfigFacade.getTotalElements();
      });

    this.residualWeightConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();

          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'Configuration updated successfully'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadResidualWeightConfigList();
        } else this.overlayNotification.close();
      });

    this.residualWeightConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  search() {
    if (fieldValidation.nameWithSpaceField.pattern.test(this.searchData)) {
      this.invalidSearch = false;
      this.initialPageEvent.pageIndex = 0;
      this.loadResidualWeightConfigList();
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.searchData = '';
    this.initialPageEvent.pageIndex = 0;
    this.loadResidualWeightConfigList();
  }

  updateToggle(payload: ResidualWeightConfigResponse) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = payload.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.residualWeightConfigFacade.updateConfigIsActive(payload);
        } else this.loadResidualWeightConfigList();
      });
  }

  loadDetailPage(configId: string) {
    this.router.navigate([getResidualWeightToleranceDetailsRouteUrl(configId)]);
  }

  loadResidualWeightConfigList() {
    this.residualWeightConfigFacade.loadResidualWeightConfigList({
      description: this.searchData,
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize
    });
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadResidualWeightConfigList();
  }
  openViewPage(configId) {
    this.router.navigate(
      [getResidualWeightToleranceDetailsRouteUrl(configId)],
      {
        queryParams: { showViewOnly: 'true' },
        queryParamsHandling: 'merge'
      }
    );
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
  back() {
    this.residualWeightConfigFacade.loadReset();
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.ADVANCE_BOOKING_TRANSACTION_MENU_KEY
      }
    });
  }
  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
