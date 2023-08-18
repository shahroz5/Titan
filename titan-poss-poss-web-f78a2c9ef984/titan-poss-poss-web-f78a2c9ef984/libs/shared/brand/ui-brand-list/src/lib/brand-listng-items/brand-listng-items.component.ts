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
  selector: 'poss-web-brand-listng-items',
  templateUrl: './brand-listng-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandListngItemsComponent implements OnInit {
  @Input() brandList: BrandMaster[];
  @Input() count: number;

  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() brandCode = new EventEmitter<string>();
  @Output() viewBrandCode = new EventEmitter<string>();
  @Output() emitToggleValue = new EventEmitter<{
    isActive: boolean;
    brandCode: string;
  }>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;


  ngOnInit() {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce(
      (set1: number, set2: number) => (set1 < set2 ? set1 : set2)
    );
  }

  emitBrandCode(brandCode) {
    this.brandCode.emit(brandCode);
  }
  emitViewBrandCode(brandCode) {
    this.viewBrandCode.emit(brandCode);
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  trackBy(index: number, item: BrandMaster) {
    return item.brandCode;
  }
}
