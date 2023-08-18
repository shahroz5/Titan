import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  TEPValidationConfigEnum,
  TEPValidationConfigResult
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-validation-form',
  templateUrl: './tep-validation-form.component.html',
  styles: []
})
export class TepValidationFormComponent implements OnInit, OnDestroy {
  configNameTranslate: string;

  fvtCNCancellationDeductionPercent: string;
  tepCancellationDuration: string;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translationService
      .get([
        'pw.tepValidationConfig.configurationName',
        'pw.tepValidationConfig.FVTCNCancellationDeductionPer',
        'pw.tepValidationConfig.TEPCancellationDuration'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.configNameTranslate =
          translatedMsg['pw.tepValidationConfig.configurationName'];
        this.fvtCNCancellationDeductionPercent =
          translatedMsg['pw.tepValidationConfig.FVTCNCancellationDeductionPer'];
        this.tepCancellationDuration =
          translatedMsg['pw.tepValidationConfig.TEPCancellationDuration'];
      });
  }

  @Input() tepValidationConfigResult: TEPValidationConfigResult;
  @Output() tepValidationConfigDetailsFormOutput = new EventEmitter<
    TEPValidationConfigResult
  >();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  tepValidationConfigDetailsForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  checked = false;

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.checked = this.tepValidationConfigResult?.isActive;
    this.tepValidationConfigDetailsForm = new FormGroup({
      configurationName: new FormControl(
        this.tepValidationConfigResult?.description || '',
        [
          this.fieldValidatorsService.requiredField(this.configNameTranslate),
          this.fieldValidatorsService.descriptionField(
            this.configNameTranslate
          ),
          this.fieldValidatorsService.maxLength(100, this.configNameTranslate)
        ]
      ),
      fvtCNCancellationDeductionPercent: new FormControl(
        this.tepValidationConfigResult?.configDetails?.data
          ?.fvtCNCancellationDeductionPercent || '',
        [
          this.fieldValidatorsService.requiredField(
            this.fvtCNCancellationDeductionPercent
          ),
          this.fieldValidatorsService.percentageField(
            this.fvtCNCancellationDeductionPercent
          )
        ]
      ),
      isFVTCNCancellationAllowed: new FormControl(
        this.tepValidationConfigResult.configDetails.data
          .isFVTCNCancellationAllowed || false
      ),
      isAnnexurePrintingAllowed: new FormControl(
        this.tepValidationConfigResult.configDetails.data
          .isAnnexurePrintingAllowed || false
      ),
      isInterBrandCashRefundAllowed: new FormControl(
        this.tepValidationConfigResult.configDetails.data
          .isInterBrandCashRefundAllowed || false
      ),
      tepCancellationDays: new FormControl(
        this.tepValidationConfigResult.configDetails.data.tepCancellationDays ||
          '',
        [
          this.fieldValidatorsService.requiredField(
            this.tepCancellationDuration
          ),
          this.fieldValidatorsService.daysField(this.tepCancellationDuration)
        ]
      )
      // isValuationAtStoreAllowed: new FormControl(false),
      // isCaratlaneGoldCoin: new FormControl(false),
      // dummyItemCodeForCaratlane: new FormControl(''),
      // isRefundToBeGivenOrNot: new FormControl(false)
    });
  }

  changeEvent(event) {
    this.tepValidationConfigDetailsForm.markAsDirty();
    this.checked = event.checked;
  }

  onSubmit() {
    if (
      this.tepValidationConfigResult?.description !== '' &&
      !this.tepValidationConfigResult?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.tepValidationConfigDetailsForm.valid) {
        this.tepValidationConfigDetailsForm.markAsPristine();
        const formData = this.tepValidationConfigDetailsForm.getRawValue();
        const data: TEPValidationConfigResult = {
          configId: this.tepValidationConfigResult.configId,
          description: formData.configurationName,
          itemCode: formData.variantCode,
          configDetails: {
            data: {
              fvtCNCancellationDeductionPercent:
                formData.fvtCNCancellationDeductionPercent,
              isFVTCNCancellationAllowed: formData.isFVTCNCancellationAllowed,
              isInterBrandCashRefundAllowed:
                formData.isInterBrandCashRefundAllowed,
              isAnnexurePrintingAllowed: formData.isAnnexurePrintingAllowed,
              tepCancellationDays: formData.tepCancellationDays
            },
            type: TEPValidationConfigEnum.TEP_VALIDATION_CONFIG
          },
          configType: TEPValidationConfigEnum.TEP_VALIDATION,
          startDate: formData.fromDate,
          endDate: formData.toDate,
          isActive: this.checked,
          isOfferEnabled: null,
          offerDetails: null
        };

        this.tepValidationConfigDetailsFormOutput.emit(data);
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

  openLocationMapping() {
    if (
      this.tepValidationConfigResult?.description !== '' &&
      !this.tepValidationConfigResult?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.openLocationMappingEvent.emit(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
