/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dto.request.json.TepExceptionDetails;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountValueDetails;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.TepTypeEnum;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.dto.BaseStoneDetails;
import com.titan.poss.core.dto.ItemLotStoneBaseDto;
import com.titan.poss.core.dto.ItemLotStoneDto;
import com.titan.poss.core.dto.MaterialPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.MetalRateDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StonePriceDetailsDto;
import com.titan.poss.core.dto.TepConfigDetails;
import com.titan.poss.core.dto.TepDetails;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.dto.TepStoneResponseDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.WeightUtil;
import com.titan.poss.engine.config.repository.DiscountRepositoryExt;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.dto.TepConfigurations;
import com.titan.poss.engine.dto.response.ItemLotStoneListDto;
import com.titan.poss.engine.location.repository.LocationPriceGroupMappingRepositoryExt;
import com.titan.poss.engine.location.repository.LocationRepositoryExt;
import com.titan.poss.engine.location.repository.MarketMarkupMappingRepositoryExt;
import com.titan.poss.engine.location.repository.MarketRepositoryExt;
import com.titan.poss.engine.location.repository.MetalPriceLocationMappingRepositoryExt;
import com.titan.poss.engine.product.repository.ComplexityPriceGroupRepositoryExt;
import com.titan.poss.engine.product.repository.ProductPriceMappingRepositoryExt;
import com.titan.poss.engine.product.repository.PurityRepositoryExt;
import com.titan.poss.engine.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.engine.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.engine.service.LocationService;
import com.titan.poss.engine.service.ProductService;
import com.titan.poss.engine.service.RuleService;
import com.titan.poss.engine.service.SalesService;
import com.titan.poss.engine.service.TEPPriceUtilService;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.LocationPriceGroupMappingDao;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketMarkupMappingDao;
import com.titan.poss.product.dao.ComplexityPriceGroupDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductPriceMappingDao;
import com.titan.poss.product.dao.PurityDao;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.DiscountItemDetailsDao;
import com.titan.poss.sales.dto.TepExceptionDetailsDto;
import com.titan.poss.sales.dto.WeightDetailsDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("tepPriceUtilServiceImpl")
public class TepPriceUtilServiceImpl implements TEPPriceUtilService {

	public static final String ERR_INV_014 = "ERR-INV-014";

	public static final String ERR_LOC_038 = "ERR-LOC-038";

	public static final String ERR_INV_013 = "ERR-INV-013";
	
	public static final String ERR_INV_034 = "ERR-CORE-034";
	
	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	private static final String ERR_CORE_003 = "ERR-CORE-003";

	private static final String INVOICE_VALUE = "Invoice Value";

	@Autowired
	ProductService productService;

	@Autowired
	private PurityRepositoryExt purityRepository;

	@Autowired
	LocationService locationService;

	@Autowired
	RuleService ruleService;
	
	@Autowired
	private SalesService salesService;
	
	@Autowired
	private ComplexityPriceGroupRepositoryExt complexityPriceGroupRepository;
	
	@Autowired
	private LocationPriceGroupMappingRepositoryExt locationPriceGroupMappingRepository;
	
	@Autowired
	private LocationRepositoryExt locationRepository;
	
	@Autowired
	private MarketRepositoryExt marketRepo;
	
	@Autowired
	private ProductPriceMappingRepositoryExt productPriceMapping;
	
	@Autowired
	private MarketMarkupMappingRepositoryExt marketMarkupMapping;
	
	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailRepo;
	
	@Autowired
	private MetalPriceLocationMappingRepositoryExt metalPriceLocationMappingRepository;
	
	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private DiscountRepositoryExt discountRepoExt;
	
	@Override
	public TepPriceResponseDto getFinalPrice(TepPriceResponseDto priceResponseData) {

		if (priceResponseData.getStonePriceDetails().getPreDiscountValue() == null) {
			priceResponseData.getStonePriceDetails().setPreDiscountValue(BigDecimal.ZERO);
		}
		if (priceResponseData.getMetalPriceDetails().getPreDiscountValue() == null) {
			priceResponseData.getMetalPriceDetails().setPreDiscountValue(BigDecimal.ZERO);
		}
		if (priceResponseData.getMaterialDetails().getPreDiscountValue() == null) {
			priceResponseData.getMaterialDetails().setPreDiscountValue(BigDecimal.ZERO);
		}
		if(priceResponseData.getMakingChargeDetails().getPreDiscountValue() == null) {
			priceResponseData.getMakingChargeDetails().setPreDiscountValue(BigDecimal.ZERO);
		}
		BigDecimal finalValue=BigDecimal.ZERO;
		// making change will be calcualted only for full value TEP
		if (TepTypeEnum.FULL_VALUE_TEP.name().equals(priceResponseData.getTepType())
				|| TepTypeEnum.MANUAL_FULL_VALUE_TEP.name().equals(priceResponseData.getTepType()))
			finalValue = priceResponseData.getMetalPriceDetails().getPreDiscountValue()
				.add(priceResponseData.getMaterialDetails().getPreDiscountValue())
				.add(priceResponseData.getStonePriceDetails().getPreDiscountValue())
				.add(priceResponseData.getMakingChargeDetails().getPreDiscountValue());
		else
			finalValue = priceResponseData.getMetalPriceDetails().getPreDiscountValue()
			.add(priceResponseData.getMaterialDetails().getPreDiscountValue())
			.add(priceResponseData.getStonePriceDetails().getPreDiscountValue());

		priceResponseData.setFinalValue(finalValue);
		return priceResponseData;
	}

	@Override
	public TepPriceResponseDto plainVCalculation(String locationCode, ItemDao itemDto,
			TepPriceResponseDto priceResponseData, Map<String, StandardPriceResponseDto> standardPrice) {

		BigDecimal offset = getOffset(priceResponseData.getItemTypeCode(), itemDto.getPurity(), itemDto.getKarat());
		BigDecimal materialPrice = getMaterialPrice(standardPrice, priceResponseData.getItemTypeCode());
		BigDecimal price = materialPrice.multiply(offset).setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
		return getMetalVJsonData(price, priceResponseData, itemDto.getPurity(), itemDto.getKarat(), locationCode);

	}
	
	@Override
	public TepPriceResponseDto plainF2Calculation(TepPriceResponseDto priceResponseData, String locationCode,
			CashMemoDetailsDao cashMemo, TepConfigurations tepConfig,ItemDao itemDto) {
		String priceGroup = getPriceGroup(locationCode, itemDto.getPricingGroupType());
		priceResponseData = getF2JsonData(itemDto.getComplexity().getComplexityCode(), priceGroup, priceResponseData);
		return priceResponseData;
	}

	/**
	 * @param standardPrice
	 * @param itemTypeCode
	 * @return
	 */
	private BigDecimal getMaterialPrice(Map<String, StandardPriceResponseDto> standardPrice, String itemTypeCode) {

		if (standardPrice != null && standardPrice.get(itemTypeCode) != null) {

			return standardPrice.get(itemTypeCode).getRatePerUnit();
		} else {
			throw new ServiceException("{metalType} rate not available.", "ERR-ENG-022","Rate not found in request for metal type code: "
					+ itemTypeCode,Map.of("metalType", MetalTypeCodeEnum.valueOf(itemTypeCode).getValue()));
		}
	}

	/**
	 * @param itemTypeCode
	 * @param purity
	 * @param karat
	 * @return
	 */
	private BigDecimal getOffset(String itemTypeCode, BigDecimal purity, BigDecimal karat) {
		PurityDao purityMaster = null;
		if (MetalTypeCodeEnum.getUniqueMetals().contains(itemTypeCode)) {
			if (itemTypeCode.equalsIgnoreCase(MetalTypeCodeEnum.J.toString())) {
				purityMaster = purityRepository.findOneByKaratAndItemTypeCode(karat, itemTypeCode);
			} else {
				purityMaster = purityRepository.findOneByPurityAndItemTypeCode(purity, itemTypeCode);
			}
		} else {
			throw new ServiceException("Improper materialtype cannot get offset for the same", ERR_INV_013);
		}
		if (purityMaster == null) {
			throw new ServiceException("No purity/karat is found for the selected item", "ERR-INV-050");
		}
		validatePurity(purityMaster);

		return purityMaster.getOffset();
	}

	private void validatePurity(PurityDao purityMaster) {
		if (purityMaster.getOffset() == null) {
			throw new ServiceException("No offset is set for particular purity/carat", "ERR-INV-051");
		}
	}

	/**
	 * @param itemDto
	 * @param price
	 * @param priceResponseData
	 * @param purity
	 * @param karat
	 * @param locationCode
	 * @return
	 */
	private TepPriceResponseDto getMetalVJsonData(BigDecimal price, TepPriceResponseDto priceResponseData,
			BigDecimal purity, BigDecimal karat, String locationCode) {

		MetalPriceDto pd = new MetalPriceDto();
		List<MetalPriceDto> data = new ArrayList<>();
		setType(priceResponseData.getItemTypeCode(), pd);

		pd.setWeightUnit(locationService.getCountryDetails(locationCode).getWeightUnit());
		pd.setNetWeight(priceResponseData.getNetWeight());
		price = price.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
		pd.setRatePerUnit(price);
		pd.setPurity(purity);
		pd.setKarat(karat);
		// if measured weight is edited then calculation should be w.r.t edited weight
		pd.setMetalValue(priceResponseData.getNetWeight().multiply(price).setScale(EngineConstants.VALUE_SCALE,
				RoundingMode.HALF_UP));
		priceResponseData.getMetalPriceDetails().setPreDiscountValue(priceResponseData.getNetWeight().multiply(price)
				.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
		pd.setMetalTypeCode(priceResponseData.getItemTypeCode());
		data.add(pd);
		priceResponseData.getMetalPriceDetails().setMetalPrices(data);
		return priceResponseData;
	}

	private void setType(String metalTypeCode, MetalPriceDto pd) {
		if (metalTypeCode.equals(MetalTypeCodeEnum.J.toString())) {
			pd.setType(EngineConstants.J);
		} else if (metalTypeCode.equals(MetalTypeCodeEnum.L.toString())) {
			pd.setType(EngineConstants.L);
		} else if (metalTypeCode.equals(MetalTypeCodeEnum.P.toString())) {
			pd.setType(EngineConstants.P);
		}
	}
	
	@Override
	public void calculateUCPStdWeight(ItemDao itemDto, TepPriceResponseDto priceResponseData, BigDecimal measuredWeight,
			Short measuredQuantity, TepConfigurations tepConfig,CashMemoDetailsDao cashMemo) {
		List<ItemLotStoneDto> stoneList = priceResponseData.getStones();
		BigDecimal measuredStdWeight = itemDto.getStdWeight();
		BigDecimal materialWeight = BigDecimal.ZERO;
		BigDecimal netWeight = BigDecimal.ZERO;
		BigDecimal stoneWeight = BigDecimal.ZERO;
		BigDecimal measuredStoneWeight = BigDecimal.ZERO;
		Short stdQantity = Short.valueOf("1");
		// net weight = measuredWeight - (materialWeight+stoneWeight)
		// stone weight
		// (if cm available take from price response stdWeight-materialWeight-netWeight)
		// if getting from stones list sum of all stones weight
		MetalPriceDetailsDto metalPriceDetails = priceResponseData.getMetalPriceDetails();
		StonePriceDetailsDto stonePriceDetails = priceResponseData.getStonePriceDetails();
		MaterialPriceDetailsDto materialPriceDetails = priceResponseData.getMaterialDetails();
		priceResponseData.setMeasuredWeight(measuredWeight);
		if (priceResponseData.getIscashMemoAvailable()) {
			ObjectMapper mapper=new ObjectMapper();
			JsonNode root;
			try {
				root = mapper.readTree(cashMemo.getInventoryWeightDetails());
			} catch (IOException e) {
				throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
			}
			JsonNode dataNode = root.path("data");
			if (!dataNode.isMissingNode()) {
						if (dataNode.hasNonNull(EngineConstants.GOLD_WEIGHT))
							netWeight=netWeight.add(new BigDecimal(dataNode.path(EngineConstants.GOLD_WEIGHT).asText()));
						if (dataNode.hasNonNull(EngineConstants.SILVER_WEIGHT))
							netWeight=netWeight.add(new BigDecimal(dataNode.path(EngineConstants.SILVER_WEIGHT).asText()));
						if (dataNode.hasNonNull(EngineConstants.PLATINUM_WEIGHT))
							netWeight=netWeight.add(new BigDecimal(dataNode.path(EngineConstants.PLATINUM_WEIGHT).asText()));
						if (dataNode.hasNonNull(EngineConstants.MATERIAL_WEIGHT))
							materialWeight=materialWeight.add(new BigDecimal(dataNode.path(EngineConstants.MATERIAL_WEIGHT).asText()));
						if (dataNode.hasNonNull(EngineConstants.STONE_WEIGHT))
							stoneWeight=stoneWeight.add(new BigDecimal(dataNode.path(EngineConstants.STONE_WEIGHT).asText()));
			}
			if(stoneList!=null && !stoneList.isEmpty()) {
				for (ItemLotStoneDto stone : stoneList) {
					if(stone.getStoneWeight()!=null)
						measuredStoneWeight = measuredStoneWeight.add(stone.getStoneWeight());
				}
				measuredStoneWeight = measuredStoneWeight.divide(new BigDecimal(5), EngineConstants.WEIGHT_SCALE,
						RoundingMode.HALF_UP);
			}
			if (materialWeight == null) {
				// old records in cm which dont have material details data
				materialWeight = BigDecimal.ZERO;
			} 
			if (stoneWeight == null) {
				stoneWeight = BigDecimal.ZERO;
			}else {
				stoneWeight=measuredStoneWeight;
			}
			measuredStdWeight = netWeight.add(stoneWeight).add(materialWeight);
			if (measuredWeight != null && measuredQuantity != null) {
				stdQantity = measuredQuantity;
				// check if weight tollerance always allowed.
				BigDecimal stdWeight = itemDto.getStdWeight();
				if(Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable())) {
					stdWeight = priceResponseData.getBilledWeight();
				}
				checkTEPTolerance(stdWeight, measuredWeight.divide(BigDecimal.valueOf(stdQantity),
						EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP), tepConfig,priceResponseData.getIscashMemoAvailable(),priceResponseData.getBilledWeight());
				netWeight = measuredWeight.subtract(measuredStoneWeight).subtract(materialWeight);
			}
			stonePriceDetails.setStoneWeight(stoneWeight);
		} else {
			if(stoneList!=null && !stoneList.isEmpty()) {
				for (ItemLotStoneDto stone : stoneList) {
					if(stone.getStoneWeight()!=null)
						measuredStoneWeight = measuredStoneWeight.add(stone.getStoneWeight());
				}
				measuredStoneWeight = measuredStoneWeight.divide(new BigDecimal(5), EngineConstants.WEIGHT_SCALE,
						RoundingMode.HALF_UP);
				stonePriceDetails.setStoneWeight(measuredStoneWeight);
			}
			if (measuredWeight != null && measuredQuantity != null) {
				stdQantity = measuredQuantity;
				if(!(TepTypeEnum.INTER_BRAND_TEP.name().equals(priceResponseData.getTepType())) || TepTypeEnum.MANUAL_INTER_BRAND_TEP.name().equals(priceResponseData.getTepType())) {
					BigDecimal stdWeight = itemDto.getStdWeight();
					if(Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable())) {
						stdWeight = priceResponseData.getBilledWeight();
					}
					checkTEPTolerance(stdWeight, measuredWeight.divide(BigDecimal.valueOf(stdQantity),
						EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP), tepConfig,priceResponseData.getIscashMemoAvailable(),priceResponseData.getBilledWeight());
				}else {
					measuredStdWeight=measuredWeight;
				}
				netWeight = measuredWeight.subtract(measuredStoneWeight).subtract(materialWeight);
			} else if (measuredWeight == null && measuredQuantity == null) {
				netWeight = itemDto.getStdWeight().subtract(measuredStoneWeight).subtract(materialWeight);
			}
			materialPriceDetails.setMaterialWeight(materialWeight);
			priceResponseData.setMaterialDetails(materialPriceDetails);
		}
		priceResponseData.setStonePriceDetails(stonePriceDetails);
		priceResponseData.setNetWeight(netWeight);
		priceResponseData.setItemQuantity(stdQantity);
		priceResponseData.setStdWeight(measuredStdWeight);
		if(cashMemo!=null) {
			priceResponseData.setLotNumber(cashMemo.getLotNumber());
		}
		
	}

	@Override
	public void calculateStdWeight(ItemDao itemDto, TepPriceResponseDto priceResponseData, BigDecimal measuredWeight,
			Short measuredQuantity, TepConfigurations tepConfig) {
		List<ItemLotStoneDto> stoneList = priceResponseData.getStones();
		BigDecimal measuredStdWeight = itemDto.getStdWeight();
		BigDecimal materialWeight = BigDecimal.ZERO;
		BigDecimal netWeight = BigDecimal.ZERO;
		BigDecimal stoneWeight = BigDecimal.ZERO;
		BigDecimal measuredStoneWeight = BigDecimal.ZERO;
		Short stdQantity = Short.valueOf("1");
		// net weight = measuredWeight - (materialWeight+stoneWeight)
		// stone weight
		// (if cm available take from price response stdWeight-materialWeight-netWeight)
		// if getting from stones list sum of all stones weight
		MetalPriceDetailsDto metalPriceDetails = priceResponseData.getMetalPriceDetails();
		StonePriceDetailsDto stonePriceDetails = priceResponseData.getStonePriceDetails();
		MaterialPriceDetailsDto materialPriceDetails = priceResponseData.getMaterialDetails();
		priceResponseData.setMeasuredWeight(measuredWeight);
		
		if (priceResponseData.getIscashMemoAvailable()) {
			for (MetalPriceDto metal : metalPriceDetails.getMetalPrices()) {
				netWeight = netWeight.add(metal.getNetWeight());
			}
			if (stonePriceDetails.getStoneWeight() != null) {
				//carats to grm conversion
				stoneWeight = stonePriceDetails.getStoneWeight().divide(new BigDecimal(5), EngineConstants.WEIGHT_SCALE,
						RoundingMode.HALF_UP);
				for (ItemLotStoneDto stone : stoneList) {
					measuredStoneWeight = measuredStoneWeight.add(stone.getStoneWeight());
				}
			}
			measuredStoneWeight = measuredStoneWeight.divide(new BigDecimal(5), EngineConstants.WEIGHT_SCALE,
					RoundingMode.HALF_UP);
			if (materialPriceDetails == null) {
				// old records in cm which dont have material details data
				materialWeight = BigDecimal.ZERO;
			} else {
				// take metal weight from cm
				materialWeight = materialPriceDetails.getMaterialWeight();
			}
			if (materialWeight == null) {
				materialWeight = BigDecimal.ZERO;
			}
			if (stoneWeight == null) {
				stoneWeight = BigDecimal.ZERO;
			}else {
				stoneWeight=measuredStoneWeight;
			}
			measuredStdWeight = netWeight.add(stoneWeight).add(materialWeight);
			if (measuredWeight != null && measuredQuantity != null) {
				stdQantity = measuredQuantity;
				// check if weight tollerance always allowed.
				BigDecimal stdWeight = itemDto.getStdWeight();
				if(Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable())) {
					stdWeight = priceResponseData.getBilledWeight();
				}
				checkTEPTolerance(stdWeight, measuredWeight.divide(BigDecimal.valueOf(stdQantity),
						EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP), tepConfig,priceResponseData.getIscashMemoAvailable(),priceResponseData.getBilledWeight());
                netWeight = measuredWeight.subtract(measuredStoneWeight).subtract(materialWeight);
			}
			stonePriceDetails.setStoneWeight(stoneWeight);
		} else {
			if(stoneList!=null && !stoneList.isEmpty()) {
				for (ItemLotStoneDto stone : stoneList) {
					if(stone.getStoneWeight()!=null)
						measuredStoneWeight = measuredStoneWeight.add(stone.getStoneWeight());
				}
				measuredStoneWeight = measuredStoneWeight.divide(new BigDecimal(5), EngineConstants.WEIGHT_SCALE,
						RoundingMode.HALF_UP);
				stonePriceDetails.setStoneWeight(measuredStoneWeight);
			}
			if (measuredWeight != null && measuredQuantity != null) {
				stdQantity = measuredQuantity;
				if(!(TepTypeEnum.INTER_BRAND_TEP.name().equals(priceResponseData.getTepType())) || TepTypeEnum.MANUAL_INTER_BRAND_TEP.name().equals(priceResponseData.getTepType())) {
					BigDecimal stdWeight = itemDto.getStdWeight();
					if(Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable())) {
						stdWeight = priceResponseData.getBilledWeight();
					}
					checkTEPTolerance(stdWeight, measuredWeight.divide(BigDecimal.valueOf(stdQantity),
						EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP), tepConfig,priceResponseData.getIscashMemoAvailable(),priceResponseData.getBilledWeight());
				}else {
					measuredStdWeight=measuredWeight;
				}
                netWeight = measuredWeight.subtract(measuredStoneWeight).subtract(materialWeight);
				

				
			} else if (measuredWeight == null && measuredQuantity == null) {
				netWeight = itemDto.getStdWeight().subtract(measuredStoneWeight).subtract(materialWeight);
			}
			materialPriceDetails.setMaterialWeight(materialWeight);
			priceResponseData.setMaterialDetails(materialPriceDetails);
		}
		priceResponseData.setStonePriceDetails(stonePriceDetails);
		priceResponseData.setNetWeight(netWeight);
		priceResponseData.setItemQuantity(stdQantity);
		priceResponseData.setStdWeight(measuredStdWeight);
			
		}

	private void checkTEPTolerance(BigDecimal stdWeight, BigDecimal measuredWeight, TepConfigurations tepConfig, Boolean isCashMemoAvailable, BigDecimal billedWeight) {
		BigDecimal tollerenceWeightPercent;
		BigDecimal maxAllowedWeight;
		BigDecimal minAllowedWeight;
		BigDecimal limit = BigDecimal.ZERO;
		tollerenceWeightPercent = tepConfig.getItemLevelConfig().getWeightTolerancePercent();
		if(tollerenceWeightPercent!=null) {
			limit = tollerenceWeightPercent.divide(BigDecimal.valueOf(100)).multiply(stdWeight);
		}
		// measured weight should fall in + - of limit
		maxAllowedWeight = stdWeight.add(limit);
		minAllowedWeight = stdWeight.subtract(limit);
		maxAllowedWeight=maxAllowedWeight.setScale(EngineConstants.WEIGHT_SCALE, RoundingMode.HALF_UP);
		minAllowedWeight=minAllowedWeight.setScale(EngineConstants.WEIGHT_SCALE, RoundingMode.HALF_UP);
		if(BooleanUtils.isTrue(isCashMemoAvailable)) {
			if(billedWeight!=null && measuredWeight.compareTo(billedWeight)>0) {
                billedWeight =billedWeight.setScale(EngineConstants.WEIGHT_SCALE, RoundingMode.HALF_UP);
                measuredWeight =measuredWeight.setScale(EngineConstants.WEIGHT_SCALE, RoundingMode.HALF_UP);
				Map<String,String> dynamicValue=Map.of("measuredWeight", measuredWeight.toString(),"billedWeight",billedWeight.toString());
				
				throw new ServiceException("Measured weight :  {measuredWeight}  can't be more than billed weight : {billedWeight} ", "ERR-ENG-027", dynamicValue) ;
			// if tep weight toleance per is 0 then minAllowedWeight and maxAllowedWeight = billedWeight
			}
			
			if(billedWeight.compareTo(minAllowedWeight)<0) {
			Map<String, String> dynamicValue=Map.of("minRange", minAllowedWeight.toString(),"maxRange",maxAllowedWeight.toString());
			throw new ServiceException("exceeding tolerance limit, allowed range ", "ERR-ENG-019",dynamicValue);
			}
			maxAllowedWeight=billedWeight;
		}
		if(maxAllowedWeight.compareTo(minAllowedWeight)==0 && maxAllowedWeight.compareTo(BigDecimal.ZERO)==0) {
			minAllowedWeight = measuredWeight;
			maxAllowedWeight = measuredWeight;
		}
		if (measuredWeight.compareTo(maxAllowedWeight) > 0 || measuredWeight.compareTo(minAllowedWeight) < 0) {
			Map<String, String> dynamicValue=Map.of("minRange", minAllowedWeight.toString(),"maxRange",maxAllowedWeight.toString());
			throw new ServiceException("exceeding tolerance limit, allowed range ", "ERR-ENG-019",dynamicValue);
		}
	}

	private TepExceptionDetails getTepExceptionDetails(JsonData offerDetails) {

		TepExceptionDetails tepExceptionDetails = new TepExceptionDetails();

		if (offerDetails != null) {
			tepExceptionDetails = MapperUtil.getObjectMapperInstance().convertValue(offerDetails.getData(),
					TepExceptionDetails.class);
		}
		return tepExceptionDetails;
	}

	/**
	 * @param cashMemo
	 * @return
	 */
	@Override
	public PriceResponseDto getPriceDetails(CashMemoDetailsDao cashMemo) {

		PriceResponseDto priceResponse = new PriceResponseDto();
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(cashMemo.getPriceDetails());

			priceResponse = MapperUtil.getObjectMapperInstance().convertValue(root, PriceResponseDto.class);
			return priceResponse;

		} catch (IOException e) {
			throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR-CORE-003");
		}

	}

	@Override
	public TepPriceResponseDto studdedF1Calculation(TepPriceResponseDto priceResponseData, String locationCode,
			CashMemoDetailsDao cashMemo, TepConfigurations tepCofigReponse) {
		BigDecimal newStoneWeight = BigDecimal.ZERO;
		Integer newNoOfStones = 0;
		BigDecimal newValue =BigDecimal.ZERO;
		
		for (ItemLotStoneDto stone : priceResponseData.getStones()) {
			newStoneWeight = newStoneWeight.add(stone.getStoneWeight());
			newNoOfStones = newNoOfStones + stone.getMeasuredNoOfStones();
			newValue = newValue.add(stone.getFinalStoneValue());

		}
		if(newNoOfStones!=0)
			priceResponseData.getStonePriceDetails().setNumberOfStones(newNoOfStones);
		if(newStoneWeight.signum()!=0)
			priceResponseData.getStonePriceDetails().setStoneWeight(newStoneWeight);
		if(newValue.signum()>=0)
			priceResponseData.getStonePriceDetails().setPreDiscountValue(newValue.setScale(DomainConstants.PRICE_SCALE,DomainConstants.ROUNDIND_MODE));
		priceResponseData.getStonePriceDetails().setWeightUnit(EngineConstants.CARAT);
		return priceResponseData;
	}
	
	@Override
	public TepPriceResponseDto studdedF2Calculation(TepPriceResponseDto priceResponseData, String locationCode,
			CashMemoDetailsDao cashMemo, TepConfigurations tepConfig, ItemDao itemDto) {
		BigDecimal cfaLevelMkingChargePercentage;
		BigDecimal skuLevelMkingChargePercentage;
		BigDecimal makingChargePercentage;
		Integer actualNoOfStones;
		
		priceResponseData.getMakingChargeDetails().setIsDynamic(true);
		BigDecimal sumOfVandF1 = priceResponseData.getStonePriceDetails().getPreDiscountValue()
				.add(priceResponseData.getMetalPriceDetails().getPreDiscountValue());
		
		actualNoOfStones =priceResponseData.getStones().stream().mapToInt(ItemLotStoneDto::getMeasuredNoOfStones).sum();
		cfaLevelMkingChargePercentage = getCfaLevelMakingChargePercentage(sumOfVandF1, priceResponseData.getProductGroupCode(),
				actualNoOfStones);

		skuLevelMkingChargePercentage = getSkuLevelMakingChargePercentage(cfaLevelMkingChargePercentage, itemDto.getPriceFactor());

		makingChargePercentage = getMarketLevelMakingChargePercentage(skuLevelMkingChargePercentage, locationCode,
				EngineConstants.F2_MATERIAL_TYPE_CODE);

		//round off
		makingChargePercentage=makingChargePercentage.setScale(EngineConstants.PERCENT_SCALE, RoundingMode.HALF_UP);
		priceResponseData.getMakingChargeDetails().setMakingChargePercentage(makingChargePercentage);

		priceResponseData.getMakingChargeDetails().setPreDiscountValue(makingChargePercentage.divide(new BigDecimal(100)).multiply(sumOfVandF1).setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
		return priceResponseData;
	}

	@Override
	public void applyUCPCMDeduction(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData, ItemDao itemDto) {// cm mandatory
		if (tepCofigReponse.getItemLevelConfig().getIsCMMandatory() && (!priceResponseData.getIscashMemoAvailable())) {
			// apply cm mandatory deduction if cm unavailable

			BigDecimal cmDeductionPer = tepCofigReponse.getItemLevelConfig().getCmUnavailableDeductionPercent();
			BigDecimal cmDeductionCharegs = itemDto.getStdValue().multiply(cmDeductionPer).divide(new BigDecimal(100),
					EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			// if deduction charge is more than stone charge then deduct stone charge
			if (itemDto.getStoneCharges().compareTo(BigDecimal.ZERO) != 0) {
				if (cmDeductionCharegs.compareTo(itemDto.getStoneCharges()) > 1) {
					if(priceResponseData.getCustomerType()!=null && !priceResponseData.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name())) {
					priceResponseData.setFinalValue(itemDto.getStdValue().subtract(itemDto.getStoneCharges()));
					}
					else if(priceResponseData.getCustomerType()==null) {
						priceResponseData.setFinalValue(itemDto.getStdValue().subtract(cmDeductionCharegs));
					}
					priceResponseData.setDeductionAmount(itemDto.getStoneCharges());
				} else {
					if(priceResponseData.getCustomerType()!=null && !priceResponseData.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name())) {
						priceResponseData.setFinalValue(itemDto.getStdValue().subtract(cmDeductionCharegs));
					}
					else if(priceResponseData.getCustomerType()==null) {
						priceResponseData.setFinalValue(itemDto.getStdValue().subtract(cmDeductionCharegs));
					}
					priceResponseData.setDeductionAmount(cmDeductionCharegs);
				}
				priceResponseData.setCmUnavailableDeductionAmount(cmDeductionCharegs);
			}
		}
	}
	
	@Override
	public TepPriceResponseDto getF2JsonData(String complexityCode, String priceGroup,
			TepPriceResponseDto priceResponseData) {
		ComplexityPriceGroupDao complexityPriceGroup = getComplexityPriceGroup(complexityCode, priceGroup);

		if (complexityPriceGroup != null) {

			BigDecimal makingChargePer = BigDecimal.ZERO;
			BigDecimal makingCharge;

			makingChargePer = makingChargePer.add(complexityPriceGroup.getWastagePct());
			
			makingCharge= priceResponseData.getNetWeight()
					.multiply(complexityPriceGroup.getMakingChargePgram());
			
			

			makingChargePer = makingChargePer.add(complexityPriceGroup.getMakingChargePct());
		
			if(priceResponseData.getMetalPriceDetails().getPreDiscountValue().compareTo(new BigDecimal(0))==0)
			{
				makingChargePer=BigDecimal.ZERO;
			}
			else
			{
				makingChargePer=makingChargePer.add(makingCharge
					.divide(priceResponseData.getMetalPriceDetails().getPreDiscountValue(),EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
					.multiply(new BigDecimal(100)));
			}
			makingCharge=makingChargePer.divide(new BigDecimal(100))
					.multiply(priceResponseData.getMetalPriceDetails().getPreDiscountValue()).setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			
			
			makingChargePer=makingChargePer.setScale(EngineConstants.PERCENT_SCALE, RoundingMode.HALF_UP);
			priceResponseData.getMakingChargeDetails().setMakingChargePercentage(makingChargePer);
			priceResponseData.getMakingChargeDetails().setPreDiscountValue(makingCharge);
			
			//making pct details
			priceResponseData.getMakingChargeDetails().setMakingChargePgram(complexityPriceGroup.getMakingChargePgram());
			priceResponseData.getMakingChargeDetails().setMakingChargePct(complexityPriceGroup.getMakingChargePct());
			priceResponseData.getMakingChargeDetails().setWastagePct(complexityPriceGroup.getWastagePct());
			
			
			return priceResponseData;
		} else {
			throw new ServiceException("No complexityPriceGroup found for requested ItemCode", "ERR-INV-049");
		}
	}
	
	private ComplexityPriceGroupDao getComplexityPriceGroup(String complexityCode, String priceGroup) {
		ComplexityPriceGroupDao complexityPriceGroup = complexityPriceGroupRepository
				.findOneByComplexityCodeAndPriceGroup(complexityCode, priceGroup);
		if (complexityPriceGroup == null) {
			throw new ServiceException("No complexityPriceGroup found for requested ItemCode", "ERR-INV-049");
		}
		return complexityPriceGroup;
	}

	@Override
	public void getFlatItemExceptionValue(String locationCode, TepConfigurations tepConfig,
			TepPriceResponseDto priceResponseData, BigDecimal stdWeight, BigDecimal measuredWeight) {// item level
		if (priceResponseData.getTepExceptionDetails() != null) {
			TepExceptionDetailsDto tepExceptionDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(priceResponseData.getTepExceptionDetails().getData(), TepExceptionDetailsDto.class);
			if (tepExceptionDetails.getFlatExchangeValue() != null
					&& (tepExceptionDetails.getFlatExchangeValue().compareTo(BigDecimal.ZERO) > 0)) {
				// if value is available
				priceResponseData.setFinalValue(tepExceptionDetails.getFlatExchangeValue());
			}
		}
//		if (tepConfig.getItemLevelConfig().getTepOfferDetails() != null) {
////			priceResponseData.getTepExceptionDetails()
//			TepExceptionDetails tepExceptionDetails = getTepExceptionDetails(
//					tepConfig.getItemLevelConfig().getTepOfferDetails().getOfferDetails());
//			if (tepExceptionDetails.getFlatTepExchangeValue() != null
//					&& (tepExceptionDetails.getFlatTepExchangeValue().compareTo(BigDecimal.ZERO) > 0)) {
//				// if value is available
//				priceResponseData.setFinalValue(tepExceptionDetails.getFlatTepExchangeValue());
//			}
//			Boolean isExceptionWtTolleranceAllowed = false;
//			if (tepConfig.getItemLevelConfig().getTepOfferDetails() != null) {
//				isExceptionWtTolleranceAllowed = tepExceptionDetails.getIsWeightToleranceAllowed();
//				// exception tolleracne allowed
//				if (isExceptionWtTolleranceAllowed) {
//					if(Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable())) {
//						stdWeight = priceResponseData.getBilledWeight();
//					}
//					if (measuredWeight != null) {
//						checkTEPTolerance(stdWeight,
//								measuredWeight.divide(BigDecimal.valueOf(priceResponseData.getItemQuantity()),
//										EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP),
//								tepConfig, priceResponseData.getIscashMemoAvailable(),
//								priceResponseData.getBilledWeight());
//					}
//				}
//			}
//		}
	}

	@Override
	public void applyStoneLevelException(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData) {
		// get lot stone details from eposs based on item code and lotnumber
		// stone level
		if (tepCofigReponse.getStoneLeveLConfig().getResults().get(0).getTepOfferDetails() != null) {
			TepExceptionDetails tepExceptionDetails = getTepExceptionDetails(
					tepCofigReponse.getStoneLeveLConfig().getResults().get(0).getTepOfferDetails().getOfferDetails());
			if (tepExceptionDetails.getFlatTepExchangeValue() != null
					|| (tepExceptionDetails.getFlatTepExchangeValue().compareTo(BigDecimal.ZERO) < 1)) {
				// if value is available
				priceResponseData.setFinalValue(tepExceptionDetails.getFlatTepExchangeValue());
			} else {
				// if percentage is available

			}

		}
	}

	@Override
	public void setInitialResponse(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData, ItemDao itemDto, BigDecimal measuredWeight) {
		// to set weight and other things..
		// cn be removed all below details
		priceResponseData.setDeductionAmount(BigDecimal.ZERO);
		priceResponseData.setStdWeight(itemDto.getStdWeight());
		if(priceResponseData.getCmDocNo()==null) {
			priceResponseData.setCmUnavailableDeductionPercent(tepCofigReponse.getItemLevelConfig().getCmUnavailableDeductionPercent());
		}
		else {
			priceResponseData.setCmUnavailableDeductionPercent(BigDecimal.ZERO);
		}
		String currencyCode = locationService.listLocationByLocationCode(locationCode).getStockCurrency();
		if(tepCofigReponse.getItemLevelConfig().getIsFVTAllowed() && tepCofigReponse.getItemLevelConfig().getIsTepAllowed()) 
			priceResponseData.setFvtDeductionPercent( tepCofigReponse.getItemLevelConfig().getFvtDeductionPercent());
		priceResponseData.setCurrencyCode(currencyCode);
	}

	@Override
	public void calculateUCPStdValue(String locationCode, TepConfigurations tepConfig,
			TepPriceResponseDto priceResponseData, ItemDao itemDto,TepPriceRequest tepRequest,CashMemoDetailsDao cashMemo) {
		// check the validation for config.

		List<Object[]> metalRateList = null;
		BigDecimal measuredWeight=tepRequest.getMeasuredWeight();
		Short measuredQuantity=tepRequest.getMeasuredQuantity();
		MetalPriceDto pd = new MetalPriceDto();
		pd.setKarat(itemDto.getKarat());
		pd.setMetalTypeCode(priceResponseData.getItemTypeCode());
		Date applicaDate = salesService.getBusinessDay(CommonUtil.getLocationCode()).getBusinessDate();
		// for applicable date
		metalRateList = metalPriceLocationMappingRepository.getMetalRate(true, CommonUtil.getLocationCode(),
				CalendarUtils.formatDateToSql(applicaDate), null, true);
		
		List<MetalRateDto> metalRateDtoList = new ArrayList<>();
        Map<BigDecimal,BigDecimal> metalRateMap = new HashMap();
		for (Object[] obj : metalRateList) {
			MetalRateDto metalRateDto = new MetalRateDto();
			BigDecimal offSet = (BigDecimal) obj[2];
			metalRateDto.setOffset((BigDecimal) obj[2]);
			BigDecimal metalRate = (BigDecimal) obj[5];
				metalRateMap.put((BigDecimal)obj[3], metalRate.multiply(metalRateDto.getOffset()).setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));					
		}
		if(pd.getMetalTypeCode().equals("J")) {
			 pd.setRatePerUnit(metalRateMap.get(itemDto.getKarat()));
		}
		else {
			if(tepRequest.getStandardPrice().get(pd.getMetalTypeCode())!=null) {
				pd.setRatePerUnit(tepRequest.getStandardPrice().get(pd.getMetalTypeCode()).getRatePerUnit());
			}
			
		}
		
		
		List<MetalPriceDto> data = new ArrayList<>();
		setType(priceResponseData.getItemTypeCode(), pd);
		data.add(pd);
		BigDecimal finalValue=BigDecimal.ZERO;
		if(Boolean.TRUE.equals(tepConfig.getItemLevelConfig().getIsCMMandatory()) && Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable()) && INVOICE_VALUE.equals(tepConfig.getItemLevelConfig().getTypeOfExchange())) {
			finalValue=finalValue.add(cashMemo.getFinalValue());
		}else {
			finalValue = finalValue.add(itemDto.getStdValue().subtract(itemDto.getStoneCharges()));
		}
		if ((tepRequest.getCustomerType()!=null && tepRequest.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name()))
				|| (TepTypeEnum.FULL_VALUE_TEP.name().equals(tepRequest.getTepType())
						|| TepTypeEnum.MANUAL_FULL_VALUE_TEP.name().equals(tepRequest.getTepType()))) {
			finalValue = (itemDto.getStdValue());
		}
		priceResponseData.getStonePriceDetails().setPreDiscountValue(itemDto.getStoneCharges());
		priceResponseData.getMetalPriceDetails().setPreDiscountValue(finalValue);
		priceResponseData.getMetalPriceDetails().setMetalPrices(data);
		priceResponseData.setUCPValue(finalValue);
		
		BigDecimal pricePerGm = itemDto.getStdValue().divide(itemDto.getStdWeight(), EngineConstants.DIVISION_SCALE,
				RoundingMode.HALF_UP);
		if (measuredWeight == null && measuredQuantity == null) {
			priceResponseData.setNetWeight(itemDto.getStdWeight());
			priceResponseData.setItemQuantity(Short.valueOf("1"));
			priceResponseData.setFinalValue(finalValue);
		}
		if (measuredWeight != null && measuredQuantity != null) {
			if(Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable()) && cashMemo.getTotalWeight().equals(measuredWeight)) {
				priceResponseData.setItemQuantity(measuredQuantity);
				priceResponseData.setFinalValue(finalValue);
			}else {
			BigDecimal quantity = BigDecimal.valueOf(measuredQuantity);
			priceResponseData.setNetWeight(measuredWeight);
			priceResponseData.setMeasuredWeight(measuredWeight);
			priceResponseData.setItemQuantity(measuredQuantity);
			// if is proportioned is true then only do multiplication with weight
			if (tepConfig.getItemLevelConfig().getIsProportionedValue()) {
				measuredWeight = measuredWeight.divide(BigDecimal.valueOf(priceResponseData.getItemQuantity()),
						EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP);
				priceResponseData.setMeasuredWeight(measuredWeight);
				BigDecimal stdWeight = itemDto.getStdWeight();
				if(Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable())) {
					stdWeight = priceResponseData.getBilledWeight();
				}
				checkTEPTolerance(itemDto.getStdWeight(), measuredWeight, tepConfig,priceResponseData.getIscashMemoAvailable(),priceResponseData.getBilledWeight());
				finalValue=pricePerGm.multiply(measuredWeight).multiply(quantity);

			} else {
				finalValue=finalValue.multiply(quantity);
			}
			priceResponseData.setFinalValue(finalValue);
			}

		}
	}

	@Override
	public void applyStuddedCMDeduction(String locationCode, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData, CashMemoDetailsDao cashMemo, ItemDao itemDto) {// cm mandatory

		if (tepCofigReponse.getItemLevelConfig().getIsCMMandatory() && (!priceResponseData.getIscashMemoAvailable())) {
			// apply cm mandatory deduction

			BigDecimal cmDeductionPer = tepCofigReponse.getItemLevelConfig().getCmUnavailableDeductionPercent();
			BigDecimal cmDeductionCharegs = priceResponseData.getStonePriceDetails().getPreDiscountValue().multiply(cmDeductionPer)
					.divide(new BigDecimal(100), EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			// if deduction charge is more than stone charge then deduct stone charge
			if (itemDto.getStoneCharges().compareTo(BigDecimal.ZERO) == 0) {
				priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(BigDecimal.ZERO));
			}
			if (cmDeductionCharegs.compareTo(priceResponseData.getStonePriceDetails().getPreDiscountValue()) >= 1) {
				priceResponseData.setFinalValue(priceResponseData.getFinalValue()
						.subtract(priceResponseData.getStonePriceDetails().getPreDiscountValue()));
			} else {
				priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(cmDeductionCharegs));
			}
			priceResponseData.setCmUnavailableDeductionAmount(cmDeductionCharegs);
			priceResponseData.setDeductionAmount(priceResponseData.getDeductionAmount().add(cmDeductionCharegs));

		}

	}

	@Override
	public void applyMetalDeductions(TepConfigurations tepCofigReponse, TepPriceResponseDto priceResponseData) {

		List<MetalPriceDto> metalPriceList = priceResponseData.getMetalPriceDetails().getMetalPrices();
		for (MetalPriceDto metalPriceDto : metalPriceList) {
			applyDeductionForEachMetal(metalPriceDto, tepCofigReponse, priceResponseData);

		}
		// updating final value for above deductions
		priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(priceResponseData.getDeductionAmount()));
	}

	/**
	 * @param metalPriceDto
	 * @param tepCofigReponse
	 * @param priceResponseData
	 */
	private void applyDeductionForEachMetal(MetalPriceDto metalPriceDto, TepConfigurations tepCofigReponse,
			TepPriceResponseDto priceResponseData) {
		BigDecimal totalDeductions = BigDecimal.ZERO;
		BigDecimal currentDeductions = BigDecimal.ZERO;
		BigDecimal finalValue = metalPriceDto.getMetalValue();
		if (metalPriceDto.getMetalTypeCode().equals(MetalTypeCodeEnum.J.toString())) {
			// deductionValue= deduction/100 * finalvalue
			currentDeductions = currentDeductions.add(tepCofigReponse.getItemLevelConfig().getGoldDeductionPercent()
					.divide(BigDecimal.valueOf(100), EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
					.multiply(finalValue));
			totalDeductions = totalDeductions.add(currentDeductions);
			
		}
		if (metalPriceDto.getMetalTypeCode().equals(MetalTypeCodeEnum.L.toString())) {
			currentDeductions = tepCofigReponse.getItemLevelConfig().getPlatinumDeductionPercent()
					.divide(BigDecimal.valueOf(100), EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
					.multiply(finalValue);
			totalDeductions = totalDeductions.add(currentDeductions);
		}
		if (metalPriceDto.getMetalTypeCode().equals(MetalTypeCodeEnum.P.toString())) {
			currentDeductions = tepCofigReponse.getItemLevelConfig().getSilverDeductionPercent()
					.divide(BigDecimal.valueOf(100), EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
					.multiply(finalValue);
			totalDeductions = totalDeductions.add(currentDeductions);
		}
		priceResponseData.setDeductionAmount(priceResponseData.getDeductionAmount().add(totalDeductions).setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
		

	}

	@Override
	public void applyUCPCFADeductions(TepConfigurations tepCofigReponse, TepPriceResponseDto priceResponseData) {
		BigDecimal finalValue = priceResponseData.getFinalValue();
		BigDecimal deductionValue;
		// apply ucp deductions
		// either oone will be there
		if (tepCofigReponse.getItemLevelConfig().getUcpDeductionFlatValue() != null
				&& tepCofigReponse.getItemLevelConfig().getUcpDeductionFlatValue().compareTo(BigDecimal.ZERO) >= 0) {
			finalValue = finalValue.subtract(tepCofigReponse.getItemLevelConfig().getUcpDeductionFlatValue());
			priceResponseData.setDeductionAmount(priceResponseData.getDeductionAmount()
					.add(tepCofigReponse.getItemLevelConfig().getUcpDeductionFlatValue()));
		} else if (tepCofigReponse.getItemLevelConfig().getUcpDeductionPercent() != null
				&& tepCofigReponse.getItemLevelConfig().getUcpDeductionPercent().compareTo(BigDecimal.ZERO) >= 0) {
			deductionValue = finalValue.multiply(tepCofigReponse.getItemLevelConfig().getUcpDeductionPercent())
					.divide(new BigDecimal(100));
			priceResponseData.setDeductionAmount(priceResponseData.getDeductionAmount().add(deductionValue));
			
			finalValue = finalValue.subtract(deductionValue);
		}
		if(priceResponseData.getCustomerType()!=null && !priceResponseData.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name())) {
			priceResponseData.setFinalValue(finalValue);

		}
		else if(priceResponseData.getCustomerType()==null) {
			priceResponseData.setFinalValue(finalValue);
		}
			}

	@Override
	public void applyItemLevelExceptionPercentage(TepConfigurations tepConfig, TepPriceResponseDto priceResponseData) {
		// if tep exception percnt. of item
		BigDecimal deductionAmount;
		BigDecimal oldDeduction = priceResponseData.getDeductionAmount();
		if (priceResponseData.getTepExceptionDetails() != null) {
			TepExceptionDetailsDto tepExceptionDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(priceResponseData.getTepExceptionDetails().getData(), TepExceptionDetailsDto.class);
			if (tepExceptionDetails.getDeductionPercent() != null
					&& (tepExceptionDetails.getDeductionPercent().compareTo(BigDecimal.ZERO) > 0)) {
				deductionAmount = priceResponseData.getFinalValue().multiply(tepExceptionDetails.getDeductionPercent())
						.divide(new BigDecimal(100), EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
				BigDecimal deductedAmount = oldDeduction.add(deductionAmount).setScale(EngineConstants.VALUE_SCALE,
						RoundingMode.HALF_UP);
				priceResponseData.setDeductionAmount(deductedAmount);
				priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(deductionAmount));
			}
		}

//		if (tepConfig.getItemLevelConfig().getTepOfferDetails() != null) {
//			TepExceptionDetails tepExceptionDetails = MapperUtil.getObjectMapperInstance().convertValue(
//					tepConfig.getItemLevelConfig().getTepOfferDetails().getOfferDetails().getData(),
//					TepExceptionDetails.class);
//			// if percentage is available
//			if (tepExceptionDetails.getDeductionPercent() != null
//					&& (tepExceptionDetails.getDeductionPercent().compareTo(BigDecimal.ZERO) > 0)) {
//				deductionAmount = priceResponseData.getFinalValue().multiply(tepExceptionDetails.getDeductionPercent())
//						.divide(new BigDecimal(100), EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
//				BigDecimal deductedAmount = oldDeduction.add(deductionAmount).setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
//				priceResponseData.setDeductionAmount(deductedAmount);
//				priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(deductedAmount));
//			}
//		}
	}

	@Override
	public TepPriceResponseDto studdedVCalculation(TepPriceResponseDto priceResponseData, ItemDao itemDto,
			BigDecimal measuredWeight, Short measuredQuantity, String locationCode,
			Map<String, StandardPriceResponseDto> standardPrice) {

		BigDecimal materialPrice = getMaterialPrice(standardPrice, priceResponseData.getItemTypeCode());
		BigDecimal offset = getOffset(priceResponseData.getItemTypeCode(), itemDto.getPurity(), itemDto.getKarat());
		BigDecimal price = materialPrice.multiply(offset);

		return getMetalVJsonData(price, priceResponseData, itemDto.getPurity(), itemDto.getKarat(), locationCode);

	}

	@Override
	public void setStoneDetails(TepPriceRequest tepRequest, TepPriceResponseDto priceResponseData,
			TepConfigurations tepCofig) {
		List<ItemLotStoneDto> lotStoneDetails;
		// no details in cm for stone details
		// move to integration and do eposs call
		// so pick it from eposs only.
		Map<String, ItemLotStoneDto> stoneMapResponse = new HashMap<>();

		ItemLotStoneListDto stoneList = tepCofig.getStoneList();
		if (stoneList == null) {
			throw new ServiceException("no stones available", "ERR-ENG-017");
		}

		// 2ct 20 --10k
		// 10 stones ..
		for (ItemLotStoneBaseDto result : stoneList.getLotStoneDetails()) {
			ItemLotStoneDto lotStone = new ItemLotStoneDto();
			lotStone.setCurrencyCode(result.getCurrencyCode());
			lotStone.setDeductionValue(BigDecimal.ZERO);
			lotStone.setFinalStoneValue(BigDecimal.ZERO);
			lotStone.setMeasuredNoOfStones(result.getNoOfStones());
			lotStone.setNoOfStones(result.getNoOfStones());
			lotStone.setRatePerCarat(result.getRatePerCarat());
			// set default of measerd value to std.
			lotStone.setMeasuredValue(result.getRatePerCarat().multiply(result.getStoneWeight()));
			lotStone.setStdValue(result.getRatePerCarat().multiply(result.getStoneWeight()).setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
			lotStone.setStoneCode(result.getStoneCode());
			lotStone.setStoneWeight(result.getStoneWeight());
			lotStone.setWeightUnit(result.getWeightUnit());
			lotStone.setStoneTypeCode(result.getStoneTypeCode());
			lotStone.setStoneQuality(result.getStoneQuality());
			lotStone.setTotalStoneWeight(result.getStoneWeight());
			lotStone.setStoneDeductionPercentage(BigDecimal.ZERO);
			stoneMapResponse.put(result.getStoneCode(), lotStone);
		}
		// if input is passed for no. of stones
		if (tepRequest.getStones() != null) {

			for (BaseStoneDetails inputStone : tepRequest.getStones()) {
				ItemLotStoneDto lotStone = stoneMapResponse.get(inputStone.getStoneCode());
				if(lotStone!=null) {
				if (inputStone.getMeasuredNoOfStones() > lotStone.getNoOfStones()) {
					throw new ServiceException("no. of stones can't be greater than available stones", "ERR-ENG-020");
				}
				lotStone.setMeasuredNoOfStones(inputStone.getMeasuredNoOfStones());
				if (inputStone.getMeasuredStoneWeight() != null) {

					// check tollerance for stone weight in future if asked for
					lotStone.setStoneWeight(inputStone.getMeasuredStoneWeight());
				}
				lotStone.setMeasuredValue(lotStone.getRatePerCarat()
						.multiply(lotStone.getStoneWeight())
						.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
//				lotStone.setMeasuredValue(lotStone
//						.getStdValue().divide(BigDecimal.valueOf(lotStone.getNoOfStones()),
//								EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
//						.multiply(BigDecimal.valueOf(lotStone.getMeasuredNoOfStones())).setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
				}
			}
		}
		// creating new list for number of stones updated.
		lotStoneDetails = new ArrayList<>(stoneMapResponse.values());
		priceResponseData.setStones(lotStoneDetails);
		
	}

	@Override
	public void setUCPCMValue(CashMemoDetailsDao cashMemo, TepPriceResponseDto priceResponseData,
			TepConfigurations tepConfig) {

		if (cashMemo != null && tepConfig.getItemLevelConfig().getTypeOfExchange().equals("invoice")) {
			priceResponseData.setFinalValue(cashMemo.getFinalValue());
			priceResponseData.setIsUCPCMValue(true);
			priceResponseData.setNetWeight(BigDecimal.ZERO);
			// deductions need to be applied on this.
		}

	}

	@Override
	// used only in non ucp
	public void setCMData(CashMemoDetailsDao cashMemo, TepPriceResponseDto priceResponseData) {
		if (cashMemo != null) {
			priceResponseData.setIscashMemoAvailable(true);
			priceResponseData.setCmDocNo(cashMemo.getCashMemoDao().getSalesTxnDao().getDocNo());
			priceResponseData.setCmFiscalYear(cashMemo.getCashMemoDao().getSalesTxnDao().getFiscalYear());
			priceResponseData.setCmLocationCode(cashMemo.getCashMemoDao().getSalesTxnDao().getLocationCode());
			getCMPriceResponse(cashMemo, priceResponseData);
		}

	}

	private PriceDetailsDto getCMPriceResponse(CashMemoDetailsDao cashMemo, TepPriceResponseDto priceResponseData) {
		PriceDetailsDto priceResponse = new PriceDetailsDto();
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(cashMemo.getPriceDetails());

			priceResponse = MapperUtil.getObjectMapperInstance().convertValue(root, PriceDetailsDto.class);
			if (priceResponse.getMetalPriceDetails() != null) {
				priceResponseData.setMetalPriceDetails(priceResponse.getMetalPriceDetails());
			}
			if (priceResponse.getStonePriceDetails() != null) {
				priceResponseData.setStonePriceDetails(priceResponse.getStonePriceDetails());
			}
			if (priceResponse.getMaterialDetails() != null) {
				priceResponseData.setMaterialDetails(priceResponse.getMaterialDetails());
			}
			if ( priceResponseData.getLotNumber() == null
                    && "Null".equalsIgnoreCase( cashMemo.getLotNumber())) {
				priceResponseData.setLotNumber(null);	
				}
		
			else {
				priceResponseData.setLotNumber(cashMemo.getLotNumber());
			}
		
			priceResponseData.setBilledWeight(cashMemo.getTotalWeight());
			// lot number for gold coins with qty 
			if(cashMemo.getItemDetails() !=null && cashMemo.getLotNumber()==null && SalesConstants.COIN_PRODUCT_GROUP_CODE
					.equals(cashMemo.getProductGroupCode()) ) {
				
				
				
				try {
								
				
					JsonNode roots = mapper.readTree(cashMemo.getItemDetails());
					JsonNode dataNode = roots.path("data");
					for(JsonNode data : dataNode) {
						String lotNumber = data.path("lotNumber").textValue();
						priceResponseData.setLotNumber(lotNumber);
						break;
					}
					
				
					
		
				} catch (IOException e) {
					throw new ServiceException("Error while parsing", ERR_CORE_003);
				}
				
				
				
			}
			return priceResponse;
		} catch (IOException e) {
			throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR-CORE-003");
		}
	}

	@Override
	public TepPriceResponseDto applyStoneDeductions(TepPriceResponseDto priceResponseData, ItemDao itemDto,
			TepPriceRequest tepRequest, TepConfigurations tepConfig,
			Map<String, StandardPriceResponseDto> standardPrice) {

		// tep request has stones if got updated from user from ui
		// tepConfig.getStones will have stones took from EPOSS (with std values)
		// tepConfig
		setStoneDetails(tepRequest, priceResponseData, tepConfig);

		applyStoneLevelDeductions(priceResponseData, tepConfig);
		return priceResponseData;
	}

	/**
	 * @param priceResponseData
	 * @param tepConfig
	 */
	private void applyStoneLevelDeductions(TepPriceResponseDto priceResponseData, TepConfigurations tepConfig) {
		if (tepConfig.getStoneLeveLConfig() == null) {
			throw new ServiceException("no  configurations found", "ERR-ENG-021");
		}
		if (tepConfig.getStoneLeveLConfig().getResults() == null) {
			throw new ServiceException("no  configurations found", "ERR-ENG-021");
		}
		for (ItemLotStoneDto itemLotStoneDto : priceResponseData.getStones()) {
			BigDecimal finalStoneValue;
			BigDecimal deductionValue = BigDecimal.ZERO;
			// get the single stone value..
			BigDecimal deductionPercent = BigDecimal.ONE;
			for (TepStoneResponseDto stoneConfig : tepConfig.getStoneLeveLConfig().getResults()) {
				if (stoneConfig.getStoneQuality().equals(itemLotStoneDto.getStoneQuality())
						&& stoneConfig.getStoneTypeCode().equals(itemLotStoneDto.getStoneTypeCode())) {
					deductionPercent = stoneConfig.getDeductionPercent();
				}
			}
			if (BigDecimal.ZERO.compareTo(deductionPercent) < 0) {
				deductionValue = itemLotStoneDto.getMeasuredValue()
						.divide(BigDecimal.valueOf(100), EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
						.multiply(deductionPercent);
			}
			finalStoneValue = itemLotStoneDto.getMeasuredValue().subtract(deductionValue);
			itemLotStoneDto.setDeductionValue(deductionValue.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
			itemLotStoneDto.setFinalStoneValue(finalStoneValue.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
			itemLotStoneDto.setStoneDeductionPercentage(deductionPercent.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
		}

	}

	@Override
	public void applyPjwsStoneDeductions(TepConfigurations tepConfig, TepPriceResponseDto priceResponseData) {
		// if tep exception percnt. of item
		BigDecimal deductionAmount=BigDecimal.ZERO;
		BigDecimal deductionPercent;
		BigDecimal stoneValue=BigDecimal.ZERO;
		
		if(priceResponseData.getStonePriceDetails().getPreDiscountValue()!=null)
			 stoneValue = priceResponseData.getStonePriceDetails().getPreDiscountValue();

		if (tepConfig.getItemLevelConfig() != null && BooleanUtils.isTrue(tepConfig.getItemLevelConfig().getIsStoneChargesApplicable())) {

			deductionPercent = tepConfig.getItemLevelConfig().getStoneDeductionPercent();

			deductionAmount = stoneValue.multiply(deductionPercent).divide(new BigDecimal(100),
					EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);

			priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(deductionAmount).setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
			priceResponseData.setDeductionAmount(priceResponseData.getDeductionAmount().add(deductionAmount).setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
			priceResponseData.getStonePriceDetails().setPreDiscountValue(stoneValue);
		}


	}

	@Override
	public TepPriceResponseDto pjwsF1Calculation(ItemDao itemDto, TepPriceResponseDto priceResponseData,
			String locationCode, CashMemoDetailsDao cashMemo, TepConfigurations tepConfig) {

		BigDecimal stoneValue = BigDecimal.ZERO;

		if (tepConfig.getItemLevelConfig() != null && BooleanUtils.isTrue(tepConfig.getItemLevelConfig().getIsStoneChargesApplicable())) {
		if (priceResponseData.getStonePriceDetails().getPreDiscountValue() == null) {
			stoneValue = itemDto.getStoneCharges();
		} else {

			if (priceResponseData.getStonePriceDetails().getPreDiscountValue() == null) {
				priceResponseData.getStonePriceDetails().setPreDiscountValue(BigDecimal.ZERO);
			}
			stoneValue = priceResponseData.getStonePriceDetails().getPreDiscountValue();

		}

		
		}
		priceResponseData.getStonePriceDetails().setPreDiscountValue(stoneValue);
		return priceResponseData;
	}

	@Override
	public void applyRefundDeductions(TepConfigurations tepConfig, TepPriceResponseDto priceResponseData) {
		boolean isTepFlatExchange = false;
		if (priceResponseData.getTepExceptionDetails() != null) {
			TepExceptionDetailsDto tepExceptionDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(priceResponseData.getTepExceptionDetails().getData(), TepExceptionDetailsDto.class);
			if (tepExceptionDetails.getFlatExchangeValue() != null
					&& (tepExceptionDetails.getFlatExchangeValue().compareTo(BigDecimal.ZERO) > 0)) {
				isTepFlatExchange = true;
			}
		}
		if (!isTepFlatExchange) {
			BigDecimal refundPercent = tepConfig.getItemLevelConfig().getRefundDeductionPercent();
			// refund value = (final value - deduction value) + refund percent
			BigDecimal refundValue = priceResponseData.getFinalValue().multiply(refundPercent)
					.divide(new BigDecimal(100), EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			priceResponseData.setRefundDeductionAmount(refundValue);
			priceResponseData.setRefundDeductionPercent(refundPercent);
			log.debug("refund percent {}", refundPercent);
			log.debug("refund amount {}", refundValue);
		}
		else {
			BigDecimal refundPercent = BigDecimal.ZERO;
			// refund value = (final value - deduction value) + refund percent
			BigDecimal refundValue = BigDecimal.ZERO;
			priceResponseData.setRefundDeductionAmount(refundValue);
			priceResponseData.setRefundDeductionPercent(refundPercent);
			log.debug("refund percent {}", refundPercent);
			log.debug("refund amount {}", refundValue);
		}
		}
	

	
	
	private String getPriceGroup(String locationCode, String pricingGroupType) {
		List<LocationPriceGroupMappingDao> locationPriceGroupMapping = locationPriceGroupMappingRepository
				.findByLocationCodeAndPricingGroupType(locationCode, pricingGroupType);
		if (locationPriceGroupMapping == null || locationPriceGroupMapping.isEmpty()) {
			throw new ServiceException("No location Mapping found for requested pricing group type", "ERR-INV-052");
		}
		return locationPriceGroupMapping.get(0).getPriceGroup();
	}
	
	/**
	 * @param sumOfVandF1
	 * @param productGroupCode
	 * @param numberOfStones
	 * @return
	 */
	private BigDecimal getCfaLevelMakingChargePercentage(BigDecimal sumOfVandF1, String productGroupCode, Integer numberOfStones) {
		
		log.info("V + F1: {}, product group: {}, number of stones: {}", sumOfVandF1, productGroupCode, numberOfStones);
		if(numberOfStones>0) {
			List<ProductPriceMappingDao> productpriceDaolist = productPriceMapping.findByCombination(sumOfVandF1, productGroupCode,
					numberOfStones);

			
			if(CollectionUtil.isEmpty(productpriceDaolist) || (productpriceDaolist.size()  == 1 && productpriceDaolist.get(0).getMargin() == null)) {	
				throw new ServiceException(
					"Price configurations not found for the product group, please contact Commercial Team.",
					"ERR-ENG-028", "Product group code: " + productGroupCode);
			}else if(productpriceDaolist.size() > 1) {
				throw new ServiceException("Multiple price configurations found for the product group, please contact Commercial Team.",
						"ERR-ENG-031","Product group code: " + productGroupCode);
			}
			
			ProductPriceMappingDao productpriceDao = productpriceDaolist.get(0);
			//need to return percentage 
			return productpriceDao.getMargin().multiply(new BigDecimal(100)).divide(new BigDecimal(100).subtract(productpriceDao.getMargin()),EngineConstants.PERCENT_SCALE, RoundingMode.HALF_UP);
		}
		
		else {
			return new BigDecimal(0);
		}
	}
	
	/**
	 * @param cfaLevelMkingCharge
	 * @param  
	 * @param productGroupCode
	 * @param numberOfStones
	 * @return
	 */
	private BigDecimal getSkuLevelMakingChargePercentage(BigDecimal cfaLevelMkingChargePercentage, BigDecimal priceFactor ) {
		return cfaLevelMkingChargePercentage.multiply(priceFactor);
	}
	
	/**
	 * @param priceResponseData
	 * @return
	 */
	private BigDecimal getMarketLevelMakingChargePercentage(BigDecimal skuLevelMkingChargePercentage, String locationCode,
			String metalTypeCode) {
		BigDecimal marketMakingChargesPercentage;
		BigDecimal marketMaterialFactor = getMarketMarkupFactor(locationCode, metalTypeCode);
		
		marketMakingChargesPercentage =skuLevelMkingChargePercentage.multiply(marketMaterialFactor);

	
		return marketMakingChargesPercentage;
	}
	
	public BigDecimal getMarketMarkupFactor(String locationCode, String metalTypeCode) {
		LocationDao location = locationRepository.findOneByLocationCodeAndIsActive(locationCode, true);

		if (location == null) {
			throw new ServiceException("Either passed location is improper or is in inactive status", ERR_INV_034);
		}

		String marketCode = location.getMarket().getMarketCode();
		MarketDao market = marketRepo.findByMarketCodeAndIsActive(marketCode, true);
		if (market == null) {
			throw new ServiceException("Either passed market is improper or is in inactive status", ERR_INV_034);
		}

		MarketMarkupMappingDao marketMaterial = marketMarkupMapping.findByMarketAndMetalTypeCode(market,
				metalTypeCode);

		if (marketMaterial == null) {
			throw new ServiceException("No Mapping found for F1/F2 Offset", ERR_INV_034);
		}
		return marketMaterial.getMarkupFactor();
	}

	@Override
	public void applyPjwsCMDeduction(TepConfigurations tepConfig, TepPriceResponseDto priceResponseData) {
		BigDecimal cmDeductionCharegs=BigDecimal.ZERO;
		if (tepConfig.getItemLevelConfig().getIsCMMandatory() && (!priceResponseData.getIscashMemoAvailable())) {
			// apply cm mandatory deduction

			BigDecimal cmDeductionPer = tepConfig.getItemLevelConfig().getCmUnavailableDeductionPercent();
			cmDeductionCharegs = priceResponseData.getFinalValue().multiply(cmDeductionPer)
					.divide(new BigDecimal(100), EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			if (cmDeductionCharegs.compareTo(priceResponseData.getStonePriceDetails().getPreDiscountValue()) >= 1) {
				cmDeductionCharegs=priceResponseData.getStonePriceDetails().getPreDiscountValue();
			} 
			priceResponseData.setDeductionAmount(priceResponseData.getDeductionAmount().add(cmDeductionCharegs));
			priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(cmDeductionCharegs));
			priceResponseData.setCmUnavailableDeductionAmount(cmDeductionCharegs);
		}
	}

	@Override
	public void multiMetalVCalculation(String locationCode, ItemDao itemDto,BigDecimal measuredWeight, Short measuredQuantity, TepPriceResponseDto priceResponseData,
			Map<String, StandardPriceResponseDto> standardPrice,CashMemoDetailsDao cashMemo,TepConfigurations tepCofig) {
		Map<String, BigDecimal> materialMap = null;
		BigDecimal measuredStdWeight;
		if (measuredWeight != null && cashMemo.getTotalWeight().compareTo(measuredWeight)!=0) {
//			checkTEPTolerance(itemDto.getStdWeight(), measuredWeight.divide(BigDecimal.valueOf(measuredQuantity),
//					EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP),tepCofig,priceResponseData.getIscashMemoAvailable(),priceResponseData.getBilledWeight());
			String weightDetails = WeightUtil.calculateWeightDetails(itemDto.getStdWeight(),
					cashMemo.getMeasuredWeightDetails(), measuredWeight);
			// take updated metal values only
			measuredStdWeight = getMultiMetalNetWeight(weightDetails);
			materialMap = getUpdatedMaterialMap(weightDetails);

		} else {
			materialMap = getUpdatedMaterialMap(cashMemo.getInventoryWeightDetails());
			measuredStdWeight = getMultiMetalNetWeight(cashMemo.getMeasuredWeightDetails());
			// netWeight will be stdWeight-otherMaterialWeight
		}

//		BigDecimal materialWeight = materialMap.get(EngineConstants.MATERIAL_WEIGHT);
//		priceResponseData.getMaterialDetails().setMaterialWeight(materialWeight);
//		priceResponseData.setNetWeight(measuredStdWeight);

	 getMultiMetalVJsonData(materialMap, locationCode, itemDto, priceResponseData,
				standardPrice);
		
	}
	
	
	public TepPriceResponseDto getMultiMetalVJsonData(Map<String, BigDecimal> weightDetailsMap, String locationCode,
			ItemDao itemDto, TepPriceResponseDto priceResponseData, Map<String, StandardPriceResponseDto> standarPrice) {
		BigDecimal sumV = BigDecimal.ZERO;

		List<MetalPriceDto> data = new ArrayList<>();
		for (Entry<String, BigDecimal> materialMap : weightDetailsMap.entrySet()) {
			if ((materialMap.getValue().compareTo(BigDecimal.ZERO) != 0)
					&& MetalTypeCodeEnum.getUniqueMetals().contains(materialMap.getKey())) {
				BigDecimal materialPrice = getMaterialPrice(standarPrice, materialMap.getKey());
				BigDecimal offset = getOffset(materialMap.getKey(), itemDto.getPurity(), itemDto.getKarat());
				MetalPriceDto pd = getPd(locationCode, materialMap.getKey(), materialMap.getValue(), offset,
						materialPrice, itemDto.getPurity(), itemDto.getKarat());
				data.add(pd);
			}
		}

		for (MetalPriceDto priceData : data) {
			sumV = sumV.add(priceData.getMetalValue());
		}

		priceResponseData.getMetalPriceDetails().setPreDiscountValue(sumV);
		priceResponseData.getMetalPriceDetails().setMetalPrices(data);
//		BigDecimal stoneWeight1 = weightDetailsMap.get(EngineConstants.STONE_WEIGHT);
//		BigDecimal diamondWeight1 = weightDetailsMap.get(EngineConstants.DIAMOND_WEIGHT);
//		BigDecimal totalStoneWeight = stoneWeight1.add(diamondWeight1);
//		// setting the response by converting into carat
//		priceResponseData.getStonePriceDetails()
//				.setStoneWeight(totalStoneWeight.multiply(new BigDecimal(5)));
//		priceResponseData.getStonePriceDetails().setWeightUnit(EngineConstants.CARAT);
//
//		// setting stone weight and unit for view purpose
//		priceResponseData.getStonePriceDetails().setStoneWeightForView(totalStoneWeight);
//		priceResponseData.getStonePriceDetails().setWeightUnitForView(itemDto.getWeightUnit());

		return priceResponseData;
	}
	
	private MetalPriceDto getPd(String locationCode, String metalTypeCode, BigDecimal metalWeight, BigDecimal offset,
			BigDecimal materialPrice, BigDecimal purity, BigDecimal karat) {
		MetalPriceDto pd = new MetalPriceDto();

		setType(metalTypeCode, pd);
		pd.setPurity(purity);
		pd.setKarat(karat);
		pd.setWeightUnit(locationService.getCountryDetails(locationCode).getWeightUnit());
		pd.setNetWeight(metalWeight);
		BigDecimal metalRate = materialPrice.multiply(offset).setScale(EngineConstants.VALUE_SCALE,
				RoundingMode.HALF_UP);
		pd.setRatePerUnit(metalRate);
		pd.setMetalValue(metalRate.multiply(metalWeight).setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
		pd.setMetalTypeCode(metalTypeCode);
		return pd;
	}
	
	/**
	 * @param weightDetails
	 * @return
	 */
	private BigDecimal getMultiMetalNetWeight(String weightDetails) {

		BigDecimal updatedNetWeight = BigDecimal.ZERO;
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(weightDetails);
			JsonNode dataNode = root.path("data");

			if (!dataNode.isMissingNode()) {
				if (dataNode.hasNonNull(EngineConstants.GOLD_WEIGHT))
					updatedNetWeight = updatedNetWeight
							.add(new BigDecimal(dataNode.path(EngineConstants.GOLD_WEIGHT).asText()));
				if (dataNode.hasNonNull(EngineConstants.SILVER_WEIGHT))
					updatedNetWeight = updatedNetWeight
							.add(new BigDecimal(dataNode.path(EngineConstants.SILVER_WEIGHT).asText()));
				if (dataNode.hasNonNull(EngineConstants.PLATINUM_WEIGHT))
					updatedNetWeight = updatedNetWeight
							.add(new BigDecimal(dataNode.path(EngineConstants.PLATINUM_WEIGHT).asText()));
			}
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		// sum of gold platinum silver updated weight
		return updatedNetWeight;
	}

	private Map<String, BigDecimal> getUpdatedMaterialMap(String weightDetails) {
		Map<String, BigDecimal> materialMap = new HashMap<>();
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(weightDetails);
			JsonNode dataNode = root.path("data");

			if (!dataNode.isMissingNode()) {
				if (dataNode.hasNonNull(EngineConstants.GOLD_WEIGHT))
					materialMap.put(MetalTypeCodeEnum.J.toString(),
							new BigDecimal(dataNode.path(EngineConstants.GOLD_WEIGHT).asText()));
				if (dataNode.hasNonNull(EngineConstants.SILVER_WEIGHT))
					materialMap.put(MetalTypeCodeEnum.P.toString(),
							new BigDecimal(dataNode.path(EngineConstants.SILVER_WEIGHT).asText()));
				if (dataNode.hasNonNull(EngineConstants.PLATINUM_WEIGHT))
					materialMap.put(MetalTypeCodeEnum.L.toString(),
							new BigDecimal(dataNode.path(EngineConstants.PLATINUM_WEIGHT).asText()));
				if (dataNode.hasNonNull(EngineConstants.MATERIAL_WEIGHT))
					materialMap.put(EngineConstants.MATERIAL_WEIGHT,
							new BigDecimal(dataNode.path(EngineConstants.MATERIAL_WEIGHT).asText()));
				if (dataNode.hasNonNull(EngineConstants.STONE_WEIGHT))
					materialMap.put(EngineConstants.STONE_WEIGHT,
							new BigDecimal(dataNode.path(EngineConstants.STONE_WEIGHT).asText()));
				else
					materialMap.put(EngineConstants.STONE_WEIGHT,
							BigDecimal.ZERO);
				if (dataNode.hasNonNull(EngineConstants.DIAMOND_WEIGHT))
					materialMap.put(EngineConstants.DIAMOND_WEIGHT,
							new BigDecimal(dataNode.path(EngineConstants.DIAMOND_WEIGHT).asText()));
				else 
					materialMap.put(EngineConstants.DIAMOND_WEIGHT,
							 BigDecimal.ZERO);
			}
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}

		return materialMap;
	}

	@Override
	public void applyUCPDiscountRecovery(TepPriceResponseDto priceResponseData, TepConfigurations tepConfig,
			TepPriceRequest tepRequest) {
		CashMemoDetailsDao cashMemoDetails = cashMemoDetailsRepository.findOneById(tepRequest.getCashMemoDetailsId());
		BigDecimal totaldiscountValue = BigDecimal.ZERO;
		BigDecimal totalDiscount = BigDecimal.ZERO;
		BigDecimal discountPercentage = tepConfig.getItemLevelConfig().getRecoverDiscountPercent();
		if ("Current Exchange".equals(tepConfig.getItemLevelConfig().getTypeOfExchange())
				&& Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable())
				&& StringUtils.isEmpty(tepRequest.getCashMemoDetailsId())) {

			List<DiscountItemDetailsDao> discountDetails = discountItemDetailRepo
					.findAllByItemId(tepRequest.getCashMemoDetailsId());

			if (discountDetails != null && !discountDetails.isEmpty()) {
				ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
				discountDetails.forEach(dd -> {
					try {
						DiscountDao discountMasterDao = discountRepoExt.findOneByDiscountCode(dd.getDiscountDetail().getDiscountCode());
						JsonNode masterRoot = null;
						JsonNode masterDataNode = null;
						if (discountMasterDao != null) {
							masterRoot = mapper.readTree(discountMasterDao.getBasicCriteria());
							masterDataNode = masterRoot.path("data");
						}

						JsonNode root = mapper
								.readTree(dd.getDiscountDetail().getDiscountConfig().getBasicCriteriaDetails());
						JsonNode dataNode = root.path("data");
//						if (dataNode != null && Boolean.TRUE.equals(dataNode.get("isTepRecovery").asBoolean())) {
//							totalDiscount.add(dd.getDiscountValue());
//						} else if (masterDataNode != null
//								&& Boolean.TRUE.equals(masterDataNode.get("isTepRecovery").asBoolean())) {
//							totalDiscount.add(dd.getDiscountValue());
//						}
						if (masterDataNode != null
								&& Boolean.TRUE.equals(masterDataNode.get("isTepRecovery").asBoolean())) {
							totalDiscount.add(dd.getDiscountValue());
						}
					} catch (IOException e) {
						throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
					}
				});
			}
			totaldiscountValue = totalDiscount;

			BigDecimal discountRecovered = totaldiscountValue.multiply(discountPercentage).divide(new BigDecimal(100),
					EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			if(priceResponseData.getStonePriceDetails().getPreDiscountValue().compareTo(BigDecimal.ZERO)>0) {
			priceResponseData.setDiscountRecovered(discountRecovered);
			if(tepRequest.getCustomerType()!=null && tepRequest.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name())) {
				priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(discountRecovered));
			}
			
			}
		}
		if (BooleanUtils.isTrue(priceResponseData.getIscashMemoAvailable())
				&& !StringUtils.isEmpty(tepRequest.getCashMemoDetailsId())) {
			// discount recovery for legacy cm
			if (cashMemoDetails.getLegacyTepDiscountRecovered()) {
				if (cashMemoDetails.getTotalDiscount().compareTo(BigDecimal.ZERO) >= 0
						&& cashMemoDetails.getTotalDiscount() != null) {
					totaldiscountValue = cashMemoDetails.getTotalDiscount();
					discountPercentage = new BigDecimal(100);
					priceResponseData.setDiscountRecovered(totaldiscountValue);
					if(tepRequest.getCustomerType()!=null &&tepRequest.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name())) {
						priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(totaldiscountValue));
					}
					

				}

			}
		}
	}
	


	@Override
	public void applyPjwsAndStuddedDiscountRecovery(TepPriceResponseDto priceResponseData, TepConfigurations tepConfig,
			TepPriceRequest tepRequest, CashMemoDetailsDao cashMemo) {
		BigDecimal totalDiscount = BigDecimal.ZERO;
		BigDecimal proportionate = BigDecimal.ZERO;
		BigDecimal metalValue = priceResponseData.getMetalPriceDetails().getPreDiscountValue();
		BigDecimal stoneValue = priceResponseData.getStonePriceDetails().getPreDiscountValue();
		BigDecimal makingCharge = priceResponseData.getMakingChargeDetails().getPreDiscountValue();
		BigDecimal totalValue = metalValue.add(stoneValue).add(makingCharge);
		BigDecimal metalValuePercentage = metalValue.multiply(new BigDecimal(100)).divide(totalValue,
				EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
		BigDecimal stoneValuePercentage = stoneValue.multiply(new BigDecimal(100)).divide(totalValue,
				EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
		BigDecimal makingChargesPercentage = makingCharge.multiply(new BigDecimal(100)).divide(totalValue,
				EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
		proportionate = metalValuePercentage.add(stoneValuePercentage);
		BigDecimal finalValue = priceResponseData.getFinalValue().setScale(EngineConstants.VALUE_SCALE,
				RoundingMode.HALF_UP);
		if ("Current Exchange".equals(tepConfig.getItemLevelConfig().getTypeOfExchange())
				&& BooleanUtils.isTrue(priceResponseData.getIscashMemoAvailable())
				&& !StringUtils.isEmpty(tepRequest.getCashMemoDetailsId())) {
			Date businessDate = salesService.getBusinessDay(CommonUtil.getStoreCode()).getBusinessDate();
			List<DiscountItemDetailsDao> discountDetails = discountItemDetailRepo
					.findAllByItemId(tepRequest.getCashMemoDetailsId());
			if (discountDetails != null && !discountDetails.isEmpty()) {
				ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
				for (DiscountItemDetailsDao dd : discountDetails) {
					try {

						JsonNode masterRoot = null;
						JsonNode masterDataNode = null;
						JsonNode rootTEPDetails = null;
						TepConfigDetails tepData = null;
						Boolean isTepRecovery = false;
						JsonNode root = mapper
								.readTree(dd.getDiscountDetail().getDiscountConfig().getBasicCriteriaDetails());
						JsonNode dataNode = root.path("data");
						DiscountDao discountMasterDao = discountRepoExt
								.findOneByDiscountCode(dd.getDiscountDetail().getDiscountCode());
						if (discountMasterDao != null) {
							masterRoot = mapper.readTree(discountMasterDao.getBasicCriteria());
							masterDataNode = masterRoot.path("data");
						}

//						if (!dataNode.isNull() && BooleanUtils.isTrue(dataNode.get("isTepRecovery").asBoolean())) {
//							isTepRecovery = true;
//							rootTEPDetails = mapper
//									.readTree(dd.getDiscountDetail().getDiscountConfig().getTepConfigDetails());
//							tepData = mapper.treeToValue(rootTEPDetails.path("data"), TepConfigDetails.class);
//						} else if (!masterDataNode.isNull()
//								&& BooleanUtils.isTrue(masterDataNode.get("isTepRecovery").asBoolean())) {
//							isTepRecovery = true;
//							rootTEPDetails = mapper.readTree(discountMasterDao.getTepDetails());
//							tepData = mapper.treeToValue(rootTEPDetails.path("data"), TepConfigDetails.class);
//						}
						
						if (!masterDataNode.isNull()
								&& BooleanUtils.isTrue(masterDataNode.get("isTepRecovery").asBoolean())) {
							isTepRecovery = true;
							rootTEPDetails = mapper.readTree(discountMasterDao.getTepDetails());
							tepData = mapper.treeToValue(rootTEPDetails.path("data"), TepConfigDetails.class);
						}

						if (isTepRecovery) {
							// item level discount
//							rootTEPDetails = mapper
//									.readTree(dd.getDiscountDetail().getDiscountConfig().getTepConfigDetails());
//							tepData = mapper.treeToValue(rootTEPDetails.path("data"), TepConfigDetails.class);
							if (!StringUtils.isEmpty(dd.getDiscountValueDetails())) {
								JsonNode rootTepDiscountDetails = mapper.readTree(dd.getDiscountValueDetails());
								DiscountDetailsResponseDto discountValueDetails = mapper.treeToValue(
										rootTepDiscountDetails.path("data"), DiscountDetailsResponseDto.class);
								if (discountValueDetails != null
										&& !CollectionUtil.isEmpty(discountValueDetails.getDiscountValueDetails())) {
									for (DiscountValueDetails dValue : discountValueDetails.getDiscountValueDetails()) {
										if ("UCP".equals(dValue.getComponent())) {
											// BigDecimal
											// totalUCPDiscount=metalValue.multiply(dValue.getDiscountValue()).divide(totalValue,EngineConstants.VALUE_SCALE,
											// RoundingMode.HALF_UP).add(stoneValue.multiply(dValue.getDiscountValue()).divide(totalValue,EngineConstants.VALUE_SCALE,
											// RoundingMode.HALF_UP));
											BigDecimal UCPGoldProposionateValue = dValue.getDiscountValue()
													.multiply(metalValuePercentage).divide(new BigDecimal(100),
															EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
											BigDecimal UCPStoneProposionateValue = dValue.getDiscountValue()
													.multiply(stoneValuePercentage).divide(new BigDecimal(100),
															EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
											BigDecimal totalUCPDiscount = UCPGoldProposionateValue
													.add(UCPStoneProposionateValue);			
											totalDiscount = applyTepDiscount(totalDiscount, tepData, totalUCPDiscount,
													cashMemo,businessDate);
										} else if (!"MAKING_CHARGE".equals(dValue.getComponent())) {
											// non ucp component and non making charges components
											// totalDiscount=totalDiscount.add(dValue.getDiscountValue());
											// if only gold charges are given full discount recovery
											if ("METAL_CHARGE".equals(dValue.getComponent())) {
												totalDiscount = totalDiscount.add(dValue.getDiscountValue());
											}
											// if only stone charges are given full discount recovery
											else if ("STONE_CHARGE".equals(dValue.getComponent())) {
												totalDiscount = totalDiscount.add(dValue.getDiscountValue());
											}
											// totalDiscount=totalDiscount.add(dValue.getDiscountPercent());
										}
									}
								} else {
									// if there are no component breakUp recovery total discount
									totalDiscount = totalDiscount.add(dd.getDiscountValue());
								}
							} else {
								// bill level discount
								if (!masterDataNode.isNull()
										&& BooleanUtils.isTrue(masterDataNode.get("isBillValue").asBoolean())) {
									totalDiscount = applyTepDiscount(totalDiscount, tepData, dd.getDiscountValue(),
											cashMemo, businessDate);
								} else {
									totalDiscount = totalDiscount.add(dd.getDiscountValue());
								}
							}
						}
					} catch (IOException e) {
						throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
					}
				}
			}
			if (priceResponseData.getStonePriceDetails().getPreDiscountValue().compareTo(BigDecimal.ZERO)>0) {
				if (totalDiscount.compareTo(stoneValue) < 0) {
					priceResponseData.setDiscountRecovered(totalDiscount);
					priceResponseData.setFinalValue(finalValue.subtract(totalDiscount));
				} else {
					priceResponseData.setDiscountRecovered(stoneValue);
					priceResponseData.setFinalValue(finalValue.subtract(stoneValue));
				}
			}
	}
		if (BooleanUtils.isTrue(priceResponseData.getIscashMemoAvailable())
				&& !StringUtils.isEmpty(tepRequest.getCashMemoDetailsId())) {
			// discount recovery for legacy cm
			CashMemoDetailsDao cashMemoDetails = cashMemoDetailsRepository
					.findOneById(tepRequest.getCashMemoDetailsId());
			if (cashMemoDetails.getLegacyTepDiscountRecovered()) {
				if (tepRequest.getTepType().equalsIgnoreCase(TepTypeEnum.MANUAL_FULL_VALUE_TEP.name())
						|| tepRequest.getTepType().equalsIgnoreCase(TepTypeEnum.FULL_VALUE_TEP.name())) {
					if (cashMemoDetails.getTotalDiscount().compareTo(BigDecimal.ZERO) >= 0
							&& cashMemoDetails.getTotalDiscount() != null) {
						totalDiscount = cashMemoDetails.getTotalDiscount();
					}
				} else {

					totalDiscount = getDiscountFromLegacy(cashMemoDetails.getId(),proportionate);
					//totalDiscount = calculateProportinatedDiscount(cashMemoDetails.getId(), discount, proportionate);
				}
				if (priceResponseData.getStonePriceDetails().getPreDiscountValue().compareTo(BigDecimal.ZERO)>0) {
				priceResponseData.setDiscountRecovered(totalDiscount);
				priceResponseData.setFinalValue(finalValue.subtract(totalDiscount));
				}
			}

		}
	}

	private BigDecimal applyTepDiscount(BigDecimal totalDiscount, TepConfigDetails tepData, BigDecimal totalUCPDiscount,
			CashMemoDetailsDao cashMemo,Date businessDate) {
		long noOfDates = CalendarUtils.getDayDiff(
				cashMemo.getCashMemoDao().getSalesTxnDao().getDocDate(),
				businessDate);
		if (!CollectionUtil.isEmpty(tepData.getTepDetails())) {
			BigDecimal totalUCPDiscountRecovery = BigDecimal.ZERO;
			for (TepDetails tepCfg : tepData.getTepDetails()) {
				long initialrange = Long
						.parseLong(tepCfg.getDurationInDays().split("-")[0]);
				long endRange = Long
						.parseLong(tepCfg.getDurationInDays().split("-")[1]);
				if (noOfDates >= initialrange && noOfDates <= endRange) {
					totalUCPDiscountRecovery = totalUCPDiscount
							.multiply(tepCfg.getRecoveryPercent())
							.divide(new BigDecimal(100),
									EngineConstants.VALUE_SCALE,
									RoundingMode.HALF_UP);
					totalDiscount = totalDiscount.add(totalUCPDiscountRecovery);
					break;
				}
			}
			// if not in the range noOfDays
		}
		return totalDiscount;
	}
	
	public BigDecimal getDiscountFromLegacy(String cashMemoDetailsId,BigDecimal proportionate) {
		CashMemoDetailsDao cashMemoDetails = cashMemoDetailsRepository.findOneById(cashMemoDetailsId);
		BigDecimal itemLevelDiscount = BigDecimal.ZERO;
		BigDecimal billLevelDiscount = BigDecimal.ZERO;
		BigDecimal totalItemLevelDiscount = BigDecimal.ZERO;
		BigDecimal totalBillLevelDiscount = BigDecimal.ZERO;;
		ObjectMapper mapper = new ObjectMapper();
		if (cashMemoDetails.getCashMemoDao().getLegacyBillLevelDiscount() != null
				&& BooleanUtils.isTrue(cashMemoDetails.getCashMemoDao().getLegacyBillLevelDiscount())) {
			try {
				JsonNode root = mapper.readTree(cashMemoDetails.getLegacyCmDetails());
				//JsonNode dataNode = root.path("data");
				if (!root.isNull()
						&& Boolean.TRUE.equals(root.path("isTEPDiscountRecoveryAllowed").asBoolean())) {
					if (!root.isNull() && !root.path("discount").isNull() && root.path("discount") != null
							&& !root.path("billLevelDiscount").isNull() && root.path("billLevelDiscount") != null)
						// itemLevelDiscount = discount - BillLevelDiscount
						 itemLevelDiscount = root.path("discount").decimalValue()
								.subtract(root.path("billLevelDiscount").decimalValue());
					totalItemLevelDiscount = totalItemLevelDiscount.add(calculateProportinatedDiscount(cashMemoDetailsId, itemLevelDiscount, proportionate));
					
					if (!root.isNull() && !root.path("ghsDiscount").isNull()
							&& root.path("ghsDiscount") != null || !root.path("ghsVoucherDiscount").isNull()
							&& root.path("ghsVoucherDiscount") != null
							|| !root.path("gepExchangeDiscount").isNull()
							&& root.path("gepExchangeDiscount") != null || !root.path("digiGoldDiscount").isNull()
							&& root.path("digiGoldDiscount") != null)
						// billLeveldiscount = BillLeveldiscount - GHSdiscount- GHSvoucherdiscount -
						// GEPExchangediscount-digigolddiscount
						billLevelDiscount =(root.path("billLevelDiscount")!=null? root.path("billLevelDiscount").decimalValue():BigDecimal.ZERO)
								.subtract(root.path("ghsDiscount")!=null? root.path("ghsDiscount").decimalValue():BigDecimal.ZERO)
								.subtract(root.path("ghsVoucherDiscount")!=null ?root.path("ghsVoucherDiscount").decimalValue():BigDecimal.ZERO)
								.subtract(root.path("gepExchangeDiscount")!=null ? root.path("gepExchangeDiscount").decimalValue():BigDecimal.ZERO)
								.subtract(root.path("digiGoldDiscount")!=null ? root.path("digiGoldDiscount").decimalValue():BigDecimal.ZERO);
					totalBillLevelDiscount =totalBillLevelDiscount.add(calculateProportinatedDiscount(cashMemoDetailsId, billLevelDiscount, proportionate));
				}
//					else {
//					if (!root.isNull() && !root.path("ghsDiscount").isNull()
//							&& root.path("ghsDiscount") != null || !root.path("ghsVoucherDiscount").isNull()
//							&& root.path("ghsVoucherDiscount") != null || !root.path("gepExchangeDiscount").isNull()
//							&& root.path("gepExchangeDiscount") != null || !root.path("digiGoldDiscount").isNull()
//							&& root.path("digiGoldDiscount") != null)
//
//						billLevelDiscount = (root.path("billLevelDiscount")!=null ? root.path("billLevelDiscount").decimalValue():BigDecimal.ZERO)
//								.subtract(root.path("ghsDiscount")!=null ? root.path("ghsDiscount").decimalValue():BigDecimal.ZERO)
//								.subtract(root.path("ghsVoucherDiscount")!=null? root.path("ghsVoucherDiscount").decimalValue():BigDecimal.ZERO)
//								.subtract(root.path("gepExchangeDiscount")!=null ?root.path("gepExchangeDiscount").decimalValue():BigDecimal.ZERO)
//								.subtract(root.path("digiGoldDiscount")!=null ?root.path("digiGoldDiscount").decimalValue():BigDecimal.ZERO);
//					totalBillLevelDiscount = calculateProportinatedDiscount(cashMemoDetailsId, billLevelDiscount, proportionate);
//				}
			} catch (IOException e) {
				throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
			}

		} else {
			try {
				JsonNode root = mapper.readTree(cashMemoDetails.getLegacyCmDetails());
				//JsonNode dataNode = root.path("data");
				if (!root.isNull()
						&& Boolean.TRUE.equals(root.path("isTEPDiscountRecoveryAllowed").asBoolean())) {
					if (!root.isNull() && !root.path("discount").isNull() && root.path("discount") != null
							|| !root.path("billLevelDiscount").isNull() && root.path("billLevelDiscount") != null)
						itemLevelDiscount = (root.path("discount")!=null ? root.path("discount").decimalValue():BigDecimal.ZERO)
								.subtract(root.path("billLevelDiscount")!=null ? root.path("billLevelDiscount").decimalValue():BigDecimal.ZERO);
					totalItemLevelDiscount = totalItemLevelDiscount.add(calculateProportinatedDiscount(cashMemoDetailsId, itemLevelDiscount, proportionate));
				}
			} catch (IOException e) {
				throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
			}

		}

		return (totalItemLevelDiscount.add(totalBillLevelDiscount));
	}
	
	public BigDecimal calculateProportinatedDiscount(String cashMemoDetailsId, BigDecimal discount,BigDecimal proportionate) {
		CashMemoDetailsDao cashMemoDetails = cashMemoDetailsRepository.findOneById(cashMemoDetailsId);
		BigDecimal discountRecovered = BigDecimal.ZERO; 
		ObjectMapper mapper = new ObjectMapper();
		try {
			JsonNode root = mapper
					.readTree(cashMemoDetails.getLegacyCmDetails());
			JsonNode dataNode = root.path("data");
			// if UCP discountPercentage is true proportionated discount is recovered.
			if (!root.isNull()
					&& Boolean.TRUE.equals(root.path("isUCPDiscountPercentage").asBoolean())) {
				discountRecovered = (discount.multiply(proportionate)).divide(new BigDecimal(100),EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			}
			// if F1discountPercentage is true full discount is recovered
			else if(!root.isNull()
					&& Boolean.TRUE.equals(root.path("isF1DiscountPercentage").asBoolean())) {
				discountRecovered = discount;
			}
			// if F2discountPercentage is true no discount is recovered
			else if(!root.isNull()
					&& Boolean.TRUE.equals(root.path("isF2DiscountPercentage").asBoolean())) {
				discountRecovered = BigDecimal.ZERO;
			}
		}
			
	catch (IOException e) {
		throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
	}
		return discountRecovered;
	}

	@Override
	public void ftepDiscountRecovery(TepPriceResponseDto priceResponseData, TepConfigurations tepConfig,
			TepPriceRequest tepRequest) {
		if (Boolean.TRUE.equals(priceResponseData.getIscashMemoAvailable())
				&& !StringUtils.isEmpty(tepRequest.getCashMemoDetailsId())) {
			BigDecimal totalRecovery = BigDecimal.ZERO;
			BigDecimal totalDiscount = BigDecimal.ZERO;
			List<DiscountItemDetailsDao> discountDetails = discountItemDetailRepo
					.findAllByItemId(tepRequest.getCashMemoDetailsId());
			if (discountDetails != null && !discountDetails.isEmpty()) {
				ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
				for (DiscountItemDetailsDao dd : discountDetails) {
					try {
						JsonNode masterRoot = null;
						JsonNode masterDataNode = null;
						DiscountDao discountMasterDao = discountRepoExt
								.findOneByDiscountCode(dd.getDiscountDetail().getDiscountCode());
						if (discountMasterDao != null) {
							masterRoot = mapper.readTree(discountMasterDao.getBasicCriteria());
							masterDataNode = masterRoot.path("data");
						}

						JsonNode root = mapper
								.readTree(dd.getDiscountDetail().getDiscountConfig().getBasicCriteriaDetails());
						JsonNode dataNode = root.path("data");
//						if (!dataNode.isNull()
//								&& Boolean.TRUE.equals(dataNode.get("isFullValueTepDiscountRecovery").asBoolean())) {
//							totalDiscount = totalDiscount.add(dd.getDiscountValue());
//						} else if (!masterDataNode.isNull() && Boolean.TRUE
//								.equals(masterDataNode.get("isFullValueTepDiscountRecovery").asBoolean())) {
//							totalDiscount = totalDiscount.add(dd.getDiscountValue());
//						}
						log.info("masterDataNode"+masterDataNode);
						if(masterDataNode!=null && masterDataNode.has("isFullValueTEPDiscountRecovery")) {
							if(Boolean.TRUE.equals(masterDataNode.get("isFullValueTEPDiscountRecovery").asBoolean())) {
								totalDiscount = totalDiscount.add(dd.getDiscountValue());
							}
						}else if(masterDataNode!=null  && masterDataNode.has("isFullValueTepDiscountRecovery")) {
							if(Boolean.TRUE.equals(masterDataNode.get("isFullValueTepDiscountRecovery").asBoolean())) {
								totalDiscount = totalDiscount.add(dd.getDiscountValue());
							}
						}  
				
					} catch (IOException e) {
						throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
					}
				}
			}
			totalRecovery = totalDiscount;
			priceResponseData.setDiscountRecovered(totalRecovery);
			//discount recovery for legacy cm
			CashMemoDetailsDao cashMemoDetails = cashMemoDetailsRepository.findOneById(tepRequest.getCashMemoDetailsId());
			if(cashMemoDetails.getLegacyTepDiscountRecovered()) {
				if( cashMemoDetails.getTotalDiscount().compareTo(BigDecimal.ZERO)>=0 &&  cashMemoDetails.getTotalDiscount()!=null) {
					totalRecovery = cashMemoDetails.getTotalDiscount();
				}
				
			}
	
			
			if(priceResponseData.getStonePriceDetails().getPreDiscountValue().compareTo(BigDecimal.ZERO)>0) {
				priceResponseData.setDiscountRecovered(totalRecovery);
				priceResponseData.setFinalValue(priceResponseData.getFinalValue().subtract(totalRecovery));	
			}
			
		}
	}
	


	

}
