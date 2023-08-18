/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.core.dto.CustomerTcsData;
import com.titan.poss.core.dto.CustomerTcsDetailsResponseDto;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dto.CashMemoUpdateDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.request.CashMemoPatchUpdateDto;
import com.titan.poss.sales.dto.request.OrderToCashMemoRequestDto;
import com.titan.poss.sales.dto.response.CashMemoAndDetialsIdResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.TransactionResponseDto;

/**
 * Service interface for Cash Memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface CashMemoService {

	/**
	 * This method will put the cash memo on open status.
	 * 
	 * @param transactionCreateDto
	 * @param transactionType
	 * @param subTxnType
	 * @return ManualBillVerifyDto
	 */
	TransactionResponseDto openCashMemo(TransactionCreateDto transactionCreateDto, String transactionType,
			String subTxnType);

	/**
	 * This method will update the cash memo on hold/confirm w.r.t id and status.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param cashMemoUpdateDto
	 * @param status
	 * @return CashMemoResponseDto
	 */
	CashMemoResponseDto updateCashMemo(String id, String transactionType, String subTxnType,
			CashMemoUpdateDto cashMemoUpdateDto, String status);

	/**
	 * This method will update cash memo details partially.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param cashMemoPatchUpdateDto
	 * @return CashMemoAndDetialsIdResponseDto
	 */
	CashMemoAndDetialsIdResponseDto partialUpdateCashMemo(String id, String transactionType, String subTxnType,
			CashMemoPatchUpdateDto cashMemoPatchUpdateDto);

	/**
	 * This method will get cash memo by id.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @return CashMemoAndDetialsIdResponseDto
	 */
	CashMemoAndDetialsIdResponseDto getCashMemo(String id, String transactionType, String subTxnType);

	/**
	 * This method will delete cash memo by id.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param remarks
	 */
	void deleteCashMemo(String id, String transactionType, String subTxnType, String remarks);

	/**
	 * This method will update price for all items in cash memo based on cash memo
	 * id.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @return CashMemoAndDetialsIdResponseDto
	 */
	CashMemoAndDetialsIdResponseDto updateAllItemPrice(String id, String transactionType, String subTxnType);

	/**
	 * This method will convert order to cash memo
	 * 
	 * @param orderToCashMemoRequestDto
	 * @return
	 */
	CashMemoAndDetialsIdResponseDto convertOrderToCM(OrderToCashMemoRequestDto orderToCashMemoRequestDto,
			String transactionType, String subTxnType);

	/**
	 * This method will validate CM for Cash memo & remove items from inventory or
	 * activate GC based on subTxnType.
	 * 
	 * @param cashMemoUpdateDto
	 * @param cashMemoDao
	 * @param cashMemoDetailsDaoList
	 * @return List<InventoryDetailsDao>
	 */
	PublishResponse confirmCashMemo(CashMemoUpdateDto cashMemoUpdateDto, CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList);

	CustomerTcsDetailsResponseDto retrieveTcsPaymentDetails(String cashMemoId, String txnType, String subTxnType);

	CustomerTcsData retrieveTcsData(String customerMobileNo, Short fiscalYear, String btqPanCard);

	
	void validateMetalRate(String id,String txnType,String subTxnType,String status,MetalRateListDto metalRateListDto);

}
