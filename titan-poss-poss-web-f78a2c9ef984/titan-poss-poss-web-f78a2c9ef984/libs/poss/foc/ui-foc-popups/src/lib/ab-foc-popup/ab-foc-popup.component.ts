import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Inject,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ABFocConfigData,
  ABFocSchemeDetailsDto
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-ab-foc-popup',
  templateUrl: './ab-foc-popup.component.html',
  styleUrls: ['./ab-foc-popup.component.scss']
})
export class AbFocPopupComponent implements OnInit, OnDestroy {
  isViewMode: boolean;
  viewModeLabel: string;
  hasChange = false;
  @ViewChild('virtualScrollNewList')
  virtualScrollNewList: CdkVirtualScrollViewport;

  @ViewChild('virtualScrollSelectedData')
  virtualScrollSelectedData: CdkVirtualScrollViewport;

  @Output() productTypeChange = new EventEmitter<string>();
  selectAllOfAddNewTab = false;
  selectAllOfSelectedTab = false;

  destroy$ = new Subject();

  itemSize = 44; //in Px
  minBufferPx = 8 * this.itemSize;
  maxBufferPx = 10 * this.itemSize;

  allAbFoc = [];
  selectedAbFocs = [];
  prevSelectedAbFoc = [];

  onAdd = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: ABFocConfigData,
    private dialogRef: MatDialogRef<AbFocPopupComponent>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.prevSelectedAbFoc = this.config.selectedAbFoc;
    this.allAbFoc = this.config.allAbFoc;
    this.selectedAbFocs = this.config.selectedAbFoc;
    console.log('allAbFoc', this.allAbFoc, this.selectedAbFocs);
    this.isViewMode = this.config.isViewMode ? this.config.isViewMode : false;
    if(!this.isViewMode)
    this.setAbFocs(this.config.allAbFoc);
  }

  selectAll(type: string, isSelected: boolean) {
    if (type === 'new') {
      this.allAbFoc = this.allAbFoc.map(AbFoc => ({
        ...AbFoc,
        isSelected: isSelected
      }));
    } else if (type === 'selected') {
      this.selectedAbFocs = this.selectedAbFocs.map(AbFoc => ({
        ...AbFoc,
        isSelected: isSelected
      }));
    }
  }

  selectionChange(
    AbFoc: ABFocSchemeDetailsDto,
    isSelected: boolean,
    type: string
  ) {
    if (AbFoc.isSelected !== isSelected) {
      AbFoc.isSelected = isSelected;
    }
    if (type === 'new') {
      this.selectAllOfAddNewTab =
        this.allAbFoc.length ===
        this.allAbFoc.filter(AbFocData => AbFocData.isSelected).length;
    } else if (type === 'selected') {
      this.selectAllOfSelectedTab =
        this.selectedAbFocs.length ===
        this.selectedAbFocs.filter(AbFocData => AbFocData.isSelected).length;
    }
  }

  updateSelectedAbFoc(type: string) {
    this.hasChange = true;
    if (type === 'new') {
      if (this.allAbFoc.filter(data => data.isSelected).length) {
        const selectedAbFocsId = this.selectedAbFocs.map(
          AbFoc => AbFoc.schemeId
        );
        this.selectedAbFocs = this.selectedAbFocs
          .concat(
            this.allAbFoc.filter(
              data =>
                data.isSelected && !selectedAbFocsId.includes(data.schemeId)
            )
          )
          .map(AbFoc => ({
            ...AbFoc,
            isSelected: false
          }))
          .sort((AbFoc1, AbFoc2) => (AbFoc1.weight > AbFoc2.weight ? 1 : -1));
        this.allAbFoc = this.allAbFoc
          .filter(AbFoc => !AbFoc.isSelected)
          .map(data => ({
            ...data,
            isSelected: false
          }));

        this.selectAllOfSelectedTab = false;
        this.selectAllOfAddNewTab = false;
      }
    } else if (type === 'selected') {
      this.selectAllOfSelectedTab = false;

      this.allAbFoc = this.allAbFoc
        .concat(this.selectedAbFocs.filter(data => data.isSelected))
        .map(data => ({
          ...data,
          isSelected: false
        }))
        .sort((AbFoc1, AbFoc2) => (AbFoc1.weight > AbFoc2.weight ? 1 : -1));
      this.selectedAbFocs = this.selectedAbFocs.filter(
        data => !data.isSelected
      );
    }
  }

  createResponse() {
    const updatedSelectedAbFocs = this.selectedAbFocs;

    return {
      selectedAbFocs: updatedSelectedAbFocs,
      addedAbFocs: this.getFilteredArray(
        updatedSelectedAbFocs,
        this.prevSelectedAbFoc
      ),
      removeAbFocs: this.getFilteredArray(
        this.prevSelectedAbFoc,
        updatedSelectedAbFocs
      )
    };
  }

  applyAbFocs() {
    
    this.onAdd.emit(this.createResponse());
    this.close();
  }

  getFilteredArray(
    array1: ABFocSchemeDetailsDto[],
    array2: ABFocSchemeDetailsDto[]
  ) {
    const array2Ids: string[] = array2.map(data => data.schemeId);
    return array1.filter(ele => !array2Ids.includes(ele.schemeId));
  }

  close() {
    this.dialogRef.close({ type: 'close' });
  }

  scrollToTop(type: string) {
    if (type === 'new' && this.virtualScrollNewList) {
      this.virtualScrollNewList.scrollToIndex(0);
    }
    if (type === 'selected' && this.virtualScrollSelectedData) {
      this.virtualScrollSelectedData.scrollToIndex(0);
    }
  }

  trackByAbFoc(_, AbFoc) {
    return AbFoc.schemeName;
  }

  setAbFocs(data: ABFocSchemeDetailsDto[]) {
    this.selectAllOfAddNewTab = false;
    this.allAbFoc = [];
    this.getSelectedAbFocWithDescription(data, this.selectedAbFocs);
    this.allAbFoc = this.getFilteredArray(data, this.selectedAbFocs)
      .map(AbFoc => ({
        ...AbFoc,
        isSelected: false
      }))
      .sort((AbFoc1, AbFoc2) => (AbFoc1.weight > AbFoc2.weight ? 1 : -1));
    this.cdr.markForCheck();
  }

  getSelectedAbFocWithDescription(
    array1: ABFocSchemeDetailsDto[],
    array2: ABFocSchemeDetailsDto[]
  ) {
    const array2Ids: string[] = array2.map(data => data.schemeId);
    this.selectedAbFocs = array1
      .filter(ele => array2Ids.includes(ele.schemeId))
      .map(data => ({
        ...data,
        isSelected: false
      }))
      .sort((AbFoc1, AbFoc2) => (AbFoc1.weight > AbFoc2.weight ? 1 : -1));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
