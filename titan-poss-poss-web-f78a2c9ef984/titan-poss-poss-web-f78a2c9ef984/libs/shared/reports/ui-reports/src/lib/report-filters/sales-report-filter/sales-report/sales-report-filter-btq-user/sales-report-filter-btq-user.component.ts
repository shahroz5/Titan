import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  ReportFilterOptions,
  GenerateReportRequest,
  ReportBTQCodePayload,
  ReportName,
  SaveSearchParametersPayload,
  SearchParameter
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import {
  getFromMinDate,
  getToMaxDate,
  generateSalesReport
} from '@poss-web/shared/reports/util-reports';
import { Moment } from 'moment';

@Component({
  selector: 'poss-web-sales-report-filter-btq-user',
  templateUrl: './sales-report-filter-btq-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesReportFilterBtqUserComponent
  implements OnDestroy, OnChanges {
  @Input() filterOptions: ReportFilterOptions;
  @Input() reportNameDetails: ReportName;
  @Input() businessDate: any;
  @Input() reportNameControl: FormControl;
  @Input() searchParameter: SearchParameter;
  @Input() currentFiscalYear: number;
  @Input() boutiqueCode: string;

  @Output() clear = new EventEmitter<null>();
  @Output() apply = new EventEmitter<{
    form: FormGroup;
    request: GenerateReportRequest;
  }>();
  @Output() countryChange = new EventEmitter<string>();
  @Output() stateChange = new EventEmitter<string>();
  @Output() loadLocations = new EventEmitter<ReportBTQCodePayload>();
  @Output() saveSearchParameters = new EventEmitter<
    SaveSearchParametersPayload
  >();
  @Output() fieldSet = new EventEmitter<boolean>();
  @Output() locationCodeChange = new EventEmitter<string[]>();

  destroy$ = new Subject();
  filterForm: FormGroup;
  maxDays = 0;

  fromDateLabel;
  toDateLabel;
  brandLabel;
  reportNameLabel;
  maxDate = moment();
  fromMinDate;
  fiscalYear: string;
  docNo: string;
  customerMobileNo: string;
  customerName: string;
  ulpNo: string;
  btqCodeLabel: string;
  toMaxDate: moment.Moment;
  constructor(
    private fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    const fromDateLabelKey = 'pw.reports.fromDateLabel';
    const toDateLabelKey = 'pw.reports.toDateLabel';
    const brandLabelKey = 'pw.reports.brandLabel';
    const reportNameLabelKey = 'pw.reports.reportNameLabel';
    const fiscalYear = 'pw.reports.fiscalYear';
    const docNo = 'pw.reports.docNo';

    const customerMobileNo = 'pw.reports.customerMobileNo';
    const customerName = 'pw.reports.customerName';
    const ulpNo = 'pw.reports.ulpNo';
    const btqCodeLabelKey = 'pw.reports.btqCodeLabel';

    this.translate
      .get([
        fromDateLabelKey,
        toDateLabelKey,
        brandLabelKey,
        reportNameLabelKey,
        fiscalYear,
        docNo,
        customerMobileNo,
        customerName,
        ulpNo,
        btqCodeLabelKey
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.fromDateLabel = translatedMessages[fromDateLabelKey];
        this.toDateLabel = translatedMessages[toDateLabelKey];
        this.brandLabel = translatedMessages[brandLabelKey];
        this.reportNameLabel = translatedMessages[reportNameLabelKey];
        this.fiscalYear = translatedMessages[fiscalYear];
        this.docNo = translatedMessages[docNo];
        this.customerMobileNo = translatedMessages[customerMobileNo];
        this.customerName = translatedMessages[customerName];
        this.ulpNo = translatedMessages[ulpNo];
        this.btqCodeLabel = translatedMessages[btqCodeLabelKey];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.businessDate = moment(this.businessDate);
    this.maxDays = this.reportNameDetails?.maxNoOfDays;
    this.createForm();
  }


  // formDateChange() {
  //   if (this.filterForm) {
  //     this.filterForm.get('toDate').reset();
  //   }
  // }

  generateReport() {
    generateSalesReport(this.filterForm, this.apply, false, true);
  }

  createForm() {
    this.filterForm = this.fb.group({
      reportNameControl: [
        this?.reportNameDetails ? this.reportNameDetails.id : null,
        this.fieldValidatorsService.requiredField(this.reportNameLabel)
      ],
      fromDate: [
        this?.searchParameter?.fromDate
          ? this.searchParameter.fromDate
          : this.businessDate
      ],
      toDate: [
        this?.searchParameter?.toDate
          ? this.searchParameter.toDate
          : this.businessDate
      ],

      fiscalYear: [
        this?.searchParameter?.fiscalYear
          ? this.searchParameter.fiscalYear
          : this.currentFiscalYear,
        [
          this.fieldValidatorsService.maxLength(4, this.fiscalYear),
          this.fieldValidatorsService.minLength(4, this.fiscalYear),
          this.fieldValidatorsService.numbersField(this.fiscalYear),
          this.fieldValidatorsService.max(
            this.currentFiscalYear,
            this.fiscalYear
          )
        ]
      ],
      level: [],
      country: [],
      state: [],
      town: [],
      region: [],
      brand: [],
      btqCode: [
        this.boutiqueCode,
        this.fieldValidatorsService.requiredField(this.btqCodeLabel)
      ],
      cfaProductCode: [
        this?.searchParameter?.productGroupCode
          ? this?.searchParameter?.productGroupCode
          : null
      ],
      binGroup: [
        this?.searchParameter?.binGroupCode
          ? this?.searchParameter?.binGroupCode
          : null
      ],
      karatage: [
        this?.searchParameter?.karatage ? this?.searchParameter?.karatage : null
      ],
      complexity: [
        this?.searchParameter?.complexity
          ? this?.searchParameter?.complexity
          : null
      ],
      confirmedByRso: [
        this?.searchParameter?.confirmedByRso
          ? this?.searchParameter?.confirmedByRso
          : null
      ],
      fromGrossWeight: [
        this?.searchParameter?.fromGrossWeight
          ? this?.searchParameter?.fromGrossWeight
          : null
      ],
      toGrossWeight: [
        this?.searchParameter?.toGrossWeight
          ? this?.searchParameter?.toGrossWeight
          : null
      ],
      fromValue: [
        this?.searchParameter?.fromValue
          ? this?.searchParameter?.fromValue
          : null
      ],
      toValue: [
        this?.searchParameter?.toValue ? this?.searchParameter?.toValue : null
      ],
      docNo: [
        this?.searchParameter?.docNo ? this?.searchParameter?.docNo : null,

        this.fieldValidatorsService.numbersField(this.docNo)
      ],
      customerMobileNo: [
        this?.searchParameter?.customerMobileNo
          ? this?.searchParameter?.customerMobileNo
          : null,
        this.fieldValidatorsService.mobileField(this.customerMobileNo)
      ],
      customerName: [
        this?.searchParameter?.customerName
          ? this?.searchParameter?.customerName
          : null,

        this.fieldValidatorsService.customerNameField(this.customerName)
      ],
      ulpNo: [
        this?.searchParameter?.ulpNo ? this?.searchParameter?.ulpNo : null,
        this.fieldValidatorsService.ulpIdField(this.ulpNo)
      ]
    });

    this.locationCodeChange.emit([this.boutiqueCode]);

    this.getFromMinDate();
  }

  clearFilter() {
    this.filterForm.reset();
    this.clear.emit();
    this.filterForm
      .get('reportNameControl')
      .patchValue(this.reportNameDetails.id);
    this.filterForm.get('btqCode').patchValue(this.boutiqueCode);
    this.filterForm.get('fromDate').patchValue(this.businessDate);
    this.filterForm.get('toDate').patchValue(this.businessDate);
    this.filterForm.get('fiscalYear').patchValue(this.currentFiscalYear);
  }
  saveSearch() {
    if (this.filterForm.valid) {
      this.saveSearchParameters.emit({
        reportMasterId: this.reportNameDetails.id,
        data: {
          queryName: this.reportNameDetails.reportDes,
          savedQuery: {
            data: {
              fromDate: (this.filterForm.get('fromDate').value as Moment)
                .startOf('day')
                .valueOf(),
              toDate: (this.filterForm.get('toDate').value as Moment)
                .endOf('day')
                .valueOf(),
              locationCode: this.filterForm.get('btqCode').value,
              fiscalYear: this.filterForm.get('fiscalYear').value,
              productGroupCode: this.filterForm.get('cfaProductCode').value,
              binGroupCode: this.filterForm.get('binGroup').value,
              karatage: this.filterForm.get('karatage').value,
              complexity: this.filterForm.get('complexity').value,
              rsoName: this.filterForm.get('confirmedByRso').value,
              fromWt: this.filterForm.get('fromGrossWeight').value,
              toWt: this.filterForm.get('toGrossWeight').value,
              fromValue: this.filterForm.get('fromValue').value,
              toValue: this.filterForm.get('toValue').value,
              docNo: this.filterForm.get('docNo').value,
              customerMobileNo: this.filterForm.get('customerMobileNo').value,
              customerName: this.filterForm.get('customerName').value,
              ulpNo: this.filterForm.get('ulpNo').value
            },
            type: 'REPORT_QUERY'
          }
        }
      });
    } else {
      this.filterForm.markAllAsTouched();
    }
  }
  fieldSettings() {
    this.fieldSet.emit(true);
  }

  getFromMinDate() {
    this.fromMinDate = getFromMinDate(this.filterForm, 'toDate', this.maxDays);
  }

  getToMaxDate() {
    this.maxDate = getToMaxDate(this.filterForm, 'fromDate', this.maxDays);
  }

  getMaxDate() {
    this.toMaxDate = getToMaxDate(this.filterForm, 'fromDate', this.maxDays);
  }

  onCountryDropDownChange(event) {
    this.filterForm.get('country').patchValue(event.value);
  }
  onStateDropDownChange(event) {
    this.filterForm.get('state').patchValue(event.value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
