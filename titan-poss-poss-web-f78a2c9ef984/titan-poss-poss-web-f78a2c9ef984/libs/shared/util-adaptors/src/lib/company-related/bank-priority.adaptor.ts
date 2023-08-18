import {
  LoadBankPriorityListingSuccessPayload,
  BankPriority,
  SaveBankPriorityFormDetailsPayload
} from '@poss-web/shared/models';
export class BankPriorityAdaptor {
  static getBankPriority(data: any, newPayeeBanksData: any): any {
    const saveBank: SaveBankPriorityFormDetailsPayload = {
      addPriority: [],
      removePriority: []
    };
    //payee banks
    const newPayeeBanks: string[] = newPayeeBanksData.results;

    //inactive banks
    saveBank.removePriority = data
      .filter(data1 => !newPayeeBanks.includes(data1.bankName))
      .map(data1 => data1.bankName);

    data = data.filter(data1 => newPayeeBanks.includes(data1.bankName));

    const extractBanks: BankPriority[] = [];
    if (newPayeeBanks.length) {
      const data1 = data.map(d => d.bankName);

      newPayeeBanks.forEach(b => {
        if (!data1.includes(b)) {
          extractBanks.push({
            bankName: b,
            priority: ''
          });
        }
      });

      data = data.concat(extractBanks);
    }

    const bankPriorityListing = [];
    for (let i = 0; i < data.length; i++) {
      bankPriorityListing.push({
        bankName: data[i].bankName,
        priority: i
      });
    }

    saveBank.addPriority = bankPriorityListing;
    saveBank.removePriority = saveBank.removePriority.concat(
      bankPriorityListing.map(i => i.bankName)
    );

    return saveBank;
  }
  static getSavedBank(data: any) {
    let bankPriorityList: LoadBankPriorityListingSuccessPayload = null;
    const bankPriorityListing: BankPriority[] = [];

    for (const listItem of data) {
      bankPriorityListing.push({
        bankName: listItem.bankName,
        priority: listItem.priority
      });
    }
    bankPriorityList = {
      bankPriorityListing: bankPriorityListing,
      totalElements: data.totalElements
    };

    return bankPriorityList;
  }
}
