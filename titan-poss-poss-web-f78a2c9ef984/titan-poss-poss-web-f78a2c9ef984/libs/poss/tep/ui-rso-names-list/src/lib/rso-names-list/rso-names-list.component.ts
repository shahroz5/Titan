import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { SelectDropDownOption } from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SelectionDailogOption, SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

@Component({
  selector: 'poss-web-rso-names-list',
  templateUrl: './rso-names-list.component.html',
  styleUrls: ['./rso-names-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RsoNamesListComponent implements OnChanges, OnDestroy {
  @Input() clearSelectedRsoName = false;
  @Input() rsoNamesList: { value: string; description: string }[];
  @Input() selectedRso: SelectDropDownOption;
  @Output() selectedRSOName: EventEmitter<
    SelectDropDownOption
  > = new EventEmitter<SelectDropDownOption>();

  rsoNamesControl: FormControl;
  rsoNames: { value: string; description: string }[] = [];
  destroy$: Subject<null> = new Subject<null>();
  selectRSONameLabel: string;
  searchByRSOCodeLabel: string;

  constructor(
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialog: MatDialog,
    private selectionDialog: SelectionDialogService
  ) {
    this.rsoNamesControl = new FormControl('', [
      this.fieldValidatorsService.requiredField('Rso Name')
    ]);
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

  // ngOnInit() {
  //   if (this.clearSelectedRsoName) {
  //     this.rsoNamesControl.reset();
  //     this.rsoNamesControl.markAsPristine();
  //   }
  //   this.rsoNames = this.rsoNamesList;
  // }

  ngOnChanges() {
    if (this.clearSelectedRsoName) {
      this.rsoNamesControl.reset();
      this.rsoNamesControl.markAsPristine();
    }
    this.rsoNames = this.rsoNamesList;
    if (this.selectedRso) {
      const selectedValue =
        this.selectedRso && this.selectedRso.value
          ? this.selectedRso.value
          : null;
      this.rsoNamesControl.setValue(selectedValue);
      this.rsoNamesControl.updateValueAndValidity();
    }
  }

  onRSONameChange(event: any) {
    console.log('On RSO Name Change :', event);
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
