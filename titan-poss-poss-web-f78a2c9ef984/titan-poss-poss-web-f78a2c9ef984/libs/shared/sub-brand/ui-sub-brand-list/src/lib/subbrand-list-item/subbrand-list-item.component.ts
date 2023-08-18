import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { BrandMaster } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-subbrand-list-item',
  templateUrl: './subbrand-list-item.component.html',
  styleUrls: ['./subbrand-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubbrandListItemComponent implements OnChanges {
  @Input() listItem: BrandMaster;
  @Output() emitBrandCode = new EventEmitter<{
    subBrandCode: string;
    viewOnly: boolean;
  }>();
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    brandCode: string;
  }>();

  isActive: boolean;


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.listItem.isActive;
  }



  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      brandCode: this.listItem.brandCode,
      description: this.listItem.description,
      parentBrandCode: this.listItem.parentBrandCode
    };
    this.emitToggle.emit(obj);
  }
  getSubBrandCode(brandCode: string) {
    this.emitBrandCode.emit({ subBrandCode: brandCode, viewOnly: false });
  }
  getViewOnlySubBrandCode(brandCode: string) {
    this.emitBrandCode.emit({ subBrandCode: brandCode, viewOnly: true });
  }
}
