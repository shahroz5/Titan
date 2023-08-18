import { Component,  OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BinRequestResponse } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-bin-request-success-popup',
  templateUrl: './bin-request-success-popup.component.html',
  styleUrls: ['./bin-request-success-popup.component.scss']
})
export class BinRequestSuccessPopupComponent implements  OnDestroy {
  destroy$: Subject<null> = new Subject<null>();


  constructor(
 public dialogRef: MatDialogRef<BinRequestSuccessPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: BinRequestResponse, public dialog: MatDialog) {

  }

  onClose(): void {

    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }



}

