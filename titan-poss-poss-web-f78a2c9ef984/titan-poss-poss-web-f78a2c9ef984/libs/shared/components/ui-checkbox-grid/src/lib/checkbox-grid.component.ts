import { FormGroup, FormControl } from '@angular/forms';
import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  CheckBoxHeader,
  CheckBoxSelectedOption,
  CheckBoxResponse,
  optionAdapter,
  optionSelector,
  CheckBoxState
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { CheckboxGridCellComponent } from '@poss-web/shared/components/ui-ag-grid';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

interface ColumnDef {
  field: string;
  headerName: string;
  cellRendererFramework?: any;
  resizable?: boolean;
  pinned?: string;
  suppressMovable: boolean;
  minWidth?: number;
  maxWidth?: number;
  suppressSizeToFit?: boolean;
  width?: number;
  flex?: number;
  headerTooltip?: string;
  tooltipShowDelay?: string;
}
interface RowDef {
  rowName: string;
  rowKey: string;
  formGroup: FormGroup;
}
@Component({
  selector: 'poss-web-checkbox-grid',
  templateUrl: './checkbox-grid.component.html',
  styleUrls: ['./checkbox-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxGridComponent implements OnDestroy, OnChanges {
  @Input() columnHeaderTitle: string;
  @Input() rowHeaderTitle: string;
  @Input() columnHeaders: CheckBoxHeader[] = [];
  @Input() rowHeaders: CheckBoxHeader[] = [];
  @Input() selectedOptions: CheckBoxSelectedOption[] = [];
  @Input() maxOptionsLimit = 0;
  @Output() hasChange = new EventEmitter<boolean>();
  @Input() autoHeight = false;
  @Input() disableCheckBox = false;

  params: GridReadyEvent;

  get domLayout() {
    return this.autoHeight ? 'autoHeight' : null;
  }

  get rowHeaderColumnDefTitle() {
    return this.rowHeaderTitle + ' | ' + this.columnHeaderTitle;
  }

  selectedOptionsWithIdMap: Map<string, string> = new Map<string, string>();
  colSelectionCount: Map<string, number> = new Map<string, number>();

  destroy$ = new Subject();
  checkBoxForm: FormGroup;
  separator = '--__--';
  selectAllRowKey = 'selectAll';
  api: GridApi;
  selectAllTitle;

  response: CheckBoxState = {
    added: optionAdapter.getInitialState(),
    removed: []
  };

  columnDefs: ColumnDef[] = [];
  rowData: RowDef[] = [];

  defaultColDef = {
    resizable: true,
    suppressMovable: true
  };
  // context: any = {
  //   componentParent: this,
  //   disableCheckBox: this.disableCheckBox
  // };
  component: CheckboxGridComponent = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.translate
      .get('pw.checkboxGrid.selectAllRow')
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.selectAllTitle = translatedMessage;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['selectedOptions'] ||
      changes['rowHeaders'] ||
      changes['columnHeaders']
    ) {
      this.createForm();
      setTimeout(() => {
        this.params?.api?.sizeColumnsToFit();
      }, 10);
    }
  }

  createForm() {
    this.response = {
      added: optionAdapter.getInitialState(),
      removed: []
    };

    this.selectedOptionsWithIdMap = new Map();
    this.colSelectionCount = new Map();

    this.checkBoxForm = new FormGroup({});
    this.columnDefs = [
      {
        field: 'rowName',
        headerName: this.rowHeaderColumnDefTitle,
        suppressMovable: true,
        resizable: true,
        pinned: 'left',
        width: 200,
        minWidth: 200
      }
    ];
    this.rowData = [];

    if (this.columnHeaders.length <= this.maxOptionsLimit) {
      this.columnHeaders.forEach(col => {
        this.columnDefs.push({
          field: col.key,
          headerName: col.title,
          cellRendererFramework: CheckboxGridCellComponent,
          suppressMovable: true,
          headerTooltip: col.title,
          tooltipShowDelay: '300ms',
          resizable: false,
          flex: 1
        });
        this.colSelectionCount.set(col.key, 0);
      });

      const selectAllFormGroup = this.getOptionsFormGroup();
      this.checkBoxForm.addControl(this.selectAllRowKey, selectAllFormGroup);

      this.rowData.push({
        rowName: this.selectAllTitle,
        rowKey: this.selectAllRowKey,
        formGroup: selectAllFormGroup
      });

      this.rowHeaders.forEach(row => {
        const formGroup = this.getOptionsFormGroup();
        this.checkBoxForm.addControl(row.key, formGroup);

        this.rowData.push({
          rowName: row.title,
          rowKey: row.key,
          formGroup: formGroup
        });
      });

      this.selectedOptions.forEach(o => {
        this.colSelectionCount.set(
          o.columnHeaderKey,
          this.colSelectionCount.get(o.columnHeaderKey) + 1
        );
        const rowForm = this.checkBoxForm.get(o.rowHeaderKey);
        if (rowForm) {
          const columnControl = rowForm.get(o.columnHeaderKey);
          if (columnControl) {
            columnControl.setValue(true);
          }
        }
        this.selectedOptionsWithIdMap.set(
          this.getRowColKey(o.rowHeaderKey, o.columnHeaderKey),
          o.id
        );
      });

      this.colSelectionCount.forEach((value, key) => {
        if (value === this.rowHeaders.length) {
          this.checkBoxForm.get(this.selectAllRowKey).get(key).setValue(true);
        }
      });
    }
  }

  private getOptionsFormGroup(): FormGroup {
    const optionsFormGroup = new FormGroup({});

    this.columnHeaders.forEach(columnHeader => {
      optionsFormGroup.addControl(columnHeader.key, new FormControl(false));
    });
    return optionsFormGroup;
  }

  getValue(): CheckBoxResponse {
    return {
      added: optionSelector.selectAll(this.response.added),
      removed: this.response.removed
    };
  }

  selectionChange(isChecked, rowHeaderKey, columnHeaderKey, checkAll = true) {
    if (isChecked) {
      if (
        this.selectedOptionsWithIdMap.has(
          this.getRowColKey(rowHeaderKey, columnHeaderKey)
        )
      ) {
        const id = this.selectedOptionsWithIdMap.get(
          this.getRowColKey(rowHeaderKey, columnHeaderKey)
        );
        const index = this.response.removed.indexOf(id);
        if (index >= 0) {
          this.response.removed.splice(index, 1);
        }
      } else {
        this.response.added = optionAdapter.addOne(
          {
            rowHeaderKey,
            columnHeaderKey
          },
          this.response.added
        );
      }

      if (checkAll) {
        this.colSelectionCount.set(
          columnHeaderKey,
          this.colSelectionCount.get(columnHeaderKey) + 1
        );

        if (
          this.colSelectionCount.get(columnHeaderKey) === this.rowHeaders.length
        ) {
          this.checkBoxForm
            .get(this.selectAllRowKey)
            .get(columnHeaderKey)
            .setValue(true);
        }
      } else {
        this.colSelectionCount.set(columnHeaderKey, this.rowHeaders.length);
      }
    } else {
      if (
        this.selectedOptionsWithIdMap.has(
          this.getRowColKey(rowHeaderKey, columnHeaderKey)
        )
      ) {
        this.response.removed.push(
          this.selectedOptionsWithIdMap.get(
            this.getRowColKey(rowHeaderKey, columnHeaderKey)
          )
        );
      } else {
        this.response.added = optionAdapter.removeOne(
          rowHeaderKey + columnHeaderKey,
          this.response.added
        );
      }

      this.colSelectionCount.set(
        columnHeaderKey,
        this.colSelectionCount.get(columnHeaderKey) - 1
      );
      if (checkAll) {
        this.checkBoxForm
          .get(this.selectAllRowKey)
          .get(columnHeaderKey)
          .setValue(false);
      } else {
        this.colSelectionCount.set(columnHeaderKey, 0);
      }
    }

    this.hasChange.emit(
      !!optionSelector.selectTotal(this.response.added) ||
        !!this.response.removed.length
    );
  }

  selectionChangeAll(isChecked, columnHeaderKey) {
    this.rowHeaders.forEach(row => {
      const formGroup = this.checkBoxForm.get(row.key);
      formGroup.get(columnHeaderKey).setValue(isChecked);
      this.selectionChange(isChecked, row.key, columnHeaderKey, false);
    });
  }

  getSelectAllInfo() {
    return this.checkBoxForm.get(this.selectAllRowKey).value;
  }
  getRowColKey(rowKey: string, columnKey: string): string {
    return rowKey + this.separator + columnKey;
  }

  gridReady(params: GridReadyEvent) {
    this.params = params;
    params.api.sizeColumnsToFit();
  }

  onGridSizeChanged(params: GridReadyEvent) {
    if (window.innerWidth >= 991) {
      if (params?.api) {
        params.api.sizeColumnsToFit();
      }
    }
  }

  onCellKeyPress(grid) {
    if (grid.event && grid.event.code === 'Space') {
      const col = grid.colDef.field;
      const row = grid.data.rowKey;
      const form: FormControl = grid.data.formGroup.get(col);
      const isSelected = !form.value;
      form.setValue(isSelected);

      if (row === this.selectAllRowKey) {
        this.selectionChangeAll(isSelected, col);
      } else {
        this.selectionChange(isSelected, row, col);
      }
    }
  }
  getContext() {
    return {
      componentParent: this.component,
      disableCheckBox: this.disableCheckBox
    };
    // return this.context;
  }


  onCellFocused(event) {
    if (event.column.colDef) {
      this.mapTopPanelValue(event);
    }
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  mapTopPanelValue(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    if (this.currentRowField === 'rowName')
      this.currentRowInfo = this.rowData[this.currentRowIndex][
        this.currentRowField
      ];
    else
      this.currentRowInfo = this.rowData[
        this.currentRowIndex
      ].formGroup.controls[this.currentRowField]?.value;

    // this.currentRowInfo = this.rowData[this.currentRowIndex][this.currentRowField] ?
    // this.rowData[this.currentRowIndex][this.currentRowField]
    // : this.rowData[this.currentRowIndex].formGroup.controls[this.currentRowField].value
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
