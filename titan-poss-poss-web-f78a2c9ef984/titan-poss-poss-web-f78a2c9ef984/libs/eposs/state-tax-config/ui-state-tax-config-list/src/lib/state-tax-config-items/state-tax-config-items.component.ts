import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { StateTaxConfigurationListingData } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-state-tax-config-items',
  templateUrl: './state-tax-config-items.component.html',
  styleUrls: []
})
export class StateTaxConfigItemsComponent implements OnInit {
  @Input() stateTaxConfigurationListing: StateTaxConfigurationListingData[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];

  @Output() stateTaxConfigIdView = new EventEmitter<string>();
  @Output() stateTaxConfigId = new EventEmitter<string>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<any>();

  minPageSize = 0;
  pageSizeOptions: number[] = [];



  ngOnInit() {
    this.pageSizeOptions = this.pageSize;

    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  emitIdView($event) {
    this.stateTaxConfigIdView.emit($event);
  }

  emitId($event) {
    this.stateTaxConfigId.emit($event);
  }

  emitToggle($event) {
    this.emitToggleValue.emit($event);
  }
}
