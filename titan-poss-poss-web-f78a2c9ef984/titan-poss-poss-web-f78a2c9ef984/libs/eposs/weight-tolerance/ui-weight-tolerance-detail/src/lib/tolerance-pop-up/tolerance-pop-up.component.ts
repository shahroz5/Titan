import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WeightRange, SelectDropDownOption } from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-tolerance-pop-up',
  templateUrl: './tolerance-pop-up.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TolerancePopUpComponent implements OnInit, OnDestroy {
  range: WeightRange[];
  formData: FormGroup;
  rangeWeightLabel: string;
  toleranceLabel: string;
  destroy$ = new Subject<null>();
  rangeArray: SelectDropDownOption[] = [];
  constructor(
    public dialogRef: MatDialogRef<TolerancePopUpComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.range = data;
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

    for (const range of this.range) {
      this.rangeArray.push({
        value: range.id+'|'+range.rowId,
        description: range.range
      });
    }
    this.formData = new FormGroup({
      range: new FormControl(''),
      tolerance: new FormControl('', [
        this.fieldValidatorsService.toleranceField(this.toleranceLabel)
      ])
    });
  }

  onDropDownChange(event) {
    this.formData.get('range').patchValue(event.value);
  }
  save() {
    this.dialogRef.close({
      type: 'save',
      data: {
        rangeId: this.formData.get('range').value,
        tolerance: this.formData.get('tolerance').value
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
