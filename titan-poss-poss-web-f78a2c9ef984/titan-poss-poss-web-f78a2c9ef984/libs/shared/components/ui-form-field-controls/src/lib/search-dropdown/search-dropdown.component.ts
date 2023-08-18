import { ElementRef, Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectDropDownOption } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: []
})
export class SearchDropdownComponent implements OnInit,OnChanges {

  @Input() control = new FormControl();
  @Input() options: SelectDropDownOption[] = [];
  @Input() placeholder: string = '';
  @Input() searchPlaceholder: string = '';
  @Input() required = false;
  @Input() isFullDescription = false;
  @Input() isMultiSelect = false;

  @Output() selectionChangeEvent = new EventEmitter();
  @Output() openedChangeEvent = new EventEmitter();

  @ViewChild('search') searchTextBox: ElementRef;

  // selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedValues = [];

  filteredOptions: Observable<any[]>;

  ngOnInit() {
    /**
     * Set filter event based on value changes
     */
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
  }
  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): SelectDropDownOption[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    if (this.isMultiSelect) {
      this.setSelectedValues();
      this.control.patchValue(this.selectedValues);
    }
    return this.options.filter(option => this.isFullDescription ? ((option.id ? option.id : option.value) + '-' + option.description).toLowerCase().indexOf(filterValue) === 0 : option.description?.toString().toLowerCase().indexOf(filterValue) === 0);
  }

/**
 * Remove from selected values based on uncheck
 */
  selectionChange(event) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedValues.indexOf(event.source.value);
      this.selectedValues.splice(index, 1)
    }
      this.selectionChangeEvent.emit(event);
  }

  openedChange(e) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
    this.openedChangeEvent.emit(e);
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  /**
   * Set selected values to retain the state
   */
  setSelectedValues() {
    console.log('selectFormControl', this.control.value);
    if (this.control.value && this.control.value.length > 0) {
      this.control.value.forEach((e) => {
        if (this.selectedValues.indexOf(e) == -1) {
          this.selectedValues.push(e);
        }
      });
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      // do not propagate spaces to MatSelect, as this would select the currently active option
      event.stopPropagation();
    }

  }
}


