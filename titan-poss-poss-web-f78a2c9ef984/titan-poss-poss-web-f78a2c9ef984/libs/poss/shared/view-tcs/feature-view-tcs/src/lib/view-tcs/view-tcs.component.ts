import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ViewTcsFacade } from '@poss-web/poss/shared/view-tcs/data-access-view-tcs';
import { OverlayNotificationServiceAbstraction } from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-view-tcs',
  templateUrl: './view-tcs.component.html',
  styleUrls: ['./view-tcs.component.scss']
})
export class ViewTcsComponent implements OnInit {
  isLoading$: Observable<boolean>;
  constructor(
    private dialogRef: MatDialogRef<ViewTcsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private viewTcsFacade: ViewTcsFacade
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.viewTcsFacade.getIsLoading();
  }

  close() {
    this.dialogRef.close({ type: 'close' });
  }
}
