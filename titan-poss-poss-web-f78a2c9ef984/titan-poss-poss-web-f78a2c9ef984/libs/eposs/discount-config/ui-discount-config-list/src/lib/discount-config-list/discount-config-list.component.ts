import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-ui-discount-config-list',
  templateUrl: './discount-config-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountConfigListComponent {
  @Input() discountConfigList;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() selected = new EventEmitter<string>();
  @Output() publishId = new EventEmitter<string>();
  @Output() emitToggleValue = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();


  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  selectedConfig(event) {
    this.selected.emit(event);
  }
  publish(id: string) {
    this.publishId.emit(id);
  }
  trackBy(_: number, item: any) {
    return item.id;
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
}
