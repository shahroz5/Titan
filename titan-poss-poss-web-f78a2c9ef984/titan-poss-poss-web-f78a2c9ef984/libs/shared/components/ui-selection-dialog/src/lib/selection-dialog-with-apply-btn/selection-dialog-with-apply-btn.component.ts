import { SelectionDialogConfig } from '../selection-dialog.model';
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
import { SelectionDailogOption } from '../selection-dialog.model';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  CdkVirtualScrollViewport,
  ScrollDispatcher
} from '@angular/cdk/scrolling';
@Component({
  selector: 'poss-web-selection-dialog-with-apply-btn',
  templateUrl: './selection-dialog-with-apply-btn.component.html',
  styleUrls: ['./selection-dialog-with-apply-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionDialogWithApplyBtnComponent
  implements AfterViewInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<SelectionDialogWithApplyBtnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectionDialogConfig,
    private formBuilder: FormBuilder,
    private scrollDispatcher: ScrollDispatcher,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.filteredOptions = data.options;
    this.searchForm = this.formBuilder.group({
      searchValue: []
    });
  }
  filteredOptions: SelectionDailogOption[] = [];
  destroy$ = new Subject();
  searchForm: FormGroup;
  itemSize = 40; //in Px =>  padding : 5px , margin : 10 px, height : 25px
  minBufferPx = 4 * this.itemSize; // buffer of min 5 items
  maxBufferPx = 6 * this.itemSize; // buffer of max 8 items
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewport: CdkVirtualScrollViewport;
  selectedLocation: any;

  ngAfterViewInit(): void {
    this.scrollDispatcher.deregister(this.viewport);

    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.get('searchValue').value;
        if (searchValue !== '') {
          this.filteredOptions = this.data.options.filter(
            (option: SelectionDailogOption) =>
              option?.id?.toLowerCase().includes(searchValue.toLowerCase()) ||
              option?.description
                ?.toLowerCase()
                .includes(searchValue.toLowerCase())
          );
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
    this.filteredOptions = this.data.options;
  }

  onSelect(option: any) {
    this.selectedLocation = option;
  }

  onApply() {
    this.dialogRef.close(this.selectedLocation);
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
