import {
  ChangeDetectionStrategy,
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
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import {
  CheckboxCellComponent,
  RadioButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  DateFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  CNSearchEnum,
  CreditNoteSearch,
  CreditNoteSearchResult
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cn-search-result-list',
  templateUrl: './cn-search-result-list.component.html',
  // styleUrls: ['./cn-search-result-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CNSearchResultListComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() searchResult: CreditNoteSearchResult[];
  @Output() cnDetails = new EventEmitter<{ type: string; id: string }>();
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() count: number;
  @Input() searchData: CreditNoteSearch;
  @Input() currentFiscalYear: string;
  @Input() businessDay;
  @Output() emitSearch = new EventEmitter<{
    cnNumber: string;
    mobileNumber: string;
    fiscalYear: string;
    startDate: string;
    endDate: string;
    isUnipayCN: boolean;
  }>();
  @Output() emitPaginator = new EventEmitter<{
    paginator: PageEvent;
    searchFormGroup: FormGroup;
  }>();
  @Output() onSearchChange = new EventEmitter();
  destroy$ = new Subject<null>();
  columnDefs = [];
  constructor(
    private dateFormatterService: DateFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.creditNote.cnNoLabel',
        'pw.creditNote.fiscalYearLabel',
        'pw.creditNote.customerNameLabel',
        'pw.creditNote.locationCodeLabel',
        'pw.creditNote.cnTypeLabel',
        'pw.creditNote.cnDateLabel',
        'pw.creditNote.amountLabel',
        'pw.creditNote.cnStatusLabel',
        'pw.creditNote.linkedWithLabel',
        'pw.creditNote.isUnipayLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName: '',
            field: '',
            cellRenderer: 'radioButtonRowRender',
            resizable: true,
            flex: 1,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.cnNoLabel'],
            field: 'docNo',
            flex: 1,
            resizable: true,
            suppressSizeToFit: true,
            cellRenderer: headerName =>
              `<a class="pw-anchor-underline">${headerName.value}</a>`
          },
          {
            headerName: translatedMessages['pw.creditNote.fiscalYearLabel'],
            field: 'fiscalYear',
            resizable: true,
            flex: 1,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.customerNameLabel'],
            field: 'customerName',
            resizable: true,
            flex: 1,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.locationCodeLabel'],
            field: 'locationCode',
            flex: 1,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.cnTypeLabel'],
            field: 'creditNoteType',
            resizable: true,
            flex: 1,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.cnDateLabel'],
            field: 'docDate',
            resizable: true,
            flex: 1,
            suppressSizeToFit: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMessages['pw.creditNote.amountLabel'],
            field: 'amount',
            flex: 1,
            resizable: true,
            suppressSizeToFit: true,
            valueFormatter: params => {
              return this.currencyFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMessages['pw.creditNote.cnStatusLabel'],
            field: 'status',
            flex: 1,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.linkedWithLabel'],
            field: 'linkedTxnType',
            resizable: true,
            flex: 1,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.isUnipayLabel'],
            field: 'isUnipay',
            cellRenderer: 'checkboxCellRenderer',
            resizable: true,
            editable: false,
            flex: 1,
            suppressSizeToFit: true
          }
        ];
      });
  }
  api: GridApi;
  component: any = this;
  domLayout = 'autoHeight';
  animateRows = true;
  rowData = [];
  rowHeight = 50;
  id: string;
  cnSearchEnumRef = CNSearchEnum;
  disbaleActiveCN = true;
  disableCancelCN = true;
  defaultColDef = {
    suppressMovable: true
  };
  disableRemoveGoldRateButton = true;
  CNSearchFormGroup: FormGroup;
  disableButton = true;
  ngOnInit(): void {
    this.createForm();
    const cnNumberCtrl = this.CNSearchFormGroup.get('cnNumber');
    this.CNSearchFormGroup.get('fiscalYear')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(fiscalYear => {
        if (
          !(fiscalYear === '' || fiscalYear == null) &&
          this.CNSearchFormGroup.get('fiscalYear').errors === null
        ) {
          this.CNSearchFormGroup.get('cnNumber').markAsTouched();
          cnNumberCtrl.setValidators([
            this.fieldValidatorsService.requiredField('CNNumber'),
            this.fieldValidatorsService.numbersField('CNNumber')
          ]);
        } else {
          cnNumberCtrl.setValidators([
            this.fieldValidatorsService.numbersField('CNNumber')
          ]);
        }
        cnNumberCtrl.updateValueAndValidity({ emitEvent: false });
      });
    this.CNSearchFormGroup.get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.CNSearchFormGroup.get('endDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }
  createForm() {
    this.CNSearchFormGroup = null;
    console.log('searchData', this.searchData);
    this.CNSearchFormGroup = new FormGroup({
      cnNumber: new FormControl(
        this.searchData?.cnNumber && this.searchData?.cnNumber !== null
          ? this.searchData?.cnNumber
          : '',
        [this.fieldValidatorsService.numbersField('CN Number')]
      ),
      fiscalYear: new FormControl(
        this.searchData?.fiscalYear && this.searchData?.fiscalYear !== null
          ? this.searchData?.fiscalYear
          : ''
      ),
      mobileNumber: new FormControl(
        this.searchData?.mobileNumber && this.searchData?.mobileNumber !== null
          ? this.searchData?.mobileNumber
          : '',
        [this.fieldValidatorsService.mobileField('Mobile Number')]
      ),
      startDate: new FormControl(
        this.searchData?.startDate && this.searchData?.startDate !== null
          ? moment(this.searchData?.startDate)
          : null
      ),
      endDate: new FormControl(
        this.searchData?.endDate && this.searchData?.endDate !== null
          ? moment(this.searchData?.endDate)
          : null
      ),
      isUnipayCN: new FormControl(
        this.searchData?.isUnipayCN !== null
          ? this.searchData?.isUnipayCN
          : null
      )
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResult']) {
      this.disableButton = true;
      this.disbaleActiveCN = true;
      this.disableCancelCN = true;
    }
    if (changes['searchData']) {
      if (this.searchData) {
        this.createForm();
      }
    }
  }
  getComponents() {
    return {
      radioButtonRowRender: RadioButtonCellComponent,
      checkboxCellRenderer: CheckboxCellComponent
    };
  }
  cnDetailsType(type: string) {
    this.cnDetails.emit({ type: type, id: this.id });
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
  selectionChange(data) {
    this.disableButton = true;
    this.disbaleActiveCN = true;
    this.disableCancelCN = true;
    this.disableRemoveGoldRateButton = true;
    this.id = data.id;
    if (data.isCancleAllowed) {
      this.disableCancelCN = false;
    }
    if (data.status.toUpperCase() === 'SUSPENDED') {
      this.disbaleActiveCN = false;
    } else if (
      data.status.toUpperCase() === 'OPEN' &&
      data.frozenRateDetails === null
    ) {
      this.disableButton = false;
    } else if (data.frozenRateDetails && data.status.toUpperCase() === 'OPEN') {
      this.disableRemoveGoldRateButton = false;
    }
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.field === 'docNo') {
      this.cnDetails.emit({
        type: this.cnSearchEnumRef.CN_DETAILS,
        id: clickEvent.data?.id
      });
    }
  }

  search() {
    const response = {
      cnNumber: this.CNSearchFormGroup.get('cnNumber').value,
      mobileNumber: this.CNSearchFormGroup.get('mobileNumber').value,
      fiscalYear: this.CNSearchFormGroup.get('fiscalYear').value,
      startDate:
        this.CNSearchFormGroup.get('startDate').value !== null
          ? this.CNSearchFormGroup.get('startDate').value.valueOf()
          : null,
      endDate:
        this.CNSearchFormGroup.get('endDate').value !== null
          ? this.CNSearchFormGroup.get('endDate').value.valueOf()
          : null,
      isUnipayCN: this.CNSearchFormGroup.get('isUnipayCN').value
    };
    this.emitSearch.emit(response);
  }
  emitPagination($event) {
    this.emitPaginator.emit({
      paginator: $event,
      searchFormGroup: this.CNSearchFormGroup
    });
  }
  clearDocRange() {
    this.CNSearchFormGroup.get('startDate').setValue(null);
    this.CNSearchFormGroup.get('endDate').setValue(null);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
