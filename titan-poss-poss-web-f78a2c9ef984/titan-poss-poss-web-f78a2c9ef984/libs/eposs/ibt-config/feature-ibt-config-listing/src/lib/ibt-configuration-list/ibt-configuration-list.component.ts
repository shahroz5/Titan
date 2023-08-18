import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';

import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { IbtConfigurationFacade } from '@poss-web/eposs/ibt-config/data-access-ibt-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  IbtConfiguration,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  ConfigurationsMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import {
  getConfigurationHomeRouteUrl,
  getIBTConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';

import { takeUntil, debounceTime } from 'rxjs/Operators';
import { Observable, Subject, fromEvent } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-ibt-configuration-list',
  templateUrl: './ibt-configuration-list.component.html'
})
export class IbtConfigurationListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  ibtConfigurationList$: Observable<IbtConfiguration[]>;
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
  invalidSearch: boolean;
  noDataFoundMessage: string;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public router: Router,
    public ibtConfigurationFacade: IbtConfigurationFacade,
    public appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.ibtConfigEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.ibtConfigEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
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
  search(searchValue: string) {
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.ibtConfigurationFacade.searchConfig(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadIbtConfigurationList();
  }
  ngOnInit() {
    this.ibtConfigurationFacade.loadReset();
    this.isLoading$ = this.ibtConfigurationFacade.getIsloading();
    this.ibtConfigurationList$ = this.ibtConfigurationFacade.getIbtConfigurationList();
    this.totalElements$ = this.ibtConfigurationFacade.getTotalElement();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadIbtConfigurationList();
      });
    this.ibtConfigurationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.loadIbtConfigurationList();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showSuccessMessageNotification(
              'pw.ibtConfiguration.updatedMsg'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        } else this.overlayNotification.close();
      });
    this.ibtConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  loadIbtConfigurationList() {
    this.ibtConfigurationFacade.loadIbtConfigurationList(this.initialPageEvent);
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadIbtConfigurationList();
  }
  loadViewDetailPage(configId: string) {
    this.router.navigate([getIBTConfigDetailRouteUrl(configId)], {
      queryParams: {
        showViewOnly: 'true'
      },
      queryParamsHandling: 'merge'
    });
  }
  loadDetailPage(configId: string) {
    this.router.navigate([getIBTConfigDetailRouteUrl(configId)]);
  }

  updateToggle(updateIbtConfiguration: IbtConfiguration) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = updateIbtConfiguration.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.ibtConfigurationFacade.updateIbtConfiguration(
            updateIbtConfiguration
          );
        } else {
          this.loadIbtConfigurationList();
        }
      });
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.INVENTORY_CONFIGURATION_MENU_KEY
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
            message: translatedMsg,
            hasClose: true,
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
