/*  
// * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.inventory.acl.InventoryAccessControls.GEP;
import static com.titan.poss.inventory.acl.InventoryAccessControls.ISSUE_TO_BOUTIQUE;
import static com.titan.poss.inventory.acl.InventoryAccessControls.ISSUE_TO_FACTORY_FACTORY_INITIATED_REQUEST;
import static com.titan.poss.inventory.acl.InventoryAccessControls.MERCHENDIZING_INITIATED_STOCK_ISSUE;
import static com.titan.poss.inventory.acl.InventoryAccessControls.RECEIVE_FROM_FACTORY;
import static com.titan.poss.inventory.acl.InventoryAccessControls.RECEIVE_FROM_MERCHENDIZE;
import static com.titan.poss.inventory.acl.InventoryAccessControls.RECEIVE_FROM_OTHER_BOUTIQUE;
import static com.titan.poss.inventory.acl.InventoryAccessControls.TEP_FOR_PLAIN;
import static com.titan.poss.inventory.acl.InventoryAccessControls.TEP_FOR_STUDDED;
import static com.titan.poss.inventory.acl.InventoryAccessControls.TEP_FOR_GOLD_COIN;
import static com.titan.poss.inventory.acl.InventoryAccessControls.BTQ_CFA;
import static com.titan.poss.inventory.acl.InventoryAccessControls.DEFECTIVE;
import static com.titan.poss.inventory.acl.InventoryAccessControls.DIRECT_TRANSFER;

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
import org.springframework.web.bind.annotation.PutMapping;
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
import com.titan.poss.inventory.dto.constants.StockIssueRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.StockIssueRequestTypeStatusEnum;
import com.titan.poss.inventory.dto.constants.StockIssueTransferTypeEnum;
import com.titan.poss.inventory.dto.constants.StockIssueTransferTypeStatusEnum;
import com.titan.poss.inventory.dto.constants.StockReceiveStatusEnum;
import com.titan.poss.inventory.dto.constants.StockReceiveTypeEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferTypeEnum;
import com.titan.poss.inventory.dto.request.IssueStockItemBulkDto;
import com.titan.poss.inventory.dto.request.IssueStockItemUpdateDto;
import com.titan.poss.inventory.dto.request.RemoveStockItemsDto;
import com.titan.poss.inventory.dto.request.StnCancelDto;
import com.titan.poss.inventory.dto.request.StockIssueCancelDto;
import com.titan.poss.inventory.dto.request.StockIssueItemDto;
import com.titan.poss.inventory.dto.request.StockIssueStockConfirmDto;
import com.titan.poss.inventory.dto.request.StockIssueTransferConfirmDto;
import com.titan.poss.inventory.dto.request.StockTransferCancelDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.IssueStockDto;
import com.titan.poss.inventory.dto.response.IssueStockItemDto;
import com.titan.poss.inventory.dto.response.ReceiveStockDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;
import com.titan.poss.inventory.facade.StockIssueFacade;
import com.titan.poss.inventory.facade.StockReceiveFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * API's for stock issue
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated // (for requestParam and Url param testing)
//if this is not added then DB will throw SQLGrammer Exception and spring will throw org.springframework.dao.InvalidDataAccessResourceUsageException which is handled anyhow in ControllerAdvice
@RequestMapping(value = "inventory/v2/stock-issues")
public class StockIssueController {

	@Autowired
	StockIssueFacade stockIssueFacade;

	@Autowired
	private StockReceiveFacade stockReceiveFacade;

	// @formatter:off
	private static final String STOCK_ISSUE_REQUEST_TYPE_PERMISSION = "hasPermission(#requestType,'BTQ')" + AND + START
			+ ISSUE_TO_BOUTIQUE + END + OR + "hasPermission(#requestType,'FAC')" + AND + START
			+ ISSUE_TO_FACTORY_FACTORY_INITIATED_REQUEST + END + OR + "hasPermission(#requestType,'MER')" + AND + START
			+ MERCHENDIZING_INITIATED_STOCK_ISSUE + END;

	private static final String STOCK_ISSUE_TRANSFER_TYPE_PERMISSION = "hasPermission(#transferType,'TEP_STUDDED')"
			+ AND + START + TEP_FOR_STUDDED + END + OR + "hasPermission(#transferType,'TEP_GOLD_COIN')"
					+ AND + START + TEP_FOR_GOLD_COIN + END + OR + "hasPermission(#transferType,'TEP_PLAIN')" + AND + START
			+ TEP_FOR_PLAIN + END + OR + "hasPermission(#transferType,'GEP')" + AND + START + GEP + END + OR 
			+ "hasPermission(#transferType,'BTQ_CFA')" + AND + START + BTQ_CFA + END + OR 
			+ "hasPermission(#transferType,'DEFECTIVE')" + AND + START + DEFECTIVE + END + OR
			+ "hasPermission(#transferType,'BTQ_BTQ')" + AND + START + DIRECT_TRANSFER + END;
	
	private static final String STOCK_RECEIVE_PERMISSION = 
			  "hasPermission(#transferType,'FAC_BTQ') AND hasPermission(true,'" + RECEIVE_FROM_FACTORY + "' ) OR "
			+ "hasPermission(#transferType,'BTQ_BTQ') AND hasPermission(true,'" + RECEIVE_FROM_OTHER_BOUTIQUE + "' ) OR "
			+ "hasPermission(#transferType,'MER_BTQ') AND hasPermission(true,'" + RECEIVE_FROM_MERCHENDIZE + "' )";
	// @formatter:on

	/**
	 * Returns list of values with count of StockRequestType where document status
	 * is APPROVED
	 * 
	 * @return - List of Request Count
	 */
	@ApiOperation(value = "Gives the Count of APPROVED stock request Type", notes = "This API works for counts of APPROVED stockRequest for particular stock request type  **i.e BTQ, FAC and MER**")
	@GetMapping(value = "request/counts")
	@PreAuthorize(START + ISSUE_TO_BOUTIQUE + OR + ISSUE_TO_FACTORY_FACTORY_INITIATED_REQUEST + OR
			+ MERCHENDIZING_INITIATED_STOCK_ISSUE + END)
	public ListResponse<InventoryCountDto> getStockRequestCount() {
		return stockIssueFacade.getStockRequestCount();
	}

	/**
	 * Returns list of StockRequests with matching request param (reqDocNo,
	 * requestType) values, where document status is APPROVED
	 * 
	 * @param reqDocNo    - request doc number of Stock Request
	 * @param requestType - request type (FAC,BTQ) of stock request
	 * @param pageable    - Pageable support with page, size, sort values as request
	 *                    params
	 * @return - List of Stock requests
	 */
	@ApiPageable
	@GetMapping(value = "/request")
	@ApiOperation(value = "Listing stockRequest for particular transfer type", notes = "This API works for Listing stockRequest for particular stock request type **i.e BTQ, FAC and MER**"
			+ "</br> This API also allows search for reqDocNo")
	@PreAuthorize(STOCK_ISSUE_REQUEST_TYPE_PERMISSION)
	public PagedRestResponse<List<IssueStockDto>> listStockRequests(@RequestParam(required = false) Integer reqDocNo,
			@RequestParam(required = true) @ApiParam(value = "Stock Issue Request ", required = true, allowableValues = "BTQ,FAC,MER") @ValueOfEnum(enumClass = StockIssueRequestTypeEnum.class) String requestType,
			@ApiIgnore Pageable pageable) {
		return stockIssueFacade.listStockRequests(reqDocNo, requestType != null ? requestType : null, pageable);
	}

	/**
	 * 
	 * @param id- stock request id
	 * @return stock request details
	 */

	@GetMapping(value = "request/{id}")
	@PreAuthorize(STOCK_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Listing Stock Request of requested Id for stock request types", notes = "This API returns Stock Request of requested Id for stock request types **i.e BTQ, FAC and MER**")
	public IssueStockDto getStockRequest(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Issue Request ", allowableValues = "BTQ,FAC,MER") @ValueOfEnum(enumClass = StockIssueRequestTypeEnum.class) String requestType) {
		return stockIssueFacade.getStockRequest(id, requestType);
	}

	/**
	 * Returns the items in a given id of StockRequest
	 * 
	 * @param id       - id of Stock Request
	 * @param pageable - Pageable support with page, size, sort values as request
	 *                 params
	 * @return - List of StockRequestDetail
	 */
	@ApiPageable
	@GetMapping(value = "/request/{id}/items")
	@PreAuthorize(STOCK_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Listing Items for the stockRequest id for stock request types", notes = "Listing Items for the stockRequest id for stock request types  **i.e BTQ, FAC and MER**"
			+ "</br>This API also allows to filter the searched result on respective of available params"

			+ "<pre> SortParameters: </pre> "

			+ "<pre> </br> </br>\"StockIssue (BTQ,FAC,MER)\":</br>" + "\t\"approvedQuantity,ASC\",</br>"
			+ "\t\"approvedQuantity,DESC\"\",</br>" + "\t\"requestedWeight,DESC\",</br>"
			+ "\t\"requestedWeight,ASC\"\",</br></pre>"

	)
	public PagedRestResponse<List<RequestStockItemResponseDto>> listStockRequestItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Issue Request ", allowableValues = "BTQ,FAC,MER") @ValueOfEnum(enumClass = StockIssueRequestTypeEnum.class) String requestType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @ApiParam(required = false, value = "Stock Issue Request Status ", allowableValues = "APPROVED,SELECTED,APVL_PENDING") @ValueOfEnum(enumClass = StockIssueRequestTypeStatusEnum.class) String status,
			@ApiIgnore Pageable pageable) {
		return stockIssueFacade.listStockRequestItems(id, requestType, itemCode, productGroup, productCategory,
				lotNumber, binCode, binGroupCode, status != null ? status : null, pageable);
	}

	/**
	 * Returns the items in a given id of StockRequest
	 * 
	 * @param id       - id of Stock Request
	 * @param pageable - Pageable support with page, size, sort values as request
	 *                 params
	 * @return - List of StockRequestDetail
	 */
	@ApiPageable
	@GetMapping(value = "/transfer/{id}/items")
	@PreAuthorize(STOCK_ISSUE_TRANSFER_TYPE_PERMISSION)
	@ApiOperation(value = "List Stock transfer Items for the stockTransfer id", notes = "API works for stock transfer types i.e **TEP_PLAIN,TEP_STUDDED,GEP,COINS**"
			+ "</br>This API also allows to filter the searched result on respective of available params"
			+ "<pre> SortParameters: </pre> "

			+ "<pre> </br> </br>\"StockIssue (Transfer) (TEP,GEP,COINS,GOLD COINS)\":</br>"
			+ "\t\"availableQuantity,ASC\",</br>" + "\t\"availableQuantity,DESC\"\",</br>"
			+ "\t\"availableWeight,ASC\",</br>" + "\t\"availableWeight,DESC\",</br>"
			+ "\t\"inwardDate,ASC\",</br>" + "\t\"inwardDate,DESC\",</br></pre>")
	public PagedRestResponse<List<IssueStockItemDto>> listStockTransferItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Issue Request ", allowableValues = "TEP_STUDDED,TEP_PLAIN,GEP,COIN,BTQ_CFA,TEP_GOLD_COIN,DEFECTIVE,BTQ_BTQ") @ValueOfEnum(enumClass = StockIssueTransferTypeEnum.class) String transferType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @ApiParam(required = false, value = "Stock Transfer Status ", allowableValues = "OPEN, SELECTED, ISSUED") @ValueOfEnum(enumClass = StockIssueTransferTypeStatusEnum.class) String status,
			@RequestParam(required = false)  String cfaLocationCode,
			@ApiIgnore Pageable pageable) {
		return stockIssueFacade.listStockTransferItems(id, transferType, itemCode, productGroup, productCategory,
				lotNumber, binCode, binGroupCode, status != null ? status : null,cfaLocationCode, pageable);
	}

	/**
	 * 
	 * @param id      - stock request id
	 * @param itemId- stock request details id
	 * @return an item from stock request details
	 */
	@GetMapping(value = "request/{id}/items/{itemId}")
	@PreAuthorize(STOCK_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Fetch Stock Request Item for requested Id and itemId", notes = "This API gets Stock Request Item of requested Id and itemId for stock request types **i.e BTQ, FAC and MER**")
	public RequestStockItemResponseDto getStockRequestItem(
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "BTQ,FAC,MER") @ValueOfEnum(enumClass = StockIssueRequestTypeEnum.class) String requestType,
			@PathVariable Integer id, @PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId) {
		return stockIssueFacade.getStockRequestItem(requestType, id, itemId);
	}

	/**
	 * 
	 * @param id      - stock request id
	 * @param itemId- stock request details id
	 * @return an item from stock request details
	 */
	@GetMapping(value = "transfer/{id}/items/{itemId}")
	@PreAuthorize(STOCK_ISSUE_TRANSFER_TYPE_PERMISSION)
	@ApiOperation(value = "Fetch Stock Transfer Item by transfer Id and itemId", notes = "This API gets item of stock transfer Id for types i.e **TEP_PLAIN,TEP_STUDDED,GEP,COINS**")
	public IssueStockItemDto getStockTransferItem(
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "TEP_STUDDED,TEP_PLAIN,GEP,COIN") @ValueOfEnum(enumClass = StockIssueTransferTypeEnum.class) String transferType,
			@PathVariable Integer id, @PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId) {
		return stockIssueFacade.getStockTransferItem(transferType, id, itemId);
	}

	/**
	 * Updates the StockRequest Item
	 * 
	 * @param id                      - id of StockRequest
	 * @param itemid                  - id of StockRequestDetail item
	 * @param issueStockItemUpdateDto - Details of the Item to update
	 * @return - Updated StockRequestDetail item
	 */
	@PatchMapping(value = "request/{id}/items/{itemId}")
	@PreAuthorize(STOCK_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Updating Line ITEM for stock request types", notes = "This Api updates the particular Item's Weight, Quantity, Status. </br>This method is used  for stock request types **i.e BTQ, FAC and MER**"
			+ "</br>Status Can be SELECTED(It is selcted for Issue ) and APPROVED(Default, to unselect change to APPROVED)")
	public RequestStockItemResponseDto updateStockRequestItem(@PathVariable Integer id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "BTQ,FAC,MER") @ValueOfEnum(enumClass = StockIssueRequestTypeEnum.class) String requestType,
			@Valid @RequestBody IssueStockItemUpdateDto issueStockItemUpdateDto) {

		return stockIssueFacade.updateStockRequestItem(id, itemId, requestType, issueStockItemUpdateDto);
	}

	/**
	 * Confirms the status of StockRequest
	 * 
	 * @param id                     - id of StockRequest
	 * @param stockRequestConfirmDto - Details to confirm StockRequest
	 * @return - Updated StockRequest values
	 */
	@PostMapping(value = "request/{id}")
	@PreAuthorize(STOCK_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Confirming Request for stock request types", notes = "This Api updates Status and confirms the Request for stock request types **i.e BTQ, FAC and MER**"
			+ "</br>Accepts Different types of Carrier Details in different request type"
			+ "</br>status will be changed from SELECTED to ISSUED")
	public ReceiveStockDto confirmStockRequest(
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", required = true, allowableValues = "BTQ,FAC,MER") @ValueOfEnum(enumClass = StockIssueRequestTypeEnum.class) String requestType,
			@PathVariable Integer id, @Valid @RequestBody StockIssueStockConfirmDto stockIssueStockConfirmDto) {
		return stockIssueFacade.confirmStockRequest(id, requestType, stockIssueStockConfirmDto);
	}

	/**
	 * Confirms the status of StockRequest
	 * 
	 * @param id                     - id of StockRequest
	 * @param stockRequestConfirmDto - Details to confirm StockRequest
	 * @return - Updated StockRequest values
	 */
	@PostMapping(value = "transfer/{id}")
	@PreAuthorize(STOCK_ISSUE_TRANSFER_TYPE_PERMISSION)
	@ApiOperation(value = "Confirming transfer for stock transfer type", notes = "This Api updates Staus and confirms the transfer for stock transfer types i.e **TEP_PLAIN,TEP_STUDDED,GEP,COINS,BTQ_CFA**"
			+ "</br>Accepts Different types of Carrier Details in different TransferType"
			+ "</br>srcDocNo is generated and is part of response")
	public ReceiveStockDto confirmStockTransfer(
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "TEP_STUDDED,TEP_PLAIN,GEP,COIN,BTQ_CFA,BTQ_BTQ") @ValueOfEnum(enumClass = StockIssueTransferTypeEnum.class) String transferType,
			@PathVariable Integer id, @Valid @RequestBody StockIssueTransferConfirmDto stockTransferConfirmDto) {

		return stockIssueFacade.confirmStockTransfer(id, transferType, stockTransferConfirmDto);
	}

	/**
	 * Bulk Update of items w.r.t particular stockId
	 * 
	 * @return - Created StockIssue Response
	 */
	@PatchMapping("request/{id}/items")	@PreAuthorize(STOCK_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Updating Bulk request Items", notes = "This Api updates the List of request Items for stock request types **i.e BTQ, FAC and MER**. "
			+ "</br>Status Can be SELECTED(It is selcted for Issue) and APPROVED(Default, to unselect change to APPROVED)"
			+ "</br>**Bulk Update:**<ol><li>**All:**In case of All, itemIds will be null.</li><li>**Multi:**For multi update give all itemIds in list(Max **50** is allowed)</li></ol>")
	public void updateAllStockIssueItems(@PathVariable(required = true) Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "BTQ,FAC,MER") @ValueOfEnum(enumClass = StockIssueRequestTypeEnum.class) String requestType,
			@Valid @RequestBody IssueStockItemBulkDto issueStockItemBulkDto) {

		stockIssueFacade.updateAllStockIssueRequestItems(id, requestType, issueStockItemBulkDto);
	}

	/**
	 * Create the header level for TEP/GEP/COIN ISSUE
	 * 
	 * @return - Created StockIssue Response
	 */
	@PostMapping(value = "transfer")
	@PreAuthorize(STOCK_ISSUE_TRANSFER_TYPE_PERMISSION)
	@ApiOperation(value = "Creating a StockIssue for particular stock transfer type", notes = "This API creates STN for stock transfer types  i.e **TEP_PLAIN,TEP_STUDDED,GEP,COINS** "
			+ " and returns a StockTransferId")
	public ReceiveStockDto createStockIssue(
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "TEP_STUDDED,TEP_PLAIN,GEP,COIN,BTQ_CFA,TEP_GOLD_COIN,DEFECTIVE,BTQ_BTQ") @ValueOfEnum(enumClass = StockIssueTransferTypeEnum.class) String transferType) {
		return stockIssueFacade.createStockIssue(transferType);
	}
	
	/**
	 * Get the header level for TEP/GEP/COIN ISSUE
	 * 
	 * @return - Get StockIssue Response
	 */
	@GetMapping(value = "transfer/{id}/detail")
	@PreAuthorize(STOCK_ISSUE_TRANSFER_TYPE_PERMISSION)
	@ApiOperation(value = "Api to get header level details for TEP/GEP/COIN ISSUE", notes = "This API creates STN for stock transfer types  i.e **TEP_PLAIN,TEP_STUDDED,GEP,COINS** "
			+ " and returns a StockTransferId")
	public ReceiveStockDto getStockIssueDetail(@PathVariable(required = true) Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "TEP_STUDDED,TEP_PLAIN,GEP,COIN,BTQ_CFA,TEP_GOLD_COIN,DEFECTIVE,BTQ_BTQ") @ValueOfEnum(enumClass = StockIssueTransferTypeEnum.class) String transferType) {
		return stockIssueFacade.getStockIssueDetail(id,transferType,StockTransferStatusEnum.SELECTED.toString());
	}
	
	

	@PostMapping(value = "transfer/{id}/items")
	@PreAuthorize(STOCK_ISSUE_TRANSFER_TYPE_PERMISSION)
	@ApiOperation(value = "Creating a StockIssue of items for generated STN ID  for particular stock transfer type", notes = "This API creates StockIssue of items for generated STN ID for stock transfer types  i.e **TEP_PLAIN,TEP_STUDDED,GEP,COINS**"
			+ "</br>**Bulk Create**<ol><li>**All:**In case of All, stockItems will be [] empty, Will move all from given bin to issue list</li><li>**Multi:**For multi create give all stockItems in list(Max **50** is allowed), will be moved selected items to issue list</li></ol>")
	public void createStockIssueItem(@PathVariable(required = true) Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "TEP_STUDDED,TEP_PLAIN,GEP,COIN,BTQ_CFA,TEP_GOLD_COIN,BTQ_BTQ") @ValueOfEnum(enumClass = StockIssueTransferTypeEnum.class) String transferType,
			@Valid @RequestBody StockIssueItemDto stockIssueItemDto) {

		stockIssueFacade.createStockIssueItems(id, transferType, stockIssueItemDto);
	}

	/**
	 * Delete a Invoice Item
	 * 
	 * @param id     - stockTransferId of Stock
	 * @param itemid - id of StockTransferDetailId
	 * @return - remove TransferDetail item
	 */
	@PutMapping(value = "transfer/{id}/items")
	@PreAuthorize(STOCK_ISSUE_TRANSFER_TYPE_PERMISSION)
	@ApiOperation(value = "Removes items w.r.t transfer type by id ", notes = "Removes items w.r.t Id Passed of particular stock transfer Type i.e **TEP_PLAIN,TEP_STUDDED,GEP,COINS**"
			+ "</br>**Bulk Update:**<ol><li>**All:**In case of All, itemIds will be [] empty</li><li>**Multi:**For multi removal give all itemIds in list(Max **50** is allowed)</li></ol>")
	public void removeStockTransferItem(@PathVariable(required = true) Integer id,
			@RequestBody @Valid RemoveStockItemsDto removeStockItemDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "TEP_STUDDED,TEP_PLAIN,GEP,COIN,TEP_GOLD_COIN,BTQ_BTQ") @ValueOfEnum(enumClass = StockIssueTransferTypeEnum.class) String transferType) {

		stockIssueFacade.removeStockIssue(id, removeStockItemDto, transferType);

	}

	@GetMapping("request/{id}/print")
	public ResponseEntity<Resource> getTransferPDF(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "TEP_STUDDED,TEP_PLAIN,GEP,TEP_GOLD_COIN,BTQ_CFA,DEFECTIVE,BTQ_BTQ") @ValueOfEnum(enumClass = StockIssueTransferTypeEnum.class) String stockIssueTransferType) {

		return stockIssueFacade.getStockTransferIssuePDF(id, stockIssueTransferType);
	}

	@GetMapping("request/{id}/prints")
	public ResponseEntity<Resource> getRequestPDFImp(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Transfer ", allowableValues = "FAC_BTQ,BTQ_FAC,BTQ_BTQ,MER_BTQ,TEP_PLAIN,TEP_STUDDED,GEP,FOC") @ValueOfEnum(enumClass = StockTransferTypeEnum.class) String stockIssueRequestType) {
		return stockIssueFacade.getStockRequestIssuePDF(id, stockIssueRequestType);

	}

	@ApiOperation(value = "Update status before issuing out items", notes = "This Api updates status as **ISSUE_REJECTED** and issue type should be **BTQ_BTQ**"
			+ "</br>Accepts status only **ISSUE_REJECTED**")
	// @PreAuthorize(STOCK_ISSUE_REQUEST_TYPE_PERMISSION)
	@PatchMapping("request/{id}")
	public void updateStockRequest(@PathVariable(required = true) Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Transfer ", allowableValues = "BTQ,FAC,MER") @ValueOfEnum(enumClass = StockIssueRequestTypeEnum.class) String requestType,
			@RequestBody @Valid StockIssueCancelDto stockIssueCancelDto) {

		stockIssueFacade.updateStockRequest(id, stockIssueCancelDto, requestType);
	}

	@ApiOperation(value = "Update status after issuing out items", notes = "This Api updates status as **CNCL_APVL_PENDING** and issue type should be **BTQ_BTQ**"
			+ "</br>Accepts status only **CNCL_APVL_PENDING**")
	@PatchMapping("transfer/{id}")
	public void updateStockTransfer(@PathVariable(required = true) Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ") @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestBody @Valid StockTransferCancelDto stockTransferCancelDto) {

		stockIssueFacade.updateStockTransfer(id, transferType, stockTransferCancelDto);
	}

	@GetMapping(value = "transfer/cancelstn")
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiPageable
	@ApiOperation(value = "list STN for cancellation", notes = "This API lists IBT STN eligible for cancellation.")
	public PagedRestResponse<List<ReceiveStockDto>> listStockReceiveStnCancel(
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "BTQ_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestParam(required = false) Integer srcDocNo, @ApiIgnore Pageable pageable) {
		return stockReceiveFacade.listStockReceiveStnCancel(srcDocNo, transferType,
				StockReceiveStatusEnum.ISSUED.toString(), pageable);
	}

	@GetMapping(value = "transfer/cancelstn/count")
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "list STN for cancellation count", notes = "This API lists count for IBT STN eligible for cancellation.")
	public StnCancelDto listStockReceiveStnCancelCount(
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "BTQ_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType) {
		return stockReceiveFacade.listStockReceiveStnCancelCount(transferType,
				StockReceiveStatusEnum.ISSUED.toString());
	}

	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "Cancel the STN", notes = "This API will cancel STN"
			+ "<br>Allowed transfer types are **BTQ_BTQ**")
	@PatchMapping(value = "transfer/cancelstn/{id}")
	public ReceiveStockDto cancelStockTransfer(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive", allowableValues = "BTQ_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestBody @Valid StnCancelDto stnCancelDto) {
		return stockReceiveFacade.cancelStockReceive(id, transferType, stnCancelDto);
	}

	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "Get list of Cancel items in the Stock Transfer", notes = "Based on the search parameter, this Api will return the list of items within Stock Transfer."
			+ "<br>If nothing is entered it will return all the items inside Stock Transfer"
			+ "<br>Allowed transfer types are **BTQ_BTQ**")
	@ApiPageable
	@GetMapping(value = "transfer/cancelstn/{id}/items")
	public PagedRestResponse<List<ReceiveStockItemDto>> listStockReceiveStnCancelItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive", allowableValues = "BTQ_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@ApiIgnore Pageable pageable) {
		return stockReceiveFacade.listCancelStockReceiveItems(id, transferType,
				StockReceiveStatusEnum.ISSUED.toString(), itemCode, binGroupCode, lotNumber, binCode, productGroup,
				productCategory, pageable);

	}

	@GetMapping(value = "transfer/cancelstn/{id}")
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	@ApiOperation(value = "Data by id for IBT STN eligible for cancellation", notes = "This API lists data of IBT STN eligible for cancellation **i.e BTQ_BTQ**")
	public ReceiveStockDto listDataStnCancelItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "BTQ_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType) {
		return stockReceiveFacade.getStockReceiveStnCancel(id, StockReceiveStatusEnum.ISSUED.toString(), transferType);
	}
	
	
	

}
