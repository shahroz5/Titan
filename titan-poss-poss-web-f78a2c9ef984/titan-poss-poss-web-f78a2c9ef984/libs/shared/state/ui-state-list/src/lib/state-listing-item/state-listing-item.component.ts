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
  selector: 'poss-web-state-listing-item',
  templateUrl: './state-listing-item.component.html',
  styleUrls: ['./state-listing-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateListingItemComponent implements OnChanges {
  @Input() stateItem;
  @Output() stateCode = new EventEmitter<any>();
  @Output() stateCodeView = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<any>();
  isActive: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.stateItem.isActive;
  }

  onView(stateCode: string) {
    this.stateCodeView.emit(stateCode);
  }
  onEdit(stateCode: string) {
    this.stateCode.emit(stateCode);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      stateId: this.stateItem.stateId
    };
    this.emitToggle.emit(obj);
  }
}
