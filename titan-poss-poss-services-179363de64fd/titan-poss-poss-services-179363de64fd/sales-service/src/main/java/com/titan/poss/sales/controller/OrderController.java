/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionActionTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.OrderPatchUpdateDto;
import com.titan.poss.sales.dto.request.OrderUpdateDto;
import com.titan.poss.sales.dto.response.OrderAndItemIdResponseDto;
import com.titan.poss.sales.dto.response.OrderResponseDto;
import com.titan.poss.sales.dto.response.OrderTransactionDetailsDto;
import com.titan.poss.sales.dto.response.TransactionResponseDto;
import com.titan.poss.sales.service.OrderService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Sales Orders Controller
 * 
 * This holds API's for placing an Sales order like Advance Booking
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesOrderController")
@RequestMapping(value = "sales/v2/orders")
public class OrderController {

	@Autowired
	OrderService orderService;

	// @formatter:off
 
	private static final String ORDER_ADD_EDIT_PERMISSION = "hasPermission(#subTxnType,'NEW_AB')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_ADD_EDIT + END + OR + 
															"hasPermission(#subTxnType,'MANUAL_AB')" + AND + START + SalesAccessControls.MANUAL_AB_ADD_EDIT + END;
	private static final String ORDER_UPDATE_PERMISSION = "hasPermission(#status,'HOLD')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_HOLD + END + OR + 
														  "hasPermission(#status,'CONFIRMED')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_CONFIRM + END + OR + 
														  "hasPermission(#status,'APPROVAL_PENDING')" + AND + START + SalesAccessControls.MANUAL_AB_ADD_EDIT + END;
	private static final String ORDER_VIEW_PERMISSION = START + SalesAccessControls.ADVANCE_BOOKING_VIEW + END;
	private static final String ORDER_DELETE_PERMISSION = START + SalesAccessControls.ADVANCE_BOOKING_DELETE + END;
	private static final String ORDER_CANCEL_ACTIVATE_FREEZE_PERMISSION = "hasPermission(#actionType,'CANCEL_REQUEST')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_CANCELLATION_REQUEST_VIEW + END + OR + 
																		  "hasPermission(#actionType,'CANCEL')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_CANCELLATION_CONFIRM + END + OR +
																		  "hasPermission(#actionType,'ACTIVATE_REQUEST')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_ACTIVATION_REQUEST_VIEW + END + OR +
																		  "hasPermission(#actionType,'ACTIVATE')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_ACTIVATION_CONFIRM + END + OR +
																		  "hasPermission(#actionType,'RATE_FREEZE')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_RATE_FREEZE + END;
			
	// @formatter:on

	/**
	 * This method will create the order with open status
	 * 
	 * @param transactionCreateDto
	 * @param txnType
	 * @param subTxnType
	 * @return TransactionResponseDto
	 */
	// @formatter:off
	@PostMapping
	@PreAuthorize(ORDER_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to initiate Order", notes = "This API will Initiate the Order transaction.</br>"
			+ "This API to be called on selection of Advance Booking/Customer order tab to iniate the transaction.<br>"
			+ "<span style = \"font-weight:bold;font-size:14px;\">Sub Transaction Type(Related to AB):</span>"
			+ "<ul>"
			+ " <li>NEW_AB</li>"
			+ " <li>MANUAL_AB</li>"
			+ "</ul><br>"
			+ "Manual bill details with validated standard metal rates required if 'subTxnType' is 'MANUAL_AB/MANUAL_CO'<br>"
			+ "Validation types allowed for manual bill:<br>"
			+ "<ul>" 
			+ "	<li>PASSWORD_VALIDATION</li>"
			+ "	<li>REQUEST_APPROVAL</li>" 
			+ "</ul><br>")
	// @formatter:on
	// @Valid is not added as it is required only for manual bill.
	public TransactionResponseDto openOrder(
			@ApiParam(name = "body", value = "Manual bill details that need to be verified", required = false) @RequestBody TransactionCreateDto transactionCreateDto,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		return orderService.openOrder(transactionCreateDto, txnType, subTxnType);

	}

	/**
	 * This method will Update the order as HOLD/CONFIRM w.r.t id and status
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param status
	 * @param orderUpdateDto
	 * @return OrderResponseDto
	 */
	@PutMapping("{id}")
	@PreAuthorize(ORDER_UPDATE_PERMISSION)
	@ApiOperation(value = "API to HOLD or CONFIRM or create Manual bill request of the order", notes = "This API puts order on HOLD/CONFIRMED/APPROVAL_PENDING based on id and status")
	public OrderResponseDto updateOrder(
			@ApiParam(name = "id", value = "'id' to update order", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "status", value = "'status' to update", allowableValues = "HOLD,CONFIRMED,APPROVAL_PENDING", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(name = "body", value = "order Object that needs to be updated", required = true) @RequestBody @Valid OrderUpdateDto orderUpdateDto) {
		return orderService.updateOrder(id, txnType, subTxnType, orderUpdateDto, status);
	}

	/**
	 * This method will Get the Order Details with Item id's
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return OrderAndItemIdResponseDto
	 */
	@GetMapping("{id}")
	@PreAuthorize(ORDER_VIEW_PERMISSION)
	@ApiOperation(value = "API to get Order Details by Id", notes = "This API provides Order details by id<br>"
			+ "<b>Notes:</b> Order Item Id's will be provided in response")
	public OrderAndItemIdResponseDto getOrder(
			@ApiParam(name = "id", value = "'id' to get order details", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide if you want to search by 'sub txn type'", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return orderService.getOrder(id, txnType, subTxnType);
	}

	/**
	 * 
	 * This method will perform partial update on the Order by Id.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param orderPatchUpdate
	 * @return OrderAndItemIdResponseDto
	 */
	//@// @formatter:off
	@PatchMapping("{id}")
	@PreAuthorize(ORDER_ADD_EDIT_PERMISSION + PreAuthorizeDetails.OR + ORDER_CANCEL_ACTIVATE_FREEZE_PERMISSION)
	@ApiOperation(value = "API to partially update the Order", notes = "This API will update order by id.<br>"
			+ "<b>Note :</b> This API will update customer details and emlpoyee code.<br>"
			+ "Post Confirm of Order, Following actions can be performed on order<br>"
			+ "<span style = \"font-weight:bold;font-size:14px;\">Action Types(Related to AB):</span>"
			+ "<ul>"
			+ " <li><b>CANCEL_REQUEST :</b> Creates Approval request for the Cancellation of Advance Booking</li>"
			+ " <li><b>CANCEL :</b> Cancel the Advance Booking</li>"
			+ " <li><b>ACTIVATE_REQUEST :</b> Creates Approval request for the Activation of Advance Booking</li>"
			+ " <li><b>ACTIVATE :</b> Activates the Suspended Advance Booking post approval</li>"
			+ " <li><b>RATE_FREEZE :</b> Freeze the Metal rates of already confirmed non-frozen Advance Booking</li>"
			+ " <li><b>ADD_PAYMENT :</b> To Add additional payment to already confirmed order</li>"
			+ "</ul><br>"
			+ "<ul>"
			+ " <li>actionType,remarks are mandatory for <b>CANCEL_REQUEST</b>,<b>CANCEL</b>,<b>ACTIVATE_REQUEST</b>,<b>ACTIVATE</b> </li>"
			+ " <li>actionType, paidValue, metalRateList are mandatory for <b>RATE_FREEZE</b> </li>"
			+ " <li>only action type is mandatory to <b>ADD_PAYMENT</b></li>"
			+ "</ul><br>"
			+"<ul>"
			+ "<b><span style=\"font-size:14px;\">Refer below HyperLinks for Json Details:</span></b>\r\n<br>" 
			+"<li>" 
			+	"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/DiscountTxnDetails.json/\">"
			+	" Discount Transaction Details"
			+	"</a>"
			+	"</br></br>" 
			+"</li>" 
			+"</ul>")
	// @formatter:on
	public OrderAndItemIdResponseDto partialUpdateOrder(
			@ApiParam(name = "id", value = "'id' to update order", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "actionType", value = "transaction action to be performed", allowableValues = "CANCEL_REQUEST,CANCEL,ACTIVATE_REQUEST,ACTIVATE,RATE_FREEZE,ADD_PAYMENT", required = false) @RequestParam(name = "actionType", required = false) @ValueOfEnum(enumClass = TransactionActionTypeEnum.class) String actionType,
			@ApiParam(name = "body", value = "Order object that needs to be updated", required = true) @RequestBody @Valid OrderPatchUpdateDto orderPatchUpdateDto,
			@ApiParam(name = "ackReqRejection", value = "Provide if you want to acknowledge approval rejection of a order request", required = false) @RequestParam(name = "ackReqRejection", required = false) Boolean ackReqRejection) {

		return orderService.partialUpdateOrder(id, txnType, subTxnType, actionType, orderPatchUpdateDto,
				ackReqRejection);
	}

	/**
	 * 
	 * This method will delete the Order by id
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param remarks
	 */
	@DeleteMapping("{id}")
	@PreAuthorize(ORDER_DELETE_PERMISSION)
	@ApiOperation(value = "API to delete Order", notes = "This API will delete order by id.<br>")
	public void deleteOrder(
			@ApiParam(name = "id", value = "'id' to delete order", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "remarks", value = "Provide remarks, if any ", required = false) @RequestParam(name = "remarks", required = false) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_255) String remarks) {

		orderService.deleteOrder(id, txnType, subTxnType, remarks);
	}

	/**
	 * This method will update price for all items of order based on order id
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return OrderAndItemIdResponseDto
	 */
	@PatchMapping("{id}/price")
	@PreAuthorize(ORDER_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to update price details of Order", notes = "This API will update price details of all items of Order based on Order id."
			+ "<b>actionType</b> as <b>RATE_FREEZE</b> to be passed to update price details to Freeze the confirmed order")
	public OrderAndItemIdResponseDto updateAllItemPrice(
			@ApiParam(name = "id", value = "'id' of the order", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "actionType", value = "transaction action to be performed", allowableValues = "RATE_FREEZE", required = false) @RequestParam(name = "actionType", required = false) @ValueOfEnum(enumClass = TransactionActionTypeEnum.class) String actionType) {

		return orderService.updateAllItemPrice(id, txnType, subTxnType, actionType);
	}

	@ApiPageable
	@GetMapping
	@PreAuthorize(ORDER_VIEW_PERMISSION)
	@ApiOperation(value = "API to list orders", notes = "This API will list orders eligible for the selected function type")
	public PagedRestResponse<List<OrderTransactionDetailsDto>> listOrders(
			@ApiParam(name = "actionType", value = "transaction action to be performed", allowableValues = "CANCEL,ACTIVATE,RATE_FREEZE,ADD_PAYMENT,VIEW_ORDERS", required = true) @RequestParam(name = "actionType", required = true) @ValueOfEnum(enumClass = TransactionActionTypeEnum.class) String actionType,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "docNo", value = "Provide, if you want to search by doc No", required = false) @RequestParam(name = "docNo", required = false) Integer docNo,
			@ApiParam(name = "fiscalYear", value = "Provide, if you want to search by fiscal Year", required = false) @RequestParam(name = "fiscalYear", required = false) Short fiscalYear,
			@ApiParam(name = "mobileNumber", value = "Provide, if you want to search by Mobile Number", required = false) @RequestParam(name = "mobileNumber", required = false) @PatternCheck(regexp = RegExConstants.TELE_MOBILE_NO_REGEX) String mobileNumber,
			@ApiIgnore Pageable pageable) {
		return orderService.listOrders(txnType, actionType, docNo, fiscalYear, mobileNumber, pageable);
	}

	/**
	 * this method is used to validate metal rate while confirming the cash memo
	 * this api is called while confirming the advance booking
	 * @return
	 */
	@PostMapping("validate-metal-Rate")
	public void validateMetalRate(
			@ApiParam(name = "id", value = "'id' to edit cash memo", required = true) @RequestParam(name = "id", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "status", value = "'status' to update", allowableValues = "HOLD, CONFIRMED, APPROVAL_PENDING", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(name = "body", value = "Standard Metal Rate", required = true) @RequestBody MetalRateListDto metalRateList) {
		orderService.validateMetalRate(id, txnType, subTxnType, status, metalRateList);;
	}
			
}
