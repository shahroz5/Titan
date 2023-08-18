/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.EinvoiceJobResponseDto;
import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface SalesJobService {

	SchedulerResponseDto suspendBooking(String locationCode);

	SchedulerResponseDto clearStatus(String locationCode);

	void updateInventoryDetails(List<InventoryDetailsDao> inventoryDetails, Integer docNo, String docType);

	List<InventoryDetailsDao> getInventoryItems(String binCode, String locationCode, Date docDate);

	Integer getDocNumber(short year, String locationCode, String docType);

	SchedulerResponseDto publishToDataSync();

	StockTransactionDao addStockTransaction(String status, String transactionType, String locationCode);

	void updateStockTransaction(StockTransactionDao stockTransaction);

	void addStockTransactionDetails(List<StockTransactionDetailsDao> stockTransactionDetails);

	SchedulerResponseDto deleteOpenTasks();

	/**
	 * This method will delete all the transactions in 'OPEN' and 'HOLD' status at
	 * EOD. It will also reverse or generate Credit notes for payments(if present).
	 * 
	 * @return SchedulerResponseDto.
	 */
	SchedulerResponseDto deleteOpenAndHoldTasksAtEOD();

	SchedulerResponseDto advanceBookingApproval();

	SchedulerResponseDto suspendCreditNote(String locationCode);

	/**
	 * This method will cancel pending bill cancellation requests at EOD.
	 * 
	 * @return SchedulerResponseDto
	 */
	SchedulerResponseDto cancelPendingBillCancelRequests();

	/**
	 * Generate CN for OPEN/HOLD txns at EOD.
	 * 
	 * @param txnIdList
	 * @param paymentDetailsList
	 * @param docDate
	 * @param fiscalYear
	 * @param locationCode
	 */
	void cNForCompletedPayments(Set<String> txnIdList, List<PaymentDetailsDaoExt> paymentDetailsList, Date docDate,
			Short fiscalYear, String locationCode);

	/**
	 * Update CM/AB for OPEN/HOLD txns at EOD.
	 * 
	 * @param txnIdList
	 */
	void updateCMAndAB(Set<String> txnIdList);

	/**
	 * This method will delete payment item mapping.
	 * 
	 * @param paymentIdListForPaymentItemMapDelete
	 */
	void deletePaymentItemMap(List<String> paymentIdListForPaymentItemMapDelete);

	SchedulerResponseDto syncFileToOnlineStorage();

	SchedulerResponseDto deleteDigitalSignatures(String locationCode);

	EinvoiceJobResponseDto updateInvoiceDocuments(InvoiceDocumentsUpdateDto invoiceDocumentsUpdateDto);

	/**
	 * This method is used to clear the payments made after AB/CO confirmation but
	 * no CNs generated for it.
	 * 
	 * @return SchedulerResponseDto
	 */
	SchedulerResponseDto clearAbCoPayments();
	SchedulerResponseDto clearFrozenDetails(String locationCode);
}
