import {
  Component,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-min-eligible-karatage-popup',
  templateUrl: './min-eligible-karatage-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinEligibleKaratagePopupComponent {
  formGroup: FormGroup;
  karatageControl: FormControl;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialogRef: MatDialogRef<MinEligibleKaratagePopupComponent>
  ) {
    this.karatageControl = new FormControl(data ? data : null, [
      this.fieldValidatorsService.requiredField('Karatage'),
      this.fieldValidatorsService.numbersField('Karatage'),
      this.fieldValidatorsService.min(1, 'Karatage')
    ]);
  }


  close() {
    this.dialogRef.close(null);
  }
  apply() {
    this.dialogRef.close(this.karatageControl.value);
  }
}
