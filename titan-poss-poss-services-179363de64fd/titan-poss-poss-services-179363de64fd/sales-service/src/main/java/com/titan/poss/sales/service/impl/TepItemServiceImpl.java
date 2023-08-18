/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.dto.BaseStoneDetails;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.ProductServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.product.dto.request.json.ProductGroupConfig;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dto.CutPieceItemDetailsDto;
import com.titan.poss.sales.dto.CutPieceMetalDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TepDiscountDetailsDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.AddTepItemRequestDto;
import com.titan.poss.sales.dto.request.TepUpdateItemRequestDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.TepItemService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Slf4j
@Service("salesTepItemService")
public class TepItemServiceImpl extends BaseGoodsServiceImpl implements TepItemService {

	@Autowired
	private EngineService engineService;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private CancellationRepositoryExt cancellationRepo;

	@Autowired
	private ProductServiceClient productServiceClient;
	
	@Autowired
	private EpossCallServiceImpl epossCallService;
	

	private static final String ERROR_IN_PARSNG_JSON = "ERROR IN PARSNG JSON";
	private static final String ERR_CORE_003 = "ERR-CORE-003";

	@Override
	public GoodsExchangeDetailsDaoExt getTepItem(String id, String txnType, String subTxnType, String itemId) {
		GoodsExchangeDaoExt goodsExchangeDao = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		return super.findByIdAndGoodsExchange(itemId, goodsExchangeDao);
	}

	@Override
	public GoodsExchangeDaoExt deleteTepItem(String id, String txnType, String subTxnType, String itemId) {
		GoodsExchangeDetailsDaoExt goodsExchangeDetails = getTepItem(id, txnType, subTxnType, itemId);
		GoodsExchangeDaoExt goodsExchangeObj = goodsExchangeDetails.getGoodsExchange();
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchangeObj.getSalesTxn().getStatus());
		super.deleteGoodsExchangeItemDetails(goodsExchangeDetails);
		return super.updateGoodsExchangeHeaderDetails(goodsExchangeObj);
	}

	@Override
	public GoodsExchangeDetailsDaoExt addItem(String id, String txnType, String subTxnType,
			AddTepItemRequestDto addTepItem) {
		CashMemoDetailsDaoExt cmDetails = null;
		CutPieceItemDetailsDto cutPieceItemDetailsDto = null;
		String lotNumber = null;
		String itemCode = null;
		// get goods exchange object by id,txn type & sub txn type
		GoodsExchangeDaoExt goodsExchangeDao = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		// commenting as customer validation is not required while adding product to grid
//		boolean isValid = commonTransactionService.validateCustomerFields(goodsExchangeDao.getSalesTxn().getCustomerId());
//		if(!isValid) {
//			throw new ServiceException(SalesConstants.MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING, SalesConstants.ERR_CUST_001,
//					"Mandatory fields of customer details are missing ");
//		}
		// if the TEP status is CONFIRMED,DELETED,APPROVAL_PENDING then throw exception
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchangeDao.getSalesTxn().getStatus());
		if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			cutPieceItemDetailsDto = validateItemDetailsJson(addTepItem);
			itemCode = cutPieceItemDetailsDto.getItemCode();
		} else {
			itemCode = addTepItem.getItemCode();
		}
		ItemDto itemDto = validateItemCode(itemCode);
		if (subTxnType.equals(SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.name())
				|| subTxnType.equals(SubTxnTypeEnum.MANUAL_TEP.name())
				|| subTxnType.equals(SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP)) {
			Boolean isBiMetal = false;
			try {

				ObjectMapper mapper = new ObjectMapper();
				JsonNode root = mapper.readTree(goodsExchangeDao.getSalesTxn().getManualBillDetails());
				JsonNode dataNode = root.path("data");
				if (!dataNode.isMissingNode() && dataNode.hasNonNull("isBimetal")) {
					isBiMetal = dataNode.path("isBimetal").asBoolean();

				}
			} catch (IOException e) {
				throw new ServiceException("UNABLE_TO_PARSE_JSON", ERR_CORE_003);
			}
			if (isBiMetal) {
				if (!itemDto.getItemTypeCode().equals(CommonConstants.LJ)
						|| !itemDto.getItemTypeCode().equals(CommonConstants.JL)) {
					throw new ServiceException("Only BiMetal products are allowed to add.", "ERR-ENG-038");
				}
			}

			else {
				if (itemDto.getItemTypeCode().equals(CommonConstants.LJ)
						|| itemDto.getItemTypeCode().equals(CommonConstants.JL)) {
					throw new ServiceException("BiMetal Products are not allowed.", "ERR-ENG-039");
				}
			}

		}

		String customerMobileNo = getCustomerNo(goodsExchangeDao.getSalesTxn().getCustomerId(), subTxnType);
		String customerType = "";
		if (goodsExchangeDao.getSalesTxn().getCustomerId() != null) {
			customerType = getCustomerType(goodsExchangeDao.getSalesTxn().getCustomerId(), subTxnType);
		}
		// this if block should be executed if the subTxnType is NEW_TEP
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_TEP.toString().equals(subTxnType)) {
			validateForCoins(itemDto.getProductGroupCode(), addTepItem.getDiscountDetails(),
					addTepItem.getCashMemoDetailsId());
		}
		
		//In case I try to do TEP for non Solitaire studded product group along with Solitaire studded product
		//group(based on config in Product master), system shall not allow to proceed further.
//		validateForIsStuddedSolitarie(goodsExchangeDao,itemDto.getProductGroupCode());
			
		TepItemResponseDto tepItemConfig = engineService.getTepItem(itemCode, customerMobileNo, subTxnType);
		validateCMMandatory(itemDto.getProductGroupCode(), tepItemConfig, addTepItem.getCashMemoDetailsId(),
				subTxnType);
		// validation for sub txn type : CUT_PIECE_TEP
		validateItemForCutPieceTep(tepItemConfig, subTxnType, itemDto.getKarat(), goodsExchangeDao,
				cutPieceItemDetailsDto, addTepItem.getIsSaleable(), addTepItem.getCashMemoDetailsId(),
				addTepItem.getQuantity(), addTepItem.getTotalWeight(), addTepItem.getItemCode(), true,
				addTepItem.getInventoryId());
		if (!StringUtils.isEmpty(addTepItem.getCashMemoDetailsId())) {
			// if cm details is available scenario
			cmDetails = super.findCashMemoDetailsById(addTepItem.getCashMemoDetailsId());
			lotNumber = cmDetails.getLotNumber();
			validateItemIfCMAvailable(addTepItem.getItemCode(), addTepItem.getQuantity(), addTepItem.getIsSaleable(),
					cmDetails, true, null, tepItemConfig, subTxnType, goodsExchangeDao);
		} else {
			// if cm details is not available scenario
			// this block will be executed if subTxnType is NEW_TEP/INTER_BRAND_TEP
			// for FULL_VALUE_TEP cm details is always mandatory so this block wont be
			// executed
			validateItemIfCMNotAvailable(addTepItem.getQuantity(), addTepItem.getIsSaleable(), tepItemConfig,
					subTxnType);
		}
		MetalRateListDto metalRateListDto = getMetalRate(subTxnType, goodsExchangeDao);
		TepPriceResponseDto tepPriceResponse = getItemPrice(addTepItem.getItemCode(), lotNumber,
				addTepItem.getCashMemoDetailsId(), addTepItem.getQuantity(), customerMobileNo,
				addTepItem.getTotalWeight(), metalRateListDto, addTepItem.getStonesDetails(), subTxnType);
		Boolean isfullvalueTep = false;
		if (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
			isfullvalueTep = true;
		}
		TaxCalculationResponseDto taxDetails = engineService.getTaxDetails(CommonUtil.getLocationCode(),
				goodsExchangeDao.getSalesTxn().getCustomerId(), TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.name(),
				itemCode,isfullvalueTep,null);

		BigDecimal itemTotalTax = commonTransactionService.getTaxDetails(tepPriceResponse.getFinalValue(), null,
				taxDetails);
		if (tepPriceResponse.getIsUCPproduct() && (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)
				|| customerType.equals(CustomerTypeEnum.INSTITUTIONAL.name()))) {
			// tepPriceResponse.setFinalValue(tepPriceResponse.getUCPValue());
			TotalTaxAndTaxDetailsDto reverseTaxDetails = commonTransactionService.reverseTotalTaxDetails(
					goodsExchangeDao.getSalesTxn().getCustomerId(), itemCode, tepPriceResponse.getFinalValue(),
					TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE, taxDetails);
			// recalculated totalValue

			tepPriceResponse.setFinalValue(reverseTaxDetails.getFinalValue()
					.subtract(tepPriceResponse.getDiscountRecovered()).subtract(tepPriceResponse.getDeductionAmount()));
			itemTotalTax = commonTransactionService.getTaxDetails(tepPriceResponse.getFinalValue(), null,
					reverseTaxDetails.getTaxDetails());
//			if(cmDetails!=null) {
//				cmDetails.setTaxDetails(MapperUtil.getStringFromJson(reverseTaxDetails.getTaxDetails()));
//			}

		}

//		else if(tepPriceResponse.getIsUCPproduct()) {
//			tepPriceResponse.setFinalValue(tepPriceResponse.getFinalValue()
//					.subtract(tepPriceResponse.getDiscountRecovered()).subtract(tepPriceResponse.getDeductionAmount()));
//			 itemTotalTax = commonTransactionService.getTaxDetails(tepPriceResponse.getFinalValue(), null,
//					taxDetails);
//		}

		log.debug("tax details : {}", taxDetails);
		log.debug("itemTotalTax : {}", itemTotalTax);

		// Regular TEP + no customer - no tax
		// Regular TEP + normal customer - no tax
		// Cut piece TEP - no tax
		if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			itemTotalTax = BigDecimal.ZERO;
		}

		// validate UI input and TEP price API response
		// validation will happen if sub txn type is :
		// NEW_TEP,INTER_BRAND_TEP,FULL_VALUE_TEP

		validateInput(addTepItem.getQuantity(), addTepItem.getTotalValue(), addTepItem.getUnitValue(),
				addTepItem.getFinalValue(), addTepItem.getTotalWeight(), addTepItem.getUnitWeight(), tepPriceResponse,
				subTxnType, itemTotalTax);
		// validate UI input and calculated value for CUT_PIECE_TEP
		validateInputForCutPiece(subTxnType, metalRateListDto, addTepItem);
		return addItemInGoodsExchangeDetails(subTxnType, addTepItem, goodsExchangeDao, cmDetails, metalRateListDto,
				tepPriceResponse, itemTotalTax, taxDetails, itemDto, cutPieceItemDetailsDto);
	}

	private void validateForIsStuddedSolitarie(GoodsExchangeDaoExt goodsExchangeDao, String productGroupCode) {
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchangeDao);
		if (!CollectionUtils.isEmpty(goodsExchangeDetailsList)) {
			Boolean isStuddedSolitarie = getProductGroup(productGroupCode);
			for (GoodsExchangeDetailsDaoExt goodsExchangeDetailsDaoExt : goodsExchangeDetailsList) {
				TepPriceResponseDto tepPriceData = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(goodsExchangeDetailsDaoExt.getPriceDetails()),
						TepPriceResponseDto.class);
				Boolean isStuddedEnabled = getProductGroup(tepPriceData.getProductGroupCode());
				if (BooleanUtils.isTrue(isStuddedSolitarie) && BooleanUtils.isNotTrue(isStuddedEnabled)) {
					throw new ServiceException(
							"Studded Solitiarie Product cannot be added with studded solitiarie product",
							"ERR-SALE-441");
				} else if (BooleanUtils.isNotTrue(isStuddedSolitarie) && BooleanUtils.isTrue(isStuddedEnabled)) {
					throw new ServiceException(
							"Non Studded Solitiarie Product cannot be added with studded solitiarie product",
							"ERR-SALE-442");
				}
			}
		}
	}

	private void validateInputForCutPiece(String subTxnType, MetalRateListDto metalRateListDto,
			AddTepItemRequestDto addTepItem) {
		if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			StandardPriceResponseDto priceResponse = getGoldPrice(metalRateListDto);
			BigDecimal itemUnitValue = priceResponse.getRatePerUnit().multiply(addTepItem.getUnitWeight())
					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
			log.debug("UI unit value : " + addTepItem.getUnitValue() + " & calculated unit value : " + itemUnitValue);
			if (itemUnitValue.compareTo(addTepItem.getUnitValue()) != 0) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						" UI unit Value : " + addTepItem.getUnitValue() + " & calculated unit value : "
								+ itemUnitValue);
			}
			log.debug(
					"UI total value : " + addTepItem.getTotalValue() + " & calculated total value : " + itemUnitValue);
			if (itemUnitValue.compareTo(addTepItem.getTotalValue()) != 0) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						" UI total Value : " + addTepItem.getTotalValue() + " & calculated total value : "
								+ itemUnitValue);
			}
			log.debug(
					"UI final value : " + addTepItem.getFinalValue() + " & calculated final value : " + itemUnitValue);
			if (itemUnitValue.compareTo(addTepItem.getFinalValue()) != 0) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						" UI final Value : " + addTepItem.getFinalValue() + " & calculated final value : "
								+ itemUnitValue);
			}
		}
	}

	private void validateItemForCutPieceTep(TepItemResponseDto tepItemConfig, String subTxnType, BigDecimal karat,
			GoodsExchangeDaoExt goodsExchange, CutPieceItemDetailsDto cutPieceItemDetails, Boolean isSaleable,
			String cashMemoDetailsId, Short quantity, BigDecimal totalWeight, String itemCode, Boolean addItem,
			String inventoryId) {
		if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			// if cm details id is not null then throw exception
			if (!StringUtils.isEmpty(cashMemoDetailsId)) {
				throw new ServiceException("CM details id not required for Cut Piece TEP", "ERR-SALE-277");
			}
			// if saleable flag is true then throw exception
			if (Boolean.TRUE.equals(isSaleable)) {
				throw new ServiceException(SalesConstants.ITEM_CANNOT_MOVE_TO_TEP_SALEABLE_BIN,
						SalesConstants.ERR_SALE_198);
			}
			// if quantity is more than 1 then throw exception
			if (quantity > 1) {
				throw new ServiceException("Quantity should not be greater than 1", "ERR-SALE-261",
						"quantity : " + quantity);
			}
			validateCutPieceCode(karat, itemCode);
			// pending : validate item code is available or not in inventory
			checkCutPieceTepWeightTolerance(cutPieceItemDetails.getGrossWeight(), totalWeight,
					tepItemConfig.getTepCutPieceConfig().getWeightTolerancePercent());
			long itemCount = super.getCountOfTotalQuantityByGoodsExchange(goodsExchange);
			if (itemCount > 0 && Boolean.TRUE.equals(addItem)) {
				throw new ServiceException("Only one item can be added", "ERR-SALE-260");
			}
			validateInventoryItemForCutPiece(inventoryId);
		}
	}

	private void validateInventoryItemForCutPiece(String inventoryId) {
		// if inventory id is null then throw exception
		if (StringUtils.isEmpty(inventoryId)) {
			throw new ServiceException("Inventory id is mandatory for Cut Piece TEP", "ERR-SALE-278");
		}
		InventoryItemDto inventoryItemDto = engineService.validateInventoryItem(inventoryId, null);
		if (inventoryItemDto == null) {
			throw new ServiceException("This item is not available in the inventory", "ERR-SALE-279");
		}
		if (!BinGroupEnum.STN.toString().equals(inventoryItemDto.getBinGroupCode())) {
			throw new ServiceException("This item is not in STN bin group and the item is not available for sale",
					"ERR-SALE-285", "bin group code : " + inventoryItemDto.getBinGroupCode());
		}
		if (inventoryItemDto.getTotalQuantity() == 0) {
			throw new ServiceException("This item is not available in the inventory", "ERR-SALE-279",
					"total quantity : " + inventoryItemDto.getTotalQuantity());
		}
		if (inventoryItemDto.getLotNumber().substring(inventoryItemDto.getLotNumber().length() - 2).equals("CP")) {
			throw new ServiceException("Cut piece is already done for the item code", "ERR-SALE-282");
		}
	}

	private CutPieceItemDetailsDto validateItemDetailsJson(AddTepItemRequestDto addTepItem) {
		JsonData itemDetailsJson = addTepItem.getItemDetails();
		if (!"CUT_PIECE_ITEM_DETAILS".equals(itemDetailsJson.getType())) {
			throw new ServiceException(SalesConstants.JSON_TYPE_MISMATCH, SalesConstants.ERR_CORE_014,
					SalesConstants.INPUT_TYPE + itemDetailsJson.getType() + SalesConstants.EXPECTED_TYPE
							+ "CUT_PIECE_ITEM_DETAILS");
		}
		CutPieceItemDetailsDto cutPieceItemDetails = new CutPieceItemDetailsDto();
		cutPieceItemDetails.validate(itemDetailsJson.getData());
		cutPieceItemDetails = MapperUtil.getObjectMapperInstance().convertValue(itemDetailsJson.getData(),
				CutPieceItemDetailsDto.class);
		// if lot number contain CP then throw exception
		log.debug("lot number {}",
				cutPieceItemDetails.getLotNumber().substring(cutPieceItemDetails.getLotNumber().length() - 2));
		if (cutPieceItemDetails.getLotNumber().substring(cutPieceItemDetails.getLotNumber().length() - 2)
				.equals("CP")) {
			throw new ServiceException("Cut piece is already done for the item code", "ERR-SALE-282", "item code : "
					+ cutPieceItemDetails.getItemCode() + " & lot number : " + cutPieceItemDetails.getLotNumber());
		}
		try {
			JsonNode jsonNode = MapperUtil.getObjectMapperInstance().readTree(addTepItem.getItemDetails().toString());
			log.debug("item details json {}" + jsonNode);
			JsonNode jsonNodeData = jsonNode.path("data");
			JsonNode metalWeightDetails = jsonNodeData.path("metalWeight");
			log.debug("metal weight json {}" + metalWeightDetails);
			JsonData weightDetailsJson = MapperUtil.getObjectMapperInstance().convertValue(metalWeightDetails,
					JsonData.class);
			CutPieceMetalDetailsDto cutPieceMetalDetails = new CutPieceMetalDetailsDto();
			if (!"WEIGHT_DETAILS".equals(weightDetailsJson.getType())) {
				throw new ServiceException(SalesConstants.JSON_TYPE_MISMATCH, SalesConstants.ERR_CORE_014,
						SalesConstants.INPUT_TYPE + weightDetailsJson.getType() + SalesConstants.EXPECTED_TYPE
								+ " WEIGHT_DETAILS");
			}
			cutPieceMetalDetails.validate(weightDetailsJson.getData());
		} catch (IOException e) {
			throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR_CORE_003");
		}
		return cutPieceItemDetails;
	}

	private void validateCutPieceCode(BigDecimal karat, String cutPieceItemCode) {
		if (karat != null) {
			// if karat is 14 then cutPieceCode should be 11GOHYM007
			// if karat is 18 then cutPieceCode should be 11GOLYM009
			// if karat is 22 then cutPieceCode should be 11GOPYM008
			if (karat.compareTo(new BigDecimal(14)) == 0 && "11GOHYM007".equals(cutPieceItemCode)) {
				// do nothing
			} else if (karat.compareTo(new BigDecimal(18)) == 0 && "11GOLYM009".equals(cutPieceItemCode)) {
				// do nothing
			} else if (karat.compareTo(new BigDecimal(22)) == 0 && "11GOPYM008".equals(cutPieceItemCode)) {
				// do nothing
			} else {
				throw new ServiceException("Please provide valid cutPieceCode", "ERR-SALE-280");
			}
		}
	}

	private void checkCutPieceTepWeightTolerance(BigDecimal itemWeight, BigDecimal cutPieceWeight,
			BigDecimal weightTolerancePercent) {
		BigDecimal limit = weightTolerancePercent.divide(BigDecimal.valueOf(100)).multiply(itemWeight)
				.setScale(DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE);
		if (cutPieceWeight.compareTo(limit) > 0) {
			throw new ServiceException("Cut piece weight is exceeding than weight tolerance limit", "ERR-SALE-281",
					"cut piece weight : " + cutPieceWeight + " & limit : " + limit);
		}
	}

	private void validateInput(Short measuredQuantity, BigDecimal totalValue, BigDecimal unitValue,
			BigDecimal finalValue, BigDecimal totalWeight, BigDecimal unitWeight, TepPriceResponseDto tepPriceResponse,
			String subTxnType, BigDecimal totalTaxValue) {
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
			BigDecimal totalItemWeight = tepPriceResponse.getMeasuredWeight();
			BigDecimal unitItemValue = tepPriceResponse.getFinalValue().divide(BigDecimal.valueOf(measuredQuantity),
					DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
			BigDecimal itemUnitWeight = tepPriceResponse.getMeasuredWeight()
					.divide(BigDecimal.valueOf(measuredQuantity), DomainConstants.WEIGHT_SCALE, RoundingMode.HALF_UP);

			log.debug("UI quantity : " + measuredQuantity + " & pricing API quantity : "
					+ tepPriceResponse.getItemQuantity());
			if (!measuredQuantity.equals(tepPriceResponse.getItemQuantity())) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048, " UI quantity : "
						+ measuredQuantity + " & pricing API quantity : " + tepPriceResponse.getItemQuantity());
			}
			log.debug("UI totalValue : " + totalValue + " & pricing API totalValue : "
					+ tepPriceResponse.getFinalValue());
			if (totalValue.compareTo(tepPriceResponse.getFinalValue()) != 0) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						" UI totalValue : " + totalValue + " & pricing API totalValue : "
								+ tepPriceResponse.getFinalValue());
			}
			log.debug("UI finalValue : " + finalValue + " & pricing API finalValue : "
					+ tepPriceResponse.getFinalValue());
			if (finalValue.compareTo(tepPriceResponse.getFinalValue().add(totalTaxValue)) != 0) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						" UI finalValue : " + finalValue + " & pricing API finalValue : "
								+ tepPriceResponse.getFinalValue());
			}
			log.debug("UI totalWeight : " + totalWeight + " & pricing API totalWeight : " + totalItemWeight);
			if (totalWeight.compareTo(totalItemWeight) != 0) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						" UI totalWeight : " + totalWeight + " & pricing API totalWeight : " + totalItemWeight);
			}
			log.debug("UI unit value : " + unitValue + " & pricing API unit value : " + unitItemValue);
			if (unitValue.compareTo(unitItemValue) != 0) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						" UI unit value : " + unitValue + " & pricing API unit value : " + unitItemValue);
			}
			log.debug("UI unit weight : " + unitWeight + " & pricing API unit weight : " + itemUnitWeight);
			if (unitWeight.compareTo(itemUnitWeight) != 0) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						" UI unit weight : " + unitWeight + " & pricing API unit weight : "
								+ tepPriceResponse.getStdWeight());
			}
		}
	}

	private TepPriceResponseDto getItemPrice(String itemCode, String lotNumber, String cashMemoDetailsId,
			Short measuredQuantity, String customerMobileNo, BigDecimal measuredWeight,
			MetalRateListDto metalRateListDto, List<BaseStoneDetails> stonesDetails, String subTxnType) {
		TepPriceResponseDto tepPriceResponse = new TepPriceResponseDto();
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
			TepPriceRequest tepPriceRequest = new TepPriceRequest();
			tepPriceRequest.setMeasuredWeight(measuredWeight);
			tepPriceRequest.setMeasuredQuantity(measuredQuantity);
			tepPriceRequest.setLotNumber(lotNumber);
			if (tepPriceRequest.getLotNumber() != null && "null".equalsIgnoreCase(tepPriceRequest.getLotNumber())) {
				tepPriceRequest.setLotNumber(null);
			}
			tepPriceRequest.setStandardPrice(metalRateListDto.getMetalRates());
			tepPriceRequest.setCustomerMobileNo(customerMobileNo);
			tepPriceRequest.setItemCode(itemCode);
			tepPriceRequest.setCashMemoDetailsId(cashMemoDetailsId);
			tepPriceRequest.setStones(stonesDetails);
			tepPriceRequest.setTepType(subTxnType);
			System.out.println(MapperUtil.getJsonString(tepPriceRequest));
			tepPriceResponse = engineService.getTepPriceDetails(tepPriceRequest);
		}
		return tepPriceResponse;
	}

	private GoodsExchangeDetailsDaoExt addItemInGoodsExchangeDetails(String subTxnType, AddTepItemRequestDto addTepItem,
			GoodsExchangeDaoExt goodsExchangeDao, CashMemoDetailsDaoExt cmDetails, MetalRateListDto metalRateListDto,
			TepPriceResponseDto tepPriceResponse, BigDecimal itemTotalTax, TaxCalculationResponseDto taxDetailsObj,
			ItemDto itemDto, CutPieceItemDetailsDto cutPieceItemDetailsDto) {
		String lotNumber = null;
		GoodsExchangeDetailsDaoExt goodsExchangeDetails = (GoodsExchangeDetailsDaoExt) MapperUtil
				.getDtoMapping(addTepItem, GoodsExchangeDetailsDaoExt.class, "itemCode");
		// if metal rate is empty then update metal rate in sales_transaction table
		// metal rate update will happen
		if (StringUtils.isEmpty(goodsExchangeDao.getSalesTxn().getMetalRateDetails())) {
			goodsExchangeDao.getSalesTxn().setMetalRateDetails(MapperUtil.getStringFromJson(metalRateListDto));
		}
		MapperUtil.getObjectMapping(itemDto, goodsExchangeDetails);
		if (itemDto.getPurity() == null) {
			goodsExchangeDetails.setPurity(BigDecimal.ZERO);
		}
		goodsExchangeDetails.setItemCode(addTepItem.getItemCode());
		goodsExchangeDetails.setMetalType(itemDto.getItemTypeCode());
		goodsExchangeDetails.setGoodsExchange(goodsExchangeDao);
		goodsExchangeDetails.setItemType("TEP_ITEM");
		int rowId = 0;
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchangeDao);
		if (CollectionUtils.isEmpty(goodsExchangeDetailsList)) {
			rowId = rowId + 1;
		} else {
			rowId = goodsExchangeDetailsList.size() + 1;
		}
		goodsExchangeDetails.setRowId(rowId);
		if (Boolean.TRUE.equals(addTepItem.getIsSaleable())) {
			goodsExchangeDetails.setBinCode(CommonConstants.TEP_SALE_BIN_CODE);
		} else {
			if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
				goodsExchangeDetails.setBinCode("CUTPIECE");
			} else {
				goodsExchangeDetails.setBinCode(CommonConstants.TEP_BIN_CODE);
			}
		}
		if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			lotNumber = cutPieceItemDetailsDto.getLotNumber() + "CP";
		} else {
			lotNumber = engineService.generateLotNumber(TransactionTypeEnum.TEP.toString()).getLotNumber();
//			if (cmDetails == null)
//				lotNumber = engineService.generateLotNumber(TransactionTypeEnum.TEP.toString()).getLotNumber();
//			else if (cmDetails != null && StringUtils.isEmpty(cmDetails.getLotNumber()))
//				lotNumber = engineService.generateLotNumber(TransactionTypeEnum.TEP.toString()).getLotNumber();
//			else
//				lotNumber = cmDetails.getLotNumber();
		}

		log.debug("lot number {} ", lotNumber);
		goodsExchangeDetails.setLotNumber(lotNumber);
		goodsExchangeDetails.setSrcSyncId(0);
		goodsExchangeDetails.setDestSyncId(0);
		goodsExchangeDetails.setCashMemoDetails(cmDetails);
		goodsExchangeDetails.setTotalTax(itemTotalTax);
		goodsExchangeDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetailsObj));
		goodsExchangeDetails.setDiscountDetails(MapperUtil.getStringFromJson(addTepItem.getDiscountDetails()));
		goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(tepPriceResponse));
		goodsExchangeDetails.setItemDetails(MapperUtil.getStringFromJson(addTepItem.getItemDetails()));
		setItemPrice(subTxnType, goodsExchangeDetails, tepPriceResponse, metalRateListDto, addTepItem.getQuantity(),
				addTepItem.getUnitWeight(), addTepItem.getTotalWeight());
		return super.saveGoodsExchangeDetailsObj(goodsExchangeDetails);
	}

	private void setItemPrice(String subTxnType, GoodsExchangeDetailsDaoExt goodsExchangeDetails,
			TepPriceResponseDto tepPriceResponse, MetalRateListDto metalRateListDto, Short quantity,
			BigDecimal unitWeight, BigDecimal totalWeight) {
		BigDecimal itemFinalValue;
		BigDecimal itemTotalValue;
		BigDecimal itemTotalWeight;
		BigDecimal itemUnitValue;
		BigDecimal itemUnitWeight;
		if (!SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			itemTotalValue = tepPriceResponse.getFinalValue();
			itemFinalValue = tepPriceResponse.getFinalValue().add(goodsExchangeDetails.getTotalTax());
			itemTotalWeight = tepPriceResponse.getMeasuredWeight();
			itemUnitValue = tepPriceResponse.getFinalValue().divide(BigDecimal.valueOf(quantity),
					DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
			itemUnitWeight = tepPriceResponse.getMeasuredWeight().divide(BigDecimal.valueOf(quantity),
					DomainConstants.WEIGHT_SCALE, RoundingMode.HALF_UP);
		} else {
			StandardPriceResponseDto priceResponse = getGoldPrice(metalRateListDto);
			itemUnitValue = priceResponse.getRatePerUnit().multiply(unitWeight).setScale(DomainConstants.PRICE_SCALE,
					RoundingMode.HALF_UP);
			itemFinalValue = itemUnitValue;
			itemTotalValue = itemUnitValue;
			itemTotalWeight = totalWeight;
			itemUnitWeight = unitWeight;
		}
		BigDecimal roundingVariance = commonTransactionService
				.getRoundingVariance(itemFinalValue);
	
		goodsExchangeDetails.setTotalValue(itemTotalValue);
		goodsExchangeDetails.setTotalWeight(itemTotalWeight);
		goodsExchangeDetails.setFinalValue(itemFinalValue.add(roundingVariance));
		goodsExchangeDetails.setUnitValue(itemUnitValue);
		goodsExchangeDetails.setUnitWeight(itemUnitWeight);
		goodsExchangeDetails.setQuantity(quantity);

		if (goodsExchangeDetails.getTotalTax() != null && goodsExchangeDetails.getTotalTax() != BigDecimal.ZERO) {
			BigDecimal refundDeductionAmt = goodsExchangeDetails.getFinalValue()
					.multiply(tepPriceResponse.getRefundDeductionPercent())
					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP).divide(new BigDecimal(100))
					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
			roundingVariance = commonTransactionService
					.getRoundingVariance(refundDeductionAmt);
			tepPriceResponse.setRefundDeductionAmount(refundDeductionAmt.add(roundingVariance));
			goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(tepPriceResponse));
		}

		log.debug("total value ---- {}", goodsExchangeDetails.getTotalValue());
		log.debug("final value ---- {}", goodsExchangeDetails.getFinalValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitValue());
		log.debug("unit value ---- {}", goodsExchangeDetails.getUnitWeight());
		log.debug("quantity ---- {}", goodsExchangeDetails.getQuantity());
	}

	/**
	 * @param metalRateListDto
	 * @return
	 */
	private StandardPriceResponseDto getGoldPrice(MetalRateListDto metalRateListDto) {
		StandardPriceResponseDto priceResponse = metalRateListDto.getMetalRates().get(MetalTypeCodeEnum.J.getCode());
		if (priceResponse == null) {
			throw new ServiceException("Gold price is not available", "ERR-SALE-277");
		}
		return priceResponse;
	}

	private MetalRateListDto getMetalRate(String subTxnType, GoodsExchangeDaoExt goodsExchangeDao) {
		MetalRateListDto metalRateListDto = new MetalRateListDto();
		if (SubTxnTypeEnum.MANUAL_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
			metalRateListDto = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(goodsExchangeDao.getSalesTxn().getMetalRateDetails()),
					MetalRateListDto.class);
		} else if (SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			if (StringUtils.isEmpty(goodsExchangeDao.getSalesTxn().getMetalRateDetails())
					|| "{}".equals(goodsExchangeDao.getSalesTxn().getMetalRateDetails())) {
				metalRateListDto = commonTransactionService.getMetalRate();
			} else {
				metalRateListDto = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(goodsExchangeDao.getSalesTxn().getMetalRateDetails()),
						MetalRateListDto.class);
			}
		}
		return metalRateListDto;
	}

	private void validateForCoins(String productGroupCode, JsonData discountDetails, String cashMemoDetailsId) {
		// @formatter:off
		/**
		 * if product group code is 73(Gold Coin) then below fields should be mandatory
		 * irrespective of what is in TEP product group config. 1. if coin offer
		 * discount check box is checked then cashMemoDetailsId is mandatory
		 */
		// @formatter:on
		if (StringUtils.isEmpty(discountDetails.getType())) {
			throw new ServiceException("In discountDetails object, type cannot be empty", "ERR-SALE-224");
		}
		if (StringUtils.isEmpty(discountDetails.getData())) {
			throw new ServiceException("In discountDetails object, data cannot be empty", "ERR-SALE-225");
		}
		if (!"TEP_DISCOUNT_DETAILS".equals(discountDetails.getType())) {
			throw new ServiceException("JSON type mismatch", "ERR-CORE-014",
					"input type : " + discountDetails.getType() + " & expected type : TEP_DISCOUNT_DETAILS");
		}
		TepDiscountDetailsDto tepDiscount = new TepDiscountDetailsDto();
		tepDiscount.validate(discountDetails.getData());
		tepDiscount = MapperUtil.getObjectMapperInstance().convertValue(discountDetails.getData(),
				TepDiscountDetailsDto.class);
		if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(productGroupCode)) {
			if (Boolean.TRUE.equals(tepDiscount.getIsCoinOfferDiscountEnabled())
					&& StringUtils.isEmpty(cashMemoDetailsId)) {
				throw new ServiceException("Cash memo details is required for Gold Coin", "ERR-SALE-226");
			}
		} else {
			if (Boolean.TRUE.equals(tepDiscount.getIsCoinOfferDiscountEnabled())) {
				throw new ServiceException("Coin offer discount check box should be selected only for Gold Coin item",
						"ERR-SALE-228");
			}
		}
	}

	private void validateItemIfCMNotAvailable(Short measuredQuantity, Boolean isSaleable,
			TepItemResponseDto tepItemConfigDetails, String subTxnType) {
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)) {
			validateItemQuantityAndIsSaleable(measuredQuantity, isSaleable, tepItemConfigDetails, subTxnType);
			// if isQuantityEditable flag is false then input quantity should always be 1
			// irrespective of CM details is required or not
			if (measuredQuantity > 1 && Boolean.FALSE.equals(tepItemConfigDetails.getIsQuantityEditable())) {
				throw new ServiceException("Measured quantity should not be more than 1", "ERR-SALE-258",
						"isQuantityEditable flag : " + tepItemConfigDetails.getIsQuantityEditable()
								+ " & input quantity : " + measuredQuantity);
			}
		}
	}

	private void validateItemIfCMAvailable(String itemCode, Short measuredQuantity, Boolean isSaleable,
			CashMemoDetailsDaoExt cmDetails, boolean isAddItem, Short existingQuantity,
			TepItemResponseDto tepItemConfig, String subTxnType, GoodsExchangeDaoExt goodsExchange) {
		// get total quantity of GRN against the CM details
		short totalGrnQuantity = validateTepPendingQuantity(cmDetails.getId(), cmDetails.getTotalQuantity());
		log.debug("total GRN quantity : {}", totalGrnQuantity);
		// if the CM status is not CONFIRMED then throw error
		if (!TransactionStatusEnum.CONFIRMED.toString()
				.equals(cmDetails.getCashMemoDao().getSalesTxnDao().getStatus())) {
			throw new ServiceException(SalesConstants.CM_NOT_CONFIRMED, SalesConstants.ERR_SALE_199,
					"cm status  : " + cmDetails.getCashMemoDao().getSalesTxnDao().getStatus());
		}
		// if the bill cancellation is done or is in progress for the CM
		if (TransactionStatusEnum.CANCELLED.toString()
				.equals(cmDetails.getCashMemoDao().getSalesTxnDao().getStatus())) {
			throw new ServiceException(SalesConstants.CM_CANCLED, SalesConstants.ERR_SALE_387,
					Map.of("status", cmDetails.getCashMemoDao().getSalesTxnDao().getStatus()));
		}
		List<CancelDaoExt> cancel = cancellationRepo.findByRefSalesTxnId(cmDetails.getCashMemoDao().getId());
		if (cancel != null && !cancel.isEmpty()) {
			for (CancelDaoExt cancelDao : cancel) {
				if ("PENDING".equals(cancelDao.getStatus())) {
					throw new ServiceException(SalesConstants.CM_TOBE_CANCLE, SalesConstants.ERR_SALE_388,
							Map.of("status", cancelDao.getStatus()));
				}
			}
		}
		// if the input item code & CM item code doesn't match throw exception
		// this check should be executed if sub_txn_type is NEW_TEP
		if ((SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_TEP.toString().equals(subTxnType))
				&& !cmDetails.getItemCode().equals(itemCode)) {
			throw new ServiceException(SalesConstants.ITEM_CODE_DIFFERENT_THAN_CM_ITEM_CODE,
					SalesConstants.ERR_SALE_200,
					"input itemCode  : " + itemCode + " & CM itemCode : " + cmDetails.getItemCode());
		}
		// for FULL_VALUE_TEP only one item can be added
		// if more than one item is trying to add then throw exception
		if (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
			long itemCount = super.getCountOfTotalQuantityByGoodsExchange(goodsExchange);
			log.debug("item count in full value tep : {}", itemCount);
			if (itemCount > 0 && Boolean.TRUE.equals(isAddItem)) {
				throw new ServiceException("Only one item can be added", "ERR-SALE-260",
						"total no of item : " + itemCount);
			}
		}
		validateItemQuantityAndIsSaleable(measuredQuantity, isSaleable, tepItemConfig, subTxnType);
		validateQuantity(measuredQuantity, cmDetails, isAddItem, tepItemConfig.getIsQuantityEditable(),
				existingQuantity, totalGrnQuantity);
		// get studded product group list
		Map<String, String> studdedProductCodes = engineService.getProductGroupList(PlainStuddedEnum.S.toString(),
				TransactionTypeEnum.TEP.toString());
		// if the item is not studded & lot number is not available then throw exception
		if (!studdedProductCodes.containsKey(cmDetails.getProductGroupCode())
				&& (!SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(cmDetails.getProductGroupCode())
						&& cmDetails.getItemDetails() != null)
				&& StringUtils.isEmpty(cmDetails.getLotNumber())) {
			throw new ServiceException("For this item code lot number is not available. Please remove this item.",
					"ERR-SALE-273");
		}
	}

	private void validateCMMandatory(String productGroupCode, TepItemResponseDto tepItemConfig,
			String cashMemoDetailsId, String subTxnType) {
		// @formatter:off
		/**
		 * subTxnType : NEW_TEP check : 1.product group code should be except 73 2.if
		 * isCMMandatory configuration is false and from UI, cashMemoDetailsId is not
		 * empty then throw exception 3.for product group code 73 check is happening in
		 * validateForCoins() method subTxnType : INTER_BRAND_TEP check : 1.product
		 * group code can be anything 2.if isCMMandatory
		 * configuration(tepGeneralCodeConfig object) is false and from UI,
		 * cashMemoDetailsId is not empty then throw exception subTxnType :
		 * FULL_VALUE_TEP check : 1.for FULL_VALUE_TEP cashMemoDetailsId is mandatory.
		 * If cashMemoDetailsId is null then throw exception
		 */
		// @formatter:on
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)) {
			if (Boolean.FALSE.equals(tepItemConfig.getIsCMMandatory()) && !StringUtils.isEmpty(cashMemoDetailsId)
					&& !"73".equals(productGroupCode)) {
				throw new ServiceException("CM details is not required for the item", "ERR-SALE-230");
			}
		} else if (SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)) {
			if (Boolean.FALSE.equals(tepItemConfig.getIsCMMandatory())
					&& !StringUtils.isEmpty(cashMemoDetailsId)) {
				throw new ServiceException("CM details is not required for the item", "ERR-SALE-230");
			}
		} else if (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				&& StringUtils.isEmpty(cashMemoDetailsId)) {
			throw new ServiceException("CM details is required for Full Value TEP", "ERR-SALE-259");
		}
	}

	private void validateItemQuantityAndIsSaleable(Short measuredQuantity, Boolean isSaleable,
			TepItemResponseDto tepItemConfig, String subTxnType) {
		// if TEP Exception is available & measured quantity is more than 1 then throw
		// exception
		if (!StringUtils.isEmpty(tepItemConfig.getTepOfferDetails()) && measuredQuantity > 1) {
			throw new ServiceException(
					"Exception rule is configured for entered variant/stone code and quantity should be 1 only",
					"ERR-SALE-231", "measured quantity : " + measuredQuantity);
		}
		// if isSaleable flag is false and isSaleable from UI input is true then throw
		// exception
		// if subTxnType is NEW_TEP then based on isTepSaleBin configuration check
		// should happen
		// if subTxnType is INTER_BRAND_TEP then isSaleable flag should be false by
		// default
		// in case isSaleable is true from UI then throw exception
		if (SubTxnTypeEnum.NEW_TEP.toString().equals(subTxnType)) {
			if (Boolean.FALSE.equals(tepItemConfig.getIsTEPSaleBin()) && Boolean.TRUE.equals(isSaleable)) {
				throw new ServiceException(SalesConstants.ITEM_CANNOT_MOVE_TO_TEP_SALEABLE_BIN,
						SalesConstants.ERR_SALE_198, "isTepSaleBin config : " + tepItemConfig.getIsTEPSaleBin()
								+ " & isSaleable UI input : " + isSaleable);
			}
		} else if (SubTxnTypeEnum.INTER_BRAND_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(subTxnType)) {
			if (Boolean.TRUE.equals(isSaleable)) {
				throw new ServiceException(SalesConstants.ITEM_CANNOT_MOVE_TO_TEP_SALEABLE_BIN,
						SalesConstants.ERR_SALE_198,
						" For INTER_BRAND_TEP isSaleable should be false. isSaleable UI input : " + isSaleable);
			}
		}
	}

	private String getCustomerNo(Integer customerId, String subTxnType) {
		String customerMobileNo = null;
		if (!StringUtils.isEmpty(customerId)) {
			customerMobileNo = customerService.getCustomer(customerId).getMobileNumber();
		}
		return customerMobileNo;
	}

	private String getCustomerType(Integer customerId, String subTxnType) {
		String customerType = null;
		if (!StringUtils.isEmpty(customerId)) {
			customerType = customerService.getCustomer(customerId).getCustomerType();
		}
		return customerType;
	}

	private ItemDto validateItemCode(String itemCode) {
		ItemSearchRequestDto itemsearch = new ItemSearchRequestDto();
		itemsearch.setItemCode(itemCode);
		PagedRestResponse<List<ItemDto>> itemList = engineService.getItems(itemsearch);

		if (CollectionUtils.isEmpty(itemList.getResults())) {
			throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
					"itemCode : " + itemCode);
		}
		return itemList.getResults().get(0);
	}

	private void validateQuantity(Short measuredQuantity, CashMemoDetailsDaoExt cmDetails, boolean isAddItem,
			boolean isQuantityEditable, Short existingQuantity, Short totalGrnQuantity) {
		// if the quantity is more than cash memo item's quantity then throw exception
		if (measuredQuantity > cmDetails.getTotalQuantity()) {
			throw new ServiceException(SalesConstants.QTY_SHOULD_NOT_BE_MORE_THAN_CM_DETAILS_QTY,
					SalesConstants.ERR_SALE_197,
					"input quantity : " + measuredQuantity + " & CM quantity : " + cmDetails.getTotalQuantity());
		}
		short totalQuantity = 0;
		short totalTepQuantity = (short) super.getSumOfTotalQuantityInGoodsExchangeDetailsByCashMemoDetails(
				cmDetails.getId());
		log.debug("total TEP quantity : {}", totalTepQuantity);
		totalQuantity = (short) (totalTepQuantity + totalGrnQuantity);
		log.debug("total quantity : {}", totalQuantity);
		if (BooleanUtils.isFalse(isQuantityEditable)) {
			if (measuredQuantity > 1) {
				throw new ServiceException("Measured quantity should not be more than 1", SalesConstants.ERR_SALE_205,
						"isQuantityEditable flag : " + isQuantityEditable + " ,input quantity : " + measuredQuantity);
			}
			totalQuantity = getTepTotalQuantity(measuredQuantity, isAddItem, existingQuantity, totalQuantity);
			log.debug("total TEP quantity when isQuantityEditable is false: {}", totalQuantity);
		} else {
			/**
			 * The scenario is: If isQuantityEditable flag is true and assume CM has 10
			 * items then user first can make TEP for 5 quantity. Later the user can make
			 * TEP for the remaining quantity(here quantity is 5). Before adding an item,
			 * needs to check the quantity against CM details how much quantity is available
			 * in goods_exchange_details. The UI quantity input should not exceed remaining
			 * quantity in goods_exchange_details table.
			 * 
			 * Note: This scenario should be only for Gold Coin(73) and Loose Stones(74)
			 */
			totalQuantity = getTepTotalQuantity(measuredQuantity, isAddItem, existingQuantity, totalQuantity);
			log.debug("total TEP quantity when isQuantityEditable is true: {}", totalQuantity);
		}
		log.debug("total quantity : {}", totalQuantity);
		if (totalQuantity > cmDetails.getTotalQuantity()) {
			throw new ServiceException(SalesConstants.QTY_SHOULD_NOT_BE_MORE_THAN_CM_DETAILS_QTY,
					SalesConstants.ERR_SALE_197, "total quantity : " + totalQuantity + " & CM details item quantity : "
							+ cmDetails.getTotalQuantity());
		}
	}

	private short getTepTotalQuantity(Short measuredQuantity, boolean isAddItem, Short existingQuantity,
			short totalQuantity) {
		short totalItemQuantity = 0;
		if (isAddItem) {
			// this block will execute when add item happens
			totalItemQuantity = (short) (totalQuantity + measuredQuantity);
		} else {
			// this block will execute when update item happens
			// if measuredQuantity(coming from UI) is greater than existingQuantity(already
			// existed in db)
			if (measuredQuantity > existingQuantity) {
				totalItemQuantity = (short) (totalQuantity + measuredQuantity);
			} else {
				totalItemQuantity = totalQuantity;
			}
		}
		return totalItemQuantity;
	}

	private short validateTepPendingQuantity(String cmDetailsId, short totalCmQuantity) {
		short totalGrnQuantity = (short) super.getSumOfTotalQuantityInGRNDetailsByCashMemoDetails(cmDetailsId);
		CashMemoDetailsDaoExt cmDetails = super.findCashMemoDetailsById(cmDetailsId);
		short totalLegacyReturnQty = 0;
		if (cmDetails != null) {
			totalLegacyReturnQty = (cmDetails.getNoOfItemsReturned() == null) ? 0 : cmDetails.getNoOfItemsReturned();
		}
		// if an item is returned in GRN or Legacy then the same item should not be
		// eligible for
		// TEP
		if ((totalLegacyReturnQty + totalGrnQuantity) == totalCmQuantity) {
			throw new ServiceException("This item is already returned in GRN.TEP is not allowed for the same item",
					"ERR-SALE-232",
					"GRN quantity : " + totalGrnQuantity + " & total quantity in CM : " + totalCmQuantity);
		}
		return totalGrnQuantity;
	}

	@Override
	public GoodsExchangeDaoExt updateGoodsExchangeHeader(GoodsExchangeDetailsDaoExt goodsExchangeDetails) {
		// update header level(total weight,total value,total tax,total quantity)
		return super.updateGoodsExchangeHeaderDetails(goodsExchangeDetails.getGoodsExchange());
	}

	@Override
	public GoodsExchangeDetailsDaoExt updateItem(String id, String txnType, String subTxnType, String itemId,
			TepUpdateItemRequestDto tepItemUpdateRequestDto) {
		String lotNumber = null;
		String cashMemoDetailsId = null;
		String itemCode = null;
		CutPieceItemDetailsDto cutPieceItemDetailsDto = null;
		// get goods exchange object by id,txn type & sub txn type
		GoodsExchangeDaoExt goodsExchangeDao = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		// if the TEP status is CONFIRMED,DELETED,APPROVAL_PENDING then throw exception
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchangeDao.getSalesTxn().getStatus());
		String customerMobileNo = getCustomerNo(goodsExchangeDao.getSalesTxn().getCustomerId(), subTxnType);
		String customerType = "";
		if (goodsExchangeDao.getSalesTxn().getCustomerId() != null) {
			customerType = getCustomerType(goodsExchangeDao.getSalesTxn().getCustomerId(), subTxnType);
		}

		GoodsExchangeDetailsDaoExt goodsExchangeDetails = super.findByIdAndGoodsExchange(itemId, goodsExchangeDao);
		if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			cutPieceItemDetailsDto = getItemDetailsJson(goodsExchangeDetails.getItemDetails());
			itemCode = cutPieceItemDetailsDto.getItemCode();
		} else {
			itemCode = goodsExchangeDetails.getItemCode();
		}
		TepItemResponseDto tepItemConfig = engineService.getTepItem(itemCode, customerMobileNo, subTxnType);
		// validation for sub txn type : CUT_PIECE_TEP
		validateItemForCutPieceTep(tepItemConfig, subTxnType, null, goodsExchangeDao, cutPieceItemDetailsDto,
				tepItemUpdateRequestDto.getIsSaleable(), null, tepItemUpdateRequestDto.getQuantity(),
				tepItemUpdateRequestDto.getTotalWeight(), goodsExchangeDetails.getItemCode(), false,
				goodsExchangeDetails.getInventoryId());
		// if cm details is available
		if (goodsExchangeDetails.getCashMemoDetails() != null) {
			validateItemIfCMAvailable(goodsExchangeDetails.getItemCode(), tepItemUpdateRequestDto.getQuantity(),
					tepItemUpdateRequestDto.getIsSaleable(), goodsExchangeDetails.getCashMemoDetails(), false,
					goodsExchangeDetails.getQuantity(), tepItemConfig, subTxnType, goodsExchangeDao);
			lotNumber = goodsExchangeDetails.getCashMemoDetails().getLotNumber();
			cashMemoDetailsId = goodsExchangeDetails.getCashMemoDetails().getId();
		} else {
			// if cm details is not available
			// this block will be executed if subTxnType is NEW_TEP/INTER_BRAND_TEP
			validateItemIfCMNotAvailable(tepItemUpdateRequestDto.getQuantity(), tepItemUpdateRequestDto.getIsSaleable(),
					tepItemConfig, subTxnType);
		}
		MetalRateListDto metalRateListDto = getMetalRate(subTxnType, goodsExchangeDao);
		TepPriceResponseDto tepPriceResponse = getItemPrice(goodsExchangeDetails.getItemCode(), lotNumber,
				cashMemoDetailsId, tepItemUpdateRequestDto.getQuantity(), customerMobileNo,
				tepItemUpdateRequestDto.getTotalWeight(), metalRateListDto, tepItemUpdateRequestDto.getStonesDetails(),
				subTxnType);
		Boolean isfullvalueTep = false;
		if (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)) {
			isfullvalueTep = true;
		}
		TaxCalculationResponseDto taxDetails = engineService.getTaxDetails(CommonUtil.getLocationCode(),
				goodsExchangeDao.getSalesTxn().getCustomerId(), TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.name(),
				itemCode,isfullvalueTep,null);

		BigDecimal itemTotalTax = commonTransactionService.getTaxDetails(tepPriceResponse.getFinalValue(), null,
				taxDetails);
		if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
			itemTotalTax = BigDecimal.ZERO;
		}
		if (tepPriceResponse.getIsUCPproduct() && (SubTxnTypeEnum.FULL_VALUE_TEP.toString().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(subTxnType)
				|| customerType.equals(CustomerTypeEnum.INSTITUTIONAL.name()))) {
			// tepPriceResponse.setFinalValue(tepPriceResponse.getUCPValue());
			TotalTaxAndTaxDetailsDto reverseTaxDetails = commonTransactionService.reverseTotalTaxDetails(
					goodsExchangeDao.getSalesTxn().getCustomerId(), itemCode, tepPriceResponse.getFinalValue(),
					TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE, taxDetails);
			// recalculated totalValue

			tepPriceResponse.setFinalValue(reverseTaxDetails.getFinalValue()
					.subtract(tepPriceResponse.getDiscountRecovered()).subtract(tepPriceResponse.getDeductionAmount()));
			itemTotalTax = commonTransactionService.getTaxDetails(tepPriceResponse.getFinalValue(), null,
					reverseTaxDetails.getTaxDetails());
//			if(cmDetails!=null) {
//				cmDetails.setTaxDetails(MapperUtil.getStringFromJson(reverseTaxDetails.getTaxDetails()));
//			}

		}
		// final value= total value+total tax
		// validate UI input and TEP price API response
		validateInput(tepItemUpdateRequestDto.getQuantity(), tepItemUpdateRequestDto.getTotalValue(),
				tepItemUpdateRequestDto.getUnitValue(), tepItemUpdateRequestDto.getFinalValue(),
				tepItemUpdateRequestDto.getTotalWeight(), tepItemUpdateRequestDto.getUnitWeight(), tepPriceResponse,
				subTxnType, itemTotalTax);

		log.debug("tax details : {}", taxDetails);
		log.debug("itemTotalTax : {}", itemTotalTax);
		return updateItemInGoodsExchangeDetails(tepItemUpdateRequestDto, goodsExchangeDetails, tepPriceResponse,
				taxDetails, itemTotalTax, subTxnType);
	}

	private CutPieceItemDetailsDto getItemDetailsJson(String itemDetailsJson) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(itemDetailsJson), JsonData.class);
		return MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(), CutPieceItemDetailsDto.class);
	}

	private GoodsExchangeDetailsDaoExt updateItemInGoodsExchangeDetails(TepUpdateItemRequestDto tepItemUpdateRequestDto,
			GoodsExchangeDetailsDaoExt goodsExchangeDetails, TepPriceResponseDto tepPriceResponse,
			TaxCalculationResponseDto taxDetailsObj, BigDecimal itemTotalTax, String subTxnType) {
		if (Boolean.TRUE.equals(tepItemUpdateRequestDto.getIsSaleable())) {
			goodsExchangeDetails.setBinCode(CommonConstants.TEP_SALE_BIN_CODE);
		} else {
			if (SubTxnTypeEnum.CUT_PIECE_TEP.toString().equals(subTxnType)) {
				goodsExchangeDetails.setBinCode("CUTPIECE");
			} else {
				goodsExchangeDetails.setBinCode(CommonConstants.TEP_BIN_CODE);
			}
		}
		goodsExchangeDetails.setTotalTax(itemTotalTax);
		goodsExchangeDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetailsObj));
		goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(tepPriceResponse));
		MetalRateListDto metalRateListDto = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil
						.getJsonFromString(goodsExchangeDetails.getGoodsExchange().getSalesTxn().getMetalRateDetails()),
				MetalRateListDto.class);
		setItemPrice(subTxnType, goodsExchangeDetails, tepPriceResponse, metalRateListDto,
				tepItemUpdateRequestDto.getQuantity(), tepItemUpdateRequestDto.getUnitWeight(),
				tepItemUpdateRequestDto.getTotalWeight());
		return super.saveGoodsExchangeDetailsObj(goodsExchangeDetails);
	}

	
	public Boolean getProductGroup(String productGroupCode) {
		ProductGroupDto productGrpDto = epossCallService.callEposs(HttpMethod.GET,
				SalesUtil.PRODUCT_BASE_SERVICE_URL + SalesConstants.EPOSS_PRODUCT_BASE_URL+"/"+productGroupCode, null, null,
				ProductGroupDto.class);
		log.debug("Product Group Data:         " + productGrpDto);
//		ProductGroupDto productGrpDto = productServiceClient.getProductGroup(productGroupCode);
		ProductGroupConfig productGroupJson = MapperUtil.getObjectMapperInstance()
				.convertValue(productGrpDto.getConfigDetails().getData(), ProductGroupConfig.class);
		log.debug("Product Group Config:         " + productGroupJson);
		return productGroupJson.getIsSolitaireStudded() == null ? false : true;
	}
	
}
