/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.inventory.acl.InventoryAccessControls.CONVERSION_REQUESTS_SENT;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_ADJUSTMENTS;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_EXHIBITION;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_FOC;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_LOAN;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_LOSS;
import static com.titan.poss.inventory.acl.InventoryAccessControls.OTHER_ISSUES_PSV;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.constants.OtherRequestCreateStatus;
import com.titan.poss.inventory.dto.constants.OtherTransactionRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.OtherTransferRequestTypeEnum;
import com.titan.poss.inventory.dto.request.OtherRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.OtherRequestItemsCreateDto;
import com.titan.poss.inventory.dto.request.OtherRequestUpdateDto;
import com.titan.poss.inventory.dto.request.OtherTransactionRequestCreateDto;
import com.titan.poss.inventory.dto.request.RemoveOtherItemsDto;
import com.titan.poss.inventory.dto.response.OtherRequestDto;
import com.titan.poss.inventory.dto.response.OtherRequestItemDto;
import com.titan.poss.inventory.facade.OtherRequestFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * API's for Other Requests
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "inventory/v2/other-requests")
@Validated
public class OtherRequestController {

	// @formatter:off
	private static final String OTHER_REQUEST_LOAN_EXH_LOSS = "hasPermission(#requestType,'LOAN') " + AND + START
			+ OTHER_ISSUES_LOAN + END + OR + "hasPermission(#requestType,'EXH') " + AND + START
			+ OTHER_ISSUES_EXHIBITION + END + OR + "hasPermission(#requestType,'LOSS') " + AND + START
			+ OTHER_ISSUES_LOSS + END;

	private static final String OTHER_REQUEST_ADJ_CONV_PSV_FOC = "hasPermission(#requestType,'ADJ') " + AND + START
			+ OTHER_ISSUES_ADJUSTMENTS + END + OR + "hasPermission(#requestType,'CONV') " + AND + START
			+ CONVERSION_REQUESTS_SENT + END + OR + "hasPermission(#requestType,'PSV') " + AND + START
			+ OTHER_ISSUES_PSV + END + OR + "hasPermission(#requestType,'FOC') " + AND + START + OTHER_ISSUES_FOC + END;
	// @formatter:on

	@Autowired
	OtherRequestFacade otherRequestFacade;

	/**
	 * To get item level details of the other request made
	 * 
	 * @param id       - other request id
	 * @param pageable
	 * @return - list of other request item details
	 */
	@ApiPageable
	@GetMapping(value = "/{id}/items")
	@PreAuthorize(OTHER_REQUEST_LOAN_EXH_LOSS)
	@ApiOperation(value = "Lists the Item level details of the particular request like LOAN, EXH(EXHIBITION), LOSS", notes = "Lists the Item level details of the particular request like **LOAN, EXH(EXHIBITION), LOSS** on the basis of **status** i.e **OPEN** or **SELECTED**"
			+ "</br>Items will be listed from request Details if previously **SELECTED** from inventory,else it will lists from inventory details"
			+ "</br>Provided the request id and request type is mandatory to list the respective items"
			+ "</br>And this API also allows to filter the searched result based on provided parameters like **itemCode,productGroup,productCategory,lotNumber,binCode,status**"
			+ "<pre> SortParameters: </pre> "

			+ "<pre> </br> </br>\"OtherRequest (Request) (LOAN,LOSS,FOC,ADJ,EXH)  \":</br>"
			+ "\t\"availableQuantity,ASC\",</br>" + "\t\"availableQuantity,DESC\",</br>"
			+ "\t\"availableWeight,DESC\",</br>" + "\t\"availableWeight,DESC\",</br></pre>")
	public PagedRestResponse<List<OtherRequestItemDto>> listOtherRequestItems(@PathVariable Integer id,
			@RequestParam(required = true, name = "requestType") @ApiParam(required = true, value = "Other Transfer ", allowableValues = "LOAN,EXH,LOSS") @ValueOfEnum(enumClass = OtherTransferRequestTypeEnum.class) String requestType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) @ApiParam(required = true, value = "Other Request Status ", allowableValues = "SELECTED,OPEN") @ValueOfEnum(enumClass = OtherRequestCreateStatus.class) String status,
			@ApiIgnore Pageable pageable) {
		return otherRequestFacade.listOtherRequestItems(id, requestType, itemCode, productGroup, productCategory,
				lotNumber, binCode, status != null ? status : null, pageable);
	}

	/**
	 * To create other transfer request with in the location
	 * 
	 * @param requestType - can be LOAN, EXH(Exhibition), LOSS
	 * @return - new request details with request doc no generated
	 */
	@PostMapping(value = "")
	@PreAuthorize(OTHER_REQUEST_LOAN_EXH_LOSS)
	@ApiOperation(value = "Creates the Approval Request for LOAN, EXH(Exhibition), LOSS", notes = "Creates the Approval Request for **LOAN, EXH(Exhibition), LOSS** request Types"
			+ "**requestType** i.e **LOAN, EXH(Exhibition), LOSS** is mandatory parameter")
	public OtherRequestDto createOtherTransactionRequest(
			@RequestParam(required = true, name = "requestType") @ApiParam(required = true, value = "Other Request Type", allowableValues = "LOAN,EXH,LOSS") @ValueOfEnum(enumClass = OtherTransferRequestTypeEnum.class) String requestType) {
		return otherRequestFacade.createOtherTransactionRequest(requestType);
	}

	/**
	 * To submit other transaction request with in the location
	 * 
	 * @param OtherTransactionRequestCreateDto - other request details like item
	 *                                         details,remarks,approval details,
	 *                                         code
	 * 
	 * @return - new request details with request doc no generated
	 */
	@PostMapping(value = "/items")
	@PreAuthorize(OTHER_REQUEST_ADJ_CONV_PSV_FOC)
	@ApiOperation(value = "Creates the Approval Request for  ADJ(Adjustment), CONV(Conversion), PSV(Physical stock verification), FOC(Free of charge)", notes = " Creates the Approval Request for **ADJ(Adjustment), CONV(Conversion), PSV(Physical stock verification), FOC(Free of charge)**"
			+ "</br>**requestType** i.e  **ADJ(Adjustment), CONV(Conversion), PSV(Physical stock verification), FOC(Free of charge)** is mandatory parameter"
			+ "</br>**approvalDetails,itemCode,lotNumber** And **quantity** are  mandatory parameters"
			+ "</br>For creation of **CONV(Conversion)** itemDetails of each item is mandatory and **remarks** is optional parameter for all")
	public OtherRequestDto createOtherTransactionRequest(
			@RequestParam(required = true, name = "requestType") @ApiParam(required = true, value = "Other Request Type", allowableValues = "ADJ,CONV,PSV,FOC") @ValueOfEnum(enumClass = OtherTransactionRequestTypeEnum.class) String requestType,
			@RequestBody @Valid OtherTransactionRequestCreateDto otherRequestCreateDto) {
		return otherRequestFacade.createOtherTransactionRequest(requestType, otherRequestCreateDto);

	}

	/**
	 * To update the Other request item details at the request stage.
	 * 
	 * @param id            - other request id
	 * @param itemid        - item id at stock request detail table
	 * @param itemUpdateDto - updated changes at request like quantity and measured
	 *                      weight
	 * @return - updated other request item details
	 */
	@PatchMapping(value = "/{id}/items/{itemId}")
	@PreAuthorize(OTHER_REQUEST_LOAN_EXH_LOSS)
	@ApiOperation(value = "Updates Item level details of particular requested itemId of other requests like LOAN, EXH(Exhibition), LOSS", notes = "Updates Item level details of particular requested **itemId** of other requests like **LOAN, EXH(Exhibition), LOSS**"
			+ "</br>Updates particular Item **status** as **SELECTED** and  **measuredWeight,quantity,inventoryId** with **requestType** like **LOAN, EXH(Exhibition), LOSS** are the mandatory request parameter")
	public OtherRequestItemDto updateOtherRequestItem(@PathVariable @Positive Integer id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Request Type ", allowableValues = "LOAN,EXH,LOSS") @ValueOfEnum(enumClass = OtherTransferRequestTypeEnum.class) String requestType,
			@RequestBody @Valid OtherRequestItemUpdateDto itemUpdateDto) {
		return otherRequestFacade.updateOtherRequestItem(id, itemId, requestType, itemUpdateDto);

	}

	/**
	 * To update other request and it's items as APVL_PENDING
	 * 
	 * @param id       - other request id
	 * @param itemList - list of item id
	 * @param status   - update status as APVL_PENDING
	 * @param remarks  - remarks to update other request
	 * @return - updated stock request details
	 */
	@PatchMapping(value = "/{id}")
	@PreAuthorize(OTHER_REQUEST_LOAN_EXH_LOSS)
	@ApiOperation(value = "Updates the status of particular request like LOAN, EXH(Exhibition), LOSS", notes = "Updates the status of particular request like **LOAN, EXH(Exhibition), LOSS**"
			+ "</br>Request will be submitted with **status** as **APVL_PENDING** with **approvalDetails,carrierDetails** and **requestType** like **LOAN, EXH(Exhibition), LOSS** are the mandatory request parameter"

			+ "Accepts Different types of Carrier Details in different requestType"

			+ "<pre> LOAN: </br>\"carrierDetails\":</br>{" + "\t\"type\": \"employee\",</br>" + "\t\"data\": {</br>"
			+ "\t\t \"employeeId\":\"E12456\",</br>" + "\t\t \"employeeName\":\"TITANuser\",</br>"
			+ "\t\t \"designation\":\"CASHIER\",</br>" + "\t\t \"mobileNo\":\"1234567890\",</br>"
			+ "\t\t \"brand\":\"XYZ\",</br>" + "\t\t  \"emailId \":\"E12456.@gmail.com \"</br>" + "\t}</br>" + "}</pre>"

			+ "</br></br><pre> EXHIBITION: </br>\"carrierDetails\":</br>{" + "\t\"type\": \"address\",</br>"
			+ "\t\"data\": {</br>" + "\t\t \"address1\":\"ORION\",</br>" + "\t\t \"address2\":\"Yeshwantpura\",</br>"
			+ "\t\t \"city\":\"Banglore\",</br>" + "\t\t \"town\":\"Banglore\",</br>"
			+ "\t\t \"pincode \":\"516001 \"</br>" + "\t}</br>" + "}</pre>"

			+ "</br></br><pre> APPROVAL: </br>\"otherDetails\":</br>{" + "\t\"type\": \"approval\",</br>"
			+ "\t\"data\": {</br>" + "\t\t \"approvalCode\":\"BTQ\",</br>" + "\t\t \"approvedBy\":\"BTQManager\",</br>"
			+ "\t\t \"pincode\":\"516001\"</br>" + "\t}</br>" + "}</pre>"

	)
	public OtherRequestDto updateOtherRequest(@PathVariable Integer id,
			@RequestParam(required = true, name = "requestType") @Valid @ApiParam(value = "Other Request Type", allowableValues = "LOAN,EXH,LOSS") @ValueOfEnum(enumClass = OtherTransferRequestTypeEnum.class) String requestType,
			@RequestBody @Valid OtherRequestUpdateDto requestUpdateDto) {
		return otherRequestFacade.updateOtherRequest(id, requestType, requestUpdateDto);
	}

	/**
	 * To create other request Items
	 * 
	 * @param id                  - other request id
	 * @param requestType         - request Type
	 * @param stockRequestItemDto - DTO accepts list of ITEMS
	 * @return - (void-with 200 response) creates list of items for the particular
	 *         request
	 */
	@PostMapping(value = "/{id}/items")
	@PreAuthorize(OTHER_REQUEST_LOAN_EXH_LOSS)
	@ApiOperation(value = "Creates items under the generated Request id of request type like LOAN, EXH(Exhibition), LOSS", notes = "Creates items under the generated Request id of request type like **LOAN, EXH(Exhibition), LOSS**"
			+ "</br>If itemList **items[]** sent empty then bulk items will be created from inventory of particular **bin** like **LOAN,EXHIBITION,LOSS** for respective **requestType**"
			+ "</br>If itemList is selected, they will be created with **Status** as **SELECTED** and with **requestType** as a mandatory request parameter")
	public void createOtherRequestItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Request Type", allowableValues = "LOAN,EXH,LOSS") @ValueOfEnum(enumClass = OtherTransferRequestTypeEnum.class) String requestType,
			@RequestBody @Valid OtherRequestItemsCreateDto otherRequestItemsCreateDto) {

		otherRequestFacade.createItemDetails(id, requestType, otherRequestItemsCreateDto);
	}

	/**
	 * Deletes the selected request Item
	 * 
	 * @param id     - request id of Other request
	 * @param itemid - id of other request details item
	 * @return - remove request detail item
	 */
	@PutMapping(value = "/{id}/items")
	@PreAuthorize(OTHER_REQUEST_LOAN_EXH_LOSS)
	@ApiOperation(value = "Removes items from the creating request of request type like LOAN, EXH(Exhibition), LOSS", notes = "Removes items from the creating request of **requestType** like **LOAN, EXH(Exhibition), LOSS**"
			+ "</br>**ItemIds** provided with respect to particular request **id** will be removed and **requestType** is the mandatory request parameter")
	public void removeStockRequestItems(@PathVariable Integer id,
			@RequestBody @Valid RemoveOtherItemsDto removeOtherItemDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Other Request Type", allowableValues = "LOAN,EXH,LOSS") @ValueOfEnum(enumClass = OtherTransferRequestTypeEnum.class) String requestType) {
		otherRequestFacade.removeOtherRequestItems(id, removeOtherItemDto, requestType);

	}

	/**
	 * To cancel Request
	 * 
	 * @param id - other request id
	 * 
	 */
	@PatchMapping(value = "/items/{id}/cancel")
	@PreAuthorize(OTHER_REQUEST_LOAN_EXH_LOSS)
	@ApiOperation(value = "Updates the Status to CANCELLED **LOAN, EXH(Exhibition), LOSS** ", notes = "Updates the status of particular request like **LOAN, EXH(Exhibition), LOSS**"
			+ "</br>Request will be **CANCELLED** with **requestType** like **LOAN, EXH(Exhibition), LOSS** are the mandatory request parameter")

	public OtherRequestDto cancelOtherTransferRequest(@PathVariable Integer id,
			@RequestParam(required = true, name = "requestType") @ApiParam(required = true, value = "Other Request Type", allowableValues = "LOAN,EXH,LOSS") @ValueOfEnum(enumClass = OtherTransferRequestTypeEnum.class) @Valid String requestType) {
		return otherRequestFacade.cancelOtherRequest(id, requestType);
	}

	/**
	 * To cancel Request
	 * 
	 * @param id     - other request id
	 * @param status - update status as CANCELLED
	 */
	@PatchMapping(value = "/{id}/cancel")
	@PreAuthorize(OTHER_REQUEST_ADJ_CONV_PSV_FOC)
	@ApiOperation(value = "Updates the Status to CANCELLED **FOC,PSV, ADJ** ", notes = "Updates the status of particular request like **FOC,PSV, ADJ**"
			+ "</br>Request will be **CANCELLED** with **requestType** like **FOC,PSV, ADJ** are the mandatory request parameter")
	public OtherRequestDto cancelOtherTransactionRequest(@PathVariable Integer id,
			@RequestParam(required = true, name = "requestType") @Valid @ApiParam(required = true, value = "Other Reqeust Type", allowableValues = "ADJ,CONV,PSV,FOC") @ValueOfEnum(enumClass = OtherTransactionRequestTypeEnum.class) String requestType) {
		return otherRequestFacade.cancelOtherRequest(id, requestType);
	}

}
