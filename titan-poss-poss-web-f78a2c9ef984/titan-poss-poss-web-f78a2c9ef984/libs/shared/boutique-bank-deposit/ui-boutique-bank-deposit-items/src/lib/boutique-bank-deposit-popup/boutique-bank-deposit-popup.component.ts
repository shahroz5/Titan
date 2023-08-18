import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-boutique-bank-deposit-popup',
  templateUrl: './boutique-bank-deposit-popup.component.html'
})
export class BoutiqueBankDepositPopupComponent implements OnInit, OnDestroy {
  passwordFormGroup: FormGroup;
  incorrectPassword = false;
  destroy$ = new Subject<null>();
  constructor(
    public dialogRef: MatDialogRef<BoutiqueBankDepositPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.incorrectPassword = data.errorLabel;
  }

  ngOnInit(): void {
    this.passwordFormGroup = new FormGroup({
      password: new FormControl('')
    });
  }
  closePopup() {
    this.dialogRef.close({ type: 'close' });
  }

  clear() {
    this.passwordFormGroup.reset();
  }
  apply() {
    const password = this.passwordFormGroup.get('password').value;
    this.dialogRef.close({ type: 'close', password: password });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
