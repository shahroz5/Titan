import {
  Component,
  OnDestroy,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import {
  ReportFilterOptions,
  ReportName,
  GenerateReportRequest,
  ReportBTQCodePayload,
  SearchParameter,
  SaveSearchParametersPayload
} from '@poss-web/shared/models';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import {
  getFromMinDate,
  getToMaxDate,
  generateCnReport
} from '@poss-web/shared/reports/util-reports';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-cn-register-filter-btq-user',
  templateUrl: './cn-register-filter-btq-user.component.html'
})
export class CnRegisterFilterBtqUserComponent
  implements OnDestroy, OnChanges {
  @Input() filterOptions: ReportFilterOptions;
  @Input() reportNameDetails: ReportName;
  @Input() reportNameControl: FormControl;
  @Input() boutiqueCode: string;
  @Input() searchParameter: SearchParameter;
  @Input() businessDate: any;

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

  destroy$ = new Subject();
  filterForm: FormGroup;
  maxDays = 0;

  fromDateLabel;
  toDateLabel;
  brandLabel;
  reportNameLabel;
  btqCodeLabel;
  cnTypeLabel: string;
  cnStatusLabel: string;
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
    const cnTypeLabel = 'pw.reports.cnType';
    const cnStatusLabel = 'pw.reports.cnStatus';
    this.translate
      .get([
        fromDateLabelKey,
        toDateLabelKey,
        brandLabelKey,
        reportNameLabelKey,
        btqCodeLabelKey,
        cnTypeLabel,
        cnStatusLabel
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.fromDateLabel = translatedMessages[fromDateLabelKey];
        this.toDateLabel = translatedMessages[toDateLabelKey];
        this.brandLabel = translatedMessages[brandLabelKey];
        this.reportNameLabel = translatedMessages[reportNameLabelKey];
        this.btqCodeLabel = translatedMessages[btqCodeLabelKey];
        this.cnTypeLabel = translatedMessages[cnTypeLabel];
        this.cnStatusLabel = translatedMessages[cnStatusLabel];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.businessDate = moment(this.businessDate);
    this.maxDays = this.reportNameDetails.maxNoOfDays;
    this.createForm();
  }



  generateReport() {
    generateCnReport(this.filterForm, this.apply, false, true);
  }

  createForm() {
    this.filterForm = this.fb.group({
      reportNameControl: [
        this?.reportNameDetails ? this.reportNameDetails.id : null,
        this.fieldValidatorsService.requiredField(this.reportNameLabel)
      ],
      fromDate: [
        this?.searchParameter
          ? this.searchParameter?.fromDate
          : this.businessDate,

        this.fieldValidatorsService.requiredField(this.fromDateLabel)
      ],
      toDate: [
        this?.searchParameter?.toDate
          ? this.searchParameter.toDate
          : this.businessDate,

        this.fieldValidatorsService.requiredField(this.toDateLabel)
      ],
      btqCode: [
        this.boutiqueCode,
        this.fieldValidatorsService.requiredField(this.btqCodeLabel)
      ],
      cnType: [
        this?.searchParameter?.cnType ? this?.searchParameter?.cnType : null,
        this.fieldValidatorsService.requiredField(this.cnTypeLabel)
      ],
      cnStatus: [
        this?.searchParameter?.cnStatus
          ? this?.searchParameter?.cnStatus
          : null,
        this.fieldValidatorsService.requiredField(this.cnStatusLabel)
      ],
      fromAmount: [
        this?.searchParameter?.fromAmount
          ? this?.searchParameter?.fromAmount
          : null
      ],
      toAmount: [
        this?.searchParameter?.toAmount ? this?.searchParameter?.toAmount : null
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
              cnType: this.filterForm.get('cnType').value,
              cnStatus: this.filterForm.get('cnStatus').value,
              fromAmount: this.filterForm.get('fromAmount').value,
              toAmount: this.filterForm.get('toAmount').value
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

  getMaxDate() {
    this.toMaxDate = getToMaxDate(this.filterForm, 'fromDate', this.maxDays);
  }

  getToMaxDate(): moment.Moment {
    return getToMaxDate(this.filterForm, 'fromDate', this.maxDays);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
