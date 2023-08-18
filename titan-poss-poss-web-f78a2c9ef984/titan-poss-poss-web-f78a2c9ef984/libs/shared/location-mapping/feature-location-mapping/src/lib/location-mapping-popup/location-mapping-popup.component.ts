import { Subject } from 'rxjs';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import {
  LocationMappingConfig,
  SelectedLocationFilters,
  SelectableLocation,
  LocationMappingOption,
  ActiveConfig,
  SelectableActiveConfig,
  LocationMappingApplyResponse,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  LocationFilterOption,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  SelectDropDownOption
} from '@poss-web/shared/models';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { takeUntil } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { LocationFilterComponent } from '../location-filter/location-filter.component';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { TranslateService } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poss-web-location-mapping-popup',
  templateUrl: './location-mapping-popup.component.html',
  styleUrls: ['./location-mapping-popup.component.scss']
})
export class LocationMappingPopupComponent implements OnInit, OnDestroy {
  @Output() filter = new EventEmitter<SelectedLocationFilters>();
  @Output() loadStates = new EventEmitter<{
    countryCode: string;
    regionCodes: string[];
  }>();
  @Output() loadTowns = new EventEmitter<string>();
  @ViewChild('activeConfigExpansionPanel')
  activeConfigExpansionPanel: MatExpansionPanel;

  @ViewChild('selectedExpansionPanel')
  selectedExpansionPanel: MatExpansionPanel;

  @ViewChild('virtualScrollNewLocation')
  virtualScrollNewLocation: CdkVirtualScrollViewport;

  @ViewChild('virtualScrollConfigs')
  virtualScrollConfigs: CdkVirtualScrollViewport;

  @ViewChild('virtualScrollSelectedLocation')
  virtualScrollSelectedLocation: CdkVirtualScrollViewport;

  @ViewChild(LocationFilterComponent)
  locationFilterComponent: LocationFilterComponent;

  prevSelectedLocations: LocationMappingOption[] = [];
  locationResults: SelectableLocation[] = [];
  filterLocationResults: SelectableLocation[] = [];
  selectedLocations: SelectableLocation[] = [];

  selectAllOfSearchTab = false;
  selectAllOfActiveConfig = false;
  selectAllOfSelectedTab = false;
  destroy$ = new Subject();
  showSelectFilterMessage = true;

  itemSize = 44; //in Px
  minBufferPx = 8 * this.itemSize;
  maxBufferPx = 10 * this.itemSize;
  activeConfigs: SelectableActiveConfig[] = [];
  isConfig: boolean;

  showLocationResult = false;
  noDataFoundMessageLocations;
  noDataFoundMessageSelectedLocations;
  noDataFoundMessageActiveConfig;

  readonly = false;

  hasChange = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: LocationMappingConfig,
    private dialogRef: MatDialogRef<LocationMappingPopupComponent>,
    private cdr: ChangeDetectorRef,
    private locationMappingFacade: LocationMappingFacade,
    private dialog: MatDialog,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.isConfig = !!this.config.isConfig;
    this.readonly = !!this.config.readonly;
    this.translate
      .get(['pw.entity.locationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.locationEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageLocations =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });

    this.translate
      .get(['pw.entity.selectedLocationEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.selectedLocationEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageSelectedLocations =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });

    this.translate
      .get(['pw.entity.activeConfigEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.activeConfigEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageActiveConfig =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    if (this.isConfig) {
      this.locationMappingFacade.loadMappedLocations({
        ruleID: this.config.configDetails.configId,
        ruleType: this.config.configDetails.configType
      });
      this.locationMappingFacade
        .getUpdateStatus()
        .pipe(takeUntil(this.destroy$))
        .subscribe(status => {
          if (status) {
            this.dialogRef.close();
            this.showSuccessMessageNotification();
          }
        });

      this.locationMappingFacade
        .getMappedLocations()
        .pipe(takeUntil(this.destroy$))
        .subscribe(locations => {
          if (locations) {
            this.setMappedLocations(locations);
          }
        });

      this.locationMappingFacade
        .getActiveConfigs()
        .pipe(takeUntil(this.destroy$))
        .subscribe((activeConfigs: ActiveConfig[]) => {
          this.selectAllOfActiveConfig = false;

          this.activeConfigs = activeConfigs
            .map(config => ({
              ...config,
              isSelected: false
            }))
            .sort((config1, config2) =>
              config1.locationCode.toLocaleLowerCase() >
              config2.locationCode.toLocaleLowerCase()
                ? 1
                : -1
            );

          this.locationResults = this.getArrayDifference(
            this.filterLocationResults,
            this.activeConfigs.map(location => ({
              id: location.locationCode,
              description: location.locationCode
            }))
          ).map(location => ({
            id: location.id,
            description: location.description,
            isSelected: false
          }));

          if (this.activeConfigs.length && this.activeConfigExpansionPanel) {
            this.activeConfigExpansionPanel.open();
          }
          this.showLocationResult = true;
          this.scrollToTop('config');
          this.cdr.markForCheck();
        });
    } else {
      this.setMappedLocations(this.config.selectedLocations);
    }
  }

  setDefaultBrand(brand: LocationFilterOption) {
    this.locationFilterComponent?.setDefaultBrand(brand);
  }

  setDefaultCountry(country: SelectDropDownOption) {
    this.locationFilterComponent?.setDefaultCountry(country);
  }

  setMappedLocations(selectedLocations: LocationMappingOption[]) {
    this.prevSelectedLocations = selectedLocations;
    this.selectedLocations = selectedLocations
      .map(location => ({
        id: location.id,
        description: location.description,
        isSelected: false
      }))
      .sort((location1, location2) =>
        location1.description.toLocaleLowerCase() >
        location2.description.toLocaleLowerCase()
          ? 1
          : -1
      );
    this.cdr.markForCheck();
  }

  setLocations(data: LocationMappingOption[]) {
    this.selectAllOfSearchTab = false;

    if (!this.isConfig) {
      this.locationResults = this.getArrayDifference(
        data,
        this.selectedLocations
      ).map(location => ({
        id: location.id,
        description: location.description,
        isSelected: false
      }));
      this.showLocationResult = true;
    } else {
      this.locationResults = [];
      this.activeConfigs = [];
      this.filterLocationResults = this.getArrayDifference(
        data,
        this.selectedLocations
      ).map(location => ({
        id: location.id,
        description: location.description,
        isSelected: false
      }));
      this.showLocationResult = false;
      if (this.filterLocationResults.length) {
        this.checkActiveConfig();
        this.showLocationResult = false;
      } else {
        this.showLocationResult = true;
      }
    }
    this.cdr.markForCheck();
  }

  clearFilter() {
    this.locationResults = [];
    this.filterLocationResults = [];
    this.showSelectFilterMessage = true;
    this.showLocationResult = false;
    this.activeConfigs = [];
  }

  searchLocations(data: SelectedLocationFilters) {
    this.showLocationResult = false;
    this.showSelectFilterMessage = false;
    this.filter.emit(data);
    this.scrollToTop('new');
  }

  selectAll(type: string, isSelected) {
    if (type === 'new') {
      this.locationResults = this.locationResults.map(location => ({
        ...location,
        isSelected: isSelected
      }));
    } else if (type === 'selected') {
      this.selectedLocations = this.selectedLocations.map(location => ({
        ...location,
        isSelected: isSelected
      }));
    } else if (type === 'config') {
      this.hasChange = true;

      this.activeConfigs = this.activeConfigs.map(config => ({
        ...config,
        isSelected: isSelected
      }));
    }
  }
  selectionChangeConfig(config: SelectableActiveConfig, isSelelected: boolean) {
    this.hasChange = true;
    if (config.isSelected !== isSelelected) {
      config.isSelected = isSelelected;
    }
    this.selectAllOfActiveConfig =
      this.activeConfigs.length ===
      this.activeConfigs.filter(configData => configData.isSelected).length;
  }

  selectionChange(
    location: SelectableLocation,
    isSelelected: boolean,
    type: string
  ) {
    if (!this.readonly) {
      if (location.isSelected !== isSelelected) {
        location.isSelected = isSelelected;
      }
      if (type === 'new') {
        this.selectAllOfSearchTab =
          this.locationResults.length ===
          this.locationResults.filter(locationData => locationData.isSelected)
            .length;
      } else if (type === 'selected') {
        this.selectAllOfSelectedTab =
          this.selectedLocations.length ===
          this.selectedLocations.filter(locationData => locationData.isSelected)
            .length;
      }
    }
  }

  updateSelectedLocations(type: string) {
    this.hasChange = true;
    if (type === 'new') {
      if (this.locationResults.filter(data => data.isSelected).length) {
        const selectedLocationsId = this.selectedLocations.map(
          location => location.id
        );
        this.selectedLocations = this.selectedLocations
          .concat(
            this.locationResults.filter(
              data => data.isSelected && !selectedLocationsId.includes(data.id)
            )
          )
          .map(location => ({
            ...location,
            isSelected: false
          }))
          .sort((location1, location2) =>
            location1.description.toLocaleLowerCase() >
            location2.description.toLocaleLowerCase()
              ? 1
              : -1
          );
        this.locationResults = this.locationResults
          .filter(location => !location.isSelected)
          .map(data => ({
            ...data,
            isSelected: false
          }));
        if (
          this.locationResults.length === 0 &&
          this.activeConfigs.length === 0 &&
          this.locationFilterComponent
        ) {
          this.locationFilterComponent.clearFilter();
        }

        if (this.selectedExpansionPanel) {
          this.selectedExpansionPanel.open();
        }
        this.selectAllOfSelectedTab = false;
        this.selectAllOfSearchTab = false;
      }
    } else if (type === 'selected') {
      this.selectAllOfSelectedTab = false;
      this.selectedLocations = this.selectedLocations.filter(
        data => !data.isSelected
      );
    }
    this.cdr.markForCheck();
  }

  createResponse(): LocationMappingApplyResponse {
    const selectedLocations = this.mapToLocationOptions(this.selectedLocations);
    let overwriteLocations = [];

    if (this.isConfig) {
      const selectedConfigLocationCodes = this.activeConfigs
        .filter(config => config.isSelected)
        .map(config => config.locationCode);

      overwriteLocations = this.filterLocationResults.filter(location =>
        selectedConfigLocationCodes.includes(location.id)
      );
    }

    return {
      selectedLocations: selectedLocations,
      addedLocations: this.getArrayDifference(
        selectedLocations,
        this.prevSelectedLocations
      ),
      removedLocations: this.getArrayDifference(
        this.prevSelectedLocations,
        selectedLocations
      ),
      overwriteLocations: overwriteLocations
    };
  }

  applyLocations() {
    const response = this.createResponse();
    if (!this.config.isConfig) {
      this.dialogRef.close({
        type: 'apply',
        data: response
      });
    } else {
      this.updateLocationMappingForConfig(response);
    }
  }

  updateLocationMappingForConfig(data: LocationMappingApplyResponse) {
    if (data.overwriteLocations.length) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.locationMapping.overwritConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.updateLocationMapping(data);
          }
        });
    } else {
      this.updateLocationMapping(data);
    }
  }

  updateLocationMapping(data: LocationMappingApplyResponse) {
    this.showProgressNotification();

    this.locationMappingFacade.updateLocationMapping({
      ruleID: this.config.configDetails.configId,
      ruleType: this.config.configDetails.configType,
      data: {
        addLocations: data.addedLocations.map(loc => loc.id),
        overwriteLocations: data.overwriteLocations.map(loc => loc.id),
        removeLocations: data.removedLocations.map(loc => loc.id)
      }
    });
  }

  checkActiveConfig() {
    this.locationMappingFacade.loadActiveConfigs({
      ruleType: this.config.configDetails.configType,
      data: {
        excludeRuleId: this.config.configDetails.configId,
        includeLocations: this.filterLocationResults.map(
          location => location.id
        )
      }
    });
  }

  mapToLocationOptions(array: SelectableLocation[]): LocationMappingOption[] {
    return array.map(ele => ({
      id: ele.id,
      description: ele.description
    }));
  }

  getArrayDifference(
    array1: LocationMappingOption[],
    array2: LocationMappingOption[]
  ): LocationMappingOption[] {
    const array2Ids: string[] = array2.map(data => data.id);
    return array1.filter(ele => !array2Ids.includes(ele.id));
  }

  close() {
    this.dialogRef.close({ type: 'close' });
  }

  trackByLocation(_, location: SelectableLocation) {
    return location.description;
  }
  trackByActiveConfig(_, location: ActiveConfig) {
    return location.locationCode;
  }

  scrollToTop(type: string) {
    if (type === 'new' && this.virtualScrollNewLocation) {
      this.virtualScrollNewLocation.scrollToIndex(0);
    } else if (type === 'config' && this.virtualScrollConfigs) {
      this.virtualScrollConfigs.scrollToIndex(0);
    } else if (type === 'selected' && this.virtualScrollSelectedLocation) {
      this.virtualScrollSelectedLocation.scrollToIndex(0);
    }
  }

  showProgressNotification() {
    const key = 'pw.locationMapping.progressNotification';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.PROGRESS,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
  }

  showSuccessMessageNotification() {
    const key = 'pw.locationMapping.updateSuccessNotification';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            hasBackdrop: false
          })
          .events.pipe(takeUntil(this.destroy$));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
