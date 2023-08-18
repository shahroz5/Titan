import {
  Component,
  Output,
  Input,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { StoneTypeDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-stone-type-listing-item',
  templateUrl: './stone-type-listing-item.component.html'
})
export class StoneTypeListingItemComponent implements OnChanges {
  @Input() stoneTypeDetailsList: StoneTypeDetails;
  @Output() stoneTypeCode = new EventEmitter<any>();
  @Output() stoneTypeCodeView = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  isToggleChanged: boolean;
  isActive: any;
  constructor(public dialog: MatDialog) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.stoneTypeDetailsList.isActive;
  }


  getStoneTypeCodeView(stoneTypeCode: string) {
    this.stoneTypeCodeView.emit(stoneTypeCode);
  }

  getStoneTypeCode(stoneTypeCode: string) {
    this.stoneTypeCode.emit(stoneTypeCode);
  }

  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      stoneTypeListItem: this.stoneTypeDetailsList
    };

    this.emitToggle.emit(obj);
  }
}
