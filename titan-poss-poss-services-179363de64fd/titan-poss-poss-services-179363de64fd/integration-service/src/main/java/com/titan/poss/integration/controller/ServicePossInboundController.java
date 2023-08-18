package com.titan.poss.integration.controller;

import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.CashMemoFetchDto;
import com.titan.poss.core.dto.CustomerPurchaseHistoryDto;
import com.titan.poss.core.dto.CustomerPurchaseRequestDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.EdcBanksDto;
import com.titan.poss.core.dto.EmployeeMasterDto;
import com.titan.poss.core.dto.LocationServicesDto;
import com.titan.poss.core.dto.MetalApplicableDto;
import com.titan.poss.core.dto.MetalGoldPriceDto;
import com.titan.poss.core.dto.PayerBankDtoRes;
import com.titan.poss.core.dto.UserLoginDto;
import com.titan.poss.integration.service.PossInboundService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("integration/v2/service-poss")
public class ServicePossInboundController {
	
	@Autowired
	private PossInboundService possInboundService;
	
	
//	@ApiOperation(value = "This method will return the payer bank details based on the locationCode", notes = "This method will return the payer bank details based on the locationCode")
//	@GetMapping(value = "/payer-banks/{locationCode}")
//	public List<PayerBankDtoRes>  getBankName (
//			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode){
//		return possInboundService.getBankName(locationCode);
//	}
//	
		
	@ApiOperation(value = "This method will return the location details based on the locationCode", notes = "This method will return the location details based on the locationCode")
	@GetMapping(value = "/location-details/{locationCode}")
	public List<LocationServicesDto>  getLocationDetails(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {
	return possInboundService.getLocationDetails(locationCode);
		}
	
	@ApiOperation(value = "This method will return the latest metal price details.", notes = "This method will return the latest metal price details.")
	@PostMapping("/metal-details/{locationCode}")
	public List<MetalGoldPriceDto> getMarketMetalDetails(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestBody @Valid MetalApplicableDto applicableDate) {
		return possInboundService.getMarketMetalDetails(locationCode,applicableDate);
	}
	
	@ApiOperation(value= "This method list edc bank details for the given payment code")
	@PostMapping(value = "/edc-bank")
	public List<EdcBanksDto> getEdcBank(
			@RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode,
			@RequestBody(required = false) @Validated EdcBankRequestDto edcBankRequestDto) {
		return possInboundService.getEdcBank(paymentCode,edcBankRequestDto);
	}
	
	@ApiOperation(value = "Get all employee master data of all locations", notes = "Get all employee master data of all locations.")
	@PostMapping(value = "/employee-master")
	public List<EmployeeMasterDto> getAllEmployeeList(
			@RequestBody(required = false) @Validated EdcBankRequestDto edcBankRequestDto) {
		return possInboundService.getAllEmployeeList(edcBankRequestDto);
	}
	
	@ApiOperation(value = "Get all login master data of all locations", notes = "Get all login master data of all locations.")
	@PostMapping(value = "/login-master")
	public List<UserLoginDto> getAllLoginMasterList(
			@RequestBody(required = false) @Validated EdcBankRequestDto edcBankRequestDto) {
		return possInboundService.getAllLoginMasterList(edcBankRequestDto);
	}
	
	@ApiOperation(value = "Get all customer purchase history through their Mobile Number ", notes = "Get all customer purchase history through their Mobile Number.")
	@PostMapping(value = "/cashMemo-details")
	public List<CustomerPurchaseHistoryDto> getAllCashMemoPurchase(
			@RequestBody(required = true) @Validated CustomerPurchaseRequestDto customerPurchaseRequestDto) {
		return possInboundService.getAllCashMemoPurchase(customerPurchaseRequestDto);
	}
	
	@ApiOperation(value = "Get all cash memo history through the docNo and fiscal year ", notes = "Get all cash memo history through the docNo and fiscal year.")
	@PostMapping(value = "/cashMemo-history")
	public  CustomerPurchaseHistoryDto getAllCashMemoHistory(
			@RequestBody(required = true) @Validated CashMemoFetchDto cashMemoFetchDto) {
		return possInboundService.getAllCashMemoHistory(cashMemoFetchDto);
	}
	
	/**
	 * This method will return the location code based on the date range.
	 * 
	 * @param locationCode
	 * @return GLCodeDto
	 */
	@ApiOperation(value = "This method will return the location details based on the date range", notes = "This method will return the location details based on the date range")
	@PostMapping(value = "/{locationCode}")
	public List<String>  getLocationCodes(
			@RequestBody(required = true) @Validated EdcBankRequestDto edcBankRequestDto) {
		return possInboundService.getLocationCodes(edcBankRequestDto);
	}

}
