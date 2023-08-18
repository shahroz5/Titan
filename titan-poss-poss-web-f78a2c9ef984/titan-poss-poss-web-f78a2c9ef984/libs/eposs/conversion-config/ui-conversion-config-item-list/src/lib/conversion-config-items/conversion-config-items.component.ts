import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { ConversionConfig } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-conversion-config-items',
  templateUrl: './conversion-config-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversionConfigItemsComponent implements OnInit, AfterViewInit {
  @Input() ConversionConfigList: ConversionConfig[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() invalidSearch: boolean;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() configIdView = new EventEmitter<number>();
  @Output() configId = new EventEmitter<number>();
  @Output() toggleValue = new EventEmitter<boolean>();
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
  view(event) {
    this.configIdView.emit(event);
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearEvent.emit();
  }
  edit(event) {
    this.configId.emit(event);
  }
  change(event) {
    this.toggleValue.emit(event);
    this.searchForm.reset();
  }
  trackBy(_: number, item: ConversionConfig) {
    return item.configId;
  }
  emitPagination($event) {
    this.paginator.emit($event);
  }
}
