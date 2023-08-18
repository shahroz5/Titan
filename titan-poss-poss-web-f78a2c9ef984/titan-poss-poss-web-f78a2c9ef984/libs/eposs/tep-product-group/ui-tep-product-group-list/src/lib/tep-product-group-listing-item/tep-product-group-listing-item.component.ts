import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { TEPProductGroupConfigDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-product-group-listing-item',
  templateUrl: './tep-product-group-listing-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepProductGroupListingItemComponent implements OnInit, OnChanges {
  @Input() listItem: TEPProductGroupConfigDetails;
  @Output() emitCodeView = new EventEmitter<string>();
  @Output() emitCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    configId: string;
  }>();
  checked: boolean;



  ngOnInit() {
    this.checked = this.listItem.isActive;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.checked = this.listItem.isActive;
  }

  emitcodeView() {
    this.emitCodeView.emit(this.listItem.configId);
  }
  emitcode() {
    this.emitCode.emit(this.listItem.configId);
  }
  changeEvent(event) {
    this.checked = event.checked;
    const obj = {
      isActive: event.checked,
      configId: this.listItem.configId
    };
    this.emitToggle.emit(obj);
  }
}
