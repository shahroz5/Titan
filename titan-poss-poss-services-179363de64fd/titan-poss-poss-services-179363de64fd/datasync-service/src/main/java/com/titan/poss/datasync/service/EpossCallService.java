/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import java.util.Map;

import org.springframework.http.HttpMethod;

import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface EpossCallService {

	ApiResponseDto getTheEPOSSData(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody);

	/**
	 * @param inventory
	 */
	void getInventoryDependencyAndSave(InventoryDetailsDao inventory);

	/**
	 * @param complexityCode
	 */
	void getComplexityAndSave(String complexityCode);

	/**
	 * @param productGroup
	 */
	void getProductGroupAndSave(String productGroup);

	/**
	 * @param productCategory
	 */
	void getProductCategoryAndSave(String productCategory);
	
	String getAuthHeaderToken(String vendorCode);

}
