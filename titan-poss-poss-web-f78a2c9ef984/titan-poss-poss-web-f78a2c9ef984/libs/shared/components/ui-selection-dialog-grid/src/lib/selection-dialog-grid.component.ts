import { SelectionDialoGridConfig } from './selection-dialog-grid.model';
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
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-selection-dialog-grid',
  templateUrl: './selection-dialog-grid.component.html',
  styleUrls: ['./selection-dialog-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionDialogGridComponent implements AfterViewInit, OnDestroy {
  filteredOptions: any[] = [];
  destroy$ = new Subject();
  searchForm: FormGroup;

  // overlayNoRowsTemplate;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  defaultColDef = {
    resizable: true,
    suppressMovable: true
  };
  api: GridApi;

  constructor(
    public dialogRef: MatDialogRef<SelectionDialogGridComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectionDialoGridConfig,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.filteredOptions = data.options;

    this.searchForm = this.formBuilder.group({
      searchValue: []
    });

    // this.translateService
    //   .get('pw.global.noDataFoundMessage')
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(msg => (this.overlayNoRowsTemplate = msg));
  }

  rowClicked(event) {
    this.dialogRef.close(event.data);
  }

  gridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.api = params.api;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.get('searchValue').value;
        if (searchValue !== '') {
          this.filteredOptions = this.data.options.filter((option: any) =>
            option[this.data.searchBy]
              .toLowerCase()
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

  close() {
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
