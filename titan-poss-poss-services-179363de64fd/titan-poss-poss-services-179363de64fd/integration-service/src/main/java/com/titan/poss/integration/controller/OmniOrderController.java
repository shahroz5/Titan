/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.integration.dto.request.OmniOrderCustomerCancelDto;
import com.titan.poss.integration.dto.request.OmniOrderInvoiceDetailsDto;
import com.titan.poss.integration.dto.request.OmniOrderPackDetailsDto;
import com.titan.poss.integration.dto.request.OmniOrderResendOtpDto;
import com.titan.poss.integration.dto.request.OmniOrderReturnDto;
import com.titan.poss.integration.dto.request.OmniOrderStatusUpdateDto;
import com.titan.poss.integration.dto.response.OmniCancelOrderResponseDto;
import com.titan.poss.integration.dto.response.OmniOpenOrderResponseDto;
import com.titan.poss.integration.dto.response.OmniOrderResponseDto;
import com.titan.poss.integration.service.OmniOrderService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationOmniOrderController")
@RequestMapping(value = "integration/v2/omni/orders")
public class OmniOrderController {
	
	@Autowired
	private OmniOrderService omniOrderService;
	
	@ApiOperation(value = "This method will get orders from OmniPOSS", notes = "This API will get orders from OmniPOSS for the logged in location")
	@GetMapping(value = "")
	public ListResponse<OmniOpenOrderResponseDto> getOmniOrders(){
		
		return omniOrderService.getOmniOrders();
	}
	
	@ApiOperation(value = "This method will get cancelled orders from OmniPOSS", notes = "This API will get cancelled orders from OmniPOSS for the logged in location")
	@GetMapping(value = "/cancel")
	public ListResponse<OmniCancelOrderResponseDto> getOmniCancelOrders(){
		
		return omniOrderService.getOmniCancelOrders();
	}
	
	@ApiOperation(value = "This method will update the status of omni order at POSS to OmniPOSS", notes = "This API will update the status of omni order at POSS to OmniPOSS")
	@PatchMapping(value = "")
	public OmniOrderResponseDto omniOrderStatus(@RequestBody @Valid OmniOrderStatusUpdateDto omniOrderStatusUpdateDto){
		
		return omniOrderService.omniOrderStatus(omniOrderStatusUpdateDto);
	}

	@ApiOperation(value = "This method will send order packing details to Omni poss", notes = "This API will send order packing details to Omni poss")
	@PostMapping(value = "/pack")
	public OmniOrderResponseDto omniOrderPackDetails(@RequestBody @Valid OmniOrderPackDetailsDto omniOrderPackDetailsDto){
		
		return omniOrderService.omniOrderPackDetails(omniOrderPackDetailsDto);
	}

	@ApiOperation(value = "This method will send omni order invoice details to Omni poss", notes = "This API will send omni order invoice details to Omni poss")
	@PostMapping(value = "/invoice")
	public OmniOrderResponseDto omniOrderInvoiceDetails(@RequestBody @Valid OmniOrderInvoiceDetailsDto omniOrderInvoiceDetailsDto){
		
		return omniOrderService.omniOrderInvoiceDetails(omniOrderInvoiceDetailsDto);
	}
	
	@ApiOperation(value = "This method will send details of the order cancelled by the customer at store to Omni poss", notes = "This API will send details of the order cancelled by the customer at storeto Omni poss")
	@PostMapping(value = "/customer-cancel")
	public OmniOrderResponseDto omniOrderCancelledByCustomer(@RequestBody @Valid OmniOrderCustomerCancelDto omniOrderCustomerCancelDto){
		
		return omniOrderService.omniOrderCancelledByCustomer(omniOrderCustomerCancelDto);
	}
	
	@ApiOperation(value = "This method will send order details to Omni poss to resend otp to customer", notes = "This API will send order details to Omni poss to resend otp to customer")
	@PostMapping(value = "/otp")
	public OmniOrderResponseDto omniOrderResendOtp(@RequestBody @Valid OmniOrderResendOtpDto omniOrderResendOtpDto){
		
		return omniOrderService.omniOrderResendOtp(omniOrderResendOtpDto);
	}
	
	@ApiOperation(value = "This method will send item return details to Omni poss when customer returns the item at store", notes = "This API will send item return details to Omni poss when customer returns the item at store")
	@PostMapping(value = "/return")
	public OmniOrderResponseDto omniOrderReturn(@RequestBody @Valid OmniOrderReturnDto omniOrderReturnDto){
		
		return omniOrderService.omniOrderReturn(omniOrderReturnDto);
	}

}
