import { StoreUser } from '@poss-web/shared/models';
import { StoreUserAdaptor } from '../masters/store-user.adaptors';

export class StoreUserHelper {
  static getStoreUsers(data: any): StoreUser[] {
    const StoreUsers: StoreUser[] = [];
    for (const storeUser of data) {
      if(storeUser.isLoginActive === true)
        StoreUsers.push(StoreUserAdaptor.StoreUserDataFromJson(storeUser));
    }
    return StoreUsers;
  }
}
