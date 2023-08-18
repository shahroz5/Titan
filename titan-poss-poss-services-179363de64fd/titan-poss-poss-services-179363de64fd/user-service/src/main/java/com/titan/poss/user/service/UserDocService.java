/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.service;

import org.springframework.stereotype.Service;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("userDocService")
public interface UserDocService {

	/**
	 * Returns doc no specific to a store, year, type
	 * 
	 * @param year         fiscal year
	 * @param locationCode location
	 * @param docType      doc type
	 * @return
	 */
	Integer getDocNumber(String locationCode, short year, String docType);

}
