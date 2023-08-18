/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.GcActivateResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GiftCardBaseActivateRequestDto;
import com.titan.poss.core.dto.GiftCardBaseCancelActivateDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.GiftDetailsDaoExt;
import com.titan.poss.sales.dto.GiftDetailsDto;
import com.titan.poss.sales.dto.TaxDetailsListDto;
import com.titan.poss.sales.dto.constants.GiftVendorCodeEnum;
import com.titan.poss.sales.dto.request.GiftDetailsCreateDto;
import com.titan.poss.sales.dto.request.GiftDetailsUpdateDto;
import com.titan.poss.sales.dto.response.CashMemoAndGiftDetailsResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.GiftDetailsRepositoryExt;
import com.titan.poss.sales.service.CashMemoGiftService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.IntegrationService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesCashMemoGiftServiceImpl")
public class CashMemoGiftServiceImpl implements CashMemoGiftService {

	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private GiftDetailsRepositoryExt giftDetailsRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private CashMemoGiftServiceImpl cashMemoGiftService;

	/**
	 * This method will add gift item to cash memo on hold or open status.
	 *
	 * @param id
	 * @param vendorCode
	 * @param giftType
	 * @param transactionType
	 * @param subTxnType
	 * @param giftDetailsCreateDto
	 * @return CashMemoAndGiftDetailsResponseDto
	 */
	@Override
	@Transactional
	public CashMemoAndGiftDetailsResponseDto addGiftToCashMemo(String id, String vendorCode, String giftType,
			String transactionType, String subTxnType, GiftDetailsCreateDto giftDetailsCreateDto) {

		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);

		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		GiftDetailsDaoExt giftDetailsDao = (GiftDetailsDaoExt) MapperUtil.getObjectMapping(giftDetailsCreateDto,
				new GiftDetailsDaoExt());
		giftDetailsDao.setBinCode(GiftVendorCodeEnum.QC_GC.getValue());
		giftDetailsDao.setVendorCode(vendorCode);
		giftDetailsDao.setGiftType(giftType);
		giftDetailsDao.setCashMemoDao(cashMemoDao);

		validateGiftDetails(giftDetailsCreateDto.getTotalValue(), giftDetailsCreateDto.getFinalValue());

		// rowId.
		giftDetailsDao.setRowId(giftDetailsRepository.countByCashMemoDaoId(id) + 1);

		// pending RSO NAME CHECK...
		giftDetailsDao.setSrcSyncId(0);
		giftDetailsDao.setDestSyncId(0);
		giftDetailsDao = giftDetailsRepository.save(giftDetailsDao);

		// update cashMemo total details
		cashMemoRepository.save(updatedCashMemoHeader(cashMemoDao));

		return mapCashMemoAndItemToResponse(cashMemoDao, giftDetailsDao);
	}

	private CashMemoDaoExt updatedCashMemoHeader(CashMemoDaoExt cashMemoDao) {
		updateTotalsOfCashMemoHeader(cashMemoDao);
		cashMemoDao.setTotalValue(cashMemoDao.getFinalValue());
		cashMemoDao.setSrcSyncId(cashMemoDao.getSrcSyncId() + 1);
		return cashMemoDao;
	}

	private void updateTotalsOfCashMemoHeader(CashMemoDaoExt cashMemoDao) {

		List<GiftDetailsDaoExt> giftDetailsList = getGiftDetails(cashMemoDao.getId());
		cashMemoDao.setTotalValue(BigDecimal.ZERO);
		cashMemoDao.setFinalValue(BigDecimal.ZERO);
		cashMemoDao.setTotalWeight(BigDecimal.ZERO);
		cashMemoDao.setTotalQuantity((short) 0);
		cashMemoDao.setTotalTax(BigDecimal.ZERO);
		cashMemoDao.setTotalDiscount(BigDecimal.ZERO);
		cashMemoDao.setHallmarkCharges(BigDecimal.ZERO);
		cashMemoDao.setHallmarkDiscount(BigDecimal.ZERO);

		List<TaxCalculationResponseDto> taxes = new ArrayList<>();

		if (!giftDetailsList.isEmpty()) {
			giftDetailsList.forEach(giftDetails -> {
				cashMemoDao.setFinalValue(cashMemoDao.getFinalValue().add(giftDetails.getFinalValue()));
				cashMemoDao.setTotalTax(cashMemoDao.getTotalTax().add(giftDetails.getTotalTax()));
				cashMemoDao.setTotalQuantity((short) (cashMemoDao.getTotalQuantity() + 1));
				if (giftDetails.getTaxDetails() != null && !"{}".equals(giftDetails.getTaxDetails())) {
					taxes.add(MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(giftDetails.getTaxDetails()),
							TaxCalculationResponseDto.class));
				}
			});
		}

		// combined tax details at header
		TaxDetailsListDto taxDetails = new TaxDetailsListDto(taxes);
		if (!taxes.isEmpty()) {
			cashMemoDao.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
		}
	}

	private List<GiftDetailsDaoExt> getGiftDetails(String cashMemoId) {

		return giftDetailsRepository.findByCashMemoDaoId(cashMemoId);
	}

	private CashMemoAndGiftDetailsResponseDto mapCashMemoAndItemToResponse(CashMemoDaoExt cashMemoDao,
			GiftDetailsDaoExt giftDetailsDao) {

		CashMemoAndGiftDetailsResponseDto cashMemoAndGiftDetailsResponseDto = (CashMemoAndGiftDetailsResponseDto) MapperUtil
				.getDtoMapping(commonCashMemoService.cashMemoResponse(cashMemoDao),
						CashMemoAndGiftDetailsResponseDto.class);

		cashMemoAndGiftDetailsResponseDto.setGiftDetailsDto(mapCashMemoDetailsToGiftDto(giftDetailsDao));

		return cashMemoAndGiftDetailsResponseDto;
	}

	private void validateGiftDetails(BigDecimal totalValue, BigDecimal finalValue) {

		// check for min and max... from location dao.... inter service call

		// price validation...
		if (totalValue.compareTo(finalValue) != 0)
			throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044);
	}

	/**
	 * This method will get item details based on id and itemId.
	 *
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @return GiftDetailsDto
	 */
	@Override
	public GiftDetailsDto getGiftInCashMemo(String id, String itemId, String transactionType, String subTxnType) {

		commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType, subTxnType);

		GiftDetailsDaoExt giftDetailsDao = checkIfItemExists(itemId, id);

		return mapCashMemoDetailsToGiftDto(giftDetailsDao);
	}

	private GiftDetailsDto mapCashMemoDetailsToGiftDto(GiftDetailsDaoExt giftDetailsDao) {
		GiftDetailsDto giftDetailsDto = (GiftDetailsDto) MapperUtil.getObjectMapping(giftDetailsDao,
				new GiftDetailsDto());
		if (giftDetailsDao.getTaxDetails() != null && !"{}".equals(giftDetailsDao.getTaxDetails())) {
			giftDetailsDto.setTaxDetails(MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(giftDetailsDao.getTaxDetails()), TaxCalculationResponseDto.class));
		}
		return giftDetailsDto;
	}

	@Override
	public List<GiftDetailsDto> getGiftsInCashMemo(String txnId) {

		List<GiftDetailsDaoExt> giftDetailsDaoList = giftDetailsRepository.findByCashMemoDaoId(txnId);

		List<GiftDetailsDto> giftsDto = new ArrayList<>();

		if (CollectionUtil.isNotEmpty(giftDetailsDaoList))
			for (GiftDetailsDaoExt gc : giftDetailsDaoList)
				giftsDto.add(mapCashMemoDetailsToGiftDto(gc));

		return giftsDto;
	}

	private GiftDetailsDaoExt checkIfItemExists(String itemId, String cashMemoId) {
		GiftDetailsDaoExt giftDetailsDao = giftDetailsRepository.findOneByItemIdAndCashMemoDaoId(itemId, cashMemoId);

		if (giftDetailsDao == null) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid gift item id: " + itemId, Map.of("type", "item"));
		}

		return giftDetailsDao;
	}

	/**
	 * This method will delete cashMemo gift item by id and itemId.
	 *
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @return CashMemoResponseDto
	 */
	@Override
	@Transactional
	public CashMemoResponseDto deleteCashMemoGift(String id, String itemId, String transactionType, String subTxnType) {

		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);

		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		GiftDetailsDaoExt giftDetailsDao = checkIfItemExists(itemId, id);

		// if gift is active? then? cancel it?
		giftDetailsDao.setSrcSyncId(giftDetailsDao.getSrcSyncId() + 1);
		giftDetailsRepository.delete(giftDetailsDao);

		List<GiftDetailsDaoExt> giftDetailsDaoList = giftDetailsRepository.findByCashMemoDaoId(cashMemoDao.getId());
		if (!giftDetailsDaoList.isEmpty()) {
			Integer rowId = 1;
			for (GiftDetailsDaoExt cashMemoDetails : giftDetailsDaoList) {
				cashMemoDetails.setRowId(rowId++);
			}
			giftDetailsDaoList.forEach(dao -> dao.setSrcSyncId(dao.getSrcSyncId() + 1));
			giftDetailsRepository.saveAll(giftDetailsDaoList);
		}

		// update cash memo total details
		cashMemoRepository.save(updatedCashMemoHeader(cashMemoDao));

		return commonCashMemoService.cashMemoResponse(cashMemoDao);
	}

	/**
	 * This method will partially update cash memo gift item.
	 *
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @param giftDetailsUpdateDto
	 * @return CashMemoAndGiftDetailsResponseDto
	 */
	@Override
	@Transactional
	public CashMemoAndGiftDetailsResponseDto partialUpdateCashMemoGift(String id, String itemId, String transactionType,
			String subTxnType, GiftDetailsUpdateDto giftDetailsUpdateDto) {

		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		GiftDetailsDaoExt giftDetailsDao = checkIfItemExists(itemId, id);

		validateGiftDetails(giftDetailsUpdateDto.getTotalValue(), giftDetailsUpdateDto.getFinalValue());

		giftDetailsDao = (GiftDetailsDaoExt) MapperUtil.getObjectMapping(giftDetailsUpdateDto, giftDetailsDao);
		giftDetailsDao.setSrcSyncId(giftDetailsDao.getSrcSyncId() + 1);
		giftDetailsDao = giftDetailsRepository.save(giftDetailsDao);
		cashMemoRepository.save(updatedCashMemoHeader(cashMemoDao));

		return mapCashMemoAndItemToResponse(cashMemoDao, giftDetailsDao);
	}

	@Transactional
	@Override
	public void activateGifts(CashMemoDaoExt cashMemoDao) {
		List<GiftDetailsDaoExt> giftDetailsDaoList = giftDetailsRepository.findByCashMemoDaoId(cashMemoDao.getId());

		String errorCode = null;
		String errorMessage = null;

		for (GiftDetailsDaoExt giftDetailsDao : giftDetailsDaoList) {
			// if gift card is not activated already
			if (!BooleanUtils.isTrue(giftDetailsDao.getIsGiftActivated())) {

				GiftCardBaseActivateRequestDto giftCardActivateRequestDto = new GiftCardBaseActivateRequestDto();
				giftCardActivateRequestDto.setCardNumber(giftDetailsDao.getInstrumentNo());
				giftCardActivateRequestDto.setAmount(String.valueOf(giftDetailsDao.getFinalValue()));
				giftCardActivateRequestDto.setInvoiceNumber(giftDetailsDao.getItemId());

				log.info("Activate gift card:- " + giftDetailsDao.getInstrumentNo());
				GcActivateResponseDto gcActivateResponseDto = integrationService
						.activateGiftCard(giftDetailsDao.getVendorCode(), giftCardActivateRequestDto);
				log.info("Status of gift card " + giftDetailsDao.getInstrumentNo() + ":- "
						+ gcActivateResponseDto.getResponseCode());

				// if response is 0 then success. else throw error? or redeem all the other
				// cards? what about payment?
				if ("0".equals(gcActivateResponseDto.getResponseCode())) {
					giftDetailsDao.setReferenceDetails(MapperUtil.getStringFromJson(gcActivateResponseDto));
					giftDetailsDao.setIsGiftActivated(true);
				} else {
					errorCode = gcActivateResponseDto.getResponseCode();
					errorMessage = gcActivateResponseDto.getResponseMessage();
				}
				giftDetailsDao.setSrcSyncId(giftDetailsDao.getSrcSyncId() + 1);
			}
			// if one of the card activation fails, then break out and reverse other gift
			// card activations.
			// break

		}

		cashMemoGiftService.saveGiftCards(giftDetailsDaoList);

		// pending: if any gift activation failed, reverse other gift activations.
		// cannot throw error: as transaction is present
		if (!StringUtils.isEmpty(errorCode)) {
			throw new ServiceException(null, errorCode, errorMessage);
		}

	}

	@Transactional
	@Override
	public List<GiftDetailsDaoExt> deactivateGifts(CashMemoDaoExt cashMemoDao) {

		List<GiftDetailsDaoExt> giftDetailsDaoList = giftDetailsRepository.findByCashMemoDaoId(cashMemoDao.getId());

		String errorCode = null;
		String errorMessage = null;

		for (GiftDetailsDaoExt giftDetailsDao : giftDetailsDaoList) {

			// to be canceled if it is activated successfully
			if (BooleanUtils.isTrue(giftDetailsDao.getIsGiftActivated())) {
				GcActivateResponseDto gcActivateResponseDto = MapperUtil
						.mapObjToClass(giftDetailsDao.getReferenceDetails(), GcActivateResponseDto.class);

				GiftCardBaseCancelActivateDto giftCardCancelActivateDto = new GiftCardBaseCancelActivateDto();
				giftCardCancelActivateDto.setCardNumber(giftDetailsDao.getInstrumentNo());
				giftCardCancelActivateDto.setOriginalAmount(String.valueOf(giftDetailsDao.getFinalValue()));
				giftCardCancelActivateDto.setOriginalInvoiceNumber(giftDetailsDao.getItemId());
				giftCardCancelActivateDto.setOriginalTransactionId(gcActivateResponseDto.getTransactionId());
				giftCardCancelActivateDto.setOriginalBatchNumber(gcActivateResponseDto.getBatchNumber());
				giftCardCancelActivateDto.setOriginalApprovalCode(gcActivateResponseDto.getApprovalCode());

				log.info("Deactivate gift card:- " + giftDetailsDao.getInstrumentNo());
				GcResponseDto gcResponseDto = integrationService.cancelActivateGiftCard(giftDetailsDao.getVendorCode(),
						giftCardCancelActivateDto);
				log.info("Status of gift card " + giftDetailsDao.getInstrumentNo() + " after deactivation :- "
						+ gcResponseDto.getResponseCode());

				if ("0".equals(gcResponseDto.getResponseCode())
						|| "ERR-INT-10029".equals(gcResponseDto.getResponseCode())) {
					giftDetailsDao.setIsGiftActivated(false);
				} else {

					errorCode = gcResponseDto.getResponseCode();
					errorMessage = gcResponseDto.getResponseMessage();
				} // if one of the card de-activation fails, then break out and reverse other gift
					// card de-activations?
					// break
			}
			giftDetailsDao.setSrcSyncId(giftDetailsDao.getSrcSyncId() + 1);
		}

		cashMemoGiftService.saveGiftCards(giftDetailsDaoList);

		// pending: if any gift de-activation failed, reverse other gift de-activations?
		// cannot throw error: as transaction is present
		// pending: if any gift activation failed, reverse other gift activations.
		// cannot throw error: as transaction is present
		if (!StringUtils.isEmpty(errorCode)) {
			throw new ServiceException(null, errorCode, errorMessage);
		}
		return giftDetailsDaoList;
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void saveGiftCards(List<GiftDetailsDaoExt> giftDetailsDaoList) {
		giftDetailsRepository.saveAll(giftDetailsDaoList);
	}
}
