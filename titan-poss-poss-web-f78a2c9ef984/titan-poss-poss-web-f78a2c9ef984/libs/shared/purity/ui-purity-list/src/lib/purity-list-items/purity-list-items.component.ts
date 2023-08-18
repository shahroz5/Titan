import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { Purity } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-purity-list-items',
  templateUrl: './purity-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurityListItemsComponent implements OnInit {
  @Input() purityList: Purity[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() materialCodeandPurity = new EventEmitter<{
    materialCode: string;
    purity: string;
  }>();
  @Output() emitToggle = new EventEmitter<{ id: string; data: any }>();
  minPageSize: number;


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  trackBy(index: number, item: Purity) {
    return item.id;
  }

  emitToggleValue(event) {
    this.emitToggle.emit(event);
  }
  emitMaterialCodeandPurity(event) {
    this.materialCodeandPurity.emit(event);
  }
}
