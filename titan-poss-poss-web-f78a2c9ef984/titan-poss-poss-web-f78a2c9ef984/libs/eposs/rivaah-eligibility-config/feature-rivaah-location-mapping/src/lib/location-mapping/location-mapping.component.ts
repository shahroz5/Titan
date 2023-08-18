import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { 
  OverlayNotificationServiceAbstraction, 
  CustomErrors, 
  OverlayNotificationType } from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import * as moment from 'moment';
import { RivaahConfigurationFacade } from '@poss-web/eposs/rivaah-eligibility-config/data-access-rivaah-configuration';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MappedLocDetails, RivaahLocationList, SaveRivaahLocationsPayload } from 'libs/shared/models/src/lib/configuration/rivaah-configuration/rivaah-configuration.model';

@Component({
  selector: 'poss-web-location-mapping',
  templateUrl: './location-mapping.component.html',
})
export class LocationMappingComponent implements OnInit {
  utcOffset = moment().startOf('day').utcOffset();
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  
  locationCodes = [];
  offerStartDate = null;
  offerEndDate = null;

  pageSizeOptions: number[];
  minPageSize: number;

  pageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };
  locationPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };
  invalidSearch = false;
  isLocationData = false;
  selectedLocations: MappedLocDetails[] = [];
  mappedLocations$: Observable<RivaahLocationList[]>;
  totalLocations$: Observable<number>;
  params: string = '1';

  constructor(
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public rivaahConfigurationFacade: RivaahConfigurationFacade,
  ) { }

  ngOnInit(): void {
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.locationPageEvent.pageSize = pageSize;
      });

    this.rivaahConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.isLoading$ = this.rivaahConfigurationFacade.getIsloading();
    this.mappedLocations$ = this.rivaahConfigurationFacade.getRivaahLocationDetails();
    this.totalLocations$ = this.rivaahConfigurationFacade.getTotalRivaahLocations();

    this.componentInit();
  }

  componentInit(){
    this.clearLocationFilters();
    this.loadLocationList();

    this.rivaahConfigurationFacade
      .getIsLocationSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locationSaved => {
        if (locationSaved) {
          this.isLocationData = true;
          this.locationPageEvent = this.pageEvent;
          this.showNotifications('pw.rivaahEligibilityConfig.locationsSaveMsg');
          this.loadLocationList();
        }
      });

    this.rivaahConfigurationFacade
      .getIsLocationUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locationUpdated => {
        if (locationUpdated === true) {
          this.isLocationData = true;
          this.locationPageEvent = this.pageEvent;
          this.showNotifications('pw.rivaahEligibilityConfig.locationsUpdateMsg');
          this.loadLocationList();
        }
      });

    this.rivaahConfigurationFacade
      .getIsLocationDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locationDeleted => {
        if (locationDeleted === true) {
          this.isLocationData = true;
          this.locationPageEvent = this.pageEvent;
          this.showNotifications('pw.rivaahEligibilityConfig.locationsDeleteMsg');
          this.loadLocationList();
        }
      });
    this.rivaahConfigurationFacade
      .getSelectedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedLocations => {
        if (selectedLocations) {
          this.selectedLocations = selectedLocations;
          if (this.selectedLocations.length !== 0) {
            this.isLocationData = true;
          } else this.isLocationData = false;
        }
      });
  }
  
  mapLocations(data) {
    const addlocs = data.locations.map(l => l.id);
    const locationPayload: SaveRivaahLocationsPayload = {
      ruleId: this.params,
      payload: {
        addLocations: addlocs,
        validity: {
          offerEndDate: data.config?.offerEndDate
            ? moment(data.config.offerEndDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null,
          offerStartDate: data.config?.offerStartDate
            ? moment(data.config.offerStartDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null
        },
        removeLocations: [],
        overwriteLocations: []
      }
    };
    this.rivaahConfigurationFacade.saveRivaahLocations(locationPayload);
    // this.loadLocationList();
  }
  
  clearLocationFilters() {
    this.offerStartDate = null;
    this.offerEndDate = null;
    this.locationCodes = [];
  }

  loadLocationList(data?) {
    this.locationCodes = data?.searchValue
      ? data.searchValue
      : this.locationCodes;
    this.offerStartDate = data?.offerStartDate
      ? moment(data.offerStartDate).startOf('day').valueOf()
      : data?.clearOffer
      ? null
      : this.offerStartDate;
    this.offerEndDate = data?.offerEndDate
      ? moment(data.offerEndDate).endOf('day').valueOf()
      : data?.clearOffer
      ? null
      : this.offerEndDate;
    console.log(
      this.offerStartDate,
      this.offerEndDate,
    );

    this.invalidSearch = false;
    this.rivaahConfigurationFacade.loadRivaahLocationList({
      ruleId: this.params,
      pageSize: this.locationPageEvent.pageSize,
      pageIndex: data?.pageEvent?.pageIndex || data?.pageEvent?.pageIndex === 0
        ? data.pageEvent.pageIndex
        : this.locationPageEvent.pageIndex,
      locationCode: this.locationCodes,
      offerEndDate: this.offerEndDate,
      offerStartDate: this.offerStartDate,
    });
    this.rivaahConfigurationFacade.loadSelectedLocations({
      ruleId: this.params
    });
  }

  clearLocationList(data) {
    this.locationCodes = [];
    this.offerStartDate = data?.offerStartDate
      ? moment(data.offerStartDate).startOf('day').valueOf()
      : data?.clearOffer
      ? null
      : this.offerStartDate;
    this.offerEndDate = data?.offerEndDate
      ? moment(data.offerEndDate).endOf('day').valueOf()
      : data?.clearOffer
      ? null
      : this.offerEndDate;
    this.rivaahConfigurationFacade.loadRivaahLocationList({
      ruleId: this.params,
      pageSize: data.pageEvent.pageSize,
      pageIndex: data.pageEvent.pageIndex,
      locationCode: [],
      offerEndDate: this.offerEndDate,
      offerStartDate: this.offerStartDate,
    });
    this.rivaahConfigurationFacade.loadSelectedLocations({
      ruleId: this.params
    });
  }

  editLocations(data) {
    this.rivaahConfigurationFacade.updateRivaahLocations({
      ruleId: this.params,
      payload: { overwriteLocations: [data.locationCode] }
    });
  }

  updateLocationValue(data) {
    this.rivaahConfigurationFacade.updateRivaahLocations({
      ruleId: this.params,
      payload: {
        overwriteLocations: data.locationCode
      }
    });
  }

  deleteLocations(data) {
    this.rivaahConfigurationFacade.deleteRivaahLocations({
      ruleId: this.params,
      payload: { removeLocations: data }
    });
  }

  updateLocationDateRange(data) {
    this.rivaahConfigurationFacade.updateRivaahLocations({
      ruleId: this.params,
      payload: {
        validity: {
          offerStartDate: data.dateRange.offerStartDate
            ? moment(data.dateRange.offerStartDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null,
          offerEndDate: data.dateRange.offerEndDate
            ? moment(data.dateRange.offerEndDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null,
        },
        overwriteLocations: data.locationCode
      }
    });
  }

  paginate(pageEvent: PageEvent) {
    this.locationPageEvent = pageEvent;
    this.loadLocationList();
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    })
  }

  showNotifications(key) {
    this.translate
      .get([key])
      .pipe(take(1))
      .subscribe((translatedMessages: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessages[key],
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
  
  ngOnDestroy(): void {
    this.overlayNotification.close();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
