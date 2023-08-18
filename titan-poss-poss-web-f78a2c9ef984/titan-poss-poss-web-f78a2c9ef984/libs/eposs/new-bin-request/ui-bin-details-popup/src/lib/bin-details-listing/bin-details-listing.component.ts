import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BinHistroyResponse } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-bin-details-listing',
  templateUrl: './bin-details-listing.component.html',
  styleUrls: ['./bin-details-listing.component.scss']
})
export class BinDetailsListingComponent implements OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  status:any;
  statusColor:string;
  constructor( public dialogRef: MatDialogRef<BinDetailsListingComponent>,
    @Inject(MAT_DIALOG_DATA) public data:BinHistroyResponse , public dialog: MatDialog,
    private translate: TranslateService) {
      this.getStatus(data.status)
     }



   getStatus(status: string) {
      let key;
      if (commonTranslateKeyMap.has(status)) {
        key = commonTranslateKeyMap.get(status);
      }
      this.translate
        .get([key.status, key.statusColor])
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessages: string) => {
          this.status = translatedMessages[key.status];
          this.statusColor = translatedMessages[key.statusColor];
        });
      return this.statusColor;
    }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
