import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  EventEmitter,
  Output,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import {
  CreateTepTypesEnum,
  DataEvent,
  OrdersGridFieldEnum,
  StatusTypesEnum,
  TransactionDetails
} from '@poss-web/shared/models';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToolbarDocNumComponent } from 'libs/shared/components/ui-ag-grid/src/lib/toolbar-doc-num/toolbar-doc-num';
import * as moment from 'moment';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenOrdersComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  OpenOrdersForm: FormGroup;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  destroy$: Subject<null> = new Subject<null>();
  @Input() openOrdersList$: Observable<TransactionDetails[]>;
  @Input() subTxnType: string;
  @Input() setFocus = false;
  @Output() openOrdersSearchEvent = new EventEmitter<DataEvent>();
  @Output() openOrdersClearSearchEvent = new EventEmitter<DataEvent>();
  @Output() openOrdersPaginateEvent = new EventEmitter<DataEvent>();
  @Output() selectedIdEvent = new EventEmitter<string>();
  pageIndex = 0;
  pageSize = 10;
  totalElements: number;
  createTepTypesEnum = CreateTepTypesEnum;
  totalPages: number;
  customerNotSelectedLabel: string;
  noDataFoundMessage: string;
  columnDefs = [];
  domLayout = 'autoHeight';
  rowHeight = 30;
  animateRows = true;
  api: GridApi;
  columnApi: ColumnApi;
  docNumberLabel: string;
  customerNameLabel: string;
  docDateLabel: string;
  openOrdersComponent: any = this;
  defaultColDef = {
    resizable: true,
    suppressMovable: true
  };
  tooltipShowDelay = 1;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService
  ) {
    this.translate
      .get(['pw.entity.ordersEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(
            [
              'pw.global.noDataFoundMessage',
              'pw.toolbar.customerNotSelectedLabel',
              'pw.toolbar.docNumberLabel',
              'pw.toolbar.customerNameLabel',
              'pw.toolbar.docDate'
            ],
            {
              entityName: entity['pw.entity.ordersEntity']
            }
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessages: any) => {
            this.noDataFoundMessage =
              translatedMessages['pw.global.noDataFoundMessage'];
            this.customerNotSelectedLabel =
              translatedMessages['pw.toolbar.customerNotSelectedLabel'];
            this.docNumberLabel =
              translatedMessages['pw.toolbar.docNumberLabel'];
            this.customerNameLabel =
              translatedMessages['pw.toolbar.customerNameLabel'];
            this.docDateLabel = translatedMessages['pw.toolbar.docDate'];
          });
      });

    this.OpenOrdersForm = this.formBuilder.group({
      searchValue: ['']
    });
  }

  ngOnInit(): void {
    this.columnDefs = [
      {
        headerName: this.docNumberLabel,
        field: OrdersGridFieldEnum.DOC_NO,
        cellRenderer: 'toolbarDocNumRenderer'
      },
      {
        headerName: this.customerNameLabel,
        field: OrdersGridFieldEnum.CUSTOMER_NAME,
        cellRenderer: params =>
          params.value === null ? this.customerNotSelectedLabel : params.value,
        tooltipField: OrdersGridFieldEnum.CUSTOMER_NAME
      },
      {
        headerName: this.docDateLabel,
        field: OrdersGridFieldEnum.DOC_DATE,
        cellRenderer: params =>
          this.dateFormatterService.format(this.dateFormat(params.value))
      }
    ];
    this.openOrdersList$.subscribe((data: TransactionDetails[]) => {
      if (data.length !== 0) {
        this.totalElements = data[0].totalElements;
        this.totalPages = this.totalElements / this.pageSize;
      }
    });
  }

  dateFormat(date) {
    return moment(date);
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.OpenOrdersForm.get('searchValue').value;
        if (searchValue !== '') {
          this.searchItems(searchValue);
        } else if (searchValue === '') {
          this.clearSearch();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subTxnType']) {
      this.setColumnVisibility();
    }
    if (changes['setFocus']) {
      if (this.setFocus) {
        this.searchBox.nativeElement.focus();
      }
    }
  }

  searchItems(searchValue: any) {
    let searchType: any;
    if (searchValue.match('^[0-9]')) {
      searchType = Number(searchValue);
    } else {
      searchType = String(searchValue);
    }
    this.pageIndex = 0;
    this.openOrdersSearchEvent.emit({
      searchData: searchType,
      pageIndex: this.pageIndex,
      type: StatusTypesEnum.OPEN
    });
  }

  clearSearch() {
    this.OpenOrdersForm.get('searchValue').reset('');
    this.pageIndex = 0;
    this.openOrdersClearSearchEvent.emit({
      searchData: this.OpenOrdersForm.get('searchValue').value,
      pageIndex: this.pageIndex,
      type: StatusTypesEnum.OPEN
    });
  }

  decreasePageIndex() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.paginate();
    }
  }

  increasePageIndex() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex = this.pageIndex + 1;
      this.paginate();
    }
  }

  paginate() {
    this.openOrdersPaginateEvent.emit({
      searchData: this.OpenOrdersForm.get('searchValue').value,
      pageIndex: this.pageIndex,
      type: StatusTypesEnum.OPEN
    });
  }

  selectedId(selectedId: string) {
    this.selectedIdEvent.emit(selectedId);
  }

  onKeyDown(event): void {
    const key = event.which || event.keyCode;
    // tab
    if (key === 9) {
      this.preventDefaultAndPropagation(event);
    }
  }

  private preventDefaultAndPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
    this.api.setFocusedCell(0, OrdersGridFieldEnum.DOC_NO);
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.setColumnVisibility();
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  setColumnVisibility() {
    if (this.api && this.columnApi) {
      if (this.subTxnType === CreateTepTypesEnum.CUT_PIECE_TEP) {
        this.columnApi.setColumnVisible(
          OrdersGridFieldEnum.CUSTOMER_NAME,
          false
        );
        this.columnApi.setColumnVisible(OrdersGridFieldEnum.DOC_DATE, true);
      } else {
        this.columnApi.setColumnVisible(
          OrdersGridFieldEnum.CUSTOMER_NAME,
          true
        );
        this.columnApi.setColumnVisible(OrdersGridFieldEnum.DOC_DATE, false);
      }
      this.onGridSizeChanged();
      this.api.redrawRows();
    }
  }

  onCellKeyPress(pressEvent) {
    const keyPressed = pressEvent.event.key;
    if (keyPressed === 'Enter') {
      if (pressEvent.colDef.field === OrdersGridFieldEnum.DOC_NO) {
        this.selectedId(pressEvent.data.id);
      }
    }
  }

  getContext() {
    return {
      componentParent: this.openOrdersComponent
    };
  }

  // custom components used in ag grid
  getComponents() {
    return {
      toolbarDocNumRenderer: ToolbarDocNumComponent
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
