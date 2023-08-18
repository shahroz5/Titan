/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.EinvoiceJobResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface IntegrationJobEpossService {

	EinvoiceJobResponseDto eInvoiceRetry();

	EinvoiceJobResponseDto getFailedInvoiceList();

}
