import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VendorMaster } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-vendor-master-list-item',
  templateUrl: './vendor-master-list-item.component.html',
  styleUrls: ['./vendor-master-list-item.component.scss']
})
export class VendorMasterListItemComponent implements OnInit {
  @Input() vendorMasterItem: VendorMaster;
  @Output() id = new EventEmitter<any>();


  ngOnInit() {
    console.log(this.vendorMasterItem);
  }

  getId(id: string) {
    this.id.emit(id);
  }
}
