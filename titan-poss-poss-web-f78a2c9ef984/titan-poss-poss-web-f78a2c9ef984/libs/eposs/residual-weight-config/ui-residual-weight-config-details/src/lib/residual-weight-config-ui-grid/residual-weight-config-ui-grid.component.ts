import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { ResidualTolerancePopupComponent } from '../residual-tolerance-popup/residual-tolerance-popup.component';

import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-residual-weight-config-ui-grid',
  templateUrl: './residual-weight-config-ui-grid.component.html',
  styleUrls: ['./residual-weight-config-ui-grid.component.scss']
})
export class ResidualWeightConfigUiGridComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() formData;
  @Input() residualWeightconfigDetails: any[] = [];
  @Input() resdiualWeightRange: any;
  @Input() configId: string;

  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() pageSize: number[];
  @Input() selectedConfigDetails;

  @Output() editSchemeDetails = new EventEmitter<any>();
  @Output() responseEvent = new EventEmitter<any>();
  @Output() removeEvent = new EventEmitter<any>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  @Output() paginator = new EventEmitter<PageEvent>();

  destroy$: Subject<null> = new Subject<null>();
  rowData = [];

  columnDefs = [];

  domLayout = 'autoHeight';

  animateRows = true;
  gridApi: GridApi;

  valueEmpty = false;
  invalidTolerance = false;
  enableButton = false;

  errorDialogReference;
  defaultColDef = {
    suppressMovable: true
  };
  pageSizeOptions = [];
  minPageSize: number;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.residualWeightconfigDetails === null)
      this.residualWeightconfigDetails = [];

    if (
      changes['resdiualWeightRange'] ||
      changes['residualWeightconfigDetails']
    ) {
      this.cdr.markForCheck();
      this.rowData = [];
      if (this.residualWeightconfigDetails?.length) {
        this.residualWeightconfigDetails.forEach(config => {
          this.createRowData(config);
        });
      }

    }
  }
  createRowData(config) {
    this.rowData.push({
      id: config.id,
      rangeId: config.rangeId,
      range: config.range,
      configValue: config.configValue,
      configPercent: config.configPercent
    });
  }
  ngOnInit() {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];

        this.cdr.markForCheck();
      });
    this.columnDefs = [
      {
        checkboxSelection: true,
        width: 40,
        minWidth: 40
      },

      {
        headerName: 'Weight Range',
        field: 'rangeId',
        valueFormatter: params => {
          if (params.data !== null) {
            if (params.data.rangeId) {
              const obj = this.resdiualWeightRange.filter(
                range => range.id === params.value
              );
              return obj.length > 0 ? obj[0]?.range : '';
            } else {
              return '';
            }
          } else {
            return '';
          }
        },
        editable: false,
        singleClickEdit: true,
        flex: 1,
        resizable: true
      },
      {
        headerName: 'Force Closure in Gms',

        field: 'configValue',
        cellClass: 'pw-form-input-width',
        resizable: true,
        isWeight: true,
        editable: false,
        singleClickEdit: true,
        cellEditor: 'inputValidator',
        cellClassRules: {
          'pw-gray-border': params => {
            return params?.value?.isValid === true;
          },
          'pw-error-border': params => {
            return (
              params?.value?.isValid === false && params?.value?.value !== ''
            );
          }
        }
      },
      {
        headerName: 'Force Closure in Percentage',
        field: 'configPercent',
        cellClass: 'pw-form-input-width',
        resizable: true,

        editable: false,
        singleClickEdit: true,
        cellEditor: 'inputValidator',
        cellClassRules: {
          'pw-gray-border': params => {
            return params?.value?.isValid === true;
          },
          'pw-error-border': params => {
            return (
              params?.value?.isValid === false && params.value.value !== ''
            );
          }
        }
      },
      {
        headerName: '',
        suppressMovable: true,
        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width',
        headerClass: 'pw-delete-icon-width',
        cellRenderer: 'deleteRowRenderer',
        suppressRowClickSelection: 'true',
        onCellClicked: this.remove.bind(this)
      }
    ];
  }

  onRowSelected($event) {
    if (this.gridApi.getSelectedNodes().length > 0) {
      this.enableButton = true;
    } else {
      this.enableButton = false;
    }
  }

  getContext() {
    return {
      validators: {
        configValue: [
          this.fieldValidatorsService.weightField('Force Closure in grams')
        ],
        configPercent: [
          this.fieldValidatorsService.percentageField(
            'Force Closure in Percentage'
          )
        ]
      }
    };
  }
  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  openLocationMapping() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.openLocationMappingEvent.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.rowData);
  }
  getAllRows() {
    this.gridApi.stopEditing();
    const rowData = [];
    this.gridApi.forEachNode(node => {
      rowData.push(node.data);
    });
    return rowData;
  }
  save() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.gridApi.stopEditing();
      this.checkValidation(false);
      if (this.getAllRows().length === 0) {
        this.valueEmpty = true;
        this.showErrorPopUp();
      } else if (!this.valueEmpty && !this.invalidTolerance) {
        this.responseEvent.emit(this.prepareResponse(this.getAllRows()));
      }
    }
  }
  prepareResponse(array: any[]) {
    const newData = array.filter(data => data.id === '');
    const updatedData = array.filter(data => data.id !== '');
    const addSchemeDetails = [];
    const updateSchemeDetails = [];
    for (const value of newData) {
      const rangeID =
        typeof value.rangeId === 'object'
          ? value.rangeId?.value
          : value.rangeId;
      let rowID = null;
      this.resdiualWeightRange.find((o, i) => {
        if (o.id === rangeID) {
          rowID = o.rowId;
          return; // stop searching
        }
      });
      addSchemeDetails.push({
        rangeId: rangeID,
        rowId: rowID,
        metalType: null,
        rangeDetails: {
          data: {
            configValue:
              typeof value.configValue === 'object'
                ? value.configValue?.value
                : value.configValue,
            configPercent:
              typeof value.configPercent === 'object'
                ? value.configPercent?.value
                : value.configPercent
          },
          type: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
        }
      });
    }

    for (const value of updatedData) {
      const rangeID =
        typeof value.rangeId === 'object'
          ? value.rangeId?.value
          : value.rangeId;
      let rowID = null;
      this.resdiualWeightRange.find((o, i) => {
        if (o.id === rangeID) {
          rowID = o.rowId;
          return; // stop searching
        }
      });
      updateSchemeDetails.push({
        rangeId: rangeID,
        rowId: rowID,
        id: typeof value.id === 'object' ? value.id?.value : value.id,
        metalType: null,
        rangeDetails: {
          data: {
            configValue:
              typeof value.configValue === 'object'
                ? value.configValue?.value
                : value.configValue,
            configPercent:
              typeof value.configPercent === 'object'
                ? value.configPercent?.value
                : value.configPercent
          },
          type: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
        }
      });
    }

    return {
      addRangeConfigs: addSchemeDetails,
      updateRangeConfigs: updateSchemeDetails
    };
  }
  checkValidation(newRowData) {
    this.invalidTolerance = false;
    this.valueEmpty = false;

    for (const currentRowData of this.getAllRows()) {
      if (currentRowData?.rangeId === undefined) {
        if (this.getAllRows().length > 0) {
          this.valueEmpty = true;
          break;
        } else {
          this.valueEmpty = false;
        }
      } else {
        if (
          (typeof currentRowData?.rangeId === 'object'
            ? currentRowData?.rangeId.value === ''
            : currentRowData?.rangeId === '') ||
          (typeof currentRowData?.configValue === 'object'
            ? currentRowData?.configValue.value === ''
            : currentRowData?.configValue === '') ||
          (typeof currentRowData?.configPercent === 'object'
            ? currentRowData?.configPercent.value === ''
            : currentRowData?.configPercent === '')
        ) {
          if (this.getAllRows().length > 0) {
            this.valueEmpty = true;
            break;
          } else {
            this.valueEmpty = false;
          }
        } else {
          this.valueEmpty = false;

          const rangeID =
            typeof currentRowData.rangeId === 'object'
              ? currentRowData.rangeId?.value
              : currentRowData.rangeId;
          let isActiveRange = false;

          this.resdiualWeightRange.find((obj, i) => {
            if (obj.id === rangeID) {
              isActiveRange = true;
              return; // stop searching
            }
          });
          if (isActiveRange) {
            this.valueEmpty = false;
          } else {
            this.valueEmpty = true;
            break;
          }
        }
      }
    }

    this.gridApi.forEachNode(node => {
      if (
        typeof node.data.configValue === 'object' &&
        !node.data.configValue.isValid
      ) {
        this.invalidTolerance = true;
      }
    });

    if (this.valueEmpty || this.invalidTolerance) {
      this.showErrorPopUp();
    }
    if (!this.valueEmpty && !this.invalidTolerance && newRowData) {
      this.addNewRow(newRowData);
    }
  }
  showErrorPopUp() {
    if (this.invalidTolerance) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.ERROR,
          message: 'pw.alertPopup.invalidTolerance'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          this.invalidTolerance = false;
        });
    } else if (this.valueEmpty) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.ERROR,
          message: 'pw.weightTolerance.emptyRequiredFileds'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          this.invalidTolerance = false;
        });
    }
  }
  remove(params) {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (params.data.id === '') {
        this.gridApi.applyTransaction({ remove: [params.data] });
      } else {
        this.removeEvent.emit({
          removeRangeConfigs: [params.data.id]
        });
      }
    }
  }
  add() {
    console.log('data123', this.selectedConfigDetails);
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const dialogRef = this.dialog.open(ResidualTolerancePopupComponent, {
        width: '500px',
        height: 'auto',
        data: {
          residualWeightRange: this.resdiualWeightRange,
          data: {},
          isEditMode: false
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.checkValidation(res);
        }
      });
    }
  }
  showMessage(key: string) {
    this.translationService
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
  addNewRow(res) {
    const newItem = {
      range: '',
      rangeId: res.data.rangeId,
      configValue: res.data.configValue,
      configPercent: res.data.configPercent,
      id: ''
    };
    this.gridApi.applyTransaction({ add: [newItem] });
  }
  edit() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const dialogRef = this.dialog.open(ResidualTolerancePopupComponent, {
        width: '500px',
        height: 'auto',
        data: {
          residualWeightRange: this.resdiualWeightRange,
          selectedDetails: this.gridApi.getSelectedNodes()[0].data,
          isEditMode: true
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          const updateRangeConfigs = [];
          this.gridApi.getSelectedNodes().forEach(rowData => {
            updateRangeConfigs.push({
              rangeId: rowData.data.rangeId,
              rowId: Number(rowData.rowIndex),
              metalType: null,
              id: rowData.data.id,
              rangeDetails: {
                data: {
                  configValue: res.data.configValue,
                  configPercent: res.data.configPercent
                },
                type: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
              }
            });
          });
          this.editSchemeDetails.emit(updateRangeConfigs);
        }
      });
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    if (this.currentRowField === 'rangeId') {
      this.currentRowInfo = this.getRange(this.gridApi.getValue(this.currentRowField, node));
    } else {
      this.currentRowInfo = this.gridApi.getValue(this.currentRowField, node);
    }
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  getRange(id: string): string {
    if (this.resdiualWeightRange) {
      return this.resdiualWeightRange.find(x => x.id === id).range;
    } else {
      return ''
    }
  }
}
