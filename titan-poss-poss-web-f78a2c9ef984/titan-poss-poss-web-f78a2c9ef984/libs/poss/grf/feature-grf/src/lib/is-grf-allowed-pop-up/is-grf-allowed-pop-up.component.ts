import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-is-grf-allowed-pop-up',
  templateUrl: './is-grf-allowed-pop-up.component.html',
  styleUrls: ['./is-grf-allowed-pop-up.component.scss']
})
export class IsGrfAllowedPopUpComponent implements OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  constructor(
    public dialogRef: MatDialogRef<IsGrfAllowedPopUpComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  onOkClicked() {
    this.dialogRef.close('ok');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
