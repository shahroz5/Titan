import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import {
  ManualFocRadioTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectDropDownOption,
  ValidateManualFocPayload
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-add-manual-foc-popup',
  templateUrl: './add-manual-foc-popup.component.html',
  styleUrls: ['./add-manual-foc-popup.component.scss']
})
export class AddManualFocPopupComponent implements OnInit, OnDestroy {
  @Output() validateManualFoc = new EventEmitter<ValidateManualFocPayload>();
  resetForm$: Subject<any> = new Subject<any>();
  destroy$: Subject<null> = new Subject<null>();
  mainForm: FormGroup;
  parentForm: FormArray;
  validateForm: FormGroup;
  isDisabled = true;
  isValidated: boolean;
  rsoNamesArray: SelectDropDownOption[] = [];
  manualFocRadioTypeEnumRef = ManualFocRadioTypeEnum;
  translatedMessages = [];
  constructor(
    public dialogRef: MatDialogRef<AddManualFocPopupComponent>,
    public fb: FormBuilder,
    public weightFormatter: WeightFormatterService,
    private fieldValidatorService: FieldValidatorsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      manualFocData: any;
      manualFocValidationDetails$: Observable<any>;
      rsoNames: { code: string; name: string }[];
      selectedRso: string;
      unitWeight: string;
    },
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.manualFoc.locationCodeLabel',
        'pw.manualFoc.cmNumberLabel',
        'pw.manualFoc.fiscalYearLabel',
        'pw.manualFoc.successCmDetail',
        'pw.manualFoc.rsoNameLabel',
        'pw.manualFoc.approvedByLabel',
        'pw.manualFoc.readioButtonSelectionLabel',
        'pw.manualFoc.addManualFocLabel',
        'pw.manualFoc.existingCMLabel',
        'pw.manualFoc.approvedByradioLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.translatedMessages = translatedMsg;
      });
    this.mainForm = this.fb.group({
      parentForm: new FormArray([]),
      rsoName: new FormControl(
        this.data.selectedRso ? this.data.selectedRso : '',
        this.fieldValidatorService.requiredField(
          this.translatedMessages['pw.manualFoc.rsoNameLabel']
        )
      )
    });
  }

  reset() {
    this.resetForm$.next();
    this.mainForm.patchValue({ rsoName: null });
    this.mainForm.markAsUntouched();
  }

  getControls() {
    return (this.mainForm.get('parentForm') as FormArray).controls;
  }

  ngOnInit(): void {
    this.rsoNamesArray = [];
    for (const rso of this.data.rsoNames) {
      this.rsoNamesArray.push({
        value: rso.code,
        description: `${rso.name} - ${rso.code}`
      });
    }

    this.createValidateForm();

    this.data.manualFocValidationDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        if (data) {
          this.isValidated = true;
          this.successNotification();
        } else {
          this.isValidated = false;
        }
      });
  }

  successNotification() {
    const updatedkey = this.translatedMessages['pw.manualFoc.successCmDetail'];
    this.translate
      .get([updatedkey])
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SUCCESS,
          hasBackdrop: true,
          hasClose: true,
          message: translatedMsg[updatedkey]
        });
      });
  }

  closePopup(): void {
    this.dialogRef.close(null);
  }

  validateManualFocItems() {
    if (this.validateForm.valid) {
      const formData = {
        locationCode: this.validateForm.get('locationCode').value,
        CMNumber: this.validateForm.get('cmNumber').value,
        fiscalYear: this.validateForm.get('fiscalYear').value
      };
      this.validateManualFoc.emit(formData);
    }
  }

  addButtonDisable() {
    if (
      this.validateForm.get('radioSelection').value &&
      this.validateForm.get('radioSelection').value ===
        this.translatedMessages['pw.manualFoc.existingCMLabel']
    ) {
      this.isDisabled =
        this.validateForm.invalid ||
        !this.isValidated ||
        this.mainForm.controls.parentForm.invalid ||
        this.mainForm.invalid
          ? true
          : false;
    } else if (
      this.validateForm.get('radioSelection').value &&
      this.validateForm.get('radioSelection').value ===
        this.translatedMessages['pw.manualFoc.approvedByradioLabel']
    ) {
      this.isDisabled =
        this.validateForm.invalid ||
        this.mainForm.controls.parentForm.invalid ||
        this.mainForm.invalid
          ? true
          : false;
    }
    return this.isDisabled;
  }

  radioChange(event) {
    if (
      event.value === this.translatedMessages['pw.manualFoc.existingCMLabel']
    ) {
      this.validateForm
        .get('locationCode')
        .setValidators([
          this.fieldValidatorService.requiredField(
            this.translatedMessages['pw.manualFoc.locationCodeLabel']
          ),
          this.fieldValidatorService.locationCodeField(
            this.translatedMessages['pw.manualFoc.locationCodeLabel']
          )
        ]);
      this.validateForm
        .get('cmNumber')
        .setValidators([
          this.fieldValidatorService.requiredField(
            this.translatedMessages['pw.manualFoc.cmNumberLabel']
          ),
          this.fieldValidatorService.numbersField(
            this.translatedMessages['pw.manualFoc.cmNumberLabel']
          )
        ]);
      this.validateForm.get('approvedBy').setValidators([]);
      this.validateForm.get('approvedBy').setValue('');
    } else {
      this.validateForm
        .get('approvedBy')
        .setValidators([
          this.fieldValidatorService.requiredField(
            this.translatedMessages['pw.manualFoc.approvedByLabel']
          ),
          this.fieldValidatorService.nameWithSpaceField(
            this.translatedMessages['pw.manualFoc.approvedByLabel']
          )
        ]);
      this.validateForm.get('locationCode').setValidators([]);
      this.validateForm.get('cmNumber').setValidators([]);
      this.validateForm.get('locationCode').setValue('');
      this.validateForm.get('cmNumber').setValue('');
      this.validateForm
        .get('fiscalYear')
        .setValue(this.data.manualFocData[0].currentFiscalYear);
    }
    this.validateForm.updateValueAndValidity();
  }

  createValidateForm() {
    this.validateForm = new FormGroup({
      radioSelection: new FormControl('', [
        this.fieldValidatorService.requiredField(
          this.translatedMessages['pw.manualFoc.readioButtonSelectionLabel']
        )
      ]),
      locationCode: new FormControl(
        this.data.manualFocData[0].currentLocationCode
      ),
      cmNumber: new FormControl(),
      fiscalYear: new FormControl(),
      approvedBy: new FormControl()
    });
  }

  addManualFoc() {
    const revisedData = {
      ...this.mainForm,
      approvedBy: this.validateForm.get('approvedBy').value
    };
    this.dialogRef.close({
      type: this.translatedMessages['pw.manualFoc.addManualFocLabel'],
      data: revisedData
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
