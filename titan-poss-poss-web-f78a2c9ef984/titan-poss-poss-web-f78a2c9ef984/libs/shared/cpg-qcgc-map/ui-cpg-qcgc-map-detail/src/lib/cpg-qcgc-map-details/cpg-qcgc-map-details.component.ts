import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import {
  RedemptionType,
  InstrumentType,
  PaymentCode,
  CPGProductGroupConfigForQCGCDetails,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Params } from '@angular/router';

@Component({
  selector: 'poss-web-cpg-qcgc-map-details',
  templateUrl: './cpg-qcgc-map-details.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CpgQcgcMapDetailsComponent
  implements OnInit, OnChanges, OnDestroy {
  maxBinSeriesMapping = 20;
  destroy$ = new Subject();

  groupNameLabel: string;
  descriptionLabel: string;
  cpgBinSeriesMappingLabel: string;
  checked = false;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
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

  initForm(cpgproductGroupConfigDetails: CPGProductGroupConfigForQCGCDetails) {
    let partialRedemptionAllowed = false;
    if (
      cpgproductGroupConfigDetails.redemptionType === RedemptionType.Partial
    ) {
      partialRedemptionAllowed = true;
    }

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
        instrumentNo: new FormControl(
          val?.instrumentNo ? val.instrumentNo : '',
          [
            this.fieldValidatorsService.requiredField(
              this.cpgBinSeriesMappingLabel
            ),
            this.fieldValidatorsService.numbersField(
              this.cpgBinSeriesMappingLabel
            ),
            this.fieldValidatorsService.maxLength(
              9,
              this.cpgBinSeriesMappingLabel
            ),
            this.fieldValidatorsService.minLength(
              9,
              this.cpgBinSeriesMappingLabel
            )
          ]
        ),
        isGhsVoucherEnabled: new FormControl(
          val?.isGhsVoucherEnabled ? val.isGhsVoucherEnabled : false
        )
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
    if (
      this.cpgproductGroupConfigDetails?.description !== '' &&
      !this.cpgproductGroupConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.cpgProductGroupConfigDetailsForm.valid) {
        const values = this.cpgProductGroupConfigDetailsForm.getRawValue();
        this.cpgProductGroupConfigDetailsForm.markAsPristine();
        if (values.cpgBinSeriesMapping.length) {
          const instrumentNumbers: any[] = [];

          values.cpgBinSeriesMapping.forEach(
            (element: {
              instrumentNo: string;
              isGhsVoucherEnabled: boolean;
            }) => {
              instrumentNumbers.push(element);
            }
          );

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
  }
  showMessage(key: string) {
    this.translationService
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }

  openProductGroupMapping() {
    if (
      this.cpgproductGroupConfigDetails?.description !== '' &&
      !this.cpgproductGroupConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.openProductGroupMappingEvent.emit(true);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
