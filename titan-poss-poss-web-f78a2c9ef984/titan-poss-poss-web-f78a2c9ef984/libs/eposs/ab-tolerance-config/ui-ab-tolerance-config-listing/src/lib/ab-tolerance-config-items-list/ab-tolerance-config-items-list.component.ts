import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AbToleranceConfigResponse } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-ab-tolerance-config-items-list',
  templateUrl: './ab-tolerance-config-items-list.component.html'
})
export class AbToleranceConfigItemsListComponent implements OnInit {
  @Input() abToleranceItemList: any[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<AbToleranceConfigResponse>();
  @Output() viewPage = new EventEmitter<string>();

  minPageSize: number;

  ngOnInit(): void {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  trackBy(index: number, item: any) {
    return item.ruleId;
  }
  change(event) {
    this.toggleValue.emit(event);
  }
  edit(event) {
    this.configId.emit(event);
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
}
