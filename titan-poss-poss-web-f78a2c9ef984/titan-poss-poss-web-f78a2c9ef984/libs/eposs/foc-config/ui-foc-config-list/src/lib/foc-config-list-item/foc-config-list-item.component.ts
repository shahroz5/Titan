import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { SchemeDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-foc-config-list-item',
  templateUrl: './foc-config-list-item.component.html'
})
export class FocConfigListItemComponent implements OnChanges {
  @Input() focConfigListItem: SchemeDetails;

  @Output() configId = new EventEmitter<string>();
  @Output() configIdView = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<SchemeDetails>();
  @Output() publishId = new EventEmitter<string>();
  isActive: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.focConfigListItem.isActive;
  }

  edit() {
    this.configId.emit(this.focConfigListItem.id);
  }
  view() {
    this.configIdView.emit(this.focConfigListItem.id);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    this.toggleValue.emit({
      id: this.focConfigListItem.id,
      isActive: event.checked
    });
  }
  publish() {
    this.publishId.emit(this.focConfigListItem.id);
  }
}
