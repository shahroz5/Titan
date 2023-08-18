/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.EinvoiceJobResponseDto;
import com.titan.poss.integration.service.IntegrationJobEpossService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "/integration/v2/jobs/eposs")
public class JobEpossController {

	@Autowired
	private IntegrationJobEpossService integrationJobEpossService;

	@GetMapping(value = "/einvoice-irn")
	@ApiOperation(value = "API to generate e-invoice QR code", notes = "This API will generate e-invoice QR code for falied records")
	public EinvoiceJobResponseDto eInvoiceRetry() {

		return integrationJobEpossService.eInvoiceRetry();
	}

	@GetMapping(value = "/failed-einvoice-irn/list")
	@ApiOperation(value = "API to list failed e-invoice IRN list", notes = "This API will list all failed e-invoice IRN")
	public EinvoiceJobResponseDto getFailedInvoiceList() {
		return integrationJobEpossService.getFailedInvoiceList();
	}


}
