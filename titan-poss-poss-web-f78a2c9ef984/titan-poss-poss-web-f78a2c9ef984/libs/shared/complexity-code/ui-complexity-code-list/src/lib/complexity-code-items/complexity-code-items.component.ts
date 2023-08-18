import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { ComplexityCode } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-complexity-code-items',
  templateUrl: './complexity-code-items.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexityCodeItemsComponent implements OnInit {
  @Input() complexityCodeList: ComplexityCode[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() complexityCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    complexityCode: string;
    description: string;
  }>();
  @Output() viewPage = new EventEmitter<string>();
  minPageSize: number;


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a > b ? a : b
    );
  }
  trackBy(index: number, item: ComplexityCode) {
    return item.complexityCode;
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
  edit(complexityCode) {
    this.complexityCode.emit(complexityCode);
  }
  emitToggleValue(obj) {
    this.emitToggle.emit(obj);
  }
}
