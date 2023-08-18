/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.response.TransactionDetailsDto;
import com.titan.poss.sales.dto.response.TransactionStatusCountDto;
import com.titan.poss.sales.service.TransactionService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Transaction Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("salesTransactionController")
@RequestMapping(value = "sales/v2/transactions")
public class TransactionController {

	@Autowired
	private TransactionService transactionService;

	// @formatter:off
	private static final String TRANSACTION_VIEW_PERMISSION = IS_STORE_USER + AND 
			+ "(" + START + SalesAccessControls.CASH_MEMO_VIEW + END + OR 
			+ START + SalesAccessControls.ADVANCE_BOOKING_VIEW + END + OR
			+ START + SalesAccessControls.ACCEPT_ADVANCE_VIEW + END + OR
			+ START + SalesAccessControls.GRF_VIEW + END + OR
			+ START + SalesAccessControls.GEP_VIEW + END + OR
			+ START + SalesAccessControls.TEP_VIEW + END + OR
			+ START + SalesAccessControls.CUSTOMER_ORDER_VIEW + END + ")";
	// @formatter:off
	
	/**
	 * This method will return the count of transaction based on status.
	 * 
	 * @param txnType
	 * @param status
	 * @param subTxnType
	 * @return ListResponse<TransactionStatusCountDto>
	 */
	@ApiOperation(value = "API to get count of transactions", notes = "This API will list count of transactions based on status provided.")
	@GetMapping("/counts")
	@PreAuthorize(TRANSACTION_VIEW_PERMISSION)
	public ListResponse<TransactionStatusCountDto> getCountOfTransaction(
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'transaction type'", allowableValues = "CM, AB, ADV, GEP, TEP,CO", required = false) @RequestParam(name = "txnType", required = false) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "status", value = "Provide to search by 'transaction status'", allowableValues = "HOLD, CONFIRMED, OPEN, CANCELLATION_PENDING, CANCELLED, DELETED, APPROVAL_PENDING, EXPIRED, SUSPENDED,\r\n"
					+ "	ACTIVATION_PENDING, CLOSED", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE,NEW_AB,\r\n"
					+ "	MANUAL_AB, NEW_GEP, MANUAL_GEP, NON_FROZEN_RATES, FROZEN_RATES, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,NEW_CO,MANUAL_CO", required = false) @RequestParam(name = "subTxnType", required = false) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		return transactionService.getCountOfTransaction(txnType, status, subTxnType);
	}

	/**
	 * This method will return transaction details.
	 * 
	 * @param txnType
	 * @param docNo
	 * @param customerName
	 * @param status
	 * @param subTxnType
	 * @param pageable
	 * @return PagedRestResponse<List<TransactionDetailsDto>>
	 */
	@ApiPageable
	@ApiOperation(value = "API to get transactions details", notes = "This API will give transaction details based on status provided.")
	@GetMapping("")
	@PreAuthorize(TRANSACTION_VIEW_PERMISSION)
	public PagedRestResponse<List<TransactionDetailsDto>> getTransactionDetails(
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'transaction type'", allowableValues = "CM, AB, ADV, GEP, TEP, CO", required = false) @RequestParam(name = "txnType", required = false) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "docNo", value = "Provide if you want to search by 'doc number'", required = false) @RequestParam(name = "docNo", required = false) @Min(1) Integer docNo,
			@ApiParam(name = "fiscalYear", value = "Provide if you want to search by 'fiscal Year'", required = false) @RequestParam(name = "fiscalYear", required = false) @Positive Short fiscalYear,
			@ApiParam(name = "customerName", value = "Provide if you want to search by 'customer name'", required = false) @RequestParam(name = "customerName", required = false) @Size(min = 1, max = 50) @PatternCheck(regexp = RegExConstants.NAME_REGEX) String customerName,
			@ApiParam(name = "mobileNumber", value = "Provide if you want to search by 'mobile number'", required = false) @RequestParam(name = "mobileNumber", required = false) @PatternCheck(regexp = RegExConstants.TELE_MOBILE_NO_REGEX) String mobileNumber,
			@ApiParam(name = "status", value = "Provide to search by 'transaction status'", allowableValues = "HOLD, CONFIRMED, OPEN, CANCELLATION_PENDING, CANCELLED, DELETED, APPROVAL_PENDING, EXPIRED, SUSPENDED,\r\n"
					+ "	ACTIVATION_PENDING, CLOSED, RESIDUAL_CLOSURE, PARTIAL_INVOICE, DELIVERED, RELEASED", required = false) @RequestParam(name = "status", required = false) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE, NEW_GEP, MANUAL_GEP, NON_FROZEN_RATES, FROZEN_RATES,NEW_AB,MANUAL_AB,NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,NEW_CO,MANUAL_CO", required = false) @RequestParam(name = "subTxnType", required = false) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiIgnore Pageable pageable) {

		return transactionService.getTransactionDetails(txnType, docNo, fiscalYear, customerName, mobileNumber, status,
				subTxnType, pageable);

	}

}
