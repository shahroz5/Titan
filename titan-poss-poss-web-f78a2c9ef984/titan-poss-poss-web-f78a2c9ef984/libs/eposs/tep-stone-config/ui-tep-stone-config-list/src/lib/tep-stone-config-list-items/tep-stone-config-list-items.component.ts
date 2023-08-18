import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  TEPStoneConfig
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-stone-config-list-items',
  templateUrl: './tep-stone-config-list-items.component.html'
})
export class TepStoneConfigListItemsComponent {


  @Input() tepStoneConfigList: TEPStoneConfig[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() tepStoneConfigId = new EventEmitter<string>();
  @Output() emitToggleValue = new EventEmitter<{
    isActive: boolean;
    brandCode: string;
  }>();
  @Output() viewPage = new EventEmitter<string>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;



  emitConfigId(configId: string) {
    this.tepStoneConfigId.emit(configId);
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
  trackBy(index: number, item: TEPStoneConfig) {
    return item.configId;
  }
}
