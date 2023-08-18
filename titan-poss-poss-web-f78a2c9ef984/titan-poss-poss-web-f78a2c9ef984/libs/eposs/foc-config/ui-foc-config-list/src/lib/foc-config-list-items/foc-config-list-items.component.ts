import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SchemeDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-foc-config-list-items',
  templateUrl: './foc-config-list-items.component.html'
})
export class FocConfigListItemsComponent implements OnInit {
  @Input() focConfigurationList: SchemeDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  minPageSize: number;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() configId = new EventEmitter<string>();
  @Output() configIdView = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<SchemeDetails>();
  @Output() publishId = new EventEmitter<string>();

  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  view(event) {
    this.configIdView.emit(event);
  }
  edit(event) {
    this.configId.emit(event);
  }
  change(event) {
    this.toggleValue.emit(event);
  }

  publish(id: string) {
    this.publishId.emit(id);
  }
  trackBy(_: number, item: SchemeDetails) {
    return item.id;
  }
}
