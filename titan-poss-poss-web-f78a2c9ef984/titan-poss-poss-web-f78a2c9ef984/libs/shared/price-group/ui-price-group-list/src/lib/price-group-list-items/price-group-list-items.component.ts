import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PriceGroupMaster } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-price-group-list-items',
  templateUrl: './price-group-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceGroupListItemsComponent implements OnInit {
  @Input() priceGroupMasterList: PriceGroupMaster[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() priceGroupView = new EventEmitter<string>();
  @Output() priceGroup = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<{
    priceGroup: string;
    data: { isActive: boolean; description: string };
  }>();
  minPageSize: number;


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a > b ? a : b
    );
  }
  trackBy(index: number, item: PriceGroupMaster) {
    return item.priceGroup;
  }
  view(priceGroup) {
    this.priceGroupView.emit(priceGroup);
  }
  edit(priceGroup) {
    this.priceGroup.emit(priceGroup);
  }
  emitToggleValue(obj) {
    this.emitToggle.emit(obj);
  }
}
