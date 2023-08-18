/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.ExchangeOfferRequestDto;
import com.titan.poss.core.discount.dto.ExchangeOfferResponseDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.GepConfigDetails;
import com.titan.poss.core.dto.GepDetails;
import com.titan.poss.core.dto.GepDiscountConfigurationDetailsDto;
import com.titan.poss.core.dto.GepOfferDetails;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MetalPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TepDetailsDto;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TepPaymentTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.GepConfigDetailsDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CashMemoDetailsResponseDto;
import com.titan.poss.sales.dto.ItemInvDetailsDto;
import com.titan.poss.sales.dto.TaxDetailsListDto;
import com.titan.poss.sales.dto.TepDiscountDetailsDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.dto.response.CoinOfferDiscountDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.GepPurityDiscountDto;
import com.titan.poss.sales.dto.response.GoodExchangeDiscountDetailsDto;
import com.titan.poss.sales.dto.response.KaratExchangeDiscountDto;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.repository.CashMemoDetailsRepository;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepository;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeRepositoryExt;
import com.titan.poss.sales.repository.GrnDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.EngineService;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Slf4j
@Service("baseGoodsService")
public abstract class BaseGoodsServiceImpl {

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepositoryExt;

	@Autowired
	private GoodsExchangeRepositoryExt goodsExchangeRepository;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	public GoodsExchangeDetailsRepositoryExt goodsExchangeDetailsRepository;

	@Autowired
	private CashMemoDetailsRepository cashMemoDetailsRepository;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsExtRepository;

	@Autowired
	private CashMemoRepository cashMemoRepository;

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private InventoryService inventoryService;

	@Autowired
	private CreditNoteService creditNoteService;

	@Autowired
	private GrnDetailsRepositoryExt grnDetailsRepositoryExt;

	@Autowired
	private BusinessDayService businessDayService;

	private static final String ERROR_IN_PARSNG_JSON = "ERROR IN PARSNG JSON";
	private static final String ERR_CORE_003 = "ERR-CORE-003";
	private static final String MOBILE_NO = "customerMobileNo";

	protected SalesTxnDaoExt saveSalesObject(SalesTxnDaoExt salesTxnDao) {
		return salesTxnRepositoryExt.save(salesTxnDao);
	}

	protected SalesTxnDao saveSalesObject(SalesTxnDao salesTxnDao) {
		return salesTxnRepository.save(salesTxnDao);
	}

	protected GoodsExchangeDaoExt saveGoodsExchangeObject(GoodsExchangeDaoExt goodsExchangeDaoExt) {
		return goodsExchangeRepository.save(goodsExchangeDaoExt);
	}

	protected SalesTxnDaoExt createGoodsExchange(SalesTxnDaoExt salesTxnDao, String txnType, String subTxnType,
			SalesDocTypeEnum docType, TransactionStatusEnum status) {
		return commonTransactionService.getSalesTxnDao(salesTxnDao, txnType, subTxnType, docType, status);
	}

	protected GoodsExchangeDaoExt getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(String id, String txnType,
			String subTxnType) {
		GoodsExchangeDaoExt goodsExchangeDao = goodsExchangeRepository.getGoodsExchangeByIdAndTxnTypeAndSubTxnType(id,
				txnType, subTxnType);
		if (goodsExchangeDao == null) {
			throw new ServiceException("No Goods Exchange found for requested id or txnType or subTxnType",
					"ERR-SALE-078", "No Goods Exchange found for requested id : " + id + " or txnType : " + txnType
							+ " or subTxnType : " + subTxnType);
		}
		return goodsExchangeDao;
	}

	protected List<GoodsExchangeDetailsDaoExt> findGoodsExchangeDetailsByGoodsExchange(
			GoodsExchangeDaoExt goodsExchangeDaoExt) {
		return goodsExchangeDetailsRepository.findByGoodsExchange(goodsExchangeDaoExt);
	}

	protected SalesTxnDaoExt getSalesTxnDao(SalesTxnDaoExt salesTxnDao, String txnType, String subTxnType,
			SalesDocTypeEnum docType, TransactionStatusEnum status) {
		return commonTransactionService.getSalesTxnDao(salesTxnDao, txnType, subTxnType, docType, status);
	}

	protected GoodsExchangeDetailsDaoExt saveGoodsExchangeDetailsObj(
			GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt) {
		return goodsExchangeDetailsRepository.save(goodsExchangeDetailsDaoExt);
	}

	protected GoodsExchangeDaoExt updateGoodsExchangeHeaderDetails(GoodsExchangeDaoExt goodsExchange) {
		BigDecimal totalWeight = BigDecimal.ZERO;
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalTax = BigDecimal.ZERO;
		BigDecimal hallMarkingCharges = BigDecimal.ZERO;
		BigDecimal refundValue = BigDecimal.ZERO;
		int count = 0;
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = findGoodsExchangeDetailsByGoodsExchange(
				goodsExchange);
		List<TaxCalculationResponseDto> taxes = new ArrayList<>();
		SalesTxnDaoExt salesObj = goodsExchange.getSalesTxn();
		for (GoodsExchangeDetailsDaoExt goodsExchangeDetails : goodsExchangeDetailsList) {
			totalWeight = totalWeight.add(goodsExchangeDetails.getTotalWeight());
			totalValue = totalValue.add(goodsExchangeDetails.getTotalValue());
			totalTax = totalTax.add(goodsExchangeDetails.getTotalTax());
			if (goodsExchangeDetails.getTaxDetails() != null && !"{}".equals(goodsExchangeDetails.getTaxDetails())) {
				taxes.add(MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(goodsExchangeDetails.getTaxDetails()),
						TaxCalculationResponseDto.class));
			}
			count = count + goodsExchangeDetails.getQuantity();
			if (goodsExchangeDetails.getCashMemoDetails() != null) {
				salesObj.setRefSubTxnType(
						goodsExchangeDetails.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getSubTxnType());
				salesObj.setRefTxnId(goodsExchangeDetails.getCashMemoDetails().getCashMemoDao().getSalesTxnDao());
				salesObj.setRefTxnType(
						goodsExchangeDetails.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getTxnType());
			}
			goodsExchangeDetails.setSrcSyncId(goodsExchangeDetails.getSrcSyncId() + 1);
			TepPriceResponseDto tepPriceResponse = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(goodsExchangeDetails.getPriceDetails()), TepPriceResponseDto.class);
			if (tepPriceResponse != null && tepPriceResponse.getHallMarkingCharges() != null) {
				hallMarkingCharges = tepPriceResponse.getHallMarkingCharges();
			}
//			BigDecimal itemRefundAmt = tepPriceResponse.getRefundDeductionAmount();
			BigDecimal itemRefundAmt = goodsExchange.getRefundValue();
			if (TepPaymentTypeEnum.REFUND.toString().equals(goodsExchange.getPaymentType())) {
				refundValue = refundValue.add(itemRefundAmt);
//				goodsExchangeDetails.setFinalValue(goodsExchangeDetails.getFinalValue().subtract(itemRefundAmt));
			}			
		}
		// combined tax details at header
		TaxDetailsListDto taxDetails = new TaxDetailsListDto(taxes);
		if (!taxes.isEmpty()) {
			goodsExchange.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
		}
		BigDecimal finalValue = totalValue.add(totalTax).subtract(refundValue);
		
		BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(finalValue);
		goodsExchange.setTotalQuantity((short) count);
		goodsExchange.setTotalTax(totalTax);
		goodsExchange.setTotalWeight(totalWeight);
		goodsExchange.setFinalValue(finalValue.add(roundingVariance).add(hallMarkingCharges));
		goodsExchange.setRefundValue(refundValue);
		roundingVariance = commonTransactionService.getRoundingVariance(totalValue);
//		goodsExchange.setTotalValue(totalValue.add(roundingVariance));
		goodsExchange.setTotalValue(totalValue);
//		goodsExchange.setRoundingVariance(roundingVariance);
		// if manual bill, then check if total weight and final value of GEP/TEP exceeds
		// manual bill values need to update method with WeightDetailsDto passing null
		// to avoid CE as of now

		WeightDetailsDto weightDetailsDto = getGoodsExchangeWeightDetails(goodsExchangeDetailsList);
		commonTransactionService.manualBillValuesWithHeader(goodsExchange.getTotalWeight(),
				goodsExchange.getTotalValue(), goodsExchange.getSalesTxn(), false, weightDetailsDto);
		salesTxnRepositoryExt.save(salesObj);
		//saveGoodsExchangeDetailsListObject(goodsExchangeDetailsList);
		return goodsExchangeRepository.save(goodsExchange);
	}

	protected GoodsExchangeDetailsDaoExt findByIdAndGoodsExchange(String id, GoodsExchangeDaoExt goodsExchangeDaoExt) {
		GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt = goodsExchangeDetailsRepository
				.findByIdAndGoodsExchange(id, goodsExchangeDaoExt);
		if (goodsExchangeDetailsDaoExt == null) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"id : " + goodsExchangeDaoExt.getId() + " & item id : " + id, Map.of("type", "item"));
		}
		return goodsExchangeDetailsDaoExt;
	}

	protected void deleteGoodsExchangeItemDetails(GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt) {
		goodsExchangeDetailsRepository.delete(goodsExchangeDetailsDaoExt);
	}

	protected List<CashMemoDetailsDao> findCashMemoDetailsByDocNoAndLocationCodeAndFiscalYearAndTxnType(Integer docNo,
			Short fiscalYear, String locationCode, String txnType) {
		return cashMemoDetailsRepository.findByDocNoAndLocationCodeAndFiscalYearAndTxnType(docNo, locationCode,
				fiscalYear, txnType);
	}

	protected List<CashMemoDetailsResponseDto> findCashMemoDetailsByLocationCodeItemCodeAndCustomerMobileNoOrCustomerId(
			String itemCode, String customerMobileNo, String customerId, String locationCode) {
		List<Object[]> arry = cashMemoDetailsRepository.getCashMemoByVarientCodeAndMobileNumberAndCustomerId(itemCode,
				CryptoUtil.encrypt(customerMobileNo,MOBILE_NO, false), locationCode, customerId);
		return mapCashMemoDetailsResponseDto(arry);
	}
	
	protected SalesTxnDao getSalesObjectByIdAndLocationCodeAndTxnType(String id, String locationCode, String txnType) {
		return salesTxnRepository.findByIdAndLocationCodeAndTxnType(id, locationCode, txnType);
	}

	protected List<CashMemoDetailsDao> saveCashMemoDetailsListObject(List<CashMemoDetailsDao> cmDetailsList) {
		return cashMemoDetailsRepository.saveAll(cmDetailsList);
	}

	protected CashMemoDao saveCashMemoObject(CashMemoDao cashMemoDao) {
		return cashMemoRepository.save(cashMemoDao);
	}

	protected CashMemoDetailsDaoExt findCashMemoDetailsById(String cashMemoDetailId) {
		return cashMemoDetailsExtRepository.findById(cashMemoDetailId)
				.orElseThrow(() -> new ServiceException(SalesConstants.NO_CM_DETAILS_ID, SalesConstants.ERR_SALE_196,
						"cash memo details id : " + cashMemoDetailId));
	}

	protected long getSumOfTotalQuantityInGoodsExchangeDetailsByCashMemoDetails(String cashMemoDetailsId) {
		return goodsExchangeDetailsRepository.getSumOfTotalQuantityByCashMemoDetails(cashMemoDetailsId);
	}

	protected long getSumOfTotalQuantityInGRNDetailsByCashMemoDetails(String cashMemoDetailsId) {
		return grnDetailsRepositoryExt.getSumOfTotalQuantityByCashMemoDetails(cashMemoDetailsId);
	}

	protected void docNoGeneration(String status, String txnType, String subTxnType, GoodsExchangeDaoExt goodsExchange,
			SalesDocTypeEnum salesDocType) {
		// sales doc number generation if sales_txn was previously in 'OPEN' status.
		if (TransactionStatusEnum.OPEN.name().equals(goodsExchange.getSalesTxn().getStatus())
				&& TransactionStatusEnum.HOLD.toString().equals(status)) {
			SalesTxnDaoExt salesTxn = commonTransactionService.getSalesTxnDao(goodsExchange.getSalesTxn(), txnType,
					subTxnType, salesDocType, TransactionStatusEnum.HOLD);
			goodsExchange.setSalesTxn(salesTxn);
		} else if (TransactionStatusEnum.CONFIRMED.toString().equals(status)) {
			// for confirm new doc no should be generated
			SalesTxnDaoExt salesTxn = commonTransactionService.getSalesTxnDao(goodsExchange.getSalesTxn(), txnType,
					subTxnType, salesDocType, TransactionStatusEnum.CONFIRMED);
			goodsExchange.setSalesTxn(salesTxn);
		} else if (TransactionStatusEnum.APPROVAL_PENDING.toString().equals(status)) {
			// for approval pending new doc no should be generated
			SalesTxnDaoExt salesTxn = commonTransactionService.getSalesTxnDao(goodsExchange.getSalesTxn(), txnType,
					subTxnType, salesDocType, TransactionStatusEnum.APPROVAL_PENDING);
			goodsExchange.setSalesTxn(salesTxn);
		}
		log.debug("doc no in BaseGoodsServiceImpl ---- {}", goodsExchange.getSalesTxn().getDocNo());
	}

	protected WeightDetailsDto getGoodsExchangeWeightDetails(
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList) {
		BigDecimal initalValue = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
		WeightDetailsDto weightDetailsDto = new WeightDetailsDto(initalValue, initalValue, initalValue, initalValue,
				initalValue, initalValue);
		Boolean isBiMetal = false;
		if (goodsExchangeDetailsList.size() > 1) {
			if (goodsExchangeDetailsList.get(0).getGoodsExchange().getSalesTxn().getManualBillDetails() != null) {
				try {

					ObjectMapper mapper = new ObjectMapper();
					JsonNode root = mapper.readTree(
							goodsExchangeDetailsList.get(0).getGoodsExchange().getSalesTxn().getManualBillDetails());
					JsonNode dataNode = root.path("data");
					if (!dataNode.isMissingNode() && dataNode.hasNonNull("isBimetal")) {
						isBiMetal = dataNode.path("isBimetal").asBoolean();

					}
				} catch (IOException e) {
					throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
				}

			}
		}

		if (BooleanUtils.isTrue(isBiMetal)) {
			goodsExchangeDetailsList.forEach(record -> {
				TepPriceResponseDto priceDetails = MapperUtil.mapObjToClass(record.getPriceDetails(),
						TepPriceResponseDto.class);
				MetalPriceDetailsDto metalPriceDetails = MapperUtil.mapObjToClass(priceDetails.getMetalPriceDetails(),
						MetalPriceDetailsDto.class);

				BigDecimal goldWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
				BigDecimal platinumWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
				BigDecimal silverWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
				if (metalPriceDetails != null) {
					List<MetalPriceDto> metalPrices = metalPriceDetails.getMetalPrices();
					for (MetalPriceDto metalPrice : metalPrices) {
						if (MetalTypeCodeEnum.J.name().equals(metalPrice.getMetalTypeCode())
								&& metalPrice.getNetWeight() != null) {
							goldWeight = goldWeight.add(metalPrice.getNetWeight());

						} else if (MetalTypeCodeEnum.P.name().equals(metalPrice.getMetalTypeCode())
								&& metalPrice.getNetWeight() != null) {
							silverWeight = silverWeight.add(metalPrice.getNetWeight());
						} else if (MetalTypeCodeEnum.L.name().equals(metalPrice.getMetalTypeCode())
								&& metalPrice.getNetWeight() != null) {
							platinumWeight = platinumWeight.add(metalPrice.getNetWeight());
						}
					}
				} else {
					if (MetalTypeCodeEnum.J.name().equals(record.getMetalType())) {
						goldWeight = record.getUnitWeight();
					} else if (MetalTypeCodeEnum.P.name().equals(record.getMetalType())) {
						silverWeight = record.getUnitWeight();
					} else if (MetalTypeCodeEnum.L.name().equals(record.getMetalType())) {
						platinumWeight = record.getUnitWeight();
					}
				}
				log.debug("goldWeight : {}", goldWeight);
				log.debug("silverWeight : {}", silverWeight);
				log.debug("silverWeight : {}", silverWeight);
				weightDetailsDto.setGoldWeight(weightDetailsDto.getGoldWeight().add(goldWeight));
				weightDetailsDto.setPlatinumWeight(weightDetailsDto.getPlatinumWeight().add(platinumWeight));
				weightDetailsDto.setSilverWeight(weightDetailsDto.getSilverWeight().add(silverWeight));
			});
		} else {
			goodsExchangeDetailsList.forEach(record -> {
				TepPriceResponseDto priceDetails = MapperUtil.mapObjToClass(record.getPriceDetails(),
						TepPriceResponseDto.class);
				MetalPriceDetailsDto metalPriceDetails = MapperUtil.mapObjToClass(priceDetails.getMetalPriceDetails(),
						MetalPriceDetailsDto.class);

				BigDecimal goldWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
				BigDecimal platinumWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
				BigDecimal silverWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
				if (metalPriceDetails != null) {
					if (MetalTypeCodeEnum.J.name().equals(record.getMetalType())) {
						goldWeight = record.getUnitWeight();
					} else if (MetalTypeCodeEnum.P.name().equals(record.getMetalType())) {
						silverWeight = record.getUnitWeight();
					} else if (MetalTypeCodeEnum.L.name().equals(record.getMetalType())) {
						platinumWeight = record.getUnitWeight();
					}
				} else {
					if (MetalTypeCodeEnum.J.name().equals(record.getMetalType())) {
						goldWeight = record.getUnitWeight();
					} else if (MetalTypeCodeEnum.P.name().equals(record.getMetalType())) {
						silverWeight = record.getUnitWeight();
					} else if (MetalTypeCodeEnum.L.name().equals(record.getMetalType())) {
						platinumWeight = record.getUnitWeight();
					}
				}
				log.debug("goldWeight : {}", goldWeight);
				log.debug("silverWeight : {}", silverWeight);
				log.debug("silverWeight : {}", silverWeight);
				weightDetailsDto.setGoldWeight(weightDetailsDto.getGoldWeight().add(goldWeight));
				weightDetailsDto.setPlatinumWeight(weightDetailsDto.getPlatinumWeight().add(platinumWeight));
				weightDetailsDto.setSilverWeight(weightDetailsDto.getSilverWeight().add(silverWeight));
			});
		}

		return weightDetailsDto;
	}

	protected List<GoodsExchangeDetailsDaoExt> saveGoodsExchangeDetailsListObject(
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetails) {
		return goodsExchangeDetailsRepository.saveAll(goodsExchangeDetails);
	}

	protected Map<String, String> addItemsInInventory(Date docDate, Integer docNo, SalesDocTypeEnum docType,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, List<InventoryDetailsDao> inventoryDetailsList,
			Short fiscalYear) {
		Map<String, String> inventoryMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(goodsExchangeDetailsList)) {
			for (GoodsExchangeDetailsDaoExt record : goodsExchangeDetailsList) {
				ItemDto itemDetails = getItemDetails(record.getItemCode());
				InventoryDetailsDao invDetails = (InventoryDetailsDao) MapperUtil.getDtoMapping(record,
						InventoryDetailsDao.class, "id");
				MapperUtil.beanMapping(record.getGoodsExchange().getSalesTxn(), invDetails);
				invDetails.setId(UUID.randomUUID().toString());
				log.debug("inventory id : {}", invDetails.getId());
				if (record.getBinCode().equals("TEP") || record.getBinCode().equals("CUTPIECE")
						|| record.getBinCode().equals("TEPSALE")) {
					invDetails.setBinGroupCode("TEP");
				} else {
					invDetails.setBinGroupCode(record.getBinCode());
				}
				invDetails.setBinModifiedDate(CalendarUtils.getCurrentDate());
				invDetails.setDocNumber(docNo);
				invDetails.setTotalQuantity(record.getQuantity());
				invDetails.setTotalValue(record.getUnitValue().multiply(new BigDecimal(record.getQuantity())));
				invDetails.setStdValue(record.getUnitValue());
				if (TepPaymentTypeEnum.REFUND.toString().equals(record.getGoodsExchange().getPaymentType())){
					invDetails.setTotalValue(record.getFinalValue());
					invDetails.setStdValue(record.getFinalValue());
				}
				invDetails.setStdWeight(record.getUnitWeight());
				invDetails.setStockInwardDate(docDate);
				invDetails.setSerialNumber(String.valueOf(record.getUnitWeight()));
				invDetails.setIssuedQuantity((short) 0);
				invDetails.setProductCategory(itemDetails.getProductCategoryCode());
				invDetails.setProductGroup(itemDetails.getProductGroupCode());
				invDetails.setMfgDate(docDate);
				invDetails.setKarat(record.getKarat());
				invDetails.setRequestQuantity((short) (0));
				invDetails.setRequestType(null);
				// need to change hardcoded value
				invDetails.setOrgCode("TJEW");

				WeightDetailsDto weightDetails = getGoodsExchangeWeightDetails(List.of(record));
				JsonData inventoryWeightDetails = new JsonData();
				inventoryWeightDetails.setType("WEIGHT_DETAILS");
				inventoryWeightDetails.setData(weightDetails);
				invDetails.setTotalWeightDetails(MapperUtil.getStringFromJson(inventoryWeightDetails));

				if (record.getCashMemoDetails() != null) {
					PriceDetailsDto cmDetailsPriceDetails = MapperUtil
							.mapObjToClass(record.getCashMemoDetails().getPriceDetails(), PriceDetailsDto.class);
					invDetails.setItemDiscount(cmDetailsPriceDetails.getDiscountRecovered() != null
							? new BigDecimal(cmDetailsPriceDetails.getDiscountRecovered())
							: BigDecimal.ZERO);
					// hallmark for TEP from CM
					// set item details
					PriceDetailsDto priceDetails = MapperUtil
							.mapObjToClass(record.getCashMemoDetails().getPriceDetails(), PriceDetailsDto.class);
					if (priceDetails.getItemHallmarkDetails() != null) {
						invDetails.setIsHallmarked(priceDetails.getItemHallmarkDetails().getIsHallmarked());
					}
				}
				if(SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(invDetails.getProductGroup())) {
//					  List<InventoryDetailsDao> invExistDetails = inventoryService.getItemsByItemCodeAndBinGroupCodeAndLocationCode(record.getItemCode(),
//		            		  BinGroupEnum.TEP.name(), CommonUtil.getLocationCode());
//					  if(invExistDetails!=null) {
//						  invDetails.setLotNumber(invExistDetails.get(0).getLotNumber());
//					  }
					  //else {
						  if(record.getCashMemoDetails()!=null) {
							  Map<String, Object> itemData = new HashMap();
							  JsonData itemJsonData = MapperUtil.mapObjToClass(record.getCashMemoDetails().getItemDetails(), JsonData.class);
								if(itemJsonData != null)
								 itemData = MapperUtil.mapObjToClass(itemJsonData.getData(), Map.class);
								Object itemDetail = itemData.values().stream().findFirst().get();
								ItemInvDetailsDto itemInvDetailsDto = MapperUtil.mapObjToClass(itemDetails,
										ItemInvDetailsDto.class);
								invDetails.setLotNumber(itemInvDetailsDto.getLotNumber());
								
						  }
					  }
					  
				//}
				
				inventoryDetailsList.add(invDetails);
				inventoryMap.put(record.getId(), invDetails.getId());
			}
		}
		inventoryService.addInventoryDetails(inventoryDetailsList, docNo, docType, fiscalYear);
		return inventoryMap;
	}

	protected ItemDto getItemDetails(String itemCode) {
		ItemSearchRequestDto itemsearch = new ItemSearchRequestDto();
		itemsearch.setItemCode(itemCode);
		PagedRestResponse<List<ItemDto>> itemList = engineService.getItems(itemsearch);
		return itemList.getResults().get(0);
	}

	/**
	 * @param goodsExchangeDaoExt
	 * @param string
	 */
	protected Integer generateCN(String cnType, GoodsExchangeDaoExt goodsExchangeDaoExt, String remarks,
			JsonData discountDetails, GepConfigDetailsDaoExt gepConfigDetailsDao) {
		CreditNoteCreateDto cnCreateDto = new CreditNoteCreateDto();
		List<CreditNoteIndvCreateDto> cNIndividualList = new ArrayList<>();
		CreditNoteIndvCreateDto cnindividual = new CreditNoteIndvCreateDto();
		cnCreateDto.setCustomerId(goodsExchangeDaoExt.getSalesTxn().getCustomerId());
		cnCreateDto.setDocDate(goodsExchangeDaoExt.getSalesTxn().getDocDate());
		cnCreateDto.setSalesTxn(goodsExchangeDaoExt.getSalesTxn());
		cnindividual.setAmount(goodsExchangeDaoExt.getFinalValue());
		cnindividual.setCreditNoteType(cnType);
		cnindividual.setRemarks(remarks);
		cnindividual.setDiscountDetails(discountDetails);
		cnindividual.setGepConfigDetailsDao(gepConfigDetailsDao);
		cnindividual.setRefundValue(goodsExchangeDaoExt.getRefundValue());
		cNIndividualList.add(cnindividual);
		cnCreateDto.setCNIndividual(cNIndividualList);
		cnCreateDto.setRefDocNo(goodsExchangeDaoExt.getSalesTxn().getDocNo());
		cnCreateDto.setRefDocType(goodsExchangeDaoExt.getSalesTxn().getTxnType());
		cnCreateDto.setRefFiscalYear(goodsExchangeDaoExt.getSalesTxn().getFiscalYear());
		List<CreditNoteResponse> creditNoteResponse = creditNoteService.createNewCreditNote(cnCreateDto);
		return creditNoteResponse.get(0).getDocNo();
	}

	protected long getCountOfTotalQuantityByGoodsExchange(GoodsExchangeDaoExt goodsExchange) {
		return goodsExchangeDetailsRepository.getCountOfTotalQuantityByGoodsExchange(goodsExchange);
	}

	protected List<InventoryDetailsDao> removeItemFromInventory(GoodsExchangeDaoExt goodsExchangeDaoExt,
			GoodsExchangeDetailsDaoExt goodsExchangeDetails) {
		UpdateInventoryDto updateInventory = new UpdateInventoryDto();
		updateInventory.setId(goodsExchangeDetails.getInventoryId());
		updateInventory.setTotalQuantity((short) 1);
		List<UpdateInventoryDto> updateInvList = List.of(updateInventory);
		return inventoryService.removeFromInventoryDetails(updateInvList, goodsExchangeDaoExt.getSalesTxn().getDocNo(),
				SalesDocTypeEnum.TEP);
	}

	protected String getProductGroupCode(String itemCode) {
		ItemSearchRequestDto itemsearch = new ItemSearchRequestDto();
		itemsearch.setItemCode(itemCode);
		PagedRestResponse<List<ItemDto>> itemList = engineService.getItems(itemsearch);
		if (CollectionUtils.isEmpty(itemList.getResults())) {
			throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
					"itemCode : " + itemCode);
		}
		return itemList.getResults().get(0).getProductGroupCode();
	}

	protected List<KaratExchangeDiscountDto> getKaratageDiscountDetails(String discountType, String transactionType,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList,
			List<KaratExchangeDiscountDto> karatExchangeList) {
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		KaratExchangeDiscountDto karatExchange = null;
		BigDecimal oneKTValue = BigDecimal.ZERO;
		BigDecimal twoKTValue = BigDecimal.ZERO;
		for (GoodsExchangeDetailsDaoExt record : goodsExchangeDetailsList) {
			ExchangeOfferRequestDto exchangeOfferRequestDto = new ExchangeOfferRequestDto();
			exchangeOfferRequestDto.setTepDate(businessDate);
			exchangeOfferRequestDto.setKaratage(record.getKarat());
			if (TransactionTypeEnum.TEP.name().equals(transactionType)) {
				exchangeOfferRequestDto.setProductGroupCode(getProductGroupCode(record.getItemCode()));
			}
			ExchangeOfferResponseDto discountOffer = engineService.getExchangeOrCoinOfferDiscountDetails(discountType,
					transactionType, exchangeOfferRequestDto);

			for (DiscountDetailsBaseDto data : discountOffer.getDiscountDetails()) {
				if (karatExchange == null) {
					karatExchange = (KaratExchangeDiscountDto) MapperUtil.getDtoMapping(data,
							KaratExchangeDiscountDto.class);
				}
				BigDecimal karat = record.getKarat();
				oneKTValue = oneKTValue
						.add(record.getFinalValue().divide(karat, MathContext.DECIMAL128)
								.multiply(karat.add(BigDecimal.ONE)))
						.subtract(record.getFinalValue())
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
				twoKTValue = twoKTValue
						.add(record.getFinalValue().divide(karat, MathContext.DECIMAL128)
								.multiply(karat.add(new BigDecimal(2))))
						.subtract(record.getFinalValue())
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			}
		}

		if (karatExchange != null) {
			karatExchange.setOneKTDiscountValue(oneKTValue);
			karatExchange.setTwoKTDiscountValue(twoKTValue);
			karatExchangeList.add(karatExchange);
		}

		return karatExchangeList;
	}

	protected GoodExchangeDiscountDetailsDto getApplicableDiscounts(GoodsExchangeDaoExt goodsExchangeDaoExt,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList) {

		if (CollectionUtil.isEmpty(goodsExchangeDetailsList)) {
			return null;
		}

		List<KaratExchangeDiscountDto> karatExchangeList = new ArrayList<>();
		getKaratageDiscountDetails(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.toString(),
				goodsExchangeDaoExt.getSalesTxn().getTxnType(), goodsExchangeDetailsList, karatExchangeList);

		Map<String, Object> discountObj = new HashMap<>();
		if (!CollectionUtils.isEmpty(karatExchangeList)) {
			discountObj.put(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name(), karatExchangeList);
		}

		GepConfigDetailsDaoExt gepConfigDetailsDaoExt = null;
		// get GEP purity details
		if (TransactionTypeEnum.GEP.name().equals(goodsExchangeDaoExt.getSalesTxn().getTxnType())) {
			gepConfigDetailsDaoExt = getPurityDetailsForGepOffer(goodsExchangeDetailsList, discountObj);

		}

		// Coin offer discount
		if (TransactionTypeEnum.TEP.name().equals(goodsExchangeDaoExt.getSalesTxn().getTxnType())) {
			List<CoinOfferDiscountDto> coinOfferDiscountList = new ArrayList<>();
			getCoinOfferDiscountDetails(DiscountTypeEnum.COIN_OFFER_DISCOUNT.toString(),
					goodsExchangeDaoExt.getSalesTxn().getTxnType(), goodsExchangeDetailsList, coinOfferDiscountList);
			if (!CollectionUtils.isEmpty(coinOfferDiscountList)) {
				discountObj.put(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name(), coinOfferDiscountList);
			}

		}
		// ---- Coin Offer Discount

		return new GoodExchangeDiscountDetailsDto(discountObj, gepConfigDetailsDaoExt);
	}

	private GepConfigDetailsDaoExt getPurityDetailsForGepOffer(
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, Map<String, Object> discountObj) {
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		GepDiscountConfigurationDetailsDto gepDiscountConfigDetails = getGepOfferConfig(goodsExchangeDetailsList,
				businessDate);

		// 4. if all details required for config are not present then throw error?
		if (gepDiscountConfigDetails == null || BooleanUtils.isNotTrue(gepDiscountConfigDetails.getIsOfferEnabled())) {
			return null;
		}

		// 5. Get discount id to store in Credit Note.
		DiscountBillLevelRequestDto discountBillLevelRequestDto = new DiscountBillLevelRequestDto();
		discountBillLevelRequestDto.setBusinessDate(CalendarUtils.addOffSetTimeZone(businessDate));
		discountBillLevelRequestDto.setDiscountType(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name());

		// call engine API to get discount id
		DiscountBillLevelResponseDto discountBillLevelResponseDto = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequestDto);
		if (CollectionUtil.isEmpty(discountBillLevelResponseDto.getDiscountDetails())) {
			// throw error
			throw new ServiceException("Discount doesn't exist", "ERR-DISC-006",
					"Discount Type: " + DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name() + ", is not configured.");
		}

		String discountCode = discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountCode();
		String discountId = discountBillLevelResponseDto.getDiscountDetails().get(0).getDiscountId();

		// 6. Set deduction as discount in CN generated
		Map<BigDecimal, GepPurityDiscountDto> gepPurityDetails = new HashMap<>();
		goodsExchangeDetailsList.forEach(gepDetailsDao -> {
			GepPurityDiscountDto gepPurityDiscountDto;
			GepPriceResponseDto gepPriceDetails = MapperUtil.mapObjToClass(gepDetailsDao.getPriceDetails(),
					GepPriceResponseDto.class);
			if (gepPurityDetails.containsKey(gepDetailsDao.getPurity())) {
				gepPurityDiscountDto = gepPurityDetails.get(gepDetailsDao.getPurity());
				gepPurityDiscountDto.setDiscountValue(gepPurityDiscountDto.getDiscountValue()
						.add(gepPriceDetails.getNetValue().subtract(gepPriceDetails.getFinalValue())));
				gepPurityDetails.put(gepDetailsDao.getPurity(), gepPurityDiscountDto);
			} else {

				gepPurityDiscountDto = new GepPurityDiscountDto();

				gepPurityDiscountDto.setGepItemPurity(gepDetailsDao.getPurity());
				gepPurityDiscountDto.setConfigId(gepPriceDetails.getConfigId());
				gepPurityDiscountDto.setConfigCode(gepPriceDetails.getConfigCode());
				gepPurityDiscountDto.setConfigType(gepPriceDetails.getConfigType());
				gepPurityDiscountDto.setDiscountType(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name());
				gepPurityDiscountDto.setDiscountCode(discountCode);
				gepPurityDiscountDto.setDiscountId(discountId);
				gepPurityDiscountDto
						.setDiscountValue(gepPriceDetails.getNetValue().subtract(gepPriceDetails.getFinalValue()));
				// if deduction value is present, only then add it to list
				if (gepPurityDiscountDto.getDiscountValue().compareTo(BigDecimal.ZERO) > 0) {
					gepPurityDetails.put(gepDetailsDao.getPurity(), gepPurityDiscountDto);
				}
			}
		});
		// round off on discount value (to not include decimal values)
		gepPurityDetails.forEach((purity, gepPurityDiscountDto) -> gepPurityDiscountDto
				.setDiscountValue(gepPurityDiscountDto.getDiscountValue().setScale(0, RoundingMode.FLOOR)));

		GepConfigDetailsDaoExt gepConfigDetailsDaoExt = null;
		if (!CollectionUtils.isEmpty(gepPurityDetails)) {
			discountObj.put(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name(),
					gepPurityDetails.values().stream().collect(Collectors.toList()));
			// to save all config data
			gepConfigDetailsDaoExt = setGepConfigDetailsDao(gepDiscountConfigDetails);
		}

		return gepConfigDetailsDaoExt;
	}

	private GepConfigDetailsDaoExt setGepConfigDetailsDao(GepDiscountConfigurationDetailsDto gepDiscountConfigDetails) {
		GepConfigDetailsDaoExt gepConfigDetailsDaoExt;
		gepConfigDetailsDaoExt = (GepConfigDetailsDaoExt) MapperUtil.getObjectMapping(gepDiscountConfigDetails,
				new GepConfigDetailsDaoExt());
		gepConfigDetailsDaoExt
				.setOfferDetails(MapperUtil.getStringFromJson(gepDiscountConfigDetails.getOfferDetails()));
		gepConfigDetailsDaoExt
				.setConfigDetails(MapperUtil.getStringFromJson(gepDiscountConfigDetails.getConfigDetails()));
		if (gepDiscountConfigDetails.getExcludeItemCodeList() != null) {
			gepConfigDetailsDaoExt.setExcludeItemCode(
					MapperUtil.getStringFromJson(gepDiscountConfigDetails.getExcludeItemCodeList()));
		}
		if (gepDiscountConfigDetails.getExcludeThemeCodeList() != null) {
			gepConfigDetailsDaoExt.setExcludeThemeCode(
					MapperUtil.getStringFromJson(gepDiscountConfigDetails.getExcludeThemeCodeList()));
		}
		gepConfigDetailsDaoExt.setPurityProductGroupDetails(
				MapperUtil.getStringFromJson(gepDiscountConfigDetails.getPurityProductDetails()));
		if (gepDiscountConfigDetails.getRivaahAdditionalpurityProductDetails() != null) {
			gepConfigDetailsDaoExt.setRivaahPurityProductGroupDetails(
					MapperUtil.getStringFromJson(gepDiscountConfigDetails.getRivaahAdditionalpurityProductDetails()));
		}
		return gepConfigDetailsDaoExt;
	}

	private GepDiscountConfigurationDetailsDto getGepOfferConfig(
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, Date businessDate) {

		ListResponse<GepDiscountConfigurationDetailsDto> gepDiscountConfigDetailsList = engineService
				.getGEPDiscountConfigs(goodsExchangeDetailsList.stream().map(GoodsExchangeDetailsDaoExt::getPurity)
						.collect(Collectors.toList()));

		// 1. if IsOfferEnabled is not true, then return
		if (CollectionUtil.isEmpty(gepDiscountConfigDetailsList.getResults())
				|| !BooleanUtils.isTrue(gepDiscountConfigDetailsList.getResults().get(0).getIsOfferEnabled())) {
			return null;
		}

		GepDiscountConfigurationDetailsDto gepDiscountConfigDetails = gepDiscountConfigDetailsList.getResults().get(0);

		// config details check
		if (StringUtil.isBlankJsonData(gepDiscountConfigDetails.getOfferDetails())
				|| gepDiscountConfigDetails.getOfferDetails().getData() == null) {
			throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE, SalesConstants.ERR_CORE_036,
					"Some GEP offer configurations are not defined at EPOSS for config id - "
							+ gepDiscountConfigDetails.getConfigId());
		}
		GepOfferDetails gepOfferDetails = MapperUtil.mapObjToClass(gepDiscountConfigDetails.getOfferDetails().getData(),
				GepOfferDetails.class);
		GepConfigDetails gepConfigDetails = MapperUtil
				.mapObjToClass(gepDiscountConfigDetails.getConfigDetails().getData(), GepConfigDetails.class);

		// check discount start and end date
		if (gepOfferDetails.getGepDiscountStartDate() == null || gepOfferDetails.getGepDiscountEndDate() == null) {
			throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE, SalesConstants.ERR_CORE_036,
					"GEP offer discount start and end date not defined.");
		}

		// 2. if business date is not within discount start and end date or purity
		// mapping is not present, then return
		if (businessDate.compareTo(gepOfferDetails.getGepDiscountStartDate()) < 0
				|| businessDate.compareTo(gepOfferDetails.getGepDiscountEndDate()) > 0
				|| gepDiscountConfigDetails.getPurityProductDetails() == null) {
			return null;
		}

		// 3. if required configurations are not present, then do not give GEP purity
		// offer.
		if (gepOfferDetails.getGepCNUtilizationPercentage() == null
				|| gepOfferDetails.getGrnCNUtilizationPercentage() == null
				|| gepOfferDetails.getDaysForGEPCNAfterOffer() == null
				|| gepOfferDetails.getDaysForGRNAndRebillingAfterOffer() == null
				|| gepConfigDetails.getGepDaysAfterABOffer() == null
				|| gepConfigDetails.getGepDaysAfterCOOffer() == null) {
			return null;
		}

		// 4. NAP-8580: check if GEP items exceed max items allowed
		if (goodsExchangeDetailsList.size() > 3) {
			throw new ServiceException(SalesConstants.MAX_ITEMS_ALLOWED_IN_TRANSACTION_IS_DYNAMIC_NUMBER_OF_ITEMS,
					SalesConstants.ERR_SALE_328,
					"Max number of items allowed in GEP when exchange offer is applicable - 3",
					Map.of("numberOfItems", "3"));
		}

		return gepDiscountConfigDetails;
	}

	private void getCoinOfferDiscountDetails(String discountType, String transactionType,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList,
			List<CoinOfferDiscountDto> coinOfferDiscountList) {
		Map<String, BigDecimal> discountMap = new HashMap<>();
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		CoinOfferDiscountDto coinOffer = null;
		BigDecimal makingCharge = BigDecimal.ZERO;
		for (GoodsExchangeDetailsDaoExt record : goodsExchangeDetailsList) {
			JsonData jsonData = MapperUtil.mapObjToClass(record.getDiscountDetails(), JsonData.class);
			if (!StringUtil.isBlankJsonData(jsonData)) {
				TepDiscountDetailsDto tepDiscount = MapperUtil.mapObjToClass(jsonData.getData(),
						TepDiscountDetailsDto.class);
				if (checkCoinOffer(record, tepDiscount)) {
					ExchangeOfferRequestDto exchangeOfferRequestDto = new ExchangeOfferRequestDto();
					exchangeOfferRequestDto.setTepDate(businessDate);
					exchangeOfferRequestDto.setProductGroupCode(getProductGroupCode(record.getItemCode()));
					exchangeOfferRequestDto
							.setCmDate(record.getCashMemoDetails().getCashMemoDao().getSalesTxnDao().getDocDate());
					ExchangeOfferResponseDto discountOffer = engineService.getExchangeOrCoinOfferDiscountDetails(
							discountType, transactionType, exchangeOfferRequestDto);

					for (DiscountDetailsBaseDto data : discountOffer.getDiscountDetails()) {
						BigDecimal makingChargeValue = getMakingChargeDiscountValue(
								record.getCashMemoDetails().getPriceDetails(),
								data.getBasicCriteriaDetails().getMCPercent());

						if (coinOffer == null) {
							coinOffer = (CoinOfferDiscountDto) MapperUtil.getDtoMapping(data,
									CoinOfferDiscountDto.class);
						}
						if (discountMap.get(data.getDiscountId()) == null) {
							discountMap.put(data.getDiscountId(), makingChargeValue);
						} else {
							makingChargeValue = makingChargeValue.add(discountMap.get(data.getDiscountId()));
							discountMap.put(data.getDiscountId(), makingChargeValue);
						}
						makingCharge = makingCharge.add(makingChargeValue);
					}
				}
			}
		}
		if (coinOffer != null) {
			coinOffer.setDiscountValue(makingCharge);
			coinOfferDiscountList.add(coinOffer);
		}
	}

	private boolean checkCoinOffer(GoodsExchangeDetailsDaoExt record, TepDiscountDetailsDto tepDiscount) {
		return !StringUtils.isEmpty(record.getCashMemoDetails())
				&& SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(record.getCashMemoDetails().getProductGroupCode())
				&& BooleanUtils.isTrue(tepDiscount.getIsCoinOfferDiscountEnabled());
	}

	private BigDecimal getMakingChargeDiscountValue(String priceDetails, BigDecimal makingChargePercent) {
		BigDecimal makingChargeValue = BigDecimal.ZERO;
		try {
			JsonNode root = MapperUtil.getObjectMapperInstance().readTree(priceDetails);
			JsonNode makingChargeDetailsNode = root.path("makingChargeDetails");
			JsonNode makingCharge = makingChargeDetailsNode.path("preDiscountValue");
			if (makingChargePercent != null) {
				makingChargeValue = BigDecimal.valueOf(makingCharge.doubleValue())
						.multiply(makingChargePercent.divide(new BigDecimal(100)))
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
			}
		} catch (IOException e) {
			throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR-CORE-003");
		}
		return makingChargeValue;
	}

	protected void checkDiscount(String discountType, GoodExchangeDiscountDetailsDto discountDetails) {
		// only one discount to be selected.
		if (discountDetails.getDiscountObj().keySet().size() > 1 && discountType == null) {
			// throw error
			throw new ServiceException(
					SalesConstants.MULTIPLE_OFFERS_AVAILABLE_FOR_THE_TRANSACTION_PLEASE_SELECT_ONE_OFFER,
					SalesConstants.ERR_DISC_035, "Applicable offers: " + discountDetails.getDiscountObj().keySet());
		}
		if (discountType != null && !discountDetails.getDiscountObj().keySet().contains(discountType)) {
			// throw error that selected discount no applicable
			throw new ServiceException(SalesConstants.SELECTED_OFFER_IS_NOT_APPLICABLE_IN_CURRENT_TRANSACTION,
					SalesConstants.ERR_DISC_036, "Applicable offers: " + discountDetails.getDiscountObj().keySet()
							+ ", Selected offer: " + discountType);
		}
	}

	protected BigDecimal getHoldTimeInMinutesForGep(String locationCode) {

		LocationCacheDto locationCacheDto = engineService.getStoreLocation(locationCode);
		GepDetails locationGepDetails = locationCacheDto.getGepDetails();
		if (StringUtils.isEmpty(locationGepDetails.getGepHoldTime())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Configuration not present for 'gepHoldTime' field under GEP details for location: "
							+ CommonUtil.getLocationCode());
		}
		return new BigDecimal(locationGepDetails.getGepHoldTime());
	}

//	protected void getGoodsExchangeObjectByVariantCodeAndLocationCodeAndStatusAndCustomer(String txnType,
//			Integer customerId, String locationCode, List<String> itemCodeList) {
//		List<String> statusList = List.of(TransactionStatusEnum.APPROVAL_PENDING.name());
//		List<String> itemInApprovalFlow = salesTxnRepositoryExt.existsByVariantCodeAndLocationCodeAndStatusAndCustomer(
//				txnType, customerId, locationCode, statusList, itemCodeList);
	protected BigDecimal getHoldTimeInMinutesForTep(String locationCode) {

		LocationCacheDto locationCacheDto = engineService.getStoreLocation(locationCode);
		TepDetailsDto locationTepDetails = locationCacheDto.getTepDetails();
		if (StringUtils.isEmpty(locationTepDetails.getTepHoldTime())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Configuration not present for 'tepHoldTime' field under TEP details for location: "
							+ CommonUtil.getLocationCode());
		}
		return locationTepDetails.getTepHoldTime();
	}

	protected List<GoodsExchangeDetailsDaoExt> getGoodsExchangeObjectByVariantCodeAndLocationCodeAndStatusAndCustomer(String txnType,  List<String> itemCodeList, List<String> cashMemoIdList) {
		List<String> statusList = List.of(TransactionStatusEnum.APPROVAL_PENDING.name());
		List<GoodsExchangeDetailsDaoExt> itemInApprovalFlow = salesTxnRepositoryExt.existsByVariantCodeAndLocationCodeAndStatusAndCustomer(
				txnType,statusList, itemCodeList, cashMemoIdList);
		return itemInApprovalFlow;
		
		
	}

	private List<CashMemoDetailsResponseDto> mapCashMemoDetailsResponseDto(List<Object[]> cashMemoDetailsArray) {
		List<CashMemoDetailsResponseDto> cashMemoDetailsResponseDtos = new ArrayList<>();
		if (cashMemoDetailsArray != null && cashMemoDetailsArray.size() > 0) {
			cashMemoDetailsResponseDtos.addAll(cashMemoDetailsArray.stream().map(cashMemoDetails -> {
				CashMemoDetailsResponseDto cashMemoDetailsResponseDto = new CashMemoDetailsResponseDto();
				cashMemoDetailsResponseDto.setId(String.valueOf(cashMemoDetails[0]));
				cashMemoDetailsResponseDto.setLocationCode(String.valueOf(cashMemoDetails[1]));
				cashMemoDetailsResponseDto.setFiscalYear((Short) cashMemoDetails[2]);
				cashMemoDetailsResponseDto.setDocNo((Integer) cashMemoDetails[3]);
				cashMemoDetailsResponseDto.setIsMigrated((Boolean) (cashMemoDetails[4]));
				cashMemoDetailsResponseDto.setTotalQuantity((Short) cashMemoDetails[5]);
				return cashMemoDetailsResponseDto;
			}).collect(Collectors.toList()));
		}
		return cashMemoDetailsResponseDtos;
	}
}
