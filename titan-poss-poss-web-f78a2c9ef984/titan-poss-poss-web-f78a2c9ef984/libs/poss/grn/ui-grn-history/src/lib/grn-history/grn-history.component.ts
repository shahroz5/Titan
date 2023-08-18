import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import {
  GrnHistoryDetails,
  GrnEnums,
  GrnHistoryPayload,
  GRN_SEARCH_BY_ENUM,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { PageEvent } from '@angular/material/paginator';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
@Component({
  selector: 'poss-web-grn-history',
  templateUrl: './grn-history.component.html',
  styleUrls: ['./grn-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrnHistoryComponent implements OnInit, OnDestroy {
  @Input() totalGrnHistoryReq: number;
  @Input() grnHistory: GrnHistoryDetails[];
  @Input() pageSizeOptions: number[] = [];
  @Input() pageEvent;
  @Input() countryFiscalYear: number;
  @Input() historySearchParams: GrnHistoryPayload;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() searchHistory = new EventEmitter<any>();
  @Output() selectedGrn = new EventEmitter<{grnId: string, isWorkflow: boolean, creditNoteType: string}>();

  destroy$: Subject<null> = new Subject<null>();
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  columnDefs = [];
  data: any;

  defaultColDef = {
    flex: 1,
    suppressMovable: true
  };
  minPageSize = 3;
  searchForm: FormGroup;
  currentDate = moment();
  mobileNo: string;
  fiscalYear: string;
  cmNumber: string;
  grnNumber: string;
  utcOffset = moment().startOf('day').utcOffset();
  searchTypes: SelectDropDownOption[] = [];
  showSearchField: boolean;
  searchFieldPlaceholder: string;
  panNoOption: string;
  emailIdOption: string;
  ulpIdOption: string;
  gstNoOption: string;
  cmLocationLabel: any;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private dateFormatterService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );

    this.translate
      .get([
        'pw.grn.grnNo',
        'pw.grn.cnNumber',
        'pw.grn.cmLocationLabel',
        'pw.grn.fiscalYear',
        'pw.grn.customerNameLabel',
        'pw.grn.netAmount',
        'pw.grn.createdBy',
        'pw.grn.createdDate',
        'pw.grn.status',
        'pw.grn.mobileNoOption',
        'pw.grn.ulpIdOption',
        'pw.grn.panNoOption',
        'pw.grn.gstNoOption',
        'pw.grn.passportIdOption',
        'pw.grn.emailIdOption',
        'pw.grn.cmNumber',
        'pw.grn.creditNoteType'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName: translatedMessages['pw.grn.grnNo'],
            field: 'grnNo',
            width: 150,
            suppressMovable: true,
            cellRenderer: params => this.viewAnchorRenderer(params),
            cellClass: 'pw-fourth-color',
            cellStyle: { cursor: 'pointer' }
          },

          {
            headerName: translatedMessages['pw.grn.cnNumber'],
            field: 'cnNumber',
            width: 250,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grn.creditNoteType'],
            field: 'creditNoteType',
            width: 250,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grn.cmLocationLabel'],
            field: 'cmLocation',
            width: 250,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.grn.fiscalYear'],
            suppressMovable: true,
            field: 'fiscalYear',

            width: 150
          },
          {
            headerName: translatedMessages['pw.grn.customerNameLabel'],
            field: 'customerName',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.grn.netAmount'],
            field: 'netAmount',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.grn.createdBy'],
            field: 'createdBy',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.grn.createdDate'],
            field: 'docDate',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMessages['pw.grn.status'],
            field: 'status',
            cellStyle: params => {
              if (params.data.status === GrnEnums.CONFIRMED) {
                return { color: 'green' };
              }
              if (params.data.status === GrnEnums.PENDING) {
                return { color: 'orange' };
              }
              if (params.data.status === GrnEnums.REJECTED) {
                return { color: 'red' };
              }
            },
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          }
        ];

        this.fiscalYear = translatedMessages['pw.grn.fiscalYear'];
        this.grnNumber = translatedMessages['pw.grn.grnNo'];
        this.cmNumber = translatedMessages['pw.grn.cmNumber'];

        this.mobileNo = translatedMessages['pw.grn.mobileNoOption'];
        this.panNoOption = translatedMessages['pw.grn.panNoOption'];
        this.emailIdOption = translatedMessages['pw.grn.emailIdOption'];
        this.ulpIdOption = translatedMessages['pw.grn.ulpIdOption'];
        this.gstNoOption = translatedMessages['pw.grn.gstNoOption'];
        this.cmLocationLabel = translatedMessages['pw.grn.cmLocationLabel'];

        this.searchForm = new FormGroup({
          grnNumber: new FormControl(null, [
            this.fieldValidatorsService.numbersField(this.grnNumber)
          ]),
          cmNumber: new FormControl(null, [
            this.fieldValidatorsService.numbersField(this.cmNumber)
          ]),
          fiscalYear: new FormControl(this.countryFiscalYear, [
            this.fieldValidatorsService.maxLength(4, this.fiscalYear),
            this.fieldValidatorsService.minLength(4, this.fiscalYear),
            this.fieldValidatorsService.numbersField(this.fiscalYear),
            this.fieldValidatorsService.max(
              this.countryFiscalYear,
              this.fiscalYear
            )
          ]),
          searchField: new FormControl(null),
          searchType: new FormControl(null),
          fromDocDate: new FormControl(null),
          toDocDate: new FormControl(null),
          cmLocation: new FormControl(null)
        });

        this.searchForm
          .get('grnNumber')
          .valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            if (this.searchForm?.get('grnNumber').value !== '') {
              this.searchForm
                .get('fiscalYear')
                .setValidators([
                  this.fieldValidatorsService.requiredField(this.fiscalYear),
                  this.fieldValidatorsService.maxLength(4, this.fiscalYear),
                  this.fieldValidatorsService.minLength(4, this.fiscalYear),
                  this.fieldValidatorsService.numbersField(this.fiscalYear),
                  this.fieldValidatorsService.max(
                    this.countryFiscalYear,
                    this.fiscalYear
                  )
                ]);
              this.searchForm
                .get('fiscalYear')
                .updateValueAndValidity({ onlySelf: true });
            } else {
              this.searchForm.get('fiscalYear').clearValidators();

              this.searchForm
                .get('fiscalYear')
                .setValidators([
                  this.fieldValidatorsService.maxLength(4, this.fiscalYear),
                  this.fieldValidatorsService.minLength(4, this.fiscalYear),
                  this.fieldValidatorsService.numbersField(this.fiscalYear),
                  this.fieldValidatorsService.max(
                    this.countryFiscalYear,
                    this.fiscalYear
                  )
                ]);
              this.searchForm
                .get('fiscalYear')
                .updateValueAndValidity({ onlySelf: true });
            }
          });

        this.searchTypes = [
          {
            value: GRN_SEARCH_BY_ENUM.MOBILE_NO,
            description: translatedMessages['pw.grn.mobileNoOption']
          },
          {
            value: GRN_SEARCH_BY_ENUM.PAN_NO,
            description: translatedMessages['pw.grn.panNoOption']
          },
          {
            value: GRN_SEARCH_BY_ENUM.EMAIL_ID,
            description: translatedMessages['pw.grn.emailIdOption']
          },
          {
            value: GRN_SEARCH_BY_ENUM.ULP_ID,
            description: translatedMessages['pw.grn.ulpIdOption']
          },
          {
            value: GRN_SEARCH_BY_ENUM.GST_NO,
            description: translatedMessages['pw.grn.gstNoOption']
          }
        ];
      });

    this.searchForm
      .get('fromDocDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('date', data);
        const endDate = this.searchForm.get('toDocDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });

    if (this.historySearchParams) {
      this.data = this.historySearchParams;
        this.searchForm.get('fiscalYear').setValue(
          this.historySearchParams.filterOptions.fiscalYear
        );

      this.searchForm.get('grnNumber').setValue(this.historySearchParams.filterOptions.docNo);
      this.searchForm.get('cmNumber').setValue(this.historySearchParams.filterOptions.refDocNo);
      this.searchForm.get('cmLocation').setValue(this.historySearchParams.filterOptions.cmLocation);

      this.searchForm.get('fromDocDate').setValue(
        moment(this.historySearchParams.filterOptions.fromDocDate)
      );

      this.searchForm.get('toDocDate').setValue(
        moment(this.historySearchParams.filterOptions.toDocDate)
      );

      if (this.historySearchParams.filterOptions.searchType) {
        this.searchForm.get('searchType').setValue(
          this.historySearchParams.filterOptions.searchType
        );
        this.searchForm.get('searchField').setValue(
          this.historySearchParams.filterOptions.searchField
        );

        this.setSearchField({
          value: this.historySearchParams.filterOptions.searchType
        });
      }

      this.searchForm.updateValueAndValidity();
      this.search();
    }
  }

  viewAnchorRenderer(params) {
    return `<a class="pw-anchor-underline pw-fourth-color">${params.value}</a>`;
  }

  onSearchTypeChanged(event: any) {
    this.searchForm.get('searchField').reset();
    this.setSearchField(event);
  }

  setSearchField(event:any){
    if (event) {
      if (event.value) {
        this.showSearchField = true;
      } else {
        this.showSearchField = false;
        this.searchForm.get('searchField').setValidators([]);
      }
      if (event.value === GRN_SEARCH_BY_ENUM.MOBILE_NO) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.mobileField(this.mobileNo),
            this.fieldValidatorsService.requiredField(this.mobileNo)
          ]);
        this.searchFieldPlaceholder = this.mobileNo;
      } else if (event.value === GRN_SEARCH_BY_ENUM.PAN_NO) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.pancardField(this.panNoOption),
            this.fieldValidatorsService.requiredField(this.panNoOption)
          ]);
        this.searchFieldPlaceholder = this.panNoOption;
      } else if (event.value === GRN_SEARCH_BY_ENUM.EMAIL_ID) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.emailField(this.emailIdOption),
            this.fieldValidatorsService.requiredField(this.emailIdOption)
          ]);
        this.searchFieldPlaceholder = this.emailIdOption;
      } else if (event.value === GRN_SEARCH_BY_ENUM.ULP_ID) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.ulpIdField(this.ulpIdOption),
            this.fieldValidatorsService.ulpIdField(this.ulpIdOption)
          ]);
        this.searchFieldPlaceholder = this.ulpIdOption;
      } else if (event.value === GRN_SEARCH_BY_ENUM.GST_NO) {
        this.searchForm
          .get('searchField')
          .setValidators([
            this.fieldValidatorsService.gstNumberField(this.gstNoOption),
            this.fieldValidatorsService.requiredField(this.gstNoOption)
          ]);
        this.searchFieldPlaceholder = this.gstNoOption;
      }
      this.searchForm.get('searchField').updateValueAndValidity();
    }
  }

  clearDocRange() {
    this.searchForm.get('fromDocDate').reset();
    this.searchForm.get('toDocDate').reset();
  }
  search() {
    const searchValue = {
      docNo: this.searchForm.get('grnNumber')?.value
        ? this.searchForm.get('grnNumber')?.value
        : null,
      fiscalYear: this.searchForm.get('fiscalYear')?.value
        ? this.searchForm.get('fiscalYear')?.value
        : null,
      refDocNo: this.searchForm.get('cmNumber')?.value
        ? this.searchForm.get('cmNumber')?.value
        : null,
      searchType: this.searchForm.get('searchType')?.value
        ? this.searchForm.get('searchType')?.value
        : null,
      searchField: this.searchForm.get('searchField')?.value
        ? this.searchForm.get('searchField').value
        : null,
      fromDocDate: this.searchForm.get('fromDocDate')?.value?.startOf('days')
        ? this.searchForm
            .get('fromDocDate')
            ?.value.startOf('days')
            .add(this.utcOffset, 'm')
            .valueOf()
        : null,
      toDocDate: this.searchForm.get('toDocDate')?.value?.startOf('days')
        ? this.searchForm
            .get('toDocDate')
            ?.value.startOf('days')
            .add(this.utcOffset, 'm')
            .valueOf()
        : null,
      cmLocation: this.searchForm.get('cmLocation')?.value
        ? this.searchForm.get('cmLocation')?.value?.toUpperCase()
        : null
    };
    let grnHistoryPayload: GrnHistoryPayload;
    grnHistoryPayload = {
      filterOptions: searchValue
    };
    if (this.searchForm.valid) {
      this.searchHistory.emit(grnHistoryPayload);
    }
  }

  onCellClicked(event) {
    this.selectedGrn.emit({
      grnId: event.data.grnId,
      isWorkflow: false,
      creditNoteType: event.data.creditNoteType
    });
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    this.currentRowInfo = this.grnHistory[this.currentRowIndex][
      this.currentRowField
    ];
    if (this.currentRowField === 'docDate')
      this.currentRowInfo = this.dateFormatterService.format(
        moment(this.currentRowInfo)
      );
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
