/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.OrderPatchUpdateDto;
import com.titan.poss.sales.dto.request.OrderUpdateDto;
import com.titan.poss.sales.dto.response.OrderAndItemIdResponseDto;
import com.titan.poss.sales.dto.response.OrderResponseDto;
import com.titan.poss.sales.dto.response.OrderTransactionDetailsDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.TransactionResponseDto;

/**
 * Service Interface for Order
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface OrderService {

	/**
	 * This method will initiate the order transactions with OPEN status
	 * 
	 * @param transactionCreateDto
	 * @param transactionType
	 * @param subTxnType
	 * @return TransactionResponseDto
	 */
	TransactionResponseDto openOrder(TransactionCreateDto transactionCreateDto, String transactionType,
			String subTxnType);

	/**
	 * This method will get order by id.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @return OrderAndItemIdResponseDto
	 */
	OrderAndItemIdResponseDto getOrder(String id, String transactionType, String subTxnType);

	/**
	 * This method will update the order to hold/confirm/approval_pending w.r.t id
	 * and status.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param orderUpdateDto
	 * @param status
	 * @return OrderResponseDto
	 */
	OrderResponseDto updateOrder(String id, String transactionType, String subTxnType, OrderUpdateDto orderUpdateDto,
			String status);

	/**
	 * This method will update order details partially.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param action
	 * @param orderPatchUpdateDto
	 * @return OrderAndItemIdResponseDto
	 */
	OrderAndItemIdResponseDto partialUpdateOrder(String id, String transactionType, String subTxnType,
			String actionType, OrderPatchUpdateDto orderPatchUpdateDto, Boolean ackReqRejection);

	/**
	 * This method will delete order by id.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param remarks
	 */
	void deleteOrder(String id, String transactionType, String subTxnType, String remarks);

	/**
	 * This method will update price for all items in order based on order id.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param actionType
	 * @return OrderAndItemIdResponseDto
	 */
	OrderAndItemIdResponseDto updateAllItemPrice(String id, String transactionType, String subTxnType,
			String actionType);

	/**
	 * This method list orders
	 * 
	 * @param txnType
	 * @param actionType
	 * @param docNo
	 * @param fiscalYear
	 * @param mobileNumber
	 * @return
	 */
	PagedRestResponse<List<OrderTransactionDetailsDto>> listOrders(String txnType, String actionType, Integer docNo,
			Short fiscalYear, String mobileNumber, Pageable pageable);

	PublishResponse partialUpdateOrderTransactional(String id, String transactionType, String subTxnType,
			String actionType, OrderPatchUpdateDto orderPatchUpdateDto, Boolean ackReqRejection);

	PublishResponse updateOrderTransactional(String id, String transactionType, String subTxnType,
			OrderUpdateDto orderUpdateDto, String status);
	
	//***********************CUSTOMER ORDER SPECIFIC INTERFACE METHODS**************************//
	
	TransactionResponseDto openCustomerOrder(TransactionCreateDto transactionCreateDto,
			@ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType);
	
	void validateMetalRate(String id,String txnType,String subTxnType,String status,MetalRateListDto metalRateListDto);
	
}
