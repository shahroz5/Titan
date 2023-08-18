import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { VendorMaster } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-vendor-master-list-items',
  templateUrl: './vendor-master-list-items.component.html',
  styleUrls: ['./vendor-master-list-items.component.scss']
})
export class VendorMasterListItemsComponent implements OnInit, OnDestroy {
  @Input() vendorMasterList: VendorMaster[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions;

  @Output() id = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();

  minPageSize;
  destroy$ = new Subject<null>();


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  emitId(id) {
    this.id.emit(id);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  trackBy(index: number, item: any) {
    return item.marketCode;
  }
}
