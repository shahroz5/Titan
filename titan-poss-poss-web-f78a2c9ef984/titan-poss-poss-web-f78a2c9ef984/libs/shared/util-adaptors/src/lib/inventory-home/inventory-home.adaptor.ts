import {
  LoadSTNCountPayload,
  LoadReceiveInvoicePayload,
  LoadIssueSTNCountsPayload,
  StockReceiveAPITypesEnum
} from '@poss-web/shared/models';

export class InventoryHomeAdaptor {
  static STNCountFromJson(data: any): LoadSTNCountPayload {
    let pendingFactorySTNCount = 0;
    let pendingBoutiqueSTNCount = 0;
    let pendingMerchandiseSTNcount = 0;

    for (const stnCount of data.results) {
      if (stnCount.type === StockReceiveAPITypesEnum.FAC_BTQ) {
        pendingFactorySTNCount = stnCount.count;
      }
      if (stnCount.type === StockReceiveAPITypesEnum.BTQ_BTQ) {
        pendingBoutiqueSTNCount = stnCount.count;
      }
      if (stnCount.type === StockReceiveAPITypesEnum.MER_BTQ) {
        pendingMerchandiseSTNcount = stnCount.count;
      }
    }

    return {
      pendingFactorySTNCount,
      pendingBoutiqueSTNCount,
      pendingMerchandiseSTNcount
    };
  }

  static ReceiveInvoiceFromJson(data: any): LoadReceiveInvoicePayload {
    let pendingCFASTNCount = 0;

    for (const CFACount of data.results) {
      if (CFACount.type === StockReceiveAPITypesEnum.CFA_BTQ) {
        pendingCFASTNCount = CFACount.count;
      }
    }

    return {
      pendingCFASTNCount
    };
  }

  static IssueSTNCountFromJson(data: any): LoadIssueSTNCountsPayload {
    let pendingIssueBTQ_BTQ_STNCount = 0;
    let pendingIssueBTQ_FAC_STNCount = 0;
    let pendingIssueBTQ_MER_STNCount = 0;

    for (const issueSTNCount of data.results) {
      if (issueSTNCount.type === 'BTQ') {
        pendingIssueBTQ_BTQ_STNCount = issueSTNCount.count;
      }
      if (issueSTNCount.type === 'FAC') {
        pendingIssueBTQ_FAC_STNCount = issueSTNCount.count;
      }
      if (issueSTNCount.type === 'MER') {
        pendingIssueBTQ_MER_STNCount = issueSTNCount.count;
      }
    }
    return {
      pendingIssueBTQ_BTQ_STNCount,
      pendingIssueBTQ_FAC_STNCount,
      pendingIssueBTQ_MER_STNCount
    };
  }
}
