import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'poss-web-discount-config-list-item',
  templateUrl: './discount-config-list-item.component.html',
  styleUrls: ['./discount-config-list-item.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountConfigListItemComponent implements OnChanges {
  @Input() discountConfig: any;
  @Output() selected = new EventEmitter<string>();
  @Output() publishId = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<any>();
  isActive: any;
  @Output() viewPage = new EventEmitter<string>();



  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.discountConfig.isActive;
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      description: this.discountConfig.description,
      discountCode: this.discountConfig.discountCode,
      discountType: this.discountConfig.discountType,
      isActive: event.checked,
      occasion: this.discountConfig.occasion,
      id: this.discountConfig.id
    };
    this.emitToggle.emit(obj);
  }
  selectedConfig(configId: string) {
    this.selected.emit(configId);
  }
  publish() {
    this.publishId.emit(this.discountConfig.id);
  }
  openViewPage(id) {
    this.viewPage.emit(id);
  }
}
