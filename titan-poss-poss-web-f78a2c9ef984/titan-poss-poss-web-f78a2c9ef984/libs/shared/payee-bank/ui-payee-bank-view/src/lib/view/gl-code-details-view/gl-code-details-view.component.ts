import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { CheckboxCellComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  PayeeBankGLCodeDetailsRow,
  PayeeLocations
} from '@poss-web/shared/models';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-gl-code-details-view',
  templateUrl: './gl-code-details-view.component.html'
})
export class GlCodeDetailsViewComponent implements OnChanges {
  @Input() glCodeData: PayeeBankGLCodeDetailsRow[];
  @Input() unmappedGlCodeData: PayeeLocations[];
  @Input() paymentCode;
  @Input() count;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSize = 10;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() searchValue;
  columnDefs = [];
  rowSelection = 'multiple';
  animateRows = true;
  domLayout = 'autoHeight';
  rowHeight = 35;
  api: GridApi;
  columnApi: ColumnApi;
  rowData: any[];
  disableEdit: boolean;
  mappedLocData = [];
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true
  };
  component: GlCodeDetailsViewComponent = this;
  destroy$: Subject<null> = new Subject<null>();
  constructor(private dialog: MatDialog, private translate: TranslateService) {
    this.translate
      .get([
        'pw.payeeBank.locationCodeHeaderName',
        'pw.payeeBank.locationCodeFieldName',
        'pw.payeeBank.descriptionHeaderName',
        'pw.payeeBank.descriptionFieldName',
        'pw.payeeBank.isDefaultHeaderName',
        'pw.payeeBank.isDefaultFieldName',
        'pw.payeeBank.glCodeHeaderName',
        'pw.payeeBank.glCodeFieldName'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          // {
          //   headerCheckboxSelection: true,
          //   checkboxSelection: true,
          //   minWidth: 35,
          //   width: 40,
          //   pinned: 'left',
          //   lockPinned: true,
          //   editable: false
          // },
          {
            headerName:
              translatedMessages['pw.payeeBank.locationCodeHeaderName'],
            field: translatedMessages['pw.payeeBank.locationCodeFieldName'],
            flex: 1
          },
          {
            headerName:
              translatedMessages['pw.payeeBank.descriptionHeaderName'],
            field: translatedMessages['pw.payeeBank.descriptionFieldName'],
            flex: 1
          },
          {
            headerName: translatedMessages['pw.payeeBank.glCodeHeaderName'],
            field: translatedMessages['pw.payeeBank.glCodeFieldName'],
            editable: false,
            flex: 1
          },
          {
            headerName: translatedMessages['pw.payeeBank.isDefaultHeaderName'],
            field: translatedMessages['pw.payeeBank.isDefaultFieldName'],
            suppressSizeToFit: true,
            editable: false,
            flex: 1,
            cellRendererFramework: CheckboxCellComponent
          }

          // {
          //   celId: 'delete',
          //   suppressMovable: true,
          //   cellRendererFramework: DeleteRowComponent,
          //   width: 21,
          //   minWidth: 21,
          //   maxWidth: 21,
          //   cellClass: 'pw-delete-icon-width',
          //   headerClass: 'pw-delete-icon-width'
          // }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['glCodeData']) {
      this.disableEdit = true;
      this.mappedLocData = [];
      this.glCodeData.forEach(data => {
        this.mappedLocData.push({
          id: data.id,
          rowKey: data.locationCode,
          description: data.description,
          glCode: data.glCode,
          isDefault: data.isDefault
          // formGroup: new FormGroup({
          //   isDefault: new FormControl(data.isDefault)
          // })
        });
      });
    }
    this.rowData = this.mappedLocData;
  }


  getContext() {
    return {
      validators: {
        cashGlCode: []
      },
      componentParent: this.component,
      disableCheckBox: true
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }
}
