import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ItemDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-list-item',
  templateUrl: './list-item.component.html'
})
export class ListItemComponent  {
  @Input() itemDetailsList: ItemDetails;
  @Output() itemCode = new EventEmitter<any>();
  constructor(public router: Router) {}



  getItemCode(itemCode: string) {
    this.itemCode.emit(itemCode);
  }
}
