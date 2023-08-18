/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import com.titan.poss.sales.dao.CustomerDocumentsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CustomerDocumentService {

	CustomerDocumentsDao getOldCustomerDocumentByInput(String txnId, String documentType, String fileType);

	CustomerDocumentsDao save(CustomerDocumentsDao cd);

	List<CustomerDocumentsDao> saveAll(List<CustomerDocumentsDao> cds);

	void deactivateCustomerDoc(CustomerDocumentsDao cd);

	CustomerDocumentsDao getActiveDocByCustomerId(String customerId, String documentType, String fileType);

	CustomerDocumentsDao getActiveDocByTxnId(String txnId, String documentType, String fileType);

	List<CustomerDocumentsDao> getActiveDocsByTxnId(String id);

	List<CustomerDocumentsDao> getActiveCustomerDocsByCustomerId(String customerId);

	List<CustomerDocumentsDao> getActiveUnsyncedDocs();
}
