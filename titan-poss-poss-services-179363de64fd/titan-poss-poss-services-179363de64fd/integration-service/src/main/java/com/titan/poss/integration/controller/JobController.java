/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.dto.EinvoiceJobResponseDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.integration.service.IntegrationJobService;
import com.titan.poss.integration.service.RestClientService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "/integration/v2/jobs")
@PreAuthorize(IS_STORE_USER)
public class JobController {

	private static final String UPDATE_EINVOICE_PERMISSION = START + SalesAccessControls.UPDATE_EINVOICE + END;

	@Autowired
	private IntegrationJobService integrationJobService;
	
	@Autowired
	RestClientService restClientService;

	@GetMapping(value = "/retry-publish")
	@ResponseBody
	@ApiOperation(value = "retry publishing failed transaction details to dial system", notes = "This API invocation will retry publishing failed transaction details to dial system")
	public SchedulerResponseDto retryFailedEventTransactions() {
		return integrationJobService.retryFailedEventTransactions();
	}

	@PreAuthorize(UPDATE_EINVOICE_PERMISSION)
	@GetMapping(value = "/einvoice-irn")
	@ApiOperation(value = "API to generate e-invoice QR code", notes = "This API will generate e-invoice QR code for falied records")
	public EinvoiceJobResponseDto eInvoiceRetry() {
		return integrationJobService.eInvoiceRetry(null, null);
	}

	@GetMapping(value = "/failed-einvoice-irn/list")
	@ApiOperation(value = "API to list failed e-invoice IRN list", notes = "This API will list all failed e-invoice IRN")
	public List<String> getFailedInvoiceList(HttpServletRequest request) {
		List<String> results = new ArrayList<String>();
		results.addAll(integrationJobService.getFailedInvoiceList());
		List<String> epossResults = integrationJobService.getFailedEpossInvoiceList(request);
		if(null!=epossResults && !epossResults.isEmpty())
			results.addAll(epossResults);		
		return results;
	}


}
