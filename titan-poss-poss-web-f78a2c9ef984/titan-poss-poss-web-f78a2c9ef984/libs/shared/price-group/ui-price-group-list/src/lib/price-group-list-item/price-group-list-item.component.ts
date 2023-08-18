import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { PriceGroupMaster } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-price-group-list-item',
  templateUrl: './price-group-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceGroupListItemComponent implements OnChanges {
  @Input() priceGroupItem: PriceGroupMaster;
  @Output() priceGroupView = new EventEmitter<string>();
  @Output() priceGroup = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<{
    priceGroup: string;
    data: { isActive: boolean; description: string };
  }>();

  isActive: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.priceGroupItem.isActive;
  }



  view(priceGroup) {
    this.priceGroupView.emit(priceGroup);
  }
  edit(priceGroup) {
    this.priceGroup.emit(priceGroup);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      priceGroup: this.priceGroupItem.priceGroup,
      data: {
        isActive: event.checked,
        description: this.priceGroupItem.description
      }
    };
    this.emitToggle.emit(obj);
  }
}
