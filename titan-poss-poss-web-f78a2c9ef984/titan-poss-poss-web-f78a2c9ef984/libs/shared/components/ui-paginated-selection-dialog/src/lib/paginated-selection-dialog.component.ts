import { PaginatedSelectionDialogConfig } from './paginated-selection-dialog.model';
import {
  Component,
  Inject,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaginatedSelectionDialogOption } from './paginated-selection-dialog.model';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'poss-web-selection-dialog-pagination',
  templateUrl: './paginated-selection-dialog.component.html',
  styleUrls: ['./paginated-selection-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatedSelectionDialogComponent
  implements AfterViewInit, OnDestroy {
  options: PaginatedSelectionDialogOption[] = [];
  destroy$ = new Subject();
  searchForm: FormGroup;
  load = new Subject<{
    pageIndex: number;
    searchValue?: string;
  }>();

  pageIndex = 0;
  lastPageIndex = 0;
  searchValue: string;

  isLoading = false;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<PaginatedSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaginatedSelectionDialogConfig,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    if (this.data.options) {
      this.data.options.pipe(takeUntil(this.destroy$)).subscribe(options => {
        this.options = options;
        this.changeDetectorRef.markForCheck();
      });
    }

    if (this.data.total) {
      this.data.total.pipe(takeUntil(this.destroy$)).subscribe(total => {
        const lastPage = Math.floor(total / data.pageSize);
        if (lastPage > 0) {
          this.lastPageIndex = lastPage - 1;
        }
        this.changeDetectorRef.markForCheck();
      });
    }

    if (this.data.isLoading) {
      this.data.isLoading
        .pipe(takeUntil(this.destroy$))
        .subscribe(isLoading => {
          this.isLoading = isLoading;
          this.changeDetectorRef.markForCheck();
        });
    }

    this.searchForm = this.formBuilder.group({
      searchValue: []
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const searchValue = this.searchForm.get('searchValue').value;
        if (searchValue !== '') {
          this.options = [];
          this.isLoading = true;
          this.searchValue = searchValue;
          this.loadData(true);
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
  }

  clearSearch() {
    this.searchForm.patchValue({
      searchValue: ''
    });
    this.isLoading = true;
    this.searchValue = null;
    this.loadData(true);
  }
  loadData(isFirst: boolean, isNext?: boolean) {
    this.pageIndex = isFirst
      ? 0
      : isNext
      ? this.pageIndex + 1
      : this.pageIndex - 1;
    this.options = [];

    this.isLoading = true;
    this.load.next({
      pageIndex: this.pageIndex,
      searchValue: this.searchValue
    });
  }

  onSelect(option: any) {
    this.dialogRef.close(option);
  }

  close() {
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
