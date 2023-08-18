import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import {
  CheckboxCellComponent,
  DatePickerComponent,
  InputValidatorComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FOCBlockingLocationLevel } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { FocBllPopupComponent } from '../foc-bll-popup/foc-bll-popup.component';
import { FormControl, FormGroup } from '@angular/forms';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-foc-bll-item',
  templateUrl: './foc-bll-item.component.html'
})
export class FocBllItemComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() selectedLocations: FOCBlockingLocationLevel[];
  @Output() focBlockingLocationLevel = new EventEmitter<any>();
  @Input() pageEvent: PageEvent;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() pageSizeOptions: number[];
  @Input() focBlockingDetails: FOCBlockingLocationLevel[];
  @Input() count: number;
  @Input() locationCodes: string[] = [];
  @Input() isEnable: boolean;
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() loadDetails = new EventEmitter();
  @Output() openLocationMappingPopup = new EventEmitter();
  selectedRowData: any;
  minPageSize: number;
  rowSelection = 'multiple';
  rowHeight = 35;
  animateRows = true;
  domLayout = 'autoHeight';
  api: GridApi;
  destroy$ = new Subject();
  rowData = [];
  columnDefs = [];
  enableButton = false;
  disableButton = false;
  defaultColDef = {
    suppressMovable: true
  };
  component: any = this;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  invalidSearch = false;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string | boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEnable']) {
      this.disableButton = this.isEnable;
    }
  }
  constructor(private translate: TranslateService, private dialog: MatDialog) {
    this.translate
      .get([
        'pw.focBlockingLocationLevel.locationCodeLabel',
        'pw.focBlockingLocationLevel.locationName',
        'pw.focBlockingLocationLevel.fromDateLabel',
        'pw.focBlockingLocationLevel.toDateLabel',
        'pw.focBlockingLocationLevel.approvedByLabel',
        'pw.focBlockingLocationLevel.isCMMandatory',
        'pw.focBlockingLocationLevel.remarksLabel',
        'pw.focBlockingLocationLevel.isActiveLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            minWidth: 40,
            width: 40,
            pinned: 'left',
            lockPinned: true,
            cellRenderer: params => {
              this.locationCodes.forEach(locationCode => {
                if (locationCode === params.data.locationCode) {
                  params.node.setSelected(true);
                } else return false;
              });
            }
          },
          {
            headerName:
              translatedMessages[
                'pw.focBlockingLocationLevel.locationCodeLabel'
              ],
            field: 'locationCode',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1
          },
          {
            headerName:
              translatedMessages['pw.focBlockingLocationLevel.locationName'],
            field: 'description',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1
          },
          {
            headerName:
              translatedMessages['pw.focBlockingLocationLevel.fromDateLabel'],
            field: 'fromDate',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1
          },
          {
            headerName:
              translatedMessages['pw.focBlockingLocationLevel.toDateLabel'],
            field: 'toDate',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1
          },
          {
            headerName:
              translatedMessages['pw.focBlockingLocationLevel.approvedByLabel'],
            field: 'approvedBy',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1
          },
          {
            headerName:
              translatedMessages['pw.focBlockingLocationLevel.isCMMandatory'],
            field: 'isCMMandatory',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellRendererFramework: CheckboxCellComponent
          },
          {
            headerName:
              translatedMessages['pw.focBlockingLocationLevel.remarksLabel'],
            field: 'remarks',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellEditor: 'inputValidator'
          },
          {
            headerName:
              translatedMessages['pw.focBlockingLocationLevel.isActiveLabel'],
            field: 'isActive',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellRendererFramework: ToggleButtonCellComponent
          }
        ];
      });
  }

  ngOnInit(): void {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else this.clearSearch();
      });
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadDetails.emit();
  }
  search(searchValue) {
    if (
      fieldValidation.alphaNumericField.pattern.test(searchValue) ||
      fieldValidation.nameWithSpaceField.pattern.test(searchValue)
    ) {
      this.emitSearchValue.emit(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = false;
      this.api.setRowData([]);
    }
  }
  openLocationMapping() {
    this.openLocationMappingPopup.emit();
  }
  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      datePicker: DatePickerComponent
    };
  }
  getContext() {
    return {
      validators: [],
      componentParent: this.component,
      disableCheckBox: true,
      disableToggleButton: true
    };
  }
  openPopUp() {
    const dialogRef = this.dialog.open(FocBllPopupComponent, {
      width: '420px',
      data:
        this.api.getSelectedRows().length === 1 ? this.selectedRowData : null
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== undefined) {
          this.focBlockingLocationLevel.emit({
            validity: {
              endDate: data.endDate,
              startDate: data.startDate,
              status: data.isActive
            },
            configDetails: {
              type: 'FOC_BLOCKING_FOR_STORE',
              data: {
                remarks: data.remarks,
                approvedBy: data.approvedBy,
                isCMNumber: data.isCMMandatory
              }
            },
            addLocations: [],
            updateLocations: this.api
              .getSelectedNodes()
              .map(node => node.data.id),
            removeLocations: [],
            mobileNo: null
          });
        }
      });
  }

  onRowSelected($event) {
    this.disableButton = true;
    this.locationCodes.push($event.node.data.locationCode);
    this.selectedRowData = $event.node.data;
    if (this.api.getSelectedNodes().length > 0) {
      this.enableButton = true;
    } else {
      this.enableButton = false;
    }
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'isCMMandatory')
      this.currentRowInfo = !!this.currentRowInfo;
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
