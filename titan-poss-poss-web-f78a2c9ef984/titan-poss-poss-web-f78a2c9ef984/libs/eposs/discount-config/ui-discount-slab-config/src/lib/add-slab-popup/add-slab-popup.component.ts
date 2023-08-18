import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SlabErrorEnum } from '@poss-web/shared/models';
import { CurrencyFormatterService, WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
@Component({
  selector: 'poss-web-add-slab-popup',
  templateUrl: './add-slab-popup.component.html',
  styleUrls: ['./add-slab-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSlabPopupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  showInvalidValueError = false;
  showEqualValueError = false;
  destroy$ = new Subject();
  slabNameLabel;
  weightValidate = 0.001;
  amountValidate = 0.01;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private dialogRef: MatDialogRef<AddSlabPopupComponent>,
    private traslateService: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: any, // public data: { //   min: number; //   max: number; //   minLabel: string; //   maxLabel: string; //   slabName: string; // }
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
  ) {
    this.traslateService
      .get('pw.discountSlabConfig.slabName')
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.slabNameLabel = message;
      });
    console.log('data:', data);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      slabName: new FormControl(this.data.errorType !== SlabErrorEnum.SLAB_NAME ? this.data?.slabName : null, [
        this.fieldValidatorsService.requiredField(this.slabNameLabel),
        this.fieldValidatorsService.slabNameField(this.slabNameLabel)
      ]),
      min: new FormControl(
        this.data.errorType === SlabErrorEnum.SLAB_NAME ? this.data?.min : null,
        this.createValueValidator(
          this.data?.minLabel,
          this.getMinMaxForValidation('min', this.data, this.data?.minLabel),
          'min'
        )
      ),
      max: new FormControl(
        this.data.errorType === SlabErrorEnum.SLAB_NAME ? this.data?.max : null,
        this.createValueValidator(
          this.data?.maxLabel,
          this.getMinMaxForValidation('max', this.data, this.data?.maxLabel),
          'max'
        )
      )
    });
  }

  createValueValidator(label, value, position) {

    if (
      label === 'Min Wt.' ||
      label === 'Max Wt.' ||
      label === 'Min Carat' ||
      label === 'Max Carat'
    ) {
      if (position === 'min') {
        if (value) {
          return [
            this.fieldValidatorsService.requiredField(label),
            this.fieldValidatorsService.min(+this.weightFormatterService.format(value + 0.001), label),
            this.fieldValidatorsService.weightField(label)
          ];
        } else if (value === 0) {
          return [
            this.fieldValidatorsService.requiredField(label),
            this.fieldValidatorsService.min(+this.weightFormatterService.format(0), label),
            this.fieldValidatorsService.weightField(label)
          ];
        } else {
          return [
            this.fieldValidatorsService.requiredField(label),
            this.fieldValidatorsService.weightField(label)
          ];
        }
      } else if (position === 'max') {
        if (value) {
          return [
            this.fieldValidatorsService.requiredField(label),
            this.fieldValidatorsService.max(+this.weightFormatterService.format(value - 0.001), label),
            this.fieldValidatorsService.weightField(label)
          ];
        } else if (value === 0) {
          return [
            this.fieldValidatorsService.requiredField(label),
            this.fieldValidatorsService.max(+this.weightFormatterService.format(0), label),
            this.fieldValidatorsService.weightField(label)
          ];
        } else {
          return [
            this.fieldValidatorsService.requiredField(label),
            this.fieldValidatorsService.weightField(label)
          ];
        }
      } else {
        return [
          this.fieldValidatorsService.requiredField(label),
          this.fieldValidatorsService.weightField(label)
        ];
      }
    } else if (label === 'Min Value' || label === 'Max Value') {
      if (position === 'min') {
        if (value) {
          return [
            this.fieldValidatorsService.requiredField(label),
            this.fieldValidatorsService.min(+this.currencyFormatterService.format(
              value + 0.01,
              null,
              false
            ), label),
            this.fieldValidatorsService.amountField(label)
          ];
        } else if (value === 0) {
          return [
            this.fieldValidatorsService.requiredField(label),
            this.fieldValidatorsService.min(+this.currencyFormatterService.format(
              0,
              null,
              false
            ), label),
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
            this.fieldValidatorsService.max(+this.currencyFormatterService.format(
              value - 0.01,
              null,
              false
            ), label),
            this.fieldValidatorsService.amountField(label)
          ];
        } else if (value === 0) {
          return [
            this.fieldValidatorsService.requiredField(label),
            this.fieldValidatorsService.max(+this.currencyFormatterService.format(
             0,
              null,
              false
            ), label),
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

          this.fieldValidatorsService.amountField(label)
        ];
      }
    } else {
      return [
        this.fieldValidatorsService.requiredField(label),

        this.fieldValidatorsService.numbersField(label)
      ];
    }
  }

  clear() {
    this.form.reset();
  }
  apply() {

    this.showInvalidValueError = false;
    this.showEqualValueError = false;
    if (this.form.valid) {
      const value = this.form.value;
      if (+value.max < +value.min) {
        this.showInvalidValueError = true;
      } else if (+value.max === +value.min) {
        this.showEqualValueError = true;
      } else {
        this.dialogRef.close(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close();
  }



  getMinMaxForValidation(fieldName, data, label) {

    const compareRow = data.compareRow?.length ? data.compareRow[0] : null;
    const totalNoOfRows = data.totalNoOfRows;

    const addPosition = data.data;

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
          return compareRow?.max ? compareRow?.max : null;
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
          return compareRow?.max ? compareRow?.max : null;
        else if (fieldName === 'max') return data.minValue;
        else return null;
      } else if (addPosition === 'below') {
        if (fieldName === 'min') return data.maxValue;
        else if (fieldName === 'max')
          return compareRow?.min ? compareRow?.min : null;
        else return null;
      } else return null;
    }
  }

  getMinMaxForPopulation(fieldName, data, label) {
    const compareRow = data.compareRow?.length ? data.compareRow[0] : null;
    const totalNoOfRows = data.totalNoOfRows;
    // let currentRow = data;
    const addPosition = data.data;
    let validateValue = 1;
    if (
      label === 'Min Wt.' ||
      label === 'Max Wt.' ||
      label === 'Min Carat' ||
      label === 'Max Carat'
    ) {
      validateValue = this.weightValidate;
    } else if (label === 'Min Value' || label === 'Max Value') {
      validateValue = this.amountValidate;
    }

    if (totalNoOfRows === 1) {
      if (addPosition === 'above') {
        if (fieldName === 'min') return 0;
        else if (fieldName === 'max') return data.minValue - validateValue;
        else return null;
      } else if (addPosition === 'below') {
        if (fieldName === 'min') return data.maxValue + validateValue;
        else if (fieldName === 'max') return null;
        else return null;
      } else return null;
    } else if (totalNoOfRows !== 1 && totalNoOfRows === data.rowId) {
      if (addPosition === 'above') {
        if (fieldName === 'min')
          return compareRow?.max ? compareRow?.max + validateValue : null;
        else if (fieldName === 'max') return data.minValue - validateValue;
        else return null;
      } else if (addPosition === 'below') {
        if (fieldName === 'min') return data.maxValue + validateValue;
        else if (fieldName === 'max') return null;
        else return null;
      } else return null;
    } else {
      if (addPosition === 'above') {
        if (fieldName === 'min')
          return compareRow?.max ? compareRow?.max + validateValue : null;
        else if (fieldName === 'max') return data.minValue - validateValue;
        else return null;
      } else if (addPosition === 'below') {
        if (fieldName === 'min') return data.maxValue + validateValue;
        else if (fieldName === 'max')
          return compareRow?.min ? compareRow?.min - validateValue : null;
        else return null;
      } else return null;
    }

    // this.data?.data === 'below' ? this.data?.maxValue + 1 : null,
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
