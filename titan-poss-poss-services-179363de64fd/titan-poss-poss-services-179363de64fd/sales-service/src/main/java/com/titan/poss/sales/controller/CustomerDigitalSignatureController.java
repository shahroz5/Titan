package com.titan.poss.sales.controller;


import javax.validation.Valid;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.sales.dto.DigitalSignatureResponseDto;
import com.titan.poss.sales.dto.constants.CustomerTypeEnum;
import com.titan.poss.sales.dto.request.CustomerDigitalSignatureRequestDto;
import com.titan.poss.sales.dto.response.CustomerDigitalSignatureResponseDto;
import com.titan.poss.sales.dto.response.CustomerSearchDto;
import com.titan.poss.sales.service.CustomerDigitalSignatureService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController("customerDigitalSignatureController")
@RequestMapping("sales/v2/digital-signature")
public class CustomerDigitalSignatureController {

	
	private static final String CUSTOMER_VIEW_PERMISSION = START + SalesAccessControls.CUSTOMER_SIGNATURE_VIEW + END;
	private static final String CUSTOMER_ADD_EDIT_PERMISSION = START + SalesAccessControls.CUSTOMER_SIGNATURE_ADD_EDIT + END;
	
	@Autowired
	private CustomerDigitalSignatureService customerDigitalSignatureService;
	
	@PreAuthorize(CUSTOMER_VIEW_PERMISSION)
	@ApiOperation(value = "Search customer by unique searchable fields", notes = "This API will give customer digital signature details based on: " 
			+ "<br>"
			+ "<ul>"
			+ "	<li><b>MOBILE_NO OR ULP_ID</b></li>"
			+ "</ul>"
			+ "<br> Each of them are tagged to specific customer type. <br>"
			+ "It can give 1 result or error \"Record not found.\".<br><br>")
	@GetMapping("/newCustomerDetails")
	public List<DigitalSignatureResponseDto> getCustomerDetails(
			@ApiParam(value = "mobileNumber", required = false) @PatternCheck(regexp = RegExConstants.MOBILE_REGEX) @RequestParam(required = false) @NotNull @Size(max = 100) String mobileNumber,
			@ApiParam(value = "ulpNumber", required = false) @PatternCheck(regexp = RegExConstants.ULP_ID_REGEX) @RequestParam(required = false) @NotNull @Size(max = 100) String ulpNumber) {
		return customerDigitalSignatureService.getCustomerData(mobileNumber, ulpNumber);
	}


	@PreAuthorize(CUSTOMER_VIEW_PERMISSION)
	@ApiOperation(value = "Search customer by unique searchable fields", notes = "This API will give customer digital signature details based on: " 
			+ "<br>"
			+ "<ul>"
			+ "	<li><b>MOBILE_NO OR ULP_ID</b></li>"
			+ "</ul>"
			+ "<br> Each of them are tagged to specific customer type. <br>"
			+ "It can give 1 result or error \"Record not found.\".<br><br>")
	@GetMapping("")
	public List<DigitalSignatureResponseDto> getDigitalSignatureDetails(
			@ApiParam(value = "mobileNumber", required = false) @PatternCheck(regexp = RegExConstants.MOBILE_REGEX) @RequestParam(required = false) @NotNull @Size(max = 100) String mobileNumber,
			@ApiParam(value = "ulpNumber", required = false) @PatternCheck(regexp = RegExConstants.ULP_ID_REGEX) @RequestParam(required = false) @NotNull @Size(max = 100) String ulpNumber,
			@ApiParam(value = "Type of Customer", allowableValues = "REGULAR, INTERNATIONAL, INSTITUTIONAL", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = CustomerTypeEnum.class) String customerType) {
		return customerDigitalSignatureService.getCustomerDigitalSignatureData(mobileNumber, ulpNumber,customerType);
	}

	@ApiOperation(value = "Upload Customer Details", notes = "This api will save the customer details in the table<br>"
			
			+ "<b><span style=\"font-size:14px;\">Applicable Transaction Types Format:</span></b>\r\n" + 
			"<ul>" +
			 "	<li>APPLICABLE_TRANSACTION_TYPES</br></br>" +
					"<pre>" + 
					"{\r\n" + 
					"    \"type\": \"APPLICABLE_TRANSACTION_TYPES\",\r\n" + 
					"    \"data\": \r\n" + 
					"    {\r\n" + 
					"        \"isAdvanceOrderOrBooking\": \"false\",\r\n" + 			
					"    	\"isCashMemo\": \"false\",\r\n" + 
					"    	\"isGHS\": \"false\",\r\n" + 
					"    	\"isAcceptAdvance\": \"false\",\r\n" + 
					"    	\"isGRN\": \"false\",\r\n" + 
					"    	\"isGRF\": \"false\",\r\n" + 
					"    	\"isGiftCard\": \"false\",\r\n" + 
					"    	\"isCNCancellation\": \"false\",\r\n" + 
					"    	\"isTEPDeclarationAndExchangeForm\": \"false\",\r\n" + 
					"        \"isGEPDeclarationAndExchangeForm\": \"false\",\r\n" + 
					"        \"isCCAFRequestServicePaymentOrCustomerOrder\": \"false\",\r\n" + 
					"    }\r\n" + 
					"}\r\n" + 
					"</pre></br></br>" +
			"  </li>" +
			"</ul>"	
			)
	@PreAuthorize(CUSTOMER_ADD_EDIT_PERMISSION)
	@PostMapping("")
	public DigitalSignatureResponseDto saveDigitalSignature(
			@ApiParam(value="digital Signature") 
			@RequestBody(required = true) @Valid CustomerDigitalSignatureRequestDto customerDigitalSignatureRequestDto
			) {
		return customerDigitalSignatureService.saveCustomerSignature(customerDigitalSignatureRequestDto);
	}
	
	@PreAuthorize(CUSTOMER_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Upload Digital Signature", notes = "This api will upload the digital signature in the table")
	@PostMapping("/upload/{mobileNumber}")
	public DigitalSignatureResponseDto uploadFile(
			@PathVariable(value = "mobileNumber") String mobileNumber,
			@ApiParam(value="digital Signature")@RequestBody(required = false)  String digitalSignature,
			@ApiParam(value = "Type of Customer", allowableValues = "REGULAR, INTERNATIONAL, INSTITUTIONAL", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = CustomerTypeEnum.class) String customerType) {
		return customerDigitalSignatureService.uploadFile(digitalSignature, mobileNumber,customerType);
	}
	
}
