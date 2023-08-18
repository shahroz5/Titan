/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.InventoryInvoiceDocumentsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("InventoryInvoiceDocumentsRepository")
public interface InventoryInvoiceDocumentsRepository extends JpaRepository<InventoryInvoiceDocumentsDao, String> {

	InventoryInvoiceDocumentsDao findByReferenceIdAndTransactionType(String referenceId, String transactionType);

}
