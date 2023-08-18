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
  CheckboxCellComponent,
  DeleteAllRowsComponent,
  DeleteRowComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { ConfigDetailsComponent } from '../config-details/config-details.component';

@Component({
  selector: 'poss-web-emp-discount-location',
  templateUrl: './emp-discount-location.component.html',
  styleUrls: ['./emp-discount-location.component.scss']
})
export class EmpDiscountLocationComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() mappedLocation;
  @Input() levels: [] = [];
  @Output() paginator = new EventEmitter<PageEvent>();

  @Input() allSelectedLocations: {
    id: string;
    description: string;
  }[] = [];

  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize;
  @Input() discountDetails;

  @Output() loadLocationList = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  @Output() emitLocationFilterEvent = new EventEmitter<any>();
  @Output() edit = new EventEmitter<{
    id: string[];
    configDetails: {};
  }>();
  @Output() activate = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  defaultColDef = {
    flex: 1,
    minWidth: 100
  };
  columnDefs = [];
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;
  hasSelectedRow = false;
  selectedConfigs: any[] = [];
  dupLocation = false;

  filterForm = new FormGroup({
    searchValue: new FormControl()
  });

  currentDate = moment();
  component: EmpDiscountLocationComponent = this;

  destroy$ = new Subject<null>();

  searchValue: any;
  offerStartDate: Moment;
  offerEndDate: Moment;
  previewStartDate: Moment;
  previewEndDate: Moment;
  rowData: any;
  isfilterApplied = false;
  selectedLocationFilters: SelectedLocationFilters = {
    brands: [],
    regions: [],
    levels: [],
    countries: [],
    states: [],
    towns: []
  };
  filteredLocs;
  constructor(
    private locationMappingService: LocationMappingServiceAbstraction,
    private dialog: MatDialog,
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.columnDefs = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        minWidth: 35,
        width: 40,
        pinned: 'left'
      },

      {
        headerName: 'Loc. Code',
        field: 'locationCode',
        minWidth: 70,
        suppressMovable: true
      },
      {
        headerName: 'Description',
        field: 'description',
        minWidth: 190,
        suppressMovable: true
      },
      {
        headerName: 'SubBrand',
        field: 'subBrandCode',
        suppressMovable: true
      },

      {
        headerName: 'Q1 ',
        cellRendererFramework: CheckboxCellComponent,

        field: 'q1Enable',
        minWidth: 35,
        width: 40
      },
      {
        headerName: 'Q1 Value',

        field: 'q1Value'
      },
      {
        headerName: 'Q2',
        cellRendererFramework: CheckboxCellComponent,
        minWidth: 35,
        width: 40,
        field: 'q2Enable'
      },
      {
        headerName: 'Q2 Value',

        field: 'q2Value'
      },
      {
        headerName: 'Q3',
        cellRendererFramework: CheckboxCellComponent,
        minWidth: 35,
        width: 40,
        field: 'q3Enable'
      },
      {
        headerName: 'Q3 Value',

        field: 'q3Value'
      },
      {
        headerName: 'Q4',
        cellRendererFramework: CheckboxCellComponent,
        minWidth: 35,
        width: 40,
        field: 'q4Enable'
      },
      {
        headerName: 'Q4 Value',

        field: 'q4Value'
      },
      {
        headerName: 'Status',
        field: 'isActive',
        cellRendererFramework: ToggleButtonCellComponent
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
  }
  ngOnInit() {
    console.log(this.totalElements, 'count');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mappedLocation']) {

      console.log(this.mappedLocation, 'rowData');
      this.rowData = [];
      this.mappedLocation.forEach(row => {
        this.rowData.push({
          description: row.description ? row.description : '',
          id: row.id ? row.id : '',
          locationCode: row.locationCode ? row.locationCode : '',
          q1Enable: row.configDetails.Q1.isQ1Enabled
            ? row.configDetails.Q1.isQ1Enabled
            : false,
          q2Enable: row.configDetails.Q2.isQ2Enabled
            ? row.configDetails.Q2.isQ2Enabled
            : false,
          q3Enable: row.configDetails.Q3.isQ3Enabled
            ? row.configDetails.Q3.isQ3Enabled
            : false,
          q4Enable: row.configDetails.Q4.isQ4Enabled
            ? row.configDetails.Q4.isQ4Enabled
            : false,
          q1Value: row.configDetails.Q1.value ? row.configDetails.Q1.value : '',
          q2Value: row.configDetails.Q2.value ? row.configDetails.Q2.value : '',
          q3Value: row.configDetails.Q3.value ? row.configDetails.Q3.value : '',
          q4Value: row.configDetails.Q4.value ? row.configDetails.Q4.value : '',
          isActive: row.isActive ? row.isActive : false,
          subBrandCode: row.subBrandCode ? row.subBrandCode : ''
        });
      });
    }
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

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
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
              this.loadLocationList.emit({
                searchValue: res.locations.map(l => l.id)
              });
            } else {
              this.selectedLocationFilters = res.selectedLocationFilters;
            }
          }
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
  search(searchValue: string) {
    this.searchValue = [searchValue.toUpperCase()];
    this.pageEvent.pageIndex = 0;
    this.loadMappedLocation();
  }

  clearSearch() {
    this.filterForm.get('searchValue').reset();
    this.searchValue = null;
    this.clear.emit({
      searchValue: this.filteredLocs ? this.filteredLocs : null
    });

  }

  paginate(data) {
    this.pageEvent = data;
    this.loadMappedLocation();
  }

  loadMappedLocation() {
    this.loadLocationList.emit({
      searchValue: this.searchValue
    });
  }

  openLocationMapping() {
    console.log('details', this.discountDetails);
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.locationMappingService
        .openLocationMappingWithForm({
          formType: LocationMappingFormType.EMPOWERMENT_LOCATION_MAPPING,
          selectedLocations: this.allSelectedLocations,
          filterOptions: {
            levels: this.levels
          }
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            console.log(res, 'locationMappping');
            if (res?.data?.locations?.addedLocations?.length) {
              this.add.emit({
                locations: res.data.locations.addedLocations,
                config: res.data.config
              });
            }
          }

          if (res?.data.locations?.removedLocations?.length) {
            this.delete.emit(
              res.data.locations.removedLocations.map(l => l.id)
            );
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

  editRange() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      let range;
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
        range = this.selectedConfigs[0];
      }
      if (!this.dupLocation) {
        this.dialog
          .open(ConfigDetailsComponent, {
            width: '400px',
            autoFocus: false,
            data: range
          })
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            if (res) {
              this.edit.emit({
                id: this.selectedConfigs.map(data => data.id),
                configDetails: res
              });
              this.filterForm.reset();
              this.dupLocation = false;
              this.hasSelectedRow = false;
            }
          });
      }
    }
  }
  onCellClicked(clickEvent) {}

  selectionChange(id, status) {
    console.log(id, status, 'chevk selection change');

    this.activate.emit({ id, status });
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

  getContext(): any {
    return {
      validators: {},
      componentParent: this,
      disableCheckBox: true
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
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountLocationMapping.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.delete.emit([data.id]);
          }
        });
    }
  }

  openConfirmDialogForDeleteAll() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.api.getSelectedRows().length) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.discountLocationMapping.deleteAllConfirmMessage'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res === true) {
              this.api.getSelectedRows().map(data => data.id);
            }
          });
      }
    }
  }

  // TODO : need to change context for toggel button component
  // getContext() {
  //   return this.component;
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
