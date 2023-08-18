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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.FocDetailRequestDto;
import com.titan.poss.sales.dto.response.FocItemResponseDto;
import com.titan.poss.sales.service.CashMemoFocItemService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller class for FOC items of Cash Memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@PreAuthorize(IS_STORE_USER)
@Validated
@RestController("salesCashMemoFOCItemController")
@RequestMapping(value = "sales/v2/cash-memos/{id}/foc-items")
public class CashMemoFocItemController {

	@Autowired
	private CashMemoFocItemService cashMemoFocItemService;

	private static final String CASH_MEMO_ADD_EDIT_PERMISSION = START + SalesAccessControls.CASH_MEMO_ADD_EDIT + END;
	private static final String CASH_MEMO_VIEW_PERMISSION = START + SalesAccessControls.CASH_MEMO_VIEW + END;
	private static final String CASH_MEMO_DELETE_PERMISSION = START + SalesAccessControls.CASH_MEMO_DELETE + END;

	/**
	 * This method will add FOC items to Cash Memo
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param focDetails
	 * @return ListResponse<FocItemResponseDto>
	 */
	@PostMapping
	@PreAuthorize(CASH_MEMO_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to add FOC item to Cash Memo", notes = "This API will add the applicable FOC items to Cash memo.<br>"
			+ "Request body consists of two sections<br>"
			+ "1.<b>focScheme</b> : It consists of the applicable scheme details against which FOC item has been selected.<br>"
			+ "2.<b>focItems</b> : List of FOC items selected under the scheme")
	public ListResponse<FocItemResponseDto> addFOCItemToCM(
			@ApiParam(name = "id", value = "'id' of the Cash Memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_CM,MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'focDetails' object need to be added to Cash Memo", required = true) @RequestBody @Valid FocDetailRequestDto focDetails) {

		return cashMemoFocItemService.addFOCItemToCM(id, txnType, subTxnType, focDetails);

	}

	@PostMapping("/add-manual-foc")
	@PreAuthorize(CASH_MEMO_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to add Manual FOC item to Cash Memo", notes = "This API will add the applicable Manual FOC items to Cash memo.<br>"
			+ "Request body consists of two sections<br>"
			+ "1.<b>focScheme</b> : It consists of the applicable scheme details against which FOC item has been selected.<br>"
			+ "2.<b>focItems</b> : List of FOC items selected under the scheme")
	public ListResponse<FocItemResponseDto> addManualFOCItemToCM(
			@ApiParam(name = "id", value = "'id' of the Cash Memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_CM,MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@RequestParam(name ="manualFocStartDate", required = false) String manualFocStartDate,
			@RequestParam(name ="manualFocEndDate", required = false) String manualFocEndDate,
			@RequestParam(name ="approvedBy", required = false) String approvedBy,
			@ApiParam(name = "body", value = "'focDetails' object need to be added to Cash Memo", required = true) @RequestBody @Valid FocDetailRequestDto focDetails) {

		return cashMemoFocItemService.addManualFOCItemToCM(id, txnType, subTxnType, focDetails, manualFocStartDate,
				manualFocEndDate, approvedBy);

	}

	/**
	 * This method will list the FOC items added to Cash Memo
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return ListResponse<FocItemResponseDto>
	 */
	@GetMapping
	@PreAuthorize(CASH_MEMO_VIEW_PERMISSION)
	@ApiOperation(value = "API to list the FOC items of Cash Memo", notes = "This API will list all the FOC items added to Cash memo")
	public ListResponse<FocItemResponseDto> listFocItemsOfCM(
			@ApiParam(name = "id", value = "'id' of the Cash Memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_CM,MANUAL_CM,NEW_AB,MANUAL_AB,FOC_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return cashMemoFocItemService.listFocItemsOfCM(id, txnType, subTxnType);

	}

	/**
	 * This method will list the FOC items added to Cash Memo
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return ListResponse<FocItemResponseDto>
	 */
	@GetMapping("/get-manual-foc")
	@PreAuthorize(CASH_MEMO_VIEW_PERMISSION)
	@ApiOperation(value = "API to list the Manual FOC items of Cash Memo", notes = "This API will list all the Manual FOC items added to Cash memo")
	public ListResponse<FocItemResponseDto> listManualFocItemsOfCM(
			@ApiParam(name = "id", value = "'id' of the Cash Memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_CM,MANUAL_CM,NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return cashMemoFocItemService.listManualFocItemsOfCM(id, txnType, subTxnType);

	}

	@DeleteMapping
	@PreAuthorize(CASH_MEMO_DELETE_PERMISSION)
	@ApiOperation(value = "API to remove or delete FOC items from cash Memo", notes = "This API will delete all the FOC items added to Cash memo "
			+ "And FOC schemes applied to Cash Memo by Cash Memo Id")
	public void deleteFocItemFromCM(
			@ApiParam(name = "id", value = "'id' of the Cash Memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_CM,MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		cashMemoFocItemService.deleteFocItemFromCM(id, txnType, subTxnType);

	}

}
