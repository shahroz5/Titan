import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-rso-names-list',
  templateUrl: './rso-names-list.component.html',
  styleUrls: ['./rso-names-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RsoNamesListComponent implements OnChanges, OnDestroy {
  @Input() clearSelectedRsoName = false;
  @Input() rsoNamesList: { value: string; description: string }[];
  @Input() selectedRso: { value: string; description: string };
  @Output() selectedRSOName: EventEmitter<any> = new EventEmitter<any>();

  rsoNamesControl: FormControl;
  rsoNames: { value: string; description: string }[] = [];
  destroy$: Subject<null> = new Subject<null>();
  selectRSONameLabel: string;
  searchByRSOCodeLabel: string;

  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private selectionDialog: SelectionDialogService
  ) {
    this.rsoNamesControl = new FormControl('');
    this.translate
      .get([
        'pw.productGrid.selectRSONameLabel',
        'pw.productGrid.searchByRSOCodeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectRSONameLabel =
          translatedMessages['pw.productGrid.selectRSONameLabel'];
        this.searchByRSOCodeLabel =
          translatedMessages['pw.productGrid.searchByRSOCodeLabel'];
      });
  }

  ngOnChanges() {
    if (this.clearSelectedRsoName) {
      this.rsoNamesControl.setValue(null);
      this.rsoNamesControl.updateValueAndValidity();
    }
    this.rsoNames = this.rsoNamesList;
    console.log('SELECTED RSO IN ONCHANGES 1 :', this.selectedRso);
    if (this.selectedRso) {
      console.log('SELECTED RSO IN ONCHANGES 2 :', this.selectedRso);
      const selectedValue =
        this.selectedRso && this.selectedRso.value
          ? this.selectedRso.value
          : null;
      this.rsoNamesControl.setValue(selectedValue);
      this.rsoNamesControl.updateValueAndValidity();
    }
  }

  onRSONameChange(event: any) {
    this.selectedRSOName.emit({
      value: event,
      description: event
    });
  }

  // select RSO Name from Popup
  openRSOSelectionPopup() {
    this.dialog.closeAll();
    const rsoNamesForSelection = this.rsoNames.map(rso => ({
      id: rso.value,
      description: rso.description + ' - ' + rso.value
    }));
    this.selectionDialog
      .open({
        title: this.selectRSONameLabel,
        placeholder: this.searchByRSOCodeLabel,
        options: rsoNamesForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.onRSONameChange(selectedOption.id);
          this.rsoNamesControl.patchValue(selectedOption.id);
        }
      });
  }

  // display rso name from rso code
  getRsoNameFromCode(code: string) {
    if (this.rsoNames.length !== 0) {
      for (const rso of this.rsoNames) {
        if (rso.value === code) return rso.description;
      }
    }
    return code;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
