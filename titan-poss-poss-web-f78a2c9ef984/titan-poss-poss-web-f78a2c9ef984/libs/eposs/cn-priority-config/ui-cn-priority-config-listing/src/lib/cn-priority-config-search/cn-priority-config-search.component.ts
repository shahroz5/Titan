import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cn-priority-config-search',
  templateUrl: './cn-priority-config-search.component.html',
  styleUrls: ['./cn-priority-config-search.component.scss']
})
export class CnPriorityConfigSearchComponent
  implements AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();
  @Output() searchEvent = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter<boolean>();


  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  search(searchValue) {
    this.searchEvent.emit(searchValue);
  }

  clearSearch() {
    this.searchForm.reset();
    this.clearEvent.emit(true);


  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
