import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  LocationMappingOption,
  LocationSummaryList,
  OverlayNotificationServiceAbstraction,
  SelectableActiveConfig,
  SelectableLocation,
  SelectedLocationFilters
} from '@poss-web/shared/models';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { TranslateService } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poss-web-location-selection-pop-up',
  templateUrl: './location-selection-pop-up.component.html',
  styleUrls: ['./location-selection-pop-up.component.scss']
})
export class LocationSelectionPopUpComponent implements OnInit {
  @Output() filter = new EventEmitter<SelectedLocationFilters>();

  @ViewChild('virtualScrollNewLocation')
  virtualScrollNewLocation: CdkVirtualScrollViewport;

  locationResults: any[] = [];

  selectAllOfSearchTab: any;

  destroy$ = new Subject();

  itemSize = 44; //in Px
  minBufferPx = 8 * this.itemSize;
  maxBufferPx = 10 * this.itemSize;
  activeConfigs: SelectableActiveConfig[] = [];
  isConfig: boolean;

  showLocationResult = false;

  selectedLocations: SelectableLocation[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public configData: any,
    private dialogRef: MatDialogRef<LocationSelectionPopUpComponent>,
    private cdr: ChangeDetectorRef,
    private locationMappingFacade: LocationMappingFacade,
    private dialog: MatDialog,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.locationMappingFacade.clear();
    // this.locationMappingFacade.loadBrands();
    // this.locationMappingFacade.loadRegions();
    // this.locationMappingFacade.loadLevels();
    // this.locationMappingFacade.loadCountries();
    this.locationMappingFacade.searchLocations(null);
    this.locationMappingFacade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        if (locations.length > 0) {
          this.locationResults = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode,
            isSelected: false
          }));
          this.cdr.markForCheck();
        }
      });
  }

  setLocationResults(data: LocationMappingOption[]) {
    this.locationResults = [...data];
  }

  selectAll(type: string, isSelected) {
    if (type === 'new') {
      this.locationResults = this.locationResults.map(location => ({
        ...location,
        isSelected: isSelected
      }));
    }
  }
  scrollToTop(type: string) {
    if (type === 'new' && this.virtualScrollNewLocation) {
      this.virtualScrollNewLocation.scrollToIndex(0);
    }
  }

  trackByLocation(_, location: SelectableLocation) {
    return location.description;
  }

  updateSelectedLocations(type: string) {
    if (this.locationResults.filter(data => data.isSelected).length) {
      this.selectedLocations = [];
      this.selectedLocations = this.selectedLocations
        .concat(this.locationResults.filter(data => data.isSelected))
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
    }
    let selectedLocationsCode = [];
    this.selectedLocations.forEach((selectedLocation: SelectableLocation) => {
      selectedLocationsCode.push(selectedLocation.id);
    });
    this.dialogRef.close({
      data: {
        selectedLocations: selectedLocationsCode
      }
    });
  }

  selectionChange(
    location: SelectableLocation,
    isSelelected: boolean,
    type: string
  ) {
    if (location.isSelected !== isSelelected) {
      location.isSelected = isSelelected;
    }
    if (type === 'new') {
      this.selectAllOfSearchTab =
        this.locationResults.length ===
        this.locationResults.filter(locationData => locationData.isSelected)
          .length;
    }
  }

  close() {
    this.dialogRef.close('Closed');
  }
}
