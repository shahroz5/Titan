/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.store.dao.PrinterConfigDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PrinterConfigRepository extends JpaRepository<PrinterConfigDao, String> {

	/**
	 * @param documentType
	 * @param locationCode
	 * @param hostName
	 * @param b
	 * @return PrinterConfigDao
	 */
	PrinterConfigDao findByDocumentTypeAndLocationCodeAndHostnameAndIsActive(String documentType, String locationCode,
			String hostName, boolean b);

	/**
	 * @param locationCode
	 * @param hostName
	 * @param documentType
	 * @return
	 */
	PrinterConfigDao findByLocationCodeAndHostnameAndDocumentType(String locationCode, String hostName,
			String documentType);

}
