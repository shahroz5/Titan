import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StockIssueTypesEnum } from '@poss-web/shared/models';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-courier-details-popup',
  templateUrl: './courier-details-popup.component.html',
  styleUrls: ['./courier-details-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourierDetailsPopupComponent implements OnInit, OnDestroy {
  stockIssueTypesEnumRef = StockIssueTypesEnum;
  isReadOnly = false;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public fb: FormBuilder,
    private weightFormatter: WeightFormatterService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.totalItemMeasuredWeight = this.data.measuredWeight;
    this.isReadOnly = this.data.type === StockIssueTypesEnum.HISTORY;
  }

  carrierDetails: FormGroup;
  noOfBoxes = 0;
  totalBoxWeight = 0;
  destroy$: Subject<null> = new Subject<null>();
  totalItemMeasuredWeight = 0;
  showMessage = false;
  newBoxLength = 0;

  ngOnInit() {
    this.carrierDetails = this.fb.group({
      box_No: new FormControl('', [
        this.fieldValidatorsService.numbersField('Number of Boxes'),
        this.fieldValidatorsService.requiredField('Number of Boxes'),
        this.fieldValidatorsService.min(0, 'Number Of Boxes'),
        this.fieldValidatorsService.max(10, 'Number Of Boxes')
      ]),
      box_Details: this.fb.array(
        [],
        [this.lockNumberValidator(), this.boxNumberValidator()]
      )
    });
    if (this.data.type !== StockIssueTypesEnum.HISTORY) {
      for (const formValue of this.data.boxDetails) {
        this.boxDetails.push(
          this.fb.group({
            serialNumber: new FormControl(formValue.serialNumber),
            boxNumber: new FormControl(formValue.boxNumber, [
              this.fieldValidatorsService.requiredField('Box No'),
              this.fieldValidatorsService.numbersField('Box No')
            ]),
            lockNumber: new FormControl(formValue.lockNumber, [
              this.fieldValidatorsService.requiredField('Lock Number'),
              this.fieldValidatorsService.maxLength(30, 'Lock Number'),
              this.fieldValidatorsService.lockNumberField('Lock Number')
            ]),
            boxWeight: new FormControl(formValue.boxWeight, [
              this.fieldValidatorsService.requiredField('Box Weight'),
              this.fieldValidatorsService.weightField('Box Weight'),
              this.fieldValidatorsService.min(0.001, 'Box Weight')
            ]),
            weightUnit: new FormControl(formValue.weightUnit)
          })
        );
        this.carrierDetails.markAllAsTouched();
        this.carrierDetails.markAsDirty();
        this.carrierDetails.patchValue({
          box_No: this.data.boxDetails.length
        });
        this.totalBoxWeight += +this.weightFormatter.format(
          formValue.boxWeight
        );
      }
    } else {
      for (const formValue of this.data.boxDetails) {
        this.boxDetails.push(
          this.fb.group({
            serialNumber: new FormControl(formValue.serialNumber),
            boxNumber: new FormControl(formValue.boxNumber),
            lockNumber: new FormControl(formValue.lockNumber),
            boxWeight: new FormControl(formValue.boxWeight),
            weightUnit: new FormControl(formValue.weightUnit)
          })
        );
        this.carrierDetails.markAllAsTouched();
        this.carrierDetails.markAsDirty();
        this.carrierDetails.patchValue({
          box_No: this.data.boxDetails.length
        });
        this.totalBoxWeight += +this.weightFormatter.format(
          formValue.boxWeight
        );
      }
    }

    this.carrierDetails.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.noOfBoxes = data.box_Details.length;
        if (this.carrierDetails.controls.box_Details.value.length > 0) {
          this.getBoxWeights();
        }
      });
  }
  getBoxWeights() {
    this.totalBoxWeight = 0;
    for (
      let i = 0;
      i < this.carrierDetails.controls.box_Details.value.length;
      i++
    ) {
      if (this.carrierDetails.controls.box_Details.value[i].boxWeight > 0) {
        this.totalBoxWeight += +this.weightFormatter.format(
          this.carrierDetails.controls.box_Details.value[i].boxWeight
        );
      }
    }
    this.showMessage = true;
  }

  get boxDetails() {
    return this.carrierDetails.get('box_Details') as FormArray;
  }

  addRow() {
    this.newBoxLength =
      Number(this.carrierDetails.controls.box_No.value) +
      this.boxDetails.length;
    for (
      let i = this.boxDetails.length;
      i < (this.newBoxLength > 10 ? 10 : this.newBoxLength);
      i++
    ) {
      this.boxDetails.push(
        this.fb.group({
          serialNumber: new FormControl(i + 1, [
            this.fieldValidatorsService.requiredField('Serial No')
          ]),
          boxNumber: new FormControl('', [
            this.fieldValidatorsService.requiredField('Box No'),
            this.fieldValidatorsService.numbersField('Box No')
          ]),
          lockNumber: new FormControl(
            '',

            [
              this.fieldValidatorsService.requiredField('Lock Number'),
              this.fieldValidatorsService.maxLength(30, 'Lock Number'),
              this.fieldValidatorsService.lockNumberField('Lock Number')
            ]
          ),
          boxWeight: new FormControl(
            '',
            //  [
            //   Validators.required,
            //   Validators.min(0.001),
            //   Validators.pattern('^[0-9]{1,11}(?:.[0-9]{1,3})?$')
            // ]
            [
              this.fieldValidatorsService.requiredField('Box Weight'),
              this.fieldValidatorsService.weightField('Box Weight'),
              this.fieldValidatorsService.min(0.001, 'Box Weight')
            ]
          ),
          weightUnit: new FormControl('gms', [
            this.fieldValidatorsService.requiredField('Weight Unit')
          ])
        })
      );
    }
    // }
    this.carrierDetails.patchValue({ box_No: this.boxDetails.length });
  }

  deleteRow(index) {
    this.totalBoxWeight -= +this.weightFormatter.format(
      this.carrierDetails.controls.box_Details.value[index].boxWeight
    );

    this.boxDetails.removeAt(index);
    this.carrierDetails.patchValue({ box_No: this.boxDetails.length });
    this.newBoxLength = this.boxDetails.length;
  }
  onClose(): void {
    this.dialogRef.close();
  }
  onSave() {
    this.dialogRef.close({
      count: this.boxDetails.length > 0 ? this.boxDetails.length : 0,
      value: this.carrierDetails.controls.box_Details.value,
      isBoxWeightValid: this.totalBoxWeight > this.totalItemMeasuredWeight,
      totalBoxWeight: this.totalBoxWeight
    });
  }

  lockNumberValidator() {
    const validator: ValidatorFn = (formArray: FormArray) => {
      if (formArray.touched && formArray.dirty) {
        const totalSelected = formArray.controls.map(control => control.value);
        const allLockNumbers = totalSelected.map(value => value.lockNumber);
        const lockNumbers = allLockNumbers.filter(value => value !== '');

        const hasDuplicate = lockNumbers.some(
          (lockNumber, index) =>
            lockNumbers.indexOf(lockNumber, index + 1) !== -1
        );
        return hasDuplicate ? { duplicateLockNumber: true } : null;
      }
    };
    return validator;
  }
  boxNumberValidator() {
    const validator: ValidatorFn = (formArray: FormArray) => {
      if (formArray.touched && formArray.dirty) {
        const totalSelected = formArray.controls.map(control => control.value);
        const allBoxNumbers = totalSelected.map(value => value.boxNumber);
        const boxNumbers = allBoxNumbers.filter(value => value !== '');

        const hasDuplicate = boxNumbers.some(
          (boxNumber, index) => boxNumbers.indexOf(boxNumber, index + 1) !== -1
        );
        return hasDuplicate ? { duplicateBoxNumber: true } : null;
      }
    };
    return validator;
  }
  measuredWeightFormatter(index: any) {
    const newMessuredWeight = this.weightFormatter.format(
      this.carrierDetails.controls.box_Details.value[index].boxWeight
    );
    this.boxDetails.at(index).patchValue({ boxWeight: newMessuredWeight });
  }

  ngOnDestroy() {
    this.boxDetails.clear();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
