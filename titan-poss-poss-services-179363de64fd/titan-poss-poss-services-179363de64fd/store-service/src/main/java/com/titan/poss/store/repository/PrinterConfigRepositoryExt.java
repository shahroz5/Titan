/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.store.dao.PrinterConfigDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PrinterConfigRepositoryExt extends JpaRepository<PrinterConfigDaoExt, String> {

	/**
	 * @param locationCode
	 * @param hostName
	 * @param documentType
	 * @return
	 */
	PrinterConfigDaoExt findByLocationCodeAndHostnameAndDocumentType(String locationCode, String hostName,
			String documentType);

}
