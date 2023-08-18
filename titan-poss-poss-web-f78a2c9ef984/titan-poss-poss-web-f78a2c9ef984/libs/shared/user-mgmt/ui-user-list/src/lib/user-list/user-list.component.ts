import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { SelectDropDownOption, UserDetail } from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isSearch = false;
  @Input() isBTQUser = true;
  @Input() appliedFilter = false;
  @Input() usersList: UserDetail[] = [];
  @Input() userListSize = 0;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize = 0;
  @Input() permissions$: Observable<any[]>;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  @Output() searchUser = new EventEmitter<string>();
  @Output() toggleUserLock = new EventEmitter<boolean>();
  @Output() paginateUsersList = new EventEmitter<PageEvent>();
  @Output() filter = new EventEmitter();
  @Output() locationSelection = new EventEmitter();
  @Output() loadUsers = new EventEmitter();
  @Output() clearUsers = new EventEmitter();

  noDataFoundMessage: string;
  employeeIdLabel: string;
  employeeNameLabel: string;
  searchPlaceHolder: string;
  employeeIdPlaceholder: string;
  employeeNamePlaceholder: string;
  searchForm: FormGroup;
  dropdownSearchOptions: SelectDropDownOption[] = [];

  destroy$: Subject<null> = new Subject<null>();
  list: any;
  USER_LIST_ADDUSER_BTN = 'Uam User List - Add User Btn';
  USER_LIST_DIV = 'Uam User List - User List Container';
  USER_LIST_SEARCH_BOX = 'Uam User List - Search Box';

  constructor(
    private elementPermission: ElementPermissionService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.entity.usersEntity',
        'pw.usermanagementlist.employeeId',
        'pw.usermanagementlist.employeeName',
        'pw.usermanagementlist.employeeIdPlaceholder',
        'pw.usermanagementlist.employeeNamePlaceholder'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.employeeIdLabel = entity['pw.usermanagementlist.employeeId'];
        this.employeeNameLabel = entity['pw.usermanagementlist.employeeName'];
        this.employeeIdPlaceholder =
          entity['pw.usermanagementlist.employeeIdPlaceholder'];
        this.employeeNamePlaceholder =
          entity['pw.usermanagementlist.employeeNamePlaceholder'];

        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.usersEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit(): void {
    this.list = this.usersList;
    this.dropdownSearchOptions = [
      {
        value: this.employeeIdLabel,
        description: this.employeeIdLabel
      },
      {
        value: this.employeeNameLabel,
        description: this.employeeNameLabel
      }
    ];

    this.searchForm = new FormGroup({
      searchBy: new FormControl(this.dropdownSearchOptions[0].value),
      searchFormControl: new FormControl()
    });
    this.searchPlaceHolder = this.employeeIdPlaceholder;
  }

  clearSearch() {
    this.searchForm.controls['searchFormControl'].setValue('');
  }

  ngAfterViewInit(): void {
    this.searchForm.controls['searchBy'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchValue: any) => {
        if (searchValue) {
          this.searchPlaceHolder =
            searchValue === this.employeeNameLabel
              ? this.employeeNamePlaceholder
              : this.employeeIdPlaceholder;
          if (this.searchForm.get('searchFormControl').value) {
            this.clearSearch();
          }
        }
      });

    this.searchForm.controls['searchFormControl'].valueChanges
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.searchForm.get('searchFormControl').value;
        const searchByValue = this.searchForm.get('searchBy').value;

        if (searchValue !== '' && searchByValue === this.employeeIdLabel) {
          if (this.isValidEmployeeId(searchValue)) {
            this.searchUser.emit(searchValue);
          } else {
            this.clearUsers.emit(true);
          }
        } else if (
          searchValue !== '' &&
          searchByValue === this.employeeNameLabel
        ) {
          if (this.isValidEmployeeName(searchValue)) {
            this.searchUser.emit(searchValue);
          } else {
            this.clearUsers.emit(true);
          }
        } else {
          this.loadUsers.emit(true);
        }
      });
  }

  isValidEmployeeId(searchValue: string): boolean {
    const isValidEmpId = fieldValidation.employeeCodeField.pattern.test(
      searchValue
    );
    return isValidEmpId;
  }

  isValidEmployeeName(searchValue: string): boolean {
    const isValidEmpName = fieldValidation.nameWithSpaceField.pattern.test(
      searchValue
    );
    return isValidEmpName;
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
