/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.ComUpdateRequestDto;
import com.titan.poss.core.dto.ConfirmCustomerOrderDetailsDto;
import com.titan.poss.core.response.COResponseDto;
import com.titan.poss.integration.dto.ConfirmInvoiceDetailsDto;
import com.titan.poss.integration.service.impl.CustomerOrderServiceImpl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@RequestMapping("integration/v2/customer-order")
public class CustomerOrderController {

	@Autowired
	private CustomerOrderServiceImpl customerService;

	@GetMapping("")
	public Object getCustomerOrders(@RequestParam(name = "locationCode", required = true) String locationCode) {

		return customerService.getCustomerOrderData(locationCode);
	}
	
	@GetMapping("/com")
	public Object getCustomerOrdersForCom(@RequestParam(name = "locationCode", required = true) String locationCode) {

		return customerService.getCustomerOrderComData(locationCode);
	}

	@PostMapping("/stn-update-status")
	public Object updateStatus(@RequestBody @Valid ComUpdateRequestDto comUpdateRequestDto ) {

		return customerService.updateStatus(comUpdateRequestDto);
	}
	
	@PostMapping("/confirm")
	public List<COResponseDto> confirmCustomerOrder(@RequestBody @Valid ConfirmCustomerOrderDetailsDto confirmCustomerOrderDetailsDto ) {

		return customerService.confirmCustomerOrder(confirmCustomerOrderDetailsDto);
	}
	
	@PostMapping("/confirm-invoice-details")
	public List<COResponseDto> confirmInvoiceDetails(@RequestBody @Valid List<ConfirmInvoiceDetailsDto> confirmInvoiceDetailsDto ) {

		return customerService.confirmInvoiceDetails(confirmInvoiceDetailsDto);
	}

}
