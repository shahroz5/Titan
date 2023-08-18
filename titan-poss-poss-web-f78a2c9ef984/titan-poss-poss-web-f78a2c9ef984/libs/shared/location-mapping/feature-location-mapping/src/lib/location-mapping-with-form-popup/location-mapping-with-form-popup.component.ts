import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  Component,
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
  LocationMappingFormType,
  LocationMappingApplyResponse,
  LocationFilterOption,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { LocationFilterComponent } from '../location-filter/location-filter.component';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poss-web-location-mapping-with-form-popup',
  templateUrl: './location-mapping-with-form-popup.component.html',
  styleUrls: ['./location-mapping-with-form-popup.component.scss']
})
export class LocationMappingWithFormPopupComponent implements OnDestroy {
  @Output() filter = new EventEmitter<SelectedLocationFilters>();
  @Output() loadStates = new EventEmitter<{
    countryCode: string;
    regionCodes: string[];
  }>();
  @Output() loadTowns = new EventEmitter<string>();

  @ViewChild('virtualScrollNewLocation')
  virtualScrollNewLocation: CdkVirtualScrollViewport;

  @ViewChild(LocationFilterComponent)
  locationFilterComponent: LocationFilterComponent;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  locationResults: SelectableLocation[] = [];
  filterLocationResults: SelectableLocation[] = [];

  selectAllOfSearchTab = false;
  selectAllOfSelectedTab = false;

  destroy$ = new Subject();
  showSelectFilterMessage = true;

  itemSize = 44; //in Px
  minBufferPx = 8 * this.itemSize;
  maxBufferPx = 10 * this.itemSize;
  showLocationResult = false;

  selectedLocations: SelectableLocation[] = [];
  selectedLcs: any = [];

  form: FormGroup;

  locationMappingFormTypeRef = LocationMappingFormType;
  prevSelectedLocations: LocationMappingOption[] = [];
  readonly = false;
  noDataFoundMessageLocations;
  noDataFoundMessageSelectedLocations;
  addValueLabel: string;
  hasLable: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public config: LocationMappingConfig,
    private dialogRef: MatDialogRef<LocationMappingWithFormPopupComponent>,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    if (this.config?.selectedLocations.length) {
      this.setMappedLocations([]);
      this.selectedLcs = this.config?.selectedLocations;
    }
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
          .get(
            [
              'pw.global.noDataFoundMessage',
              'pw.locationMapping.addValueLabel'
            ],
            {
              entityName: entity['pw.entity.selectedLocationEntity']
            }
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageSelectedLocations =
              translatedMsg['pw.global.noDataFoundMessage'];
            this.addValueLabel =
              translatedMsg['pw.locationMapping.addValueLabel'];
          });
      });
    if (this.config.formLabel) {
      this.hasLable = true;
      this.addValueLabel = this.config.formLabel;
    } else {
      this.hasLable = false;
    }
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
  setDefaultBrand(brand: LocationFilterOption) {
    this.locationFilterComponent?.setDefaultBrand(brand);
  }

  setDefaultCountry(country: SelectDropDownOption) {
    this.locationFilterComponent?.setDefaultCountry(country);
  }

  setLocations(data: LocationMappingOption[]) {
    this.selectAllOfSearchTab = false;

    this.locationResults = this.getArrayDifference(data, this.selectedLcs).map(
      location => ({
        id: location.id,
        description: location.description,
        isSelected: false
      })
    );
    this.showLocationResult = true;

    this.cdr.markForCheck();
  }
  clearFilter() {
    this.locationResults = [];
    this.filterLocationResults = [];
    this.showSelectFilterMessage = true;
    this.showLocationResult = false;
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
    }
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
        if (this.locationResults.length === 0 && this.locationFilterComponent) {
          this.locationFilterComponent.clearFilter();
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

  applyLocations() {
    if (
      (!this.config.isFormApplicable && this.selectedLocations.length) ||
      (this.form?.valid && this.selectedLocations.length)
    ) {
      const locations = this.createResponse();
      this.dialogRef.close({
        type: 'apply',
        data: {
          locations,
          config: this.form?.value
        }
      });
    } else {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
    }
  }

  createResponse(): LocationMappingApplyResponse {
    const selectedLocations = this.mapToLocationOptions(this.selectedLocations);
    const overwriteLocations = [];

    return {
      selectedLocations: selectedLocations,
      addedLocations: this.getArrayDifference(
        selectedLocations,
        this.prevSelectedLocations
      ),
      removedLocations: [],
      overwriteLocations: overwriteLocations
    };
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

  scrollToTop(type: string) {
    if (type === 'new' && this.virtualScrollNewLocation) {
      this.virtualScrollNewLocation.scrollToIndex(0);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
