import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ImageEvent, OtherReceiptsIssuesEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-item-list',
  templateUrl: './item-list.component.html'
})
export class ItemListComponent  {
  @Input() tabType: OtherReceiptsIssuesEnum;
  @Input() itemList: any;
  @Input() type: string;
  @Input() count: number;
  @Input() pageSizeOptions: number[] = [];
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  @Output() paginator = new EventEmitter<PageEvent>();
  getMinPageSize = () =>
    this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }
  trackBy(index: number, item: any) {
    return item.id;
  }
  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }
}
