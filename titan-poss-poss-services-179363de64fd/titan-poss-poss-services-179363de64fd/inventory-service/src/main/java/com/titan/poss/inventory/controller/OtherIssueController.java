/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.inventory.acl.InventoryAccessControls.CONVERSION_REQUESTS_SENT;
import static com.titan.poss.inventory.acl.InventoryAccessControls.CONVERSION_SEARCH_BY_VARIANT;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_ADJUSTMENTS;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_EXHIBITION;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_FOC;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_LOAN;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_LOSS;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_PSV;

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
import com.titan.poss.inventory.dto.constants.OtherIssueRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.StockIssueRequestTypeStatusEnum;
import com.titan.poss.inventory.dto.request.IssueStockItemBulkDto;
import com.titan.poss.inventory.dto.request.StockIssueStockConfirmDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.IssueStockDto;
import com.titan.poss.inventory.dto.response.ReceiveStockDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;
import com.titan.poss.inventory.facade.OtherIssueFacade;

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
@RequestMapping(value = "inventory/v2/other-issues")
@Validated
public class OtherIssueController {

	@Autowired
	OtherIssueFacade otherIssueFacade;

	// @formatter:off
	private static final String OTHER_ISSUE_REQUEST_TYPE_PERMISSION = "hasPermission(#requestType,'FOC')" + AND + START
			+ OTHER_ISSUES_FOC + END + OR + "hasPermission(#requestType,'LOSS')" + AND + START + OTHER_ISSUES_LOSS + END
			+ OR + "hasPermission(#requestType,'EXH')" + AND + START + OTHER_ISSUES_EXHIBITION + END + OR
			+ "hasPermission(#requestType,'ADJ')" + AND + START + OTHER_ISSUES_ADJUSTMENTS + END + OR
			+ "hasPermission(#requestType,'PSV')" + AND + START + OTHER_ISSUES_PSV + END + OR
			+ "hasPermission(#requestType,'LOAN')" + AND + START + OTHER_ISSUES_LOAN + END;
	// @formatter:on

	/**
	 * Returns list of values with count of StockRequestType where document status
	 * is APPROVED or APVL_PENDING
	 * 
	 * @return - List of Request Count
	 */
	@PreAuthorize(START + OTHER_ISSUES_EXHIBITION + OR + OTHER_ISSUES_ADJUSTMENTS + OR + OTHER_ISSUES_LOAN + OR
			+ OTHER_ISSUES_LOSS + OR + CONVERSION_REQUESTS_SENT + OR + CONVERSION_SEARCH_BY_VARIANT + OR
			+ OTHER_ISSUES_FOC + END)
	@ApiOperation(value = "Gives the Count for **Other Issue** Types", notes = "This API works for Listing count of stockRequest for **EXH, ADJ,LOSS LOAN, PSV, FOC and CONV** with status **APPROVED(Btq Users)** and **APVL_PENDING**")
	@GetMapping(value = "request/counts")
	public ListResponse<InventoryCountDto> getStockRequestCount() {
		return otherIssueFacade.getStockRequestCount();
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
	@GetMapping(value = "request")
	@PreAuthorize(OTHER_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Listing stockRequest for other request types", notes = "This API works for Listing stockRequest for particular request type with approval flow, i.e **FOC, LOSS, EXH, ADJ, PSV and LOAN**"
			+ ", </br>This API also allows search for reqDocNo")
	public PagedRestResponse<List<IssueStockDto>> listStockRequests(@RequestParam(required = false) Integer reqDocNo,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Issue ", allowableValues = "FOC,LOSS,EXH,LOAN,ADJ,PSV,CONV") @ValueOfEnum(enumClass = OtherIssueRequestTypeEnum.class) String requestType,
			@ApiIgnore Pageable pageable) {
		return otherIssueFacade.listStockRequests(reqDocNo, requestType, pageable);
	}

	/**
	 * 
	 * @param id
	 * @param requestType
	 * @return
	 */
	@GetMapping(value = "request/{id}")
	@PreAuthorize(OTHER_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Listing Stock Request of requested Id for other request types", notes = "This API Lists Request of requested Id for other request types  i.e **FOC, LOSS, EXH, ADJ, PSV and LOAN**")
	public IssueStockDto getStockRequest(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Issue ", allowableValues = "FOC,LOSS,EXH,LOAN,ADJ,PSV,CONV") @ValueOfEnum(enumClass = OtherIssueRequestTypeEnum.class) String requestType) {
		return otherIssueFacade.getStockRequest(id, requestType);
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
	@PreAuthorize(OTHER_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Listing Items for the stockRequest id for other request types", notes = "Listing Items for stockrequest id for other request types  i.e **FOC, LOSS, EXH, ADJ, PSV and LOAN**"
			+ "</br>This API also allows to filter the searched result on respective of available params"

			+ "<pre> SortParameters: </pre> "

			+ "<pre> </br> </br>\"OtherIssue (LOAN,LOSS,FOC,ADJ,EXH) \":</br>" + "\t\"approvedQuantity,ASC\"\",</br>"
			+ "\t\"approvedQuantity,DESC\"\",</br>" + "\t\"requestedWeight,DESC\"\",</br>"
			+ "\t\"requestedWeight,ASC\"\",</br>" + "\t </br>" + "</pre>"

	)
	public PagedRestResponse<List<RequestStockItemResponseDto>> listStockRequestItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Issue ", allowableValues = "FOC,LOSS,EXH,LOAN,ADJ,PSV,CONV") @ValueOfEnum(enumClass = OtherIssueRequestTypeEnum.class) String requestType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @ApiParam(required = false, value = "Stock Issue Request", allowableValues = "APPROVED,SELECTED,APVL_PENDING") @ValueOfEnum(enumClass = StockIssueRequestTypeStatusEnum.class) String status,
			@ApiIgnore Pageable pageable) {
		return otherIssueFacade.listStockRequestItems(id, requestType, itemCode, productGroup, productCategory,
				lotNumber, binCode, binGroupCode, status != null ? status : null, pageable);
	}

	/**
	 * 
	 * @param id      - stock request id
	 * @param itemId- stock request details id
	 * @return an item from stock request details
	 */
	@GetMapping(value = "request/{id}/items/{itemId}")
	@PreAuthorize(OTHER_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Listing Stock Request Item requested Id and itemId", notes = "This API returns Stock Request Item of requested Id and itemId of other request types  i.e **FOC, LOSS, EXH, ADJ, PSV and LOAN**")
	public RequestStockItemResponseDto getStockRequestItem(
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Issue ", allowableValues = "FOC,LOSS,EXH,LOAN,ADJ,PSV,CONV") @ValueOfEnum(enumClass = OtherIssueRequestTypeEnum.class) String requestType,
			@PathVariable Integer id, @PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId) {
		return otherIssueFacade.getStockRequestItem(id, itemId, requestType);
	}

	/**
	 * Confirms the status of StockRequest
	 * 
	 * @param id                     - id of StockRequest
	 * @param stockRequestConfirmDto - Details to confirm StockRequest
	 * @return - Updated StockRequest values
	 */
	@PatchMapping(value = "request/{id}")
	@PreAuthorize(OTHER_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Confirming Stock Request for other request types", notes = "This Api updates Staus and confirms  the Request, this API works for request Types  i.e **FOC, LOSS, EXH, ADJ, PSV and LOAN**"
			+ "Accepts Different types of Carrier Details in different requestType"

			+ "<pre> LOAN: </br>\"carrierDetails\":</br>{" + "\t\"type\": \"employee\",</br>" + "\t\"data\": {</br>"
			+ "\t\t \"employeeId\":\"E12456\",</br>" + "\t\t \"employeeName\":\"TITANuser\",</br>"
			+ "\t\t \"designation\":\"CASHIER\",</br>" + "\t\t \"mobileNo\":\"1234567890\",</br>"
			+ "\t\t  \"emailId \":\"E12456.@gmail.com \"</br>" + "\t}</br>" + "}</pre>"

			+ "</br></br><pre> EXHIBITION: </br>\"carrierDetails\":</br>{" + "\t\"type\": \"address\",</br>"
			+ "\t\"data\": {</br>" + "\t\t \"address1\":\"ORION\",</br>" + "\t\t \"address2\":\"Yeshwantpura\",</br>"
			+ "\t\t \"city\":\"Banglore\",</br>" + "\t\t \"town\":\"Banglore\",</br>"
			+ "\t\t \"pincode \":\"516001 \"</br>" + "\t}</br>" + "}</pre>")
	public ReceiveStockDto updateStockRequest(
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Issue ", allowableValues = "FOC,LOSS,EXH,LOAN,ADJ,PSV,CONV") @ValueOfEnum(enumClass = OtherIssueRequestTypeEnum.class) String requestType,
			@PathVariable Integer id, @RequestBody @Valid StockIssueStockConfirmDto stockRequestConfirmDto) {
		return otherIssueFacade.updateStockRequest(id, requestType, stockRequestConfirmDto);
	}

	/**
	 * Bulk Update of items w.r.t particular stockId
	 * 
	 * @return - Created StockIssue Response
	 */
	@PatchMapping("request/{id}/items")
	@PreAuthorize(OTHER_ISSUE_REQUEST_TYPE_PERMISSION)
	@ApiOperation(value = "Updating Stock request Items for other request types in bulk", notes = "This Api updates the List of Items Status this methode is used for other request i.e **FOC, LOSS, EXH, ADJ, PSV and LOAN**. "
			+ "</br>Status Can be SELECTED(It is selcted for Issue) and APPROVED(Default, to unselect change to APPROVED)"
			+ "</br>**This API doesn't support for APPROVED status input"
			+ "</br>**Bulk Update:**<ol><li>**All:**In case of All, itemIds will be [] empty</li><li>**Multi:**For multi update give all itemIds in list(Max **50** is allowed)</li></ol>")
	public void updateAllOtherIssueItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Issue ", allowableValues = "FOC,LOSS,EXH,LOAN,ADJ,PSV,CONV") @ValueOfEnum(enumClass = OtherIssueRequestTypeEnum.class) String requestType,
			@RequestBody @Valid IssueStockItemBulkDto issueStockItemBulkDto) {
		otherIssueFacade.updateAllStockIssueItems(id, requestType, issueStockItemBulkDto);
	}

	@GetMapping("request/{id}/prints")
	public ResponseEntity<Resource> getOtherIssuePDFImp(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Issue ", allowableValues = "FOC,LOSS,EXH,LOAN,ADJ,PSV,CONV") @ValueOfEnum(enumClass = OtherIssueRequestTypeEnum.class) String otherIssueType)
	{
		return otherIssueFacade.getOtherIssuePDF(id, otherIssueType, null);

	}

}
