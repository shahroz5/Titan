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
import {
  CheckboxCellComponent,
  DatePickerComponent,
  InputValidatorComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { FOCBCLPopupComponent } from '../foc-bcl-popup/foc-bcl-popup.component';
import { FOCBlockingCustomerLevel } from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-foc-bcl-item',
  templateUrl: './foc-bcl-item.component.html'
})
export class FOCBCLItemComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() focBclDetails: FOCBlockingCustomerLevel[];
  @Input() pageEvent: PageEvent;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() pageSizeOptions: number[];
  @Output() focBlockingCustomerDetails = new EventEmitter<any>();
  @Input() count: number;
  @Input() locationCodes: string[];
  @Input() isEnabling: boolean;
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() loadDetails = new EventEmitter();
  @Output() openLocationMappingPopup = new EventEmitter();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  invalidSearch = false;
  rowSelection = 'single';
  disableButton = true;
  rowHeight = 35;
  minPageSize: number;
  animateRows = true;
  domLayout = 'autoHeight';
  api: GridApi;
  destroy$ = new Subject();
  rowData = [];
  enableButton = false;
  columnDefs = [];
  selectedRowData: any;
  defaultColDef = {
    suppressMovable: true
  };
  component: any = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string | boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEnabling']) {
      this.disableButton = this.isEnabling;
    }
  }

  constructor(
    private dialog: MatDialog,
    private traslateService: TranslateService
  ) {
    this.traslateService
      .get([
        'pw.focBlockingCustomerLevel.locationCodeLabel',
        'pw.focBlockingCustomerLevel.locationName',
        'pw.focBlockingCustomerLevel.focItemCode',
        'pw.focBlockingCustomerLevel.qtyLabel',
        'pw.focBlockingCustomerLevel.fromDateLabel',
        'pw.focBlockingCustomerLevel.toDateLabel',
        'pw.focBlockingCustomerLevel.mobileNoLabel',
        'pw.focBlockingCustomerLevel.approvedByLabel',
        'pw.focBlockingCustomerLevel.isCMMandatoryLabel',
        'pw.focBlockingCustomerLevel.remarksLabel',
        'pw.focBlockingCustomerLevel.isActiveLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.columnDefs = [
          {
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
              translatedMsg['pw.focBlockingCustomerLevel.locationCodeLabel'],
            field: 'locationCode',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellEditor: 'inputValidator'
          },
          {
            headerName:
              translatedMsg['pw.focBlockingCustomerLevel.locationName'],
            field: 'description',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellEditor: 'inputValidator'
          },
          {
            headerName:
              translatedMsg['pw.focBlockingCustomerLevel.focItemCode'],
            field: 'focItemCode',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellEditor: 'inputValidator'
          },
          {
            headerName: translatedMsg['pw.focBlockingCustomerLevel.qtyLabel'],
            field: 'quantity',
            resizable: true,
            suppressSizeToFit: true,
            minWidth: 50,
            width: 50,
            cellEditor: 'inputValidator'
          },
          {
            headerName:
              translatedMsg['pw.focBlockingCustomerLevel.fromDateLabel'],
            field: 'fromDate',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellEditor: 'datePicker'
          },
          {
            headerName:
              translatedMsg['pw.focBlockingCustomerLevel.toDateLabel'],
            field: 'toDate',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellEditor: 'datePicker'
          },
          {
            headerName:
              translatedMsg['pw.focBlockingCustomerLevel.mobileNoLabel'],
            field: 'mobileNumber',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellEditor: 'inputValidator'
          },
          {
            headerName:
              translatedMsg['pw.focBlockingCustomerLevel.approvedByLabel'],
            field: 'approvedBy',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellEditor: 'inputValidator'
          },
          {
            headerName:
              translatedMsg['pw.focBlockingCustomerLevel.isCMMandatoryLabel'],
            field: 'isCMMandatory',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellRendererFramework: CheckboxCellComponent
          },
          {
            headerName:
              translatedMsg['pw.focBlockingCustomerLevel.remarksLabel'],
            field: 'remarks',
            resizable: true,
            suppressSizeToFit: true,
            flex: 1,
            cellEditor: 'inputValidator'
          },
          {
            headerName:
              translatedMsg['pw.focBlockingCustomerLevel.isActiveLabel'],
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
  search(searchValue) {
    if (
      fieldValidation.alphaNumericField.pattern.test(searchValue) ||
      fieldValidation.nameWithSpaceField.pattern.test(searchValue)
    ) {
      this.emitSearchValue.emit(searchValue);
      this.invalidSearch = false;
    } else {
      this.invalidSearch = false;
      this.api.setRowData([]);
    }
  }

  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadDetails.emit();
  }
  getContext() {
    return {
      validators: [],
      componentParent: this.component,
      disableCheckBox: true,
      disableToggleButton: true
    };
  }
  onRowSelected($event) {
    this.selectedRowData = $event.node.data;
    this.disableButton = true;
    this.locationCodes.push($event.node.data.locationCode);
    if (this.api.getSelectedNodes().length > 0) {
      this.enableButton = true;
    } else {
      this.enableButton = false;
    }
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      datePicker: DatePickerComponent
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  openPopUp() {
    const dialogRef = this.dialog.open(FOCBCLPopupComponent, {
      width: '480px',
      data:
        this.api.getSelectedRows().length === 1 ? this.api.getSelectedRows()[0] : null
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== undefined) {
          this.focBlockingCustomerDetails.emit({
            validity: {
              endDate: data.endDate,
              startDate: data.startDate,
              status: data.isActive
            },
            configDetails: {
              type: 'FOC_BLOCKING_FOR_CUSTOMER',
              data: {
                remarks: data.remarks,
                approvedBy: data.approvedBy,
                isCMNumber: data.isCMMandatory,
                focItemCode: data.focItemCode,
                quantity: data.quantity
              }
            },
            addLocations: [],
            updateLocations: this.api
              .getSelectedNodes()
              .map(node => node.data.id),
            removeLocations: [],
            mobileNo: data.mobileNo
          });
        }
      });
  }
  openLocationMapping() {
    this.openLocationMappingPopup.emit();
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
