import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TEPExceptionConfig } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-exception-list-items',
  templateUrl: './tep-exception-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepExceptionListItemsComponent implements OnInit {
  @Input() tepExceptionConfigList: TEPExceptionConfig[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() tepExceptionConfigId = new EventEmitter<string>();
  @Output() viewTepExceptionConfigId = new EventEmitter<string>();
  @Output() emitToggleValue = new EventEmitter<{
    isActive: boolean;
    brandCode: string;
  }>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;


  ngOnInit() {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce(
      (set1: number, set2: number) => (set1 < set2 ? set1 : set2)
    );
  }

  emitConfigId(configId: string) {
    this.tepExceptionConfigId.emit(configId);
  }
  viewEmitConfigId(configId: string) {
    this.viewTepExceptionConfigId.emit(configId);
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  trackBy(index: number, item: TEPExceptionConfig) {
    return item.configId;
  }
}
