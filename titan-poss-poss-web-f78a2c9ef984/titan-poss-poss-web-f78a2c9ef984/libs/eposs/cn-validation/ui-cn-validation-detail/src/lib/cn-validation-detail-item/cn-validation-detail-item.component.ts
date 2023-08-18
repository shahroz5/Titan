import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {} from '@poss-web/shared/ui-master-form-models';
import {
  AlertPopupServiceAbstraction,
  CnTypeList,
  CnValidation,
  CnValidationResponse,
  ConfigTypeEnum,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { ActivatedRoute } from '@angular/router';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'poss-web-cn-validation-detail-item',
  templateUrl: './cn-validation-detail-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnValidationDetailItemComponent implements OnInit, OnDestroy {
  @Input() cnValidation$: Observable<CnValidationResponse>;
  @Input() cnTypeList$: Observable<CnTypeList[]>;

  @Output() saveCnValidation = new EventEmitter<CnValidation>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  configTypeEnumRef = ConfigTypeEnum;

  destroy$ = new Subject<any>();
  ruleId: string;
  ruleType: string;
  cnValidationForm: FormGroup;
  residualValueAmountLabel: string;
  cnTypes: any;
  cnDetail: CnValidationResponse;
  constructor(
    public activatedRoute: ActivatedRoute,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  locationMapping() {
    if (this.cnDetail?.description && !this.cnDetail.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.openLocationMappingEvent.emit(true);
    }
  }

  initForm(cnValidationDetails: CnValidationResponse) {
    this.translateService
      .get([
        'pw.cnValidation.configNameLabel',
        'pw.cnValidation.creditNoteTypeLabel',
        'pw.cnValidation.deductionRateLabel',
        'pw.cnValidation.criteriaDeductionRateLabel',
        'pw.cnValidation.residualValueLabel',
        'pw.cnValidation.grfResidualAmountLabel',
        'pw.cnValidation.grfResidualForceClosureLabel',
        'pw.cnValidation.ghsUtilisationLabel',
        'pw.cnValidation.ghsAmountTransferLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.residualValueAmountLabel =
          translatedMessages['pw.cnValidation.grfResidualAmountLabel'];
        this.cnValidationForm = new FormGroup({
          configName: new FormControl(
            cnValidationDetails && cnValidationDetails.description
              ? cnValidationDetails.description
              : '',
            [
              this.fieldValidatorsService.requiredField(
                translatedMessages['pw.cnValidation.configNameLabel']
              ),
              this.fieldValidatorsService.nameWithSpaceField(
                translatedMessages['pw.cnValidation.configNameLabel']
              )
            ]
          ),
          creditNoteType: new FormControl(
            cnValidationDetails && cnValidationDetails.ruleType
              ? cnValidationDetails.ruleType
              : '',
            [
              this.fieldValidatorsService.requiredField(
                translatedMessages['pw.cnValidation.creditNoteTypeLabel']
              )
            ]
          ),

          isActive: new FormControl(
            cnValidationDetails && cnValidationDetails.isActive
              ? cnValidationDetails.isActive
              : false
          ),
          isCancellationAllowed: new FormControl(
            cnValidationDetails && cnValidationDetails.isCancellationAllowed
              ? cnValidationDetails.isCancellationAllowed
              : false
          ),
          isOnlyCNCustomerAllowedForMergeGRF: new FormControl(
            cnValidationDetails &&
            cnValidationDetails.isOnlyCNCustomerAllowedForMergeGRF
              ? cnValidationDetails.isOnlyCNCustomerAllowedForMergeGRF
              : null
          ),
          deductionRate: new FormControl(
            cnValidationDetails && cnValidationDetails.deductionRate
              ? cnValidationDetails.deductionRate
              : '',
            [
              this.fieldValidatorsService.percentageField(
                translatedMessages['pw.cnValidation.deductionRateLabel']
              )
            ]
          ),
          criteriaRate: new FormControl(
            cnValidationDetails && cnValidationDetails.criteriaRateForDeduction
              ? cnValidationDetails.criteriaRateForDeduction
              : '',
            [
              this.fieldValidatorsService.percentageField(
                translatedMessages['pw.cnValidation.criteriaDeductionRateLabel']
              )
            ]
          ),
          residualAmount: new FormControl(
            cnValidationDetails && cnValidationDetails.residentialValueAmount
              ? cnValidationDetails.residentialValueAmount
              : '',
            []
          ),
          // brandwiseTransferAllowed: new FormControl(
          //   cnValidationDetails &&
          //   cnValidationDetails.isBrandWiseTransferAllowed
          //     ? cnValidationDetails.isBrandWiseTransferAllowed
          //     : false
          // ),
          //specifically setting value true always
          brandwiseTransferAllowed: new FormControl(true),

          boutiquewiseTransferAllowed: new FormControl(
            cnValidationDetails &&
            cnValidationDetails.isBoutiqueWiseTransferAllowed
              ? cnValidationDetails.isBoutiqueWiseTransferAllowed
              : false
          ),
          mergingGRFAllowed: new FormControl(
            cnValidationDetails && cnValidationDetails.isMergingGRFCNAllowed
              ? cnValidationDetails.isMergingGRFCNAllowed
              : false
          ),
          grfResidualAmount: new FormControl(
            cnValidationDetails && cnValidationDetails.gRFResidualValueAmount
              ? cnValidationDetails.gRFResidualValueAmount
              : '',
            []
          ),
          isPercentage: new FormControl(
            cnValidationDetails && cnValidationDetails.isPercent
              ? cnValidationDetails.isPercent
              : false
          ),
          residualForceClosure: new FormControl(
            cnValidationDetails && cnValidationDetails.gRFResidentialClosure
              ? cnValidationDetails.gRFResidentialClosure
              : ''
          ),
          ghsUtilisation: new FormControl(
            cnValidationDetails &&
            cnValidationDetails.GHSUtilizationTransferPercent
              ? cnValidationDetails.GHSUtilizationTransferPercent
              : '',
            [
              this.fieldValidatorsService.percentageField(
                translatedMessages['pw.cnValidation.ghsUtilisationLabel']
              )
            ]
          ),
          ghsAmount: new FormControl(
            cnValidationDetails && cnValidationDetails.GHSMaxAmountTransfer
              ? cnValidationDetails.GHSMaxAmountTransfer
              : ''
          )
        });
      });

    this.cnValidationForm.get('brandwiseTransferAllowed').disable();
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.ruleId = params['_ruleId'];
        this.ruleType = params['_ruleType'];
      });

    this.cnValidation$.pipe(takeUntil(this.destroy$)).subscribe(cnDetail => {
      this.initForm(cnDetail);
      if (cnDetail) {
        this.cnDetail = cnDetail;
        this.ruleId = cnDetail.ruleId;
        this.ruleType = cnDetail.ruleType;
      }
      if (this.ruleId !== 'new') {
        this.cnValidationForm.get('creditNoteType').disable();
        this.cnValidationForm.get('configName').disable();
      }
    });

    this.cnTypeList$.pipe(takeUntil(this.destroy$)).subscribe(cntypes => {
      if (cntypes) {
        this.cnTypes = cntypes.map(cntype => ({
          value: cntype.id,
          description: cntype.description
        }));
      }
    });

    this.residualValueAmountValidation();
  }

  onCheckboxChange(event) {
    this.residualValueAmountValidation();
  }

  onMergeGRF($event) {
    if (this.cnValidationForm.get('mergingGRFAllowed').value === true) {
      this.cnValidationForm.controls[
        'isOnlyCNCustomerAllowedForMergeGRF'
      ].setValidators([
        this.fieldValidatorsService.requiredField(
          'Resultant Credit Note for GRF to be in the name of'
        )
      ]);
      this.cnValidationForm.controls[
        'isOnlyCNCustomerAllowedForMergeGRF'
      ].updateValueAndValidity();
    } else {
      this.cnValidationForm.controls[
        'isOnlyCNCustomerAllowedForMergeGRF'
      ].setValue(null);
      this.cnValidationForm.controls[
        'isOnlyCNCustomerAllowedForMergeGRF'
      ].setValidators([]);
      this.cnValidationForm.controls[
        'isOnlyCNCustomerAllowedForMergeGRF'
      ].updateValueAndValidity();
    }
  }

  saveDetail() {
    if (this.cnDetail?.description && !this.cnDetail.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.cnValidationForm.valid) {
        const formValues = this.cnValidationForm.getRawValue();
        const saveCnValidation = {
          description: formValues.configName,
          isActive: formValues.isActive,
          ruleType: formValues.creditNoteType,
          ruleDetails: {
            data: {
              isCancellationAllowed: formValues.isCancellationAllowed,
              deductionRate: formValues.deductionRate,
              criteriaRateForDeduction: formValues.criteriaRate,
              residentialValueAmount: formValues.residualAmount,
              isBrandWiseTransferAllowed: formValues.brandwiseTransferAllowed,
              isBoutiqueWiseTransferAllowed:
                formValues.boutiquewiseTransferAllowed,
              gHSUtilizationTransferPercent: formValues.ghsUtilisation,
              gHSMaxAmountTransfer: formValues.ghsAmount,
              isMergingGRFCNAllowed: formValues.mergingGRFAllowed,
              gRFResidualValueAmount: formValues.grfResidualAmount,
              isPercent: formValues.isPercentage,
              gRFResidentialClosure: formValues.residualForceClosure,
              isOnlyCNCustomerAllowedForMergeGRF:
                formValues.isOnlyCNCustomerAllowedForMergeGRF
            },
            type: formValues.creditNoteType
          }
        };
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.alertPopup.saveConfirmation'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.saveCnValidation.emit(saveCnValidation);
            }
          });
      }
    }
  }

  residualValueAmountValidation() {
    if (this.cnValidationForm.get('isPercentage').value === true) {
      this.cnValidationForm.controls['grfResidualAmount'].clearValidators();
      this.cnValidationForm.controls['grfResidualAmount'].setValidators([
        this.fieldValidatorsService.percentageField(
          this.residualValueAmountLabel
        )
      ]);
      this.cnValidationForm.controls[
        'grfResidualAmount'
      ].updateValueAndValidity();
    } else {
      this.cnValidationForm.controls['grfResidualAmount'].clearValidators();
      this.cnValidationForm.controls['grfResidualAmount'].setValidators([
        this.fieldValidatorsService.amountField(this.residualValueAmountLabel)
      ]);
      this.cnValidationForm.controls[
        'grfResidualAmount'
      ].updateValueAndValidity();
    }
  }
  showMessage(key: string) {
    this.translateService
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
