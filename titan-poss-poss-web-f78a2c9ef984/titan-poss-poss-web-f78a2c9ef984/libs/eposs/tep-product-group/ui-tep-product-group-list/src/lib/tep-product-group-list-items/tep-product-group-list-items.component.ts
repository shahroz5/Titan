import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TEPProductGroupConfigDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-product-group-list-items',
  templateUrl: './tep-product-group-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepProductGroupListItemsComponent implements OnInit {
  @Input() tepProductGroupConfigList: TEPProductGroupConfigDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() tepProductGroupConfigIdView = new EventEmitter<string>();
  @Output() tepProductGroupConfigId = new EventEmitter<string>();
  @Output() emitToggleValue = new EventEmitter<{
    isActive: boolean;
    brandCode: string;
  }>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;

  ngOnInit(): void {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce(
      (set1: number, set2: number) => (set1 < set2 ? set1 : set2)
    );
  }

  emitViewConfigId(configId: string) {
    this.tepProductGroupConfigIdView.emit(configId);
  }
  emitConfigId(configId: string) {
    this.tepProductGroupConfigId.emit(configId);
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  trackBy(index: number, item: TEPProductGroupConfigDetails) {
    return item.configId;
  }
}
