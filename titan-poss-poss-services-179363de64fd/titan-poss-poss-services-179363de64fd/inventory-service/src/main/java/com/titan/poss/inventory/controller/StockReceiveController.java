/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import static com.titan.poss.inventory.acl.InventoryAccessControls.RECEIVE_FROM_FACTORY;
import static com.titan.poss.inventory.acl.InventoryAccessControls.RECEIVE_FROM_MERCHENDIZE;
import static com.titan.poss.inventory.acl.InventoryAccessControls.RECEIVE_FROM_OTHER_BOUTIQUE;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import com.titan.poss.inventory.dto.ReceivedWeightDto;
import com.titan.poss.inventory.dto.constants.StockReceiveStatusEnum;
import com.titan.poss.inventory.dto.constants.StockReceiveTypeEnum;
import com.titan.poss.inventory.dto.request.ReceiveStockConfirmDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemBulkDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemUpdateDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.ReceiveStockDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;
import com.titan.poss.inventory.facade.StockReceiveFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * The Class StockReceiveController.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@RequestMapping(value = "inventory/v2/stock-receives")
@Validated
public class StockReceiveController {

	@Autowired
	private StockReceiveFacade stockReceiveFacade;

	// @formatter:off
	private static final String STOCK_RECEIVE_PERMISSION = 
			  "hasPermission(#transferType,'FAC_BTQ') AND hasPermission(true,'" + RECEIVE_FROM_FACTORY + "' ) OR "
			+ "hasPermission(#transferType,'BTQ_BTQ') AND hasPermission(true,'" + RECEIVE_FROM_OTHER_BOUTIQUE + "' ) OR "
			+ "hasPermission(#transferType,'MER_BTQ') AND hasPermission(true,'" + RECEIVE_FROM_MERCHENDIZE + "' )";
	// @formatter:on

	/**
	 * Returns list of values with count of StockTransferType where document status
	 * is ISSUED
	 * 
	 * @return - List of Stn Count
	 */

	@ApiOperation(value = "Get the counts of Stock Transfer", notes = "This API will give the counts of Stock Transfer grouped by transfer type <br>"
			+ "It will return the count of Stock Transfers to be inwarded"
			+ "<br>Allowed transfer types are **FAC_BTQ, BTQ_BTQ, MER_BTQ**")
	@GetMapping(value = "/counts")
	@PreAuthorize("hasPermission(true,'" + InventoryAccessControls.RECEIVE_FROM_FACTORY + "  |   "
			+ InventoryAccessControls.RECEIVE_FROM_OTHER_BOUTIQUE + "  |   "
			+ InventoryAccessControls.RECEIVE_FROM_MERCHENDIZE + "' )")
	public ListResponse<InventoryCountDto> getStockReceiveCount() {
		return stockReceiveFacade.getStockReceiveCount(StockReceiveStatusEnum.ISSUED.toString());
	}

	/**
	 * Returns list of StockTransfers with matching request param (srcdocno,
	 * stntype) values, where document status is ISSUED
	 * 
	 * @param srcdocno - srcDocNo of Stn
	 * @param stntype  - stntype of Stn
	 * @param pageable - Pageable support with page, size, sort values as request
	 *                 params
	 * @return - List of Stn
	 */
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = " List Stock Transfers", notes = "This API will return the list of Stock Transfers based on the transfer type<br>"
			+ "<br>Allowed transfer types are **FAC_BTQ, BTQ_BTQ, MER_BTQ**")
	@ApiPageable
	@GetMapping(value = "")
	public PagedRestResponse<List<ReceiveStockDto>> listStockReceive(
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestParam(required = false) Integer srcDocNo, @ApiIgnore Pageable pageable) {
		return stockReceiveFacade.listStockReceive(srcDocNo, transferType, StockReceiveStatusEnum.ISSUED.toString(),
				pageable);
	}	  
	/**
	 * Getting the StockTransfer
	 * 
	 * @param id - id of Stn
	 * @return - ReceiveStockDto - contains stn data
	 */
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = " Get the Stock Transfer by id", notes = "This API returns a Stock Transfer identified by id"
			+ "<br>Allowed transfer types are **FAC_BTQ, BTQ_BTQ, MER_BTQ**")
	@GetMapping(value = "/{id}")
	public ReceiveStockDto getStockReceive(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType) {
		return stockReceiveFacade.getStockReceive(id, transferType);
	}

	/**
	 * get the StockTransfer Item
	 * 
	 * @param id     - id of Stn
	 * @param itemid - id of StnDetail
	 * @return - requested StnDetail item
	 */
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "Get the Stock Transfer item by id", notes = "This Api will return the stock transfer item based on Stock Transfer id and item id "
			+ "<br>Allowed transfer types are **FAC_BTQ, BTQ_BTQ, MER_BTQ**")
	@GetMapping(value = "/{id}/items/{itemId}")
	public ReceiveStockItemDto getStockReceiveItem(@PathVariable Integer id, @PathVariable String itemId,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType) {
		return stockReceiveFacade.getStockReceiveItem(id, itemId, transferType);
	}

	/**
	 * Returns the items in a given id of StockTransfer
	 * 
	 * @param id       - id of Stn
	 * @param pageable - Pageable support with page, size, sort values as request
	 *                 params
	 * @return - List of StnDetail
	 */
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "Get list of items in the Stock Transfer", notes = "Based on the search parameter, this Api will return the list of items within Stock Transfer."
			+ "<br>If nothing is entered it will return all the items inside Stock Transfer"
			+ "<br>Allowed transfer types are **FAC_BTQ, BTQ_BTQ, MER_BTQ**" + "<pre> SortParameters: </pre> "
			+ "<pre> </br> </br>\"StockReceive (FAC_BTQ, BTQ_BTQ, MER_BTQ) \":</br>" + "\t\"issuedQuantity,ASC\",</br>"
			+ "\t\"issuedQuantity,DESC\",</br>" + "\t\"issuedWeight,ASC\",</br>"
			+ "\t\"issuedWeight,DESC\",</br></pre>")
	@ApiPageable
	@GetMapping(value = "/{id}/items")
	public PagedRestResponse<List<ReceiveStockItemDto>> listStockReceiveItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestParam(required = false) @ApiParam(value = "Stock Receive ", allowableValues = "ISSUED,VERIFIED,RECEIVED", required = false) @ValueOfEnum(enumClass = StockReceiveStatusEnum.class) String status,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@ApiIgnore Pageable pageable) {
		return stockReceiveFacade.listStockReceiveItems(id, transferType,
				status == null ? StockReceiveStatusEnum.ISSUED.toString() : status, itemCode, binGroupCode, lotNumber,
				binCode, productGroup, productCategory, pageable);

	}
	
 
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@GetMapping(value = "/{id}/weight")
	public ReceivedWeightDto getTotalReceivedWeight(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "ISSUED,VERIFIED,RECEIVED", required = true) @ValueOfEnum(enumClass = StockReceiveStatusEnum.class) String status,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@ApiIgnore Pageable pageable) {
		
		return stockReceiveFacade.getTotalReceivedWeight(id, transferType, status, itemCode, binGroupCode, lotNumber, binCode, productGroup, productCategory);
		
	}
	
	/**
	 * Updates the StockTransfer Item
	 * 
	 * @param id               - id of Stn
	 * @param itemid           - id of StnDetail
	 * @param stnItemVerifyDto - Details of the Item to verify
	 * @return - Updated StnDetail item
	 */
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "Update Stock Transfer item", notes = "This API will update the specific Stock Transfer item "
			+ "<br>Allowed transfer types are **FAC_BTQ, BTQ_BTQ, MER_BTQ**")
	@PatchMapping(value = "/{id}/items/{itemId}")
	public ReceiveStockItemDto updateStockReceiveItem(@PathVariable Integer id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@RequestBody @Valid ReceiveStockItemUpdateDto receiveStockItemUpdateDto,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType) {
		return stockReceiveFacade.updateStockReceiveItem(id, itemId, receiveStockItemUpdateDto, transferType);
	}

	/**
	 * Returns HTTP Status 200 on Bulk Update of Items,
	 * 
	 * @param id                      - id of Stn
	 * @param receiveStockItemBulkDto - details of Items
	 * 
	 * @return - void
	 */
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "Bulk update Stock Transfer items", notes = "This API takes the list of item IDs and update the status/bin for those items. Maximum items in a list are 50<br>"
			+ "If the list of item IDs is empty it will update status/bin for all items under the Stock Transfer ID.<br>Valid input for status field is 'VERIFIED'"
			+ "<br>Allowed transfer types are **FAC_BTQ, BTQ_BTQ, MER_BTQ**")
	@PatchMapping(value = "/{id}/items")
	public void updateAllStockReceiveItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestBody @Valid ReceiveStockItemBulkDto receiveStockItemBulkDto) {
		stockReceiveFacade.updateAllStockReceiveItems(id, transferType, receiveStockItemBulkDto);
	}

	/**
	 * Confirms the status of StockTransfer
	 * 
	 * @param id            - id of Stn
	 * @param stnConfirmDto - Details to confirm Stn
	 * @return - Updated Stn values
	 */
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "Confirm and inward the Stock", notes = "This API will confirm and inward the Stock and in case of delay, reason for delay is mandatory"
			+ "<br>Allowed transfer types are **FAC_BTQ, BTQ_BTQ, MER_BTQ**")
	@PatchMapping(value = "/{id}")
	public ReceiveStockDto updateStockTransfer(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestBody @Valid ReceiveStockConfirmDto receiveStockConfirmDto) {
		return stockReceiveFacade.updateStockReceive(id, transferType, receiveStockConfirmDto);
	}
	
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "This method will get stn details from Erp", notes = "This method first will check the db for the given stn no, if it is not present, it will get stn details from the ERP system and after validation will return the result")
	@GetMapping(value = "/stn")
	public PagedRestResponse<List<ReceiveStockDto>> getStn(
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestParam(name = "stnNo", required = true) String stnNo) {

		return stockReceiveFacade.getStnFromErp(stnNo, transferType);
	}
}
