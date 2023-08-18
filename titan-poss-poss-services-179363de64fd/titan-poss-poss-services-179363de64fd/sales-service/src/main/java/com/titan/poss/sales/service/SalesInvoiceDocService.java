/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import java.util.List;

import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;

/**
 * Service interface for Sales Invoie Doc
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface SalesInvoiceDocService {

	void syncDataInvoiceDocs(SalesInvoiceDocumentsDao salesInvoiceDocuments);
	
	void syncDataInvoiceDocs(List<SalesInvoiceDocumentsDao> salesInvoiceDocuments);

}
