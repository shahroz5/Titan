import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CatchmentDetails } from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-catchment-list-items',
  templateUrl: './catchment-list-items.component.html'
})
export class CatchmentListItemsComponent implements  OnDestroy, OnChanges {

  @Input() catchmentList: CatchmentDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;

  @Output() catchmentCode = new EventEmitter<string>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<any>();

  @Input() pageSize: number[];

  destroy$ = new Subject<null>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;



  ngOnChanges(): void {

    this.pageSizeOptions = this.pageSize;

    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  emitCatchmentCode(catchmentCode: string) {
    this.catchmentCode.emit(catchmentCode);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }


}
