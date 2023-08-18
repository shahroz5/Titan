/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dto.request.json.TepExceptionDetails;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PreMeltingDetailsDto;
import com.titan.poss.sales.dto.TaxDetailsListDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.AddTepItemRequestDto;
import com.titan.poss.sales.dto.request.GepItemDetailRequestDto;
import com.titan.poss.sales.dto.request.GepItemUpdateRequestDto;
import com.titan.poss.sales.dto.request.TepUpdateItemRequestDto;
import com.titan.poss.sales.dto.response.GepAndItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.GepItemDetailsDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.inventory.service.StockTransactionService;
import com.titan.poss.sales.repository.CustomerPaymentRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.GepItemService;
import com.titan.poss.sales.service.GoodsExchangeItemFacade;
import com.titan.poss.sales.service.TepItemService;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Service("salesGoodsExchangeItemFacade")
public class GoodsExchangeItemFacadeImpl implements GoodsExchangeItemFacade {

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private GepItemService gepItemService;

	@Autowired
	private StockTransactionService stockTransactionService;

	@Autowired
	private TepItemService tepItemService;

	@Autowired
	private EngineService engineService;
	
	@Autowired
	private BusinessDayService businessDayService;

	@Autowired 
	private CustomerPaymentRepositoryExt customerPaymentRepositoryExt;
	
	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";
	private static final String ERR_CORE_003 = "ERR-CORE-003";

	@Override
	@Transactional
	public GepAndItemDetailsResponseDto addGEPItem(String id, String txnType, String subTxnType,
			GepItemDetailRequestDto gepItemDetailRequestDto) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		if (!TransactionTypeEnum.GEP.toString().equals(txnType)) {
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060);
		}
		GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt = gepItemService.addItem(id, txnType, subTxnType,
				gepItemDetailRequestDto);
		GoodsExchangeDaoExt goodsExchangeDao = gepItemService.updateGoodsExchangeHeader(goodsExchangeDetailsDaoExt);
		return getGoodsExchangeAndItemDetailsResponse(goodsExchangeDao, goodsExchangeDetailsDaoExt, null);
	}

	private GepAndItemDetailsResponseDto getGoodsExchangeAndItemDetailsResponse(GoodsExchangeDaoExt goodsExchangeDao,
			GoodsExchangeDetailsDaoExt goodsExchangeDetailsDao, List<InventoryItemDto> detailsDtos) {
		GepAndItemDetailsResponseDto gepAndItemDetailsResponseDto = new GepAndItemDetailsResponseDto();
		GepItemDetailsDto itemDetails = (GepItemDetailsDto) MapperUtil.getDtoMapping(goodsExchangeDetailsDao,
				GepItemDetailsDto.class);
		TepPriceResponseDto tepPriceDetails =  MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(goodsExchangeDetailsDao.getPriceDetails()), TepPriceResponseDto.class);
		if (goodsExchangeDetailsDao.getCashMemoDetails() != null)
			itemDetails.setRefDocDate(
					goodsExchangeDetailsDao.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getDocDate());
		itemDetails.setPriceDetails(MapperUtil.getJsonFromString(goodsExchangeDetailsDao.getPriceDetails()));
		MetalRateListDto metalRate = commonTransactionService
				.mapMetalRateJsonToDto(goodsExchangeDao.getSalesTxn().getMetalRateDetails());
		gepAndItemDetailsResponseDto.setMetalRateList(metalRate);
		TaxDetailsListDto taxDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(goodsExchangeDao.getTaxDetails()), TaxDetailsListDto.class);
		gepAndItemDetailsResponseDto.setTaxDetails(taxDetails);
		itemDetails.setItemId(goodsExchangeDetailsDao.getId());
		itemDetails.setMeasuredPurity(goodsExchangeDetailsDao.getPurity());
		itemDetails.setMeasuredWeight(goodsExchangeDetailsDao.getUnitWeight());
		itemDetails.setTaxDetails(MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(goodsExchangeDetailsDao.getTaxDetails()),
				TaxCalculationResponseDto.class));
		if (goodsExchangeDetailsDao.getBinCode().equals("TEPSALE")) {
			itemDetails.setIsSaleable(Boolean.TRUE);
		} else {
			itemDetails.setIsSaleable(Boolean.FALSE);
		}
		Object preMeltingDetails = MapperUtil.getJsonFromString(goodsExchangeDetailsDao.getPreMeltingDetails());
		itemDetails.setPreMeltingDetails(
				MapperUtil.getObjectMapperInstance().convertValue(preMeltingDetails, PreMeltingDetailsDto.class));
		if (goodsExchangeDetailsDao.getCashMemoDetails() != null) {
			itemDetails.setCashMemoDetailsId(goodsExchangeDetailsDao.getCashMemoDetails().getId());
		}
		JsonData discountDetailsJson = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(goodsExchangeDetailsDao.getDiscountDetails()), JsonData.class);
		itemDetails.setDiscountDetails(discountDetailsJson);
		itemDetails.setRowId(goodsExchangeDetailsDao.getRowId());
		JsonData itemDetailsJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(goodsExchangeDetailsDao.getItemDetails()), JsonData.class);
		itemDetails.setItemDetails(itemDetailsJson);
		gepAndItemDetailsResponseDto.setItemDetails(itemDetails);
		MapperUtil.beanMapping(goodsExchangeDao, gepAndItemDetailsResponseDto);
		MapperUtil.beanMapping(goodsExchangeDao.getSalesTxn(), gepAndItemDetailsResponseDto);
		if (detailsDtos != null && !detailsDtos.isEmpty())
			gepAndItemDetailsResponseDto.setIsHallmarking(detailsDtos.get(0).getIsHallmarked());
		gepAndItemDetailsResponseDto.setRefundDeductionAmount(tepPriceDetails.getRefundDeductionAmount());
		gepAndItemDetailsResponseDto.setRefundDeductionPercent(tepPriceDetails.getRefundDeductionPercent());
		if( tepPriceDetails.getRefundDeductionAmount() != null){
		gepAndItemDetailsResponseDto.setNetRefundAmount(itemDetails.getFinalValue().subtract(tepPriceDetails.getRefundDeductionAmount()));
		}
		else {
			gepAndItemDetailsResponseDto.setNetRefundAmount(itemDetails.getFinalValue());
		}

		
		return gepAndItemDetailsResponseDto;
	}

	@Override
	public GepItemDetailsDto getGoodsExchangeItem(String id, String txnType, String subTxnType, String itemId) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt = new GoodsExchangeDetailsDaoExt();
		if (TransactionTypeEnum.GEP.toString().equals(txnType)) {
			goodsExchangeDetailsDaoExt = gepItemService.getGepItem(id, txnType, subTxnType, itemId);
		} else if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			if (!SubTxnTypeEnum.CUT_PIECE_TEP.name().equals(subTxnType)) {
				goodsExchangeDetailsDaoExt = tepItemService.getTepItem(id, txnType, subTxnType, itemId);
			} else {
				StockTransactionDaoExt stockTransaction = stockTransactionService.getSalesStockTransaction(id,
						subTxnType, CommonUtil.getLocationCode());
				StockTransactionDetailsDaoExt stockTxnDetails = stockTransactionService
						.getSalesStockTransactionDetails(stockTransaction, itemId);

				return getCutPeiceGoodsExchangeItemResponse(stockTransaction, stockTxnDetails);
			}

		}
		System.out.println("Goods Exchange details response is"+getGoodsExchangeItemResponse(goodsExchangeDetailsDaoExt, subTxnType));
		return getGoodsExchangeItemResponse(goodsExchangeDetailsDaoExt, subTxnType);
	}

	private GepItemDetailsDto getCutPeiceGoodsExchangeItemResponse(StockTransactionDaoExt stockTransaction,
			StockTransactionDetailsDaoExt stockTxnDetails) {
		GepItemDetailsDto cutPeiceResponse = (GepItemDetailsDto) MapperUtil.getObjectMapping(stockTxnDetails,
				new GepItemDetailsDto());
		cutPeiceResponse.setItemId(stockTxnDetails.getId());
		cutPeiceResponse.setItemType("TEP_ITEM");
		JsonData itemDetails = new JsonData();
		ObjectMapper mapper = new ObjectMapper();
		try {
			JsonNode jsonNode = mapper.readTree(stockTxnDetails.getItemDetails());
			itemDetails.setData(jsonNode.get("data"));
			itemDetails.setType(jsonNode.get("type").asText());
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		cutPeiceResponse.setItemDetails(itemDetails);
		cutPeiceResponse.setTotalValue(stockTransaction.getTotalValue());
		cutPeiceResponse.setTotalWeight(stockTransaction.getTotalWeight());
		cutPeiceResponse.setFinalValue(stockTransaction.getTotalValue());
		cutPeiceResponse.setUnitValue(stockTxnDetails.getStdValue());
		cutPeiceResponse.setUnitWeight(stockTxnDetails.getStdWeight());
		return cutPeiceResponse;
	}

	private GepItemDetailsDto getGoodsExchangeItemResponse(GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt,
			String subTxnType) {
		BigDecimal roundingVariance = BigDecimal.ZERO;
		GepItemDetailsDto gepItemDetailsDto = (GepItemDetailsDto) MapperUtil.getDtoMapping(goodsExchangeDetailsDaoExt,
				GepItemDetailsDto.class);
		gepItemDetailsDto.setPreMeltingDetails(MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(goodsExchangeDetailsDaoExt.getPreMeltingDetails()),
				PreMeltingDetailsDto.class));
		// tax details
		gepItemDetailsDto.setTaxDetails(MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(goodsExchangeDetailsDaoExt.getTaxDetails()),
				TaxCalculationResponseDto.class));
		// price details
		TepPriceResponseDto tepPriceDetails =  MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(goodsExchangeDetailsDaoExt.getPriceDetails()), TepPriceResponseDto.class);
		gepItemDetailsDto.setPriceDetails(MapperUtil.getJsonFromString(goodsExchangeDetailsDaoExt.getPriceDetails()));
		gepItemDetailsDto.setItemId(goodsExchangeDetailsDaoExt.getId());
		gepItemDetailsDto.setMeasuredPurity(goodsExchangeDetailsDaoExt.getPurity());
		gepItemDetailsDto.setMeasuredWeight(goodsExchangeDetailsDaoExt.getTotalWeight());
		JsonData discountDetailsJson = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(goodsExchangeDetailsDaoExt.getDiscountDetails()), JsonData.class);
		gepItemDetailsDto.setDiscountDetails(discountDetailsJson);
		JsonData itemDetailsJson = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(goodsExchangeDetailsDaoExt.getItemDetails()), JsonData.class);
		gepItemDetailsDto.setItemDetails(itemDetailsJson);
		if (goodsExchangeDetailsDaoExt.getBinCode().equals("TEPSALE")) {
			gepItemDetailsDto.setIsSaleable(Boolean.TRUE);
		} else {
			gepItemDetailsDto.setIsSaleable(Boolean.FALSE);
		}
		if (!StringUtils.isEmpty(goodsExchangeDetailsDaoExt.getCashMemoDetails())) {
			gepItemDetailsDto.setCashMemoDetailsId(goodsExchangeDetailsDaoExt.getCashMemoDetails().getId());
		}
		if (subTxnType.equalsIgnoreCase(SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.name())
				|| subTxnType.equalsIgnoreCase(SubTxnTypeEnum.FULL_VALUE_TEP.name())) {
			if (tepPriceDetails.getRefundDeductionAmount() != null) {
				BigDecimal finalValue = tepPriceDetails.getFinalValue().add(gepItemDetailsDto.getTotalTax());
				if(tepPriceDetails.getRefundDeductionPercent()!=null) {
				BigDecimal refundAmt = finalValue
						.multiply(tepPriceDetails.getRefundDeductionPercent().divide(BigDecimal.valueOf(100)));
				roundingVariance = commonTransactionService.getRoundingVariance(refundAmt);
				refundAmt = refundAmt.add(roundingVariance);
				tepPriceDetails.setRefundDeductionAmount(refundAmt);
				BigDecimal netRefundValue = finalValue.subtract(refundAmt);
				roundingVariance = commonTransactionService.getRoundingVariance(netRefundValue);
				gepItemDetailsDto.setNetRefundValue(netRefundValue.add(roundingVariance));

				}
				} else {
				BigDecimal finalValue = tepPriceDetails.getFinalValue().add(gepItemDetailsDto.getTotalTax());
				roundingVariance = commonTransactionService.getRoundingVariance(tepPriceDetails.getFinalValue());
				gepItemDetailsDto.setNetRefundValue(finalValue.add(roundingVariance));
			}
		} else {
			if (tepPriceDetails.getRefundDeductionAmount() != null) {
				BigDecimal finalValue = tepPriceDetails.getFinalValue().add(gepItemDetailsDto.getTotalTax());
				if(tepPriceDetails.getRefundDeductionPercent()!=null) {
				BigDecimal refundAmt = finalValue
						.multiply(tepPriceDetails.getRefundDeductionPercent().divide(BigDecimal.valueOf(100)));
				roundingVariance = commonTransactionService.getRoundingVariance(refundAmt);
				refundAmt =refundAmt.add(roundingVariance);
				tepPriceDetails.setRefundDeductionAmount(refundAmt);
				BigDecimal netRefundValue = finalValue.subtract(refundAmt);
				roundingVariance = commonTransactionService.getRoundingVariance(netRefundValue);
				gepItemDetailsDto.setNetRefundValue(netRefundValue.add(roundingVariance));
				}
				} else {
				roundingVariance = commonTransactionService.getRoundingVariance(tepPriceDetails.getFinalValue());
				gepItemDetailsDto.setNetRefundValue(tepPriceDetails.getFinalValue().add(roundingVariance));
			}
		}
		BigDecimal finalValue = gepItemDetailsDto.getTotalValue().add(gepItemDetailsDto.getTotalTax());
		 roundingVariance = commonTransactionService
				.getRoundingVariance(finalValue);
        gepItemDetailsDto.setFinalValue(finalValue.add(roundingVariance));
        if(TransactionTypeEnum.TEP.toString().equals(goodsExchangeDetailsDaoExt.getGoodsExchange().getSalesTxn().getTxnType())) {
        	 gepItemDetailsDto.setPriceDetails(tepPriceDetails);
        }
       
//		gepItemDetailsDto.setRequestApproval(checkApprovalRequired(goodsExchangeDetailsDaoExt, subTxnType));
		return gepItemDetailsDto;
	}

	@Override
	@Transactional
	public GepResponseDto deleteGoodsExchangeItem(String id, String txnType, String subTxnType, String itemId) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		GoodsExchangeDaoExt goodsExchangeDaoExt = new GoodsExchangeDaoExt();
		if (TransactionTypeEnum.GEP.toString().equals(txnType)) {
			goodsExchangeDaoExt = gepItemService.deleteGepItem(id, txnType, subTxnType, itemId);
		} else if (TransactionTypeEnum.TEP.toString().equals(txnType)) {
			goodsExchangeDaoExt = tepItemService.deleteTepItem(id, txnType, subTxnType, itemId);
		}
		GepResponseDto gepResponseDto = (GepResponseDto) MapperUtil.getDtoMapping(goodsExchangeDaoExt,
				GepResponseDto.class);
		MapperUtil.beanMapping(goodsExchangeDaoExt.getSalesTxn(), gepResponseDto);
		MetalRateListDto metalRateList = commonTransactionService
				.mapMetalRateJsonToDto(goodsExchangeDaoExt.getSalesTxn().getMetalRateDetails());
		gepResponseDto.setMetalRateList(metalRateList);
		return gepResponseDto;
	}

	@Override
	@Transactional
	public GepAndItemDetailsResponseDto updateGoodsExchangeItem(String id, String txnType, String subTxnType,
			String itemId, GepItemUpdateRequestDto gepItemUpdateRequestDto) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		if (!TransactionTypeEnum.GEP.toString().equals(txnType)) {
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060);
		}
		GoodsExchangeDetailsDaoExt goodsExchangeDetails = gepItemService.updateItem(id, txnType, subTxnType, itemId,
				gepItemUpdateRequestDto);
		GoodsExchangeDaoExt goodsExchangeDao = gepItemService.updateGoodsExchangeHeader(goodsExchangeDetails);
		return getGoodsExchangeAndItemDetailsResponse(goodsExchangeDao, goodsExchangeDetails, null);
	}

	@Override
	@Transactional
	public GepAndItemDetailsResponseDto addTepItem(String id, String txnType, String subTxnType,
			AddTepItemRequestDto tepAddItem) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		if (!TransactionTypeEnum.TEP.toString().equals(txnType)) {
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060);
		}
		GoodsExchangeDetailsDaoExt goodsExchangeDetails = tepItemService.addItem(id, txnType, subTxnType, tepAddItem);
		GoodsExchangeDaoExt goodsExchange = tepItemService.updateGoodsExchangeHeader(goodsExchangeDetails);
		List<InventoryItemDto> detailsDtos = engineService
				.getInventoryItemLotDetails(goodsExchangeDetails.getItemCode(), goodsExchangeDetails.getLotNumber());
		return getGoodsExchangeAndItemDetailsResponse(goodsExchange, goodsExchangeDetails, detailsDtos);
	}

	@Override
	@Transactional
	public GepAndItemDetailsResponseDto updateTepItem(String id, String txnType, String subTxnType, String itemId,
			TepUpdateItemRequestDto tepItemUpdateRequestDto) {
		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);
		if (!TransactionTypeEnum.TEP.toString().equals(txnType)) {
			throw new ServiceException(SalesConstants.INVALID_TRANSACTION_TYPE, SalesConstants.ERR_SALE_060);
		}
		GoodsExchangeDetailsDaoExt goodsExchangeDetails = tepItemService.updateItem(id, txnType, subTxnType, itemId,
				tepItemUpdateRequestDto);
		GoodsExchangeDaoExt goodsExchange = tepItemService.updateGoodsExchangeHeader(goodsExchangeDetails);
		return getGoodsExchangeAndItemDetailsResponse(goodsExchange, goodsExchangeDetails, null);
	}

	public boolean checkApprovalRequired(GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt, String subTxnType) {
		boolean isApprovalRequired = false;
		Map<String, String> studdedProductCodes = engineService.getProductGroupList(PlainStuddedEnum.S.toString(),
				TransactionTypeEnum.TEP.toString());
		TepItemResponseDto tepItemConfig = engineService.getTepItem(goodsExchangeDetailsDaoExt.getItemCode(), null,
				subTxnType);

		if (goodsExchangeDetailsDaoExt.getCashMemoDetails() != null
				&& goodsExchangeDetailsDaoExt.getCashMemoDetails().getLotNumber() == null && studdedProductCodes
						.containsKey(goodsExchangeDetailsDaoExt.getCashMemoDetails().getProductGroupCode())) {
			isApprovalRequired = true;
		}

		if (tepItemConfig.getTepOfferDetails() != null) {
			TepExceptionDetails tepException = new TepExceptionDetails();
			tepException = MapperUtil.getObjectMapperInstance().convertValue(
					tepItemConfig.getTepOfferDetails().getOfferDetails().getData(), TepExceptionDetails.class);
			if (!tepException.getFlatTepExchangeValue().equals("0")) {
				isApprovalRequired = false;
			}
		}
		return isApprovalRequired;
	}

}
