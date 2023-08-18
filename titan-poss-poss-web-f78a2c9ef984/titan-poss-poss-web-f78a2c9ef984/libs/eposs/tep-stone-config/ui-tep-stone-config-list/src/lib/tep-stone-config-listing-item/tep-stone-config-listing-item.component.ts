import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { TEPStoneConfig } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-stone-config-listing-item',
  templateUrl: './tep-stone-config-listing-item.component.html'
})
export class TepStoneConfigListingItemComponent implements OnInit, OnChanges {
  @Input() listItem: TEPStoneConfig;
  @Output() emitCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    configId: string;
  }>();
  @Output() viewPage = new EventEmitter<string>();
  checked: boolean;



  ngOnInit() {
    this.checked = this.listItem.isActive;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.checked = this.listItem.isActive;
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
  openViewPage() {
    this.viewPage.emit(this.listItem.configId);
  }
}
