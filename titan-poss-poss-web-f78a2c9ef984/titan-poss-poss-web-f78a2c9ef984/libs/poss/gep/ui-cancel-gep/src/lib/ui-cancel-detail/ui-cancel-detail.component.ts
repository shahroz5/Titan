import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  OverlayNotificationServiceAbstraction,
  GEPProductDetails
} from '@poss-web/shared/models';
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
  selector: 'poss-web-ui-cancel-detail',
  templateUrl: './ui-cancel-detail.component.html',
  styleUrls: []
})
export class UiCancelDetailComponent implements OnInit, OnChanges {
  @Input() rso;
  @Input() productGrid: GEPProductDetails[];
  @Input() headerDetails;
  @Input() exchangeDetails;
  @Input() formDetails;
  @Input() dateFormat;
  @Output() componentEmit = new EventEmitter<any>();
  colDef: ColumnDef[] = [];
  defaultColDef = {
    resizable: true
  };
  domLayout = 'autoHeight';
  api: GridApi;
  columnApi: ColumnApi;

  destroy$: Subject<null> = new Subject<null>();

  @Input() weightPurity: string;
  @Input() isRsoValid = true;
  @Input() isReasonValid = true;
  gepForm = new FormGroup({
    rsoName: new FormControl(''),

    reason: new FormControl('')
  });
  @Output() rsoName = new EventEmitter<any>();
  @Output() reasonForCancellation = new EventEmitter<any>();
  constructor(
    public dialog: MatDialog,
    private router: Router,
    form: FormBuilder,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private fieldValidator: FieldValidatorsService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.gepForm = form.group({
      rsoName: ['', [this.fieldValidator.requiredField('RSO Name')]],

      reason: [
        '',
        [
          this.fieldValidator.remarkField('reason'),
          this.fieldValidator.requiredField('reason')
        ]
      ]
    });
  }

  ngOnInit() {
    this.componentInit();

    this.colDef = [
      {
        field: 'metalType',
        headerName: 'Metal Type',

        suppressMovable: true
      },

      {
        field: 'itemType',
        headerName: 'Item Type',
        suppressMovable: true
      },

      {
        field: 'weight',
        headerName: 'Wt(gms)',
        valueFormatter: params => {
          return this.weightFormatterService.format(params.value);
        },
        suppressMovable: true
      },
      {
        field: 'purity',
        headerName: 'Purity(%)',

        editable: false,
        valueFormatter: params => {
          if (params.value) return params.value.toFixed(2);
          else return null;
        },
        enableCellChangeFlash: true,
        suppressMovable: true
      },
      {
        field: 'karatage',
        headerName: 'Karatage',
        valueFormatter: params => {
          if (params.value) return params.value;
          else return null;
        },
        suppressMovable: true,
        enableCellChangeFlash: true
      },
      {
        field: 'rate',
        headerName: 'Metal Rate',
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
        field: 'melted',
        headerName: 'Upload Pre-Melting Details',
        cellClass: 'pw-justify-content-end',

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
        field: 'deductions',
        headerName: 'Deductions (₹)',
        cellClass: 'pw-justify-content-end',
        valueFormatter: params => {
          console.log(params);
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
        field: 'totalValue',
        cellClass: 'pw-justify-content-end',
        headerName: 'Total Value(₹)',
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isRsoValid'] && changes['isRsoValid'].currentValue === false) {
      console.log(this.isRsoValid);
      this.gepForm.markAllAsTouched();
    }
    if (
      changes['isReasonValid'] &&
      changes['isReasonValid'].currentValue === false
    ) {
      console.log(this.isReasonValid);
      this.gepForm.markAllAsTouched();
    }
  }

  componentInit() {
    this.componentEmit.emit('detail');
    this.gepForm.controls['rsoName'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedValue => {
        console.log(selectedValue);
        console.log(this.gepForm.controls['rsoName'].value);
        this.rsoName.emit(selectedValue);
      });

    this.gepForm.controls['reason'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedValue => {
        console.log(selectedValue);
        console.log(this.gepForm.controls['reason'].value);
        this.reasonForCancellation.emit(selectedValue);
      });
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
    // console.log(this.addGrid)
    // if(this.addGrid)
    // this.onAddRow();
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }

  onCellClicked(clickEvent) {
    console.log(clickEvent.colDef.field);
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

  // display rso name from rso code
  getRsoNameFromCode(code: string) {
    if (this.rso.length !== 0) {
      for (const rso of this.rso) {
        if (rso.value === code) return rso.description;
      }
    }
    return code;
  }
}
