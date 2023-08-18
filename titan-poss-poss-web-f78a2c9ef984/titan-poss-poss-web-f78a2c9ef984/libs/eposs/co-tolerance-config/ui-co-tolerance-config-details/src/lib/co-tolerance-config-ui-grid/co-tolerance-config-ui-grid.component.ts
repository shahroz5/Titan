import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnDestroy,
  OnChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import {
  InputValidatorComponent,
  DeleteRowComponent,
  EditItemComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  Command,
  ConfigTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';

export const sortShortcutKey = 'CoToleranceConfigUiGridComponent.SORT';
const componentName = 'CoToleranceConfigUiGridComponent';
@Component({
  selector: 'poss-web-co-tolerance-config-ui-grid',
  templateUrl: './co-tolerance-config-ui-grid.component.html',
  styleUrls: ['./co-tolerance-config-ui-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoToleranceConfigUiGridComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() formData;
  @Input() configDetails: any[] = [];
  @Input() weightRange: any = [];
  @Input() metaltypes: any[] = [];
  @Output() removeEvent = new EventEmitter<any>();
  @Output() responseEvent = new EventEmitter<any>();
  @Output() openLocationMappingEvent = new EventEmitter<number>();

  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() pageSize: number[];
  @Input() selectedConfigDetails;

  @Output() paginator = new EventEmitter<PageEvent>();

  coToleranceConfigUiGridComponent: CoToleranceConfigUiGridComponent = this;

  destroy$: Subject<null> = new Subject<null>();
  configId: string;
  rowData = [];
  columnDefs = [];
  configFormGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  domLayout = 'autoHeight';
  rowHeight = 50;
  animateRows = true;
  gridApi: GridApi;
  objCategoryMappings = {};
  disableEdit = true;
  editMode = false;
  configRowData: any[] = [];
  i = 1;
  selectedRowIndex = 0;
  addRowData = false;
  hasError = false;

  valueEmpty = false;
  invalidConfigValue = false;
  invalidConfigPercent = false;
  errorDialogReference;
  noConfig = false;
  invalidTolerance = false;
  defaultColDef = {
    suppressMovable: true
  };
  pageSizeOptions = [];
  minPageSize = 0;

  maxSortLimit = 2;

  @Output() sortEmitter = new EventEmitter<string[]>();

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  sort: string[] = [];

  tolerenceInGrams: string;
  tolerenceInPercent: string;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private sortService: SortDialogService,
    private shortcutService: ShortcutServiceAbstraction
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.configDetails === null) this.configDetails = [];
    if (
      changes['configDetails'] ||
      changes['weightRange'] ||
      changes['metaltypes']
    ) {
      this.disableEdit = true;
      this.configRowData = [];

      if (this.configDetails && this.configDetails.length > 0) {
        this.configDetails.forEach(config => {
          this.createRowData(config);
        });
      }
    }
  }

  createRowData(config: any) {
    if (config) {
      this.configRowData.push({
        metalTypes: this.metaltypes,
        ranges: this.weightRange,
        rangeId: config.rangeId,
        id: config.id,
        configPercent: config.configPercent,
        configValue: config.configValue,
        metalType:
          config.metalType !== ''
            ? config.metalType
            : this.metaltypes.length
            ? this.metaltypes[0].materialTypeCode
            : ''
      });
    }
  }

  ngOnInit(): void {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    this.cdr.markForCheck();
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        this.cdr.markForCheck();
      });

    this.translate
      .get([
        'pw.coWeightTolerance.metalType',
        'pw.coWeightTolerance.weightRange',
        'pw.coWeightTolerance.tolerenceInGrams',
        'pw.coWeightTolerance.tolerenceInPercent'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.tolerenceInGrams =
          translatedMessages['pw.coWeightTolerance.tolerenceInGrams'];
        this.tolerenceInPercent =
          translatedMessages['pw.coWeightTolerance.tolerenceInPercent'];

        this.columnDefs = [
          {
            headerName: translatedMessages['pw.coWeightTolerance.metalType'],
            field: 'metalType',
            width: 130,
            cellEditorSelector: params => {
              this.objCategoryMappings = {};
              params.data.metalTypes.forEach(element => {
                this.objCategoryMappings[
                  `${element.materialTypeCode}`
                ] = `${element.description} - (${element.materialTypeCode})`;
              });
              return {
                component: 'agSelectCellEditor',
                params: {
                  values: this.extractValues(this.objCategoryMappings)
                }
              };
            },
            valueFormatter: params => {
              if (params?.data !== null) {
                if (params.data?.metalType) {
                  const obj = params.data?.metalTypes.filter(
                    metalTypes => metalTypes.materialTypeCode === params.value
                  );
                  return `${obj[0]?.description} - (${obj[0]?.materialTypeCode})`;
                }
              } else {
                return this.lookupValue(this.objCategoryMappings, params.value);
              }
            },
            editable: true,
            singleClickEdit: true
          },
          {
            headerName: translatedMessages['pw.coWeightTolerance.weightRange'],
            field: 'rangeId',
            width: 130,
            cellEditorSelector: params => {
              this.objCategoryMappings = {};
              params.data.ranges.forEach(element => {
                this.objCategoryMappings[`${element.id}`] = `${element.range}`;
              });
              return {
                component: 'agSelectCellEditor',
                params: {
                  values: this.extractValues(this.objCategoryMappings)
                }
              };
            },
            valueFormatter: params => {
              if (params.data !== null) {
                if (params.data.rangeId) {
                  let obj = [];
                  if (params?.data?.ranges) {
                    obj = params.data?.ranges?.filter(
                      range => range.id === params.value
                    );
                  }
                  return obj.length > 0 ? obj[0]?.range : '';
                } else {
                  return this.lookupValue(
                    this.objCategoryMappings,
                    params.value
                  );
                }
              } else {
                return this.lookupValue(this.objCategoryMappings, params.value);
              }
            },
            editable: true,
            singleClickEdit: true
          },
          {
            headerName:
              translatedMessages['pw.coWeightTolerance.tolerenceInGrams'],
            field: 'configValue',
            width: 130,
            isWeight: true,
            editable: true,
            singleClickEdit: true,
            cellEditor: 'inputValidator',
            cellRendererFramework: EditItemComponent,
            valueFormatter: (params: { value: { value: any } }) => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return params.value.value;
                } else {
                  return ' ';
                }
              } else {
                return params.value;
              }
            },

            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return (
                  params.value.isValid === false && params.value.value !== ''
                );
              }
            }
          },
          {
            headerName:
              translatedMessages['pw.coWeightTolerance.tolerenceInPercent'],
            field: 'configPercent',
            cellClass: 'pw-form-input-width',
            width: 130,
            editable: true,
            singleClickEdit: true,
            cellEditor: 'inputValidator',
            cellRendererFramework: EditItemComponent,
            valueFormatter: (params: { value: { value: any } }) => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return params.value.value;
                } else {
                  return ' ';
                }
              } else {
                return params.value;
              }
            },

            cellClassRules: {
              'pw-gray-border': params => {
                return params.value.isValid === true;
              },
              'pw-error-border': params => {
                return (
                  params.value.isValid === false && params.value.value !== ''
                );
              }
            }
          },
          {
            headerName: '',
            minWidth: 21,
            maxWidth: 21,
            width: 21,
            cellClass: 'pw-delete-icon-width',
            cellRenderer: 'deleteRowRenderer',
            onCellClicked: this.remove.bind(this)
          }
        ];

        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName:
              translatedMessages['pw.coWeightTolerance.metalType'],
            sortAscOrder: false
          },
          {
            id: 1,
            sortByColumnName:
              translatedMessages['pw.coWeightTolerance.weightRange'],
            sortAscOrder: false
          }
        ];
      });
  }

  extractValues(mappings) {
    return Object.keys(mappings);
  }

  lookupValue(mappings, key) {
    return mappings[key];
  }

  openSortDailog() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(take(1))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        this.sort = [];
        if (sortResult.actionfrom === 'apply') {
          const sortData = sortResult.data;
          if (sortData == null || sortData.length === 0) {
            this.sortData = [];
            this.sortOrder = null;
            this.sortBy = null;
          } else {
            this.sortData = sortData;
            if (sortData.length > 0) {
              this.sortData.forEach(sort => {
                switch (sort.id) {
                  case 0:
                    this.sortBy = 'metalType';
                    break;
                  case 1:
                    this.sortBy = 'rangeId.fromRange';
                    break;
                }
                if (sort.id === 0) {
                  this.sortBy = 'metalType';
                } else if (sort.id === 1) {
                  this.sortBy = 'rangeId.fromRange';
                }
                this.sortOrder = sort.sortAscOrder ? 'asc' : 'desc';
                this.sort = [...this.sort, this.sortBy + ',' + this.sortOrder];
              });
            }
          }
          this.sortEmitter.emit(this.sort);
        }
      });
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      deleteRowRenderer: DeleteRowComponent
    };
  }

  onGridSizeChanged() {
    this.gridApi.sizeColumnsToFit();
  }

  getContext() {
    return {
      validators: {
        configPercent: [
          this.fieldValidatorsService.percentageField(this.tolerenceInPercent)
        ],
        configValue: [
          this.fieldValidatorsService.weightField(this.tolerenceInGrams)
        ]
      },
      componentParent: this.coToleranceConfigUiGridComponent,
      focusOn: 'configValue'
    };
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  rowEditingStarted(event) {
    this.editMode = true;
  }

  onSelectionChanged(event) {
    if (this.gridApi === event.api) {
      if (this.gridApi.getSelectedNodes().length) {
        this.selectedRowIndex = this.gridApi.getSelectedNodes()[0].rowIndex;
      } else {
      }
    }
  }

  remove(params) {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.i = 1;

      if (params.data.id !== '') {
        this.removeEvent.emit({
          addRangeConfigs: [],
          updateRangeConfigs: [],
          removeRangeConfigs: [params.data.id]
        });
      } else {
        this.gridApi.applyTransaction({
          remove: [params.data]
        });
        this.gridApi.redrawRows();
      }
      if (this.getAllRows().length === 0) {
        this.configRowData = [
          {
            metalTypes: this.metaltypes,
            ranges: this.weightRange,
            rangeId: '',
            id: '',
            configPercent: '',
            configValue: '',
            metalType: this.metaltypes.length
              ? this.metaltypes[0].materialTypeCode
              : ''
          }
        ];

        this.gridApi.redrawRows();
      } else {
        this.selectedRowIndex = 0;
        this.configRowData = this.getAllRows().map(ob => ({
          ...ob,
          rowId: (this.i++).toString()
        }));
      }
    }
  }

  getAllRows() {
    this.gridApi.stopEditing();
    const rowData = [];
    this.gridApi.forEachNode(node => {
      rowData.push(node.data);
    });

    return rowData;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  save() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.gridApi.stopEditing();
      this.checkValidation(this.getAllRows(), false);
      if (this.getAllRows().length === 0) {
        this.noConfig = true;
        this.showErrorPopUp();
      } else if (!this.noConfig && !this.valueEmpty && !this.invalidTolerance) {
        this.responseEvent.emit(this.prepareResponse(this.getAllRows()));
      }
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
      this.weightRange.find((o, i) => {
        if (o.id === rangeID) {
          rowID = o.rowId;
          return;
        }
      });
      addSchemeDetails.push({
        rangeId: rangeID,
        rowId: rowID,
        metalType:
          typeof value.metalType === 'object'
            ? value.metalType?.value
            : value.metalType,
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
          type: ConfigTypeEnum.ORDER_CO_TOLERANCE_CONFIG
        }
      });
    }

    for (const value of updatedData) {
      const rangeID =
        typeof value.rangeId === 'object'
          ? value.rangeId?.value
          : value.rangeId;
      let rowID = null;
      this.weightRange.find((o, i) => {
        if (o.id === rangeID) {
          rowID = o.rowId;
          return;
        }
      });
      updateSchemeDetails.push({
        rangeId: rangeID,
        rowId: rowID,
        id: typeof value.id === 'object' ? value.id?.value : value.id,
        metalType:
          typeof value.metalType === 'object'
            ? value.metalType?.value
            : value.metalType,
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
          type: ConfigTypeEnum.ORDER_CO_TOLERANCE_CONFIG
        }
      });
    }

    return {
      addRangeConfigs: addSchemeDetails,
      updateRangeConfigs: updateSchemeDetails
    };
  }

  addRow() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.addRowData = true;

      this.checkValidation(this.getAllRows(), true);
    }
  }

  checkValidation(rowData, addNewRow) {
    this.gridApi.stopEditing();
    this.invalidTolerance = false;
    this.valueEmpty = false;
    this.selectedRowIndex = this.getAllRows().length;
    for (const currentRowData of this.getAllRows()) {
      if (
        currentRowData?.metalType === undefined ||
        currentRowData?.rangeId === undefined
      ) {
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
          (typeof currentRowData?.metalType === 'object'
            ? currentRowData?.metalType.value === ''
            : currentRowData?.metalType.value) ||
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

          this.weightRange.find((obj, i) => {
            if (obj.id === rangeID) {
              isActiveRange = true;
              return;
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
        (typeof node.data.configValue === 'object' &&
          !node.data.configValue.isValid) ||
        (typeof node.data.configPercent === 'object' &&
          !node.data.configPercent.isValid)
      ) {
        this.invalidTolerance = true;
      }
    });

    if (this.valueEmpty || this.invalidTolerance) {
      this.showErrorPopUp();
    }
    if (!this.valueEmpty && !this.invalidTolerance && addNewRow) {
      this.addData();
    }
  }

  showErrorPopUp() {
    if (this.valueEmpty) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.ERROR,
          message: 'pw.alertPopup.emptyRequiredFileds'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          this.invalidTolerance = false;
        });
    } else if (this.noConfig) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.ERROR,
          message: 'pw.alertPopup.addConfigDetails'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          this.invalidTolerance = false;
        });
    } else if (this.invalidTolerance) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.ERROR,
          message: 'pw.alertPopup.invalidTolerance'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          this.invalidTolerance = false;
        });
    }
  }

  locationMapping() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      let count = this.gridApi.getDisplayedRowCount();
      this.openLocationMappingEvent.emit(count);
    }
  }

  addData() {
    if (this.addRowData === true && !this.valueEmpty) {
      const gridData = this.getAllRows();
      gridData.splice(this.selectedRowIndex + 1, 0, {
        metalTypes: this.metaltypes,
        ranges: this.weightRange,
        rangeId: '',
        id: '',
        configPercent: '',
        configValue: '',
        metalType: this.metaltypes.length
          ? this.metaltypes[0].materialTypeCode
          : ''
      });
      this.gridApi.setRowData(gridData);
    }
  }
}
