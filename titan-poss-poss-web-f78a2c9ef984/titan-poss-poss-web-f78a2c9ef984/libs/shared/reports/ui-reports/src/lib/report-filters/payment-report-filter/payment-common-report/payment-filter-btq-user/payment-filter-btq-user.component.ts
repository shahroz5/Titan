import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  ReportFilterOptions,
  ReportName,
  GenerateReportRequest,
  SaveSearchParametersPayload,
  SearchParameter
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
// import { generateReport } from '../payment-report-filter-common/payment-report-filter-common';
import {
  getFromMinDate,
  getToMaxDate,
  generatePaymentReport
} from '@poss-web/shared/reports/util-reports';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-payment-filter-btq-user',
  templateUrl: './payment-filter-btq-user.component.html'
})
export class PaymentFilterBtqUserComponent
  implements OnDestroy, OnChanges {
  @Input() filterOptions: ReportFilterOptions;
  @Input() reportNameDetails: ReportName;
  @Input() reportNameControl: FormControl;
  @Input() boutiqueCode: string;
  @Input() searchParameter: SearchParameter;
  @Input() businessDate: any;

  @Output() clear = new EventEmitter<null>();
  @Output() apply = new EventEmitter<GenerateReportRequest>();
  @Output() countryChange = new EventEmitter<string>();
  @Output() stateChange = new EventEmitter<string>();
  @Output() saveSearchParameters = new EventEmitter<
    SaveSearchParametersPayload
  >();
  @Output() fieldSet = new EventEmitter<boolean>();

  destroy$ = new Subject();
  filterForm: FormGroup;
  maxDays = 0;

  fromDateLabel;
  toDateLabel;
  brandLabel;
  reportNameLabel;
  btqCodeLabel;
  fromMinDate: Moment;
  toMaxDate: Moment;

  constructor(
    private fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    const fromDateLabelKey = 'pw.reports.fromDateLabel';
    const toDateLabelKey = 'pw.reports.toDateLabel';
    const brandLabelKey = 'pw.reports.brandLabel';
    const reportNameLabelKey = 'pw.reports.reportNameLabel';
    const btqCodeLabelKey = 'pw.reports.btqCodeLabel';
    this.translate
      .get([
        fromDateLabelKey,
        toDateLabelKey,
        brandLabelKey,
        reportNameLabelKey,
        btqCodeLabelKey
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.fromDateLabel = translatedMessages[fromDateLabelKey];
        this.toDateLabel = translatedMessages[toDateLabelKey];
        this.brandLabel = translatedMessages[brandLabelKey];
        this.reportNameLabel = translatedMessages[reportNameLabelKey];
        this.btqCodeLabel = translatedMessages[btqCodeLabelKey];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.businessDate = moment(this.businessDate);
    this.maxDays = this.reportNameDetails.maxNoOfDays;
    this.createForm();
  }



  // formDateChange() {
  //   if (this.filterForm) {
  //     //  this.filterForm.get('toDate').reset();
  //   }
  // }

  generateReport() {
    generatePaymentReport(this.filterForm, this.apply, false, true);
  }

  createForm() {
    this.filterForm = this.fb.group({
      reportNameControl: [
        this?.reportNameDetails?.id,
        this.fieldValidatorsService.requiredField(this.reportNameLabel)
      ],
      fromDate: [
        this.searchParameter
          ? this.searchParameter?.fromDate
          : this.businessDate,
        this.fieldValidatorsService.requiredField(this.fromDateLabel)
      ],
      toDate: [
        this.searchParameter ? this.searchParameter?.toDate : this.businessDate,
        this.fieldValidatorsService.requiredField(this.toDateLabel)
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
      cfaProductCode: [],
      productCategory: [],
      binGroup: [],
      paymentType: [
        this.searchParameter ? this.searchParameter?.paymentType : null
      ]
    });
    this.getFromMinDate();
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
              reportType: this.reportNameDetails.reportType,

              locationCode: this.filterForm.get('btqCode').value,
              paymentType: this.filterForm.get('paymentType').value
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

  clearFilter() {
    this.filterForm.reset();
    this.clear.emit();
    this.filterForm
      .get('reportNameControl')
      .patchValue(this.reportNameDetails.id);
    this.filterForm.get('btqCode').patchValue(this.boutiqueCode);

    this.filterForm.get('fromDate').patchValue(this.businessDate);
    this.filterForm.get('toDate').patchValue(this.businessDate);
  }

  getFromMinDate() {
    this.fromMinDate = getFromMinDate(this.filterForm, 'toDate', this.maxDays);
  }

  getToMaxDate(): moment.Moment {
    return getToMaxDate(this.filterForm, 'fromDate', this.maxDays);
  }

  getMaxDate() {
    this.toMaxDate = getToMaxDate(this.filterForm, 'fromDate', this.maxDays);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
