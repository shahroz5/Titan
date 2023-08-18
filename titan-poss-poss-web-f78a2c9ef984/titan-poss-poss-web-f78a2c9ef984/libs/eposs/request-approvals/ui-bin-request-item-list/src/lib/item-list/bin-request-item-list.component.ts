import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import {
  BinRequestApprovalsItems,
  BinApprovalspayload
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';



@Component({
  selector: 'poss-web-bin-request-item-list',
  templateUrl: './bin-request-item-list.component.html'
})
export class BinRequestItemListComponent implements OnDestroy {
  @Input() itemList: BinRequestApprovalsItems[];
  @Input() count = 0;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 5,
    length: 0
  };
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() approvalsValue: EventEmitter<
    BinApprovalspayload
  > = new EventEmitter();
  destroy$ = new Subject<null>();
  hasNotification: boolean;

  minPageSize = 0;

  getMinPageSize = () =>
    this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );



  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }

  approvals(approvalsValue: BinApprovalspayload) {
    this.approvalsValue.emit(approvalsValue);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
