import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { RadioButtonCellComponent } from '@poss-web/shared/components/ui-ag-grid';
import { CnTransferSearchResult } from '@poss-web/shared/models';


@Component({
  selector: 'poss-web-cn-transfer-search-list-grid',
  templateUrl: './cn-transfer-search-list-grid.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnTransferSearchListGridComponent implements OnInit, OnChanges {
  @Input() searchResults: CnTransferSearchResult[] = [];
  @Input() searchResultsCount = 0;
  @Output() cnDetails = new EventEmitter<CnTransferSearchResult>();
  @Input() destLocationCode: string;

  destroy$: Subject<null> = new Subject<null>();

  defaultColDef = {
    suppressMovable: true
  };
  columnDefs = [];
  api: GridApi;
  component: any = this;
  domLayout = 'autoHeight';
  animateRows = true;
  rowData = [];
  rowHeight = 35;
  id: string;
  disableButton = true;

  //#region 'column def header variables'
  CNNoHeader: string;
  fiscalYearHeader: string;
  custNameHeader: string;
  srcLocationHeader: string;
  destLocationHeader: string;
  CNTypeHeader: string;
  CNDateHeader: string;
  amountHeader: string;
  CNStatusHeader: string;
  linkedHeader: string;
  //#endregion

  //#region 'resource literal keys/field names'
  readonly docNoField: string = 'docNo';
  readonly fiscalYearField: string = 'fiscalYear';
  readonly custNameField: string = 'customerName';
  readonly srcLocationField: string = 'locationCode';
  readonly CNTypeField: string = 'creditNoteType';
  readonly CNDateField: string = 'docDate';
  readonly amountField: string = 'amount';
  readonly CNStatusField: string = 'status';
  readonly linkedField: string = 'linkedTxnType';

  readonly cnNoLabelKey: string = 'pw.creditNote.cnNoLabel';
  readonly customerNameLabelKey: string = 'pw.creditNote.customerNameLabel';
  readonly fiscalYearLabelKey: string = 'pw.creditNote.fiscalYearLabel';
  readonly srcLocationLabelKey: string = 'pw.creditNote.srcLocationLabel';
  readonly destLocationLabelKey: string = 'pw.creditNote.destLocationLabel';
  readonly cnTypeLabelKey: string = 'pw.creditNote.cnTypeLabel';
  readonly cnDateLabelKey: string = 'pw.creditNote.cnDateLabel';
  readonly amountLabelKey: string = 'pw.creditNote.amountLabel';
  readonly cnStatusLabelKey: string = 'pw.creditNote.cnStatusLabel';
  readonly linkedWithLabelKey: string = 'pw.creditNote.linkedWithLabel';
  //#endregion

  constructor(private dateFormatterService: DateFormatterService,
    private translate: TranslateService) {
      this.translate
      .get([
        this.cnNoLabelKey,
        this.customerNameLabelKey,
        this.fiscalYearLabelKey,
        this.srcLocationLabelKey,
        this.destLocationLabelKey,
        this.cnTypeLabelKey,
        this.cnDateLabelKey,
        this.amountLabelKey,
        this.cnStatusLabelKey,
        this.linkedWithLabelKey
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.CNNoHeader = translatedMessages[this.cnNoLabelKey]
        this.fiscalYearHeader = translatedMessages[this.fiscalYearLabelKey]
        this.custNameHeader = translatedMessages[this.customerNameLabelKey]
        this.srcLocationHeader = translatedMessages[this.srcLocationLabelKey]
        this.destLocationHeader = translatedMessages[this.destLocationLabelKey]
        this.CNTypeHeader = translatedMessages[this.cnTypeLabelKey]
        this.CNDateHeader = translatedMessages[this.cnDateLabelKey]
        this.amountHeader = translatedMessages[this.amountLabelKey]
        this.CNStatusHeader = translatedMessages[this.cnStatusLabelKey]
        this.linkedHeader = translatedMessages[this.linkedWithLabelKey]
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResults']) {
      this.rowData = [];
      this.disableButton = true;
      if(this.searchResults?.length > 0) {
        this.disableButton = false;
        this.searchResults.forEach(item => {
          this.rowData.push(item);
        });
      }
    }
  }
  ngOnInit(): void {
    this.loadColumns();
  }

  getComponents() {
    return {
      radioButtonRowRender: RadioButtonCellComponent
    };
  }
  cnDetailsType(type: string) {
    this.cnDetails.emit(this.rowData[0]);
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  selectionChange(id) {
    this.id = id;
    this.disableButton = false;
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }
  loadColumns() {
    this.columnDefs = [
      {
        headerName: this.CNNoHeader,
        field: this.docNoField,
        maxWidth: 80,

        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: this.fiscalYearHeader,
        field: this.fiscalYearField,
        resizable: true,
        maxWidth: 80,

        suppressSizeToFit: true
      },
      {
        headerName: this.custNameHeader,
        field: this.custNameField,
        resizable: true,
        maxWidth: 130,

        suppressSizeToFit: true
      },
      {
        headerName: this.srcLocationHeader,
        field: this.srcLocationField,
        maxWidth: 100,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: this.destLocationHeader,
        maxWidth: 100,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: params => {
          return this.destLocationCode;
        }
      },
      {
        headerName: this.CNTypeHeader,
        field: this.CNTypeField,
        resizable: true,
        maxWidth: 80,
        suppressSizeToFit: true
      },
      {
        headerName: this.CNDateHeader,
        field: this.CNDateField,
        resizable: true,
        maxWidth: 100,
        suppressSizeToFit: true,
        valueFormatter: params => {
          return this.dateFormatterService.format(params.value);
        }
      },
      {
        headerName: this.amountHeader,
        field: this.amountField,
        maxWidth: 100,

        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: this.CNStatusHeader,
        field: this.CNStatusField,
        maxWidth: 100,

        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: this.linkedHeader,
        field: this.linkedField,
        resizable: true,

      }
    ];
  }
}
