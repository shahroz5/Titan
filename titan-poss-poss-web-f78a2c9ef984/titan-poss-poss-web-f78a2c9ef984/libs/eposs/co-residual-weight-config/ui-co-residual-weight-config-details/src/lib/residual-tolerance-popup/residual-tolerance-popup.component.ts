import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SelectDropDownOption } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-residual-tolerance-popup',
  templateUrl: './residual-tolerance-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResidualTolerancePopupComponent implements OnInit, OnDestroy {
  ranges: any[];
  formData: FormGroup;
  rangeWeightLabel: string;
  toleranceLabel: string;
  rangesArray: SelectDropDownOption[] = [];
  destroy$ = new Subject<null>();
  constructor(
    public dialogRef: MatDialogRef<ResidualTolerancePopupComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ranges = data.residualWeightRange;
    if (this.ranges && this.ranges.length) {
      for (const range of this.ranges) {
        this.rangesArray.push({
          value: range.id,
          description: range.range
        });
      }
    }
  }

  ngOnInit(): void {
    this.translationService
      .get([
        'pw.weightTolerance.rangeWeightLabel',
        'pw.weightTolerance.toleranceLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.rangeWeightLabel =
          translatedMsg['pw.weightTolerance.rangeWeightLabel'];
        this.toleranceLabel =
          translatedMsg['pw.weightTolerance.toleranceLabel'];
      });
    this.formData = new FormGroup({
      range: new FormControl(
        this.data?.selectedDetails?.rangeId
          ? this.data?.selectedDetails?.rangeId
          : '',
        [this.fieldValidatorsService.requiredField('Range')]
      ),
      toleranceValue: new FormControl(
        this.data?.selectedDetails?.configValue
          ? this.data?.selectedDetails?.configValue
          : '',
        [
          this.fieldValidatorsService.requiredField('Tolerance in Gms'),
          this.fieldValidatorsService.weightField('Tolerance in Gms')
        ]
      ),
      tolerancePercent: new FormControl(
        this.data?.selectedDetails?.configPercent
          ? this.data?.selectedDetails?.configPercent
          : '',
        [
          this.fieldValidatorsService.requiredField('Tolerance in Percent'),
          this.fieldValidatorsService.percentageField('Tolerance in Percent')
        ]
      )
    });

    if (this.data?.selectedDetails?.rangeId) {
      this.formData.get('range').disable();
    }
  }

  save() {
    this.dialogRef.close({
      // type: 'save',
      data: {
        rangeId: this.formData.get('range').value,
        configValue: this.formData.get('toleranceValue').value,
        configPercent: this.formData.get('tolerancePercent').value
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
