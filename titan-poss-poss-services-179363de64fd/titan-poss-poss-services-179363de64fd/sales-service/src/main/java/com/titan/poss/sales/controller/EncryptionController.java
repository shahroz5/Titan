package com.titan.poss.sales.controller;


import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_API_USER;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.sales.service.CustomerService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller class for Customer.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_API_USER)
@RestController("salesCustomerEncryptController")
@RequestMapping("sales/v2/encryption")
public class EncryptionController {
	
	@Autowired
	private CustomerService customerService;
	
	// @formatter:off
	@ApiPageable
	@ApiOperation(value = "Api to encrypt customer", notes = "This API is used to encrypt customer <b>only after migration</b><br>"
			+ "By default API will take 100 records at a time and encrypt it. Returns the count of customer details updated.")
	// @formatter:on
	@GetMapping("/encryptcustomer")
	public Integer encryptCustomerDetails(@ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "false") Boolean isPageable) {
		return customerService.encryptCustomeDetailsByChunk(pageable, isPageable);
	}
	
	// @formatter:off
	@ApiPageable
	@ApiOperation(value = "Api to decrypt customer", notes = "This API is used to decrypt customer <b>only after migration</b><br>"
				+ "By default API will take 100 records at a time and decrypt it. Returns the count of customer details updated.")
	// @formatter:on
	@GetMapping("/decryptcustomer")
	public Integer decryptCustomerDetails(@ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "false") Boolean isPageable) {
		return customerService.decryptCustomeDetailsByChunk(pageable, isPageable);
	}
	
	// @formatter:off
	@ApiPageable
	@ApiOperation(value = "Api to encrypt customer Transaction", notes = "This API is used to encrypt customer transaction table <b>only after migration</b><br>"
				+ "By default API will take 100 records at a time and encrypt it. Returns the count of customer details updated.")
	// @formatter:on
	@GetMapping("/encryptCustomerTxn")
	public Integer encryptCustomerTxnDetails(@ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "false") Boolean isPageable) {
		return customerService.encryptCustomerTxnDetailsByChunk(pageable, isPageable);
	}
	
	// @formatter:off
	@ApiPageable
	@ApiOperation(value = "Api to decrypt customer transaction", notes = "This API is used to decrypt customer transaction table <b>only after migration</b><br>"
				+ "By default API will take 100 records at a time and decrypt it. Returns the count of customer details updated.")
	// @formatter:on
	@GetMapping("/decryptCustomerTxn")
	public Integer decryptCustomerTxnDetailsByChunk(@ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "false") Boolean isPageable) {
		return customerService.decryptCustomerTxnDetailsByChunk(pageable, isPageable);
	}

	

}
