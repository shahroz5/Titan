/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.IssueFocRequestDto;
import com.titan.poss.sales.dto.response.FocIssueResponseDto;
import com.titan.poss.sales.dto.response.FocPendingCMResponseDto;
import com.titan.poss.sales.service.CashMemoFocService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller class for FOC transactions
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@PreAuthorize(IS_STORE_USER)
@Validated
@RestController
@RequestMapping(value = "sales/cash-memo/foc")
public class CashMemoFocController {

	@Autowired
	private CashMemoFocService cashMemoFocService;

	private static final String CASH_MEMO_ADD_EDIT_PERMISSION = START + SalesAccessControls.CASH_MEMO_ADD_EDIT + END;
	private static final String CASH_MEMO_VIEW_PERMISSION = START + SalesAccessControls.CASH_MEMO_VIEW + END;

	/**
	 * This Method will list the FOC pending Cash memos
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param docNo
	 * @param fiscalYear
	 * @param customerId
	 * @return ListResponse<FocPendingCMResponseDto>
	 */
	@ApiPageable
	@GetMapping("/pending")
	@PreAuthorize(CASH_MEMO_VIEW_PERMISSION)
	@ApiOperation(value = "API to list the FOC Pending Cash Memos", notes = "This API will list the Pending FOC Cash Memos with the provided filters")
	public PagedRestResponse<List<FocPendingCMResponseDto>> listFocPendingCMs(
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_CM,MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "docNo", value = "Cash Memo Doc Number", required = false) @RequestParam(name = "docNo", required = false) Integer docNo,
			@ApiParam(name = "fiscalYear", value = "Fiscal year of CM transaction", required = false) @RequestParam(name = "fiscalYear", required = false) Integer fiscalYear,
			@ApiParam(name = "customerId", value = "'customerId' of customer selected", required = false) @RequestParam(name = "customerId", required = false) @Positive Integer customerId,
			@ApiParam(name = "transactionId", value = "'transactionId' of cash memo", required = false) @RequestParam(name = "transactionId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String transactionId,
			@ApiParam(name = "status", value = "'status' of cash memo", required = false) @RequestParam(name = "status", required = false) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiIgnore Pageable pageable) {
		return cashMemoFocService.listFocPendingCMs(txnType, subTxnType, docNo, fiscalYear, customerId, transactionId,
				status, pageable);

	}

	/**
	 * This Method will Issue the Pending FOC items with new Cash memo generated
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param refTxnId
	 * @param issueFocRequestDto
	 * @return FocIssueResponseDto
	 */
	@PostMapping("/items")
	@PreAuthorize(CASH_MEMO_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to Issue Pending FOC items", notes = "This API will Issue the Pending FOC items and creates the new Cash memo for the same.")
	public FocIssueResponseDto issueFocItems(
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "FOC_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "refTxnId", value = "Parent Cash Memo Id", required = true) @RequestParam(name = "refTxnId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String refTxnId,
			@ApiParam(name = "body", value = "'focDetails' object of FOC items selected", required = true) @RequestBody @Valid IssueFocRequestDto issueFocRequestDto) {

		return cashMemoFocService.issueFocItems(txnType, subTxnType, refTxnId, issueFocRequestDto);
	}

}
