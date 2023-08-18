import {
  Component,
  OnInit,
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
  SearchParameter,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { Subject, merge } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import {
  countryStateChange,
  locationChange,
  getFromMinDate,
  getToMaxDate,
  generateSalesReport
} from '@poss-web/shared/reports/util-reports';
import { Moment } from 'moment';

@Component({
  selector: 'poss-web-sales-report-filter-reg-user',
  templateUrl: './sales-report-filter-reg-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesReportFilterRegUserComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() filterOptions: ReportFilterOptions;
  @Input() reportNameDetails: ReportName;
  @Input() defaultBrands: string[];
  @Input() defaultCountry: string;
  @Input() reportNameControl: FormControl;
  @Input() searchParameter: SearchParameter;
  @Input() currentFiscalYear: number;
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
  @Output() locationCodeChange = new EventEmitter<string[]>();
  @Output() brandChange = new EventEmitter<string[]>();

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
  toMaxDate: moment.Moment;

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
    const fiscalYear = 'pw.reports.fiscalYear';
    const docNo = 'pw.reports.docNo';

    const customerMobileNo = 'pw.reports.customerMobileNo';
    const customerName = 'pw.reports.customerName';
    const ulpNo = 'pw.reports.ulpNo';

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
        ulpNo
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
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.maxDays = this.reportNameDetails?.maxNoOfDays;

    if (this?.searchParameter?.brandCode) {
      this.onBrandChange(this?.searchParameter?.brandCode)
    } else {
      this.onBrandChange(this.defaultBrands)
    }

    this.createForm();

    this.filterForm
      .get('btqCode')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(locationCode => {
        if (locationCode !== null && locationCode !== undefined) {
          this.locationCodeChange.emit(locationCode);
          this.filterForm.get('confirmedByRso').enable();
        } else {
          this.filterForm.get('confirmedByRso').disable();
        }
      });
  }

  ngOnInit() {
    this.loadLocationsEvent();
    if (this.filterForm.get('country').value !== null) {
      this.countryChange.emit(this.filterForm.get('country').value);
    }
  }

  formDateChange() {
    if (this.filterForm) {
      this.filterForm.get('toDate').reset();
    }
  }

  generateReport() {
    generateSalesReport(this.filterForm, this.apply, true, false);
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
          : moment()
        // this.fieldValidatorsService.requiredField('fromDate')
      ],
      toDate: [
        this?.searchParameter?.toDate ? this.searchParameter.toDate : moment()
        //this.fieldValidatorsService.requiredField('toDate')
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
      level: [
        this?.searchParameter?.ownerType ? this.searchParameter.ownerType : null
      ],
      country: [
        this?.searchParameter?.countryCode
          ? this?.searchParameter.countryCode
          : this.defaultCountry
      ],
      state: [
        this?.searchParameter?.stateId ? this.searchParameter.stateId : null
      ],
      town: [
        this?.searchParameter?.townId ? this.searchParameter.townId : null
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

    this.filterForm.get('confirmedByRso').disable();

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

    locationChange(
      this.filterForm,
      {
        locationFormControlName: this.locationCodeChange
      },
      'btqCode',
      'confirmedByRso',
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

    this.getFromMinDate();
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
        countries: formValue['country'] ? [formValue['country']] : [],
        states: formValue['state'] ? [formValue['state']] : [],
        towns: formValue['town'] ? formValue['town'] : []
      });
    }
  }

  clearFilter() {
    this.filterForm.reset();
    this.clear.emit();
    this.filterForm
      .get('reportNameControl')
      .patchValue(this.reportNameDetails.id);
    this.filterForm.get('fromDate').patchValue(moment());
    this.filterForm.get('toDate').patchValue(moment());
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
              reportType: this.reportNameDetails.reportType,
              ownerType: this.filterForm.get('level').value,
              brandCode: this.filterForm.get('brand').value,
              subBrandCode: this.filterForm.get('subBrand').value,
              countryCode: this.filterForm.get('country').value,
              stateId: this.filterForm.get('state').value,
              townId: this.filterForm.get('town').value,
              regionCode:  [this.regionCode],
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
  onBrandChange(brandValues: string[]) {
    this.brandChange.emit(brandValues);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.defaultCountry = null;
  }
}
