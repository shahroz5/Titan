import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { OtherIssuesItem } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-exhibition-issue-item-list',
  templateUrl: './exhibition-issue-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExhibitionIssueItemListComponent implements OnDestroy {
  @Input() itemList: OtherIssuesItem[];
  @Input() issueType: string;
  @Input() count: number;
  @Input() pageSize = 0;
  @Input() pageEvent: PageEvent;
  @Output() paginator = new EventEmitter<PageEvent>();
  destroy$ = new Subject<null>();
  @Input() dateFormat: string;
  @Input() pageSizeOptions: number[] = [];
  getMinPageSize = () =>
    this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );

  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
