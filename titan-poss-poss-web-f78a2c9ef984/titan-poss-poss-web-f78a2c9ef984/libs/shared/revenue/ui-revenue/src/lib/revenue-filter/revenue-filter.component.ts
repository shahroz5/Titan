import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  RevenueRequest,
  RevenueTypesEnum,
  SharedBodEodFeatureServiceAbstraction
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-revenue-filter',
  templateUrl: './revenue-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevenueFilterComponent implements OnInit, OnChanges {
  @Output() loadSelectedDateRange = new EventEmitter<RevenueRequest>();
  @Output() loadSelectedLocation = new EventEmitter<string>();
  @Output() getLocationCode = new EventEmitter();

  @Input() selectedLocation;
  bussinessDay: any;

  @Input() revenueType;
  revenueTypeEnumRef = RevenueTypesEnum;

  rangeFormGroup: FormGroup;
  locationCodeFormGroup: FormGroup;
  currentDate = moment();
  dateRangeRequest: RevenueRequest;
  dateRangeLabel: string;
  locationCodeLabel: string;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bussinessDay = moment(data);
      });
    this.translate
      .get(['pw.revenue.dateRangeLabel', 'pw.revenue.locationCodeLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.rangeFormGroup = new FormGroup({
          fromDate: new FormControl(
            '',
            this.fieldValidatorsService.requiredField(
              translatedMessages['pw.revenue.dateRangeLabel']
            )
          ),
          toDate: new FormControl(
            '',
            this.fieldValidatorsService.requiredField(
              translatedMessages['pw.revenue.dateRangeLabel']
            )
          )
        });

        this.locationCodeFormGroup = new FormGroup({
          locationCode: new FormControl(
            '',

            this.fieldValidatorsService.requiredField(
              translatedMessages['pw.revenue.locationCodeLabel']
            )
          )
        });
      });
  }

  ngOnInit(): void {
    this.rangeFormGroup
      .get('toDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(mode => {
        const fromDate = moment(this.rangeFormGroup.get('fromDate').value);
        const toDate = moment(this.rangeFormGroup.get('toDate').value);
        const differenceDays = toDate.diff(fromDate, 'days');
        if (differenceDays >= 90) {
          this.rangeFormGroup
            .get('fromDate')
            .setErrors({ valid: false, differenceValid: true });
          this.rangeFormGroup
            .get('toDate')
            .setErrors({ valid: false, differenceValid: true });
          this.rangeFormGroup.updateValueAndValidity();
        }
      });

    this.rangeFormGroup
      .get('fromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('date', data);
        const endDate = this.rangeFormGroup.get('toDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }

  getLocationCodeFromDialog() {
    this.getLocationCode.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedLocation']) {
      if (
        this.selectedLocation !== null &&
        this.selectedLocation !== undefined
      ) {
        this.locationCodeFormGroup
          .get('locationCode')
          .setValue(this.selectedLocation.description);
      }
    }
  }

  searchTodaysRevenue() {
    this.loadSelectedLocation.emit(this.selectedLocation.id);
  }

  search() {
    const formData = this.rangeFormGroup.getRawValue();
    this.dateRangeRequest = {
      fromDate: Number(formData.fromDate),
      toDate: Number(formData.toDate)
    };
    this.loadSelectedDateRange.emit(this.dateRangeRequest);
  }
}
