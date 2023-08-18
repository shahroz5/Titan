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
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DataEvent,
  OrdersGridFieldEnum,
  StatusTypesEnum,
  TransactionDetails,
  ValidationTypesEnum
} from '@poss-web/shared/models';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToolbarDocNumComponent } from 'libs/shared/components/ui-ag-grid/src/lib/toolbar-doc-num/toolbar-doc-num';

@Component({
  selector: 'poss-web-on-hold',
  templateUrl: './on-hold.component.html',
  styleUrls: ['./on-hold.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnHoldComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  onHoldForm: FormGroup;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  destroy$: Subject<null> = new Subject<null>();
  @Input() holdResult$: Observable<TransactionDetails[]>;
  @Input() configHoldTime$: Observable<number>;
  @Input() setFocus = false;
  @Output() holdSearchItemsEvent = new EventEmitter<DataEvent>();
  @Output() holdClearSearchEvent = new EventEmitter<DataEvent>();
  @Output() holdPaginateEvent = new EventEmitter<DataEvent>();
  @Output() selectedIdEvent = new EventEmitter<string>();
  pageIndex = 0;
  pageSize = 10;
  totalElements: number;
  totalPages: number;
  configHoldTime: number;
  noDataFoundMessage: string;
  docNumberLabel: string;
  customerNameLabel: string;
  holdAtLabel: string;
  expireAtLabel: string;
  columnDefs = [];
  domLayout = 'autoHeight';
  rowHeight = 30;
  animateRows = true;
  api: GridApi;
  columnApi: ColumnApi;
  onHoldComponent: any = this;
  defaultColDef = {
    resizable: true,
    suppressMovable: true
  };
  tooltipShowDelay = 1;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.entity.ordersEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(
            [
              'pw.global.noDataFoundMessage',
              'pw.toolbar.docNumberLabel',
              'pw.toolbar.customerNameLabel',
              'pw.toolbar.holdAtLabel',
              'pw.toolbar.expireAtLabel'
            ],
            {
              entityName: entity['pw.entity.ordersEntity']
            }
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessages: any) => {
            this.noDataFoundMessage =
              translatedMessages['pw.global.noDataFoundMessage'];
            this.docNumberLabel =
              translatedMessages['pw.toolbar.docNumberLabel'];
            this.customerNameLabel =
              translatedMessages['pw.toolbar.customerNameLabel'];
            this.holdAtLabel = translatedMessages['pw.toolbar.holdAtLabel'];
            this.expireAtLabel = translatedMessages['pw.toolbar.expireAtLabel'];
          });
      });

    this.onHoldForm = this.formBuilder.group({
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
        tooltipField: OrdersGridFieldEnum.CUSTOMER_NAME
      },
      {
        headerName: this.holdAtLabel,
        field: OrdersGridFieldEnum.HOLD_AT,
        cellRenderer: params => this.formatTime(params.data.lastHoldTime)
      },
      {
        headerName: this.expireAtLabel,
        field: OrdersGridFieldEnum.EXPIRE_AT,
        cellRenderer: params => this.getExpireTime(params.data.lastHoldTime),
        cellClass: params => this.getExpireColor(params.data.lastHoldTime)
      }
    ];

    this.holdResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: TransactionDetails[]) => {
        if (data.length !== 0) {
          this.totalElements = data[0].totalElements;
          this.totalPages = this.totalElements / this.pageSize;
        }
      });

    this.configHoldTime$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        if (data) {
          this.configHoldTime = data;
        }
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.onHoldForm.get('searchValue').value;
        if (searchValue !== '') {
          this.searchItems(searchValue);
        } else if (searchValue === '') {
          this.clearSearch();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
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
    this.holdSearchItemsEvent.emit({
      searchData: searchType,
      pageIndex: this.pageIndex,
      type: StatusTypesEnum.HOLD
    });
  }

  clearSearch() {
    this.onHoldForm.get('searchValue').reset('');
    this.pageIndex = 0;
    this.holdClearSearchEvent.emit({
      searchData: this.onHoldForm.get('searchValue').value,
      pageIndex: this.pageIndex,
      type: StatusTypesEnum.HOLD
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
    this.holdPaginateEvent.emit({
      searchData: this.onHoldForm.get('searchValue').value,
      pageIndex: this.pageIndex,
      type: StatusTypesEnum.HOLD
    });
  }

  selectedId(element: string) {
    this.selectedIdEvent.emit(element);
  }

  formatTime(time) {
    const momentTime = moment(time);
    return momentTime.format('hh:mm A');
  }

  getExpireTime(time) {
    const momentTime = moment(time);
    const currentTime = moment();
    const leftOverMinutes = moment().diff(moment(momentTime), 'minutes');

    if (leftOverMinutes < this.configHoldTime) {
      return currentTime
        .add(this.configHoldTime - leftOverMinutes, 'minutes')
        .format('hh:mm A');
    } else {
      return ValidationTypesEnum.EXPIRED;
    }
  }

  getExpireColor(time) {
    
    const momentTime = moment(time);
    const leftOverMinutes = moment().diff(moment(momentTime), 'minutes');

    if (
      leftOverMinutes > this.configHoldTime - 10 &&
      leftOverMinutes < this.configHoldTime
    ) {
      return 'pw-warning-color';
    } else if (leftOverMinutes < this.configHoldTime) {
      return 'pw-success-color';
    } else {
      return 'pw-error-color';
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
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

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  onCellKeyPress(pressEvent) {
    const keyPressed = pressEvent.event.key;
    if (keyPressed === 'Enter') {
      if (pressEvent.colDef.field === OrdersGridFieldEnum.DOC_NO) {
        this.selectedId(pressEvent.data);
      }
    }
  }

  getContext() {
    return {
      componentParent: this.onHoldComponent
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
