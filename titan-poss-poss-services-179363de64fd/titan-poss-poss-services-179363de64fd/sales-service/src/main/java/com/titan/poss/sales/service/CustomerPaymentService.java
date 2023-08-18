/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CashPaidDetailsDto;
import com.titan.poss.core.dto.TotalCashPaidDetailsDto;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.GiftDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.response.CashLimitResponseDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;

/**
 * Service interface for Customer Payments(mainly for cash limit checks).
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CustomerPaymentService {

	/**
	 * This method will add customer payments with cash element.
	 * 
	 * @param salesTxn
	 * @param giftDetailsDaoList
	 * @param paymentDetailsList
	 * @param finalValue
	 * @param roundingValue
	 * @param isCancellation
	 * @param rationOfAmtForCash
	 * @return List<String>
	 */
	List<String> addCustomerPayment(SalesTxnDaoExt salesTxn, List<GiftDetailsDaoExt> giftDetailsDaoList,
			List<PaymentDetailsDaoExt> paymentDetailsList, BigDecimal finalValue, BigDecimal roundingValue,
			boolean isCancellation, BigDecimal rationOfAmtForCash);

	/**
	 * This method will get the cash limit for a given customer and txn type.
	 * 
	 * @param customerType
	 * @param searchValue
	 * @param txnType
	 * @param businessDate
	 * @param instrumentDate
	 * @return CashLimitResponseDto
	 * @param cashPaymentRuleDetails
	 */
	CashLimitResponseDto getCashLimit(String customerType, String searchValue, String txnType, Date businessDate,
			Date instrumentDate, String ulpId);

	/**
	 * This method will give the max cash limit for a given transaction based on
	 * input parameters.
	 * 
	 * @param instrumentCashAmountDto
	 * @param paymentCode
	 * @param instrumentNo
	 * @param salesTxnDao
	 * @param customerId
	 * @param isEligibleAmountCheck
	 * @return InstrumentCashAmountDto
	 */
	InstrumentCashAmountDto cashLimitCheck(InstrumentCashAmountDto instrumentCashAmountDto, String paymentCode,
			String instrumentNo, SalesTxnDaoExt salesTxnDao, Integer customerId, boolean isEligibleAmountCheck);

	/**
	 * Get cash paid for the instrument.
	 * 
	 * @param instrumentNo
	 * @return InstrumentCashAmountDto
	 */
	InstrumentCashAmountDto getCashPaidForTheInstrument(String instrumentNo);

	/**
	 * This method will get the total cash paid based on search type and value along
	 * with location code.
	 * 
	 * @param searchType
	 * @param searchValue
	 * @param businessDate
	 * @param locationCode
	 * @return CashPaidDetailsDto
	 */
	CashPaidDetailsDto getTotalCashPaid(String searchType, String searchValue, String businessDate,
			String locationCode);
	
	String getCustomerUniqueIdentifier(CustomerDao customerDao);

	TotalCashPaidDetailsDto getPmlaOfCustomer(String ulpId, String businessDate);
}
