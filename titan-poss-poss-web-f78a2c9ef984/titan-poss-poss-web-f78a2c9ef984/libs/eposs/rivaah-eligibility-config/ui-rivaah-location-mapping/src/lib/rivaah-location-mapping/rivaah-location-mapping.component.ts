import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { MatDialog } from '@angular/material/dialog';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  LocationMappingFormType,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectedLocationFilters
} from '@poss-web/shared/models';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import * as moment from 'moment';
import { Moment } from 'moment';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  DeleteAllRowsComponent,
  DeleteRowComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { LocationDateRangeComponent } from '../location-date-range/location-date-range.component';
import { getMatIconFailedToSanitizeUrlError } from '@angular/material/icon';

@Component({
  selector: 'poss-web-rivaah-location-mapping',
  templateUrl: './rivaah-location-mapping.component.html',
  styleUrls: ['./rivaah-location-mapping.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RivaahLocationMappingComponent 
implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() mappedLocation;
  @Input() levels: [] = [];
  @Output() paginator = new EventEmitter<PageEvent>();
  isfilterApplied = false;
  isPreviewApplicable = false;
  isDateRangeApplicable = true;

  @Input() allSelectedLocations: {
    id: string;
    description: string;
  }[] = [];

  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize;

  @Output() loadData = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  @Output() emitLocationFilterEvent = new EventEmitter<any>();
  @Output() edit = new EventEmitter<{
    locationCode: string[];
    dateRange: {
      offerStartDate: Moment;
      offerEndDate: Moment;
    };
  }>();
  @Output() activate = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  columnDefs = [];
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;
  hasSelectedRow = false;
  selectedConfigs: any[] = [];

  filterForm = new FormGroup({
    searchValue: new FormControl(),
    offerStartDate: new FormControl(),
    offerEndDate: new FormControl()
  });

  currentDate = moment();
  component: RivaahLocationMappingComponent = this;

  destroy$ = new Subject<null>();

  searchValue: any;
  offerStartDate: Moment;
  offerEndDate: Moment;
  rowData: any;
  locationMappingComponent: any;

  defaultColDef = {
    suppressMovable: true
  };
  columnApi: any;
  rows: { locationCode: string; code: string }[];
  dupLocation = false;
  selectedLocationFilters: SelectedLocationFilters = {
    brands: [],
    regions: [],
    levels: [],
    countries: [],
    states: [],
    towns: []
  };
  filteredLocs = [];
  locationCode: any;
  rowIndex: any;
  rowNode: any;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private locationMappingService: LocationMappingServiceAbstraction,
    private dialog: MatDialog,
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService
  ) {}
  ngOnInit() {
    this.translate
      .get([
        'pw.discountLocationMapping.locationCodeLabel',
        'pw.discountLocationMapping.locationName',
        'pw.discountLocationMapping.subBrandLabel',
        'pw.discountLocationMapping.offerStartDateLabel',
        'pw.discountLocationMapping.offerEndDateLabel',
        'pw.discountLocationMapping.statusLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            minWidth: 35,
            width: 40,
            pinned: 'left',
            lockPinned: true
          },
          {
            headerName:
              translatedMsg['pw.discountLocationMapping.locationCodeLabel'],
            field: 'locationCode',
            suppressMovable: true,
            width: 100,
            pinned: 'left',
            lockPinned: true,
            resizable: true
          },
          {
            headerName:
              translatedMsg['pw.discountLocationMapping.locationName'],
            field: 'description',
            suppressMovable: true,
            flex: 1,
            resizable: true
          },
          {
            headerName:
              translatedMsg['pw.discountLocationMapping.subBrandLabel'],
            field: 'subBrandCode',
            suppressMovable: true,
            resizable: true,
            width: 150
          },
          {
            headerName:
              translatedMsg['pw.discountLocationMapping.offerStartDateLabel'],
            field: 'offerStartDate',
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            },
            width: 140,
            resizable: true,
            hide: !this.isDateRangeApplicable
          },
          {
            headerName:
              translatedMsg['pw.discountLocationMapping.offerEndDateLabel'],
            field: 'offerEndDate',
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            },
            width: 140,
            resizable: true,
            hide: !this.isDateRangeApplicable
          },
          {
            headerComponent: 'deleteAllRowsRenderer',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width'
          }
        ];
      });
    this.filterForm
      .get('offerStartDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((date: Moment) => {
        if (this.dateCompare(date, this.offerStartDate)) {
          this.offerStartDate = date;
        }
      });
    this.filterForm
      .get('offerEndDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        if (this.dateCompare(date, this.offerEndDate)) {
          this.offerEndDate = date;
          this.pageEvent.pageIndex = 0;
          this.loadMappedLocation();
        }
      });
    this.filterForm
      .get('offerStartDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.filterForm.get('offerEndDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mappedLocation']) {
      this.rowData = [];
      console.log(this.mappedLocation, 'mapped locs');

      this.mappedLocation?.forEach(row => {
        this.rowData.push({
          description: row.description ? row.description : '',
          id: row.id ? row.id : '',
          locationCode: row.locationCode ? row.locationCode : '',
          offerEndDate: row.offerEndDate ? moment(row.offerEndDate) : '',
          offerStartDate: row.offerStartDate ? moment(row.offerStartDate) : '',
          subBrandCode: row.subBrandCode ? row.subBrandCode : ''
        });
      });
    }
  }
  
  checkFilter(res) {
    if (
      !res.selectedLocationFilters.brands.length &&
      !res.selectedLocationFilters.regions.length &&
      !res.selectedLocationFilters.levels.length &&
      !res.selectedLocationFilters.countries.length &&
      !res.selectedLocationFilters.states.length &&
      !res.selectedLocationFilters.towns.length
    ) {
      this.isfilterApplied = false;
    } else this.isfilterApplied = true;
  }

  OpenLocationFilter() {
    {
      this.locationMappingService
        .openFilter({
          selectedLocationFilters: this.selectedLocationFilters
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          if (res) {
            this.checkFilter(res);
            if (res.type === 'apply' && res.locations.length) {
              this.selectedLocationFilters = res.selectedLocationFilters;
              this.filteredLocs = res.locations.map(l => l.id);
              this.loadData.emit({
                searchValue: res.locations.map(l => l.id),
                offerStartDate: this.offerStartDate,
                offerEndDate: this.offerEndDate,
                pageEvent: this.pageEvent,
                filterApplied: this.isfilterApplied
              });

            } else {
              this.selectedLocationFilters = res.selectedLocationFilters;
            }
          }
        });
    }
  }

  showMessage(key: string) {
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

  dateCompare(date1: Moment, date2: Moment) {
    return moment(date1)?.valueOf() !== moment(date2)?.valueOf();
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.filterForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  getRowNodeId(data: any) {
    return data.locationCode;
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  search(searchValue: string) {
    this.searchValue = [searchValue.toUpperCase()];
    this.pageEvent = { ...this.pageEvent, pageIndex: 0 };
    this.loadMappedLocation();
  }

  clearSearch() {
    this.filterForm.get('searchValue').reset();
    console.log(this.filteredLocs);
    this.searchValue = this.filteredLocs.length ? this.filteredLocs : null;
    this.pageEvent = { ...this.pageEvent, pageIndex: 0 };
    this.clear.emit({
      searchValue: this.searchValue,
      offerStartDate: this.offerStartDate,
      offerEndDate: this.offerEndDate,
      pageEvent: this.pageEvent
    });
  }

  clearOfferRange() {
    this.filterForm.get('offerStartDate').reset();
    this.filterForm.get('offerEndDate').reset();
    this.offerStartDate = null;
    this.offerEndDate = null;
    this.clear.emit({
      searchValue: this.searchValue,
      offerStartDate: this.offerStartDate,
      offerEndDate: this.offerEndDate,
      pageEvent: this.pageEvent,
      clearOffer: true
    });
  }

  loadMappedLocation() {
    this.loadData.emit({
      searchValue: this.searchValue,
      offerStartDate: this.offerStartDate,
      offerEndDate: this.offerEndDate,
      pageEvent: this.pageEvent
    });
  }

  openLocationMapping() {
    this.locationMappingService
      .openLocationMappingWithForm({
        formType: LocationMappingFormType.DISCOUNT,
        data: this.isPreviewApplicable,
        isFormApplicable: this.isDateRangeApplicable,
        filterOptions: {
          levels: []
        },
        selectedLocations: this.allSelectedLocations
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          if (res?.data?.locations?.addedLocations?.length) {
            this.add.emit({
              locations: res.data.locations.addedLocations,
              config: res.data.config
            });
          }
        }

        if (res?.data?.locations?.removedLocations?.length) {
          this.delete.emit(
            res.data.locations.removedLocations.map(l => l.id)
          );
        }
      });
    
  }

  editDateRange() {
    let dateRange;
    const freq = {};
    for (const row of this.selectedConfigs) {
      if (freq.hasOwnProperty(row.locationCode)) {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.INFO,
          message: 'Same locations cannot be edited.'
        });
        this.dupLocation = true;
      } else {
        freq[row.locationCode] = row;
      }
    }

    if (this.selectedConfigs.length === 1) {
      dateRange = this.selectedConfigs[0];
    }
    if (!this.dupLocation) {
      this.dialog
        .open(LocationDateRangeComponent, {
          width: '400px',
          autoFocus: false,
          disableClose: true,
          data: {
            dateRange: dateRange,
          }
        })
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.edit.emit({
              locationCode: this.selectedConfigs.map(data => data.locationCode),
              dateRange: res
            });
            //this.filterForm.reset();
            this.dupLocation = false;
            this.hasSelectedRow = false;
          }
        });
    }
  }

  selectionChange(locationCode, status) {
    this.locationCode = locationCode;
    this.activate.emit({ locationCode, status });
    //this.filterForm.reset();
  }

  getRowIndex(rowIndex) {
    this.rowIndex = rowIndex;
    this.rowNode = this.api.getRowNode(this.rowIndex);
  }

  selectionChanged(grid) {
    if (grid.api.getSelectedRows().length) {
      this.hasSelectedRow = true;
      this.selectedConfigs = grid.api.getSelectedRows();
    } else {
      this.hasSelectedRow = false;
      this.selectedConfigs = [];
    }
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent,
      deleteAllRowsRenderer: DeleteAllRowsComponent
    };
  }

  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (
      keyPressed === 'Enter' &&
      event.colDef.cellRenderer === 'deleteRowRenderer'
    ) {
      this.openConfirmDialogForDelete(event.data.locationCode);
    }
  }

  openConfirmDialogForDelete(data: any) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.discountLocationMapping.deleteConfirmMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          //this.filterForm.reset();
          this.delete.emit([data.locationCode]);
        }
      });
  }

  openConfirmDialogForDeleteAll() {
    this.pageEvent = {
      pageIndex: 0,
      pageSize: 10,
      length: 0
    };
    if (this.api.getSelectedRows().length) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountLocationMapping.deleteAllConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.delete.emit(this.api.getSelectedRows().map(data => data.locationCode));
          }
        });
    }
  }

  getContext() {
    return {
      componentParent: this.component
    };
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (
      [
        'offerStartDate',
        'offerEndDate'
      ].some(x => x === this.currentRowField)
    )
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
