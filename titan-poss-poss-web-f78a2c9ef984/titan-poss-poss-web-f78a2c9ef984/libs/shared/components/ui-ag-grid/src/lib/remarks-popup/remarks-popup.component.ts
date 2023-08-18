import {
  Component,
  ViewChildren,
  ViewContainerRef,
  QueryList,
  OnDestroy
} from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-remarks-popup',
  templateUrl: './remarks-popup.component.html',
  styleUrls: ['./remarks-popup.component.scss']
})
export class RemarksPopupComponent
  implements ICellEditorAngularComp, OnDestroy {
  params: any;
  remarksControl: FormControl;

  @ViewChildren('input', { read: ViewContainerRef })
  public inputs: QueryList<any>;
  destroy$: Subject<null> = new Subject<null>();
  remarksPlaceHolder: string;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get(['pw.remarksPopup.remarksPlaceHolder'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksPlaceHolder =
          translatedMessages['pw.remarksPopup.remarksPlaceHolder'];
      });
  }

  agInit(params: any): void {
    this.params = params;

    this.remarksControl = new FormControl(params.data.remarks, [
      this.fieldValidatorsService.requiredField(this.remarksPlaceHolder),
      this.fieldValidatorsService.remarkField(this.remarksPlaceHolder)
    ]);
  }



  getValue() {
    return this.remarksControl.value;
  }

  isPopup(): boolean {
    return true;
  }

  closePopup() {
    this.params.api.stopEditing();
  }

  clearRemarks() {
    this.remarksControl.reset();
  }
  applyRemarks() {
    this.params.api.stopEditing();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
