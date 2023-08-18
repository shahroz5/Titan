import {
  LocationSummaryList,
  Lov,
  CustomErrors,
  LocationMappingServiceConfig,
  LocationMappingServiceResponse,
  SelectedLocationFilters,
  LocationMappingConfig,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  LocationFilterServiceConfig,
  LocationFilterServiceResponse,
  LocationFilterConfig,
  LocationMappingFormType,
  LocationMappingWithFormServiceResponse,
  LocationSelectionServiceResponse,
  LocationFilterOptionsInput,
  OverlayNotificationType,
  BrandSummary,
  RegionSummary,
  CountrySummary,
  TownSummary,
  StateSummary
} from '@poss-web/shared/models';

import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { takeUntil } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocationMappingPopupComponent } from './location-mapping-popup/location-mapping-popup.component';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LocationFilterPopupComponent } from './location-filter-popup/location-filter-popup.component';
import { LocationMappingWithFormPopupComponent } from './location-mapping-with-form-popup/location-mapping-with-form-popup.component';
import { LocationSelectionPopUpComponent } from './location-selection-pop-up/location-selection-pop-up.component';

@Injectable()
export class LocationMappingService
  implements LocationMappingServiceAbstraction {
  initialLocationMappingConfig: LocationMappingConfig = {
    filterConfig: {
      filterOptions: {
        brands: [],
        regions: [],
        levels: [],
        countries: [],
        states: [],
        towns: []
      },
      minFilterSelection: 1,
      selectedLocationFilters: {
        brands: [],
        regions: [],
        levels: [],
        countries: [],
        states: [],
        towns: []
      },
      setInputs: {
        setLevelsFromInput: false,
        setBrandFromInput: false,
        setRegionFromInput: false,
        setCountriesFromInput: false,
        setStatesFromInput: false,
        setTownsFromInput: false
      }
    },
    selectedLocations: null,
    isConfig: null,
    configDetails: null,
    data: null,
    isFormApplicable: true
  };

  locations: string[] = [];

  constructor(
    private dialog: MatDialog,
    private locationMappingFacade: LocationMappingFacade,
    public translateService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  public open(
    serviceConfig: LocationMappingServiceConfig
  ): EventEmitter<LocationMappingServiceResponse> {
    const destroy$ = new Subject();
    const locationMappingConfig = this.initialLocationMappingConfig;

    const config = {
      ...locationMappingConfig,
      selectedLocations: serviceConfig.selectedLocations,
      template: serviceConfig.template,
      isConfig: !!serviceConfig.isConfig,
      configDetails: serviceConfig.configDetails,
      readonly: serviceConfig.readonly
    };
    const dialogref = this.dialog.open(LocationMappingPopupComponent, {
      width: '835px',
      maxWidth: '90vw',
      autoFocus: false,
      data: config,
      disableClose: true
    });
    const event = new EventEmitter<LocationMappingServiceResponse>();

    const componentInstance = dialogref.componentInstance;

    this.commonDataFetch(
      componentInstance,
      locationMappingConfig.filterConfig,
      destroy$,
      serviceConfig.filterOptions
    );

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: LocationMappingServiceResponse) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }

  public openLocationMappingWithForm(data: {
    formType: LocationMappingFormType;
    selectedLocations?: { id: string; description: string }[];
    readonly?: boolean;
    data?: any;
    isFormApplicable?: any;
    filterOptions?: LocationFilterOptionsInput;
    formLabel?: string;
  }): EventEmitter<LocationMappingWithFormServiceResponse> {
    const destroy$ = new Subject();
    const locationMappingConfig = this.initialLocationMappingConfig;

    const config = {
      ...locationMappingConfig,
      formType: data.formType,
      selectedLocations: data.selectedLocations ? data.selectedLocations : [],
      readonly: data.readonly,
      data: data.data,
      isFormApplicable:
        data.isFormApplicable !== undefined ? data.isFormApplicable : true,
      formLabel: data?.formLabel
    };
    const dialogref = this.dialog.open(LocationMappingWithFormPopupComponent, {
      width: '835px',
      maxWidth: '90vw',
      autoFocus: false,
      data: config,
      disableClose: true
    });
    const event = new EventEmitter<LocationMappingWithFormServiceResponse>();

    const componentInstance = dialogref.componentInstance;

    this.commonDataFetch(
      componentInstance,
      locationMappingConfig.filterConfig,
      destroy$,
      data.filterOptions
    );

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: LocationMappingWithFormServiceResponse) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }

  public openLocationSelectionPopUp(): EventEmitter<
    LocationSelectionServiceResponse
  > {
    const destroy$ = new Subject();
    const locationMappingConfig = this.initialLocationMappingConfig;
    const dialogref = this.dialog.open(LocationSelectionPopUpComponent, {
      width: '835px',
      maxWidth: '90vw',
      autoFocus: false,
      data: {},
      disableClose: true
    });
    const event = new EventEmitter<LocationSelectionServiceResponse>();

    const componentInstance = dialogref.componentInstance;

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: LocationSelectionServiceResponse) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }

  public openFilter(
    serviceConfig: LocationFilterServiceConfig
  ): EventEmitter<LocationFilterServiceResponse> {
    const destroy$ = new Subject();

    const filterConfig = this.initialLocationMappingConfig.filterConfig;
    const config = {
      ...filterConfig,
      minFilterSelection: 0,
      selectedLocationFilters: serviceConfig.selectedLocationFilters
    };

    const dialogref = this.dialog.open(LocationFilterPopupComponent, {
      autoFocus: false,
      data: config
    });

    this.commonDataFetch(dialogref.componentInstance, filterConfig, destroy$);

    const event = new EventEmitter<LocationFilterServiceResponse>();

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((response: LocationFilterServiceResponse) => {
        event.emit(response);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }

  commonDataFetch(
    componentInstance:
      | LocationFilterPopupComponent
      | LocationMappingPopupComponent
      | LocationMappingWithFormPopupComponent,
    locationFilterConfig: LocationFilterConfig,
    destroy$: Subject<any>,
    filterOptions?: LocationFilterOptionsInput
  ) {
    this.locationMappingFacade.clear();

    this.locationMappingFacade
      .getError()
      .pipe(takeUntil(destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error, destroy$);
        }
      });

    if (filterOptions?.brands?.length) {
      locationFilterConfig.filterOptions.brands = filterOptions?.brands;
      locationFilterConfig.setInputs.setBrandFromInput = true;
    } else {
      this.locationMappingFacade.loadBrands();

      this.locationMappingFacade
        .getBrands()
        .pipe(takeUntil(destroy$))
        .subscribe((brands: BrandSummary[]) => {
          locationFilterConfig.filterOptions.brands = brands.map(brand => ({
            id: brand.brandCode,
            description: brand.brandCode
          }));

          if (locationFilterConfig?.filterOptions?.brands?.length) {
            componentInstance.setDefaultBrand(
              locationFilterConfig.filterOptions.brands[0]
            );
          }
        });
    }

    if (filterOptions?.regions?.length) {
      locationFilterConfig.filterOptions.regions = filterOptions?.regions;
      locationFilterConfig.setInputs.setRegionFromInput = true;
    } else {
      this.locationMappingFacade.loadRegions();

      this.locationMappingFacade
        .getRegions()
        .pipe(takeUntil(destroy$))
        .subscribe((regions: RegionSummary[]) => {
          locationFilterConfig.filterOptions.regions = regions.map(region => ({
            id: region.regionCode,
            description: region.regionCode
          }));
        });
    }
    if (filterOptions?.levels?.length) {
      locationFilterConfig.filterOptions.levels = filterOptions?.levels.sort(
        (level1, level2) =>
          level1.description.toLocaleLowerCase() >
          level2.description.toLocaleLowerCase()
            ? 1
            : -1
      );
      locationFilterConfig.setInputs.setLevelsFromInput = true;
    } else {
      this.locationMappingFacade.loadLevels();

      this.locationMappingFacade
        .getLevels()
        .pipe(takeUntil(destroy$))
        .subscribe((levels: Lov[]) => {
          locationFilterConfig.filterOptions.levels = levels
            .map(level => ({
              id: level.code,
              description: level.code
            }))
            .sort((level1, level2) =>
              level1.description.toLocaleLowerCase() >
              level2.description.toLocaleLowerCase()
                ? 1
                : -1
            );
        });
    }

    if (filterOptions?.countries?.length) {
      locationFilterConfig.setInputs.setCountriesFromInput = true;
      locationFilterConfig.setInputs.countryData = filterOptions.countries;
    } else {
      this.locationMappingFacade.loadCountries();
      this.locationMappingFacade
        .getCountries()
        .pipe(takeUntil(destroy$))
        .subscribe((countries: CountrySummary[]) => {
          locationFilterConfig.filterOptions.countries = countries.map(
            country => ({
              value: '' + country.countryCode,
              description: country.description
            })
          );

          if (locationFilterConfig?.filterOptions?.countries?.length) {
            componentInstance.setDefaultCountry(
              locationFilterConfig.filterOptions.countries[0]
            );
          }
        });
    }

    this.locationMappingFacade
      .getStates()
      .pipe(takeUntil(destroy$))
      .subscribe((states: StateSummary[]) => {
        locationFilterConfig.filterOptions.states = states
          .map(state => ({
            value: '' + state.stateId,
            description: state.description
          }))
          .sort((state1, state2) =>
            state1.description.toLocaleLowerCase() >
            state2.description.toLocaleLowerCase()
              ? 1
              : -1
          );
      });

    this.locationMappingFacade
      .getTowns()
      .pipe(takeUntil(destroy$))
      .subscribe((towns: TownSummary[]) => {
        locationFilterConfig.filterOptions.towns = towns.map(town => ({
          id: '' + town.townCode,
          description: town.description
        }));
      });

    componentInstance.loadStates
      .pipe(takeUntil(destroy$))
      .subscribe((data: { countryCode: string; regionCodes: string[] }) => {
        this.locationMappingFacade.loadStates(data);
      });

    componentInstance.loadTowns
      .pipe(takeUntil(destroy$))
      .subscribe((stateCode: string) => {
        this.locationMappingFacade.loadTowns(stateCode);
      });

    componentInstance.filter
      .pipe(takeUntil(destroy$))
      .subscribe((response: SelectedLocationFilters) => {
        this.locationMappingFacade.searchLocations(response);
      });

    this.locationMappingFacade
      .getLocations()
      .pipe(takeUntil(destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        componentInstance.setLocations(
          locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode
          }))
        );
      });
  }

  errorHandler(error: CustomErrors, destroy$: Subject<any>) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(destroy$))
      .subscribe();
  }
}
