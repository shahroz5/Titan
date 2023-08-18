/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.EinvoiceJobResponseDto;
import com.titan.poss.core.dto.SchedulerResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface IntegrationJobService {

	SchedulerResponseDto retryFailedEventTransactions();

	EinvoiceJobResponseDto eInvoiceRetry(String authorizationToken, String authorizationCookie);
	
	List<String> getFailedInvoiceList();
	
	List<String> getFailedEpossInvoiceList(HttpServletRequest request);

}
