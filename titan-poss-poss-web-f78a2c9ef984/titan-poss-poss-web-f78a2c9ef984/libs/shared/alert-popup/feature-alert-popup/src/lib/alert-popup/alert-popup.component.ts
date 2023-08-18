import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AlertPopupServiceConfig,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-alert-popup',
  templateUrl: './alert-popup.component.html'
})
export class AlertPopupComponent implements OnDestroy {
  destroy$ = new Subject();
  AlertPopupTypeEnumRef = AlertPopupTypeEnum;
  isUnipayFailure = false;
  constructor(
    public dialogRef: MatDialogRef<AlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public config: AlertPopupServiceConfig
  ) {
    this.isUnipayFailure = config?.isUnipayFailure
      ? config?.isUnipayFailure
      : false;
  }

  close(response: boolean) {
    this.dialogRef.close(response);
  }

  retry() {
    this.dialogRef.close('retry');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
