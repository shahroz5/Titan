import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-location-mapping-failure-alert-pop-up',
  templateUrl: './location-mapping-failure-alert-pop-up.component.html',
  styleUrls: ['./location-mapping-failure-alert-pop-up.component.scss']
})
export class LocationMappingFailureAlertPopUpComponent implements OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  constructor(
    public dialogRef: MatDialogRef<LocationMappingFailureAlertPopUpComponent>,
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
