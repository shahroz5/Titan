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
import { TEPExceptionConfig } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-exception-listing-item',
  templateUrl: './tep-exception-listing-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepExceptionListingItemComponent implements OnInit, OnChanges {
  @Input() listItem: TEPExceptionConfig;
  @Output() emitCode = new EventEmitter<string>();
  @Output() emitCodeView = new EventEmitter<string>();
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
