import {
  SelectionDailogOption,
  SelectionDialogConfig
} from '../selection-dialog.model';
import {
  Component,
  Inject,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  CdkVirtualScrollViewport,
  ScrollDispatcher
} from '@angular/cdk/scrolling';

@Component({
  selector: 'poss-web-selection-dialog',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionDialogComponent implements AfterViewInit, OnDestroy {
  filteredOptions: SelectionDailogOption[] = [];
  optionsInfinity: SelectionDailogOption[] = [];
  destroy$ = new Subject();
  searchForm: FormGroup;
  itemSize = 40; //in Px =>  padding : 5px , margin : 10 px, height : 25px
  minBufferPx = 4 * this.itemSize; // buffer of min 5 items
  maxBufferPx = 6 * this.itemSize; // buffer of max 8 items
  loadNext = new Subject();
  search = new Subject<string>();
  isComplete = false;
  isLoading = false;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewport: CdkVirtualScrollViewport;
  isPopupClosed = true;

  constructor(
    public dialogRef: MatDialogRef<SelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectionDialogConfig,
    private formBuilder: FormBuilder,
    private scrollDispatcher: ScrollDispatcher,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    if (data?.isPopupClosed === false) this.isPopupClosed = data?.isPopupClosed;
    if (!!this.data.isInfinityScroll) {
      if (this.data.optionsObservable) {
        this.data.optionsObservable
          .pipe(takeUntil(this.destroy$))
          .subscribe(options => {
            this.filteredOptions = options;
            this.optionsInfinity = options;
            this.changeDetectorRef.markForCheck();
          });
      }

      if (this.data.searchOptionsObservable) {
        this.data.searchOptionsObservable
          .pipe(takeUntil(this.destroy$))
          .subscribe(options => {
            this.filteredOptions = options;
            this.changeDetectorRef.markForCheck();
          });
      }
    } else {
      this.filteredOptions = data.options;
    }
    this.searchForm = this.formBuilder.group({
      searchValue: []
    });
  }

  ngAfterViewInit(): void {
    this.scrollDispatcher.deregister(this.viewport);

    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.get('searchValue').value;
        if (searchValue !== '') {
          if (!this.data.isInfinityScroll) {
            this.filteredOptions = this.data.options.filter(
              (option: SelectionDailogOption) =>
                option?.id?.toLowerCase().includes(searchValue.toLowerCase()) ||
                option?.description
                  ?.toLowerCase()
                  .includes(searchValue.toLowerCase())
            );
          } else {
            this.filteredOptions = [];
            this.isLoading = true;
            this.search.next(searchValue);
          }
        } else {
          this.clearSearch();
        }
        this.changeDetectorRef.markForCheck();
      });

    if (
      this.searchBox &&
      this.searchBox.nativeElement &&
      this.searchBox.nativeElement.focus
    ) {
      setTimeout(() => {
        this.searchBox.nativeElement.focus();
      });
    }

    if (!!this.data.isInfinityScroll) {
      if (this.data.isComplete) {
        this.data.isComplete
          .pipe(takeUntil(this.destroy$))
          .subscribe(isComplete => (this.isComplete = isComplete));
      }

      if (this.data.isLoading) {
        this.data.isLoading
          .pipe(takeUntil(this.destroy$))
          .subscribe(isLoading => (this.isLoading = isLoading));
      }

      this.viewport.scrolledIndexChange
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          const end = this.viewport.getRenderedRange().end;
          const total = this.viewport.getDataLength();
          if (
            !this.isComplete &&
            !this.isLoading &&
            end === total &&
            !this.searchForm.get('searchValue').value
          ) {
            {
              this.isLoading = true;
              this.loadNext.next();
            }
          }
        });
    }
  }

  clearSearch() {
    this.searchForm.patchValue({
      searchValue: ''
    });
    this.filteredOptions = !!this.data.isInfinityScroll
      ? this.optionsInfinity
      : this.data.options;
  }

  onSelect(option: any) {
    if (this.isPopupClosed) this.dialogRef.close(option);
  }

  close() {
    this.dialogRef.close(null);
  }

  trackBy(_, option: SelectionDailogOption) {
    return option.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
