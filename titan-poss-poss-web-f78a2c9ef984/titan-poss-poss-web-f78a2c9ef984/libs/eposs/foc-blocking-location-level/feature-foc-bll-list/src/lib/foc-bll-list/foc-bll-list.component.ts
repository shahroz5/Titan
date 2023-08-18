import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { FOCBLLFacade } from '@poss-web/eposs/foc-blocking-location-level/data-access-foc-bll';
import {
  AlertPopupServiceAbstraction,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  FOCBlockingLocationLevel,
  AlertPopupTypeEnum,
  LocationMappingFormType,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  CourierSelectedLocations
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
export enum FOCBLLEnum {
  FOC_LOCATION_DETAILS = 'FOC_BLOCKING_FOR_STORE'
}
@Component({
  selector: 'poss-web-foc-bll-list',
  templateUrl: './foc-bll-list.component.html'
})
export class FocBllListComponent implements OnInit, OnDestroy {
  isfilterApplied = false;
  selectedLocations: FOCBlockingLocationLevel[] = [];
  invalidSearch = false;
  locationCodeMapping: Map<string, string> = new Map<string, string>();
  destroy$ = new Subject<null>();
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  schemeId: string;
  totalElements$: Observable<number>;
  pageSizeOptions: number[];
  focBlockingDetails: any[] = [];
  isLoading$: Observable<boolean>;
  dateFormat: string;
  locationCodes: string[] = [];
  isEnable: boolean;
  totalCount = 0;
  mappedLocations: CourierSelectedLocations[];
  constructor(
    private router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private focbllFacade: FOCBLLFacade,
    private appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.focbllFacade.resetFOCBLLDetails();
    this.isLoading$ = this.focbllFacade.getIsLoading();
    this.focbllFacade.loadFOCSchemes(FOCBLLEnum.FOC_LOCATION_DETAILS);
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
      });
    this.focbllFacade
      .getFOCSchemeId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((schemeId: string) => {
        if (schemeId) {
          this.schemeId = schemeId;
          this.loadFOCBLLDetails();
        }
      });
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataFormat: string) => {
        this.dateFormat = dataFormat;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));
    this.focbllFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasSaved: boolean) => {
        if (hasSaved) {
          this.loadFOCBLLDetails();
          this.locationCodes = [];
          this.isEnable = false;
          this.showNotifications('pw.focBlockingLocationLevel.successMsg');
        }
      });
    this.focbllFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.focbllFacade
      .getFocBlockingDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((focBlockingDetails: FOCBlockingLocationLevel[]) => {
        if (focBlockingDetails) {
          this.focBlockingDetails = [];
          for (const focLocationDetails of focBlockingDetails) {
            this.focBlockingDetails.push({
              locationCode: focLocationDetails.locationCode,
              description: focLocationDetails.description,
              fromDate: moment(focLocationDetails.fromDate).format(
                this.dateFormat
              ),
              toDate: moment(focLocationDetails.toDate).format(this.dateFormat),
              approvedBy: focLocationDetails.approvedBy,
              isCMMandatory: focLocationDetails.isCMMandatory,
              remarks: focLocationDetails.remarks,
              isActive: focLocationDetails.isActive,
              id: focLocationDetails.id
            });
          }
        }
      });
    this.totalElements$ = this.focbllFacade.getTotalElements();
    this.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalElements: number) => {
        if (totalElements !== this.totalCount) {
          this.totalCount = totalElements;
          this.focbllFacade.loadSelectedLocations({
            id: this.schemeId,
            pageIndex: 0,
            pageSize: this.totalCount
          });
        }
      });
    this.focbllFacade
      .getSelectedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: CourierSelectedLocations[]) => {
        if (locations) {
          this.mappedLocations = locations;
        }
      });
  }
  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }
  loadFOCBLLDetails() {
    this.focbllFacade.loadFOCBLLDetails({
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      id: this.schemeId
    });
  }
  loadPaginateData($event) {
    this.initialPageEvent = $event;
    this.loadFOCBLLDetails();
  }
  search(locationCode) {
    this.focbllFacade.searchLocationCode({
      schemeId: this.schemeId,
      locationCode: locationCode.toUpperCase()
    });
  }

  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.FOC
      }
    });
    this.focbllFacade.resetFOCBLLDetails();
  }
  updateFocBlockingDetails($event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.isEnable = true;
          this.focbllFacade.saveFOCBLLDetails({
            id: this.schemeId,
            savePayload: $event
          });
        }
      });
  }
  openLocationMapping() {
    this.locationMappingService
      .openLocationMappingWithForm({
        formType: LocationMappingFormType.FOC_BLOCKING_LOCATION_LEVEL,
        selectedLocations: this.mappedLocations
      })
      .subscribe(res => {
        if (res) {
          const addLocations = [];
          if (res?.data?.locations.addedLocations) {
            res.data.locations.addedLocations.forEach(Addedlocation => {
              addLocations.push(Addedlocation.id);
            });
          }
          if (addLocations.length) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: boolean) => {
              if (result) {
                this.focbllFacade.saveFOCBLLDetails({
                  id: this.schemeId,
                  savePayload: {
                    validity: {
                      endDate: res.data.config.rangeFormGroup.endDate
                        .endOf('day')
                        .valueOf(),
                      startDate: res.data.config.rangeFormGroup.startDate
                        .startOf('day')
                        .valueOf(),
                      status: res.data.config.isActive
                    },
                    configDetails: {
                      type: FOCBLLEnum.FOC_LOCATION_DETAILS,
                      data: {
                        remarks: res.data.config.remarks,
                        approvedBy: res.data.config.approvedBy,
                        isCMNumber: res.data.config.isCMMandatory
                      }
                    },
                    addLocations: addLocations,
                    updateLocations: [],
                    removeLocations: [],
                    mobileNo: null
                  }
                });
              }
            });
          }
        }
      });
  }

  errorHandler(error: CustomErrors) {
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
