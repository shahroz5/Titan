import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  CustomErrors,
  CnValidation,
  OverlayNotificationServiceAbstraction,
  ConfigurationsMenuKeyEnum,
  OverlayNotificationType,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus,
  CnValidationListPayload,
  CnTypeList
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CnValidationFacade } from '@poss-web/eposs/cn-validation/data-access-cn-validation';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl,
  getCreditNoteValidationDetailRouteUrl,
  getCreditNoteValidationViewDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-cn-validation-listing',
  templateUrl: './cn-validation-listing.component.html'
})
export class CnValidationListingComponent implements OnInit, OnDestroy {
  cnValidationList$: Observable<CnValidation[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  searchDescription: string;
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  invalidSearch = false;
  noDataFoundMessage: string;
  permissions$: Observable<any[]>;
  ADD_EDIT_PERMISSION =
    'CNConfigurations_CreditNoteValidation_addEditPermission';

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  cnTypeList: CnTypeList[];

  constructor(
    public router: Router,
    public cnValidationFacade: CnValidationFacade,
    public appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();

    this.translate
      .get(['pw.entity.creditNoteValidationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.creditNoteValidationEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.cnValidationFacade.loadReset();
    this.isLoading$ = this.cnValidationFacade.getIsloading();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadCnValidationList();
        this.cnValidationList$ = this.cnValidationFacade.getCnValidationList();
        this.totalElements$ = this.cnValidationFacade.getTotalElement();
      });
    this.cnValidationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.loadCnValidationList();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.cnValidation.updateSuccessMessage'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.clearSearch();
        } else this.overlayNotification.close();
      });
    this.cnValidationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.cnValidationFacade.loadCnTypeList();
    this.cnValidationFacade
      .getCnTypeList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data?.length > 0) {
          this.cnTypeList = data;
        }
      });
  }

  search(searchValue: any) {
    this.initialPageEvent.pageIndex = 0;
    if (searchValue.description) {
      if (
        fieldValidation.nameWithSpaceField.pattern.test(searchValue.description)
      ) {
        this.searchDescription = searchValue.description.toUpperCase();
        this.loadCnValidationList({
          description: searchValue.description.toUpperCase()
        });
        this.invalidSearch = false;
      } else {
        this.invalidSearch = true;
      }
    } else {
      if (
        fieldValidation.cpgGroupNameField.pattern.test(searchValue.ruleType)
      ) {
        if (this.cnTypeList) {
          this.searchDescription = searchValue.ruleType.toUpperCase();
          const selectedCNType = this.cnTypeList.find(
            data => data.id === this.searchDescription
          );

          if (selectedCNType) {
            this.loadCnValidationList({
              ruleType: searchValue.ruleType.toUpperCase()
            });
            this.invalidSearch = false;
          } else {
            this.invalidSearch = true;
          }
        }
      } else {
        this.invalidSearch = true;
      }
    }
  }
  clearSearch(value?) {
    this.invalidSearch = false;
    this.initialPageEvent.pageIndex = 0;
    this.searchDescription = undefined;
    this.loadCnValidationList();
  }

  loadCnValidationList(searchDescription?: any) {
    let payload: CnValidationListPayload = {
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      length: this.initialPageEvent.length,
      searchDescription: searchDescription
    };
    this.cnValidationFacade.loadCnValidationList(payload);
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadCnValidationList(this.searchDescription);
  }
  loadDetailPage(event) {
    if (event.isActive === true) {
      this.router.navigate([
        getCreditNoteValidationDetailRouteUrl(event.ruleId, event.ruleType)
      ]);
    } else {
      this.router.navigate([
        getCreditNoteValidationViewDetailRouteUrl(event.ruleId, event.ruleType)
      ]);
    }
  }

  loadViewPage(event) {
    this.router.navigate([
      getCreditNoteValidationViewDetailRouteUrl(event.ruleId, event.ruleType)
    ]);
  }

  loadDetailPageValue(ruleId) {
    const ruleType = 'new';
    this.router.navigate([
      getCreditNoteValidationDetailRouteUrl(ruleId, ruleType)
    ]);
  }

  updateToggle(updateCnValidation: CnValidation) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = updateCnValidation.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.cnValidationFacade.updateCnValidation(updateCnValidation);
          this.loadCnValidationList();
        } else this.loadCnValidationList();
      });
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CREDIT_NOTE_CONFIGURATION_MENU_KEY
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
  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
