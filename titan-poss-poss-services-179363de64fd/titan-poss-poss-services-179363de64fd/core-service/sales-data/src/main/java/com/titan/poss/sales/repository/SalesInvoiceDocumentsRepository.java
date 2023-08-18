/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("SalesInvoiceDocumentsRepository")
public interface SalesInvoiceDocumentsRepository extends JpaRepository<SalesInvoiceDocumentsDao, String> {

	SalesInvoiceDocumentsDao findByReferenceId(String id);

	SalesInvoiceDocumentsDao findByReferenceIdAndTransactionType(String referenceId, String transactionType);

}
