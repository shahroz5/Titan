import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
  Input, OnChanges, OnDestroy, OnInit,
  Output, SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GepDetails, GepPurityConfigEnums } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-gep-details',
  templateUrl: './gep-details.component.html'
})
export class GepDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Output() saveGepDetails = new EventEmitter<any>();
  @Input() gepDetails: GepDetails;
  @Input() configId;

  @Input() isParentFormValid: boolean;
  @Output() emitLocationMapping = new EventEmitter<boolean>();
  @Input() isLocationMapping: boolean;
  private destroy$ = new Subject();
  hidden = false;
  gepDetailsFormGroup: FormGroup;
  isReadonly = true;
  value = null;
  currentDate = moment();
  noOfForGEPCNLabel: string;
  noOfDaysForABLabel: string;
  rebillingLabel: string;
  noOfDaysAfterCOLabel: string;
  gepCNUtilization: string;
  karatAcceptedForGepLabel: string;
  grnCNUtilizationLabel: string;
  gepHoldTimeMinLabel: string;
  baseCaratForPurity: string;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.gePurityConfiguration.noOfForGEPCNLabel',
        'pw.gePurityConfiguration.noOfDaysForABLabel',
        'pw.gePurityConfiguration.rebillingLabel',
        'pw.gePurityConfiguration.noOfDaysAfterCOLabel',
        'pw.gePurityConfiguration.gepCNUtilization',
        'pw.gePurityConfiguration.karatAcceptedForGepLabel',
        'pw.gePurityConfiguration.grnCNUtilizationLabel',
        'pw.gePurityConfiguration.gepHoldTimeMinLabel',
        'pw.gePurityConfiguration.baseCaratForPurity'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.noOfForGEPCNLabel =
          translatedMsg['pw.gePurityConfiguration.noOfForGEPCNLabel'];
        this.noOfDaysForABLabel =
          translatedMsg['pw.gePurityConfiguration.noOfDaysForABLabel'];
        this.rebillingLabel =
          translatedMsg['pw.gePurityConfiguration.rebillingLabel'];
        this.noOfDaysAfterCOLabel =
          translatedMsg['pw.gePurityConfiguration.noOfDaysAfterCOLabel'];
        this.gepCNUtilization =
          translatedMsg['pw.gePurityConfiguration.gepCNUtilization'];
        this.karatAcceptedForGepLabel =
          translatedMsg['pw.gePurityConfiguration.karatAcceptedForGepLabel'];
        this.grnCNUtilizationLabel =
          translatedMsg['pw.gePurityConfiguration.grnCNUtilizationLabel'];
        this.gepHoldTimeMinLabel =
          translatedMsg['pw.gePurityConfiguration.gepHoldTimeMinLabel'];
        this.baseCaratForPurity =
          translatedMsg['pw.gePurityConfiguration.baseCaratForPurity'];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gepDetails']) {
      if (this.gepDetails) {
        this.createForm();
      }
    }
  }

  ngOnInit() {
    this.cdr.markForCheck();
    this.createForm();

    this.gepDetailsFormGroup
      .get('rangeFormGroup')
      .get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.gepDetailsFormGroup
          .get('rangeFormGroup')
          .get('endDate');
        const previousDate = moment(this.currentDate).subtract(1, 'days');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate'),
          this.fieldValidatorsService.minDate(previousDate, 'EndDate'),
        ]);
        endDate.markAsTouched();
        endDate.updateValueAndValidity();
      });
  }
  change($event) {
    this.cdr.markForCheck();
    if ($event.checked) {
      this.isReadonly = false;
      this.gepDetailsFormGroup.get('rangeFormGroup').enable();
    } else {
      this.gepDetailsFormGroup.get('rangeFormGroup').disable();
      this.gepDetailsFormGroup.get('noOfDaysForGepCNAfterOffer').reset();
      this.gepDetailsFormGroup.get('noOfDaysForGepCNAfterOfferForAB').reset();
      this.gepDetailsFormGroup.get('noOfDaysForRebillingAfterOffer').reset();
      this.gepDetailsFormGroup.get('noOfDaysForGepAfterOfferForCO').reset();
      this.gepDetailsFormGroup.get('GepCNUtilization').reset();
      this.gepDetailsFormGroup.get('grnCNUtilization').reset();
      this.gepDetailsFormGroup.get('rangeFormGroup').reset();
      this.isReadonly = true;
    }
  }
  createForm() {
    this.gepDetailsFormGroup = new FormGroup({});

    if (this.gepDetails) {
      if (this.gepDetails.configDetails.gepAsPayment) {
        this.value = 'payment';
      } else this.value = 'discount';
    }

    this.gepDetailsFormGroup = new FormGroup({
      gepPayment: new FormControl(this.value ? this.value : ''),
      isGepExchangeOfferAppicable: new FormControl(
        this.gepDetails ? this.gepDetails.isOfferEnabled : false
      ),
      noOfDaysForGepCNAfterOffer: new FormControl(
        this.gepDetails?.offerDetails?.daysForGEPCNAfterOffer
          ? this.gepDetails?.offerDetails?.daysForGEPCNAfterOffer
          : '',
        [this.fieldValidatorsService.daysField(this.noOfForGEPCNLabel)]
      ),
      noOfDaysForGepCNAfterOfferForAB: new FormControl(
        this.gepDetails?.configDetails?.gepDaysAfterABOffer
          ? this.gepDetails?.configDetails?.gepDaysAfterABOffer
          : '',
        [this.fieldValidatorsService.daysField(this.noOfDaysForABLabel)]
      ),
      noOfDaysForRebillingAfterOffer: new FormControl(
        this.gepDetails?.offerDetails?.daysForGRNAndRebillingAfterOffer
          ? this.gepDetails?.offerDetails?.daysForGRNAndRebillingAfterOffer
          : '',
        [this.fieldValidatorsService.daysField(this.rebillingLabel)]
      ),
      noOfDaysForGepAfterOfferForCO: new FormControl(
        this.gepDetails?.configDetails?.gepDaysAfterCOOffer
          ? this.gepDetails?.configDetails?.gepDaysAfterCOOffer
          : '',
        [this.fieldValidatorsService.daysField(this.noOfDaysAfterCOLabel)]
      ),
      GepCNUtilization: new FormControl(
        this.gepDetails?.offerDetails?.gepCNUtilizationPercentage
          ? this.gepDetails?.offerDetails?.gepCNUtilizationPercentage
          : '',
        [this.fieldValidatorsService.percentageField(this.gepCNUtilization)]
      ),
      karatAcceptedForGep: new FormControl(
        this.gepDetails?.configDetails?.minKaratAccepted
          ? this.gepDetails?.configDetails?.minKaratAccepted
          : '',
        [this.fieldValidatorsService.karatField(this.karatAcceptedForGepLabel)]
      ),
      grnCNUtilization: new FormControl(
        this.gepDetails?.offerDetails?.grnCNUtilizationPercentage
          ? this.gepDetails?.offerDetails?.grnCNUtilizationPercentage
          : '',
        [
          this.fieldValidatorsService.percentageField(
            this.grnCNUtilizationLabel
          )
        ]
      ),
      isRivaah: new FormControl(
        this.gepDetails?.offerDetails
          ? this.gepDetails?.offerDetails?.isRivaah
          : false
      ),
      gepHoldTime: new FormControl(
        this.gepDetails?.configDetails?.holdTime
          ? this.gepDetails?.configDetails?.holdTime
          : '',
        [this.fieldValidatorsService.numbersField(this.gepHoldTimeMinLabel)]
      ),
      baseCaratForPurity: new FormControl(
        this.gepDetails?.configDetails?.baseKaratForPurity
          ? this.gepDetails?.configDetails?.baseKaratForPurity
          : '',
        [this.fieldValidatorsService.karatField(this.baseCaratForPurity)]
      ),
      rangeFormGroup: new FormGroup({
        startDate: new FormControl(
          this.gepDetails?.offerDetails?.gepDiscountStartDate
            ? moment(this.gepDetails?.offerDetails?.gepDiscountStartDate)
            : ''
        ),
        endDate: new FormControl(
          this.gepDetails?.offerDetails?.gepDiscountEndDate
            ? moment(this.gepDetails?.offerDetails?.gepDiscountEndDate)
            : ''
        )
      })
    });
    if (this.gepDetailsFormGroup.get('isGepExchangeOfferAppicable').value) {
      this.isReadonly = false;
      this.gepDetailsFormGroup.get('rangeFormGroup').enable();
    } else {
      this.gepDetailsFormGroup.get('rangeFormGroup').disable();
    }
  }
  save() {
    this.saveGepDetails.emit({
      isOfferEnabled: this.gepDetailsFormGroup.get(
        'isGepExchangeOfferAppicable'
      ).value
        ? this.gepDetailsFormGroup.get('isGepExchangeOfferAppicable').value
        : false,
      isRivaah: this.gepDetailsFormGroup.get(
          'isRivaah'
        ).value
          ? this.gepDetailsFormGroup.get('isRivaah').value
          : false,
      configDetails: {
        type: GepPurityConfigEnums.GEP_CONFIG,
        data: {
          gepAsPayment:
            this.gepDetailsFormGroup.get('gepPayment').value === 'payment'
              ? true
              : false,
          gepDaysAfterABOffer: this.gepDetailsFormGroup.get(
            'noOfDaysForGepCNAfterOfferForAB'
          ).value
            ? this.gepDetailsFormGroup.get('noOfDaysForGepCNAfterOfferForAB')
                .value
            : null,
          gepDaysAfterCOOffer: this.gepDetailsFormGroup.get(
            'noOfDaysForGepAfterOfferForCO'
          ).value
            ? this.gepDetailsFormGroup.get('noOfDaysForGepAfterOfferForCO')
                .value
            : null,
          minKaratAccepted: null,
          holdTime: null,
          baseKaratForPurity: this.gepDetailsFormGroup.get('baseCaratForPurity')
            .value
            ? this.gepDetailsFormGroup.get('baseCaratForPurity').value
            : null,
          gepDiscountDeductionAmt:
            this.gepDetailsFormGroup.get('gepPayment').value === 'discount'
              ? true
              : false
        }
      },
      offerDetails: {
        type: GepPurityConfigEnums.GEP_OFFER,
        data: {
          daysForGEPCNAfterOffer: this.gepDetailsFormGroup.get(
            'noOfDaysForGepCNAfterOffer'
          ).value
            ? this.gepDetailsFormGroup.get('noOfDaysForGepCNAfterOffer').value
            : null,
          daysForGRNAndRebillingAfterOffer: this.gepDetailsFormGroup.get(
            'noOfDaysForRebillingAfterOffer'
          ).value
            ? this.gepDetailsFormGroup.get('noOfDaysForRebillingAfterOffer')
                .value
            : null,
          gepCNUtilizationPercentage: this.gepDetailsFormGroup.get(
            'GepCNUtilization'
          ).value
            ? this.gepDetailsFormGroup.get('GepCNUtilization').value
            : null,
          grnCNUtilizationPercentage: this.gepDetailsFormGroup.get(
            'grnCNUtilization'
          ).value
            ? this.gepDetailsFormGroup.get('grnCNUtilization').value
            : null,
          gepDiscountEndDate: moment(
            this.gepDetailsFormGroup.get('rangeFormGroup').get('endDate').value
          )
            .endOf('day')
            .valueOf()
            ? moment(
                this.gepDetailsFormGroup.get('rangeFormGroup').get('endDate')
                  .value
              )
                .endOf('day')
                .valueOf()
            : null,
          gepDiscountStartDate: moment(
            this.gepDetailsFormGroup.get('rangeFormGroup').get('startDate')
              .value
          )
            .startOf('day')
            .valueOf()
            ? moment(
                this.gepDetailsFormGroup.get('rangeFormGroup').get('startDate')
                  .value
              )
                .startOf('day')
                .valueOf()
            : null,
          isRivaah: this.gepDetailsFormGroup.get(
              'isRivaah'
            ).value
              ? this.gepDetailsFormGroup.get('isRivaah').value
              : false,
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  locationMapping() {
    this.emitLocationMapping.emit(true);
  }
}
