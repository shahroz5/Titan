import { BinRequestApprovalsPopupComponent } from '@poss-web/eposs/request-approvals/ui-bin-request-approvals-popup';

import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  BinRequestApprovalsItems,
  BinApprovals,
  BinApprovalspayload
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-bin-request-item',
  templateUrl: './bin-request-item.component.html',
  styleUrls: ['./bin-request-item.component.scss']
})
export class BinRequestItemComponent {
  @Input() item: BinRequestApprovalsItems;
  @Output() destroy$ = new Subject<null>();
  @Input() count: number;
  binApproval: BinApprovals;
  id: number;

  @Output() approvalsValue: EventEmitter<
    BinApprovalspayload
  > = new EventEmitter();

  constructor(public dialog: MatDialog, private translate: TranslateService) {}

  binRequestApprovalsPopup(status: string): void {
    if (status === 'accept') {
      this.approvalsValue.emit({
        binRequestUpdateDto: {
          remarks: null,
          status: 'APPROVED'
        },
        id: this.item.id
      });
    } else {
      const dialogRef = this.dialog.open(BinRequestApprovalsPopupComponent, {
        width: '520px',
        data: {
          binName: this.item.binName,
          reqDocNo: this.item.reqDocNo,
          status: status
        }
      });

      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result) {
            this.approvalsValue.emit({
              binRequestUpdateDto: result,
              id: this.item.id
            });
          }
        });
    }
  }
}
