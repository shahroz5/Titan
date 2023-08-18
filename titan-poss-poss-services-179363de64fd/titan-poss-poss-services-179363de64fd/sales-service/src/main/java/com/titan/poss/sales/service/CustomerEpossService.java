/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dto.CustomerEpossListSearchDto;
import com.titan.poss.sales.dto.CustomerEpossSearchDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CustomerEpossService {

	/**
	 * This method will return customer type & unique fields in response search.
	 * 
	 * @param searchInput
	 * @param searchType
	 * @return CustomerSearchDto
	 */
	ListResponse<CustomerEpossListSearchDto> searchCustomerList(String searchInput, String searchType);

	/**
	 * @param searchField
	 * @param searchType
	 * @param isUlpUpdateRquire
	 * @return
	 */
	CustomerEpossSearchDto searchAndUpdateCustomer(String searchField, String searchType, Boolean isUlpUpdateRquire);

	/**
	 * @param searchField
	 * @param searchType
	 * @return
	 */
	CustomerEpossSearchDto getCustomerByIdAndLocationCode(Integer customerId, String locationCode);

	/**
	 * @param searchFieldValue
	 * @param searchTypeStr
	 * @return
	 */
	CustomerEpossSearchDto searchCustomerWoULPWoError(String searchFieldValue, String searchTypeStr);

	/**
	 * @param customerDao
	 * @param custUlpData
	 */
	void updateCustomerDetailsFromULP(CustomerDao customerDao, CustomerDto custUlpData);

	/**
	 * @param customerUlpDao
	 * @param locationCode
	 * @param customerDao
	 * @return
	 */
	CustomerEpossSearchDto searchCustomer(CustomerEpossSearchDto legacyCustomerDetails, String locationCode);

}
