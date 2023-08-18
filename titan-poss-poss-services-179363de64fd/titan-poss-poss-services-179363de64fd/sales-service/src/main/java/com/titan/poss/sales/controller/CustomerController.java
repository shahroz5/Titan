/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.VerificationTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.PanAndForm60ResponseDto;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.CustomerEpossListSearchDto;
import com.titan.poss.sales.dto.constants.CustNonUniqSearchTypeEnum;
import com.titan.poss.sales.dto.request.CustomerAddDto;
import com.titan.poss.sales.dto.request.CustomerPanDetails;
import com.titan.poss.sales.dto.request.CustomerUpdateDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.CustomerResDto;
import com.titan.poss.sales.dto.response.CustomerSearchDto;
import com.titan.poss.sales.dto.response.EmailValidationResponseDto;
import com.titan.poss.sales.service.CustomerService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller class for Customer.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesCustomerController")
@RequestMapping("sales/v2/customers")
public class CustomerController {

	@Autowired
	private CustomerService customerService;

	private static final String CUSTOMER_VIEW_PERMISSION = START + SalesAccessControls.CUSTOMER_VIEW + END;
	private static final String CUSTOMER_ADD_EDIT_PERMISSION = START + SalesAccessControls.CUSTOMER_ADD_EDIT + END;

	// @formatter:off
	@ApiOperation(value = "Search customer by unique searchable fields", notes = "This API will give customer details based on: "
			+ "<br>" + "<ul>" + "	<li><b>CUSTOMER_ID</b></li>" + "	<li><b>MOBILE_NO.</b></li>"
			+ "	<li><b>ULP_ID</b></li>" + "	<li><b>CUSTOMER_TAX_NO (for PAN)</b></li>"
			+ " <li><b>INSTITUTIONAL_TAX_NO (for GST)</b></li>" + " <li><b>PASSPORT_ID</b></li>" + "</ul>"
			+ "<br> Each of them are tagged to specific customer type. <br>"
			+ "It can give 1 result or error \"Record not found.\".<br><br>"
			+ "This API will internally call EPOSS to fetch customer data available in EPOSS & Override in POSS & provide it in response.<br>"
			+ "Fallback : If EPOSS is not reachable, it will search in POSS.")
	// @formatter:on
	@GetMapping
	@PreAuthorize(CUSTOMER_VIEW_PERMISSION)
	public CustomerSearchDto searchCustomer(
			@ApiParam(value = "Value", required = true) @RequestParam(required = true) @NotBlank @Size(max = 100) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "CUSTOMER_ID, MOBILE_NO, ULP_ID, CUSTOMER_TAX_NO, INSTITUTIONAL_TAX_NO, PASSPORT_ID", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = SearchTypeEnum.class) String searchType) {

		SearchTypeEnum searchTypeEnum = SearchTypeEnum.valueOf(searchType);
		return customerService.searchCustomerWithFallback(searchTypeEnum, searchField);

	}

	@ApiOperation(value = "Get customer information by customerId", notes = "This API will give customer details based on <b>customerId</b>.<br>")
	@GetMapping(value = "/{customerId}")
	@PreAuthorize(CUSTOMER_VIEW_PERMISSION)
	public CustomerDetailsDto getCustomer(
			@ApiParam(name = "customerId", value = "'customerId' to get details", required = true) @PathVariable @Min(1) Integer customerId) {

		return customerService.getCustomer(customerId);

	}

	// @formatter:off
	@ApiOperation(value = "Verify unique field value is already in use or not.", notes = "This API will check if the provided value exist in EPOSS or not.<br/>"
			+ "If EPOSS not reachable, it will do fallback to check in POSS.<br/>"
			+ "If returns true, means the field is unique, not used till now." + "<ul>" + "	<li>MOBILE_NO</li>"
			+ "	<li>ULP_ID</li>" + "	<li>CUSTOMER_TAX_NO (for PAN)</li>" + " <li>INSTITUTIONAL_TAX_NO (for GST)</li>"
			+ "	<li>PASSPORT_ID</li>" + "</ul>" + "is already assigned to a customer or not<br><br>")
	// @formatter:on
	@GetMapping(value = "/unique-checks")
	@PreAuthorize(CUSTOMER_VIEW_PERMISSION)
	public Boolean isUniqueCheck(
			@ApiParam(name = "searchType", value = "'searchType' to search ", allowableValues = "MOBILE_NO, ULP_ID, CUSTOMER_TAX_NO, INSTITUTIONAL_TAX_NO, PASSPORT_ID", required = true) @RequestParam(name = "searchType") @ValueOfEnum(enumClass = SearchTypeEnum.class) String searchType,
			@ApiParam(name = "value", value = "'value' to check uniqueness ", required = true) @RequestParam(name = "value") @Size(min = 1, max = 100, message = "min length is {min} and max length is {max} for the value") @PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX) String value) {

		return customerService.isUniqueCheck(searchType, value);

	}

	// @formatter:off
	@ApiOperation(value = "Create new customer", notes = "This API will create a customer<br>"
			+ "if regular customer call fails, then it can be created offline, by providing ULP id in request<br><br>"
			+ "<b><span style=\"font-size:14px;\">Salutation/Title</span></b>" + "<ul>" + "	<li>Mr</li>"
			+ "	<li>Mrs</li>" + "	<li>Dr</li>" + " <li>M/S(Only for Institutional customer)</li>" + "</ul>"
			+ "<b><span style=\"font-size:14px;\">CustomerType</span></b>" + "<ul>" + "	<li>REGULAR</li>"
			+ "	<li>INTERNATIONAL</li>" + "	<li>INSTITUTIONAL</li>" + "	<li>ONETIME</li>" + "</ul><br>"
			+ "<b><span style=\"font-size:14px;\">Customer Details Format:</span></b>\r\n" + "<ul>"
			+ "	<li>REGULAR</br></br>" + "<pre>" + "{\r\n" + "    \"type\": \"REGULAR\",\r\n" + "    \"data\": \r\n"
			+ "    {\r\n" + "        \"catchmentName\": \"ERODE\",\r\n" + "    	\"birthday\": \"1990-01-01\",\r\n"
			+ "    	\"spouseBirthday\": \"1992-01-01\",\r\n" + "    	\"anniversary\": \"2016-01-01\",\r\n"
			+ "    	\"canSendSMS\": \"true\",\r\n" + "    	\"isHardCopySubmitted\": \"true\",\r\n"
			+ "    	\"idProof\": \"Other\",\r\n" + "    	\"idNumber\": \"M0993350\",\r\n"
			+ "    	\"altContactNo\": \"9110909090\",\r\n"
			+ "        \"addressLines\": [\"008\", \"DS Max Silicon\", \"RR Layout\", \"RR Nagar\"],\r\n"
			+ "        \"city\": \"Bangalore\",\r\n" + "        \"zone\": \"South\",\r\n"
			+ "        \"state\": \"Karnataka\",\r\n" + "        \"pincode\": \"751024\",\r\n"
			+ "        \"country\": \"India\"\r\n" + "    }\r\n" + "}\r\n" + "</pre></br></br>" + "  </li>"
			+ "  <li>INTERNATIONAL</br></br>" + "<pre>" + "{\r\n" + "    \"type\": \"INTERNATIONAL\",\r\n"
			+ "    \"data\": \r\n" + "    {\r\n" + "        \"isNRI\": false,\r\n"
			+ "    	\"isHardCopySubmitted\": \"true\",\r\n" + "        \"form60\": \"true\",\r\n"
			+ "    	\"idProof\": \"Other\",\r\n" + "    	\"idNumber\": \"M0993350\",\r\n"
			+ "        \"addressLines\": [\"DS Max Silicon\", \"RR Layout, RR Nagar\"],\r\n"
			+ "        \"city\": \"Bangalore\",\r\n" + "        \"state\": \"Karnataka\",\r\n"
			+ "        \"pincode\": \"751024\",\r\n" + "        \"country\": \"India\"\r\n" + "    }\r\n" + "}\r\n"
			+ "</pre></br></br>" + "  </li>" + "  <li>INSTITUTIONAL </br></br>" + "<pre>" + "{\r\n"
			+ "    \"type\": \"INSTITUTIONAL\",\r\n" + "    \"data\": \r\n" + "    {\r\n"
			+ "        \"isIndividualCustomer\": \"true\",\r\n" + "        \"catchmentName\": \"ERODE\",\r\n"
			+ "        \"authorizedName\": \"Tanishq\",\r\n" + "    	\"isHardCopySubmitted\": \"true\",\r\n"
			+ "    	\"idProof\": \"Other\",\r\n" + "    	\"idNumber\": \"M0993350\",\r\n"
			+ "    	\"landlineNumber\": \"080-123456-12345-789\",\r\n"
			+ "        \"addressLines\": [\"Mindtree\", \"Global Village, RR Nagar\"],\r\n"
			+ "        \"city\": \"Bangalore\",\r\n" + "        \"zone\": \"South\",\r\n"
			+ "        \"state\": \"Karnataka\",\r\n" + "        \"pincode\": \"751024\",\r\n"
			+ "        \"country\": \"India\"\r\n" + "    }\r\n" + "}\r\n" + "</pre></br></br>" + "  </li>"
			+ "  <li>ONETIME</br></br>" + "<pre>" + "{\r\n" + "    \"type\": \"ONETIME\",\r\n" + "    \"data\": \r\n"
			+ "    {\r\n" + "        \"catchmentName\": \"ERODE\",\r\n" + "    	\"idProof\": \"Other\",\r\n"
			+ "    	\"idNumber\": \"M0993350\",\r\n"
			+ "        \"addressLines\": [\"Mindtree\", \"Global Village, RR Nagar\"],\r\n"
			+ "        \"city\": \"Bangalore\",\r\n" + "        \"state\": \"Karnataka\",\r\n"
			+ "        \"pincode\": \"751024\",\r\n" + "        \"country\": \"India\"\r\n" + "    }\r\n" + "}\r\n"
			+ "</pre></br></br>" + "  </li>" + "</ul>")
	// @formatter:on
	@PostMapping
	@PreAuthorize(CUSTOMER_ADD_EDIT_PERMISSION)
	public CustomerResDto createCustomer(
			@ApiParam(name = "body", value = "Customer object that needs to be created", required = true) @RequestBody @Valid CustomerAddDto addCustomerDto) {

		return customerService.createCustomer(addCustomerDto);
	}

	/**
	 * This method will update customer details based on customerId.
	 * 
	 * @param customerId
	 * @param updateCustomerDto
	 */
	// @formatter:off
	@ApiOperation(value = "Update customer information", notes = "This API will update customer information based on <b>customerId</b>.<br>"
			+ "And, the same values will be updated in ULP system too.<br><br>"
			+ "<b><span style=\"font-size:14px;\">CustomerType</span></b>" + "<ul>" + "	<li>REGULAR</li>" + "</ul><br>"
			+ "<b><span style=\"font-size:14px;\">Customer Details Format:</span></b>\r\n" + "<ul>"
			+ "	<li>REGULAR</br></br>" + "<pre>" + "{\r\n" + "    \"type\": \"REGULAR\",\r\n" + "    \"data\": \r\n"
			+ "    {\r\n" + "        \"catchmentName\": \"ERODE\",\r\n" + "    	 \"canSendSMS\": \"true\",\r\n"
			+ "        \"addressLines\": [\"008\", \"DS Max Silicon\", \"RR Layout\", \"RR Nagar\"],\r\n"
			+ "        \"city\": \"Bangalore\",\r\n" + "        \"state\": \"Karnataka\",\r\n"
			+ "        \"pincode\": \"751024\",\r\n" + "        \"country\": \"India\",\r\n"
			+ "        \"panHolderName\": \"John\",\r\n"
			+ "        \"zone\": \"South\"\r\n" + "    }\r\n" + "}\r\n" + "</pre></br></br>" + "  </li>" + "</ul>"
			+ "<br>")
	// @formatter:on
	@PatchMapping(value = "/{customerId}")
	@PreAuthorize(CUSTOMER_ADD_EDIT_PERMISSION)
	public CustomerResDto updateCustomer(
			@ApiParam(name = "customerId", value = "'customerId' to edit", required = true) @PathVariable("customerId") @Min(1) Integer customerId,
			@ApiParam(name = "body", value = "Customer object that needs to be edited", required = true) @RequestBody @Valid CustomerUpdateDto updateCustomerDto) {

		return customerService.updateCustomer(customerId, updateCustomerDto);

	}

	// @formatter:off
	@ApiOperation(value = "get customer result for non-uniquee field", notes = "It will search based on non-unique fields & includes unique fields in response.<br>"
			+ "Using this unique field combination, search API based on unique field can be called<br><br>"
			+ "Type of search NAME,EMAIL_ID retrives INTERNATIONAL customer<br>"
			+ "Type of search CUSTOMER_NAME retrives ONETIME customer<br>"
			+ "It will search in EPOSS & send the response.<br>" + "Fallback: search in POSS & give response.")
	// @formatter:on
	@GetMapping("list")
	@PreAuthorize(CUSTOMER_VIEW_PERMISSION)
	public ListResponse<CustomerEpossListSearchDto> listCustomerByNonUniqueFields(
			@ApiParam(value = "Value", required = true) @RequestParam(required = true) @NotNull @Size(max = 100) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "NAME, EMAIL_ID , CUSTOMER_NAME", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = CustNonUniqSearchTypeEnum.class) String searchType) {
		return customerService.searchCustomerListWithFallBack(searchField, searchType);
	}

	@ApiOperation(value = "Api to validate email", notes = "This API is used validate EmailId")
	@GetMapping("/email-validation")
	@PreAuthorize(CUSTOMER_ADD_EDIT_PERMISSION)
	public EmailValidationResponseDto getEmailValidation(
			@ApiParam(value = "emailId", required = true) @RequestParam(name = "emailId", required = true) @PatternCheck(regexp = RegExConstants.EMAIL_REGEX, nullCheck = true) String emailId) {
		return customerService.getEmailValidation(emailId);
	}

	@ApiOperation(value = "API to verify PAN or Form60/IDProof or Form60NRI/IDProof ", notes = "")
	@GetMapping("/verifyPan")
	@PreAuthorize(CUSTOMER_ADD_EDIT_PERMISSION)
	public PanAndForm60ResponseDto verifyPanCard(
			@ApiParam(name = "pancardNo", value = "enter pancard no", required = true) @RequestParam(required = true) String pancardNo,
			@ApiParam(name = "reEnterPancardNo", value = "re enter pancard no", required = true) @RequestParam(required = true) String reEnterPancardNo,
			@ApiParam(name = "verificationType", value = "type of verification", allowableValues = "PAN_CARD", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = VerificationTypeEnum.class) String verificationType) {

		return customerService.verifyPanCard(pancardNo, reEnterPancardNo, verificationType);

	}
	@ApiOperation(value = "API to verify  Form60/IDProof or Form60NRI/IDProof", notes = "This API will update customer id proof details based on: "
			+ "<b><span style=\"font-size:14px;\">SelectedIdProofType/Title</span></b>"
			+ "<br>" + "<ul>" + "	<li><b>Ration Card</b></li>" + "	<li><b>Passport</b></li>"
			+ "	<li><b>Driving License</b></li>" + "	<li><b>Electricity bill)</b></li>"
			+ " <li><b>Telephone bill</b></li>" + " <li><b>Other</b></li>" + "</ul>"
			+ "<b><span style=\"font-size:14px;\">TxnType</span></b>"
			+ "	<li>CM</li>" + "	<li>AB</li>" + " <li>TEP</li>" + " <li>GEP</li>" + " <li>GRF</li> "
			+ " <li>Accept Advance</li>" + " <li>GiftCards</li> ")
	@PostMapping("/verifyForm60")
	@PreAuthorize(CUSTOMER_ADD_EDIT_PERMISSION)
	public ResponseEntity<Void> verifyCustomerIdProof(

			@ApiParam(name = "verificationType", value = "type of verification", allowableValues = "FORM60_IDPROOF, PAN_CARD", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = VerificationTypeEnum.class) String verificationType,
			@ApiParam(name = "selectedIdProofType", value = "type of selected id proof", allowableValues = "Ration Card, Passport, Driving License, Electricity bill, Telephone bill, Other", required = false) @RequestParam(required = false) String selectedIdProofType,
			@ApiParam(name = "isHardcopySubmitted", value = "is hardcopy submitted", required = true) @RequestParam(required = true) Boolean isHardcopySubmitted,
			@ApiParam(name = "matched", value = "matched", required = true) @RequestParam(required = true) Boolean matched,
			@ApiParam(name = "body", value = "Customer object that needs to be created", required = true) @RequestBody @Valid CustomerPanDetails customerPanDetails) {

		customerService.verifyCustomerIdProof(verificationType, selectedIdProofType, isHardcopySubmitted, matched,
				customerPanDetails);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	// @formatter:off
	@ApiPageable
	@ApiOperation(value = "Api to encrypt customer", notes = "This API is used to encrypt customer master table <b>only after migration</b><br>"
			+ "By default API will take 100 records at a time and encrypt it. Returns the count of customer details updated.")
	// @formatter:on
	@GetMapping("/encrypt")
	public Integer encryptCustomerDetails(@ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "false") Boolean isPageable) {
		return customerService.encryptCustomeDetailsByChunk(pageable, isPageable);
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
		@ApiOperation(value = "Api to decrypt customer", notes = "This API is used to decrypt customer master table<b>only after migration</b><br>"
					+ "By default API will take 100 records at a time and decrypt it. Returns the count of customer details updated.")
		// @formatter:on
		@GetMapping("/decryptCustomer")
		public Integer decryptCustomerDetails(@ApiIgnore Pageable pageable,
				@RequestParam(value = "isPageable", required = false, defaultValue = "false") Boolean isPageable) {
			return customerService.decryptCustomeDetailsByChunk(pageable, isPageable);
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