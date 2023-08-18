import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { TEPValidationConfigResult } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-validation-listing-item',
  templateUrl: './tep-validation-listing-item.component.html',
  styleUrls: ['./tep-validation-listing-item.component.scss']
})
export class TepValidationListingItemComponent implements OnInit, OnChanges {


  @Input() listItem: TEPValidationConfigResult;
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
