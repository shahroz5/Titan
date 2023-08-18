import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Observable, Subject } from 'rxjs';
import { CourierMaster } from '@poss-web/shared/models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-courier-details-listing-items',
  templateUrl: './courier-details-listing-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourierDetailsListingItemsComponent
  implements OnDestroy, AfterViewInit {
  @Input() courierDetailsList: CourierMaster[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() courierName = new EventEmitter<any>();
  @Output() isActive = new EventEmitter<{
    isActive: boolean;
    courierName: string;
  }>();
  @Output() viewPage = new EventEmitter<boolean>();
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() permissions$: Observable<any[]>;
  @Input() invalidSearch: boolean;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();
  constructor(private translate: TranslateService) {}

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else this.clearSearch();
      });
  }

  emitCourierName(courierName) {
    this.courierName.emit(courierName);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  emitIsActive($event) {
    this.isActive.emit($event);
    this.searchForm.reset();
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
  search(searchValue: string) {
    this.emitSearchValue.emit(searchValue);
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearEvent.emit();
  }
  trackBy(_: string, courier: CourierMaster) {
    return courier.courierName;
  }
  emitPaginator($event) {
    this.searchForm.reset();
    this.paginator.emit($event);
  }
}
