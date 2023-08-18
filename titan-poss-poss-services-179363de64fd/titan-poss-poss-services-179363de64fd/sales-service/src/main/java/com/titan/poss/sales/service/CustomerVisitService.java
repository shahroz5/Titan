/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.request.CustomerVisitDto;
import com.titan.poss.sales.dto.response.CustomerVisitCountDto;
import com.titan.poss.sales.dto.response.CustomerVisitResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("customerVisitService")
public interface CustomerVisitService {

	/**
	 * This method will save the count of customer visited in BTQ
	 * 
	 * @param customerVisit
	 * @return CustomerVisitDto
	 */
	CustomerVisitResponseDto saveCustomerVisitDetails(CustomerVisitDto customerVisit);

	/**
	 * This method will get the count of conversion
	 * 
	 * @param businessDateDto
	 * @return ConversionCountDto
	 */
	CustomerVisitCountDto getCustomerVisitCount(BusinessDateDto businessDateDto);

	/**
	 * @param businessDateDto
	 * @return
	 */
	CustomerVisitDto getCustomerVisitDetails(BusinessDateDto businessDateDto);

	/**
	 * @return
	 */
	ListResponse<CustomerVisitResponseDto> getCustomerVisits();

	/**
	 * @return
	 */
	CustomerVisitResponseDto getCustomerVisitDetails();

}
