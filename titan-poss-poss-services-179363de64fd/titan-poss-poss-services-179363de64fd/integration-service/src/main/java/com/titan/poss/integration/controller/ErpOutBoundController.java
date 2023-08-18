/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.controller;

import static com.titan.poss.inventory.acl.InventoryAccessControls.RECEIVE_FROM_FACTORY;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.integration.service.ErpOutBoundService;
import com.titan.poss.inventory.acl.InventoryAccessControls;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationErpOutBoundController")
@RequestMapping(value = "integration/v2/erp")
public class ErpOutBoundController {

	@Autowired
	private ErpOutBoundService erpService;

	private static final String PURCHASE_INVOICE_PERMISSION = "hasPermission(true,'"
			+ InventoryAccessControls.RECEIVE_INVOICE_FROM_CFA + "' )";

	private static final String STOCK_RECEIVE_PERMISSION = " hasPermission(true,'" + RECEIVE_FROM_FACTORY + "' ) ";

	@ApiOperation(value = "This method will get invoice details from ERP", notes = "This method will get invoice details from ERP for the invoice number")
	@GetMapping(value = "/inv")
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	public void getInvoice(@RequestParam(required = true) String invNo) {
		erpService.getInvoiceService(invNo);
	}

	@ApiOperation(value = "This method will get stn details from ERP", notes = "This method will get STN details from ERP for the stn number")
	@GetMapping(value = "/stn")
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	public void getStn(@RequestParam(required = true) String stnNo) {
		erpService.getStnService(stnNo);
	}

}
