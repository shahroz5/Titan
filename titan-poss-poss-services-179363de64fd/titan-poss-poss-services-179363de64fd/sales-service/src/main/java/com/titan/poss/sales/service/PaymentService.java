/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.enums.CNType;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;

/**
 * Service interface for Payment
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface PaymentService {

	/**
	 * This method will validate input fields of payment create dto.
	 * 
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */
	SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto);

	/**
	 * This method will validate location config details for the given payment code,
	 * payment group and input fields.
	 * 
	 * @param paymentCode
	 * @param paymentGroup
	 * @param salesTxnDao
	 * @param salesPaymentDto
	 * @return SalesPaymentDto
	 */
	SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto);

	/**
	 * This method will validate payment config details for the given payment code,
	 * transaction details and input fields.
	 * 
	 * @param paymentCode
	 * @param paymentGroup
	 * @param dueAmount
	 * @param totalTxnAmount
	 * @param paymentDetailsDao
	 * @return Map<PaymentDetailsDaoExt,List<PaymentItemMappingDao>>
	 */
	Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao);

	/**
	 * This method will trigger payment.
	 * 
	 * @param paymentDetailsDao
	 * @param salesPaymentDto
	 * @return PaymentDetailsDao
	 */
	PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao, SalesPaymentDto salesPaymentDto);

	/**
	 * This method will validate payment by payment and otp.
	 * 
	 * @param paymentDetailsDao
	 * @param otp
	 * @return SalesPaymentDto
	 */
	SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp);

	/**
	 * This method will validate and update payment details based on payment status
	 * and payment update dto.
	 * 
	 * @param paymentCode
	 * @param status
	 * @param paymentUpdateDto
	 * @param paymentDetailsDao
	 * @return SalesPaymentDto
	 */
	SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao);

	/**
	 * This method will void transactions based payment id
	 * 
	 * @param paymentDetailsDao
	 */
	void deletePayment(PaymentDetailsDaoExt paymentDetailsDao);

	// pending
	/**
	 * This method will confirm payment based payment details and status.
	 * 
	 * @param paymentDetailsDao
	 * @param status
	 * @return PaymentDetailsDao
	 */
	PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status);

	/**
	 * Cancel payment details & return CN doc numbers if CN got created
	 * 
	 * @param paymentDetails
	 * @param cancelId
	 * @param salesTxn
	 * @param cancelType
	 * @param creditNoteType
	 * @param cnType
	 * @param docDate        //for EOD
	 * @return Map<String, Integer>
	 */
	Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate);

	/**
	 * Get eligible amount based on input.
	 * 
	 * @param customerId
	 * @param paymentCode
	 * @param salesTxnDao
	 * @param dueAmount
	 * @return InstrumentCashAmountDto
	 */
	InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount);

	/**
	 * This method will delete the transaction based on payment and 'isEditable'
	 * field in it. this method should be used only when deleting payments added
	 * after AB/CO is confirmed. But, the payments are not converted to CNs. Used in
	 * get call of Confirmed AB/CO & EOD job.(No CNs will be generated as part of
	 * this delete)
	 * 
	 * @param paymentDetailsDao
	 */
	void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao);
}
