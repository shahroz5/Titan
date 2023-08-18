import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { GEPPurityConfig } from '@poss-web/shared/models';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-gep-purity-config-items',
  templateUrl: './gep-purity-config-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GepPurityConfigItemsComponent implements OnInit, AfterViewInit {
  @Input() gepPurityConfigItems: GEPPurityConfig[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() invalidSearch: boolean;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<boolean>();
  @Output() viewPage = new EventEmitter<string>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter();
  minPageSize: number;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.emitSearchValue.emit(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  clearSearch() {
    this.clearEvent.emit();
    this.searchForm.reset();
  }
  edit(event) {
    this.configId.emit(event);
  }
  toggle(event) {
    this.toggleValue.emit(event);
    this.searchForm.reset();
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
  emitPagination($event) {
    this.paginator.emit($event);
  }
}
