import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FileStatusList } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-file-status-list-items',
  templateUrl: './file-status-list-items.component.html'
})
export class FileStatusListItemsComponent implements OnDestroy {
  @Input() fileStatusList: FileStatusList;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() fileId = new EventEmitter<any>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions;
  @Input() minPageSize;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  emitFileId(fileId) {
    this.fileId.emit(fileId);
  }
  trackBy(index: number, item: FileStatusList) {
    return item.fileId;
  }
}
