/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import org.springframework.stereotype.Service;

import com.titan.poss.sales.dto.CustomerDocumentDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface CommonPrintService {

	/**
	 * 
	 * @param customerDocuments
	 */
	void uploadFileToOnlineBucketAndSaveToDb(CustomerDocumentDto customerDocuments);
	
	void uploadFileToOnlineBucket(String path);

}
