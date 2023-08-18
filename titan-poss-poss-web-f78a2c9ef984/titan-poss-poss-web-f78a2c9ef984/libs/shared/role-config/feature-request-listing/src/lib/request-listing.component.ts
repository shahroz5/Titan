import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import {
  takeUntil,
  filter,
  take,
  debounceTime
} from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  RoleCountRequestList,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  LocationMappingServiceAbstraction,
} from '@poss-web/shared/models';
import { RoleConfigFacade } from '@poss-web/shared/role-config/data-access-role-config';
import { OverlayNotificationType } from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './request-listing.component.html',
  styleUrls: ['./request-listing.component.scss']
})
export class RequestListingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  roleCountRequestList$: Observable<RoleCountRequestList[]>;
  roleCountRequestListLength$: Observable<number>;
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  isBTQUser = true;
  selectedLocations: { id: string; description: string }[] = [];
  searchForm: FormGroup;
  @ViewChild('searchBox', { static: true, read: ElementRef })
  searchRef: ElementRef;
  searchFormControl = new FormControl();
  permissions$: Observable<any[]>;

  constructor(
    private roleMgmntfacade: RoleConfigFacade,
    private formBuilder: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private profileData: ProfileDataFacade,
    private locationMappingService: LocationMappingServiceAbstraction,
    private permissionfacade: PermissionFacade
  ) {
    this.searchForm = this.formBuilder.group({
      searchValue: []
    });

    this.loadRoleCountRequestList();

    roleMgmntfacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.showNotification(errorVal));
  }

  ngOnInit() {
    this.isLoading$ = this.roleMgmntfacade.isLoading();
    this.roleMgmntfacade.resetRoleCountRequestList();
    this.roleCountRequestList$ = this.roleMgmntfacade.fetchRoleCountRequestList();
    this.roleCountRequestListLength$ = this.roleMgmntfacade.fetchRoleCountRequestListLength();
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }

  clearSearch() {
    this.searchForm.reset();
    this.loadRoleCountRequestList();
  }

  ngAfterViewInit() {
    fromEvent(this.searchRef.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.searchForm.get('searchValue').value;

        if (searchValue !== '') {
          if (this.validateSearch(searchValue)) {
            this.loadRoleCountRequestList();
          } else {
            this.roleMgmntfacade.clearRoleCountRequestList();
          }
        } else {
          this.clearSearch();
        }
      });
  }

  loadRoleCountRequestList = (pageNumber: number = 0, pageSize: number = 8) =>
    this.roleMgmntfacade.roleCountRequestList({
      pageNumber,
      pageSize,
      isBTQUser: this.isBTQUser,
      locationCodes: this.selectedLocations.map(location => location.id),
      requestSearch: this.searchForm.get('searchValue').value
    });

  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;

    return pattern.test($event.key);
  }

  showNotification(error?: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        error: error,
        hasClose: !!error
      })
      .events.pipe(take(1))
      .subscribe();
  }
  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
