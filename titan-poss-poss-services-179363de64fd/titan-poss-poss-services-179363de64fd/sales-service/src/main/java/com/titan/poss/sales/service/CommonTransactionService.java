/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceItemDetailsDto;
import com.titan.poss.core.dto.EventCustomerDetailsDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PaymentCodeAndGroup;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.UploadFileTypeEnum;
import com.titan.poss.sales.dto.request.HallmarkGstRequestDto;
import com.titan.poss.sales.dto.request.SalesItemDto;
import com.titan.poss.sales.dto.request.WeightDetailsAndQtyDto;
import com.titan.poss.sales.dto.response.GepAndItemIdDetailsResponseDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.dto.response.UpdateInvItemAndSalesItemDto;

/**
 * Service interface for common sales transactions.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface CommonTransactionService {

	/**
	 * This method will check transaction before updating.
	 * 
	 * @param status
	 */
	void checkTranscationStatusForUpdate(String status);

	/**
	 * This method will check saved, input and system metal rates based on status.
	 * 
	 * if - to add or update item, then isHeaderCheck will be 'false' and status
	 * will be same as salesTxn status. if - to HOLD or CONFIRM status will sent as
	 * HOLD or CONFIRM.
	 * 
	 * @param salesTxnDao
	 * @param inputMetalRateList
	 * @param status
	 * @param isHeaderCheck
	 * @param metalToBeIgnoredForRateCheck
	 * @param isAvoidMetalRateCheck        (either for price update or isFrozenRate)
	 */
	void checkMetalRate(SalesTxnDaoExt salesTxnDao, MetalRateListDto inputMetalRateList, TransactionStatusEnum status,
			boolean isHeaderCheck, BigDecimal holdTime, boolean isAvoidMetalRateCheck,
			Set<String> metalToBeIgnoredForRateCheck);

	/**
	 * This method will get metal rate
	 * 
	 * @return MetalRateListDto
	 */
	MetalRateListDto getMetalRate();

	/**
	 * This method will return the total paid value. If payment status is given,
	 * then will retrieve total amount based on status.
	 * 
	 * @param transactionId
	 * @param paymentCodeList
	 * @param paymentStatus
	 * @return BigDecimal
	 */
	BigDecimal paidValue(String transactionId, List<String> paymentCodeList, String paymentStatus);

	/**
	 * This method will do payment check to restrict hold or customer change or
	 * delete cash memo.
	 * 
	 * @param salesTxnDao
	 * @param paymentCodeList
	 * @param isAbInvokedCmDelete -- ignore linked Credit notes here
	 */
	BigDecimal paymentCheck(SalesTxnDaoExt salesTxnDao, List<String> paymentCodeList, boolean isAbInvokedCmDelete);

	/**
	 * This method will validate manual bill details.
	 * 
	 * @param transactionCreateDto
	 * @param salesTxnDao
	 */
	void validateManualBillDetails(TransactionCreateDto transactionCreateDto, SalesTxnDaoExt salesTxnDao);

	/**
	 * This method will give sales txn details.
	 * 
	 * @param transactionCreateDto
	 * @param txnType
	 * @param subTxnType
	 * @param docType
	 * @return SalesTxnDao
	 */
	SalesTxnDaoExt getSalesTxnDao(SalesTxnDaoExt salesTxnDao, String txnType, String subTxnType,
			SalesDocTypeEnum docType, TransactionStatusEnum status);

	/**
	 * This method will validate txn and subTxn types.
	 * 
	 * @param txnType
	 * @param subTxnType
	 */
	void txnTypeAndSubTxnTypeValidation(String txnType, String subTxnType);

	/**
	 * This method will return rounding variance based on totalValue.
	 * 
	 * @param totalValue
	 * @return BigDecimal
	 */
	BigDecimal getRoundingVariance(BigDecimal totalValue);

	/**
	 * @param cashMemoId
	 * @param transactionType
	 * @return
	 */
	CashMemoDaoExt getCashMemoByIdWithError(String cashMemoId, String transactionType);

	/**
	 * This method will check totalWeight and finalValue of transaction matches
	 * manual bill values or not. 'isConfirmTxn' is true when transaction is to be
	 * 'CONFIRM', and finalValue and totalWeight should be equal to manual bill
	 * details. 'isConfirmTxn' is false when item is added or updated, and
	 * finalValue and totalWeight should not be greater than manual bill details.
	 * 
	 * @param totalWeight
	 * @param finalValue
	 * @param salesTxnDao
	 * @param isConfirmTxn
	 * @param weightDetails
	 * @return ManualBillTxnDetailsDto
	 */
	ManualBillTxnDetailsDto manualBillValuesWithHeader(BigDecimal totalWeight, BigDecimal finalValue,
			SalesTxnDaoExt salesTxnDao, boolean isConfirmTxn, WeightDetailsDto weightDetails);

	void updateCustomerDetails(Integer customerId, SalesTxnDaoExt salesTxnDao);

	void setHoldTime(SalesTxnDaoExt salesTxnDao);

	/**
	 * This method will check input status. Allowed input status are: HOLD and
	 * CONFIRMED.
	 * 
	 * @param status
	 * @param subTxnType
	 */
	void checkInputStatus(String status, String subTxnType);

	/**
	 * This method will if check PAN and mobile number of the customer exists if
	 * final value is greater than 2 Lakh rupees.
	 * 
	 * @param finalValue
	 * @param salesTxnDao
	 */
	void customerDetailsCheckForFinalValue(BigDecimal finalValue, SalesTxnDaoExt salesTxnDao);

	/**
	 * @param customerId
	 * @param status
	 * @param empCode
	 * @param salesDocType
	 * @param transactionType
	 * @param subTxnType
	 * @param refSalesTxn
	 * @param refTxnType
	 * @return SalesTxnDao
	 */
	SalesTxnDaoExt createSalesTxnObj(Integer customerId, String empCode, TransactionStatusEnum status,
			SalesDocTypeEnum salesDocType, TransactionTypeEnum transactionType, SubTxnTypeEnum subTxnType,
			SalesTxnDaoExt refSalesTxn, String refTxnType);

	/**
	 * @param salesTxn
	 * @return
	 */
	SalesTxnDaoExt saveSalesTxn(SalesTxnDaoExt salesTxn);

	/**
	 * @param customerId
	 * @param salesTxnDao
	 * @param saveSalesTxn
	 * @param isGHSUpdate
	 * @return SalesTxnDaoExt
	 */
	SalesTxnDaoExt updateCustomerDetails(Integer customerId, SalesTxnDaoExt salesTxnDao, boolean saveSalesTxn,
			boolean isGHSUpdate);

	/**
	 * @param status
	 * @param txnTypeAllowed
	 * @param allowedStatus
	 */
	void verifyStatus(String status, TransactionTypeEnum txnTypeAllowed, List<String> allowedStatus);

	MetalRateListDto mapMetalRateJsonToDto(String metalRateJson);

	/**
	 * @param txnType
	 * @param subTxnType
	 */
	void validateTxnAndSubTxnType(TransactionTypeEnum allowedTxnType, String txnType, String subTxnType);

	/**
	 * @param salesDocType
	 * @param salesTxn
	 * @return
	 */
	SalesTxnDaoExt setNewDocNoByDocType(SalesDocTypeEnum salesDocType, SalesTxnDaoExt salesTxn);

	/**
	 * Verify if metal rates changed or not based on rate saved in DB
	 * 
	 * @param existingMetalRateList
	 */
	void validateLatestMetalRate(MetalRateListDto existingMetalRateList);

	/**
	 * this method will map string json value to DTO.
	 * 
	 * @param manualBillDetails
	 * @return ManualBillTxnDetailsDto
	 */
	ManualBillTxnDetailsDto mapJsonToManualBillDetails(String manualBillDetails);

	/**
	 * @param totalValue
	 * @param totalDiscount
	 * @param taxDetails
	 * @return BigDecimal
	 */
	BigDecimal getTaxDetails(BigDecimal totalValue, BigDecimal totalDiscount, TaxCalculationResponseDto taxDetails);

	/**
	 * This method will restrict item add or update or delete if certain payments
	 * are done. If 'isPriceUpdate' then check payment item mapping also.
	 * 
	 * @param salesTxnDao
	 * @param isCustomerUpdate
	 * @param isPriceUpdate
	 * @param isGhsUpdate
	 */
	void paymentCheckForItemORCustomerUpdate(SalesTxnDaoExt salesTxnDao, boolean isCustomerUpdate,
			boolean isPriceUpdate, boolean isGhsUpdate);

	/**
	 * This method will return total tax and tax details based on given inputs.
	 * 
	 * @param customerId
	 * @param itemCode
	 * @param totalValue
	 * @param totalDiscount
	 * @param taxTxnType
	 * @param taxDetails
	 * @param hallmarkGstRequestDto
	 * @return TotalTaxAndTaxDetailsDto
	 */
	TotalTaxAndTaxDetailsDto getTotalTaxDetails(Integer customerId, String itemCode, BigDecimal totalValue,
			BigDecimal totalDiscount, TxnTaxTypeEnum taxTxnType, TaxCalculationResponseDto taxDetails,
			HallmarkGstRequestDto hallmarkGstRequestDto);

	/**
	 * This method will return total tax and tax details based on given inputs.
	 * 
	 * @param customerId
	 * @param itemCode
	 * @param totalValue
	 * @param totalDiscount
	 * @param taxTxnType
	 * @param taxDetails
	 * @param hallmarkGstRequestDto
	 * @param isIGST
	 * @return TotalTaxAndTaxDetailsDto
	 */
	TotalTaxAndTaxDetailsDto getTotalTaxDetails(Integer customerId, String itemCode, BigDecimal totalValue,
			BigDecimal totalDiscount, TxnTaxTypeEnum taxTxnType, TaxCalculationResponseDto taxDetails,
			HallmarkGstRequestDto hallmarkGstRequestDto, Boolean isIGST);

	/**
	 * This method will reverse calculate total tax for UCP items based on given
	 * inputs to get item value without tax. NOTE: this function to be used for UCP
	 * items only.
	 * 
	 * @param customerId
	 * @param itemCode
	 * @param finalValue
	 * @param taxTxnType
	 * @param taxDetails
	 * @return TotalTaxAndTaxDetailsDto
	 */
	TotalTaxAndTaxDetailsDto reverseTotalTaxDetails(Integer customerId, String itemCode, BigDecimal finalValue,
			TxnTaxTypeEnum taxTxnType, TaxCalculationResponseDto taxDetails);

	/**
	 * @param allowedTxnType
	 * @param txnType
	 * @param subTxnType
	 */
	void validateTxnAndSubTxnTypeCancel(List<String> allowedTxnType, String txnType, String subTxnType);

	/**
	 * This method used to validate cash memo item w.r.t inventory data.
	 * 
	 * @param invId
	 * @param invWeight
	 * @param reqQty
	 * @return InventoryItemDto
	 */
	InventoryItemDto getInvetoryItemDetails(String invId, BigDecimal invWeight, Short reqQty);

	/**
	 * This method used to validate cash memo coins w.r.t inventory data
	 * 
	 * @param itemCode
	 * @param invWeight
	 * @param reqQty
	 * @return CoinDetailsDto
	 */
	CoinDetailsDto getInventoryCoinDetails(String itemCode, BigDecimal invWeight, Short reqQty);

	/**
	 * This method will get the final value of item ONLY.
	 * 
	 * @param totalValue
	 * @param totalDiscount
	 * @param totalTax
	 * @param hallmarkCharges
	 * @param hallmarkDiscount
	 * @return BigDecimal
	 */
	BigDecimal getItemFinalValue(BigDecimal totalValue, BigDecimal totalDiscount, BigDecimal totalTax,
			BigDecimal hallmarkCharges, BigDecimal hallmarkDiscount);

	/**
	 * This method will get inventory and sales details to update.
	 * 
	 * @param salesItemDtoList
	 * @param binGroupCode
	 * @return UpdateInvItemAndSalesItemDto
	 */
	UpdateInvItemAndSalesItemDto getInvIdsAndSalesItemsForUpdate(List<SalesItemDto> salesItemDtoList,
			List<String> binGroupCodeList);

	/**
	 * This method will check if remarks is mandatory for txn, for the given input
	 * status.
	 * 
	 * @param status
	 * @param txnType
	 * @param remarks
	 */
	void checkRemarksForTxnBasedOnInputStatus(String status, String txnType, String remarks);

	/**
	 * Method to get payment details Group by Payment code & Group
	 * 
	 * @param salesTxn
	 * @param -excludePaymentsWithCn - If CN need to be generated only for Newly
	 *                               Added payments(Used during Add payments to
	 *                               existing orders)
	 * 
	 * @return
	 */
	Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> getPaymentMapDetailsByTxnId(SalesTxnDaoExt salesTxn,
			boolean excludeOldPayments, boolean isAllPayments);

	/**
	 * This method will get the total weight split details for a transaction based
	 * on metal type.
	 * 
	 * 
	 * @param weightDetailsListAndQtyList
	 * @return WeightDetailsDto
	 */
	WeightDetailsDto getTotalWeightSplitDetails(Map<String, WeightDetailsAndQtyDto> weightDetailsListAndQtyList);

	/**
	 * This method will sum up the split weight details at Header level
	 * 
	 * @param weightDetailsList
	 * @return
	 */
	WeightDetailsDto sumUpWeightDetails(List<String> weightDetailsList);

	GepAndItemIdDetailsResponseDto getGoodsExchangeAndItemIdDetails(GoodsExchangeDaoExt goodsExchangeDao,
			List<GoodsExchangeDetailsDaoExt> goodsDetailsList);

	/**
	 * This method will check if sales transaction exists based on salesTxnId.
	 * 
	 * @param transactionId
	 * @param transactionType
	 * @return SalesTxnDao
	 */
	SalesTxnDaoExt checkIfSalesTxnIdExistsWithTransactionType(String transactionId, String transactionType);

	/**
	 * This method will check payments done to a given item.
	 * 
	 * @param itemId
	 */
	void checkPaymentItemMapping(String itemId);

	/**
	 * This method will validate metal rates. If hold time is expired, then send
	 * 'true' for isHoldTimeExpired.
	 * 
	 * if 'isPriceUpdate' is true, then do not throw error________________________
	 * if 'isCheckAgainstCurrentRate' is true, then check if any new metal rate is
	 * set. If yes, then rate should be saved in salesTxnDao._____________________
	 * NOTE: 'isCheckAgainstCurrentRate' is true, 'secondMetalRateList' should
	 * always be the current metal rate.
	 * 
	 * @param firstMetalRateList
	 * @param secondMetalRateList
	 * @param isHoldTimeExpired
	 * @param metalToBeIgnoredForRateCheck
	 * @param isPriceUpdate
	 * @return isMetalRateChanged
	 */
	boolean validateMetalRate(MetalRateListDto firstMetalRateList, MetalRateListDto secondMetalRateList,
			boolean isHoldTimeExpired, Set<String> metalToBeIgnoredForRateCheck, boolean isPriceUpdate,
			boolean isCheckAgainstCurrentRate);

	/**
	 * @param txnId
	 * @param fileType
	 */
	void setFileTypeUploadInSalesTxn(String txnId, UploadFileTypeEnum fileType);

	/**
	 * This method will tell if the transaction is within hold time or not.
	 * 
	 * @param salesTxnDao
	 * @param holdTimeDurationInMin
	 * @return boolean
	 */
	boolean holdTimeCheck(SalesTxnDaoExt salesTxnDao, BigDecimal holdTimeDurationInMin);

	/**
	 * This method will vaidate discount details.
	 * 
	 * @param salesTxnDao
	 * @param discountDetails
	 */
	void checkDiscountDetails(SalesTxnDaoExt salesTxnDao, JsonData discountDetails);

	/**
	 * Method to validate discount details on confirm of a transaction AB/CM
	 * 
	 * @param salesTxn
	 */
	void discountValidationsOnConfirmTransaction(SalesTxnDaoExt salesTxn);

	/**
	 * Method to validate customer dependent discount details on Customer update
	 * 
	 * @param salesTxn
	 * @param newCustomerIdForUpdate
	 */
	void discountValidationsOnCustomerUpdate(SalesTxnDaoExt salesTxn, Integer newCustomerIdForUpdate);

	EinvoiceIrnDetailsResponseDto generateInvoice(String txnType,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, SalesTxnDaoExt salesTxn,
			GoodsExchangeDaoExt goodsExchangeDaoExt, CustomerTxnDaoExt customerTxnDaoExt);

	EinvoiceIrnDetailsDto getCustomerDetails(String instiTaxNo, String customerName, String customerDetails,
			Integer docNo, Date docDate);

	EinvoiceItemDetailsDto getTaxDetails(TaxCalculationResponseDto taxCalculationResponseDto,
			EinvoiceItemDetailsDto einvoiceItemDetails);

	EventCustomerDetailsDto getEventCustomer(CustomerTxnDaoExt customer);

	/**
	 * This method will validate input hallmark charges.
	 * 
	 * @param priceResponseDto
	 * @param inputHallmarkCharge
	 * @param inputHallmarkDiscount
	 */
	void hallmarkValuesValidation(PriceResponseDto priceResponseDto, BigDecimal inputHallmarkCharge,
			BigDecimal inputHallmarkDiscount);

	/**
	 * This method will throw error if any item/discount update happens after TCS
	 * amount is added.
	 * 
	 * @param salesTxnDao
	 * @param isCustomerUpdate
	 */
	void checkIfTcsAmountIsAdded(SalesTxnDaoExt salesTxnDao, boolean isCustomerUpdate);

	/**
	 * This method is used to check if item added in CM/AB/CO belongs to allowed
	 * type selected on addition of 'rateFreezed' CN.
	 * 
	 * @param productGroupCode
	 * @param rateFreezedCNPayment
	 * @param itemMasterDetailsList
	 */
	void checkItemType(String productGroupCode, PaymentDetailsDaoExt rateFreezedCNPayment,
			List<ItemDto> itemMasterDetailsList);

	/**
	 * This method will get the total weight split details for a transaction based
	 * on metal type.
	 * 
	 * 
	 * @param weightDetailsListAndQtyList
	 * @return WeightDetailsDto
	 */
	WeightDetailsDto getTotalWeightSplitDetailsForManualBill(Map<String, BigDecimal> weightDetailsListAndQtyList);

	GepAndItemIdDetailsResponseDto getCutPeiceGoodsExchangeAndItemIdDetails(StockTransactionDaoExt stockTransaction,
			List<StockTransactionDetailsDaoExt> stockTxnList);

	SalesTxnDaoExt saveSalesTxnForLegacyPulledCM(SalesTxnDaoExt salesTxnDaoExt, String txnType);

	/**
	 * This method used to validate cash memo item w.r.t inventory data.
	 * 
	 * @param invId
	 * @param invWeight
	 * @param reqQty
	 * @return InventoryItemDto
	 */
	InventoryItemDto getInvetoryItemDetailsByItemCodeAndLotNumber(String invId, BigDecimal invWeight, Short reqQty,
			String itemCode, String lotNumber);

	/**
	 * This method will vaidate nominee details.
	 * 
	 * @param orderDao
	 * @param nomineeDetails
	 */
	void checkNomineeDetails(OrderDaoExt orderDao, JsonData nomineeDetails);

	/**
	 * This method will check if any items in CM are in ADJ/PSV Request.
	 * 
	 * @param itemDetails
	 */
	void checkIfItemsAreInRequest(List<UpdateInventoryDto> itemDetails);

	boolean validateCustomerFields(Integer customerId);

	/** This method will update payments in new transaction. Currently used in GV
	 * payment save.
	 * 
	 * @param paymentMap
	 */
	void savePaymentInNewTransaction(Map<String, String> paymentMap);

	/**
	 * This method will send the final document number or confirmation number to
	 * e-GHS application.
	 * 
	 * @param salesTxnDaoExt
	 * @param ghsPaymentList
	 * @param ghsPaymentIdAndCreditNoteMap
	 * @param ghsPaymentOtherDetalisMap
	 */
	void finalConfirmForGhsPayments(SalesTxnDaoExt salesTxnDaoExt, List<PaymentDetailsDaoExt> ghsPaymentList,
			Map<String, CreditNoteDaoExt> ghsPaymentIdAndCreditNoteMap,
			Map<String, GhsPaymentOtherDetailsDto> ghsPaymentOtherDetalisMap);

	void manualCmOrAbCheck(SalesTxnDaoExt salesTxnDao,String itemTypeCode);
	
	void copyInvoiceDocuments();
	
}
