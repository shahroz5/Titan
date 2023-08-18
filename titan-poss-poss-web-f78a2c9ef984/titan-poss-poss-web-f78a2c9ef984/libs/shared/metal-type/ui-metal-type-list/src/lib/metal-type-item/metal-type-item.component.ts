import {
  Component,

  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MaterialType } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-metal-type-item',
  templateUrl: './metal-type-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetalTypeItemComponent implements OnChanges {
  @Input() metalTypeListItem: MaterialType;
  @Output() emitMaterialCodeView = new EventEmitter<string>();
  @Output() emitMaterialCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<{
    materialTypeCode: string;
    data: any;
  }>();
  isActive: boolean;


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.metalTypeListItem.isActive;
  }

  getMaterialCodeView(materialCode) {
    this.emitMaterialCodeView.emit(materialCode);
  }
  getMaterialCode(materialCode) {
    this.emitMaterialCode.emit(materialCode);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      materialTypeCode: this.metalTypeListItem.materialCode,

      data: {
        isActive: event.checked
      }
    };
    this.emitToggle.emit(obj);
  }
}
