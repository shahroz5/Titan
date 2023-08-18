import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  OnDestroy,
  SimpleChanges,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import {
  SelectedOptionsData,
  PaymentModesConfig,
  SelectedResponse,
  CNCancelation
} from '@poss-web/shared/models';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GridOptions, GridReadyEvent, GridApi } from 'ag-grid-community';
import {
  InputValidatorComponent,
  CheckboxGridCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { PaymentModesCellComponent } from '@poss-web/shared/components/ui-ag-grid';

@Component({
  selector: 'poss-web-payment-configuration-detail-items',
  templateUrl: './payment-configuration-detail-items.component.html',
  styleUrls: ['./payment-configuration-detail-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentConfigurationDetailItemsComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() paymentModes: PaymentModesConfig[];
  @Input() transactionTypes: {
    rowKey: string;
    description: string;
    formGroup: FormGroup;
    value: string;
    condition: string;
  }[];
  @Input() selectedOptions: SelectedOptionsData;
  @Input() hasUpdated: boolean;
  @Input() hasSaved: boolean;
  @Input() tcsPaymentModes;

  @Output() loadTransactionByPaymentName = new EventEmitter<{
    paymentName: string;
    newCount: number;
  }>();
  @Output() moveElementUp = new EventEmitter<any>();
  @Output() updateCount = new EventEmitter<{ count: number; id: string }>();
  @Output() hasChange = new EventEmitter<boolean>();
  originalTcsPaymentMode = [];

  formGroup: FormGroup;
  response: {
    map: any;
    configDetails: any;
    removedArray: string[];
    updateConfigs: any[];
  };
  cnSelected: boolean;
  valuesArray = [];
  configDetails: any;
  context = this;
  separator = '--__--';
  selectedOptionsWithIdMap: Map<string, string> = new Map<string, string>();
  selectedOptionsMap: Map<string, any[]> = new Map<string, any[]>();
  savedMapped: Map<string, any[]> = new Map<string, any[]>();
  configDetailsMap: Map<string, any[]> = new Map<string, any[]>();
  selectedResponse: SelectedResponse[] = [];
  removedArray: string[] = [];
  updateConfigs: any[] = [];
  transactionTypesData: {
    rowKey: string;
    formGroup: FormGroup;
    value: string;
    condition: string;
  }[];
  params: string;
  selectedRowName: string;
  selected: boolean;
  rowSelection = 'multiple';
  isGreaterthan: string;
  isSmallerthan: string;
  hasNewData: boolean;
  hasCellValueChanged = false;
  hasMapDataChange: boolean;
  destroy$ = new Subject();
  api: GridApi;
  firstGridAPI: GridApi;
  rowClassRules;
  gridOptions: GridOptions;
  getRowHeight: any;
  defaultColDef = {
    autoHeight: true,
    suppressMovable: true
  };
  paymentConfigurationDetailItemsComponent: PaymentConfigurationDetailItemsComponent = this;
  paymentModecolumnDefs = [
    {
      headerName: 'Select payment modes',
      field: 'title',
      minWidth: 350,
      maxWidth: 350,
      cellRendererFramework: PaymentModesCellComponent,
      cellClassRules: {
        'pw-isActive': params => {
          if (this.selectedRowName === params.value) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  ];

  transactionTypecolumnDefs = [
    {
      headerName: 'Transaction type',
      field: 'description',
      minWidth: 100,
      maxWidth: 200,
      cellStyle: { 'white-space': 'normal' }
    },
    {
      headerName: 'Active/InActive',
      field: 'Active/inActive',
      cellRendererFramework: CheckboxGridCellComponent,
      resizable: true,
      minWidth: 100,
      maxWidth: 193
    },

    {
      headerName: 'Condition type',
      field: 'condition',
      minWidth: 100,
      maxWidth: 230,
      resizable: true,

      editable: params => {
        if (params.data.rowKey === CNCancelation.cn) {
          return true;
        } else {
          return false;
        }
      },
      cellEditorSelector: params => {
        if (params.data.rowKey === CNCancelation.cn) {
          return {
            component: 'agSelectCellEditor',
            params: {
              values: this.getDropDownValues()
            }
          };
        }
      }
    },

    {
      headerName: 'Value',
      field: 'value',
      minWidth: 100,
      maxWidth: 290,

      valueFormatter: params => {
        if (typeof params.value === 'object') {
          if (params.value.value) {
            return params.value.value;
          } else {
            return '';
          }
        } else {
          return params.value;
        }
      },
      cellEditor: 'inputValidator',
      isAmount: true,
      editable: params => {
        if (params.data.rowKey === CNCancelation.cn) {
          return true;
        } else {
          return false;
        }
      },
      resizable: true
    }
  ];
  hasTcsPaymentModeChange = false;
  selectAll = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.formGroup = new FormGroup({
      value: new FormControl(),
      condition: new FormControl()
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasUpdated === true || this.hasSaved) {
      this.selectedOptionsWithIdMap.clear();
      this.selectedOptionsMap.clear();
      this.removedArray = [];
      this.configDetails = [];
      this.updateConfigs = [];
      this.response = null;
      this.hasCellValueChanged = false;
    }
    if (
      changes['transactionTypes'] ||
      changes['paymentModes'] ||
      changes['selectedOptions']
    ) {
      this.componentInit();
    }
  }

  componentInit() {
    if (this.selectedOptions && this.selectedOptions.selectedMap) {
      this.savedMapped = this.selectedOptions.selectedMap;
      this.selectedResponse = this.selectedOptions.selectedResponse;

      this.selectedResponse.forEach(r => {
        this.selectedOptionsWithIdMap.set(
          this.getkey(r.columnHeaderKey, r.rowHeaderKey),
          r.id
        );
        if (
          r &&
          r.rowHeaderKey === CNCancelation.cn &&
          r.configDetails &&
          r.configDetails.value &&
          r.configDetails.condition
        ) {
          this.patchCellValues(r);
        }
      });

      if (this.savedMapped.has(this.selectedRowName)) {
        this.savedMapped.forEach((v, k) => {
          if (k === this.selectedRowName) {
            if (v.includes(CNCancelation.cn)) {
              this.cnSelected = true;
            } else {
              this.cnSelected = false;
            }
          }
        });
        const selectedArray = this.transactionTypes.filter(t =>
          this.retriveFromsavedMapped(this.selectedRowName).includes(t.rowKey)
        );
        this.selectTransactionTypes(selectedArray);
      }
    }
  }

  patchCellValues(r: any) {
    this.transactionTypes.forEach(t => {
      if (t.rowKey === CNCancelation.cn) {
        t.condition = r.configDetails
          ? r.configDetails.condition
            ? r.configDetails.condition
            : ''
          : '';
        this.formGroup.controls['condition'].setValue(t.condition);
      }
      if (t.rowKey === CNCancelation.cn) {
        t.value = r.configDetails
          ? r.configDetails.value
            ? r.configDetails.value
            : ''
          : '';
        this.formGroup.controls['value'].setValue(t.value);
      }
    });

    this.api.refreshCells();
  }

  gridReadySecond(params: GridReadyEvent) {
    if (params && params.api) {
      this.api = params.api;
    }
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  getContext() {
    return {
      validators: {
        value: [this.fieldValidatorsService.requiredField('value')]
      },
      componentParent: this.paymentConfigurationDetailItemsComponent
    };
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent
    };
  }
  getDropDownValues(): string[] {
    this.translate
      .get([
        'pw.paymentConfiguration.isGreaterthan',
        'pw.paymentConfiguration.isSmallerthan'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.isGreaterthan =
          translatedMsg['pw.paymentConfiguration.isGreaterthan'];
        this.isSmallerthan =
          translatedMsg['pw.paymentConfiguration.isSmallerthan'];
      });
    return [this.isGreaterthan, this.isSmallerthan];
  }

  checkSelectAll() {
    if (
      this.tcsPaymentModes.filter(ob => ob.checked).length ===
      this.tcsPaymentModes.length
    ) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }
  selectAllTcsPaymentMode(event) {
    this.selectAll = event.checked;
    this.tcsPaymentModes.map(ob => {
      this.tcsPaymentModes[this.tcsPaymentModes.indexOf(ob)] = {
        ...this.tcsPaymentModes[this.tcsPaymentModes.indexOf(ob)],
        checked: event.checked
      };
    });

    this.tcsPaymentModeChange();
  }
  onTcsPaymentSelection(tcsPaymentMode, checked) {


    this.tcsPaymentModes.map(ob => {
      if (ob.code === tcsPaymentMode.code) {
        this.tcsPaymentModes[this.tcsPaymentModes.indexOf(ob)] = {
          ...this.tcsPaymentModes[this.tcsPaymentModes.indexOf(ob)],
          checked: checked
        };
      }
    });

    this.checkSelectAll();
    this.tcsPaymentModeChange();
  }
  tcsPaymentModeChange() {
    this.hasTcsPaymentModeChange = true;

    this.hasChange.emit(
      this.hasTcsPaymentModeChange ||
        this.hasCellValueChanged ||
        !!this.removedArray.length ||
        !!this.updateConfigs.length
    );
  }
  selectionChange(isChecked: boolean, transactionName: string) {
    this.hasUpdated = false;
    this.hasSaved = false;

    if (isChecked) {
      if (this.isSavedConfig(this.selectedRowName, transactionName)) {
        if (
          !this.savedMapped
            .get(this.selectedRowName)
            .includes([transactionName])
        ) {
          this.savedMapped.set(
            this.selectedRowName,
            this.savedMapped.get(this.selectedRowName).concat(transactionName)
          );
          const id = this.selectedOptionsWithIdMap.get(
            this.getkey(this.selectedRowName, transactionName)
          );
          const index = this.removedArray.indexOf(id);
          if (index > -1) {
            this.removedArray.splice(index, 1);
          }
        }
      } else {
        this.valuesArray.push(transactionName);
        this.addToSelctedOptionsMap(this.selectedRowName, this.valuesArray);
      }
      if (transactionName === 'CM') {
        if (
          !this.tcsPaymentModes.map(p => p.code).includes(this.selectedRowName)
        ) {
          this.tcsPaymentModes.push({
            code: this.selectedRowName,
            checked: false,
            id: null
          });
          this.tcsPaymentModes = this.tcsPaymentModes.sort(
            (paymentMode1, paymentMode2) =>
              paymentMode1.code.toLocaleLowerCase() >
              paymentMode2.code.toLocaleLowerCase()
                ? 1
                : -1
          );
        }
      }
    } else {
      if (transactionName === 'CM') {
        if (
          this.tcsPaymentModes.map(p => p.code).includes(this.selectedRowName)
        ) {
          this.tcsPaymentModes = this.tcsPaymentModes.filter(
            f => f.code !== this.selectedRowName
          );
        }
      }
      if (this.isSavedConfig(this.selectedRowName, transactionName)) {
        const id = this.selectedOptionsWithIdMap.get(
          this.getkey(this.selectedRowName, transactionName)
        );
        if (id) {
          this.removedArray.push(id);
          const values = this.retriveFromsavedMapped(this.selectedRowName);
          const index = values.indexOf(transactionName);
          if (index > -1) {
            values.splice(index, 1);
          }
          this.savedMapped.set(this.selectedRowName, values);
        }
      } else {
        this.hasCellValueChanged = false;
        let values = this.retriveFromSelctedOptionsMap(this.selectedRowName);

        const index = values.indexOf(transactionName);
        if (index > -1) {
          values.splice(index, 1);
        }
        if (transactionName === CNCancelation.cn) {
          values = values.filter(i => typeof i === 'string');
          this.patchCellValues(values);
        }

        if (!values.length) {
          this.selectedOptionsMap.delete(this.selectedRowName);
        } else {
          this.addToSelctedOptionsMap(this.selectedRowName, values);
        }
      }
    }
    this.checkSelectAll();
    this.tcsPaymentModeChange();
    const count = this.getCount(this.selectedRowName);
    this.updateCount.emit({ count: count, id: this.selectedRowName });
    this.prepareResponse();
  }

  isSavedConfig(paymentName: string, transactionName: string): boolean {
    return this.selectedOptionsWithIdMap.has(
      this.getkey(paymentName, transactionName)
    );
  }

  getkey(p: string, t: string): string {
    return p + this.separator + t;
  }

  addToSelctedOptionsMap(key: string, valuesArray: any[]) {
    if (valuesArray.length) {
      if (valuesArray.includes(CNCancelation.cn)) {
        valuesArray.forEach(i => {
          if (i && i.transactionName === CNCancelation.cn) {
            this.hasCellValueChanged = true;
          } else if (i === CNCancelation.cn) {
            this.api.setFocusedCell(0, 'Condition Type');
            this.api.setFocusedCell(0, 'Value');
            this.hasCellValueChanged = false;
          }
        });
      } else {
        this.hasCellValueChanged = true;
      }
    } else {
      this.hasCellValueChanged = false;
    }

    this.selectedOptionsMap.set(key, valuesArray);
  }

  getCount(key: string) {
    const len1 =
      this.selectedOptionsMap.get(key) &&
      this.selectedOptionsMap.get(key).length
        ? this.selectedOptionsMap.get(key).filter(i => typeof i === 'string')
            .length
        : 0;
    const len2 =
      this.savedMapped.get(key) &&
      this.savedMapped.get(key).filter(i => typeof i === 'string').length
        ? this.savedMapped.get(key).length
        : 0;
    return len1 + len2;
  }

  retriveFromSelctedOptionsMap(key: string) {
    return this.selectedOptionsMap.get(key);
  }

  retriveFromsavedMapped(key: string) {
    return this.savedMapped.get(key);
  }

  ngOnInit() {
    for (const tcsPc of this.tcsPaymentModes) {
      this.originalTcsPaymentMode.push({
        code: tcsPc.code,
        id: tcsPc.id,
        checked: tcsPc.checked
      });
    }
    this.checkSelectAll();
  }

  gridReady(params: GridReadyEvent) {
    this.firstGridAPI = params.api;
    let nodes;
    params.api.forEachNode(node => {
      if (node.rowIndex === 0) {
        nodes = node;
        node.setSelected(true);
        this.selectedRowName = node.data ? node.data.title : '';
      }
    });

    params.api.setFocusedCell(nodes.rowIndex, 'title');
  }

  onSelectionChanged(event) {
    this.tcsPaymentModes = this.tcsPaymentModes.concat(
      this.originalTcsPaymentMode.filter(
        ob => !this.tcsPaymentModes.map(ob1 => ob1.code).includes(ob.code)
      )
    );

    this.hasUpdated = false;
    this.hasSaved = false;
    this.savedMapped.clear();
    this.params = this.activatedRoute.snapshot.params['_configId'];
    const selectedRow = event.api.getSelectedRows();
    if (selectedRow && selectedRow.length) {
      this.selectedRowName = selectedRow[0] ? selectedRow[0].title : '';
      const ar = this.selectedOptionsMap.get(this.selectedRowName);

      if (ar && ar.length) {
        ar.forEach(v1 => {
          this.patchCellValues(v1);
        });
      } else {
        this.patchCellValues({});
      }
    }

    const newlySelectedcount = this.getCount(this.selectedRowName);
    if (this.params !== 'new') {
      this.loadTransactionByPaymentName.emit({
        paymentName: this.selectedRowName,
        newCount: newlySelectedcount
      });
    } else {
      const paymentModes = [...this.paymentModes];
      paymentModes.splice(
        paymentModes.findIndex(ob => ob.title === selectedRow[0].title),
        1
      );
      paymentModes.unshift(selectedRow[0]);
      this.firstGridAPI.setRowData(paymentModes);
      this.firstGridAPI.redrawRows();
    }

    this.valuesArray = [];
    if (this.savedMapped.has(this.selectedRowName)) {
      let newlySelectedUnsaved;
      this.unSelectAllTransactionTypes(); //to reset
      if (this.selectedOptionsMap.has(this.selectedRowName)) {
        newlySelectedUnsaved = this.transactionTypes.filter(t =>
          this.retriveFromSelctedOptionsMap(this.selectedRowName).includes(
            t.rowKey
          )
        );
      }
      const selectedArry = this.transactionTypes.filter(t =>
        this.retriveFromsavedMapped(this.selectedRowName).includes(t.rowKey)
      );
      this.selectTransactionTypes(selectedArry.concat(newlySelectedUnsaved));
    } else {
      this.unSelectAllTransactionTypes(); //to reset the second grid
      //in edit part if user has selcted new combination
      if (this.selectedOptionsMap.has(this.selectedRowName)) {
        const selectedArray = this.transactionTypes.filter(t =>
          this.retriveFromSelctedOptionsMap(this.selectedRowName).includes(
            t.rowKey
          )
        );
        this.selectTransactionTypes(selectedArray);
      }
    }
  }

  selectTransactionTypes(
    selectedArray: {
      rowKey: string;
      formGroup: FormGroup;
      value: string;
      condition: string;
    }[]
  ) {
    selectedArray.forEach(transaction => {
      if (transaction && transaction.formGroup) {
        const formGroup = transaction.formGroup;
        formGroup.controls['Active/inActive'].setValue(true);
      }
    });
  }

  unSelectAllTransactionTypes() {
    this.transactionTypes.forEach(transaction => {
      if (transaction && transaction.formGroup) {
        const formGroup = transaction.formGroup;
        formGroup.controls['Active/inActive'].setValue(false);
      }
    });
  }

  onCellValueChanged(changeEvent) {
    this.configDetails = {
      value:
        changeEvent.data.value.value === undefined
          ? this.formGroup.get('value').value
          : changeEvent.data.value.value,
      condition:
        changeEvent.data.value.value === undefined
          ? this.formGroup.get('condition').value
          : changeEvent.data.condition
    };

    if (this.configDetails.value && this.configDetails.condition) {
      if (
        this.selectedOptionsWithIdMap.has(
          this.getkey(this.selectedRowName, changeEvent.data.rowKey)
        )
      ) {
        this.updateConfigs.push({
          configDetailId: this.selectedOptionsWithIdMap.get(
            this.getkey(this.selectedRowName, changeEvent.data.rowKey)
          ),
          configsDto: {
            configDetails: this.configDetails,
            paymentMode: this.selectedRowName,
            transactionType: changeEvent.data.rowKey
          }
        });
      } else {
        this.selectedOptionsMap.forEach((v, k) => {
          if (v.includes(CNCancelation.cn)) {
            this.valuesArray = this.valuesArray.concat([
              { transactionName: 'CN', configDetails: this.configDetails }
            ]);
            this.addToSelctedOptionsMap(this.selectedRowName, this.valuesArray);
          } else {
          }
        });
      }
    }

    this.prepareResponse();
  }
  prepareResponse() {
    this.response = {
      map: this.selectedOptionsMap,
      configDetails: this.configDetails,
      removedArray: this.removedArray,
      updateConfigs: this.updateConfigs
    };

    this.hasChange.emit(
      this.hasTcsPaymentModeChange ||
        this.hasCellValueChanged ||
        !!this.removedArray.length ||
        !!this.updateConfigs.length
    );
  }

  @HostListener('keydown', ['$event'])
  private onKeydown(event: KeyboardEvent): void {
    const focusedCell = this.api.getFocusedCell();
    const field = focusedCell?.column.getColDef().field;
    const rowIndex = focusedCell.rowIndex;
    const rowNode = this.api.getRowNode(rowIndex.toString());
    if (event.code === 'Space') {
      if (field === 'Active/inActive') {
        rowNode.data.formGroup
          .get('Active/inActive')
          .patchValue(!rowNode.data.formGroup.get('Active/inActive').value);
      }
    }
  }

  getReponse() {
    return this.response;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
