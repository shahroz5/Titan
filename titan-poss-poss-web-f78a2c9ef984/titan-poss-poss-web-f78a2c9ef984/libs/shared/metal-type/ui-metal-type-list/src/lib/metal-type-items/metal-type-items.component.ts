import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MaterialType } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-metal-type-items',
  templateUrl: './metal-type-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetalTypeItemsComponent implements OnInit {
  @Input() metalTypeList: MaterialType[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitMaterialCodeView = new EventEmitter<string>();
  @Output() emitMaterialCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<{
    materialTypeCode: string;
    data: any;
  }>();
  minPageSize: number;



  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  getMaterialCodeView(materialCode) {
    this.emitMaterialCodeView.emit(materialCode);
  }
  getMaterialCode(materialCode) {
    this.emitMaterialCode.emit(materialCode);
  }

  trackBy(index: number, item: MaterialType) {
    return item.materialCode;
  }

  emitToggleValue(obj) {
    this.emitToggle.emit(obj);
  }
}
