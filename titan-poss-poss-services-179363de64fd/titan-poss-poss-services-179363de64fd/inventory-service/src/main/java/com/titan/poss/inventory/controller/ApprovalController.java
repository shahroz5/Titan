/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.inventory.acl.InventoryAccessControls.APPROVE_CONVERSION_REQUESTS;
import static com.titan.poss.inventory.acl.InventoryAccessControls.APPROVE_IBT_REQUESTS;
import static com.titan.poss.inventory.acl.InventoryAccessControls.APPROVE_NEW_BIN_REQUESTS;
import static com.titan.poss.inventory.acl.InventoryAccessControls.APPROVE_OTHER_ISSUES_ADJUSTMENT;
import static com.titan.poss.inventory.acl.InventoryAccessControls.APPROVE_OTHER_ISSUES_EXHIBITION;
import static com.titan.poss.inventory.acl.InventoryAccessControls.APPROVE_OTHER_ISSUES_FOC;
import static com.titan.poss.inventory.acl.InventoryAccessControls.APPROVE_OTHER_ISSUES_LOAN;
import static com.titan.poss.inventory.acl.InventoryAccessControls.APPROVE_OTHER_ISSUES_LOSS;
import static com.titan.poss.inventory.acl.InventoryAccessControls.APPROVE_OTHER_ISSUES_PSV;

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
import com.titan.poss.inventory.dto.constants.ApprovalRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.ApprovalRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.StockReceiveTypeEnum;
import com.titan.poss.inventory.dto.request.ApprovalRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.ApprovalRequestUpdateDto;
import com.titan.poss.inventory.dto.request.BinRequestUpdateDto;
import com.titan.poss.inventory.dto.request.StockTransferApprovalRequestUpdateDto;
import com.titan.poss.inventory.dto.response.ApprovalRequestDto;
import com.titan.poss.inventory.dto.response.ApprovalRequestItemDto;
import com.titan.poss.inventory.dto.response.ApprovalTransferDto;
import com.titan.poss.inventory.dto.response.ApprovalTransferItemDto;
import com.titan.poss.inventory.dto.response.BinRequestDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.facade.ApprovalProcessFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * API's for Request Approvals
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@RequestMapping("inventory/v2/approvals")
@Validated
public class ApprovalController {

	@Autowired
	ApprovalProcessFacade approvalProcessFacade;

	private static final String BIN_CREATION_APPROVAL = START + APPROVE_NEW_BIN_REQUESTS + END;

	// @formatter:off
	private static final String APPROVAL_PERMISSION = "hasPermission(#requestType,'BTQ')" + AND + START
			+ APPROVE_IBT_REQUESTS + END + OR + "hasPermission(#requestType,'LOAN')" + AND + START
			+ APPROVE_OTHER_ISSUES_LOAN + END + OR + "hasPermission(#requestType,'EXH')" + AND + START
			+ APPROVE_OTHER_ISSUES_EXHIBITION + END + OR + "hasPermission(#requestType,'FOC')" + AND + START
			+ APPROVE_OTHER_ISSUES_FOC + END + OR + "hasPermission(#requestType,'LOSS')" + AND + START
			+ APPROVE_OTHER_ISSUES_LOSS + END + OR + "hasPermission(#requestType,'ADJ' )" + AND + START
			+ APPROVE_OTHER_ISSUES_ADJUSTMENT + END + OR + "hasPermission(#requestType,'CONV')" + AND + START
			+ APPROVE_CONVERSION_REQUESTS + END + OR + "hasPermission(#requestType,'PSV')" + AND + START
			+ APPROVE_OTHER_ISSUES_PSV + END + OR + "hasPermission(#requestType,'BIN')" + AND + START
			+ APPROVE_NEW_BIN_REQUESTS + END;
	// @formatter:on

	/**
	 * To get the count of approval requests received
	 * 
	 * @param requestType- can be BTQ,
	 * @return - list of stock requests count
	 */
	@GetMapping(value = "/counts")
	@ApiOperation(value = "Gives the approval requests count grouped by request Type from all the Boutiques", notes = "Gives the count of approval requests for request types **BTQ(Inter Boutique transfer), LOAN, EXH(Exhibition), FOC(Free of Charge), LOSS, ADJ(Adjustment), CONV(Conversion), PSV(Physical Stock verification),BIN(Bin Creation Request)**")
	public ListResponse<InventoryCountDto> getApprovalRequestCount() {
		return approvalProcessFacade.getApprovalRequestCount();
	}

	/**
	 * To list the details of the approval requests received
	 * 
	 * @param requestType - can be BTQ, LOAN, EXH, FOC, LOSS, ADJ, CONV, PSV
	 * @param pageable    - Pageable support with page, size, sort values as request
	 *                    params
	 * @return - list of approval requests
	 */
	@ApiPageable
	@GetMapping(value = "")
//	@PreAuthorize(APPROVAL_PERMISSION)
	@ApiOperation(value = "Lists all the approval requests received by the approver", notes = "Lists all the approval requests received by the approver with the status **APVL_PENDING**(Pending for approval)"
			+ "</br>request types like **BTQ(Inter Botique transfer), LOAN, EXH(Exhibition), FOC(Free of Charge), LOSS, ADJ(Adjustment), CONV(Conversion), PSV(Physical Stock verification)** will be the mandatory parameter"
			+ "</br>Filter by **reqLocationCode** or **reqDocNo** and **status** are optional parameters")
	public PagedRestResponse<List<ApprovalRequestDto>> listApprovalRequests(
			@RequestParam(required = true, name = "requestType") @ApiParam(value = "Approval Request", allowableValues = "BTQ,LOAN,EXH,FOC,LOSS,ADJ,CONV,PSV,BIN", required = true) @ValueOfEnum(enumClass = ApprovalRequestTypeEnum.class) String requestType,
			@RequestParam(required = false) Integer reqDocNo,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String reqLocationCode,
			@RequestParam(required = false) @ApiParam(value = "Approval Request ", allowableValues = "CNCL_APVL_PENDING,APVL_PENDING,APPROVED,APVL_REJECTED,ACKNOWLEDGE_PENDING", required = false) @ValueOfEnum(enumClass = ApprovalRequestStatusEnum.class) String status,
			@SortDefault(sort = "createdDate", direction = Sort.Direction.DESC) @ApiIgnore Pageable pageable) {
		return approvalProcessFacade.listApprovalRequests(requestType, reqDocNo, reqLocationCode,
				status != null ? status : null, pageable);
	}

	/**
	 * To get the details of particular approval request
	 * 
	 * @param id      - request id
	 * @param reqType - can be BTQ, LOAN, EXH, FOC, LOSS, ADJ, CONV, PSV
	 *
	 * 
	 * @return - Get the Approval request
	 * 
	 */
	@ApiPageable
	@GetMapping(value = "/{id}")
//	@PreAuthorize(APPROVAL_PERMISSION)
	@ApiOperation(value = "Returns the Approval Request Details of particular request id and requestType", notes = "Returns the Approval Request Details of particular request **id** and the applicable **requestType** like **BTQ(Inter Botique transfer), LOAN, "
			+ "</br>EXH(Exhibition), FOC(Free of Charge), LOSS, ADJ(Adjustment), CONV(Conversion), PSV(Physical Stock verification)**")
	public ApprovalRequestDto getApprovalRequest(@PathVariable Integer id,
			@RequestParam(required = true, name = "requestType") @ApiParam(value = "Approval Request ", allowableValues = "BTQ,LOAN,EXH,FOC,LOSS,ADJ,CONV,PSV,BIN", required = true) @ValueOfEnum(enumClass = ApprovalRequestTypeEnum.class) String requestType) {
		return approvalProcessFacade.getApprovalRequest(id, requestType);

	}

	/**
	 * To get item level details of the approval request received
	 * 
	 * @param id       - request id
	 * @param pageable
	 * @return - list of approval request item details
	 */
	@ApiPageable
	@GetMapping(value = "/{id}/items")
//	@PreAuthorize(APPROVAL_PERMISSION)
	@ApiOperation(value = "Lists the Item level details of the particular Approval Request", notes = "List the requested items with item details of particaular approval request **id** "
			+ "</br>for **requestType** i.e **BTQ(Inter Botique transfer), LOAN, EXH(Exhibition), FOC(Free of Charge), LOSS, ADJ(Adjustment), CONV(Conversion), PSV(Physical Stock verification)**"
			+ "</br>And also provides the current available quantity of each item in the inventory of a issuer boutique"

			+ "<pre> SortParameters: </pre> "

			+ "<pre> </br> </br>\"Aprroval (IBT)\":</br>" + "\t\"acceptedQuantity,ASC\",</br>"
			+ "\t\"acceptedQuantity,DESC\",</br>" + "\t\"acceptedWeight,ASC\",</br>"
			+ "\t\"acceptedWeight,DESC\",</br></pre>"

			+ "<pre> </br> </br>\"Aprroval (LOAN,LOSS,FOC,ADJ,EXH)\":</br>" + "\t\"requestedQuantity,ASC\",</br>"
			+ "\t\"requestedQuantity,DESC\",</br>" + "\t\"requestedWeight,ASC\",</br>"
			+ "\t\"requestedWeight,DESC\",</br></pre>"

	)
	public PagedRestResponse<List<ApprovalRequestItemDto>> listApprovalRequestItems(@PathVariable Integer id,
			@RequestParam(required = true, name = "requestType") @ApiParam(value = "Approval Request ", allowableValues = "BTQ,LOAN,EXH,FOC,LOSS,ADJ,CONV,PSV,BIN", required = true) @ValueOfEnum(enumClass = ApprovalRequestTypeEnum.class) String requestType,
			@RequestParam(required = false) @ApiParam(value = "Approval Request Status", allowableValues = "CNCL_APVL_PENDING,APVL_PENDING,APPROVED,APVL_REJECTED,ACKNOWLEDGED", required = false) @ValueOfEnum(enumClass = ApprovalRequestStatusEnum.class) String status,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,

			@ApiIgnore Pageable pageable) {

		return approvalProcessFacade.listApprovalRequestItems(id, requestType, status != null ? status : null,
				productCategory, productGroup, itemCode, lotNumber, pageable);

	}

	/**
	 * To update the requested item details at the approval stage.
	 * 
	 * @param id            - approval request id
	 * @param itemid        - item id at request detail table
	 * @param acceptItemDto - updated changes at approval like approvedQuantity
	 * @return - updated request item details
	 */
	@PatchMapping(value = "/{id}/items/{itemId}")
//	@PreAuthorize(APPROVAL_PERMISSION)
	@ApiOperation(value = "Updates Item level details of particular requested itemId of a approval request", notes = " Updates particular Item deatails like **approved quantity** against the **accepted quantity**"
			+ "</br>And request **id,itemId,requestType** i.e **BTQ(Inter Botique transfer), LOAN, EXH(Exhibition),"
			+ "</br> FOC(Free of Charge), LOSS, ADJ(Adjustment), CONV(Conversion), PSV(Physical Stock verification)** in request parameter and **quantity,status** i.e **APPROVED**(After approved by approver) or **APVL_REJECTED**(After rejected by approver) in request body are mandatory")
	public ApprovalRequestItemDto updateApprovalRequestItem(@PathVariable @Positive Integer id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@RequestParam(required = true) @ApiParam(value = "Approval Request ", allowableValues = "BTQ,LOAN,EXH,FOC,LOSS,ADJ,CONV,PSV,BIN", required = true) @ValueOfEnum(enumClass = ApprovalRequestTypeEnum.class) String requestType,
			@RequestBody @Valid ApprovalRequestItemUpdateDto itemUpdateDto) {

		return approvalProcessFacade.updateApprovalRequestItem(id, itemId, requestType, itemUpdateDto);

	}

	/**
	 * To update approval request and it's items as APPROVED,APVL_REJECTED
	 * 
	 * @param id       - request id
	 * @param itemList - list of item id
	 * @param status   - update status as APPROVED or APVL_REJECTED
	 * @param remarks  - remarks to update request
	 * @return - updated request details
	 */
	@PatchMapping(value = "/{id}")
//	@PreAuthorize(APPROVAL_PERMISSION)
	@ApiOperation(value = "updates the Particular approval Request status", notes = "updates particular Request status as **APPROVED,APVL_REJECTED(approval rejected)** by approver With selected items"
			+ "</br>selected **itemId's**, **status** as **APPROVED** and **remarks** are mandatory")
	public ApprovalRequestDto updateApprovalRequest(@PathVariable Integer id,
			@RequestParam(required = true, name = "requestType") @ApiParam(value = "Approval Request ", allowableValues = "BTQ,LOAN,EXH,FOC,LOSS,ADJ,CONV,PSV,BIN", required = true) @ValueOfEnum(enumClass = ApprovalRequestTypeEnum.class) String requestType,
			@RequestBody @Valid ApprovalRequestUpdateDto requestUpdateDto) {

		return approvalProcessFacade.updateApprovalRequest(id, requestType, requestUpdateDto);

	}

	/**
	 * Returns list of bin approval requests
	 * 
	 * @return - BinRequestDto list
	 */
	@ApiOperation(value = "Lists the Bin creation approval requests", notes = "Lists the Bin creation approval requests with status **APVL_PENDING**(Pending for approval)"
			+ "</br>Filter by **locationCode** or **reqDocNo** are optional parameters")
	@ApiPageable
	@GetMapping(value = "/bins/requests")
	@PreAuthorize(BIN_CREATION_APPROVAL)
	public PagedRestResponse<List<BinRequestDto>> listBinApprovalRequest(
			@RequestParam(required = false) Integer reqDocNo,
			@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) @RequestParam(required = false) String locationCode,
			@ApiIgnore Pageable pageable) {
		return approvalProcessFacade.listBinApprovalRequests(reqDocNo, locationCode, pageable);

	}

	/**
	 * Returns binRequestDto containing updated request
	 * 
	 * @param id                  - id of bin request
	 * @param binRequestUpdateDto - contains status and approval remarks
	 * @return - BinRequestDto
	 */
	@ApiOperation(value = "Updates status of bin creation approval request with approval remarks", notes = "This API Updates status of bin creation approval request with approval remarks"
			+ "</br>Update **status** can be **APPROVED** or **APVL_REJECTED** with the approval **remarks**")
	@PatchMapping(value = "bins/requests/{id}")
	@PreAuthorize(BIN_CREATION_APPROVAL)
	public BinRequestDto updateBinApprovalRequest(@PathVariable Integer id,
			@RequestBody @Valid BinRequestUpdateDto binRequestUpdateDto) {
		return approvalProcessFacade.updateBinApprovalRequest(id, binRequestUpdateDto);

	}

	@ApiOperation(value = "List of all approval requests against transfer", notes = "This API returns the all approval request  with **CNCL_APVL_PENDING** status"
			+ "</br>Here transfer type should be **FAC_BTQ**, **BTQ_BTQ**, **MER_BTQ** and status should be **CNCL_APVL_PENDING**")
	@ApiPageable
	@GetMapping(value = "transfer")
	// @PreAuthorize(APPROVAL_PERMISSION)
	public PagedRestResponse<List<ApprovalTransferDto>> listTransferApprovalRequest(
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive Status ", allowableValues = "CNCL_APVL_PENDING,APVL_PENDING,APPROVED,APVL_REJECTED", required = true) @ValueOfEnum(enumClass = ApprovalRequestStatusEnum.class) String status,
			@RequestParam(required = false) Integer srcDocNo,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String srcLocationCode,
			@SortDefault(sort = "createdDate", direction = Sort.Direction.DESC) @ApiIgnore Pageable pageable) {
		return approvalProcessFacade.listTransferApprovalRequest(transferType, srcDocNo, srcLocationCode, status,
				pageable);
	}

	@ApiOperation(value = "List of approval request items against transfer details", notes = "This API returns the all the items against the header id"
			+ "</br>Here transfer type should be **FAC_BTQ**, **BTQ_BTQ**, **MER_BTQ** and status should be **CNCL_APVL_PENDING**")
	@ApiPageable
	@GetMapping(value = "transfer/{id}/items")
	public PagedRestResponse<List<ApprovalTransferItemDto>> listTransferApprovalRequestItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive Status ", allowableValues = "CNCL_APVL_PENDING,APVL_PENDING,APPROVED,APVL_REJECTED", required = true) @ValueOfEnum(enumClass = ApprovalRequestStatusEnum.class) String status,
			@ApiIgnore Pageable pageable) {
		return approvalProcessFacade.listTransferApprovalRequestItems(id, transferType, status, pageable);

	}

	@ApiOperation(value = "Update the status of approval request against transfer", notes = "Update the status as **CANCELED** or **ISSUED**"
			+ "</br>Here transfer type should be **FAC_BTQ**, **BTQ_BTQ**, **MER_BTQ** and status should be **CNCL_APVL_APPROVED**"
			+ " or **CNCL_APVL_REJECTED**")
	@PatchMapping(value = "transfer/{id}")
	public ApprovalTransferDto updateTransferApprovalRequest(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType,
			@RequestBody @Valid StockTransferApprovalRequestUpdateDto stUpdateDto) {

		return approvalProcessFacade.updateTransferApprovalRequest(id, transferType, stUpdateDto);
	}

	@ApiPageable
	@GetMapping(value = "transfer/{id}")
	@ApiOperation(value = "Returns the Approval Cancel STN of particular STN id and transferType", notes = "Returns the Approval Cancel STN Detail of particular STN **id**  and   **transferType** like "
			+ "</br>Here transfer type should be **FAC_BTQ**, **BTQ_BTQ**, **MER_BTQ** and status should be **CNCL_APVL_APPROVED**"
			+ " or **CNCL_APVL_REJECTED**")
	public ApprovalTransferDto getTransferApprovalRequest(@PathVariable Integer id,
			@RequestParam(required = true, name = "transferType") @ApiParam(value = "Stock Receive ", allowableValues = "FAC_BTQ,BTQ_BTQ,MER_BTQ", required = true) @ValueOfEnum(enumClass = StockReceiveTypeEnum.class) String transferType) {
		return approvalProcessFacade.getTransferApprovalRequest(id, transferType);

	}
}
