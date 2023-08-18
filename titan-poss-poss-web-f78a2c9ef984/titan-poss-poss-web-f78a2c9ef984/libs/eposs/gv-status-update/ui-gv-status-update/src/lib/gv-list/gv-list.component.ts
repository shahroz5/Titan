import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import {
  GiftVoucherStatusDropdownEnum,
  GVExtendValidity,
  GVSerialNoList,
  GVStatusChange,
  GVStatusChangeList,
  GvStatusList,
  ProductGroupMappingServiceAbstraction
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-gv-list',
  templateUrl: './gv-list.component.html',
  styleUrls: []
})
export class GvListComponent implements OnChanges, OnDestroy {
  api: GridApi;
  @Input() gvStatusList: GvStatusList[] = [];
  @Input() disable: boolean;
  @Input() count = 0;
  @Input() date;
  @Input() filterSelected = new FormControl();
  @Input() extendValidityEnabled;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<any>();
  @Output() extentValidity = new EventEmitter<GVExtendValidity>();
  @Output() changeStatus = new EventEmitter<GVStatusChange>();
  gridData: string[] = [];
  rowData: GvStatusList[] = [];
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  context = this;
  columnDefs = [];
  gridOptions: GridOptions;
  remarks: FormControl;
  destroy$: Subject<null> = new Subject<null>();
  extendvalidityList: GVExtendValidity;
  changeStatusList: GVStatusChange;
  statusUpdateForm: FormGroup;
  defaultColDef = {
    flex: 1,
    suppressMovable: true,

    resizable: true
  };

  totalGVSelected = 0;
  totalGVSelectedPrice = 0;
  statusSelected = '';
  statusChangeDropDownValues = [];

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.gvStatusUpdate.itemCodeHeaderName',
        'pw.gvStatusUpdate.itemCodeFieldName',
        'pw.gvStatusUpdate.serialNoHeaderName',
        'pw.gvStatusUpdate.serialNoFieldName',

        'pw.gvStatusUpdate.issueToHeaderName',
        'pw.gvStatusUpdate.issueToFieldName',
        'pw.gvStatusUpdate.denominationHeaderName',
        'pw.gvStatusUpdate.denominationFieldName',
        'pw.gvStatusUpdate.quantityHeaderName',
        'pw.gvStatusUpdate.quantityFieldName',
        'pw.gvStatusUpdate.valueHeaderName',
        'pw.gvStatusUpdate.valueFieldName',

        'pw.gvStatusUpdate.statusHeaderName',
        'pw.gvStatusUpdate.statusFieldName',
        'pw.gvStatusUpdate.validFromHeaderName',
        'pw.gvStatusUpdate.validFromFieldName',
        'pw.gvStatusUpdate.validTillHeaderName',
        'pw.gvStatusUpdate.validTillFieldName',
        'pw.gvStatusUpdate.restrictedHeaderName',
        'pw.gvStatusUpdate.restrictedFieldName'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            minWidth: 5,
            width: 5,
            pinned: 'left',
            lockPinned: true,
            cellStyle: params => {
              if (params.data.newlyAdded) {
                return { backgroundColor: '#1eb496', padding: '0px' };
              }
            }
          },
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            minWidth: 40,
            width: 40,
            pinned: 'left',
            lockPinned: true
          },
          {
            field: translatedMessages['pw.gvStatusUpdate.itemCodeFieldName'],
            headerName:
              translatedMessages['pw.gvStatusUpdate.itemCodeHeaderName']
          },
          {
            field: translatedMessages['pw.gvStatusUpdate.serialNoFieldName'],
            headerName:
              translatedMessages['pw.gvStatusUpdate.serialNoHeaderName']
          },
          {
            field: translatedMessages['pw.gvStatusUpdate.issueToFieldName'],
            headerName:
              translatedMessages['pw.gvStatusUpdate.issueToHeaderName']
          },
          {
            field:
              translatedMessages['pw.gvStatusUpdate.denominationFieldName'],
            headerName:
              translatedMessages['pw.gvStatusUpdate.denominationHeaderName']
          },
          {
            field: translatedMessages['pw.gvStatusUpdate.quantityFieldName'],
            headerName:
              translatedMessages['pw.gvStatusUpdate.quantityHeaderName']
          },
          {
            field: translatedMessages['pw.gvStatusUpdate.valueFieldName'],
            headerName: translatedMessages['pw.gvStatusUpdate.valueHeaderName']
          },
          {
            field: translatedMessages['pw.gvStatusUpdate.statusFieldName'],
            headerName:
              translatedMessages['pw.gvStatusUpdate.statusHeaderName'],
            cellStyle: params => {
              if (
                params.data.status ===
                GiftVoucherStatusDropdownEnum.BLOCKED_VALUE
              ) {
                return { color: 'red' };
              }
            }
          },
          {
            field: translatedMessages['pw.gvStatusUpdate.validFromFieldName'],
            headerName:
              translatedMessages['pw.gvStatusUpdate.validFromHeaderName'],
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },
          {
            field: translatedMessages['pw.gvStatusUpdate.validTillFieldName'],
            headerName:
              translatedMessages['pw.gvStatusUpdate.validTillHeaderName'],
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },
          {
            field: translatedMessages['pw.gvStatusUpdate.restrictedFieldName'],
            headerName:
              translatedMessages['pw.gvStatusUpdate.restrictedHeaderName'],
            cellRenderer: params => {
              return params.data.excludes.length > 0 && params.data.excludes?.every(x => x) ? params.data.excludes[0]?.split('/').length : 0;
            },
            cellClass: 'pw-fourth-color'
          }
        ];
      });

    this.remarks = new FormControl('', [
      this.fieldValidatorsService.remarkField('Remarks'),
      this.fieldValidatorsService.requiredField('Remarks')
    ]);

    this.statusUpdateForm = new FormGroup({
      status: new FormControl('', [
        this.fieldValidatorsService.requiredField('Status')
      ]),
      remarks: new FormControl('', [
        this.fieldValidatorsService.remarkField('Remarks'),
        this.fieldValidatorsService.requiredField('Remarks')
      ])
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gvStatusList']) {
      this.rowData = this.gvStatusList;
    }
    if (!this.extendValidityEnabled) {
      this.statusChangeDropDownValues = this.dropDownvalues();
      this.statusChangeDropDownValues.length === 0
        ? this.statusUpdateForm.disable()
        : this.statusUpdateForm.enable();
    } else {
      this.filterSelected.value !==
      GiftVoucherStatusDropdownEnum.REDEEMABLE_VALUE
        ? this.remarks.disable()
        : this.remarks.enable();
    }

    if (!changes['date']) {
      this.resetValues();
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  printSortStateToConsole(event) {
    const sortState = this.api.getSortModel();
    if (sortState.length === 0) {
      this.sort.emit();
    } else {
      for (let i = 0; i < sortState.length; i++) {
        const item = sortState[i];
        item.sort = item.sort[0].toUpperCase() + item.sort.slice(1);
        this.sort.emit(item);
      }
    }
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSelectionChanged(data) {
    this.totalGVSelected = this.api.getSelectedNodes().length;
    this.totalGVSelectedPrice = this.api
      .getSelectedNodes()
      .map(row => row.data.totalValue)
      .reduce((amount1, amount2) => amount1 + amount2, 0);
  }
  updateStatus() {
    if (this.api.getSelectedNodes().length > 0) {
      this.changeStatusList = { giftVoucherStatus: [], remarks: '' };
      this.api.getSelectedNodes().forEach(element => {
        const statusUpdate: GVStatusChangeList = {
          serialNo: element.data.serialNo,
          status: this.statusUpdateForm.get('status').value
        };

        this.changeStatusList.giftVoucherStatus.push(statusUpdate);
      });
    }
    this.changeStatusList.remarks = this.statusUpdateForm.get('remarks').value;

    this.changeStatus.emit(this.changeStatusList);
  }
  updateValidity() {
    if (this.remarks.valid) {
      if (this.api.getSelectedNodes().length > 0) {
        this.extendvalidityList = { giftValidity: [], remarks: '' };
        this.api.getSelectedNodes().forEach(element => {
          const gvserialList: GVSerialNoList = {
            serialNo: element.data.serialNo,
            validTill: this.date
          };

          this.extendvalidityList.giftValidity.push(gvserialList);
        });
      }
      this.extendvalidityList.remarks = this.remarks.value;

      this.extentValidity.emit(this.extendvalidityList);
    }
  }

  checkValidityUpdate() {
    if (
      this.remarks.invalid ||
      (this.api && this.api.getSelectedNodes().length === 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
  checkStatusUpdate() {
    if (
      this.statusUpdateForm.invalid ||
      this.api.getSelectedNodes().length === 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  dropDownvalues() {
    switch (this.filterSelected.value) {
      case GiftVoucherStatusDropdownEnum.REDEEMABLE_CODE:
        return [
          {
            value: GiftVoucherStatusDropdownEnum.BLOCKED_CODE,
            description: GiftVoucherStatusDropdownEnum.BLOCKED_VALUE,
            isActive: true
          },

          {
            value: GiftVoucherStatusDropdownEnum.CANCELLED_CODE,
            description: GiftVoucherStatusDropdownEnum.CANCELLED_VALUE,
            isActive: true
          },
          {
            value: GiftVoucherStatusDropdownEnum.FORCECLOSED_CODE,
            description: GiftVoucherStatusDropdownEnum.FORCECLOSED_VALUE,
            isActive: true
          },
          {
            value: GiftVoucherStatusDropdownEnum.EXPIRED_CODE,
            description: GiftVoucherStatusDropdownEnum.EXPIRED_VALUE,
            isActive: true
          }
        ];
      case GiftVoucherStatusDropdownEnum.INACTIVE_CODE:
        return [];

      case GiftVoucherStatusDropdownEnum.ISSUEDTORO_CODE:
        return [];

      case GiftVoucherStatusDropdownEnum.FOR_INWARDING_CODE:
        return [
          {
            value: GiftVoucherStatusDropdownEnum.CANCELLED_CODE,
            description: GiftVoucherStatusDropdownEnum.CANCELLED_VALUE,
            isActive: true
          }
        ];

      case GiftVoucherStatusDropdownEnum.BLOCKED_CODE:
        return [
          {
            value: GiftVoucherStatusDropdownEnum.CANCELLED_CODE,
            description: GiftVoucherStatusDropdownEnum.CANCELLED_VALUE,
            isActive: true
          },
          {
            value: GiftVoucherStatusDropdownEnum.FORCECLOSED_CODE,
            description: GiftVoucherStatusDropdownEnum.FORCECLOSED_VALUE,
            isActive: true
          },
          {
            value: GiftVoucherStatusDropdownEnum.REDEEMABLE_CODE,
            description: GiftVoucherStatusDropdownEnum.REDEEMABLE_VALUE,
            isActive: true
          },
          {
            value: GiftVoucherStatusDropdownEnum.EXPIRED_CODE,
            description: GiftVoucherStatusDropdownEnum.EXPIRED_VALUE,
            isActive: true
          }
        ];

      case GiftVoucherStatusDropdownEnum.REDEEMED_CODE:
        return [];

      case GiftVoucherStatusDropdownEnum.CANCELLED_CODE:
        return [];
      case GiftVoucherStatusDropdownEnum.FORCECLOSED_CODE:
        return [];
      case GiftVoucherStatusDropdownEnum.EXPIRED_CODE:
        return [
          {
            value: GiftVoucherStatusDropdownEnum.BLOCKED_CODE,
            description: GiftVoucherStatusDropdownEnum.BLOCKED_VALUE,
            isActive: true
          },

          {
            value: GiftVoucherStatusDropdownEnum.CANCELLED_CODE,
            description: GiftVoucherStatusDropdownEnum.CANCELLED_VALUE,
            isActive: true
          },
          {
            value: GiftVoucherStatusDropdownEnum.REDEEMABLE_CODE,
            description: GiftVoucherStatusDropdownEnum.REDEEMABLE_VALUE,
            isActive: true
          },
          {
            value: GiftVoucherStatusDropdownEnum.FORCECLOSED_CODE,
            description: GiftVoucherStatusDropdownEnum.FORCECLOSED_VALUE,
            isActive: true
          }
        ];
      case GiftVoucherStatusDropdownEnum.AUTO_CANCELLATION_CODE:
        return [];
      default:
        return [];
    }
  }

  cancel() {
    this.api.deselectAll();
  }
  checkCancelButton() {
    if (this.api && this.api.getSelectedNodes().length > 0) {
      return false;
    } else {
      return true;
    }
  }

  resetValues() {
    this.totalGVSelected = 0;
    this.totalGVSelectedPrice = 0;
    if (this.api) {
      this.api.deselectAll();
    }
    this.statusUpdateForm.reset();
    this.remarks.reset();
  }

  onCellClicked(clickEvent) {
    const id = [];

    if (clickEvent.colDef.headerName === 'Restricted') {
      clickEvent.data.excludes[0]?.split('/').forEach(element => {
        id.push({ id: element });
      });

      this.productGroupMappingServiceAbstraction.open({
        selectedProductGroup: id,
        isViewMode: true,
        viewModeLabel: 'Restricted'
      });
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (
      this.currentRowField === 'validFrom' ||
      this.currentRowField === 'validTill'
    ) {
      this.currentRowInfo = this.dateFormatterService.format(
        this.currentRowInfo
      );
    }

    if (this.currentRowField === 'extendCount') {
      this.currentRowInfo = node.data.excludes.length > 0 && node.data.excludes?.every(x => x) ? node.data.excludes[0]?.split('/').length : 0
    }
  }

  focusOut(event) {
    this.isFocusing = false;
  }
}
