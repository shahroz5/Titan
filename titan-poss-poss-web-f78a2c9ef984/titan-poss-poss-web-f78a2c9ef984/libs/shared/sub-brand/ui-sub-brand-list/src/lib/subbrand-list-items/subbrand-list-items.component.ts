import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BrandMaster } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-subbrand-list-items',
  templateUrl: './subbrand-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubbrandListItemsComponent implements OnInit {
  @Input() SubbrandList: BrandMaster[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() brandCode = new EventEmitter<{
    subBrandCode: string;
    viewOnly: boolean;
  }>();
  @Output() emitToggleValue = new EventEmitter<{
    isActive: boolean;
    brandCode: string;
  }>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;


  ngOnInit() {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  trackBy(index: number, item: BrandMaster) {
    return item.brandCode;
  }

  emitBrandCode(data: { subBrandCode: string; viewOnly: true }) {
    this.brandCode.emit(data);
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
}
