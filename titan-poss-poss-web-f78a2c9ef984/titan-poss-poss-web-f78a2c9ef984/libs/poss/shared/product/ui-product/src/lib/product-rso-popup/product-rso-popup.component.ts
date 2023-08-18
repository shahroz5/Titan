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
import { RsoDetailsPayload } from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-product-rso-popup',
  templateUrl: './product-rso-popup.component.html',
  styleUrls: ['./product-rso-popup.component.scss']
})
export class ProductRsoPopupComponent implements OnChanges, OnDestroy {
  //@Input()rsoDetails: RsoDetailsPayload[] = [];
  @Input() clearSelectedRsoName: boolean;
  @Input() selectedRso: { value: string; description: string };
  @Input() isDisable = false;
  @Input() rsoDetailsEvent: Observable<{ code: string; name: string }[]>;
  @Input() employeeCodeRso: string;

  @Output() selectedRSOName: EventEmitter<any> = new EventEmitter<any>();
  //@Output() selectedRso = new EventEmitter<any>();
  rsoNamesControl: FormControl;
  rsoNames: { code: string; name: string }[] = [];
  selectRSONameLabel: string;
  searchByRSOCodeLabel: string;
  destroy$: Subject<null> = new Subject<null>();
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

  ngOnInit() {
    this.rsoDetailsEvent?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.length !== 0) {
        this.rsoNames = data;
      }
    });

    // if (this.clearSelectedRsoName) {
    //   this.rsoNamesControl.setValue('');
    //   this.rsoNamesControl.updateValueAndValidity();
    // }
    // this.rsoNames = this.rsoNamesList;
    this.rsoNamesControl.setValue('');
  }

  ngOnChanges() {
    if (this.clearSelectedRsoName) {
      this.rsoNamesControl.setValue('');
      this.rsoNamesControl.updateValueAndValidity();
    }
    this.rsoNames = this.rsoNames;
    if (this.selectedRso) {
      const selectedValue =
        this.selectedRso && this.selectedRso.value
          ? this.selectedRso.value
          : null;
      this.rsoNamesControl.setValue(selectedValue);
      this.rsoNamesControl.updateValueAndValidity();
    }

    if (this.employeeCodeRso) {
      // console.log(this.employeeCodeRso,'rsoName')
    }
  }

  onRSONameChange(event: any) {
    this.selectedRSOName.emit({ value: event, description: event });
  }

  // select RSO Name from Popup
  openRSOSelectionPopup() {
    this.dialog.closeAll();
    const rsoNamesForSelection = this.rsoNames.map(rso => ({
      id: rso.code,
      description: rso.name + ' - ' + rso.code
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
        if (rso.code === code) return rso.name;
      }
    }
    return code;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
