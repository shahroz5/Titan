import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DiscountExcludeSchemeCode } from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-scheme-mapping-view',
  templateUrl: './scheme-mapping-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemeMappingViewComponent implements OnInit, OnDestroy {
  @Input() excludeSchemeCodes: DiscountExcludeSchemeCode[] = [];
  @Input() excludeSchemeCodesCount: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize = 0;

  @Output() loadSchemeCodes = new EventEmitter<{
    searchSchemeCode: string;
    pageEvent: PageEvent;
  }>();
  destroy$ = new Subject();
  searchSchemeCode: string;
  expanded = true;

  type = null;
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dialog.closeAll();
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }

  paginatorFn(event) {
    this.pageEvent = event;
    this.loadSchemeCodesFn();
  }
  loadSchemeCodesFn() {
    this.loadSchemeCodes.emit({
      searchSchemeCode: this.searchSchemeCode,
      pageEvent: this.pageEvent
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
