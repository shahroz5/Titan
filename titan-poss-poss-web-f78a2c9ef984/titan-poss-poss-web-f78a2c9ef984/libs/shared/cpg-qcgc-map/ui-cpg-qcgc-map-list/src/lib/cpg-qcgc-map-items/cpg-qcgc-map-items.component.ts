import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { CPGProductGroupConfigForQCGCDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cpg-qcgc-map-items',
  templateUrl: './cpg-qcgc-map-items.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CpgQcgcMapItemsComponent implements OnInit {
  @Input() cpgproductGroupConfigListing: CPGProductGroupConfigForQCGCDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];

  @Output() cpgproductGroupConfigIdView = new EventEmitter<string>();
  @Output() cpgproductGroupConfigId = new EventEmitter<string>();
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

  emitIdView($event: string) {
    this.cpgproductGroupConfigIdView.emit($event);
  }

  emitId($event: string) {
    this.cpgproductGroupConfigId.emit($event);
  }

  emitToggle($event: any) {
    this.emitToggleValue.emit($event);
  }
}
