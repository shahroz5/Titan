import {
  Component,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { TaxClassDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tax-class-listing-item',
  templateUrl: './tax-class-listing-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxClassListingItemComponent implements OnChanges {
  @Input() taxClassListItem: TaxClassDetails;
  @Output() taxClassCode = new EventEmitter<any>();
  @Output() taxClassCodeView = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  isActive: boolean;


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.taxClassListItem.isActive;
  }
  getTaxClassCodeView(taxClassCode: string) {
    this.taxClassCodeView.emit(taxClassCode);
  }
  getTaxClassCode(taxClassCode: string) {
    this.taxClassCode.emit(taxClassCode);
  }

  change(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      taxClassCode: this.taxClassListItem.taxClassCode
    };
    this.emitToggle.emit(obj);
  }
}
