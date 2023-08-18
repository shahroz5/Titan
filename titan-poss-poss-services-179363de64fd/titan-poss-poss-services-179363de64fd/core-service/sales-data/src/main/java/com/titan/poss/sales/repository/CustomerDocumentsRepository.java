/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerDocumentsDao;

/**
 * Handles repository operations for <b>CustomerDocumentsRepository</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCustomerDocumentsRepository")
public interface CustomerDocumentsRepository extends JpaRepository<CustomerDocumentsDao, String> {

	/**
	 * 
	 * @param documentPath
	 * @return CustomerDocumentsDao
	 */
	CustomerDocumentsDao findByDocumentPath(String documentPath);

	CustomerDocumentsDao findByTxnIdAndLocationCodeAndDocumentTypeAndFileTypeAndIsActiveTrue(String txnId,
			String locationCode, String documentType, String fileType);

	Optional<CustomerDocumentsDao> findByIdAndLocationCodeAndIsActiveTrue(String id, String locationCode);

	List<CustomerDocumentsDao> findByIdInAndLocationCodeAndIsActiveTrue(List<String> ids, String locationCode);

	List<CustomerDocumentsDao> findByTxnIdAndLocationCodeAndIsActiveTrue(String txnId, String locationCode);

	List<CustomerDocumentsDao> findByCustomerIdAndDocumentTypeAndIsActiveTrue(String customerId, String documentType);

	List<CustomerDocumentsDao> findByIsActiveTrueAndIsSyncedFalse();

	CustomerDocumentsDao findByCustomerIdAndDocumentTypeAndFileTypeAndIsActiveTrue(String customerId,
			String documentType, String fileType);

	CustomerDocumentsDao findByProcessId(String processId);

	List<CustomerDocumentsDao> findAllByCustomerIdAndDocumentTypeAndFileTypeAndIsActiveTrue(String customerMasterId,
			String documentType, String fileType);

	List<CustomerDocumentsDao> findAllByTxnIdAndLocationCodeAndDocumentTypeAndFileTypeAndIsActiveTrue(String txnId,
			String locationCode, String documentType, String fileType);

	Optional<CustomerDocumentsDao> findByTxnIdAndLocationCode(String id, String locationCode);
	
	Optional<List<CustomerDocumentsDao>> findByTxnIdAndDocumentTypeAndLocationCode(String id, String documentType, String locationCode);

}
