/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service.impl;

import static com.titan.poss.engine.constant.EngineConstants.CASH_BACK_ENGINE_SERVICE_IMPL;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CashbackOfferRequestDto;
import com.titan.poss.core.dto.CashbackValueResponseDto;
import com.titan.poss.core.dto.GlCodeDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.dto.response.CashbackOfferDetailsResponseDto;
import com.titan.poss.engine.service.CashbackService;
import com.titan.poss.engine.service.SalesService;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.CashbackCardDetailsDao;
import com.titan.poss.payment.dao.CashbackDao;
import com.titan.poss.payment.dao.CashbackOfferDetailsDao;
import com.titan.poss.payment.dao.GLBoutiqueCodeDao;
import com.titan.poss.payment.dto.CashbackDto;
import com.titan.poss.payment.repository.CashbackCardDetailsRepository;
import com.titan.poss.payment.repository.CashbackOfferDetailsRepository;
import com.titan.poss.payment.repository.CashbackProductMappingRepository;
import com.titan.poss.payment.repository.CashbackRepository;
import com.titan.poss.payment.repository.GLBoutiqueCodeRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service(CASH_BACK_ENGINE_SERVICE_IMPL)
public class CashbackServiceImpl implements CashbackService {

	@Autowired
	CashbackProductMappingRepository cashbackProductRepo;

	@Autowired
	CashbackRepository cashbackRepo;

	@Autowired
	private GLBoutiqueCodeRepository glCodeRepository;

	@Autowired
	CashbackOfferDetailsRepository cashbackOfferRepo;

	@Autowired
	CashbackCardDetailsRepository cbCardDetailsRepo;

	@Autowired
	private SalesService salesService;

	private static final String ERR_CORE_034 = "ERR-CORE-034";
	private static final String INVALID_REQUEST_DATA = "Invalid request data";
	private static final Pattern NUMBER = Pattern.compile("\\d+");

	/**
	 * This method will return list of product groups names based on cardNumber.
	 * 
	 * @param cardNumber
	 * @return ListResponse<String>
	 */
	@Override
	public ListResponse<String> getProductGroups(String offerId) {

		return new ListResponse<>(cashbackProductRepo.getMappedProductGroups(offerId));
	}

	@Override
	public ListResponse<CashbackDto> getActiveCashbackOffers() {

		BusinessDayDto businessDate = salesService.getBusinessDay(CommonUtil.getLocationCode());

		List<CashbackDao> activeOfferList = cashbackRepo.getActiveCashbackOffers(businessDate.getBusinessDate());

		List<CashbackDto> dtoOfferList = new ArrayList<>();
		if (activeOfferList.isEmpty())
			throw new ServiceException(EngineConstants.NO_ACTIVE_CASHBACK_AVAILABLE, EngineConstants.ERR_PAY_024,
					businessDate.getBusinessDate());

		else {

			activeOfferList.forEach(cashbackDaoExt -> {
				CashbackDto cashbackDto = (CashbackDto) MapperUtil.getObjectMapping(cashbackDaoExt, new CashbackDto());
				cashbackDto.setBankName(cashbackDaoExt.getPayerBankName().getBankName());
				dtoOfferList.add(cashbackDto);

			});
		}
		return new ListResponse<>(dtoOfferList);

	}

	@Override
	public CashbackOfferDetailsResponseDto getCashbackDetails(String offerId) {

		Optional<CashbackDao> cashbackDao = cashbackRepo.findById(offerId);
		CashbackOfferDetailsResponseDto responseDto = null;
		if (!cashbackDao.isPresent()) {
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_CASHBACK_ID,
					PaymentConstants.ERR_PAY_031, offerId);
		} else {

			List<Object[]> offerDetailDao = null;
			if (cashbackDao.get().getIsCashbackAmount() == null) {
				log.info("'Is Cash Back Amount' is not configured for cashback id: {}", cashbackDao.get().getId());
				throw new ServiceException(PaymentConstants.CASHBACK_OFFER_DETAILS_NOT_PRESENT_FOR_CARD_NUMBER,
						PaymentConstants.ERR_PAY_041, "'Is Cash Back Amount' is not configured.");
			}
			if (cashbackDao.get().getIsCashbackAmount()) {
				offerDetailDao = cashbackOfferRepo.getDetailsIfAmount(offerId);
			} else {
				offerDetailDao = cashbackOfferRepo.getDetailsIfPercent(offerId);
			}

			if (!CollectionUtils.isEmpty(offerDetailDao)) {

				Object[] object = offerDetailDao.get(0);

				responseDto = new CashbackOfferDetailsResponseDto();
				responseDto.setMinSwipeAmt((BigDecimal) object[0]);
				responseDto.setMinInvoiceAmt((BigDecimal) object[1]);
				responseDto.setMinDiscountAmt((BigDecimal) object[2]);
				responseDto.setMaxDiscountAmtAllowed((BigDecimal) object[3]);
				responseDto.setMaxSwipeAmt((BigDecimal) object[4]);
				responseDto.setOfferStartDate(cashbackDao.get().getStartDate());
				responseDto.setOfferEndDate(cashbackDao.get().getEndDate());

			}
		}
		return responseDto;
	}

	@Transactional
	@Override
	public CashbackValueResponseDto getCashbackValue(String offerId, CashbackOfferRequestDto cbOfferDto) {

		cbOfferDto.setCardNumber(CryptoUtil.asymmetricDecrypt(cbOfferDto.getCardNumber(), "instrumentNo", false));
		// check if it's a cardNo or not
		Pattern pattern = Pattern.compile(RegExConstants.NUMERIC_REGEX);
		if (!pattern.matcher(cbOfferDto.getCardNumber()).matches()) {
			log.info("Invalid card number provided.");
			throw new ServiceException(INVALID_REQUEST_DATA, ERR_CORE_034, "Invalid card number provided.");
		}

		CashbackValueResponseDto cbResponseDto = new CashbackValueResponseDto();
		if (cbOfferDto != null) {

			CashbackCardDetailsDao cardDetailDao = validateOfferIdAndCardNumber(offerId, cbOfferDto);
			if (cardDetailDao == null) {
				throw new ServiceException(PaymentConstants.CASHBACK_NOT_PRESENT_FOR_CARD_NUMBER,
						PaymentConstants.ERR_PAY_041);
			}

			CashbackOfferDetailsDao maxOfferDetailDao = getOfferWithMaxDiscount(cbOfferDto, cardDetailDao);

			if (maxOfferDetailDao == null) {
				throw new ServiceException(PaymentConstants.CASHBACK_OFFER_DETAILS_NOT_PRESENT_FOR_CARD_NUMBER,
						PaymentConstants.ERR_PAY_041, cbOfferDto.getCardNumber());
			}

			if (Boolean.TRUE.equals(maxOfferDetailDao.getCashbackDao().getIsCashbackAmount())) {
				cbResponseDto.setDiscountValue(maxOfferDetailDao.getDiscountAmt());

			} else {
				BigDecimal discountPercentValue = maxOfferDetailDao.getDiscountPercent()
						.multiply(cbOfferDto.getSwipeAmount()).divide(new BigDecimal(100));
				if (discountPercentValue.compareTo(maxOfferDetailDao.getMaxDiscountAmt()) <= 0) {
					cbResponseDto.setDiscountValue(discountPercentValue);
				} else {
					cbResponseDto.setDiscountValue(maxOfferDetailDao.getMaxDiscountAmt());
				}
			}
			cbResponseDto.setMinInvoiceAmt(maxOfferDetailDao.getMinInvoiceAmt());
			cbResponseDto.setIsExcludeCashback(maxOfferDetailDao.getCashbackDao().getExcludeCashback());
			cbResponseDto.setBankName(maxOfferDetailDao.getCashbackDao().getPayerBankName().getBankName());
			if (maxOfferDetailDao.getCashbackDao().getMaxUsageCount() == null) {
				throw new ServiceException(PaymentConstants.CASHBACK_OFFER_DETAILS_NOT_PRESENT_FOR_CARD_NUMBER,
						PaymentConstants.ERR_PAY_041, "Max usage count is not present.");
			}
			cbResponseDto.setMaxUsageCount(maxOfferDetailDao.getCashbackDao().getMaxUsageCount());
			// set offerEndDate
			cbResponseDto.setOfferEndDate(maxOfferDetailDao.getCashbackDao().getEndDate());

		}

		return cbResponseDto;
	}

	private CashbackOfferDetailsDao getOfferWithMaxDiscount(CashbackOfferRequestDto cbOfferDto,
			CashbackCardDetailsDao cardDetailDao) {
		List<CashbackOfferDetailsDao> offerDetailDaoList = cashbackOfferRepo.getCashbackValue(
				cardDetailDao.getCashbackDao().getId(), cbOfferDto.getSwipeAmount(), cbOfferDto.getInvoiceAmount());

		if (CollectionUtil.isEmpty(offerDetailDaoList)) {
			throw new ServiceException(PaymentConstants.CASHBACK_OFFER_DETAILS_NOT_PRESENT_FOR_CARD_NUMBER,
					PaymentConstants.ERR_PAY_041, cbOfferDto.getCardNumber());
		}

		CashbackOfferDetailsDao maxOfferDetailDao = null;
		CashbackDao cashbackDao = offerDetailDaoList.get(0).getCashbackDao();
		for (CashbackOfferDetailsDao offerDetailsDao : offerDetailDaoList) {

			if (maxOfferDetailDao == null
					|| isNewOfferDetailHasMaxDiscount(maxOfferDetailDao, cashbackDao, offerDetailsDao)) {
				maxOfferDetailDao = offerDetailsDao;
			}
		}
		return maxOfferDetailDao;
	}

	private boolean isNewOfferDetailHasMaxDiscount(CashbackOfferDetailsDao maxOfferDetailDao, CashbackDao cashbackDao,
			CashbackOfferDetailsDao offerDetailsDao) {
		return (BooleanUtils.isTrue(cashbackDao.getIsCashbackAmount())
				&& offerDetailsDao.getDiscountAmt().compareTo(maxOfferDetailDao.getDiscountAmt()) > 0)
				|| (BooleanUtils.isNotTrue(cashbackDao.getIsCashbackAmount())
						&& offerDetailsDao.getDiscountPercent().compareTo(maxOfferDetailDao.getDiscountPercent()) > 0);
	}

	/**
	 * @param offerId
	 * @param cbOfferDto
	 */
	@Transactional
	public CashbackCardDetailsDao validateOfferIdAndCardNumber(String offerId, CashbackOfferRequestDto cbOfferDto) {

		BusinessDayDto businessDate = salesService.getBusinessDay(CommonUtil.getLocationCode());
		CashbackDao cashbackDao = cashbackRepo.validateOfferId(offerId, cbOfferDto.getBankName(),
				businessDate.getBusinessDate());
		CashbackCardDetailsDao cardDetailDao = null;
		if (cashbackDao != null) {

			int digitsToValidate = 0;
			String cardDigits = null;
			String cardNo = cbOfferDto.getCardNumber();

			if (cashbackDao.getFirstCardDigits() != null && cashbackDao.getFirstCardDigits() > 0) {
				digitsToValidate = cashbackDao.getFirstCardDigits();
				cardDigits = cardNo.substring(0, digitsToValidate);
			} else {
				digitsToValidate = cashbackDao.getLastCardDigits();
				cardDigits = cardNo.substring(cardNo.length() - digitsToValidate);
			}

			String cardNoLength = cashbackDao.getCardNoLength();
			String[] cardString = cardNoLength.split(",");

			if (Arrays.asList(cardString).contains(String.valueOf(cardNo.length())) && cardNo.contains(cardDigits)) {

				cardDetailDao = cbCardDetailsRepo.validateCardNo(cashbackDao.getId(), cardDigits);

			}

			return cardDetailDao;
		} else {
			throw new ServiceException(PaymentConstants.CASHBACK_WITH_BANK_NOT_PRESENT, PaymentConstants.ERR_PAY_040,
					cbOfferDto);
		}

	}

	@Override
	public GlCodeDto getGLCode(String locationCode) {
		GLBoutiqueCodeDao glCodeDao = glCodeRepository.getCostCenterCode(locationCode);

		if (glCodeDao == null)
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_LOCATION,
					PaymentConstants.ERR_PAY_011);
		GlCodeDto dto = new GlCodeDto();
		dto.setCostCenter(glCodeDao.getCostCenter());
		dto.setPifSeriesNo(glCodeDao.getPifSeriesNo());
		return dto;
	}

	@Override
	public void updateGlCode(String locationCode) {
		GLBoutiqueCodeDao glCodeDao = glCodeRepository.getCostCenterCode(locationCode);

		if (glCodeDao == null)
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_LOCATION,
					PaymentConstants.ERR_PAY_011);
		glCodeDao.setPifSeriesNo(increament(glCodeDao.getPifSeriesNo()));
		glCodeRepository.save(glCodeDao);
	}

	private String increament(String pifSeriesNo) {
		return NUMBER.matcher(pifSeriesNo)
				.replaceFirst(s -> String.format("%0" + s.group().length() + "d", Integer.parseInt(s.group()) + 1));
	}
}