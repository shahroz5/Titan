/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.BIT_OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.inventory.acl.InventoryAccessControls.REQUEST_IBT_REQUESTS_RECEIVED;
import static com.titan.poss.inventory.acl.InventoryAccessControls.REQUEST_IBT_REQUESTS_SENT;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
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
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.inventory.dto.constants.RequestGroupEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.StockRequestTypeEnum;
import com.titan.poss.inventory.dto.request.ComStockRequestDto;
import com.titan.poss.inventory.dto.request.StockRequestCreateDto;
import com.titan.poss.inventory.dto.request.StockRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.StockRequestUpdateDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.StockRequestDto;
import com.titan.poss.inventory.dto.response.StockRequestItemDto;
import com.titan.poss.inventory.facade.StockRequestFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for Inter Boutique Stock request management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping(value = "inventory/v2/stock-requests")
public class StockRequestController {

	@Autowired
	StockRequestFacade stockRequestFacade;

	// @formatter:off
	private static final String STOCK_REQUEST_SENT_AND_RECEIVED_PERMISSION = "hasPermission(#requestGroup,'SENT') AND hasPermission(true,'"
			+ REQUEST_IBT_REQUESTS_SENT + "' )" + " OR "
			+ "hasPermission(#requestGroup,'RECEIVED') AND hasPermission(true,'" + REQUEST_IBT_REQUESTS_RECEIVED
			+ "' )";
	private static final String STOCK_REQUEST_SENT_PERMISSION = START + REQUEST_IBT_REQUESTS_SENT + END;
	private static final String STOCK_REQUEST_RECEIVED_PERMISSION = START + REQUEST_IBT_REQUESTS_RECEIVED + END;
	// @formatter:on

	/**
	 * To get the count of stock requests sent and received
	 * 
	 * @return - count of IBT stock requests (SENT and RECEIVED)
	 */
	@PreAuthorize(START + REQUEST_IBT_REQUESTS_SENT + BIT_OR + REQUEST_IBT_REQUESTS_RECEIVED + END)
	@GetMapping(value = "/counts")
	@ApiOperation(value = "This API will Provide the count of stock requests for Inter Boutique Transfer(BTQ) grouped by SENT and RECEIVED by the Boutique", notes = "Gives the count of stock requests for stock request type i.e **BTQ**")
	public ListResponse<InventoryCountDto> getStockRequestCount() {
		return stockRequestFacade.getStockRequestCount();
	}

	/**
	 * To list the details of the stock requests made
	 * 
	 * @param requestType - can be BTQ
	 * @param groupBy     - can be SENT or RECEIVED
	 * @param pageable    - Pageable support with page, size, sort values as request
	 *                    params
	 * @return - list of stock requests
	 */
	@ApiPageable
	@PreAuthorize(STOCK_REQUEST_SENT_AND_RECEIVED_PERMISSION)
	@GetMapping(value = "")
	@ApiOperation(value = "Lists all the stock requests for Inter Boutique Transfer(BTQ) group by SENT or RECEIVED by the Boutique", notes = "Lists all the stock requests for **Inter Boutique Transfer(BTQ)** group by **SENT** or **RECEIVED** by the Boutique"
			+ "</br>Stock request type i.e  **BTQ** will be the mandatory parameter"
			+ "</br>And **requestGroup** **SENT or RECEIVED** will be the mandatory parameter then returns the request list grouped by SENT and RECEIVED with respect to IBT"
			+ "</br>with the status in **REQUESTED,ACCEPTED,ACPT_REJECTED,APVL_PENDING,APPROVED,ISSUED,CANCELLED,EXPIRED** "
			+ "</br>Filter by **reqDocNo,status,srcLocationCode(In case of SENT Requests),reqLocationCode(Incase of RECEIVED Requests)** are optional parameters")
	public PagedRestResponse<List<StockRequestDto>> listStockRequests(
			@RequestParam(required = true, name = "requestType") @ApiParam(value = "Stock Request Type", allowableValues = "BTQ", required = true) @ValueOfEnum(enumClass = StockRequestTypeEnum.class) String requestType,
			@RequestParam(required = true, name = "requestGroup") @ApiParam(value = "Provide 'SENT' if you want to list sent requests, else 'RECEIVED' to list the request received ", allowableValues = "SENT,RECEIVED", required = true) @ValueOfEnum(enumClass = RequestGroupEnum.class) String requestGroup,
			@RequestParam(required = false, name = "reqDocNo") @Positive Integer reqDocNo,
			@RequestParam(required = false, name = "status") @ApiParam(value = "Stock Request Status", allowableValues = "REQUESTED,ACCEPTED,ACPT_REJECTED,APVL_PENDING,APPROVED,APVL_REJECTED,ISSUE_REJECTED,ISSUED,CANCELLED,EXPIRED", required = false) @ValueOfEnum(enumClass = StockRequestStatusEnum.class) String status,
			@RequestParam(required = false, name = "srcLocationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String srcLocationCode,
			@RequestParam(required = false, name = "reqLocationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String reqLocationCode,
			@SortDefault(sort = "createdDate", direction = Sort.Direction.DESC) @ApiIgnore Pageable pageable) {
		return stockRequestFacade.listStockRequests(requestType, requestGroup, reqDocNo, status != null ? status : null,
				srcLocationCode, reqLocationCode, pageable);

	}

	/**
	 * To get the details of particular stock request
	 * 
	 * @param id          - request id
	 * @param requestType - can be BTQ
	 * @param groupBy     - can be SENT,RECEIVED
	 *
	 * @return - Get the particular Stock request
	 * 
	 */
	@PreAuthorize(STOCK_REQUEST_SENT_AND_RECEIVED_PERMISSION)
	@ApiPageable
	@GetMapping(value = "/{id}")
	@ApiOperation(value = "Returns the Stock Request Details of particular request id and requestType of Inter Boutique transfer", notes = "Returns the Stock Request Details of particular request **id** and the applicable **requestType** i.e **BTQ(Inter boutique transfer)**"
			+ "</br>And **requestGroup** **SENT or RECEIVED** will be the mandatory parameter")
	public StockRequestDto getStockRequest(@PathVariable @Positive Integer id,
			@RequestParam(required = true, name = "requestType") @ApiParam(value = "Request Type", allowableValues = "BTQ", required = true) @ValueOfEnum(enumClass = StockRequestTypeEnum.class) String requestType,
			@RequestParam(required = true, name = "requestGroup") @ApiParam(value = "Provide 'SENT' if you want to get sent request, else 'RECEIVED' to get the request received ", allowableValues = "SENT,RECEIVED", required = true) @ValueOfEnum(enumClass = RequestGroupEnum.class) String requestGroup) {
		return stockRequestFacade.getStockRequest(id, requestType, requestGroup);
	}

	/**
	 * To get item level details of the stock request made
	 * 
	 * @param id          - stock request id
	 * @param requestType - can be BTQ
	 * @param pageable
	 * @return - list of stock request item details
	 */
	@PreAuthorize(STOCK_REQUEST_SENT_AND_RECEIVED_PERMISSION)
	@ApiPageable
	@GetMapping(value = "/{id}/items")
	@ApiOperation(value = "Lists the Item level details of the particular Inter Boutique stock Request", notes = "List the requested items with item details of particaular stock request **id** for **requestType** i.e **BTQ(Inter boutique transfer)**"
			+ "</br>And also provides the current available quantity of each item in the inventory of a issuer boutique"
			+ "</br>And **requestGroup** **SENT or RECEIVED** will be the mandatory parameter"
			+ "</br>This API also allows to filter the searched result on respective of available params"

			+ "<pre> SortParameters: </pre> "

			+ "<pre> </br> </br>\"StockRequest (Request) (IBT) \":</br>" + "\t\"requestedQuantity,DESC\",</br>"
			+ "\t\"requestedQuantity,ASC\",</br>" + "\t\"requestedWeight,DESC\",</br>"
			+ "\t\"requestedWeight,ASC\",</br></pre>"

	)
	public PagedRestResponse<List<StockRequestItemDto>> listStockRequestItems(@PathVariable @Positive Integer id,
			@RequestParam(required = true, name = "requestType") @ApiParam(value = "Stock Request Type", allowableValues = "BTQ", required = true) @ValueOfEnum(enumClass = StockRequestTypeEnum.class) String requestType,
			@RequestParam(required = true, name = "requestGroup") @ApiParam(value = "Provide 'SENT' if you want to get sent request items, else 'RECEIVED' to list the items of request received ", allowableValues = "SENT,RECEIVED", required = true) @ValueOfEnum(enumClass = RequestGroupEnum.class) String requestGroup,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroup,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String productCategory,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_REGEX) String binCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @ApiParam(value = "Stock Request Status", allowableValues = "REQUESTED,ACCEPTED,ACPT_REJECTED,APVL_PENDING,APPROVED,APVL_REJECTED,ISSUE_REJECTED,ISSUED,CANCELLED,EXPIRED", required = false) @ValueOfEnum(enumClass = StockRequestStatusEnum.class) String status,
			@ApiIgnore Pageable pageable) {

		return stockRequestFacade.listStockRequestItems(id, requestType, requestGroup, itemCode, productGroup,
				productCategory, lotNumber, binCode, binGroupCode, status != null ? status : null, pageable);
	}

	/**
	 * To submit stock request to other boutique location
	 * 
	 * @param requestStockDto - stock request details like items,remarks,item
	 *                        available location code
	 * @param bindingResult
	 * @return - new request details with request doc no generated
	 */
	@PreAuthorize(STOCK_REQUEST_SENT_PERMISSION)
	@PostMapping(value = "")
	@ApiOperation(value = "Creates the stock Request for Inter Boutique Transfer(IBT)", notes = "Creates the stock requests by taking request parameters from the requesting boutique"
			+ "</br> with the Request Document Number generated"
			+ "</br>requested **itemCode,quantity & srcLocationCode(Issuer location)** are mandatory parameters")
	public StockRequestDto createStockRequest(
			@RequestParam(required = true, name = "requestType") @ApiParam(value = "Stock Request Type", allowableValues = "BTQ", required = true) @ValueOfEnum(enumClass = StockRequestTypeEnum.class) String requestType,
			@RequestBody @Valid StockRequestCreateDto requestStockCreateDto) {
		return stockRequestFacade.createStockRequest(requestType, requestStockCreateDto);
	}

	/**
	 * To update the stock request item details at the acceptance stage.
	 * 
	 * @param id            - stock request id
	 * @param itemid        - item id at stock request detail table
	 * @param acceptItemDto - updated changes at acceptance like acceptedQuantity
	 * @param status        - update status of an item
	 * @return - updated stock request item details
	 */
	@PreAuthorize(STOCK_REQUEST_RECEIVED_PERMISSION)
	@PatchMapping(value = "/{id}/items/{itemId}")
	@ApiOperation(value = "Updates Item level details of particular requested itemId of a Inter Boutique stock request", notes = " Updates particular Item deatails like accepted quantity against the requested quantity"
			+ "</br>And request **id,itemId,requestType** i.e **BTQ(Inter boutique transfer)** in request parameter and **quantity,status** i.e **ACCEPTED(Acceptenace by issuer boutique)** or **ACPT_REJECTED(reject by issuer boutique)** in request body are mandatory")
	public StockRequestItemDto updateStockRequestItem(@PathVariable @Positive Integer id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@ApiParam(value = "Stock Request Type", allowableValues = "BTQ", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = StockRequestTypeEnum.class) String requestType,
			@RequestBody @Valid StockRequestItemUpdateDto itemUpdateDto) {

		return stockRequestFacade.updateStockRequestItem(id, itemId, requestType, itemUpdateDto);

	}

	/**
	 * To update stock request and it's items as ACCEPTED,ACPT_REJECTED,CANCELLED
	 * 
	 * @param id       - stock request id
	 * @param itemList - list of item id
	 * @param status   - update status as ACCEPTED or ACPT_REJECTED or CANCELLED
	 * @param remarks  - remarks to update stock request
	 * @return - updated stock request details
	 */
	@PreAuthorize(STOCK_REQUEST_SENT_AND_RECEIVED_PERMISSION)
	@PatchMapping(value = "/{id}")
	@ApiOperation(value = "Updates the status of particular Inter Boutique Stock Request", notes = "updates particular Request status as **ACCEPTED,ACPT_REJECTED(Acceptance Rejected)** by Issuer boutique With selected items"
			+ "</br>and **CANCELLED(Cancelled by requested boutique)** by Requester with **requestType**,selected **itemId's**, **status** and **remarks** are mandatory for accepting the request"
			+ "</br>and **ISSUE_REJECTED** by issuer is allowed while request is in **APVL_PENDING,APPROVED**")
	public StockRequestDto updateStockRequest(@PathVariable @Positive Integer id,
			@ApiParam(value = "Provide 'BTQ' for all Inter Boutique Transfer Request", allowableValues = "BTQ", required = true) @RequestParam(required = true, name = "requestType") @ValueOfEnum(enumClass = StockRequestTypeEnum.class) String requestType,
			@ApiParam(value = "Provide 'SENT' if you want to update sent request, else 'RECEIVED' to update the request received ", allowableValues = "SENT,RECEIVED", required = true) @RequestParam(required = true, name = "requestGroup") @ValueOfEnum(enumClass = RequestGroupEnum.class) String requestGroup,
			@RequestBody @Valid StockRequestUpdateDto requestUpdateDto) {
		return stockRequestFacade.updateStockRequest(id, requestType, requestGroup, requestUpdateDto);
	}
	
	@PostMapping("/com")
	@ApiOperation(value="API to create customer order stock request" , notes="This API will create customer order stock request")
	public StringResponse createCoStockRequest(@RequestBody @Valid ComStockRequestDto comStockRequestDto) {
		
		return stockRequestFacade.createCoStockRequest(comStockRequestDto);
	}
	
	

}
