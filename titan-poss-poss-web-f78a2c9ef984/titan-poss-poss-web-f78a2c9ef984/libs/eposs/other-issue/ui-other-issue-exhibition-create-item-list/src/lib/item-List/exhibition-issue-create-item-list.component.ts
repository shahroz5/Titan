import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { OtherIssuesItem } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-exhibition-issue-create-item-list',
  templateUrl: './exhibition-issue-create-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExhibitionIssueCreateItemListComponent
  implements OnInit, OnDestroy {
  @Input() itemList: OtherIssuesItem[];
  @Input() count: number;
  @Input() pageSize = 0;
  @Input() pageEvent: PageEvent;
  @Input() selectionEvents: Observable<any>;
  @Input() SelectedTab: any;
  @Input() dateFormat: string;
  @Input() pageSizeOptions: number[] = [];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    item: any;
  }> = new EventEmitter();
  @Output() quantity = new EventEmitter<any>();

  isReadOnly: boolean;
  selectionAllSubject = new Subject();
  selectionAllObaservable = this.selectionAllSubject.asObservable();
  destroy$ = new Subject<null>();
  selectionAllSubscription: any;
  getMinPageSize = () =>
    this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );



  ngOnInit() {
    this.selectionAllSubscription = this.selectionEvents
      .pipe(
        debounceTime(10),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        this.selectionAllSubject.next(data);
      });
  }
  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }

  selectionEmit(selection: { selected: boolean; item: any }) {
    this.selection.emit(selection);
  }
  quantityChange(event) {
    this.quantity.emit(event);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
