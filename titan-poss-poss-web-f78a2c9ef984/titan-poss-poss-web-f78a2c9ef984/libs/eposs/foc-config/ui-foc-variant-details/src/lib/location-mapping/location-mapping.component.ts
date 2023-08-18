import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  FocLocationList,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SaveLocationPayload,
  SchemeDetails,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Subject, fromEvent } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { GridApi } from 'ag-grid-community';

import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { DateRangeFormComponent } from './date-range-form/date-range-form.component';
import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { PageEvent } from '@angular/material/paginator';
import { ToggleButtonCellComponent } from '@poss-web/shared/components/ui-ag-grid';
@Component({
  selector: 'poss-web-location-mapping',
  templateUrl: './location-mapping.component.html',
  styleUrls: ['./location-mapping.component.scss']
})
export class LocationMappingComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() locationList: FocLocationList[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() schemeDetails: SchemeDetails;
  @Output() paginator = new EventEmitter<PageEvent>();

  @Output() updateLocation = new EventEmitter<SaveLocationPayload>();
  @Output() updateIsActiveStatus = new EventEmitter<SaveLocationPayload>();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  invalidSearch: boolean;
  utcOffset = moment().startOf('day').utcOffset();
  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  disableEdit = true;
  endDate = moment();
  startDate = moment();
  status: boolean;

  @Output() openLocationMappingPopup = new EventEmitter<boolean>();
  saveLocationPayload: SaveLocationPayload;
  removeLocations: string[];
  updateLocations = [];
  validity: {
    endDate: string;
    startDate: string;
    status?: true;
  };
  colDefs = [];
  destroy$ = new Subject<null>();
  locationMappingComponent: LocationMappingComponent = this;
  gridApi: GridApi;
  selectedRowData: any;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    private dialog: MatDialog,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'pw.focConfiguration.locationCode',
        'pw.focConfiguration.locationName',
        'pw.focConfiguration.startDate',
        'pw.focConfiguration.endDate',
        'pw.focConfiguration.subbrandCode',
        'pw.focConfiguration.status'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.colDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 40,
            maxWidth: 40,
            suppressMovable: true,
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: translatedMessages['pw.focConfiguration.locationCode'],
            field: 'locationCode',
            width: 180,
            maxWidth: 180,
            suppressMovable: true,
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: translatedMessages['pw.focConfiguration.locationName'],
            field: 'description',
            width: 250,
            maxWidth: 250,
            suppressMovable: true,
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: translatedMessages['pw.focConfiguration.startDate'],
            field: 'startDate',
            width: 230,
            maxWidth: 230,
            suppressMovable: true,
            suppressSizeToFit: true,
            resizable: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMessages['pw.focConfiguration.endDate'],
            field: 'endDate',
            width: 230,
            maxWidth: 230,
            suppressMovable: true,
            suppressSizeToFit: true,
            resizable: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMessages['pw.focConfiguration.subbrandCode'],
            field: 'subBrandCode',
            width: 150,
            maxWidth: 150,
            suppressMovable: true,
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: translatedMessages['pw.focConfiguration.status'],
            field: 'isActive',
            suppressMovable: true,
            cellRendererFramework: ToggleButtonCellComponent,
            suppressSizeToFit: true,
            resizable: true,
            flex: 1
          }
        ];
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.disableEdit = true;

    this.parentForm.clear();

    this.locationList.forEach(item => {});

    if (this.gridApi) {
      this.gridApi.setRowData(this.locationList);
    }
  }

  ngAfterViewInit(): void {
    if (this.searchBox) {
      fromEvent(this.searchBox.nativeElement, 'input')
        .pipe(debounceTime(1000), takeUntil(this.destroy$))
        .subscribe(event => {
          const searchValue = this.searchForm.value.searchValue;
          if (searchValue) {
            this.search(searchValue);
          } else {
            this.clearSearch();
          }
        });
    }
  }

  onRowSelected($event) {
    this.selectedRowData = $event.node.data;
  }
  search(searchValue: string) {
    if (fieldValidation.nameWithSpaceField.pattern.test(searchValue)) {
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
  }

  onEdit() {
    if (
      !this.schemeDetails?.isActive &&
      this.schemeDetails?.description !== ''
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const dialogRef = this.dialog.open(DateRangeFormComponent, {
        width: '500px',
        height: 'auto',
        data:
          this.gridApi.getSelectedRows().length === 1
            ? this.selectedRowData
            : null
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          const updatedData = this.gridApi
            .getSelectedNodes()
            .map(data => data.data);

          this.startDate = res.data.startFromDate;
          this.endDate = res.data.endsOnDate;
          this.status = res.data.status;
          this.updateLocation.emit({
            saveLocationPayload: {
              updateLocations: updatedData.map(data => data.id),
              addLocations: [],

              removeLocations: [],

              validity: {
                endDate: this?.endDate
                  ? this?.endDate
                      ?.startOf('day')
                      .add(this.utcOffset, 'm')
                      .valueOf()
                  : undefined,
                startDate: this?.startDate
                  ? this?.startDate
                      ?.startOf('day')
                      .add(this.utcOffset, 'm')
                      .valueOf()
                  : undefined,
                status: this.status
              }
            }
          });
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
  getContext() {
    return {
      validators: {},
      componentParent: this.locationMappingComponent
    };
  }
  getAllRows() {
    const rowData = [];

    this.gridApi.forEachNode(node => rowData.push(node.data));

    return rowData;
  }

  onSelectionChanged(event) {
    if (this.gridApi.getSelectedNodes().length) {
      this.disableEdit = false;
    } else {
      this.disableEdit = true;
    }
  }

  selectionChange(id, checked) {
    if (
      !this.schemeDetails?.isActive &&
      this.schemeDetails?.description !== ''
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.updateIsActiveStatus.emit({
              saveLocationPayload: {
                updateLocations: [id],
                addLocations: [],

                validity: {
                  status: checked
                },
                removeLocations: []
              }
            });
          } else {
            this.locationList = this.locationList.map(element => {
              if (element.id === id) {
                element.isActive = !checked;
              }
              return element;
            });
            this.gridApi.setRowData(this.locationList);
          }
        });
    }
  }

  gridReady(gridReadyEvent) {
    this.gridApi = gridReadyEvent.api;
  }
  addLocation() {
    this.openLocationMappingPopup.emit(true);
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.gridApi.getValue(this.currentRowField, node);
    if (
      this.currentRowField === 'startDate' ||
      this.currentRowField === 'endDate'
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
