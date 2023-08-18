package com.titan.poss.sales.service.impl.discount;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import java.util.Set;
import java.util.stream.Collectors;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.DiscountConfigDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("salesGRNMultipleDiscountService")
public class GRNMultipleDiscountServiceImpl implements DiscountService{
	
	@Autowired
	private EngineService engineService;
	
	@Autowired
	private DiscountUtilService discountUtilService;
	
	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;
	
	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;
	
	@Autowired
	private CreditNoteRepositoryExt creditNoteRepositoryExt;
	
	@Autowired
	private DiscountConfigDetailsRepositoryExt discountConfigDetailsRepository;
	
	public GRNMultipleDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.GRN_MULTIPLE_DISCOUNT.name(), this);
	}
	
	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		//NA
		
	}

	@Override
	public DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponseConfigs, DiscountOtherDetailsDto discountOtherDetails) {
		// NA
		return null;
	}

	@Override
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt) {
		discountUtilService.deleteHeaderDiscountByDiscountDetails(salesTxn, discountDetailsDaoExt);
		
	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {
		// NA
		
	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {
		// NA
		
	}

	@Override
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		// TODO Auto-generated method stub
		String locationCode = CommonUtil.getStoreCode();
		List<DiscountDetailResponseDto> discountDetails = new ArrayList<>();
		PaymentDetailsDaoExt paymentDetailsDao = discountUtilService.getRefPaymentDetailById(
				discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId(),
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), locationCode);

		CreditNoteDaoExt creditNoteDao = creditNoteRepositoryExt.getOne(paymentDetailsDao.getReference3());
		
		CreditNoteDiscountDetailsDto  creditNoteDiscountDetailsDto = getCreditNoteDiscountDetails(creditNoteDao);
		
		
		for (DiscountBillLevelItemDetailsDto discountBillDetail : discountBillLevelCreateDto.getDiscountDetails()) {


			DiscountDetailsBaseDto discountDetailsBaseDto = engineService
					.getDiscountConfigDetails(discountBillDetail.getDiscountId());

			// Create Discount details
			DiscountDetailsDaoExt discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetails(
					discountBillDetail, salesTxn, DiscountApplicableLevelEnum.BILL_LEVEL.name(),
					DiscountInitialStatusEnum.GRN_MULTIPLE_DISCOUNT.getDiscountInitialStatus(),
					discountBillDetail.getDiscountValue());
			
			//disable isDiscountPresent flag once discount is applied 
			paymentDetailsDao=discountUtilService.disableIsDiscountPresent(paymentDetailsDao);
			
			// set ref payment
			discountDetailsDaoExt.setRefPayment(paymentDetailsDao);

			discountDetailsDaoExt.setDiscountValue(creditNoteDiscountDetailsDto.getGrnMultipleDiscount().getDiscountValue());

			discountDetailsDaoExt
					.setDiscountConfig(discountUtilService.saveDiscountConfigDetails(discountDetailsBaseDto));

			discountDetailsRepository.save(discountDetailsDaoExt);
			List<SalesItemDetailsDto> salesItemList = discountUtilService.getTransactionSpecificItemDetails(salesTxn,
					null);

			
			discountUtilService.apportionBillLevelDiscountsToApplicableItems(discountDetailsDaoExt, salesTxn,
					salesItemList.stream().map(SalesItemDetailsDto::getId).collect(Collectors.toList()), null);

			discountDetails.add(discountUtilService.getDiscountDetailsResponseDto(discountDetailsDaoExt));

		}

		return new DiscountResponseDto(discountDetails, List.of(discountDetails.get(0).getDiscountTxnId()));
	}

	private CreditNoteDiscountDetailsDto getCreditNoteDiscountDetails(CreditNoteDaoExt creditNoteDao) {
		if (StringUtil.isBlankJsonStr(creditNoteDao.getDiscountDetails())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit note does not have valid details to apply discount.");
		}
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getDiscountDetails(), JsonData.class);
		if (StringUtil.isBlankJsonData(jsonData) || jsonData.getData() == null) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit note does not have valid details to apply discount.");
		}

		CreditNoteDiscountDetailsDto cnDiscountDetails = MapperUtil.mapObjToClass(jsonData.getData(),
				CreditNoteDiscountDetailsDto.class);
		if (cnDiscountDetails.getGrnMultipleDiscount() == null && cnDiscountDetails.getGrnMultipleDiscount().getDiscountValue() == null) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit note does not have DV discount details to apply discount.");
		}

		return cnDiscountDetails;
	}
	
	@Override
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {

		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, discountTxnId);

		if (!CollectionUtils.isEmpty(discountDaoList)) {
			for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
				List<DiscountItemDetailsDaoExt> discountItemDetailsList = discountItemDetailsRepository
						.findAllByDiscountDetailId(discountDetails.getId());
				if (!CollectionUtils.isEmpty(discountItemDetailsList)) {
					discountDetails.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());
				}
			}
		}

		discountDetailsRepository.saveAll(discountDaoList);		
	}

	@Override
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {
		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, null);

		if (!CollectionUtils.isEmpty(discountDaoList)) {
			Set<String> updatedItemIds = new HashSet<>();
			for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
				List<DiscountItemDetailsDaoExt> apportionedItemDiscounts = discountItemDetailsRepository
						.findAllByDiscountDetailId(discountDetails.getId());

				if (!CollectionUtils.isEmpty(apportionedItemDiscounts)) {
					updatedItemIds = apportionedItemDiscounts.stream().map(DiscountItemDetailsDaoExt::getItemId)
							.collect(Collectors.toSet());

					// Delete the apportioned discount values at item level
					discountItemDetailsRepository.deleteByDiscountDetailId(discountDetails.getId());

				}

				// Delete bill level discount at sales transaction level
				discountDetailsRepository.deleteById(discountDetails.getId());

				// Delete discount config details
				discountConfigDetailsRepository.delete(discountDetails.getDiscountConfig());

			}

			// Update discount values for the impacted items
			if (!CollectionUtils.isEmpty(updatedItemIds))
				discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);
		}
		
	}

	@Override
	public void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(salesTxn, "No discount allowed after GHS DV is added.", null);

		List<SalesItemDetailsDto> salesItemList = discountUtilService.getTransactionSpecificItemDetails(salesTxn, null);

		DiscountDetailsDaoExt discountDetailsDaoExt = discountUtilService
				.createBillLevelDiscountDetailsForOrderToCM(orderDiscountDetailDao, salesTxn,
						DiscountInitialStatusEnum.GRN_MULTIPLE_DISCOUNT.getDiscountInitialStatus());

		// Map discount config details from Order to CM
		discountDetailsDaoExt.setDiscountConfig((DiscountConfigDetailsDaoExt) MapperUtil.getObjectMapping(
				orderDiscountDetailDao.getDiscountConfig(), new DiscountConfigDetailsDaoExt(), "id"));

		// Save carry forwarded discount config details
		discountConfigDetailsRepository.save(discountDetailsDaoExt.getDiscountConfig());

		// Apportion the bill discounts to the eligible item Id's
		discountUtilService.apportionBillLevelDiscountsToApplicableItems(discountDetailsDaoExt, salesTxn,
				salesItemList.stream().map(SalesItemDetailsDto::getId).collect(Collectors.toList()),null);

		discountDetailsRepository.save(discountDetailsDaoExt);

		
	}

}
