import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import {
  WeightFormatterService,
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { Subject } from 'rxjs';

import {
  PreMeltingDetailsComponent,
  TotalValuePopupComponent
} from '@poss-web/poss/gep/ui-gep-product-grid';
import { takeUntil } from 'rxjs/operators';
import { GEPProductDetails } from '@poss-web/shared/models';

interface ColumnDef {
  headerCheckboxSelection?: boolean;
  checkboxSelection?: boolean;
  field?: string;
  headerName?: string;
  cellRendererFramework?: any;
  cellEditorFramework?: any;
  resizable?: boolean;
  pinned?: string;
  suppressMovable: boolean;
  minWidth?: number;
  maxWidth?: number;
  singleClickEdit?: boolean;
  suppressSizeToFit?: boolean;
  type?: any;
  cellClass?: any;
  valueGetter?: Function;
  valueFormatter?: Function;
  celId?: string;
  editable?: any;
  width?: number;
  lockPinned?: boolean;
  valueSetter?: Function;
  cellEditorSelector?: any;
  cellRenderer?: any;
  filter?: any;
  filterParams?: any;
  enableCellChangeFlash?: boolean;
  sortable?: boolean;
  isWeight?: boolean;
}

@Component({
  selector: 'poss-web-gep-products-details',
  templateUrl: './gep-products-details.component.html'
})
export class GepProductsDetailsComponent implements OnInit {
  @Input() productGrid: GEPProductDetails[];
  destroy$: Subject<null> = new Subject<null>();

  colDef: ColumnDef[] = [];
  defaultColDef = {
    resizable: true
  };

  domLayout = 'autoHeight';
  api: GridApi;
  columnApi: ColumnApi;
  rowHeight = '50';

  constructor(
    private translate: TranslateService,
    public dialog: MatDialog,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'pw.gepHistory.metalTypeLabel',
        'pw.gepHistory.itemTypeLabel',
        'pw.gepHistory.metalWeighLabel',
        'pw.gepHistory.purityLabel',
        'pw.gepHistory.karatageLabel',
        'pw.gepHistory.metalRateLabel',
        'pw.gepHistory.preMeltingDetailsLabel',
        'pw.gepHistory.deductionsLabel',
        'pw.gepHistory.totalValueLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.colDef = [
          {
            headerName: translatedMessages['pw.gepHistory.metalTypeLabel'],
            field: 'metalType',
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.itemTypeLabel'],
            field: 'itemType',
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.metalWeighLabel'],
            field: 'weight',
            valueFormatter: params => {
              return this.weightFormatterService.format(params.value);
            },
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.purityLabel'],
            field: 'purity',
            editable: false,
            valueFormatter: params => {
              if (params.value) return params.value.toFixed(2);
              else return null;
            },
            enableCellChangeFlash: true,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.karatageLabel'],
            field: 'karatage',
            valueFormatter: params => {
              if (params.value) return params.value;
              else return null;
            },
            suppressMovable: true,
            enableCellChangeFlash: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.metalRateLabel'],
            field: 'rate',
            cellClass: 'pw-justify-content-end',
            suppressMovable: true,
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                'INR',
                false
              );
            },
            type: 'numericColumn'
          },
          {
            headerName:
              translatedMessages['pw.gepHistory.preMeltingDetailsLabel'],
            field: 'melted',
            cellClass: 'pw-fourth-color',
            cellRenderer: headerName => {
              if (headerName.data.preMeltingDetails.weight !== null) {
                return `<a class="pw-anchor-underline">Pre-Melting Details</a>`;
              } else return 'Pre-Melting Details';
            },
            suppressMovable: true,
            minWidth: 150,
            maxWidth: 150
          },
          {
            headerName: translatedMessages['pw.gepHistory.deductionsLabel'],
            field: 'deductions',
            valueFormatter: params => {
              if (params.value) {
                const value = this.currencyFormatterService.format(
                  params.value,
                  'INR',
                  false
                );
                return (
                  value +
                  '(' +
                  params.data.totalBreakUp.deductionPercentage +
                  '%' +
                  ')'
                );
              } else {
                return null;
              }
            },
            type: 'numericColumn',
            enableCellChangeFlash: true,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.gepHistory.totalValueLabel'],
            field: 'totalValue',
            cellClass: 'pw-fourth-color',
            type: 'numericColumn',
            suppressMovable: true,
            cellRenderer: headerName => {
              if (headerName.data.totalValue) {
                return `<a class="pw-anchor-underline">${this.currencyFormatterService.format(
                  headerName.value,
                  'INR',
                  false
                )}</a>`;
              } else return null;
            },
            enableCellChangeFlash: true
          }
        ];
      });
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.field === 'totalValue') {
      if (clickEvent.data.totalValue)
        this.opentotalValueBreakup(clickEvent.data.totalBreakUp);
    } else if (clickEvent.colDef.field === 'melted') {
      if (
        clickEvent.data.preMeltingDetails &&
        clickEvent.data.preMeltingDetails.weight
      )
        this.openPreMeltingDetails(clickEvent.data);
    }
  }

  openPreMeltingDetails(data) {
    const dialogRef = this.dialog.open(PreMeltingDetailsComponent, {
      width: '300px',
      data: data.preMeltingDetails
    });
    dialogRef.afterClosed();
  }

  opentotalValueBreakup(data) {
    const dialogRef = this.dialog.open(TotalValuePopupComponent, {
      width: '500px',
      data: data
    });
    dialogRef.afterClosed();
  }
}
