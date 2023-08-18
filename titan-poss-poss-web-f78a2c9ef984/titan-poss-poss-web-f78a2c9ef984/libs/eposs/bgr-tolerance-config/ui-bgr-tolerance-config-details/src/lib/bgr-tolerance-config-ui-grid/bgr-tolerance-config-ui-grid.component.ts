import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnDestroy,
  OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import {
  InputValidatorComponent,
  DeleteRowComponent,
  EditItemComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { BgrToleranceConfigEditPopupComponent } from '../bgr-tolerance-config-edit-popup/bgr-tolerance-config-edit-popup.component';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-bgr-tolerance-config-ui-grid',
  templateUrl: './bgr-tolerance-config-ui-grid.component.html',
  styleUrls: ['./bgr-tolerance-config-ui-grid.component.scss']
})
export class BgrToleranceConfigUiGridComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() formData;
  @Input() configDetails: any[] = [];
  @Input() weightRange: any = [];
  @Input() metaltypes: any[] = [];
  @Input() deleteId: string;
  @Input() selectedConfigDetails;
  @Output() removeEvent = new EventEmitter<any>();
  @Output() responseEvent = new EventEmitter<any>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  bgrToleranceConfigUiGridComponent: BgrToleranceConfigUiGridComponent = this;

  destroy$: Subject<null> = new Subject<null>();
  configId: string;
  rowData = [];
  columnDefs = [];
  configFormGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  domLayout = 'autoHeight';
  rowHeight = 35;
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

  unDeletedRowList = [];
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
    //TODO add changes for ranges and meatlTypes
    if (this.configDetails === null) this.configDetails = [];
    if (
      changes['configDetails'] ||
      changes['weightRange'] ||
      changes['metaltypes'] ||
      changes['deleteId']
    ) {
      console.log('configDetails :', this.configDetails);
      if (this.deleteId) {
        console.log('DELET ID :', this.deleteId);
        const removableDataList = this.getAllRows().filter((data: any) => {
          return data.id === this.deleteId;
        });
        console.log('removableDataList :', removableDataList);
        this.gridApi.applyTransaction({
          remove: [removableDataList[0]]
        });

        if (this.getAllRows().length === 0) {
          this.configRowData = [
            {
              metalTypes: this.metaltypes,
              ranges: this.weightRange,
              rangeId: '',
              id: '',
              configPercent: '',
              configValue: '',
              metalType: ''
            }
          ];
        } else {
          this.selectedRowIndex = 0;
          this.configRowData = this.getAllRows().map(ob => ({
            ...ob,
            rowId: (this.i++).toString()
          }));
        }
      } else {
        this.disableEdit = true;
        this.configRowData = [];
        if (this.configDetails) {
          this.configDetails.forEach(config => {
            this.createRowData(config);
          });
        }
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
        metalType: config.metalType
      });
    } else {
      this.configRowData.push({
        metalTypes: this.metaltypes,
        ranges: this.weightRange,
        rangeId: '',
        id: '',
        configPercent: '',
        configValue: '',
        metalType: ''
      });
    }
  }
  ngOnInit(): void {
    this.cdr.markForCheck();
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        this.cdr.markForCheck();
      });

    this.columnDefs = [
      {
        headerName: 'MetalType',
        field: 'metalType',
        width: 130,
        cellEditorSelector: (params: any) => {
          this.objCategoryMappings = {};
          params.data.metalTypes.forEach(element => {
            this.objCategoryMappings[
              `${element.materialTypeCode}`
            ] = `${element.description}`;
          });
          return {
            component: 'agSelectCellEditor',
            params: {
              values: this.extractValues(this.objCategoryMappings)
            }
          };
        },
        valueFormatter: (params: any) => {
          if (params?.data !== null) {
            if (params.data?.metalType) {
              const obj = params.data?.metalTypes.filter(
                metalTypes => metalTypes.materialTypeCode === params.value
              );
              return obj[0]?.description;
            }
          } else {
            return this.lookupValue(this.objCategoryMappings, params.value);
          }
        },
        editable: true,
        singleClickEdit: true,
        sortable: true,
        sortingOrder: ['asc', 'desc']
      },
      {
        headerName: 'Weight Range',
        field: 'rangeId',
        width: 130,
        cellEditorSelector: (params: any) => {
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
        valueFormatter: (params: any) => {
          if (params.data !== null) {
            if (params?.data?.rangeId && params?.data?.ranges) {
              const obj = params.data.ranges.filter(
                range => range.id === params.value
              );
              return obj.length > 0 ? obj[0]?.range : '';
            } else {
              return this.lookupValue(this.objCategoryMappings, params.value);
            }
          } else {
            return this.lookupValue(this.objCategoryMappings, params.value);
          }
        },
        editable: true,
        singleClickEdit: true,
        resizable: true
      },
      {
        headerName: 'Tolerance in Grams',
        field: 'configValue',
        width: 130,

        isWeight: true,
        editable: true,
        resizable: true,
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
          'pw-gray-border': (params: any) => {
            return params.value.isValid === true;
          },
          'pw-error-border': params => {
            return params.value.isValid === false && params.value.value !== '';
          }
        }
      },
      {
        headerName: 'Tolerance in Percent',
        field: 'configPercent',
        width: 130,
        resizable: true,

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
          'pw-gray-border': (params: any) => {
            return params.value.isValid === true;
          },
          'pw-error-border': (params: any) => {
            return params.value.isValid === false && params.value.value !== '';
          }
        }
      },

      {
        headerName: '',
        field: 'delete',

        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width',
        cellRenderer: 'deleteRowRenderer',
        suppressMovable: true,
        onCellClicked: this.remove.bind(this)
      }
    ];
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

  extractValues(mappings) {
    return Object.keys(mappings);
  }
  lookupValue(mappings, key) {
    return mappings[key];
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
          this.fieldValidatorsService.percentageField('Tolerance in Percent')
        ],
        configValue: [
          this.fieldValidatorsService.weightField('Tolerance in Grams')
        ]
      },
      componentParent: this.bgrToleranceConfigUiGridComponent,
      focusOn: 'configValue',
      gridApi: this.gridApi
    };
  }
  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    const sort = [
      {
        colId: 'metalType',
        sort: 'asc'
      }
    ];
    this.gridApi.setSortModel(sort);
  }

  rowEditingStarted(event) {
    this.editMode = true;
  }
  onSelectionChanged(event) {
    if (this.gridApi === event.api) {
      if (this.gridApi.getSelectedNodes().length) {
        this.selectedRowIndex = this.gridApi.getSelectedNodes()[0].rowIndex;
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

  save() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
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
  prepareResponse(array: any[]) {
    const newData = array.filter(data => data.id === '');
    const updatedData = array.filter(data => data.id !== '');
    const addSchemeDetails = [];
    const updateSchemeDetails = [];
    const newDataRowId = updatedData.length;
    const updateDataRowId = 0;
    for (const value of newData) {
      const rangeID =
        typeof value.rangeId === 'object'
          ? value.rangeId?.value
          : value.rangeId;
      let rowID = null;

      this.weightRange.find((o, i) => {
        if (o.id === rangeID) {
          rowID = o.rowId;
          return; // stop searching
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
          type: null
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
          return; // stop searching
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
          type: this.selectedConfigDetails.ruleType
        }
      });
    }

    return {
      addRangeConfigs: addSchemeDetails,
      updateRangeConfigs: updateSchemeDetails
    };
  }

  /////////////
  addRow() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
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

    let currentRowData;
    currentRowData = rowData[this.selectedRowIndex - 1];

    if (
      currentRowData?.metalType === undefined ||
      currentRowData?.rangeId === undefined
    ) {
      if (this.getAllRows().length > 0) {
        this.valueEmpty = true;
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
        } else {
          this.valueEmpty = false;
        }
      } else {
        this.valueEmpty = false;
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
    if (this.valueEmpty || this.noConfig || this.invalidTolerance) {
      if (
        this.dialog.openDialogs.filter(ref => ref === this.errorDialogReference)
          .length === 0
      ) {
        this.errorDialogReference = this.dialog.open(
          BgrToleranceConfigEditPopupComponent,
          {
            width: '500px',
            height: 'auto',
            disableClose: true,
            data: {
              valueEmpty: this.valueEmpty,
              noConfig: this.noConfig,
              invalidConfigValues: this.invalidTolerance
            }
          }
        );
        this.errorDialogReference.afterClosed().subscribe(() => {
          this.invalidTolerance = false;
        });
      }
    } else {
    }
  }
  locationMapping() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.openLocationMappingEvent.emit(true);
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
        metalType: ''
      });
      this.gridApi.setRowData(gridData);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
