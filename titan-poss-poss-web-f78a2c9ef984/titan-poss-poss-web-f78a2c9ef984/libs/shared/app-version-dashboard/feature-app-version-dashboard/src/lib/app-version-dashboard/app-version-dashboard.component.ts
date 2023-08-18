import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  AddVersionRequestModel,
  AppVersionByStatusRequestPayload,
  CustomErrors,
  GetAppVersionDataByStatus,
  LocationMappingServiceAbstraction,
  LocationMappingServiceResponse,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectDropDownOption,
  OverlayNotificationEventType,
  MonitoringDashboardEnum,
  EpossHomeKeyEnum
} from '@poss-web/shared/models';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AppVersionDashboardFacade } from '@poss-web/shared/app-version-dashboard/data-access-app-version-dashboard';

@Component({
  selector: 'poss-web-app-version-dashboard',
  templateUrl: './app-version-dashboard.component.html'
})
export class AppVersionDashboardComponent implements OnInit, OnDestroy {
  appVersionDashboardForm: FormGroup;
  uiVersionLabel: string;
  apiVersionLabel: string;
  dbVersionLabel: string;
  locationLabel: string;
  possUiVersionsDropdownList$: Observable<SelectDropDownOption[]>;
  apiVersionsDropdownList$: Observable<SelectDropDownOption[]>;
  dbVersionsDropdownList$: Observable<SelectDropDownOption[]>;

  allPossUiVersionsList$: Observable<SelectDropDownOption[]>;
  allApiVersionsList$: Observable<SelectDropDownOption[]>;
  allDbVersionsList$: Observable<SelectDropDownOption[]>;

  isNewAppVersionAdded$: Observable<boolean>;
  versionNo;

  statusList$: Observable<SelectDropDownOption[]>;
  selectedAppVersions$: Observable<SelectDropDownOption[]>;
  getAppVersionDataByStatus$: Observable<GetAppVersionDataByStatus[]>;

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number[];

  totalElements$: Observable<number>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  searchRequestData: AppVersionByStatusRequestPayload;
  locationsAdded: any[];
  isLoading$: Observable<boolean>;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private router: Router,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    private appSettingFacade: AppsettingFacade,
    private appVersionDashboardFacade: AppVersionDashboardFacade,
    private locationMappingService: LocationMappingServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.monitoringDashboard.uiVersion',
        'pw.monitoringDashboard.apiVersion',
        'pw.monitoringDashboard.dbVersion',
        'pw.monitoringDashboard.location'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.uiVersionLabel = translatedMsg['pw.monitoringDashboard.uiVersion'];
        this.apiVersionLabel =
          translatedMsg['pw.monitoringDashboard.apiVersion'];
        this.dbVersionLabel = translatedMsg['pw.monitoringDashboard.dbVersion'];
        this.locationLabel = translatedMsg['pw.monitoringDashboard.location'];
      });

    this.appVersionDashboardForm = new FormGroup({
      possUiVersionNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.uiVersionLabel)
      ]),
      apiVersionNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.apiVersionLabel)
      ]),
      dbVersionNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.dbVersionLabel)
      ]),
      location: new FormControl(
        '',
        this.fieldValidatorsService.requiredField(this.locationLabel)
      )
    });
  }

  ngOnInit(): void {
    this.isLoading$ = this.appVersionDashboardFacade.getIsLoading();
    this.appVersionDashboardFacade.loadApplicationVersions();
    this.appVersionDashboardFacade.loadAllApplicationVersionsList();
    this.appVersionDashboardFacade.loadStatusList();

    this.possUiVersionsDropdownList$ = this.appVersionDashboardFacade.getPossUiVersionsList();
    this.apiVersionsDropdownList$ = this.appVersionDashboardFacade.getApiVersionsList();
    this.dbVersionsDropdownList$ = this.appVersionDashboardFacade.getDbVersionsList();

    this.allPossUiVersionsList$ = this.appVersionDashboardFacade.getAllPossUiVersionsList();
    this.allApiVersionsList$ = this.appVersionDashboardFacade.getAllApiVersionsList();
    this.allDbVersionsList$ = this.appVersionDashboardFacade.getAllDbVersionsList();

    this.statusList$ = this.appVersionDashboardFacade.getAppVersionStatusList();

    this.getAppVersionDataByStatus$ = this.appVersionDashboardFacade.getAppVersionDataByStatus();
    this.totalElements$ = this.appVersionDashboardFacade.getAppVersionListCount();

    this.appVersionDashboardFacade
      .getIsNewAppVersionAdded()
      .pipe(
        filter(status => !!status),
        takeUntil(this.destroy$)
      )
      .subscribe(status => {
        const key = 'pw.monitoringDashboard.versionAddedSuccessfully';
        this.showNotification(key, 'versionAddedSuccessfully');
      });

    this.appVersionDashboardFacade
      .getIsAppVersionsPublished()
      .pipe(
        filter(published => !!published),
        takeUntil(this.destroy$)
      )
      .subscribe(published => {
        const key = 'pw.monitoringDashboard.versionsPublishedSuccessfully';
        this.showNotification(key, 'versionsPublishedSuccessfully');
      });

    this.appVersionDashboardFacade
      .getIsAppVersionDeleted()
      .pipe(
        filter(deleted => !!deleted),
        takeUntil(this.destroy$)
      )
      .subscribe(deleted => {
        const key = 'pw.monitoringDashboard.versionDeletedSuccessfully';
        this.showNotification(key, 'versionDeletedSuccessfully');
      });

    this.appVersionDashboardFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });

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
        this.initialPageEvent.pageSize = data;
      });
  }

  loadAppVersionDataByStatus(requestData: AppVersionByStatusRequestPayload) {
    const queryParams = {
      page: this.initialPageEvent.pageIndex,
      size: this.initialPageEvent.pageSize
    };
    const requestPayload: AppVersionByStatusRequestPayload = {
      status: requestData.status,
      location: requestData.location ? requestData.location : null,
      possUiVersion: requestData.possUiVersion
        ? requestData.possUiVersion
        : null,
      possServiceVersion: requestData.possServiceVersion
        ? requestData.possServiceVersion
        : null,
      databaseVersion: requestData.databaseVersion
        ? requestData.databaseVersion
        : null
    };

    if (!requestPayload.location) {
      delete requestPayload.location;
    }
    if (!requestPayload.possUiVersion) {
      delete requestPayload.possUiVersion;
    }
    if (!requestPayload.possServiceVersion) {
      delete requestPayload.possServiceVersion;
    }
    if (!requestPayload.databaseVersion) {
      delete requestPayload.databaseVersion;
    }

    this.appVersionDashboardFacade.loadAllApplicationVersionsByStatus({
      appVersionByStatusRequestPayload: requestPayload,
      queryParams: queryParams
    });
  }

  openLocationMapping() {
    let locationsAdded = [];
    this.appVersionDashboardForm.patchValue({
      location: null
    });

    this.locationMappingService
      .open({ selectedLocations: [] })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: LocationMappingServiceResponse) => {
        if (res.type === 'apply') {
          locationsAdded = res.data.addedLocations.map(l => l.id);
          this.appVersionDashboardForm.patchValue({
            location: locationsAdded
          });
          this.addVersion();
        }
      });
  }

  addVersion() {
    if (this.appVersionDashboardForm.valid) {
      const requestPayload: AddVersionRequestModel = {
        possUiVersion: this.appVersionDashboardForm.get('possUiVersionNumber')
          .value,
        possServiceVersion: this.appVersionDashboardForm.get('apiVersionNumber')
          .value,
        databaseVersion: this.appVersionDashboardForm.get('dbVersionNumber')
          .value,
        locationCode: this.appVersionDashboardForm.get('location').value,
        downloadUrl: ''
      };
      this.appVersionDashboardFacade.addApplicationVersion(requestPayload);
    } else {
      this.appVersionDashboardForm.markAllAsTouched();
    }
  }

  paginate(payload: {
    pageDetails: PageEvent;
    formData: AppVersionByStatusRequestPayload;
  }) {
    this.initialPageEvent = payload.pageDetails;
    this.searchAppVersionByStatus(payload.formData);
  }

  searchAppVersionByStatus(payload: AppVersionByStatusRequestPayload) {
    this.searchRequestData = payload;
    this.loadAppVersionDataByStatus(payload);
  }

  publishAppVersion() {
    this.appVersionDashboardFacade.publishAllAppVersions();
  }
  deleteAppVersion(appVersionId: number) {
    this.appVersionDashboardFacade.deleteAppVersionById(appVersionId);
  }

  getSelectedAppVersionNumbers(selectedType: string) {
    switch (selectedType) {
      case MonitoringDashboardEnum.POSS_UI_VERSION:
        this.selectedAppVersions$ = this.appVersionDashboardFacade.getAllPossUiVersionsList();
        break;
      case MonitoringDashboardEnum.API_VERSION:
        this.selectedAppVersions$ = this.appVersionDashboardFacade.getAllApiVersionsList();
        break;
      case MonitoringDashboardEnum.DB_VERSION:
        this.selectedAppVersions$ = this.appVersionDashboardFacade.getAllDbVersionsList();
        break;
    }
  }

  back() {
    this.router.navigate([getPossHomeRouteUrl()], {
      queryParams: {
        menu: EpossHomeKeyEnum.APPVERSION_DASHBOARD
      }
    });
  }

  showNotification(key: string, type?: string) {
    this.overlayNotification.close();
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe(event => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              if (
                type &&
                (type === 'versionAddedSuccessfully' ||
                  type === 'versionsPublishedSuccessfully' ||
                  type === 'versionDeletedSuccessfully')
              ) {
                this.loadAppVersionDataByStatus(this.searchRequestData);
              }
            }
          });
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.appVersionDashboardFacade.resetState();
    this.overlayNotification.close();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
