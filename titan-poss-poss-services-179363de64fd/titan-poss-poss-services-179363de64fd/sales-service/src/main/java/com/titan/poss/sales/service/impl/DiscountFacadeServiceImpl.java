/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountValueDetails;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.AdvanceDaoExt;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.DiscountTxnLevelUpdateDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.AdvanceRepositoryExt;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.DiscountFacadeService;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation class for discount
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesDiscountFacadeServiceimpl")
public class DiscountFacadeServiceImpl implements DiscountFacadeService {

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountFactory discountFactory;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private CashMemoRepositoryExt cashMemoRepositoryExt;

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private AdvanceRepositoryExt advanceRepository;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private CommonPaymentService commonPaymentService;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public DiscountResponseDto saveTransactionLevelDiscounts(String transactionId, String txnType, String subTxnType,
			DiscountBillLevelCreateDto discountCreateDto, String discountType) {

		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);
		
		if(discountCreateDto!= null && !discountCreateDto.getDiscountDetails().isEmpty()) {
			for(DiscountBillLevelItemDetailsDto discountList: discountCreateDto.getDiscountDetails()) {
				if(discountList.getDiscountValueDetails()!= null) {
					DiscountValueDetails discountValueDetails=MapperUtil.mapObjToClass(discountList.getDiscountValueDetails(), DiscountValueDetails.class);
					if(discountValueDetails !=null && BooleanUtils.isTrue(discountValueDetails.getIsDiscountPercentage())) {
						log.info("is percentage: ", discountValueDetails.getIsDiscountPercentage());
						if(discountValueDetails.getDiscountPercent()==null)
							throw new ServiceException("Please enter value to apply discount", "ERR-DISC-043",  
							Map.of("discountCode", discountList.getDiscountCode()));
					}
					if(discountValueDetails!=null && BooleanUtils.isFalse(discountValueDetails.getIsDiscountPercentage())) {
						log.info("is percentage: ", discountValueDetails.getIsDiscountPercentage());
						if(discountList.getDiscountValue()==null && discountValueDetails.getDiscountValue()==null)
						throw new ServiceException("Please enter value to apply discount", "ERR-DISC-043",  
								Map.of("discountCode", discountList.getDiscountCode()));
					}
				}
			}
		}

		// Validate and create BILL_LEVEL
		return validateAndCreateDiscountDetails(discountCreateDto, salesTxn, discountType);

	}

	@Override
	public DiscountResponseDto listTransactionLevelDiscounts(String transactionId, String txnType, String subTxnType,
			String applicableLevel, String discountType, String status) {

		// Validate sales transaction
		commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId, txnType);

		List<DiscountDetailResponseDto> discountDetailsResponseList = new ArrayList<>();

		// Get Bill level discount details - Irrespective of discount type
		getBillLevelDiscountDetails(transactionId, applicableLevel, discountType, status, discountDetailsResponseList);

		return new DiscountResponseDto(discountDetailsResponseList);
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public void deleteTransactionLevelDiscount(String transactionId, String txnType, String subTxnType,
			String discountTxnId) {

		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		DiscountDetailsDaoExt discountDetailsDaoExt = getDiscountDetailsIfExists(discountTxnId, salesTxn);

		// call factory service to invoke appropriate service implementation w.r.t
		// discountType.
		DiscountService discountService = discountFactory.getDiscountService(discountDetailsDaoExt.getDiscountType());

		discountUtilService.removeRivaahDiscounts(salesTxn);
		// ----------Discount type specific operations----------

		discountService.deleteDiscount(salesTxn, discountDetailsDaoExt);

		discountUtilService.validateRivaahDiscounts(salesTxn);

	}

	@Override
	@Transactional
	public void updateTransactionLevelDiscount(String transactionId, String txnType, String subTxnType,
			String discountType, Boolean isPriceUpdate, String discountTxnId,
			DiscountTxnLevelUpdateDto discountUpdateDto) {

		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to update discount
		discountUtilService.checkSalesTranscationStatusForDiscount(salesTxn.getStatus(), txnType);

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		List<DiscountDetailsDaoExt> billLevelDiscountDetailsDaoList = new ArrayList<>();
		// If particular discount id is passed, Update only the particular discount
		// details
		if (!StringUtils.isEmpty(discountTxnId)) {
			Optional<DiscountDetailsDaoExt> discountDetailsDao = discountDetailsRepository.findById(discountTxnId);

			if (discountDetailsDao.isPresent()) {
				if (StringUtils.isEmpty(discountUpdateDto) || (!StringUtils.isEmpty(discountUpdateDto)
						&& BooleanUtils.isFalse(discountUpdateDto.getIsEdited()))) {
					throw new ServiceException(
							SalesConstants.INVALID_REQUEST + "Updated discount details is Mandatory in request body",
							SalesConstants.ERR_SALE_294,
							Map.of(SalesConstants.REMARKS, "Updated discount details is Mandatory in request body"));
				}
				discountDetailsDao.get().setIsEdited(discountUpdateDto.getIsEdited());
				discountDetailsDao.get().setDiscountValue(discountUpdateDto.getDiscountValue()
						.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
				discountDetailsDao.get().setDiscountValueDetails(
						MapperUtil.getStringFromJson(discountUpdateDto.getDiscountValueDetails()));
				billLevelDiscountDetailsDaoList.add(discountDetailsDao.get());
			}
		}

		// If discount type is passed re apportion for specified discount only
		// or re apportion for all bill level discounts applied
		billLevelDiscountDetailsDaoList = discountDetailsRepository.findAllSalesTransactionDiscounts(transactionId,
				DiscountApplicableLevelEnum.BILL_LEVEL.name(), discountType, null);

		if (CollectionUtils.isEmpty(billLevelDiscountDetailsDaoList)) {
			return;
		}

		billLevelDiscountDetailsDaoList.forEach(billLevelDiscountDetailsDao -> {

			// call factory service to invoke appropriate service implementation w.r.t
			// discountType.
			DiscountService discountService = discountFactory
					.getDiscountService(billLevelDiscountDetailsDao.getDiscountType());

			// ----------Discount type specific operations----------

			discountService.updateTransactionLevelDiscount(salesTxn, billLevelDiscountDetailsDao, isPriceUpdate);

		});

		// RIVAAH CARD VALIDATION
		discountUtilService.validateRivaahDiscounts(salesTxn);

	}

	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public void confirmTransactionLevelDiscount(String transactionId, String txnType, String subTxnType,
			String discountType, String discountTxnId) {

		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// check for rate freeze configurations
		PaymentDetailsDaoExt rateFreezedPayment = commonPaymentService.getMetalRateProtectedCNIfExists(salesTxn);
		commonPaymentService.validTxnForRateFreezedCN(salesTxn, rateFreezedPayment);

		// Check if Discount details exists for requested discount type
		discountUtilService.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, discountTxnId);

		checkManualBillValues(salesTxn);

		// call factory service to invoke appropriate service implementation w.r.t
		// discountType.
		DiscountService discountService = discountFactory.getDiscountService(discountType);

		// Discount type specific operations
		discountService.confirmTransactionLevelDiscount(salesTxn, discountType, discountTxnId);

		salesTxn = salesTxnRepository.save(salesTxn);

	}

	@Override
	@Transactional
	public void deleteTransactionLevelDiscounts(String transactionId, String txnType, String subTxnType,
			String discountType) {

		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		// call factory service to invoke appropriate service implementation w.r.t
		// discountType.
		DiscountService discountService = discountFactory.getDiscountService(discountType);

		if (!discountType.equalsIgnoreCase(DiscountTypeEnum.RIVAAH_CARD_DISCOUNT.name()))
			discountUtilService.removeRivaahDiscounts(salesTxn);

		// Discount type specific operations
		discountService.deleteTransactionLevelDiscounts(salesTxn, discountType);

		salesTxnRepository.save(salesTxn);

		if (!discountType.equalsIgnoreCase(DiscountTypeEnum.RIVAAH_CARD_DISCOUNT.name()))
			discountUtilService.validateRivaahDiscounts(salesTxn);

	}

	public DiscountResponseDto validateAndCreateDiscountDetails(DiscountBillLevelCreateDto discountBillLevelCreateDto,
			SalesTxnDaoExt salesTxn, String discountType) {

		// call factory service to invoke appropriate service implementation w.r.t
		// discountType.
		DiscountService discountService = discountFactory.getDiscountService(discountType);

		// ----------Discount type specific operations----------

		DiscountResponseDto discountResponseDto = discountService.applyTransactionLevelDiscount(salesTxn,
				discountBillLevelCreateDto, discountType);

		// Save the updated data
		salesTxnRepository.save(salesTxn);

		// VALIDATE RIVAAH DISCOUNTS
		if (!discountType.equalsIgnoreCase(DiscountTypeEnum.RIVAAH_CARD_DISCOUNT.name()))
			discountUtilService.validateRivaahDiscounts(salesTxn);

		// Apply discounts to eligible items
		return discountResponseDto;

	}

	private void getBillLevelDiscountDetails(String transactionId, String applicableLevel, String discountType,
			String status, List<DiscountDetailResponseDto> discountDetailsResponseList) {

		List<DiscountDetailsDaoExt> discountDetailsList = discountDetailsRepository
				.findAllSalesTransactionDiscounts(transactionId, applicableLevel, discountType, status);
		discountDetailsList.forEach(discountDetail -> {
			discountDetailsResponseList.add(discountUtilService.getDiscountDetailsResponseDto(discountDetail));
		});

	}

	private DiscountDetailsDaoExt getDiscountDetailsIfExists(String discountTxnId, SalesTxnDaoExt salesTxn) {
		Optional<DiscountDetailsDaoExt> discountDetailsDaoExt = discountDetailsRepository
				.findByIdAndSalesTxnId(discountTxnId, salesTxn.getId());

		if (!discountDetailsDaoExt.isPresent()) {
			throw new ServiceException("Discount doesn't exist", "ERR-DISC-006",
					"Discount does not exist" + discountTxnId);
		}
		return discountDetailsDaoExt.get();
	}

	private void checkManualBillValues(SalesTxnDaoExt salesTxnDao) {

		BigDecimal finalValue = BigDecimal.ZERO;

		if (SubTxnTypeEnum.getManualSubTxnTypes().contains(salesTxnDao.getSubTxnType())) {
			if (TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType())) {

				CashMemoDaoExt cashMemoDao = cashMemoRepositoryExt
						.findOneByIdAndSalesTxnDaoLocationCode(salesTxnDao.getId(), salesTxnDao.getLocationCode());
				finalValue = cashMemoDao.getFinalValue();
				List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = cashMemoDetailsRepository
						.listItemDetailsByCashMemoIdAndItemIds(salesTxnDao.getId(), null);

				Map<String, BigDecimal> weightDetailsList = new HashMap<>();
				for (CashMemoDetailsDaoExt cmDetails : cashMemoDetailsDaoList) {
					String itemTypecode = MapperUtil.mapObjToClass(cmDetails.getPriceDetails(), PriceDetailsDto.class)
							.getItemTypeCode();
					if (weightDetailsList.containsKey(itemTypecode)) {
						weightDetailsList.put(itemTypecode,
								weightDetailsList.get(itemTypecode).add(cmDetails.getTotalWeight()));
					} else {
						weightDetailsList.put(itemTypecode, cmDetails.getTotalWeight());
					}
				}
				WeightDetailsDto weightDetails = commonTransactionService
						.getTotalWeightSplitDetailsForManualBill(weightDetailsList);
				// to check total weight and final value for manual bill.
				commonTransactionService.manualBillValuesWithHeader(cashMemoDao.getTotalWeight(),
						cashMemoDao.getFinalValue(), cashMemoDao.getSalesTxnDao(), true, weightDetails);

			} else if (TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())
					|| TransactionTypeEnum.CO.name().equals(salesTxnDao.getTxnType())) {

				OrderDaoExt orderDao = orderRepository.findOneByIdAndSalesTxnLocationCodeAndTxnTypeAndSubTxnType(
						salesTxnDao.getId(), CommonUtil.getLocationCode(), salesTxnDao.getTxnType(),
						salesTxnDao.getSubTxnType());
				finalValue = orderDao.getFinalValue();

				List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository
						.findAllByOrderIdAndStatus(orderDao.getId(), salesTxnDao.getStatus());
				Map<String, BigDecimal> weightDetailsList = new HashMap<>();
				for (OrderDetailsDaoExt orderDetails : orderDetailsList) {
					String itemTypecode = MapperUtil
							.mapObjToClass(orderDetails.getPriceDetails(), PriceDetailsDto.class).getItemTypeCode();
					if (weightDetailsList.containsKey(itemTypecode)) {
						weightDetailsList.put(itemTypecode,
								weightDetailsList.get(itemTypecode).add(orderDetails.getTotalWeight()));
					} else {
						weightDetailsList.put(itemTypecode, orderDetails.getTotalWeight());
					}
				}
				WeightDetailsDto weightDetails = commonTransactionService
						.getTotalWeightSplitDetailsForManualBill(weightDetailsList);
				// to check total weight and final value for manual bill.
				commonTransactionService.manualBillValuesWithHeader(orderDao.getTotalWeight(), orderDao.getFinalValue(),
						orderDao.getSalesTxn(), true, weightDetails);

			} else if (TransactionTypeEnum.ADV.name().equals(salesTxnDao.getTxnType())) {
				AdvanceDaoExt adv = advanceRepository.getOne(salesTxnDao.getId());
				finalValue = adv.getFinalValue();
			}
		}

		// check final value
		commonTransactionService.customerDetailsCheckForFinalValue(finalValue, salesTxnDao);
	}

	@Override
	public void deleteLinkedTransactionLevelDiscountForAnItem(String transactionId, String txnType, String subTxnType,
			String itemId) {
		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		// Validate If any independent Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		// Find all Linked Bill Level discounts applied for a item
		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findAllLinkedDiscountByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdAndReferenceId(
						salesTxn,
						com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum.BILL_LEVEL.name(), itemId,
						null);

		List<DiscountItemDetailsDaoExt> rivaahDiscountList = new ArrayList<>();

		if (!CollectionUtils.isEmpty(discountItemDetails)) {
			discountItemDetails.forEach(discountItem -> {
				if (BooleanUtils.isTrue(discountItem.getIsRivaahDiscount())) {
					rivaahDiscountList.add(discountItem);
				}
			});

			if (!CollectionUtils.isEmpty(rivaahDiscountList))
				discountItemDetails.removeAll(rivaahDiscountList);

			// pending: Discount type specific delete operations, like for employee
			// discount, if it's the one & only discount applied at item level, it should
			// not be allowed to delete
			// Delete discount details
			discountUtilService.deleteAllBillLevelDiscountDetailsForTheItems(discountItemDetails);

			// Delete dependent cumulative items discount as part of overriding discount of
			// current item - removed as no cumulative discounts present at bill level

			discountUtilService.removeRivaahDiscounts(salesTxn);

			// Update discount value & final value of impacted items
			discountUtilService.updateTransactionSpecificItemDetails(salesTxn, Set.of(itemId), false);
		}

		// RIVAAH DISCOUNT VALIDATION
		discountUtilService.validateRivaahDiscounts(salesTxn);

	}

}
