/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.GepPriceRequest;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.GepItemDetailRequestDto;
import com.titan.poss.sales.dto.request.GepItemUpdateRequestDto;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.GepItemService;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Slf4j
@Service("gepItemServiceImpl")
public class GepItemServiceImpl extends BaseGoodsServiceImpl implements GepItemService {

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private EngineService engineService;

	@Override
	public GoodsExchangeDetailsDaoExt addItem(String id, String txnType, String subTxnType,
			GepItemDetailRequestDto gepItemDetailRequestDto) {
		GoodsExchangeDaoExt goodsExchange = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		validateGepItems(goodsExchange.getSalesTxn().getStatus(), goodsExchange.getSalesTxn().getCustomerId());
		MetalRateListDto metalRateListDto = getMetalRate(subTxnType, goodsExchange);
		GepPriceResponseDto gepPriceResponseDto = getAddItemGepPriceDetails(gepItemDetailRequestDto,
				metalRateListDto.getMetalRates());
		validateGepInput(gepItemDetailRequestDto.getUnitValue(), gepItemDetailRequestDto.getKarat(),
				gepPriceResponseDto);
		// get totalTax & taxDetails JSON
		TaxCalculationResponseDto taxDetails = engineService.getTaxDetails(CommonUtil.getLocationCode(),
				goodsExchange.getSalesTxn().getCustomerId(), TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.name(),
				SalesConstants.GEP_ITEM_CODE,false,null);
		BigDecimal itemTotalTax = commonTransactionService.getTaxDetails(gepItemDetailRequestDto.getUnitValue(), null,
				taxDetails);
		TaxCalculationResponseDto taxDetailsObj = MapperUtil.getObjectMapperInstance().convertValue(taxDetails,
				TaxCalculationResponseDto.class);
		log.debug("tax details : {} ", taxDetailsObj);
		log.debug("itemTotalTax : {} ", itemTotalTax);
		String lotNumber = engineService.generateLotNumber(TransactionTypeEnum.GEP.toString()).getLotNumber();
		log.debug("lot number : {} ", lotNumber);
		// set details to goods_exchange_details table
		GoodsExchangeDetailsDaoExt goodsExchangeDetails = updateGoodsExchangeDetailsObj(gepItemDetailRequestDto,
				goodsExchange, gepPriceResponseDto, itemTotalTax, taxDetailsObj, lotNumber);
		super.saveSalesObject(goodsExchange.getSalesTxn());
		return super.saveGoodsExchangeDetailsObj(goodsExchangeDetails);
	}

	private MetalRateListDto getMetalRate(String subTxnType, GoodsExchangeDaoExt goodsExchangeDao) {
		MetalRateListDto metalRateListDto = new MetalRateListDto();
		if (SubTxnTypeEnum.MANUAL_GEP.toString().equals(subTxnType)) {
			metalRateListDto = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(goodsExchangeDao.getSalesTxn().getMetalRateDetails()),
					MetalRateListDto.class);
		} else if (SubTxnTypeEnum.NEW_GEP.toString().equals(subTxnType)) {
			// why do we need to pass sales txn obj?
			// in common txn service we are not using this object while fetching current
			// metal rate
			/*
			 * if (StringUtils.isEmpty(goodsExchangeDao.getSalesTxn().getMetalRateDetails())
			 * || "{}".equals(goodsExchangeDao.getSalesTxn().getMetalRateDetails())) {
			 * metalRateListDto = commonTransactionService.getMetalRate();
			 * goodsExchangeDao.getSalesTxn().setMetalRateDetails(MapperUtil.
			 * getStringFromJson(metalRateListDto)); } else { metalRateListDto =
			 * MapperUtil.getObjectMapperInstance().convertValue(
			 * MapperUtil.getJsonFromString(goodsExchangeDao.getSalesTxn().
			 * getMetalRateDetails()), MetalRateListDto.class); }
			 */
			commonTransactionService.checkMetalRate(goodsExchangeDao.getSalesTxn(), null,
					TransactionStatusEnum.valueOf(goodsExchangeDao.getSalesTxn().getStatus()), false, getHoldTimeInMinutesForGep(goodsExchangeDao.getSalesTxn().getLocationCode()),
				false, Set.of());
			metalRateListDto = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(goodsExchangeDao.getSalesTxn().getMetalRateDetails()),
					MetalRateListDto.class);
			
		}
		return metalRateListDto;
	}

	private void validateGepInput(BigDecimal unitValue, BigDecimal karat, GepPriceResponseDto gepPriceResponseDto) {
		// validate UI input & price API input
		log.debug("value - " + unitValue + "==" + gepPriceResponseDto.getFinalValue() + ", karat - " + karat + "=="
				+ gepPriceResponseDto.getKarat());
		if (unitValue.compareTo(gepPriceResponseDto.getFinalValue()) != 0) {
			throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044,
					"Unit value : " + unitValue + " & pricing API value : " + gepPriceResponseDto.getFinalValue());
		}
		if (karat.compareTo(gepPriceResponseDto.getKarat()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					" Karat : " + karat + " & pricing API karat : " + gepPriceResponseDto.getKarat());
		}

	}

	private void validateGepItems(String status, Integer customerId) {
		// if the GEP status is CONFIRMED,DELETED then throw exception
		commonTransactionService.checkTranscationStatusForUpdate(status);
		// if customer id is null or empty then throw exception
		if (StringUtils.isEmpty(customerId)) {
			throw new ServiceException(SalesConstants.ADD_CUSTOMER_DETAILS, SalesConstants.ERR_SALE_080);
		}
	}

	private GepPriceResponseDto getAddItemGepPriceDetails(GepItemDetailRequestDto gepItemDetailRequestDto,
			Map<String, StandardPriceResponseDto> standardPrice) {
		GepPriceRequest gepPriceRequest = (GepPriceRequest) MapperUtil.getDtoMapping(gepItemDetailRequestDto,
				GepPriceRequest.class);
		gepPriceRequest.setStandardPrice(standardPrice);
		GepPriceResponseDto gepPriceResponseDto = engineService.getGepPriceDetails(gepPriceRequest);
		// if pricing API's price & UI's price doesn't match then throw exception
		if (gepPriceResponseDto.getFinalValue().compareTo(gepItemDetailRequestDto.getUnitValue()) != 0) {
			throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044);
		}
		return gepPriceResponseDto;
	}

	private GoodsExchangeDetailsDaoExt updateGoodsExchangeDetailsObj(GepItemDetailRequestDto gepItemDetailRequestDto,
			GoodsExchangeDaoExt goodsExchangeDao, GepPriceResponseDto gepPriceResponseDto, BigDecimal totalTax,
			TaxCalculationResponseDto taxDetailsObj, String lotNumber) {
		GoodsExchangeDetailsDaoExt goodsExchangeDetails = (GoodsExchangeDetailsDaoExt) MapperUtil
				.getDtoMapping(gepItemDetailRequestDto, GoodsExchangeDetailsDaoExt.class);
		goodsExchangeDetails.setGoodsExchange(goodsExchangeDao);
		goodsExchangeDetails.setUnitValue(gepPriceResponseDto.getFinalValue());
		goodsExchangeDetails
				.setPreMeltingDetails(MapperUtil.getStringFromJson(gepItemDetailRequestDto.getPreMeltingDetails()));
		goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(gepPriceResponseDto));
		goodsExchangeDetails.setUnitWeight(gepItemDetailRequestDto.getMeasuredWeight());
		goodsExchangeDetails.setPurity(gepItemDetailRequestDto.getMeasuredPurity());
		goodsExchangeDetails.setItemCode(SalesConstants.GEP_ITEM_CODE);
		goodsExchangeDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetailsObj));
		goodsExchangeDetails.setTotalTax(totalTax);
		goodsExchangeDetails.setLotNumber(lotNumber);
		goodsExchangeDetails.setBinCode(SalesConstants.GEP_BIN_CODE);
		goodsExchangeDetails.setSrcSyncId(0);
		goodsExchangeDetails.setDestSyncId(0);
		goodsExchangeDetails.setFinalValue(gepPriceResponseDto.getFinalValue().add(totalTax));
		goodsExchangeDetails.setTotalValue(gepPriceResponseDto.getFinalValue());
		goodsExchangeDetails.setTotalWeight(gepItemDetailRequestDto.getMeasuredWeight());
		goodsExchangeDetails.setQuantity((short) 1);
		int rowId = 0;
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchangeDao);
		if (CollectionUtils.isEmpty(goodsExchangeDetailsList)) {
			rowId = rowId + 1;
		} else {
			rowId = goodsExchangeDetailsList.size() + 1;
		}
		goodsExchangeDetails.setRowId(rowId);
		return goodsExchangeDetails;
	}

	@Override
	public GoodsExchangeDaoExt updateGoodsExchangeHeader(GoodsExchangeDetailsDaoExt goodsExchangeDetails) {
		// update header level(total weight,total value,total tax,total quantity)
		return super.updateGoodsExchangeHeaderDetails(goodsExchangeDetails.getGoodsExchange());
	}

	@Override
	public GoodsExchangeDetailsDaoExt getGepItem(String id, String txnType, String subTxnType, String itemId) {
		GoodsExchangeDaoExt goodsExchangeDao = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		return super.findByIdAndGoodsExchange(itemId, goodsExchangeDao);
	}

	@Override
	public GoodsExchangeDaoExt deleteGepItem(String id, String txnType, String subTxnType, String itemId) {
		GoodsExchangeDetailsDaoExt goodsExchangeDetails = getGepItem(id, txnType, subTxnType, itemId);
		GoodsExchangeDaoExt goodsExchangeObj = goodsExchangeDetails.getGoodsExchange();
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchangeObj.getSalesTxn().getStatus());
		super.deleteGoodsExchangeItemDetails(goodsExchangeDetails);
		return super.updateGoodsExchangeHeaderDetails(goodsExchangeObj);
	}

	@Override
	public GoodsExchangeDetailsDaoExt updateItem(String id, String txnType, String subTxnType, String itemId,
			GepItemUpdateRequestDto gepItemUpdateRequestDto) {
		GoodsExchangeDaoExt goodsExchangeDao = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		validateGepItems(goodsExchangeDao.getSalesTxn().getStatus(), goodsExchangeDao.getSalesTxn().getCustomerId());
		GoodsExchangeDetailsDaoExt goodsExchangeDetails = super.findByIdAndGoodsExchange(itemId, goodsExchangeDao);
		goodsExchangeDetails.setPurity(gepItemUpdateRequestDto.getMeasuredPurity());
		goodsExchangeDetails.setKarat(gepItemUpdateRequestDto.getKarat());
		goodsExchangeDetails
				.setPreMeltingDetails(MapperUtil.getStringFromJson(gepItemUpdateRequestDto.getPreMeltingDetails()));
		// at the time of item update call price api and value should be
		// modified
		GepPriceRequest gepPriceRequest = (GepPriceRequest) MapperUtil.getDtoMapping(goodsExchangeDetails,
				GepPriceRequest.class);
		MapperUtil.beanMapping(gepItemUpdateRequestDto, gepPriceRequest);
		MetalRateListDto metalRateListDto = getMetalRate(subTxnType, goodsExchangeDao);
		gepPriceRequest.setStandardPrice(metalRateListDto.getMetalRates());
		GepPriceResponseDto gepPriceResponseDto = engineService.getGepPriceDetails(gepPriceRequest);
		validateGepInput(gepItemUpdateRequestDto.getUnitValue(), gepItemUpdateRequestDto.getKarat(),
				gepPriceResponseDto);
		MapperUtil.beanMapping(gepItemUpdateRequestDto, goodsExchangeDetails);
		goodsExchangeDetails.setTotalValue(gepPriceResponseDto.getFinalValue());
		goodsExchangeDetails.setUnitValue(gepPriceResponseDto.getFinalValue());
		log.debug("unit value {}", goodsExchangeDetails.getUnitValue());
		goodsExchangeDetails.setUnitWeight(gepItemUpdateRequestDto.getMeasuredWeight());
		goodsExchangeDetails.setTotalWeight(gepItemUpdateRequestDto.getMeasuredWeight());
		goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(gepPriceResponseDto));
		// get totalTax & taxDetails JSON
		TaxCalculationResponseDto taxDetails = engineService.getTaxDetails(CommonUtil.getLocationCode(),
				goodsExchangeDao.getSalesTxn().getCustomerId(), TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.name(),
				SalesConstants.GEP_ITEM_CODE,false,null);
		BigDecimal itemTotalTax = commonTransactionService.getTaxDetails(goodsExchangeDetails.getUnitValue(), null,
				taxDetails);
		goodsExchangeDetails.setTotalTax(itemTotalTax);
		goodsExchangeDetails.setFinalValue(gepPriceResponseDto.getFinalValue().add(itemTotalTax));
		goodsExchangeDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
		goodsExchangeDetails.setSrcSyncId(goodsExchangeDetails.getSrcSyncId() + 1);
		return super.saveGoodsExchangeDetailsObj(goodsExchangeDetails);
	}

}
