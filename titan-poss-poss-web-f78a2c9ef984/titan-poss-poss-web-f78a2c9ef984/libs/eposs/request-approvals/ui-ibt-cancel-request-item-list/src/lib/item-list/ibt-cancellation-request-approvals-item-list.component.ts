import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { ImageEvent, RequestApprovalsItems } from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'poss-web-ibt-cancellation-request-approvals-item-list',
  templateUrl: './ibt-cancellation-request-approvals-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IbtCancellationRequestApprovalsItemListComponent
  implements OnInit, OnDestroy {
  @Input() itemList: RequestApprovalsItems[];
  @Input() count;
  @Input() requestId;
  @Input() selectionEvents: Observable<boolean>;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 50,
    length: 0
  };
  @Input() pageSizeOptions: number[] = [];
  @Input() locationCode = null;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() isSelected = new EventEmitter<any>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  destroy$ = new Subject<null>();
  hasNotification: boolean;
  selectionAllSubscription: any;
  selectionAllSubject: Subject<any> = new Subject<any>();
  minPageSize = 0;

  getMinPageSize = () =>
    this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );

  ngOnInit() {
    this.selectionEvents
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(10)
      )
      .subscribe(data => {
        this.selectionAllSubject.next(data);
      });
  }

  isSelect(event: any) {
    this.isSelected.emit(event);
  }

  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }

  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }

  trackBy(index: number, item: RequestApprovalsItems) {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
