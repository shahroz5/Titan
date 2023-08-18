/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CommonTxnSycnService {
	SyncStagingDto discountSyncStagging(SalesTxnDaoExt salesTxn);
	
	void syncDataDocNumberFailAudit(DocNumberFailAuditDaoExt docNumberFailAuditDaoExt);
}
