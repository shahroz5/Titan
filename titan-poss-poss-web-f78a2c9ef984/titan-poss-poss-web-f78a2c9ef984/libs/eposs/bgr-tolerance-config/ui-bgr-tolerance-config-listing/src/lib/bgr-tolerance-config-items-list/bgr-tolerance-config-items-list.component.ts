import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AbToleranceConfigResponse } from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-bgr-tolerance-config-items-list',
  templateUrl: './bgr-tolerance-config-items-list.component.html',
  styleUrls: []
})
export class BgrToleranceConfigItemsListComponent implements OnInit {
  @Input() bgrToleranceItemList: any[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<AbToleranceConfigResponse>();
  @Output() viewPage = new EventEmitter<string>();
  @Input() permissions$: Observable<any[]>;

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
