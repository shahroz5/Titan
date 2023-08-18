import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CorporateTown } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-corporate-town-listing-item',
  templateUrl: './corporate-town-listing-item.component.html',
  styleUrls: ['./corporate-town-listing-item.component.scss']
})
export class CorporateTownListingItemComponent implements OnChanges {
  @Input() corporateTownItem: CorporateTown;
  @Output() corporateCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<any>();
  @Output() viewPage = new EventEmitter<string>();
  isActive: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.corporateTownItem.isActive;
  }

  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      corporateListItem: this.corporateTownItem
    };
    this.emitToggle.emit(obj);
  }
  openViewPage(townCode) {
    this.viewPage.emit(townCode);
  }

  onEdit(townCode: string) {
    this.corporateCode.emit(townCode);
  }
}
