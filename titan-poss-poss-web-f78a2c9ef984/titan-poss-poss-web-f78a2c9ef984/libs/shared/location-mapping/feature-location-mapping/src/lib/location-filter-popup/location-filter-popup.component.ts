import { Subject } from 'rxjs';
import {
  Component,
  OnDestroy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import {
  SelectedLocationFilters,
  LocationMappingOption,
  LocationFilterConfig
} from '@poss-web/shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocationFilterComponent } from '../location-filter/location-filter.component';

@Component({
  selector: 'poss-web-location-filter-popup',
  templateUrl: './location-filter-popup.component.html',
  styleUrls: []
})
export class LocationFilterPopupComponent implements OnDestroy {
  destroy$ = new Subject();
  locationResults: LocationMappingOption[] = [];
  isApplied = false;

  selectedLocationFilters: SelectedLocationFilters;

  @Output() filter = new EventEmitter<SelectedLocationFilters>();
  @Output() loadStates = new EventEmitter<{
    countryCode: string;
    regionCodes: string[];
  }>();
  @Output() loadTowns = new EventEmitter<string>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: LocationFilterConfig,
    private dialogRef: MatDialogRef<LocationFilterPopupComponent>
  ) {}

  setDefaultBrand(_) {}

  setDefaultCountry(_) {}

  setLocations(data: LocationMappingOption[]) {
    this.locationResults = data;
    if (this.isApplied) {
      this.dialogRef.close({
        type: 'apply',
        locations: this.locationResults,
        selectedLocationFilters: this.selectedLocationFilters
      });
    }
  }

  filterLocations(data: SelectedLocationFilters) {
    this.filter.emit(data);
    this.isApplied = true;
    this.selectedLocationFilters = data;
  }
  close() {
    this.dialogRef.close({ type: 'close' });
  }
  clear() {
    this.locationResults = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
