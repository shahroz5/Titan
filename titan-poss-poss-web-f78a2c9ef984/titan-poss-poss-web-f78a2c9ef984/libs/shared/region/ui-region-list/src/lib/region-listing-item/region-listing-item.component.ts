import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'poss-web-region-listing-item',
  templateUrl: './region-listing-item.component.html',
  styleUrls: ['./region-listing-item.component.scss']
})
export class RegionListingItemComponent implements OnChanges {
  @Input() regionItem;
  @Output() regionCode = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();
  isActive: boolean;


  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.regionItem.isActive;
  }
  onEdit(regionCode: string) {
    this.regionCode.emit(regionCode);
  }

  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      event: event,
      regionItem: this.regionItem
    };
    this.emitToggle.emit(obj);
  }
  openViewPage(regionCode) {
    this.viewPage.emit(regionCode);
  }
}
