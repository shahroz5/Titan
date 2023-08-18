/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Min;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ProfileRegex;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.sales.dto.constants.UploadFileDocTypeEnum;
import com.titan.poss.sales.dto.constants.UploadFileTypeEnum;
import com.titan.poss.sales.dto.request.HallmarkGstRequestDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.FileService;
import com.titan.poss.sales.service.PrintService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Temp Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@ProfileRegex("^[dev|qa|local].*$")
@RestController("salesTempController")
@RequestMapping(value = "sales/v2/temp")
public class TempController {

	@Autowired
	private CommonTransactionService commanTxnService;

	@Autowired
	PrintService printService;

	@Autowired
	FileService fileService;

	@Autowired
	private CustomerService customerService;

	/**
	 * This method is used for testing only.
	 * 
	 * @param customerId
	 * @param itemCode
	 * @param totalValue
	 * @param totalDiscount
	 * @param taxTxnType
	 * @return TotalTaxAndTaxDetailsDto
	 */
	@PostMapping("/tax")
	@ApiOperation(value = "API to get tax detials", notes = "This API will get tax details based on inputs.<br>"
			+ "<b>Note: This API is used ony for testing purpose</b><br>")
	public TotalTaxAndTaxDetailsDto getTotalTaxDetails(
			@ApiParam(name = "customerId", value = "Provide 'customerId'", required = false) @RequestParam(name = "customerId", required = false) Integer customerId,
			@ApiParam(name = "itemCode", value = "Provide 'itemCode'", required = true) @RequestParam(name = "itemCode", required = true) String itemCode,
			@ApiParam(name = "totalValue", value = "Provide 'totalValue'", required = true) @RequestParam(name = "totalValue", required = true) BigDecimal totalValue,
			@ApiParam(name = "totalDiscount", value = "Provide 'totalDiscount'", required = false) @RequestParam(name = "totalDiscount", required = false) BigDecimal totalDiscount,
			@ApiParam(name = "taxTxnType", value = "Provide 'taxTxnType'", allowableValues = "CUST_TRANSACTION_CM,CUST_TRANSACTION_ADV_BOOKING,CUST_TRANSACTION_PRIORITY_ORDER,SERVICE_PAYMENT,TEP_GEP_TANISHQ_EXCHANGE", required = true) @RequestParam(name = "taxTxnType", required = true) @ValueOfEnum(enumClass = TxnTaxTypeEnum.class) String taxTxnType,
			@ApiParam(name = "body", value = "Hallmark object that needs to be checked", required = false) @RequestBody @Valid HallmarkGstRequestDto hallmarkGstRequestDto) {

		return commanTxnService.getTotalTaxDetails(customerId, itemCode, totalValue, totalDiscount,
				TxnTaxTypeEnum.valueOf(taxTxnType), null, hallmarkGstRequestDto);
	}

//	@GetMapping("/print/qr-code")
//	public ResponseEntity<Resource> getQrCodeBase64(@RequestParam String text,
//			@RequestParam(value = "width", required = false, defaultValue = "200") Integer width,
//			@RequestParam(value = "height", required = false, defaultValue = "200") Integer height) {
//		if (height == null)
//			height = 200;
//		if (width == null)
//			width = 200;
//
//		byte[] qrVal = QRCodeGenerator.getQRCodeImage(text, width, height, null);
//
//		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=qr-code.jpg")
//				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(new ByteArrayResource(qrVal));
//	}

	// @formatter:off
	@ApiOperation(value = "API to update temp files to permanent Id", notes = "this API takes temp ")
	// @formatter:on
	@PatchMapping("temp-to-permanent")
	@PreAuthorize(IS_STORE_USER)
	public String updateTempFile(
			@RequestParam(name = "id", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "customerId", value = "provide customerId ", required = false) @RequestParam(value = "customerId", required = false) @Min(1) Integer customerId,
			@RequestParam(required = true) @ApiParam(value = "provide Document Type", allowableValues = "CUSTOMER, GRN, MERGE_GRF", required = true) @ValueOfEnum(enumClass = UploadFileDocTypeEnum.class) String docType,
			@RequestParam(required = true) @ApiParam(value = "provide File Type", allowableValues = "PAN_CARD, OTHERS", required = true) @ValueOfEnum(enumClass = UploadFileTypeEnum.class) String fileType,
			@RequestParam(required = true, value = "tempId") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String tempId) {

		// txnId, customerId
		return fileService.updateTempFile(id, customerId, docType, fileType, tempId);
	}

	@PostMapping("/files/upload-check")
	@PreAuthorize(IS_STORE_USER)
	public Boolean uploadCheck(
			@RequestParam(name = "id", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "customerId", value = "provide customerId ", required = false) @RequestParam(value = "customerId", required = false) @Min(1) Integer customerId,
			@RequestParam(required = true) @ApiParam(value = "provide Document Type", allowableValues = "CM, GEP, CUSTOMER_WORKFLOW, GRN, MERGE_GRF, AB, ADV, GRF, TEP, CN", required = true) @ValueOfEnum(enumClass = UploadFileDocTypeEnum.class) String docType,
			@RequestParam(required = true) @ApiParam(value = "provide File Type", allowableValues = "PAN_CARD, OTHERS", required = true) @ValueOfEnum(enumClass = UploadFileTypeEnum.class) String fileType) {

		return fileService.isAnyFileUploaded(id, customerId, docType, fileType);
	}

	// @formatter:off
	@GetMapping("/ucp-price")
	@ApiOperation(value = "API to get original UCP item price", notes = "This API will get original UCP item price based on inputs.<br>"
			+ "'finalValue' field in response contains original UCP item price(without tax)<br>"
			+ "<b>Note: This API is used ony for testing purpose</b><br>")
	// @formatter:on
	public TotalTaxAndTaxDetailsDto reverseTotalTaxDetails(
			@ApiParam(name = "customerId", value = "Provide 'customerId'", required = false) @RequestParam(name = "customerId", required = false) Integer customerId,
			@ApiParam(name = "itemCode", value = "Provide 'itemCode'", required = true) @RequestParam(name = "itemCode", required = true) String itemCode,
			@ApiParam(name = "finalValue", value = "Provide 'finalValue'", required = true) @RequestParam(name = "finalValue", required = true) BigDecimal finalValue,
			@ApiParam(name = "taxTxnType", value = "Provide 'taxTxnType'", allowableValues = "CUST_TRANSACTION_CM,CUST_TRANSACTION_ADV_BOOKING,CUST_TRANSACTION_PRIORITY_ORDER,SERVICE_PAYMENT,TEP_GEP_TANISHQ_EXCHANGE", required = true) @RequestParam(name = "taxTxnType", required = true) @ValueOfEnum(enumClass = TxnTaxTypeEnum.class) String taxTxnType) {

		return commanTxnService.reverseTotalTaxDetails(customerId, itemCode, finalValue,
				TxnTaxTypeEnum.valueOf(taxTxnType), null);
	}
}
