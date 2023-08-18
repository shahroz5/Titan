import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';
import { RoleDetail } from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() rolesList: RoleDetail[] = [];
  @Input() rolesListSize = 0;
  @Input() pageSizeOptions: number[] = [];
  @Input() appliedFilter = false;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @Input() permissions$: Observable<any[]>;

  @Output() paginateRolesList = new EventEmitter<PageEvent>();
  @Output() updateRole = new EventEmitter<string>();
  @Output() viewRole = new EventEmitter<string>();
  @Output() toggleRole = new EventEmitter<MatSlideToggleChange>();
  @Output() searchRole = new EventEmitter<string>();
  @Output() filter = new EventEmitter();
  @Output() loadRoles = new EventEmitter();
  @Output() clearRoles = new EventEmitter();

  ROLE_LIST_ADDNEWROLE_BTN = 'Uam Role Mgmt - Add New Role Button';
  ROLE_LIST_SEARCHROLE_INPUT = 'Uam Role Mgmt - Search By Role Code Input';
  ROLE_LIST_FILTERROLE_BTN =
    'Uam Role Mgmt - Filter By Role Type/Location Format';
  ROLE_LIST_CONTAINER_CARD = 'Uam Role Mgmt - Role List Container';

  noDataFoundMessage: string;
  minPageSize = 0;
  searchFormControl = new FormControl();
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private elementPermission: ElementPermissionService,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.entity.rolesEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.rolesEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSizeOptions']) {
      this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
        a < b ? a : b
      );
    }
  }

  ngAfterViewInit() {
    this.searchFormControl.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.searchFormControl.value;

        if (searchValue !== '') {
          if (this.validateSearch(searchValue)) {
            this.searchRole.emit(searchValue);
          } else {
            this.clearRoles.emit(true);
          }
        } else {
          this.loadRoles.emit(true);
        }
      });
  }

  validateSearch(searchValue: string): boolean {
    return fieldValidation.roleCodeField.pattern.test(searchValue);
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
