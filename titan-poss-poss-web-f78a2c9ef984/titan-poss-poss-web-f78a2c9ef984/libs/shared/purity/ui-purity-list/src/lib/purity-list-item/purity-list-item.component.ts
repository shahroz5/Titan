import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Purity } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-purity-list-item',
  templateUrl: './purity-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurityListItemComponent  {
  @Input() purityListItem: Purity;
  @Output() materialCodeandPurity = new EventEmitter<{
    materialCode: string;
    purity: string;
  }>();
  @Output() emitToggle = new EventEmitter<{ id: string; data: any }>();

  emitMaterialCodeandPurity() {
    const obj = {
      materialCode: this.purityListItem.materialCode,
      purity: this.purityListItem.purity
    };
    this.materialCodeandPurity.emit(obj);
  }
  changeEvent(event) {
    const obj = {
      id: this.purityListItem.id,
      data: {
        isActive: event.checked,
        description: this.purityListItem.description,
        karat: this.purityListItem.karat,
        itemTypeCode: this.purityListItem.materialCode,
        offset: this.purityListItem.offset,
        purity: this.purityListItem.purity,
        isDisplayed: this.purityListItem.isDisplayed
      }
    };

    this.emitToggle.emit(obj);
  }
}
