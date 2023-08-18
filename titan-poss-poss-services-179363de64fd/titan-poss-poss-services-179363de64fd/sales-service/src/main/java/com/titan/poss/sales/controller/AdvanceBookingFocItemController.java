/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import java.util.List;

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

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.FocDetailAbDto;
import com.titan.poss.sales.dto.FocSchemesAbCreateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.service.AdvBookingFocItemService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@PreAuthorize(IS_STORE_USER)
@Validated
@RestController
@RequestMapping(value = "sales/v2/advance-booking")
public class AdvanceBookingFocItemController {

	@Autowired
	private AdvBookingFocItemService advBookingFocItemService;

	/**
	 * This method will add FOC items to Cash Memo
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param focDetails
	 * @return ListResponse<FocItemResponseDto>
	 */
	@PostMapping("/{id}/foc-items")
	@ApiOperation(value = "API to add FOC scheme details", notes = "This API will add the applicable FOC scheme detail.<br>"
			+ "Request body consists of two sections<br>"
			+ "1.<b>focScheme</b> : It consists of the applicable scheme details against which FOC item has been selected.<br>"
			+ "2.<b>focItems</b> : List of FOC items selected under the scheme")
	public List<FocSchemesAbCreateDto> addFOCItemToCM(
			@ApiParam(name = "id", value = "'id' of the Cash Memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'focDetails' object need to be added to Cash Memo", required = true) @RequestBody @Valid FocDetailAbDto focDetails) {

		return advBookingFocItemService.addFocDetails(id, txnType, subTxnType, focDetails);

	}

	/**
	 * This method will list the FOC items added to Cash Memo
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return ListResponse<FocItemResponseDto>
	 */
	@GetMapping("/{id}/foc-items")
	@ApiOperation(value = "API to list the FOC schemes applicable to purchased varients", notes = "This API will list the FOC schemes applicable to purchased varients")
	public ListResponse<FocSchemesAbCreateDto> listFocItemsOfCM(
			@ApiParam(name = "id", value = "'id' of the advance booking", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return advBookingFocItemService.getFocDetails(id, txnType, subTxnType);

	}

	@DeleteMapping(value = "/foc-items")
	@ApiOperation(value = "API to remove or delete FOC items from cash Memo", notes = "This API will delete all the FOC items added to Cash memo "
			+ "And FOC schemes applied to Cash Memo by Cash Memo Id")
	public void deleteFocItemFromCM(@RequestParam(required = false) String id,
			@RequestParam(required = false) List<String> focSchemeId,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub transaction type", allowableValues = " NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		advBookingFocItemService.deleteFocItemFromCM(id, focSchemeId, txnType, subTxnType);

	}

}
