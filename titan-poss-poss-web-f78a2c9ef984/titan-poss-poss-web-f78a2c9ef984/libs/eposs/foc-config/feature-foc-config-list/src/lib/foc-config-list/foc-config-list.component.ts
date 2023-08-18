import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  getConfigurationHomeRouteUrl,
  getFocConfigurationRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Router } from '@angular/router';
import {
  OverlayNotificationType,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  ConfigurationsMenuKeyEnum,
  SchemeDetails,
  focSchemeBasedEnums,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { Observable, Subject, fromEvent } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/Operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { FocConfigurationFacade } from '@poss-web/eposs/foc-config/data-access-foc-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
@Component({
  selector: 'poss-web-foc-config-list',
  templateUrl: './foc-config-list.component.html'
})
export class FocConfigListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  focConfigurationList$: Observable<SchemeDetails[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  searchInitialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  invalidSearch: boolean;
  noDataFoundMessage: string;
  isActive: boolean;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;
  searchValue: string;
  constructor(
    public router: Router,
    public focConfigurationFacade: FocConfigurationFacade,
    public appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.focSchemeBasedConfigEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.focSchemeBasedConfigEntity']
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
    this.searchValue = searchValue;
    this.initialPageEvent = this.searchInitialPageEvent;
    if (fieldValidation.focSchemeNameField.pattern.test(searchValue)) {
      this.focConfigurationFacade.loadFocConfigurationList(
        this.initialPageEvent,
        searchValue.toUpperCase()
      );
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.initialPageEvent = this.searchInitialPageEvent;
    this.searchForm.reset();
    this.searchValue = null;
    this.loadFocConfigurationList();
  }

  publish(id) {
    this.focConfigurationFacade.publishFocScheme(id);
  }
  ngOnInit() {
    this.focConfigurationFacade.loadReset();
    this.isLoading$ = this.focConfigurationFacade.getIsloading();
    this.focConfigurationList$ = this.focConfigurationFacade.getFocConfigurationList();
    this.totalElements$ = this.focConfigurationFacade.getTotalElement();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.searchInitialPageEvent.pageSize = pageSize;
        this.loadFocConfigurationList();
      });

    this.focConfigurationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          const key = this.isActive
            ? 'pw.focConfiguration.activatedMsg'
            : 'pw.focConfiguration.deactivatedMsg';
          this.searchForm.reset();
          this.loadFocConfigurationList();
          this.showSuccessMessageNotification(key);
        } else this.overlayNotification.close();
      });

    this.focConfigurationFacade
      .getIsPublished()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isPublished => {
        if (isPublished) {
          this.loadFocConfigurationList();
          this.showSuccessMessageNotification(
            'pw.focConfiguration.publishSuccessMsg'
          );
        } else this.overlayNotification.close();
      });

    this.focConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  addNew() {
    this.router.navigate([
      getFocConfigurationRouteUrl() + '/' + focSchemeBasedEnums.NEW
    ]);
  }
  loadFocConfigurationList() {
    this.focConfigurationFacade.loadFocConfigurationList(
      this.initialPageEvent,
      this.searchValue
    );
  }
  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadFocConfigurationList();
  }
  loadDetailPage(configId: string) {
    this.router.navigate([getFocConfigurationRouteUrl() + '/' + configId]);
  }
  loadDetailViewPage(configId: string) {
    this.router.navigate([
      getFocConfigurationRouteUrl() + '/' + configId + '/view'
    ]);
  }

  updateToggle(updateFocConfiguration: SchemeDetails) {
    this.isActive = updateFocConfiguration.isActive;
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = updateFocConfiguration.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.focConfigurationFacade.updateFocSchemeConfiguration(
            updateFocConfiguration
          );
        } else {
          this.loadFocConfigurationList();
        }
      });
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.FOC
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
    if (error.code === 'ERR-CONFIG-159') {
      this.loadFocConfigurationList();
    }
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
