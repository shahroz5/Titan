/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.GhsDiscountVoucherDetailsDto;
import com.titan.poss.core.discount.dto.GhsDiscountVoucherDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.enums.GhsDiscountVoucherStatusEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountVoucherDao;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.GhsAccountDiscountDetailsDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.dto.response.GhsDiscountVoucherDetailDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountVoucherRepository;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for 'SYSTEM_DISCOUNT_GHS_BONUS' implementation.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesSystemGhsDiscountVoucherService")
public class SystemGhsDiscountVoucherServiceImpl implements DiscountService {

	public SystemGhsDiscountVoucherServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name(), this);
	}

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private DiscountVoucherRepository discountVoucherRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private IntegrationService integrationService;
	
	@Autowired
	private CreditNoteRepositoryExt creditNoteRepositoryExt;

	private static final String DV_DETAILS_ARE_INCORRECT_IN_DB = "DV details are incorrect in DB.";
	private static final String GHS_DV = "GHS DV";

	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		// NA

	}

	@Override
	public DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponseConfigs, DiscountOtherDetailsDto discountOtherDetails) {
		// NA
		return null;
	}

	@Override
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt) {

		String locationCode = CommonUtil.getStoreCode();

		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		// check for other customer DV
		GhsDiscountVoucherDto ghsDiscountVoucherDto = checkforOtherCustomerDv(salesTxn, discountDetailsDaoExt,
				locationCode, discountTransactionDetails);

		List<DiscountItemDetailsDaoExt> apportionedItemDiscounts = discountItemDetailsRepository
				.findAllByDiscountDetailId(discountDetailsDaoExt.getId());

		if (!CollectionUtils.isEmpty(apportionedItemDiscounts)) {
			Set<String> updatedItemIds = apportionedItemDiscounts.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toSet());

			// Delete the apportioned discount values at item level
			discountItemDetailsRepository.deleteByDiscountDetailId(discountDetailsDaoExt.getId());

			// Update discount values for the impacted items
			discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);

		}

		// update sales txn
		if(ghsDiscountVoucherDto!=null)
		{
			discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails().remove(ghsDiscountVoucherDto);			
		}
		salesTxn.setDiscountTxnDetails(MapperUtil
				.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTransactionDetails)));

		discountDetailsRepository.deleteById(discountDetailsDaoExt.getId());
		salesTxnRepository.save(salesTxn);


			// need to call integration API to update in GHS
			if (discountDetailsDaoExt.getRefPayment()==null && DiscountSalesStatusEnum.CONFIRMED.name().equals(discountDetailsDaoExt.getStatus())) {

				// call integration API
				integrationService.updateDiscountVoucher(VendorCodeEnum.GHS.name(), ghsDiscountVoucherDto.getVoucherNo(),
						Integer.parseInt(ghsDiscountVoucherDto.getAccountNo()), salesTxn.getDocNo().toString(),
						TransactionStatusEnum.REVERSED.name());
			}
			

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

		String locationCode = CommonUtil.getStoreCode();
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		// 1. DV allowed only for cash memo.
		if (!TransactionTypeEnum.CM.name().equals(salesTxn.getTxnType())) {
			throw new ServiceException(SalesConstants.DYNAMIC_DISCOUN_TYPE_NOT_ALLOWED_IN_DYNAMIC_TRANSACTION_TYPE,
					SalesConstants.ERR_DISC_004,
					"Discount vochuer allowed in Cash memo only. But tired to access in " + salesTxn.getTxnType(),
					Map.of(SalesConstants.DISCOUNT_TYPE, GHS_DV, "transactionType", salesTxn.getTxnType()));
		}

		// clubbing validation
		List<DiscountDetailsDaoExt> discountDetailsList = discountDetailsRepository
				.findAllBySalesTxnId(salesTxn.getId());

		discountDetailsList.forEach(discountDetails -> {

			JsonData clubConfigsJson = MapperUtil
					.mapObjToClass(discountDetails.getDiscountConfig().getClubbableConfigDetails(), JsonData.class);

			if (!StringUtil.isBlankJsonData(clubConfigsJson)) {
				ClubbingConfigDetails clubConfigsDetails = MapperUtil.mapObjToClass(clubConfigsJson.getData(),
						ClubbingConfigDetails.class);

				if (!BooleanUtils.isNotFalse(clubConfigsDetails.getIsDV())) {
					throw new ServiceException(
							GHS_DV + " can't be clubbed with " + discountDetails.getDiscountCode() + " applied",
							SalesConstants.ERR_DISC_027, Map.of(SalesConstants.DISCOUNT_CODE, GHS_DV,
									SalesConstants.DISCOUNT_TYPE, discountDetails.getDiscountCode()));
				}
			}
		});
		// FOC check for DV?

		DiscountVoucherDao discountVoucherDao=null;
		GhsDiscountVoucherDetailDto cnGHSDiscountVoucherDetails=null;
		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		PaymentDetailsDaoExt paymentDetailsDao=null;
		if(discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId()==null)
		{
			discountVoucherDao = validateDicountVoucher(discountBillLevelCreateDto, locationCode,
					businessDate);

			// 4. if customer is different for the first DV, then
			// if GHS account is present, no need to change customer.
			// else need to throw error.
			discountTransactionDetails = checkCustomerAndDV(salesTxn, locationCode,
					discountVoucherDao,discountTransactionDetails);
			
		}
		else {
			
			paymentDetailsDao = discountUtilService.getRefPaymentDetailById(
					discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId(),
					PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), locationCode);

			CreditNoteDaoExt creditNoteDao = creditNoteRepositoryExt.getOne(paymentDetailsDao.getReference3());
			
			 cnGHSDiscountVoucherDetails = getCreditNoteDiscountDetails(creditNoteDao);
			/*
			 * DiscountBillLevelItemDetailsDto
			 * discountDetails=discountBillLevelCreateDto.getDiscountDetails().get(0);
			 * discountDetails.setDiscountValue(cnGHSDiscountVoucherDetails.getDiscountValue
			 * ()); List<DiscountBillLevelItemDetailsDto> billLevelItemDetailsDtos=new
			 * ArrayList<DiscountBillLevelItemDetailsDto>();
			 * billLevelItemDetailsDtos.add(discountDetails);
			 * discountBillLevelCreateDto.setDiscountDetails(billLevelItemDetailsDtos);
			 */			
			

		}
		// 2. validate discount voucher
		boolean isGoldCoinAllowed=false;
		if(cnGHSDiscountVoucherDetails!=null)
		 isGoldCoinAllowed=cnGHSDiscountVoucherDetails.getIsGoldCoinAllowed();
		else
			isGoldCoinAllowed=discountVoucherDao.getIsGoldCoinAllowed();
		
		// 'isGoldCoinAllowed' to be checked to know if discount can be apportioned to
		// coins.
		List<SalesItemDetailsDto> salesItemList = getValidItems(salesTxn, discountVoucherDao,
				discountBillLevelCreateDto.getDiscountDetails().get(0).getDiscountCode(), locationCode,isGoldCoinAllowed);

		// 5. need to validate bill amount with(>=) principle amount(include
		// 'isGoldCoinAllowed', if false, then coin amount need to be subtracted from
		// bill amount for the check. ) -- too many scenarios(PENDING)

		// once DV is added,
		// i. no other discounts are allowed. - done
		// ii. GHS redemption is not allowed - done
		// iii. change of customer is not allowed. - done
		// iv. any edit to items is not allowed. - done
		// v. FOC can not be given - done
		// vi. Gold rate protected credit notes can not be added
		// vii. CNs with discount cannot be added - done
		// viii.'HOLD' not allowed. - done
		// ix. on Bill cancellation: connect EGHS, and update GHS_Discount_Voucher.
		// Change Status from 1 to 0, RedeemedCMNo, RedeemedLocation, RedemptionDate
		// should be updated null - done
		// x. If bill cancellation is done without net connection for a CM with discount
		// voucher, should display the error message 'Unable to connect EGHS' and should
		// not allow for Bill cancellation. - done
		// xi. In case of GRN, sum(CMVariantDetail.GHSVoucherDiscount) should be updated
		// in GHSVoucherDiscount column in GRN credit note for the selected variants
		// codes.
		// xii. CreditNote.GHSVoucherDiscount value should be added along with GHSBonus
		// while redeeming the CREDIT_NOTE in CM.

		List<DiscountDetailResponseDto> discountDetails = new ArrayList<>();

			
			for(DiscountBillLevelItemDetailsDto discountBillDetail :discountBillLevelCreateDto.getDiscountDetails())
			{
			DiscountDetailsDaoExt discountDetailsDaoExt = new DiscountDetailsDaoExt();

			DiscountDetailsBaseDto discountDetailsBaseDto = engineService
					.getDiscountConfigDetails(discountBillDetail.getDiscountId());

			// set discount value details
			if(discountBillDetail.getRefPaymentId()==null)
			setDiscountValueDetails(discountVoucherDao, discountBillDetail);

			// Create Discount details
			discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetails(discountBillDetail, salesTxn,
					DiscountApplicableLevelEnum.BILL_LEVEL.name(),
					DiscountInitialStatusEnum.SYSTEM_DISCOUNT_DV.getDiscountInitialStatus(),
					discountBillDetail.getDiscountValue());

			//disable isDiscountPresent flag once discount is applied 
			paymentDetailsDao=discountUtilService.disableIsDiscountPresent(paymentDetailsDao);
			
			// Save discount config details & Link to the discount applied
			discountDetailsDaoExt.setRefPayment(paymentDetailsDao);
			discountDetailsDaoExt
					.setDiscountConfig(discountUtilService.saveDiscountConfigDetails(discountDetailsBaseDto));
			discountDetailsDaoExt.setIsEdited(false);// DV not editable

			discountDetailsRepository.save(discountDetailsDaoExt);

			// Apportion the bill discounts to the eligible item Id's
			discountUtilService.apportionBillLevelDiscountsToApplicableItems(discountDetailsDaoExt, salesTxn,
					salesItemList.stream().map(SalesItemDetailsDto::getId).collect(Collectors.toList()),null);

			discountDetails.add(discountUtilService.getDiscountDetailsResponseDto(discountDetailsDaoExt));

		}

		List<GhsDiscountVoucherDto> ghsDVList = new ArrayList<>();
		if (discountTransactionDetails!=null && discountTransactionDetails.getGhsDiscountDetails() != null
				&& !CollectionUtils.isEmpty(discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails())) {
			ghsDVList = discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails();
		}

	
		GhsDiscountVoucherDto ghsDiscountVoucherDto = new GhsDiscountVoucherDto((discountVoucherDao!=null? discountVoucherDao.getVoucherNo():null),
				(discountVoucherDao!=null? discountVoucherDao.getAccountNo():null), DiscountSalesStatusEnum.OPEN.name(),
				discountDetails.get(0).getDiscountTxnId().toUpperCase());
		// is same customer
		
		if(discountVoucherDao!=null)
			ghsDiscountVoucherDto.setIsSameCustomer(discountVoucherDao.getCustomerLocationMap()
					.getCustomerLocationMappingId().getCustomerId().equals(salesTxn.getCustomerId()));		  
		else		
			ghsDiscountVoucherDto.setIsSameCustomer(true);

		// add DV to list
		ghsDVList.add(ghsDiscountVoucherDto);
		discountTransactionDetails.setGhsDiscountDetails(new GhsDiscountVoucherDetailsDto(ghsDVList));

		// save sales_treansaction table with update discount details.
		salesTxn.setDiscountTxnDetails(MapperUtil
				.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTransactionDetails)));
		salesTxnRepository.save(salesTxn);

		return new DiscountResponseDto(discountDetails);

	}

	private GhsDiscountVoucherDetailDto getCreditNoteDiscountDetails(CreditNoteDaoExt creditNoteDao) {
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
		if (cnDiscountDetails.getSystemDiscountDv() == null
				|| cnDiscountDetails.getSystemDiscountDv().getDiscountValue() == null) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit note does not have DV discount details to apply discount.");
		}

		return cnDiscountDetails.getSystemDiscountDv();
	}

	/**
	 * @param discountVoucherDao
	 * @param discountBillDetail
	 */
	private void setDiscountValueDetails(DiscountVoucherDao discountVoucherDao,
			@Valid DiscountBillLevelItemDetailsDto discountBillDetail) {
		if (StringUtil.isBlankJsonData(discountBillDetail.getDiscountValueDetails())) {
			JsonData jsonData = MapperUtil.mapObjToClass(discountVoucherDao.getOtherDetails(), JsonData.class);
			discountBillDetail.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS",
					Map.of("ghScheme", JsonUtils.getValueFromJson(jsonData.getData(), "ghScheme", String.class),
							"installmentAmount", discountVoucherDao.getInstallmentAmount(), "voucherNo",
							discountVoucherDao.getVoucherNo(), "accountNo", discountVoucherDao.getAccountNo(),
							"validFrom", discountVoucherDao.getValidFrom(), "validTill",
							discountVoucherDao.getValidTill())));
		}
	}

	@Override
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {

		// PENDING
		// 1. need to check consent form.

		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, discountTxnId);

		// filter only open discounts
		if (!CollectionUtils.isEmpty(discountDaoList)) {
			discountDaoList = discountDaoList.stream()
					.filter(discountDao -> DiscountSalesStatusEnum.OPEN.name().equals(discountDao.getStatus()))
					.collect(Collectors.toList());
		}

		if (CollectionUtils.isEmpty(discountDaoList)) {
			return;
		}
		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		Map<String, Boolean> discountDaoMap = new HashMap<>();
		discountDaoList.forEach(discountDetailsDao -> {

			GhsDiscountVoucherDto ghsDiscountVoucherDto = checkIfDataIsValidInDb(discountDetailsDao,
					discountTransactionDetails);
			GhsDiscountVoucherResponseDto ghsDiscountVoucherResponseDto=null;
			if(discountDetailsDao.getRefPayment()==null)
			{
				// Should check if the voucher is still in open status
				 ghsDiscountVoucherResponseDto = integrationService.getDiscountVoucherDetails(
						VendorCodeEnum.GHS.name(), Integer.valueOf(ghsDiscountVoucherDto.getVoucherNo()),
						Integer.valueOf(ghsDiscountVoucherDto.getAccountNo()));

				
			}
			boolean isDVRedeemedInCurrentCM = false;
			if (ghsDiscountVoucherResponseDto!=null && GhsDiscountVoucherStatusEnum.REDEEMED.name().equals(ghsDiscountVoucherResponseDto.getStatus())
					&& salesTxn.getId().equals(ghsDiscountVoucherResponseDto.getRedeemedCMId())) {
				isDVRedeemedInCurrentCM = true;
			} else if (ghsDiscountVoucherResponseDto!=null && !GhsDiscountVoucherStatusEnum.OPEN.name().equals(ghsDiscountVoucherResponseDto.getStatus())) {
				throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
						"GHS DV - '" + ghsDiscountVoucherDto.getVoucherNo()
								+ "' cannot be redeemed. Status of voucher is: "
								+ ghsDiscountVoucherResponseDto.getStatus(),
						Map.of(SalesConstants.REMARKS,
								"Discount voucher - " + ghsDiscountVoucherDto.getVoucherNo() + ", is redeemed."));
			}
			discountDaoMap.put(discountDetailsDao.getId(), isDVRedeemedInCurrentCM);
		});

		// redeem voucher one by one
		discountDaoList.forEach(discountDetailsDao -> {

			GhsDiscountVoucherDto ghsDiscountVoucherDto = checkIfDataIsValidInDb(discountDetailsDao,
					discountTransactionDetails);

			// PENDING
			// why item list check is required?

			// update discount details status
			discountDetailsDao.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());

			// update discount txn details at sales_transaction table
			discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails().remove(ghsDiscountVoucherDto);
			ghsDiscountVoucherDto.setRedeemStatus(DiscountSalesStatusEnum.CONFIRMED.name());
			discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails().add(ghsDiscountVoucherDto);

			// call integration API to update status in GHS: redeem only if DV is not
			// redeemed previously
			if(discountDetailsDao.getRefPayment()==null)
			{
				if (BooleanUtils.isFalse(discountDaoMap.get(discountDetailsDao.getId()))) {
					integrationService.redeemGhsDiscountVoucher(VendorCodeEnum.GHS.name(),
							ghsDiscountVoucherDto.getVoucherNo(), Integer.valueOf(ghsDiscountVoucherDto.getAccountNo()),
							salesTxn.getDocNo().toString());
				}
			}
			log.info("Confirmed DV  - {}, discount details id - {}.", ghsDiscountVoucherDto.getVoucherNo(),
					discountDetailsDao.getId());

		});

		salesTxn.setDiscountTxnDetails(MapperUtil
				.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTransactionDetails)));
		salesTxnRepository.save(salesTxn);
		discountDetailsRepository.saveAll(discountDaoList);
	}

	@Override
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {
		// required?

	}

	@Override
	public void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate) {

		// required?
		log.info("Update DV discount skipped, as not allowed when DV is added.");
	}

	private List<SalesItemDetailsDto> getValidItems(SalesTxnDaoExt salesTxn, DiscountVoucherDao discountVoucherDao,
			String discountCode, String locationCode, boolean isGoldCoinAllowed) {
		//Boolean isCoinAllowed = discountVoucherDao.getIsGoldCoinAllowed();

		List<SalesItemDetailsDto> salesItemList = discountUtilService.getTransactionSpecificItemDetails(salesTxn, null);
		// filter coin based on check -> PGC -73
		List<SalesItemDetailsDto> itemsToRemove = new ArrayList<>();
		if (BooleanUtils.isFalse(isGoldCoinAllowed)) {
			salesItemList.forEach(salesItem -> {
				if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(salesItem.getProductGroupCode())) {
					itemsToRemove.add(salesItem);
				}
			});
		}

		// remove invalid items
		salesItemList.removeAll(itemsToRemove);

		if (CollectionUtils.isEmpty(salesItemList)) {
			throw new ServiceException(SalesConstants.ENTERED_DV_IS_NOT_ALLOWED_FOR_GOLD_COINS,
					SalesConstants.ERR_DISC_037,
					"Discount Code: " + discountCode + ", not eligible for apportion to any of the items.");
		}

		BigDecimal totalItemAmount = salesItemList.stream().map(SalesItemDetailsDto::getFinalValue)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		totalItemAmount = getCashMemoAmountforValidation(salesTxn, locationCode, totalItemAmount);

		// PENDING: many scenarios
		
		if (discountVoucherDao!=null && totalItemAmount.compareTo(discountVoucherDao.getInstallmentAmount()) < 0) {
			// CM is not eligible to use this discount voucher
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"CM is not eligible to use this discount voucher '" + discountVoucherDao.getVoucherNo()
							+ "'. DV installment amount: " + discountVoucherDao.getInstallmentAmount()
							+ " and total valid amount: " + totalItemAmount,
					Map.of(SalesConstants.REMARKS, "CM is not eligible to use discount voucher - '"
							+ discountVoucherDao.getVoucherNo() + "'"));
		}

		return salesItemList;
	}

	/**
	 * @param salesTxn
	 * @param locationCode
	 * @param totalItemAmount
	 * @return
	 */
	private BigDecimal getCashMemoAmountforValidation(SalesTxnDaoExt salesTxn, String locationCode,
			BigDecimal totalItemAmount) {
		// GHS account with discount check
		List<PaymentDetailsDaoExt> ghsPaymentDetailsList = paymentDetailsRepository
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(salesTxn.getId(),
						PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), null, null, locationCode,
						List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name()));

		if (!CollectionUtil.isEmpty(ghsPaymentDetailsList)) {
			for (PaymentDetailsDaoExt ghsPayment : ghsPaymentDetailsList) {
				JsonData jsonData = MapperUtil.mapObjToClass(ghsPayment.getOtherDetails(), JsonData.class);
				GhsPaymentOtherDetailsDto ghsOtherDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
						GhsPaymentOtherDetailsDto.class);
				// if discount is present for the payment then, subtract installment
				// amount from 'totalItemAmount'.
				if (discountDetailsRepository.countByRefPaymentId(ghsPayment.getId()) > 0) {
					totalItemAmount = totalItemAmount.subtract(ghsOtherDetailsDto.getInstallmentAmount());
				}
			}
		}

		// other GHS DV check
		List<DiscountDetailsDaoExt> existingDiscountDetailsList = discountDetailsRepository
				.findAllByDiscountTypeAndSalesTxnId(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name(), salesTxn.getId(), null);
		if (!CollectionUtil.isEmpty(existingDiscountDetailsList)) {
			for (DiscountDetailsDaoExt dvDiscountDetails : existingDiscountDetailsList) {
				JsonData jsonData = MapperUtil.mapObjToClass(dvDiscountDetails.getDiscountValueDetails(),
						JsonData.class);
				BigDecimal installmentAmount = JsonUtils.getValueFromJson(jsonData.getData(), "installmentAmount",
						BigDecimal.class);
				totalItemAmount = totalItemAmount.subtract(installmentAmount);
			}
		}

		return totalItemAmount;
	}

	private DiscountTransactionDetails checkCustomerAndDV(SalesTxnDaoExt salesTxn, String locationCode,
			DiscountVoucherDao discountVoucherDao, DiscountTransactionDetails discountTransactionDetails) {

		// check if customer is selected
		if (StringUtils.isEmpty(salesTxn.getCustomerId())) {
			throw new ServiceException(SalesConstants.PLEASE_SELECT_CUSTOMER_DETAILS, SalesConstants.ERR_SALE_110,
					"Customer details not found for transaction id: " + salesTxn.getId());
		}

		
		// if first DV then, check for customer id
		if ((discountTransactionDetails.getGhsDiscountDetails() == null
				|| CollectionUtils.isEmpty(discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails()))
				&& !discountVoucherDao.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId()
						.equals(salesTxn.getCustomerId())) {

			// check if GHS payment is present.
			// if payment is empty, throw error
			if (CollectionUtils
					.isEmpty(paymentDetailsRepository.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(
							salesTxn.getId(), PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), null, null, locationCode,
							List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name())))) {
				throw new ServiceException(SalesConstants.DISCOUNTTYPE_OF_OTHER_CUSTOMER_CANNOT_BE_USED,
						SalesConstants.ERR_DISC_028, "DV of other customer cannot be used before using own DV.",
						Map.of(SalesConstants.DISCOUNT_TYPE, GHS_DV));
			}

		} else if (discountTransactionDetails.getGhsDiscountDetails() != null
				&& !CollectionUtils.isEmpty(discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails())) {
			// else, check if DV is already added
			List<String> voucherList = discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails().stream()
					.map(GhsDiscountVoucherDto::getVoucherNo).collect(Collectors.toList());
			if (voucherList.contains(discountVoucherDao.getVoucherNo())) {
				throw new ServiceException(SalesConstants.DYNAMIC_DISCOUNTTYPE_DYNAMIC_VOUCHER_IS_ALREADY_ADDED,
						SalesConstants.ERR_DISC_029,
						"Discount vochuer - " + discountVoucherDao.getVoucherNo() + ", is already added.",
						Map.of(SalesConstants.DISCOUNT_TYPE, GHS_DV, "voucher", discountVoucherDao.getVoucherNo()));
			}

		}

		return discountTransactionDetails;
	}

	private DiscountVoucherDao validateDicountVoucher(DiscountBillLevelCreateDto discountBillLevelCreateDto,
			String locationCode, Date businessDate) {
		if (discountBillLevelCreateDto.getDiscountDetails().size() != 1) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Only one discount voucher allowed at a time.",
					Map.of(SalesConstants.REMARKS, "Only one discount voucher allowed at a time."));
		}

		// PENDING, if FOC is added, then DV cannot be added.

		GhsDiscountVoucherDto ghsDiscountVoucherDto = discountBillLevelCreateDto.getGhsDiscountDetails();
		DiscountVoucherDao discountVoucherDao = getDiscountVoucher(locationCode, ghsDiscountVoucherDto.getVoucherNo());

		// account no. check
		if (!discountVoucherDao.getAccountNo().equals(ghsDiscountVoucherDto.getAccountNo())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Provide appropriate account number for discount voucher - '" + ghsDiscountVoucherDto.getVoucherNo()
							+ "'.",
					Map.of(SalesConstants.REMARKS, "No discount voucher available for the entered GHS A/C No."));
		}

		// status check
		if (!GhsDiscountVoucherStatusEnum.OPEN.name().equals(discountVoucherDao.getStatus())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"GHS DV - '" + ghsDiscountVoucherDto.getVoucherNo() + "' cannot be redeemed. Status of voucher is: "
							+ discountVoucherDao.getStatus(),
					Map.of(SalesConstants.REMARKS,
							"Discount voucher is not in open status for the entered GHS A/C No."));
		}

		// 3. check for DV status and valid till>=business date.
		if (businessDate.compareTo(discountVoucherDao.getValidFrom()) < 0
				|| businessDate.compareTo(discountVoucherDao.getValidTill()) > 0) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Discount voucher - '" + ghsDiscountVoucherDto.getVoucherNo() + "', validity has expired.",
					Map.of(SalesConstants.REMARKS, "Discount voucher validity is expired for the entered GHS A/C No."));
		}

		// check discount amount
		if (discountVoucherDao.getDiscountAmount()
				.compareTo(discountBillLevelCreateDto.getDiscountDetails().get(0).getDiscountValue()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Discount amount is not valid for voucher  - '" + ghsDiscountVoucherDto.getVoucherNo() + "'.",
					Map.of(SalesConstants.REMARKS, "Discount amount is not valid for voucher  - '"
							+ ghsDiscountVoucherDto.getVoucherNo() + "'."));
		}

		return discountVoucherDao;
	}

	private DiscountVoucherDao getDiscountVoucher(String locationCode, String voucherNo) {
		DiscountVoucherDao discountVoucherDao = discountVoucherRepository
				.findOneByVoucherNoVoucherTypeLocationCode(voucherNo, VendorCodeEnum.GHS.name(), locationCode);

		if (discountVoucherDao == null) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"DV - '" + voucherNo + "' not found.",
					Map.of(SalesConstants.REMARKS, "No discount voucher available for the entered GHS A/C No."));
		}
		return discountVoucherDao;
	}

	private GhsDiscountVoucherDto checkforOtherCustomerDv(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt discountDetailsDaoExt, String locationCode,
			DiscountTransactionDetails discountTransactionDetails) {
		List<GhsDiscountVoucherDto> dvList = discountTransactionDetails.getGhsDiscountDetails().getVoucherDetails();

		GhsDiscountVoucherDto ghsDiscountVoucherDto = dvList.stream()
				.filter(dvDto -> discountDetailsDaoExt.getId().equalsIgnoreCase(dvDto.getDiscountTxnId()))
				.collect(Collectors.toList()).get(0);

		// if GHS payment is present, then no restriction on DV deletion.
		// else, 3rd part DV should be deleted first.
		if (CollectionUtils
				.isEmpty(paymentDetailsRepository.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(
						salesTxn.getId(), PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), null, null, locationCode,
						List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name())))
				&& BooleanUtils.isTrue(ghsDiscountVoucherDto.getIsSameCustomer())) {
			List<GhsDiscountVoucherDto> dvOfOtherCustomers = dvList.stream()
					.filter(dvDto -> BooleanUtils.isFalse(dvDto.getIsSameCustomer())).collect(Collectors.toList());
			// if other customer DVs are present, then only throw error.
			if (!CollectionUtils.isEmpty(dvOfOtherCustomers)) {
				throw new ServiceException(SalesConstants.DISCOUNT_CANNOT_BE_DELETED_REASON_DYNAMIC_REASON,
						SalesConstants.ERR_DISC_030, "Discount voucher of other customers should be deleted first.",
						Map.of("reason", "Discount voucher of other customers should be deleted first."));
			}
		}

		return ghsDiscountVoucherDto;
	}

	private GhsDiscountVoucherDto checkIfDataIsValidInDb(DiscountDetailsDaoExt discountDao,
			DiscountTransactionDetails discountTransactionDetails) {
		Map<String, GhsDiscountVoucherDto> dvDetails = discountTransactionDetails.getGhsDiscountDetails()
				.getVoucherDetails().stream()
				.collect(Collectors.toMap(GhsDiscountVoucherDto::getDiscountTxnId, dvDto -> dvDto));

		if (!dvDetails.containsKey(discountDao.getId())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					DV_DETAILS_ARE_INCORRECT_IN_DB, Map.of(SalesConstants.REMARKS, DV_DETAILS_ARE_INCORRECT_IN_DB));
		}

		return dvDetails.get(discountDao.getId());
	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// NA

	}

}