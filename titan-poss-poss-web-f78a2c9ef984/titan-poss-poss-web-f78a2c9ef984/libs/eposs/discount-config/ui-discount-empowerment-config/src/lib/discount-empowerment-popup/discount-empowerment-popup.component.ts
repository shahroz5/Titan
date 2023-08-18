import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  EmpowerConfigItem,
  EmpowerDetailsPopup
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-empowerment-popup',
  templateUrl: './discount-empowerment-popup.component.html',
  styleUrls: ['./discount-empowerment-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountEmpowermentPopupComponent implements OnInit, OnDestroy {
  empowermentDetailsForm: FormGroup;
  dialogData: EmpowerDetailsPopup;
  empowermentDetailsList: EmpowerConfigItem;

  destroy$ = new Subject<null>();
  translatedMsg: any;
  showInvalidValueError = false;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    public dialogRef: MatDialogRef<DiscountEmpowermentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpowerDetailsPopup
  ) {
    this.dialogData = data;

    this.translationService
      .get([
        'pw.discEmpowermentConfig.maxDiscLabel',
        'pw.discEmpowermentConfig.minProductValueLabel',
        'pw.discEmpowermentConfig.maxProductValueLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.translatedMsg = translatedMsg;
      });
  }

  ngOnInit() {

    this.empowermentDetailsList = this.dialogData.empowermentDetailsList;

    this.initForm();


    if (this.dialogData.mode) {
      this.empowermentDetailsForm.get('minValue').disable();
      this.empowermentDetailsForm.get('maxValue').disable();
      if (!this.dialogData.empowermentDetailsList.isEditable) {
        this.empowermentDetailsForm.get('is_metal_charges').disable();
        this.empowermentDetailsForm.get('is_stone_charges').disable();
        this.empowermentDetailsForm.get('is_making_charges').disable();
        this.empowermentDetailsForm.get('is_ucp_charges').disable();
      }
    }
  }

  initForm() {
    if (this.dialogData.mode) {
      this.empowermentDetailsForm = new FormGroup({
        discountPercent: new FormControl(
          this.empowermentDetailsList.discountPercent,
          [
            this.fieldValidatorsService.requiredField(
              this.translatedMsg['pw.discEmpowermentConfig.maxDiscLabel']
            )
          ]
        ),
        minValue: new FormControl(this.empowermentDetailsList.minValue, [
          this.fieldValidatorsService.requiredField(
            this.translatedMsg['pw.discEmpowermentConfig.minProductValueLabel']
          )
        ]),
        maxValue: new FormControl(this.empowermentDetailsList.maxValue, [
          this.fieldValidatorsService.requiredField(
            this.translatedMsg['pw.discEmpowermentConfig.maxProductValueLabel']
          )
        ]),

        is_metal_charges: new FormControl(
          this.empowermentDetailsList.is_metal_charges
        ),
        is_stone_charges: new FormControl(
          this.empowermentDetailsList.is_stone_charges
        ),
        // is_wastage_charges: new FormControl(
        //   this.empowermentDetailsList.is_wastage_charges
        // ),
        is_making_charges: new FormControl(
          this.empowermentDetailsList.is_making_charges
        ),
        is_ucp_charges: new FormControl(
          this.empowermentDetailsList.is_ucp_charges
        )
      });
    } else {
      this.empowermentDetailsForm = new FormGroup({
        discountPercent: new FormControl(null, [
          this.fieldValidatorsService.requiredField(
            this.translatedMsg['pw.discEmpowermentConfig.maxDiscLabel']
          ),
          this.fieldValidatorsService.discountPercentageField(
            this.translatedMsg['pw.discEmpowermentConfig.maxDiscLabel']
          ),
          this.fieldValidatorsService.min(
            0.001,
            this.translatedMsg['pw.discEmpowermentConfig.maxDiscLabel']
          )
        ]),
        minValue: new FormControl(
          null,
          this.createValueValidator(
            this.translatedMsg['pw.discEmpowermentConfig.minProductValueLabel'],
            this.getMinMaxForValidation(
              'min',
              this.data,
              this.translatedMsg[
                'pw.discEmpowermentConfig.minProductValueLabel'
              ]
            ),
            'min'
          )
        ),
        maxValue: new FormControl(
          null,
          this.createValueValidator(
            this.translatedMsg['pw.discEmpowermentConfig.maxProductValueLabel'],
            this.getMinMaxForValidation(
              'max',
              this.data,
              this.translatedMsg[
                'pw.discEmpowermentConfig.maxProductValueLabel'
              ]
            ),
            'max'
          )
        ),
        is_metal_charges: new FormControl(false),
        is_stone_charges: new FormControl(false),
        // is_wastage_charges: new FormControl(false),
        is_making_charges: new FormControl(false),
        is_ucp_charges: new FormControl(false)
      });
    }
  }

  createValueValidator(label, value, position) {
    if (position === 'min') {
      if (value) {
        return [
          this.fieldValidatorsService.requiredField(label),
          this.fieldValidatorsService.min(value + 1, label),
          this.fieldValidatorsService.amountField(label)
        ];
      } else {
        return [
          this.fieldValidatorsService.requiredField(label),
          this.fieldValidatorsService.amountField(label)
        ];
      }
    } else if (position === 'max') {
      if (value) {
        return [
          this.fieldValidatorsService.requiredField(label),
          this.fieldValidatorsService.max(value - 1, label),
          this.fieldValidatorsService.amountField(label)
        ];
      } else {
        return [
          this.fieldValidatorsService.requiredField(label),
          this.fieldValidatorsService.amountField(label)
        ];
      }
    } else {
      return [
        this.fieldValidatorsService.requiredField(label),
        // this.fieldValidatorsService.min(1, label),
        this.fieldValidatorsService.amountField(label)
      ];
    }
  }

  getMinMaxForValidation(fieldName, data, label) {
    const compareRow = data.compareRow?.length ? data.compareRow[0] : null;
    const totalNoOfRows = data.totalNoOfRows;
    const currentRow = data;
    const addPosition = data.toUpBelow;

    if (totalNoOfRows === 1) {
      if (addPosition === 'above') {
        if (fieldName === 'min') return 0;
        else if (fieldName === 'max') return data.minValue;
        else return null;
      } else if (addPosition === 'below') {
        if (fieldName === 'min') return data.maxValue;
        else if (fieldName === 'max') return null;
        else return null;
      } else return null;
    } else if (totalNoOfRows !== 1 && totalNoOfRows === data.rowId) {
      if (addPosition === 'above') {
        if (fieldName === 'min')
          return compareRow?.maxValue ? compareRow?.maxValue : null;
        else if (fieldName === 'max') return data.minValue;
        else return null;
      } else if (addPosition === 'below') {
        if (fieldName === 'min') return data.maxValue;
        else if (fieldName === 'max') return null;
        else return null;
      } else return null;
    } else {
      if (addPosition === 'above') {
        if (fieldName === 'min')
          return compareRow?.maxValue ? compareRow?.maxValue : null;
        else if (fieldName === 'max') return data.minValue;
        else return null;
      } else if (addPosition === 'below') {
        if (fieldName === 'min') return data.maxValue;
        else if (fieldName === 'max')
          return compareRow?.minValue ? compareRow?.minValue : null;
        else return null;
      } else return null;
    }
  }

  onSubmit() {
    this.showInvalidValueError = false;
    if (this.empowermentDetailsForm.valid && this.isConfigSelected()) {
      const value = this.empowermentDetailsForm.getRawValue();

      const createEmpowermentObject: EmpowerConfigItem = {
        discountPercent: value.discountPercent,
        maxValue: value.maxValue,
        minValue: value.minValue,
        is_making_charges: value.is_making_charges,
        is_metal_charges: value.is_metal_charges,
        is_stone_charges: value.is_stone_charges,
        is_ucp_charges: value.is_ucp_charges,
        rowId: this.empowermentDetailsList?.rowId,
        id: this.empowermentDetailsList?.id
      };

      if (
        // tslint:disable-next-line:radix
        Number.parseInt(value.maxValue) <
        // tslint:disable-next-line:radix
        Number.parseInt(value.minValue)
      ) {
        this.showInvalidValueError = true;
      } else {
        this.dialogRef.close(createEmpowermentObject);
      }
    } else {
      this.empowermentDetailsForm.markAllAsTouched();
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  isConfigSelected(): boolean {
    return (this.empowermentDetailsForm.getRawValue().is_making_charges ||
        this.empowermentDetailsForm.getRawValue().is_metal_charges ||
        this.empowermentDetailsForm.getRawValue().is_stone_charges ||
        this.empowermentDetailsForm.getRawValue().is_ucp_charges)
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
