import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { StoneDetail, tepApprovalListResponse } from '@poss-web/shared/models';

import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-stone-details-popup',
  templateUrl: './stone-details-popup.component.html'
})
export class StoneDetailsPopupComponent implements OnDestroy {
  destroy$ = new Subject();
  stonesDetailList: StoneDetail[] = [];
  constructor(
    public dialogRef: MatDialogRef<StoneDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { stones: any; workflowData: tepApprovalListResponse },

    private translate: TranslateService
  ) {
    this.stonesDetailList = data.stones;
  }



  close() {
    this.dialogRef.close(null);
  }

  mergeById = (array1, array2) =>
    array1.map(itm => ({
      ...array2.find(item => item.stoneCode === itm.stoneCode && item),
      stoneWeight: Number(itm.totalCarats)
    }));

  getUpdatedStoneDetailsListFromGrid(value: any) {
    this.stonesDetailList = this.mergeById(value, this.stonesDetailList);
  }

  add() {
    this.dialogRef.close({
      ...this.data.workflowData,
      approvedData: {
        type: 'TEP_APPROVAL_WORKFLOW_DETAILS',
        data: { stones: this.stonesDetailList }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
