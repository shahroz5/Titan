/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;

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
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.FocPendingRequestDto;
import com.titan.poss.sales.dto.response.FocPendingResponseDto;
import com.titan.poss.sales.dto.response.FocSchemeListResponseDto;
import com.titan.poss.sales.service.CashMemoFocSchemeService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller class for FOC schemes applicable in Cash Memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@PreAuthorize(IS_STORE_USER)
@RestController
@RequestMapping(value = "sales/v2/cash-memo/{id}/foc-schemes")
public class CashMemoFocSchemeControlller {

	@Autowired
	private CashMemoFocSchemeService cashMemoFocSchemeService;

	private static final String CASH_MEMO_ADD_EDIT_PERMISSION = START + SalesAccessControls.CASH_MEMO_ADD_EDIT + END;
	private static final String CASH_MEMO_VIEW_PERMISSION = START + SalesAccessControls.CASH_MEMO_VIEW + END;

	/**
	 * This method will Update the cash memo as FOC pending
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param focSchemes
	 * @return FocPendingResponseDto
	 */
	@PostMapping
	@PreAuthorize(CASH_MEMO_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to update the Cash Memo as FOC Pending", notes = "This API will accept applicable focScheme details to keep Cash Memo with Pending FOC")
	public FocPendingResponseDto createPendingFocForCM(
			@ApiParam(name = "id", value = "'id' of the Cash Memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_CM,MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'focSchemes' object need to be linked to CM", required = true) @RequestBody @Valid FocPendingRequestDto focSchemes) {
		return cashMemoFocSchemeService.createPendingFocForCM(id, txnType, subTxnType, focSchemes);
	}

	/**
	 * This method will list the FOC schemes linked to a Cash memo
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return FocSchemeListResponseDto
	 */
	// @formatter:off
	@GetMapping
	@PreAuthorize(CASH_MEMO_VIEW_PERMISSION)
	@ApiOperation(value = "API to list the FOC schemes added to Cash Memo to Issue the Pending FOC", notes = "This API will list the FOC schemes applicable in Cash Memo to Issue the Pending FOC"
			+ "<ul>"
			+"<li>" 
			+	"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/FocSchemeConfigDetails.json/\">"
			+	" FOC Scheme Config Details"
			+	"</a>"
			+	"</br></br>" 
			+"</li>" 
			+"</ul>")
	// @formatter:on
	public FocSchemeListResponseDto listFocSchemesOfCM(
			@ApiParam(name = "id", value = "'id' of the Cash Memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_CM,MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		return cashMemoFocSchemeService.listFocSchemesOfCM(id, txnType, subTxnType);
	}

}
