import {
  Component,
  OnInit,
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
  SaveSearchParametersPayload,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subject, merge } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import {
  countryStateChange,
  getFromMinDate,
  getToMaxDate,
  generateCnCommonReport
} from '@poss-web/shared/reports/util-reports';
import { Moment } from 'moment';
import * as moment from 'moment';
@Component({
  selector: 'poss-web-cn-filter-reg-user',
  templateUrl: './cn-filter-reg-user.component.html'
})
export class CnFilterRegUserComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filterOptions: ReportFilterOptions;
  @Input() reportNameDetails: ReportName;
  @Input() defaultBrands: string[];
  @Input() defaultCountry: string;
  @Input() reportNameControl: FormControl;
  @Input() searchParameter: SearchParameter;
  @Input() regionCode: string;

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
  @Output() brandChange = new EventEmitter<string[]>();


  destroy$ = new Subject();
  filterForm: FormGroup;
  maxDays = 0;

  fromDateLabel;
  toDateLabel;
  brandLabel;
  reportNameLabel;
  cnTypeLabel: string;
  cnStatusLabel: string;
  fromMinDate: Moment;
  toMaxDate: Moment;

  constructor(
    private fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    const fromDateLabelKey = 'pw.reports.fromDateLabel';
    const toDateLabelKey = 'pw.reports.toDateLabel';
    const brandLabelKey = 'pw.reports.brandLabel';
    const reportNameLabelKey = 'pw.reports.reportNameLabel';
    const cnTypeLabel = 'pw.reports.cnType';
    const cnStatusLabel = 'pw.reports.cnStatus';

    this.translate
      .get([
        fromDateLabelKey,
        toDateLabelKey,
        brandLabelKey,
        reportNameLabelKey,
        cnTypeLabel,
        cnStatusLabel
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.fromDateLabel = translatedMessages[fromDateLabelKey];
        this.toDateLabel = translatedMessages[toDateLabelKey];
        this.brandLabel = translatedMessages[brandLabelKey];
        this.reportNameLabel = translatedMessages[reportNameLabelKey];
        this.cnTypeLabel = translatedMessages[cnTypeLabel];
        this.cnStatusLabel = translatedMessages[cnStatusLabel];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this?.searchParameter?.brandCode) {
      this.onBrandChange(this?.searchParameter?.brandCode)
    } else {
      this.onBrandChange(this.defaultBrands)
    }
    this.createForm();
  }

  ngOnInit() {
    this.maxDays = this.reportNameDetails.maxNoOfDays;
    if (this.filterForm.get('country').value !== null) {
      this.countryChange.emit(this.filterForm.get('country').value);
    }
    this.loadLocationsEvent();
  }

  formDateChnage() {
    if (this.filterForm) {
      this.filterForm.get('toDate').reset();
    }
  }

  generateReport() {
    generateCnCommonReport(this.filterForm, this.apply, true, false);
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
          : moment(),

        this.fieldValidatorsService.requiredField(this.fromDateLabel)
      ],
      toDate: [
        this?.searchParameter?.toDate ? this.searchParameter.toDate : moment(),

        this.fieldValidatorsService.requiredField(this.toDateLabel)
      ],
      level: [
        this?.searchParameter?.ownerType ? this.searchParameter.ownerType : null
      ],
      country: [
        this?.searchParameter?.countryCode
          ? this?.searchParameter.countryCode
          : this.defaultCountry
      ],
      state: [
        this?.searchParameter?.stateId ? this.searchParameter?.stateId : null
      ],
      town: [
        this?.searchParameter?.townId ? this.searchParameter?.townId : null
      ],
      region: [
        this?.searchParameter?.regionCode
          ? this.searchParameter.regionCode
          : this.regionCode
      ],
      brand: [
        this?.searchParameter?.brandCode
          ? this?.searchParameter?.brandCode
          : this.defaultBrands,
        this.fieldValidatorsService.requiredField(this.brandLabel)
      ],
      subBrand: [
        this?.searchParameter?.subBrandCode
          ? this?.searchParameter?.subBrandCode
          : []
      ],
      btqCode: [
        this?.searchParameter?.locationCode
          ? this?.searchParameter?.locationCode
          : null
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
      ]
    });

    countryStateChange(
      this.filterForm,
      {
        countryChange: this.countryChange,
        stateChange: this.stateChange
      },
      'country',
      'state',
      'town',
      this.destroy$
    );

    merge(
      this.filterForm.get('level').valueChanges,
      this.filterForm.get('region').valueChanges,
      this.filterForm.get('brand').valueChanges,
      this.filterForm.get('town').valueChanges,
      this.filterForm.get('state').valueChanges,
      this.filterForm.get('country').valueChanges
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.loadLocationsEvent();
        }
      });
  }
  loadLocationsEvent() {
    this.filterForm.get('btqCode').reset();
    const formValue = this.filterForm.getRawValue();
    if (formValue['brand'].length === 0) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.reports.brandAlertMessage'
      });
    } else {
      this.loadLocations.emit({
        brands: formValue['brand'] ? formValue['brand'] : [],
        regions: [this.regionCode],
        levels: formValue['level'] ? formValue['level'] : [],
        countries: formValue['county'] ? [formValue['county']] : [],
        states: formValue['state'] ? [formValue['state']] : [],
        towns: formValue['town'] ? formValue['town'] : []
      });
    }
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
              ownerType: this.filterForm.get('level').value,
              brandCode: this.filterForm.get('brand').value,
              subBrandCode: this.filterForm.get('subBrand').value,
              countryCode: this.filterForm.get('country').value,
              stateId: this.filterForm.get('state').value,
              townId: this.filterForm.get('town').value,
              regionCode: [this.regionCode],
              locationCode: this.filterForm.get('btqCode').value,
              cnType: this.filterForm.get('cnType').value,
              cnStatus: this.filterForm.get('cnStatus').value
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
    this.filterForm.get('fromDate').patchValue(moment());
    this.filterForm.get('toDate').patchValue(moment());
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

  onCountryDropDownChange(event) {
    this.filterForm.get('country').patchValue(event.value);
  }
  onStateDropDownChange(event) {
    this.filterForm.get('state').patchValue(event.value);
  }
  onBrandChange(brandValues: string[]) {
    this.brandChange.emit(brandValues);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.defaultCountry = null;
  }
}
