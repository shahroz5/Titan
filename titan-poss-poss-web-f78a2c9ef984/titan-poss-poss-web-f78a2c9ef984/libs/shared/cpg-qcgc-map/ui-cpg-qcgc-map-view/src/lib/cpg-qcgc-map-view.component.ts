import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import {
  RedemptionType,
  InstrumentType,
  PaymentCode,
  CPGProductGroupConfigForQCGCDetails
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Params } from '@angular/router';

@Component({
  selector: 'poss-web-cpg-qcgc-map-view',
  templateUrl: './cpg-qcgc-map-view.component.html'
})
export class CpgQcgcMapViewComponent implements OnInit, OnChanges, OnDestroy {
  maxBinSeriesMapping = 20;
  destroy$ = new Subject();

  groupNameLabel: string;
  descriptionLabel: string;
  cpgBinSeriesMappingLabel: string;
  checked = false;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService
  ) {
    this.translationService
      .get([
        'pw.cpgProductGroupConfig.cpgGroupName',
        'pw.cpgProductGroupConfig.cpgGroupDescription',
        'pw.cpgProductGroupConfig.cpgBinSeriesMapping'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.groupNameLabel =
          translatedMsg['pw.cpgProductGroupConfig.cpgGroupName'];
        this.descriptionLabel =
          translatedMsg['pw.cpgProductGroupConfig.cpgGroupDescription'];
        this.cpgBinSeriesMappingLabel =
          translatedMsg['pw.cpgProductGroupConfig.cpgBinSeriesMapping'];
      });
  }

  @Input() cpgproductGroupConfigDetails: CPGProductGroupConfigForQCGCDetails;
  @Input() routeParam: Observable<Params>;
  @Output() formOutput = new EventEmitter<
    CPGProductGroupConfigForQCGCDetails
  >();
  @Output() openProductGroupMappingEvent = new EventEmitter<boolean>();

  cpgProductGroupConfigDetailsForm: FormGroup;
  disabledProductGroupMapping = true;

  ngOnInit() {
    this.checked = this.cpgproductGroupConfigDetails.isActive;
    this.initForm(this.cpgproductGroupConfigDetails);
  }

  ngOnChanges() {
    if (this.cpgproductGroupConfigDetails.paymentCategoryName !== '') {
      this.disabledProductGroupMapping = false;
      this.disableGroup();
    }
  }

  changeEvent(event) {
    this.checked = event.checked;
    this.cpgProductGroupConfigDetailsForm.markAsDirty();
  }

  disableGroup() {
    if (this.cpgProductGroupConfigDetailsForm) {
      this.cpgProductGroupConfigDetailsForm
        .get('groupName')
        .disable({ onlySelf: true });
    }
  }
  partialRedemptionAllowed: boolean;
  initForm(cpgproductGroupConfigDetails: CPGProductGroupConfigForQCGCDetails) {
    let partialRedemptionAllowed = false;
    if (
      cpgproductGroupConfigDetails.redemptionType === RedemptionType.Partial
    ) {
      partialRedemptionAllowed = true;
    }

    this.partialRedemptionAllowed = partialRedemptionAllowed;

    this.cpgProductGroupConfigDetailsForm = new FormGroup({
      groupName: new FormControl(
        cpgproductGroupConfigDetails.paymentCategoryName,
        [
          this.fieldValidatorsService.requiredField(this.groupNameLabel),
          this.fieldValidatorsService.cpgGroupNameField(this.groupNameLabel),
          this.fieldValidatorsService.maxLength(100, this.groupNameLabel)
        ]
      ),
      groupDescription: new FormControl(
        cpgproductGroupConfigDetails.description,
        [
          this.fieldValidatorsService.requiredField(this.descriptionLabel),
          this.fieldValidatorsService.descriptionField(this.descriptionLabel),
          this.fieldValidatorsService.maxLength(100, this.descriptionLabel)
        ]
      ),
      partialRedemptionAllowed: new FormControl(partialRedemptionAllowed),
      cpgBinSeriesMapping: this.fb.array([])
    });

    cpgproductGroupConfigDetails?.instrumentNumberDetails?.data.forEach(val => {
      this.addNewCPGBinSeriesMapping(val);
    });

    if (!this.disabledProductGroupMapping) {
      this.disableGroup();
    }
  }

  addNewCPGBinSeriesMapping(val: any) {
    this.cpgBinSeriesMapping.push(
      this.fb.group({
        instrumentNo: new FormControl(val.instrumentNo, [
          this.fieldValidatorsService.requiredField(
            this.cpgBinSeriesMappingLabel
          ),
          this.fieldValidatorsService.numbersField(
            this.cpgBinSeriesMappingLabel
          ),
          this.fieldValidatorsService.maxLength(
            9,
            this.cpgBinSeriesMappingLabel
          )
        ]),
        isGhsVoucherEnabled: new FormControl(val.isGhsVoucherEnabled)
      })
    );
  }

  delCPGBinSeriesMapping(index: number): void {
    this.cpgBinSeriesMapping.removeAt(index);
  }

  get cpgBinSeriesMapping() {
    return this.cpgProductGroupConfigDetailsForm.get(
      'cpgBinSeriesMapping'
    ) as FormArray;
  }

  onSubmit() {
    if (this.cpgProductGroupConfigDetailsForm.valid) {
      const values = this.cpgProductGroupConfigDetailsForm.getRawValue();
      this.cpgProductGroupConfigDetailsForm.markAsPristine();
      if (values.cpgBinSeriesMapping.length) {
        const instrumentNumbers: any[] = [];

        values.cpgBinSeriesMapping.forEach((element: { cpgBinSeries: any }) => {
          instrumentNumbers.push(element);
        });

        this.formOutput.emit({
          description: values.groupDescription,
          paymentCategoryName: values.groupName,
          instrumentType: InstrumentType.PhysicalCard,
          isActive: this.checked,
          redemptionType: values.partialRedemptionAllowed
            ? RedemptionType.Partial
            : RedemptionType.Full,
          minimumAmount: 0,
          paymentCode: PaymentCode.Qcgc,
          instrumentNumberDetails: {
            data: instrumentNumbers,
            type: 'INSTRUMENT_NUMBER_DETAILS'
          }
        });
      }
    }
  }

  openProductGroupMapping() {
    this.openProductGroupMappingEvent.emit(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
