import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigurationRanges
} from '@poss-web/shared/models';

import {
  DeleteRowComponent,
  EditItemComponent,
  InputValidatorComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export enum RangeTypeEnum {
  GEP_GOLD_PURITY = 'GEP_GOLD_PURITY',
  GEP_SILVER_PURITY = 'GEP_SILVER_PURITY',
  GEP_PLATINUM_PURITY = 'GEP_PLATINUM_PURITY',
  TEP_CARAT = 'TEP_CART'
}
@Component({
  selector: 'poss-web-range-details-item',
  templateUrl: './range-details-item.component.html',
  styleUrls: ['./range-details-item.component.scss']
})
export class RangeDetailsItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() ranges: ConfigurationRanges[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() saveRanges = new EventEmitter<any>();
  @Input() configType: string;
  columnDefs = [];
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'single';
  destroy$ = new Subject();
  api: GridApi;
  context: any = this;
  rangeFormGroup: FormGroup;
  selectedRowIndex: number;
  valueEmpty = false;
  fromValueGreaterThanTo = false;
  dialogOpen = true;
  isAbove = undefined;
  editMode = false;
  addRowData = false;
  save = true;
  alldeleted = false;
  isConfirmPopUp = false;
  disableButtons = true;
  errorDialogReference;
  weightBasedGridActive = undefined;
  isAdd = true;
  isValid = true;
  i = 0;
  formResponse: ConfigurationRanges[] = [];
  rangeRowData: ConfigurationRanges[] = [];
  updateRanges: { id: string; isActive: boolean }[] = [];
  fromRangeTranslatedLabel: string;
  toRangeTranslatedLabel: string;
  alertMsg: string;
  defaultColDef = {
    autoHeight: true,
    suppressMovable: true,
    pinned: 'left'
  };

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translateService
      .get([
        'pw.range.fromRangeLabel',
        'pw.range.toRangeLabel',
        'pw.range.alertMsg'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.fromRangeTranslatedLabel =
          translatedMsg['pw.range.fromRangeLabel'];
        this.toRangeTranslatedLabel = translatedMsg['pw.range.toRangeLabel'];
        this.alertMsg = translatedMsg['pw.range.alertMsg'];
        this.columnDefs = [
          {
            headerName: translatedMsg['pw.range.fromRangeLabel'],
            field: 'fromRange',
           flex:1,
            cellRendererSelector: params => {
              if (params.data.id === '') {
                return { component: 'editItemRenderer' };
              } else {
                return null;
              }
            },
            singleClickEdit: true,
            editable: param => {
              return param.data.id === '';
            },
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
            cellEditor: 'inputValidator',
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                return (
                  params.value.isValid === false && params.value.value !== ''
                );
              }
            }
          },
          {
            headerName: translatedMsg['pw.range.toRangeLabel'],
            field: 'toRange',
            // resizable: true,
           flex:1,
            // suppressSizeToFit: true,
            cellRendererSelector: params => {
              if (params.data.id === '') {
                return { component: 'editItemRenderer' };
              } else {
                return null;
              }
            },

            singleClickEdit: true,
            editable: param => {
              return param.data.id === '';
            },
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
            cellEditor: 'inputValidator',
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                return (
                  params.value.isValid === false && params.value.value !== ''
                );
              }
            }
          },
          {
            headerName: 'IsActive',
            field: 'isActive',
         flex:1,
            cellRendererFramework: ToggleButtonCellComponent
          }
        ];
      });
  }
  ngOnInit(): void {
    this.createForm();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['ranges']) {
      this.rangeRowData = [];
      this.rangeRowData = this.ranges;
      this.updateRanges = [];
      this.valueEmpty = false;
      this.fromValueGreaterThanTo = false;
      this.isValid = true;
      this.createForm();
    }
    if (changes['configType']) {
      this.api.stopEditing();
    }
  }
  selectionChange(id, checked) {
    if (id) {
      if (this.updateRanges.length > 0) {
        if (this.updateRanges.find(val => val.id === id)) {
          this.updateRanges = this.updateRanges.filter(val => val.id !== id);
        }
      }
      this.updateRanges.push({
        id: id,
        isActive: checked
      });
    }
  }

  createForm() {
    this.rangeFormGroup = new FormGroup({});
    this.ranges.forEach((range: ConfigurationRanges) => {
      this.rangeFormGroup.addControl(
        range.id,
        new FormGroup({
          toRange: new FormControl(range ? range.toRange : ''),
          fromRange: new FormControl(range ? range.fromRange : ''),
          rowId: new FormControl(range ? range.rowId : '')
        })
      );
    });
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      editItemRenderer: EditItemComponent,
      deleteRowRenderer: DeleteRowComponent,
      toggleButtonRenderer: ToggleButtonCellComponent
    };
  }

  onCellValueChanged(changeEvent) {
    if (changeEvent.value.value !== '' && changeEvent.value.value !== null) {
      switch (changeEvent.colDef.field) {
        case 'fromRange': {
          this.isValid = changeEvent.newValue.isValid;
          break;
        }
        case 'toRange': {
          this.isValid = changeEvent.newValue.isValid;
          break;
        }
      }
    }
  }
  getContext() {
    let fromValidation;
    let toValidation;
    if (
      this.configType === RangeTypeEnum.GEP_GOLD_PURITY ||
      this.configType === RangeTypeEnum.GEP_SILVER_PURITY ||
      this.configType === RangeTypeEnum.GEP_PLATINUM_PURITY
    ) {
      fromValidation = this.fieldValidatorsService.purityField(
        this.fromRangeTranslatedLabel
      );
      toValidation = this.fieldValidatorsService.purityField(
        this.toRangeTranslatedLabel
      );
    } else if (this.configType === RangeTypeEnum.TEP_CARAT) {
      fromValidation = this.fieldValidatorsService.karatField(
        this.fromRangeTranslatedLabel
      );
      toValidation = this.fieldValidatorsService.karatField(
        this.toRangeTranslatedLabel
      );
    } else {
      fromValidation = this.fieldValidatorsService.weightField(
        this.fromRangeTranslatedLabel
      );
      toValidation = this.fieldValidatorsService.weightField(
        this.toRangeTranslatedLabel
      );
    }
    return {
      validators: {
        fromRange: fromValidation,
        toRange: toValidation
      },
      componentParent: this.context
    };
  }
  rowEditingStarted($event) {
    this.editMode = true;
    this.save = false;
  }

  addRow() {
    this.api.stopEditing();
    this.addRowData = true;
    this.dialogOpen = true;
    if (this.getAllRows().length === 0) {
      this.addRanges();
    } else {
      this.checkValidation(this.rangeRowData);
    }
  }
  checkValidation(rowData) {
    for (const currentRowData of this.getAllRows()) {
      if (currentRowData.id === '') {
        if (
          currentRowData?.fromRange === '' ||
          currentRowData?.fromRange?.value === '' ||
          currentRowData?.toRange?.value === '' ||
          currentRowData?.toRange === ''
        ) {
          this.valueEmpty = true;
        } else {
          this.valueEmpty = false;
          break;
        }
      }
    }
    let pattern;
    if (
      this.configType === RangeTypeEnum.GEP_GOLD_PURITY ||
      this.configType === RangeTypeEnum.GEP_SILVER_PURITY ||
      this.configType === RangeTypeEnum.GEP_PLATINUM_PURITY
    ) {
      pattern = /(^100(\.0{1,3})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,3})?$)/;
    } else if (this.configType === RangeTypeEnum.TEP_CARAT) {
      pattern = /^([9]|2[0-4]|1[0-9])$/;
    } else {
      pattern = /^[0-9]{0,4}(\.\d{1,3})?$/;
    }
    for (const currentRowData of this.getAllRows()) {
      if (currentRowData.id === '' && !this.valueEmpty) {
        if (
          (typeof currentRowData.fromRange === 'object'
            ? pattern.test(currentRowData?.fromRange?.value)
            : pattern.test(currentRowData?.fromRange)) &&
          (typeof currentRowData.toRange === 'object'
            ? pattern.test(currentRowData?.toRange?.value)
            : pattern.test(currentRowData?.toRange))
        ) {
          this.isValid = true;
        } else {
          this.isValid = false;
          break;
        }
      }
    }

    if (!this.valueEmpty && this.isValid) {
      for (const currentRowData of this.getAllRows()) {
        if (currentRowData.id === '') {
          if (
            Number(
              typeof currentRowData?.fromRange === 'object'
                ? currentRowData?.fromRange.value
                : currentRowData?.fromRange
            ) >=
            Number(
              typeof currentRowData?.toRange === 'object'
                ? currentRowData?.toRange.value
                : currentRowData?.toRange
            )
          ) {
            this.fromValueGreaterThanTo = true;
            break;
          } else {
            this.fromValueGreaterThanTo = false;
          }
        }
      }
    }

    if (this.valueEmpty) {
      this.showAlertPopup('Please Enter From and To Ranges');
    } else if (this.fromValueGreaterThanTo) {
      this.showAlertPopup('FromRange should be less than ToRange');
    } else if (!this.isValid) {
      this.showAlertPopup('Please Enter Valid Ranges');
    }
    if (
      this.valueEmpty === false &&
      this.fromValueGreaterThanTo === false &&
      this.isValid
    ) {
      this.addData();
      this.save = true;
    }
  }

  addData() {
    this.i = this.getAllRows().length;
    if (
      this.addRowData === true &&
      this.valueEmpty === false &&
      this.fromValueGreaterThanTo === false
    ) {
      this.addRanges();
    }
  }
  addRanges() {
    this.rangeRowData.splice(this.getAllRows().length + 1, 0, {
      fromRange: '',
      toRange: '',
      id: '',
      isActive: true
    });
    this.api.setRowData(this.rangeRowData);
    this.addRowData = false;
  }
  getAllRows() {
    const rowData = [];
    this.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  showAlertPopup(message: string) {
    this.dialog.closeAll();
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message: message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.valueEmpty = null;
          this.fromValueGreaterThanTo = null;
          this.isValid = null;
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.api.setRowData(this.rangeRowData);
  }
  prepareResponse() {
    const array = this.getAllRows().map(obj => obj.id === '');
    const addRanges = [];

    let rowId = this.ranges.length - 1;
    for (const ranges of this.getAllRows()) {
      if (ranges.id === '') {
        addRanges.push({
          fromRange: Number(
            typeof ranges.fromRange === 'object'
              ? ranges.fromRange.value
              : ranges.fromRange
          ),
          toRange: Number(
            typeof ranges.toRange === 'object'
              ? ranges.toRange.value
              : ranges.toRange
          ),
          rowId: ++rowId,
          isActive: ranges.isActive
        });
      }
    }

    const payload = {
      addRanges: addRanges,
      updateRanges: this.updateRanges,
      removeRanges: []
    };
    return payload;
  }
  onSubmit() {
    this.api.stopEditing();
    this.addRowData = false;

    this.checkValidation(this.getAllRows());

    if (this.updateRanges.length > 0) {
      this.isValid = true;
    }
    if (!this.valueEmpty && !this.fromValueGreaterThanTo && this.isValid) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            if (
              this.valueEmpty === false &&
              this.fromValueGreaterThanTo === false &&
              this.isValid
            ) {
              const payload = this.prepareResponse();
              this.saveRanges.emit(payload);
            }
          }
        });
    }
  }
  checkPattern() {
    let pattern;
    if (
      this.configType === RangeTypeEnum.GEP_GOLD_PURITY ||
      this.configType === RangeTypeEnum.GEP_SILVER_PURITY ||
      this.configType === RangeTypeEnum.GEP_PLATINUM_PURITY
    ) {
      pattern = /(^100(\.0{1,3})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,3})?$)/;
    } else if (this.configType === RangeTypeEnum.TEP_CARAT) {
      pattern = /^([9]|2[0-4]|1[0-9])$/;
    } else {
      pattern = /^[0-9]{0,4}(\.\d{1,3})?$/;
    }
    for (const currentRowData of this.getAllRows()) {
      if (currentRowData.id === '' && !this.valueEmpty) {
        if (
          (typeof currentRowData.fromRange === 'object'
            ? pattern.test(currentRowData?.fromRange?.value)
            : pattern.test(currentRowData?.fromRange)) &&
          (typeof currentRowData.toRange === 'object'
            ? pattern.test(currentRowData?.toRange?.value)
            : pattern.test(currentRowData?.toRange))
        ) {
          this.isValid = true;
        } else {
          this.isValid = false;
          this.showAlertPopup(this.alertMsg);
          break;
        }
      }
    }
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }
}
