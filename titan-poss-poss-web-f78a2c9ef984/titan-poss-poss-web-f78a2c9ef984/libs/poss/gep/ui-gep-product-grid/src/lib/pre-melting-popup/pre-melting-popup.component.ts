import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Component, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import {
  FormGroup,
  FormControl,
  FormBuilder
} from '@angular/forms';
@Component({
  selector: 'poss-web-pre-melting-popup',
  templateUrl: './pre-melting-popup.component.html',
  styleUrls: []
})
export class PreMeltingPopupComponent implements OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  weightForm = new FormGroup({
    weight: new FormControl(''),
    purity: new FormControl(''),
    karatage: new FormControl('')
  });

  constructor(
    form: FormBuilder,
    public dialogRef: MatDialogRef<PreMeltingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public fieldValidator: FieldValidatorsService
  ) {
    if (data) {
      this.weightForm = form.group({
        weight: [
          data.weight,
          [
            fieldValidator.requiredField('Weight (gms)'),
            fieldValidator.weightField('Weight (gms)')
          ]
        ],
        purity: [
          data.purity,
          [
            fieldValidator.requiredField('Purity (%)'),
            fieldValidator.amountField('Purity (%)')
          ]
        ],
        karatage: [
          data.karatage,
          [
            fieldValidator.requiredField('Karatage(k)'),
            fieldValidator.amountField('Karatage(k)')
          ]
        ]
      });
    } else {
      this.weightForm = form.group({
        weight: [
          '',
          [
            fieldValidator.requiredField('Weight (gms)'),
            fieldValidator.amountField('Weight (gms)')
          ]
        ],
        purity: [
          '',
          [
            fieldValidator.requiredField('Purity (%)'),
            fieldValidator.amountField('Purity (%)')
          ]
        ],
        karatage: [
          '',
          [
            fieldValidator.requiredField('Karatage(k)'),
            fieldValidator.amountField('Karatage(k)')
          ]
        ]
      });
    }
  }
  add(event) {
    const details = {
      weight: this.weightForm.get('weight').value,
      purity: this.weightForm.get('purity').value,
      karatage: this.weightForm.get('karatage').value
    };

    if (this.weightForm.valid === true) {
      this.dialogRef.close(details);
    } else {
      this.weightForm.markAllAsTouched();
    }
  }

  addKaratage() {
    // const value = Math.round((this.weightForm.get('purity').value / 100) * 24);
    const value = Number(
      ((this.weightForm.get('purity').value / 100) * 24).toFixed(2)
    );
    this.weightForm.controls['karatage'].setValue(value);
  }
  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
