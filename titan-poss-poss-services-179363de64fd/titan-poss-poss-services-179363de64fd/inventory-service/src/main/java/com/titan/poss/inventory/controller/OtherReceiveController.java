/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
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
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.acl.InventoryAccessControls;
import com.titan.poss.inventory.dto.constants.OtherIssueRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.OtherReceiveStatusEnum;
import com.titan.poss.inventory.dto.constants.OtherReceiveTypeAdjPsvEnum;
import com.titan.poss.inventory.dto.constants.OtherReceiveTypeEnum;
import com.titan.poss.inventory.dto.request.OtherReceiveItemBulkDto;
import com.titan.poss.inventory.dto.request.OtherReceiveStockConfirmDto;
import com.titan.poss.inventory.dto.request.OtherReceiveStockCreateDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemUpdateDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.OtherReceiveStockDto;
import com.titan.poss.inventory.dto.response.OtherReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;
import com.titan.poss.inventory.facade.OtherIssueFacade;
import com.titan.poss.inventory.facade.OtherReceiveFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@RestController
@RequestMapping(value = "inventory/v2/other-receives")
@Validated
public class OtherReceiveController {

	@Autowired
	private OtherReceiveFacade otherReceiveFacade;

	@Autowired
	OtherIssueFacade otherIssueFacade;

	private static final String OTHER_RECEIVE_PERMISSION_LOAN_EXH = "hasPermission(#transactionType,'EXH') AND hasPermission(true,'"
			+ InventoryAccessControls.OTHER_RECEIPTS_EXHIBITION + "' ) OR "
			+ "hasPermission(#transactionType,'LOAN') AND hasPermission(true,'"
			+ InventoryAccessControls.OTHER_RECEIPTS_LOAN + "' )";

	private static final String OTHER_RECEIVE_PERMISSION_ADJ_PSV = "hasPermission(#transactionType,'ADJ') AND hasPermission(true,'"
			+ InventoryAccessControls.OTHER_RECEIPTS_ADJUSTMENTS + "' ) OR "
			+ "hasPermission(#transactionType,'PSV') AND hasPermission(true,'"
			+ InventoryAccessControls.OTHER_RECEIPTS_PSV + "' )";

	/**
	 * Returns list of values with count of Other Receive Type where document status
	 * is ISSUED
	 * 
	 * @return - List of Other Receive Count
	 */

	@ApiOperation(value = "Get the counts of Other Stocks to Receives", notes = "This API will give the counts of Other Stocks to Receive by Transaction type <br>"
			+ "It will return the count of  Other Stocks to be inwarded. Other Receives are of type EXH and LOAN")
	@GetMapping(value = "/counts")
	@PreAuthorize("hasPermission(true,'" + InventoryAccessControls.OTHER_RECEIPTS_EXHIBITION + "  |   "
			+ InventoryAccessControls.OTHER_RECEIPTS_LOAN + "' )")
	public ListResponse<InventoryCountDto> getOtherReceiveCount() {
		return otherReceiveFacade.getOtherReceiveCount(OtherReceiveStatusEnum.ISSUED.toString());
	}

	/**
	 * Returns list of Other Receives with matching request param (srcdocno,
	 * stntype) values, where document status is ISSUED
	 * 
	 * @param srcdocno        - srcDocNo of stock transaction
	 * @param transactionType - transactionType of staock transaction
	 * @param pageable        - Pageable support with page, size, sort values as
	 *                        request params
	 * @return - List of Other Receives
	 */
	@PreAuthorize(OTHER_RECEIVE_PERMISSION_LOAN_EXH)
	@ApiOperation(value = " List Other receives", notes = "This API will return the list of Other receives  based on the Transaction type<br>"
			+ "<br>Allowed transaction types are **LOAN, EXH**")
	@ApiPageable
	@GetMapping(value = "")
	public PagedRestResponse<List<OtherReceiveStockDto>> listOtherReceive(
			@RequestParam(required = true) @ApiParam(required = true, value = "Other receive type", allowableValues = "EXH,LOAN") @ValueOfEnum(enumClass = OtherReceiveTypeEnum.class) String transactionType,
			@RequestParam(required = false) Integer srcDocNo, @ApiIgnore Pageable pageable) {
		return otherReceiveFacade.listOtherReceive(srcDocNo, transactionType, OtherReceiveStatusEnum.ISSUED.toString(),
				pageable);
	}

	@PreAuthorize(OTHER_RECEIVE_PERMISSION_LOAN_EXH)
	@ApiOperation(value = " Get the Other stock recives by id", notes = "This API returns a Stock Transfer identified by id"
			+ "<br>Allowed transaction types are **LOAN, EXH**")
	@GetMapping(value = "/{id}")
	public OtherReceiveStockDto getOtherReceive(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other receive type", allowableValues = "EXH,LOAN") @ValueOfEnum(enumClass = OtherReceiveTypeEnum.class) String transactionType) {
		return otherReceiveFacade.getOtherReceive(id, transactionType);
	}

	@PreAuthorize(OTHER_RECEIVE_PERMISSION_LOAN_EXH)
	@ApiOperation(value = "Get the Other Stock Receive item by id", notes = "This Api will return the stock transfer item based on Other Stock Receive id and item id "
			+ "<br>Allowed transaction types are **LOAN, EXH**")
	@GetMapping(value = "/{id}/items/{itemId}")
	public OtherReceiveStockItemDto getOtherReceiveItem(@PathVariable Integer id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other receive type", allowableValues = "EXH,LOAN") @ValueOfEnum(enumClass = OtherReceiveTypeEnum.class) String transactionType) {
		return otherReceiveFacade.getOtherReceiveItem(id, itemId, transactionType);
	}

	@PreAuthorize(OTHER_RECEIVE_PERMISSION_LOAN_EXH)
	@ApiOperation(value = "Get list of items in the Other Stock Receive", notes = "Based on the search parameter, this Api will return the list of items within Other Stock Receive."
			+ "<br>If nothing is entered it will return all the items inside Other Stock Receive"
			+ "<br>Allowed transaction types are **LOAN, EXH**" + "<pre> SortParameters: </pre> "

			+ "<pre> </br> </br>\"OtherReceive (LOAN,EXH)\":</br>" + "\t\"issuedQuantity,ASC\",</br>"
			+ "\t\"issuedQuantity,DESC\",</br>" + "\t\"issuedWeight,ASC\",</br>" + "\t\"issuedWeight,DESC\",</br></pre>"

	)
	@ApiPageable
	@GetMapping(value = "/{id}/items")
	public PagedRestResponse<List<OtherReceiveStockItemDto>> listOtherReceiveItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other receive type", allowableValues = "EXH, LOAN") @ValueOfEnum(enumClass = OtherReceiveTypeEnum.class) String transactionType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@RequestParam(required = false) @ApiParam(required = false, value = "Other receive status", allowableValues = "ISSUED,VERIFIED,RECEIVED") @ValueOfEnum(enumClass = OtherReceiveStatusEnum.class) String status,
			@ApiIgnore Pageable pageable) {
		return otherReceiveFacade.listOtherReceiveItems(id, transactionType, itemCode, binGroupCode, lotNumber, binCode,
				productGroup, productCategory, status != null ? status : null, pageable);
	}

	@PreAuthorize(OTHER_RECEIVE_PERMISSION_LOAN_EXH)
	@ApiOperation(value = "Update Other Stock Receive item", notes = "This API will update the specific Other Stock Receive item "
			+ "<br>Allowed transaction types are **LOAN, EXH**")
	@PatchMapping(value = "/{id}/items/{itemId}")
	public ReceiveStockItemDto updateOtherReceiveItem(@PathVariable Integer id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@RequestBody @Valid ReceiveStockItemUpdateDto receiveStockItemUpdateDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other receive type", allowableValues = "EXH,LOAN") @ValueOfEnum(enumClass = OtherReceiveTypeEnum.class) String transactionType) {
		return otherReceiveFacade.updateOtherReceiveItem(id, itemId, receiveStockItemUpdateDto, transactionType);
	}

	@PreAuthorize(OTHER_RECEIVE_PERMISSION_LOAN_EXH)
	@ApiOperation(value = "Bulk update Other Receive items", notes = "This API takes the list of item IDs and update the status/bin for those items. Maximum items in a list are 50<br>"
			+ "If the list of item IDs is empty it will update status/bin for all items under the Stock Transfer ID.<br>Valid input for status field is 'VERIFIED'"
			+ "<br>Allowed transaction types are **LOAN, EXH**")
	@PatchMapping(value = "/{id}/items")
	public void updateAllOtherReceiveItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other receive type", allowableValues = "EXH,LOAN") @ValueOfEnum(enumClass = OtherReceiveTypeEnum.class) String transactionType,
			@RequestBody @Valid OtherReceiveItemBulkDto otherReceiveStockItemBulkDto) {
		otherReceiveFacade.updateAllOtherReceiveItems(id, transactionType, otherReceiveStockItemBulkDto);
	}

	/**
	 * Confirms the status of StockTransfer
	 * 
	 * @param id            - id of Stn
	 * @param stnConfirmDto - Details to confirm Stn
	 * @return - Updated Stn values
	 */
	@PreAuthorize(OTHER_RECEIVE_PERMISSION_LOAN_EXH)
	@ApiOperation(value = "Confirm and inward the Other Stocks", notes = "This API will confirm and inward the Stock "
			+ "<br>Allowed transaction types are **LOAN, EXH**")
	@PatchMapping(value = "/{id}")
	public OtherReceiveStockDto updateStockTransaction(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other receive type", allowableValues = "EXH,LOAN") @ValueOfEnum(enumClass = OtherReceiveTypeEnum.class) String transactionType,
			@RequestBody @Valid OtherReceiveStockConfirmDto otherReceiveStockConfirmDto) {
		return otherReceiveFacade.updateOtherReceive(id, transactionType, otherReceiveStockConfirmDto);
	}

	@PreAuthorize(OTHER_RECEIVE_PERMISSION_ADJ_PSV)
	@ApiOperation(value = "API to create STN item", notes = "This API will create the STN item<br>It will create items only for "
			+ " ADJ and PSV")
	@PostMapping(value = "")
	public OtherReceiveStockDto createStockReceiveItems(
			@RequestParam(required = true) @ApiParam(required = true, value = "Other receive type", allowableValues = "ADJ,PSV") @ValueOfEnum(enumClass = OtherReceiveTypeAdjPsvEnum.class) String transactionType,
			@RequestBody @Valid OtherReceiveStockCreateDto otherReceiveStockCreateDto) {
		return otherReceiveFacade.createStockReceiveItems(transactionType, otherReceiveStockCreateDto);
	}

	@GetMapping("request/{id}/prints")
	public ResponseEntity<Resource> getOtherIssuePDFImp(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Receive/Receipt ", allowableValues = "EXH,LOAN,ADJ,PSV") @ValueOfEnum(enumClass = OtherIssueRequestTypeEnum.class) String otherReciveType) {
		return otherIssueFacade.getOtherIssuePDF(id, otherReciveType, "Receive");
	}
}
