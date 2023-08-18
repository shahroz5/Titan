import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ElementPermissionService {
  loadPermission = (element: string, permissions$: Observable<any>) => {
    return permissions$.pipe(
      filter(data => !!data && data.length !== 0),
      map(data => {
        const acl = data.find(aclData => aclData.element === element);
        return {
          transactionCodes: acl ? acl['transactionCodes'] : [],
          authorisedStrategy: acl ? acl['authorisedStrategy'] : '',
          unAuthorisedStrategy: acl ? acl['unauthorisedStrategy'] : ''
        };
      })
    );
  };
}
