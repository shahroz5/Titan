import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { CheckboxCellComponent } from '@poss-web/shared/components/ui-ag-grid';
import { GSTMappingDetails } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-gst-mapping-list',
  templateUrl: './gst-mapping-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GSTMappingListComponent implements OnChanges, OnDestroy {
  @Input() gstMappingList: GSTMappingDetails[];
  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() edit = new EventEmitter<GSTMappingDetails>();

  animateRows = true;
  api: GridApi;
  domLayout = 'autoHeight';
  rowHeight = 35;
  rowData = [];
  columnDefs = [];
  rowSelection = 'single';
  destroy$: Subject<null> = new Subject<null>();
  hasSelectedRow = false;
  selectedConfig = null;
  component: any = this;
  defaultColDef = {
    suppressMovable: true
  };

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(private translate: TranslateService) {
    this.translate
      .get([
        'pw.gstMapping.transactionTypeLabel',
        'pw.gstMapping.sourceLocationTypeLabel',
        'pw.gstMapping.destinationLocationTypeLabel',
        'pw.gstMapping.customerTypeLabel',
        'pw.gstMapping.sourceLocationApplicableTaxLabel',
        'pw.gstMapping.destLocApplicableTaxLabel',
        'pw.gstMapping.applicableTaxLabel',
        'pw.gstMapping.isSameStateLabel',
        'pw.gstMapping.isSourceTaxApplicableLabel',
        'pw.gstMapping.applicableTax',
        'pw.gstMapping.isActiveLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.columnDefs = [
          {
            checkboxSelection: true,
            minWidth: 35,
            width: 40,
            pinned: 'left',
            lockPinned: true
          },

          {
            headerName: translatedMsg['pw.gstMapping.transactionTypeLabel'],
            field: 'txnType',
            suppressMovable: true,
            width: 400,
            pinned: 'left',
            lockPinned: true
          },
          {
            headerName: translatedMsg['pw.gstMapping.sourceLocationTypeLabel'],
            field: 'srcLocationTaxType',
            suppressMovable: true,
            width: 100
          },
          {
            headerName:
              translatedMsg['pw.gstMapping.destinationLocationTypeLabel'],
            field: 'destLocationTaxType',
            suppressMovable: true,
            width: 100
          },
          {
            headerName: translatedMsg['pw.gstMapping.customerTypeLabel'],
            field: 'customerTaxType',
            suppressMovable: true,
            width: 150
          },
          {
            headerName:
              translatedMsg['pw.gstMapping.sourceLocationApplicableTaxLabel'],
            field: 'srcLocationApplicableTax',

            suppressMovable: true
          },
          {
            headerName:
              translatedMsg['pw.gstMapping.destLocApplicableTaxLabel'],
            field: 'destLocationApplicableTax',
            suppressMovable: true
          },
          {
            headerName: translatedMsg['pw.gstMapping.applicableTaxLabel'],
            field: 'applicableTax'
          },
          {
            headerName: translatedMsg['pw.gstMapping.isSameStateLabel'],
            field: 'isSameState',
            suppressMovable: true,
            cellRendererFramework: CheckboxCellComponent,
            width: 100
          },
          {
            headerName:
              translatedMsg['pw.gstMapping.isSourceTaxApplicableLabel'],
            field: 'srcTaxApplicable',
            suppressMovable: true,
            cellRendererFramework: CheckboxCellComponent,
            width: 150
          },
          {
            headerName: translatedMsg['pw.gstMapping.isActiveLabel'],
            field: 'isActive',
            suppressMovable: true,
            cellRendererFramework: CheckboxCellComponent,
            width: 100
          }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gstMappingList']) {
      if (this.gstMappingList) {
        this.hasSelectedRow = false;
        this.selectedConfig = null;
        this.rowData = [];
        this.gstMappingList.forEach(gstDetails => {
          this.rowData.push({
            id: gstDetails.id,
            isActive: gstDetails.isActive,
            applicableTax: gstDetails.applicableTax,
            customerTaxType: gstDetails.customerTaxType,
            destLocationApplicableTax: gstDetails.destLocationApplicableTax,
            destLocationTaxType: gstDetails.destLocationTaxType,
            srcLocationApplicableTax: gstDetails.srcLocationApplicableTax,
            srcLocationTaxType: gstDetails.srcLocationTaxType,
            txnType: gstDetails.txnType,
            isSameState: gstDetails.isSameState,
            srcTaxApplicable: gstDetails.srcTaxApplicable
          });
        });
      }
    }
  }


  selectionChanged(grid) {
    if (grid.api.getSelectedRows().length) {
      this.hasSelectedRow = true;
      this.selectedConfig = grid.api.getSelectedRows()[0];
    } else {
      this.hasSelectedRow = false;
      this.selectedConfig = null;
    }
  }

  getContext() {
    return {
      componentParent: this.component,
      disableCheckBox: true
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  editValue() {
    if (this.hasSelectedRow) {
      this.edit.next(this.selectedConfig);
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
