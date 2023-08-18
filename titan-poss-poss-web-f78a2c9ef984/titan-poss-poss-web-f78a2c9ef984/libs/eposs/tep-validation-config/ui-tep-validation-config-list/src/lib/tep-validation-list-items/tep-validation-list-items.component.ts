import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TEPValidationConfigResult } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-validation-list-items',
  templateUrl: './tep-validation-list-items.component.html',
  styleUrls: ['./tep-validation-list-items.component.scss']
})
export class TepValidationListItemsComponent implements OnInit {

  @Input() tepValidationConfigList: TEPValidationConfigResult[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() tepValidationViewConfigId = new EventEmitter<string>();
  @Output() tepValidationConfigId = new EventEmitter<string>();
  @Output() emitToggleValue = new EventEmitter<{
    isActive: boolean;
    brandCode: string;
  }>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;

  ngOnInit(): void {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce(
      (set1: number, set2: number) => (set1 < set2 ? set1 : set2)
    );
  }

  emitViewConfigId(configId: string) {
    this.tepValidationViewConfigId.emit(configId);
  }

  emitConfigId(configId: string) {
    this.tepValidationConfigId.emit(configId);
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  trackBy(index: number, item: TEPValidationConfigResult) {
    return item.configId;
  }
}
