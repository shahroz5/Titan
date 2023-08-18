import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  AlertPopupServiceAbstraction,
  ConfigurationsMenuKeyEnum,
  CustomErrors,
  FOCBlockingCustomerLevel,
  AlertPopupTypeEnum,
  LocationMappingFormType,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  CourierSelectedLocations
} from '@poss-web/shared/models';
import { takeUntil, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FOCBCLFacade } from '@poss-web/eposs/foc-blocking-customer-level/data-access-foc-bcl';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
export enum FOCBCLEnum {
  FOC_CUSTOMER_DETAILS = 'FOC_BLOCKING_FOR_CUSTOMER'
}
@Component({
  selector: 'poss-web-foc-bcl-list',
  templateUrl: './foc-bcl-list.component.html'
})
export class FocBclListComponent implements OnInit, OnDestroy {
  isfilterApplied = false;
  selectedLoations: any = [];
  invalidSearch = false;
  isEnabling: boolean;

  destroy$ = new Subject<null>();
  locationCodes: string[] = [];
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions = [];
  locationCodeMapping: Map<string, string> = new Map<string, string>();
  schemeId: string;
  focBclDetails: any;
  dateFormat: string;
  isLoading$: Observable<boolean>;
  totalElements$: Observable<number>;
  totalCount = 0;
  mappedLocations: CourierSelectedLocations[];
  constructor(
    private router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private focbclFacade: FOCBCLFacade,
    private appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.focbclFacade.resetFOCBCLDetails();
    this.isLoading$ = this.focbclFacade.getIsLoading();
    this.totalElements$ = this.focbclFacade.getTotalElements();
    this.focbclFacade.loadFOCSchemes(FOCBCLEnum.FOC_CUSTOMER_DETAILS);
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
      });
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataFormat: string) => {
        this.dateFormat = dataFormat;
      });
    this.focbclFacade
      .getSchemeId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((schemeId: string) => {
        if (schemeId) {
          this.schemeId = schemeId;
          this.loadFOCBCLDetails();
        }
      });
    this.focbclFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.focbclFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasSaved: boolean) => {
        if (hasSaved) {
          this.loadFOCBCLDetails();
          this.locationCodes = [];
          this.showNotifications(
            'pw.focBlockingCustomerLevel.saveSuccessMessage'
          );
          this.isEnabling = false;
        }
      });

    this.focbclFacade
      .getFOCBCLDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((focBlockingDetails: FOCBlockingCustomerLevel[]) => {
        if (focBlockingDetails) {
          this.focBclDetails = [];
          for (const focBlockingCustomerDetails of focBlockingDetails) {
            this.focBclDetails.push({
              locationCode: focBlockingCustomerDetails.locationCode,
              description: focBlockingCustomerDetails.description,
              fromDate: moment(focBlockingCustomerDetails.fromDate).format(
                this.dateFormat
              ),
              focItemCode: focBlockingCustomerDetails.focItemCode,
              quantity: focBlockingCustomerDetails.quantity,
              toDate: moment(focBlockingCustomerDetails.toDate).format(
                this.dateFormat
              ),
              approvedBy: focBlockingCustomerDetails.approvedBy,
              isCMMandatory: focBlockingCustomerDetails.isCMMandatory,
              // formGroup: new FormGroup({
              //   isCMMandatory: new FormControl(
              //     focBlockingCustomerDetails.isCMMandatory
              //   )
              // }),
              remarks: focBlockingCustomerDetails.remarks,
              isActive: focBlockingCustomerDetails.isActive,
              mobileNumber: focBlockingCustomerDetails.mobileNumber,
              id: focBlockingCustomerDetails.id
            });
          }
        }
      });
    this.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalElements: number) => {
        if (totalElements !== this.totalCount) {
          this.totalCount = totalElements;
          this.focbclFacade.loadSelectedLocations({
            schemeId: this.schemeId,
            pageIndex: 0,
            pageSize: this.totalCount
          });
        }
      });
    this.focbclFacade
      .getSelectedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: CourierSelectedLocations[]) => {
        if (locations) {
          this.mappedLocations = locations;
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
  loadPaginateData($event) {
    this.initialPageEvent = $event;
    this.loadFOCBCLDetails();
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
  updateFocBlockingDetails($event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.isEnabling = true;
          this.focbclFacade.saveFOCBCLDetails({
            id: this.schemeId,
            savePayload: $event
          });
        }
      });
  }
  loadFOCBCLDetails() {
    this.focbclFacade.loadFOCBCLDetails({
      schemeId: this.schemeId,
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize
    });
  }
  search(locationCode) {
    this.focbclFacade.searchLocationCode({
      schemeId: this.schemeId,
      locationCode: locationCode
    });
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.FOC
      }
    });
    this.focbclFacade.resetFOCBCLDetails();
  }
  openLocationMapping() {
    this.locationMappingService
      .openLocationMappingWithForm({
        formType: LocationMappingFormType.FOC_BLOCKING_CUSTOMER_LEVEL,
        selectedLocations: []
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
                  this.focbclFacade.saveFOCBCLDetails({
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
                        type: FOCBCLEnum.FOC_CUSTOMER_DETAILS,
                        data: {
                          remarks: res.data.config.remarks,
                          approvedBy: res.data.config.approvedBy,
                          isCMNumber: res.data.config.isCMMandatory,
                          focItemCode: res.data.config.focItemCode,
                          quantity: res.data.config.quantity
                        }
                      },
                      mobileNo: res.data.config.mobileNo,
                      addLocations: addLocations,
                      updateLocations: [],
                      removeLocations: []
                    }
                  });
                }
              });
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
