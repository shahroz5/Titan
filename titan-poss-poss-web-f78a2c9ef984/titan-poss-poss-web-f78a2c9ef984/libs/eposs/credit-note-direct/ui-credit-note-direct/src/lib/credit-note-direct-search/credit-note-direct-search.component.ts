import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-credit-note-direct-search',
  templateUrl: './credit-note-direct-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditNoteDirectSearchComponent implements OnInit, OnChanges {
  @Input() currentFiscalYear;
  @Input() isUpload: boolean;
  @Output() emitSearch = new EventEmitter<FormGroup>();
  @Output() emitCnFile = new EventEmitter<any>();
  @Output() downloadFileFormat = new EventEmitter<any>();

  @ViewChild('fileInput') fileInput;
  CNSearchFormGroup: FormGroup;
  destroy$ = new Subject<null>();
  cnNumber: any;
  location: any;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate
      .get(['pw.creditNoteDirect.cnNumber', 'pw.creditNoteDirect.location'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.cnNumber = translatedMsg['pw.creditNoteDirect.cnNumber'];
        this.location = translatedMsg['pw.creditNoteDirect.location'];
      });
    this.CNSearchFormGroup = new FormGroup({
      cnNumber: new FormControl(null, [
        this.fieldValidatorsService.numbersField(this.cnNumber)
      ]),
      fiscalYear: new FormControl(null),
      location: new FormControl(null, [
        this.fieldValidatorsService.locationCodeField(this.location)
      ])
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isUpload) {
      this.CNSearchFormGroup.reset();
    }
  }

  searchFn() {
    this.emitSearch.emit(this.CNSearchFormGroup);
  }
  uploadCn(event) {
    this.emitCnFile.emit(event);
    this.fileInput.nativeElement.value = '';
  }

  downloadFile() {
    this.downloadFileFormat.emit(true);
  }
}
