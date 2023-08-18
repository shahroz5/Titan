import { ACLDetails, ACLUpdateRequest } from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

interface SelectableACL {
  code: string;
  name: string;
  isSelected: boolean;
  isHidden: boolean;
}
@Component({
  selector: 'poss-web-access-control-mgmt-list',
  templateUrl: './access-control-mgmt-list.component.html',
  styleUrls: ['./access-control-mgmt-list.component.scss']
})
export class AccessControlMgmtListComponent
  implements OnChanges, AfterViewInit, OnDestroy {
  @Input() acl: ACLDetails[] = [];
  @Input() edit = true;
  @Output() updateACL = new EventEmitter<ACLUpdateRequest>();

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  selectedACLCodes: string[] = [];
  aclData: SelectableACL[] = [];
  isSelectAll = false;
  showEmptyResult = false;
  destroy$ = new Subject();
  searchFormControl = new FormControl();
  searchValue: string = null;
  noDataFoundMessage;
  constructor(private translate: TranslateService) {
    this.translate
      .get(['pw.entity.transactionCodesEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.transactionCodesEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(takeUntil(this.destroy$), debounceTime(1000))
      .subscribe((event: any) => {
        const searchValue = this.searchFormControl.value;
        if (searchValue !== '') {
          this.searchValue = searchValue;
          this.searchACL(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['acl'] && changes['acl'].currentValue) {
      this.aclData = this.acl.map(ele => ({
        code: ele.aclCode,
        name: ele.description,
        isSelected: ele.isAssigned,
        isHidden: false
      }));
      this.selectionChange(true);
      this.selectedACLCodes = this.acl
        .filter(ele => ele.isAssigned)
        .map(ele => ele.aclCode);
    }
  }

  searchACL(searchValue: string) {
    this.aclData = this.aclData.map(acl => ({
      ...acl,
      isHidden: searchValue
        ? !(
            acl.code.toLowerCase().includes(searchValue.toLowerCase()) ||
            acl.name.toLowerCase().includes(searchValue.toLowerCase())
          )
        : false
    }));
    this.showEmptyResult =
      this.aclData.filter(acl => !acl.isHidden).length === 0;
    this.selectionChange(true);
  }

  clearSearch() {
    this.searchValue = null;
    this.searchFormControl.reset();
    this.searchACL(null);
    this.selectionChange(true);
  }

  selectAll(isChecked: boolean) {
    this.aclData = this.aclData.map(acl => ({
      ...acl,
      isSelected: !acl.isHidden ? isChecked : acl.isSelected
    }));
  }

  selectionChange(isChecked: boolean) {
    if (isChecked === false) {
      this.isSelectAll = false;
    } else {
      const data = this.aclData.filter(acl => !acl.isHidden);
      this.isSelectAll =
        data.length === data.filter(acl => acl.isSelected).length;
    }
  }

  update() {
    const updatedSelectedACLCodes = this.aclData
      .filter(ele => ele.isSelected)
      .map(ele => ele.code);

    this.updateACL.emit({
      addedAclCodes: this.getArrayDifference(
        updatedSelectedACLCodes,
        this.selectedACLCodes
      ),
      removedAclCodes: this.getArrayDifference(
        this.selectedACLCodes,
        updatedSelectedACLCodes
      )
    });
  }

  getArrayDifference(array1: string[], array2: string[]): string[] {
    return array1.filter(ele => !array2.includes(ele));
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
