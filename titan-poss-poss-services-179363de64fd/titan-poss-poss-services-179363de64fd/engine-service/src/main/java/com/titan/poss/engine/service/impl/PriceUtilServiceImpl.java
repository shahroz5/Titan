
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
import java.util.concurrent.atomic.AtomicReference;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.GepPriceRequest;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.ItemLotStoneBaseDto;
import com.titan.poss.core.dto.MakingChargeMarginDetailsDto;
import com.titan.poss.core.dto.MakingChargeMarginDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.WeightUtil;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.dto.response.ItemLotStoneListDto;
import com.titan.poss.engine.dto.response.LotDetailsPriceDto;
import com.titan.poss.engine.location.repository.LocationPriceGroupMappingRepositoryExt;
import com.titan.poss.engine.location.repository.LocationRepositoryExt;
import com.titan.poss.engine.location.repository.MarketMarkupMappingRepositoryExt;
import com.titan.poss.engine.location.repository.MarketRepositoryExt;
import com.titan.poss.engine.location.repository.MetalPriceLocationMappingRepositoryExt;
import com.titan.poss.engine.product.repository.ComplexityPriceGroupRepositoryExt;
import com.titan.poss.engine.product.repository.LotDetailRepositoryExt;
import com.titan.poss.engine.product.repository.PriceRepositoryExt;
import com.titan.poss.engine.product.repository.ProductPriceMappingRepositoryExt;
import com.titan.poss.engine.product.repository.PurityRepositoryExt;
import com.titan.poss.engine.product.repository.StoneRepositoryExt;
import com.titan.poss.engine.service.LocationService;
import com.titan.poss.engine.service.PriceUtilService;
import com.titan.poss.engine.service.ProductService;
import com.titan.poss.engine.service.RuleService;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.LocationPriceGroupMappingDao;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketMarkupMappingDao;
import com.titan.poss.location.dao.MetalPriceLocationMappingDao;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ComplexityPriceGroupDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.PriceGroupDao;
import com.titan.poss.product.dao.PurityDao;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.repository.ComplexityRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service
public class PriceUtilServiceImpl implements PriceUtilService {

	@Autowired
	private PurityRepositoryExt purityRepository;

	@Autowired
	private PriceRepositoryExt priceRepository;

	@Autowired
	private LotDetailRepositoryExt lotDetailRepository;

	@Autowired
	private StoneRepositoryExt stoneRepository;

	@Autowired
	private LocationRepositoryExt locationRepository;

	@Autowired
	private MetalPriceLocationMappingRepositoryExt metalPriceLocationMappingRepository;

	@Autowired
	private LocationPriceGroupMappingRepositoryExt locationPriceGroupMappingRepository;

	@Autowired
	private MarketMarkupMappingRepositoryExt marketMarkupMapping;

	@Autowired
	private ProductPriceMappingRepositoryExt productPriceMapping;

	@Autowired
	RuleService ruleService;

	@Autowired
	MarketRepositoryExt marketRepo;

	@Autowired
	LocationService locationService;

	@Autowired
	private ComplexityPriceGroupRepositoryExt complexityPriceGroupRepository;
	
	@Autowired
	private ProductService productService;

	@Autowired
	private ComplexityRepository complexityRepository;

	@Autowired
	private PriceRepositoryExt priceRepositoryExt;

	
	public static final String ERR_INV_014 = "ERR-INV-014";

	public static final String ERR_LOC_038 = "ERR-LOC-038";

	public static final String ERR_INV_013 = "ERR-INV-013";
	public static final String ERR_INV_034 = "ERR-CORE-034";

	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	private static final String ERR_CORE_003 = "ERR-CORE-003";

	@Override
	public BigDecimal getTodaysMaterialPrice(String locationCode, String metalTypeCode, BusinessDateDto applicableDate) {
		MetalPriceLocationMappingDao metalPriceLocationMapping = metalPriceLocationMappingRepository
				.findOneByLocationCodeAndMetalTypeCodeAndApplicableDate(locationCode, metalTypeCode, applicableDate.getBusinessDate());
		if (metalPriceLocationMapping == null) {
			throw new ServiceException("Price is not set for today for specified material Type code", ERR_LOC_038);
		}
		validateMetalPriceLocationMapping(metalPriceLocationMapping);
		return metalPriceLocationMapping.getMetalRate();
	}


	private void validateMetalPriceLocationMapping(MetalPriceLocationMappingDao metalPriceLocationMapping) {

		if (metalPriceLocationMapping.getMetalRate() == null) {
			throw new ServiceException("Material Price is null", ERR_INV_014);
		}
	}

	public ComplexityPriceGroupDao getComplexityPriceGroup(String complexityCode, String priceGroup) {
		
		ComplexityDao complexityDao = complexityRepository.findOneByComplexityCode(complexityCode);
		if (complexityDao != null && !complexityDao.getIsActive()) {
			throw new ServiceException(
					"Complexity code :- {complexityCode} is inactive contact the merchandising team.", "ERR-ENG-041",
					"Inactive complexity code ", Map.of("complexityCode", complexityCode));
		}

		PriceGroupDao priceGroupDao = priceRepositoryExt.findOneByPriceGroup(priceGroup);
		if (priceGroupDao != null && !priceGroupDao.getIsActive()) {
			throw new ServiceException(
					"Price group :- {priceGroup} is inactive, please contact the merchandising team.", "ERR-ENG-042",
					"Inactive Price group.", Map.of("priceGroup", priceGroup));
		}

		ComplexityPriceGroupDao complexityPriceGroup = complexityPriceGroupRepository
				.findOneByComplexityCodeAndPriceGroup(complexityCode, priceGroup);

		if (complexityPriceGroup == null) {
			log.info("Complexity price group not found for complexity code: {} and priceGroup: {}",complexityCode,priceGroup);
			throw new ServiceException("Complexity price group is not found for requested item code", "ERR-INV-049");
		}
		if (!complexityPriceGroup.getIsActive()) {
			log.info("Complexity price group mapping is in active for complexity code: {} and priceGroup: {}",complexityCode,priceGroup);
			throw new ServiceException("Complexity price group mapping is inactive for requested item code, please contact the merchandising team", "ERR-INV-061");
		}
		return complexityPriceGroup;
	}

	@Override
	public String getPriceGroup(String locationCode, String pricingGroupType) {
		List<LocationPriceGroupMappingDao> locationPriceGroupMapping = locationPriceGroupMappingRepository
				.findByLocationCodeAndPricingGroupType(locationCode, pricingGroupType);
		if (locationPriceGroupMapping == null || locationPriceGroupMapping.isEmpty()) {
			log.info("Location price group mapping not found for location code: {} and pricingGroupType: {}",locationCode,pricingGroupType);
			throw new ServiceException("No price group mapping found for requested location code", "ERR-LOC-031");
		}
		return locationPriceGroupMapping.get(0).getPriceGroup();
	}

	@Override
	public BigDecimal getOffset(String metalTypeCode, BigDecimal purity, BigDecimal karat) {
		PurityDao purityMaster = null;
		if (MetalTypeCodeEnum.getUniqueMetals().contains(metalTypeCode)) {
			if (metalTypeCode.equalsIgnoreCase(MetalTypeCodeEnum.J.toString())) {
				purityMaster = purityRepository.findOneByKaratAndItemTypeCode(karat, metalTypeCode);
			} else {
				purityMaster = purityRepository.findOneByPurityAndItemTypeCode(purity, metalTypeCode);
			}
		} else {
			throw new ServiceException("No Material type details found for the requested material Type code", "ERR-PRO-006");
		}
		if (purityMaster == null) {
			throw new ServiceException("purity/karat is null for the selected item ", ERR_INV_014);
		}
		validatePurity(purityMaster);

		return purityMaster.getOffset();
	}

	private void validatePurity(PurityDao purityMaster) {
		if (purityMaster.getOffset() == null) {
			throw new ServiceException("No offset is set for particular purity/carat", "ERR-INV-051");
		}
	}

	@Override
	public BigDecimal getStuddedMakingChargesOld(String itemCode) {

		return priceRepository.findByItemCodeAndPriceGroup(itemCode, EngineConstants.STUDDED_PRICEGROUP)
				.getMakingCharge();

	}

	@Override
	public BigDecimal getMeasuredStandardWeight(String locationCode, BigDecimal measuredWeight, Short measuredQuantity,
			InventoryDetailsDao inventoryDetail) {
		BigDecimal measuredStdWeight = BigDecimal.ZERO;

		if (measuredWeight != null && measuredQuantity != null) {

			System.out.println("Measured weight is........................."+measuredWeight);
			ruleService.checkWeightTolerance(locationCode, inventoryDetail.getProductGroup(),
					inventoryDetail.getTotalWeight(), measuredWeight, inventoryDetail.getTotalQuantity(),
					measuredQuantity);

			measuredStdWeight = measuredWeight;

		} else if (measuredWeight == null && measuredQuantity == null) {
			measuredStdWeight = inventoryDetail.getTotalWeight().divide(
					BigDecimal.valueOf(inventoryDetail.getTotalQuantity()), EngineConstants.DIVISION_SCALE,
					RoundingMode.HALF_UP);
		}
		return measuredStdWeight;
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

	@Override
	public BigDecimal getStandardStoneCharges(String itemCode, String lotNumber, PriceResponseDto priceResponseData) {

		Integer totalStones = 0;
		List<Object[]> lotDetailList = null;
		List<String> stoneCodes = new ArrayList<>();
		Map<String, BigDecimal> stoneCodeData = new HashMap<>();
		if(BooleanUtils.isFalse(priceResponseData.getCheckInventory()))
		{
			ItemLotStoneListDto listResponse=productService.getLotItemStonesWithDICheck(itemCode, null, false,false);

			for(ItemLotStoneBaseDto item : listResponse.getLotStoneDetails())
			{
				totalStones += item.getNoOfStones();
				stoneCodes.add(item.getStoneCode());
				stoneCodeData.put(item.getStoneCode(), item.getStoneWeight());
			}
		}else
		{
			// cannot use the following because taking 100 seconds to get and bind the data
			// to List because it has 3-4 inter tables [itemmaster,lotMaster,stoneMaster]
			lotDetailList = lotDetailRepository.findByLotNumberId(itemCode, lotNumber);
			List<LotDetailsPriceDto> lotDetailsList = mapLotDetailsList(lotDetailList);
			for (LotDetailsPriceDto lotDetail : lotDetailsList) {
				totalStones = totalStones + lotDetail.getNoOfStones();
				stoneCodes.add(lotDetail.getStoneCode());
				stoneCodeData.put(lotDetail.getStoneCode(), lotDetail.getStoneWeight());

			}
		}

		priceResponseData.getPriceDetails().getStonePriceDetails().setNumberOfStones(totalStones);

		if (stoneCodes.isEmpty()) {
			throw new ServiceException("No lot stone mapping found for requested item code.", "ERR-PRO-033");
		}
		List<StoneDao> stoneList = stoneRepository.findRatesByCaratByStoneCode(stoneCodes);

		BigDecimal individualF1;
		BigDecimal f1 = BigDecimal.ZERO;

		for (StoneDao stone : stoneList) {

			if ((stone.getRatePerCarat() == null) || (stoneCodeData.get(stone.getStoneCode()) == null)) {
				log.info("either ratePerCarat is null  or lotDetail's stoneWeight is null for stone code: {}. Rate per carat: {} ",stone.getStoneCode(),stone.getRatePerCarat());
				throw new ServiceException("either ratePerCarat or lotDetail's stoneWeight is null", ERR_INV_014);

			}
			individualF1 = stone.getRatePerCarat().multiply(stoneCodeData.get(stone.getStoneCode())).setScale(EngineConstants.VALUE_SCALE,
					RoundingMode.HALF_UP);

			f1 = f1.add(individualF1);

		}
		return f1;
	}

	/**
	 * @param lotDetailList
	 * @return
	 */
	private List<LotDetailsPriceDto> mapLotDetailsList(List<Object[]> listAvailableItems) {

		List<LotDetailsPriceDto> lotDetailsList = new ArrayList<>();

		for (Object[] l : listAvailableItems) {
			LotDetailsPriceDto lotDetail = new LotDetailsPriceDto();

			lotDetail.setNoOfStones((Short) l[0]);
			lotDetail.setStoneCode((String) l[1]);
			lotDetail.setStoneWeight((BigDecimal) l[2]);

			lotDetailsList.add(lotDetail);
		}
		return lotDetailsList;

	}

	@Override
	public PriceResponseDto getMultiMetalVJsonData(Map<String, BigDecimal> weightDetailsMap, String locationCode,
			ItemDao itemDto, PriceResponseDto priceResponseData, Map<String, StandardPriceResponseDto> standarPrice) {
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

		priceResponseData.getPriceDetails().getMetalPriceDetails().setPreDiscountValue(sumV);
		priceResponseData.getPriceDetails().getMetalPriceDetails().setMetalPrices(data);

		BigDecimal stoneWeight1 = weightDetailsMap.get(EngineConstants.STONE_WEIGHT);
		BigDecimal diamondWeight1 = weightDetailsMap.get(EngineConstants.DIAMOND_WEIGHT);
		BigDecimal totalStoneWeight = stoneWeight1.add(diamondWeight1);
		// setting the response by converting into carat
		priceResponseData.getPriceDetails().getStonePriceDetails()
				.setStoneWeight(totalStoneWeight.multiply(new BigDecimal(5)));
		priceResponseData.getPriceDetails().getStonePriceDetails().setWeightUnit(EngineConstants.CARAT);

		// setting stone weight and unit for view purpose
		priceResponseData.getPriceDetails().getStonePriceDetails().setStoneWeightForView(totalStoneWeight);
		priceResponseData.getPriceDetails().getStonePriceDetails().setWeightUnitForView(itemDto.getWeightUnit());

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

	@Override
	public PriceResponseDto getF2JsonData(String complexityCode, String priceGroup,
			PriceResponseDto priceResponseData) {
		ComplexityPriceGroupDao complexityPriceGroup = getComplexityPriceGroup(complexityCode, priceGroup);

		if (complexityPriceGroup != null) {

			BigDecimal makingChargePer = BigDecimal.ZERO;
			BigDecimal makingCharge=BigDecimal.ZERO;

			makingChargePer = makingChargePer.add(complexityPriceGroup.getWastagePct());
			makingChargePer = makingChargePer.add(complexityPriceGroup.getMakingChargePct());
	

			if (priceResponseData.getPriceDetails().getMetalPriceDetails().getPreDiscountValue()
					.compareTo(new BigDecimal(0)) == 0) {
				makingChargePer = BigDecimal.ZERO;
			} else {
				makingCharge = priceResponseData.getPriceDetails().getNetWeight()
						.multiply(complexityPriceGroup.getMakingChargePgram());
				makingCharge = makingCharge.add(makingChargePer.divide(new BigDecimal(100))
						.multiply(priceResponseData.getPriceDetails().getMetalPriceDetails().getPreDiscountValue()));
				//recalculate total MC% ONLY
				makingChargePer = makingCharge
								.divide(priceResponseData.getPriceDetails().getMetalPriceDetails()
										.getPreDiscountValue(), EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
								.multiply(new BigDecimal(100));
			}

			// UAT_1620: reported difference in calculation before and after round off	
			//removed recalculation with overall % due to UAT defect 2021.
			

			// round off will happen if only MakingChargePgram is present.
			makingChargePer = makingChargePer.setScale(EngineConstants.PERCENT_SCALE, RoundingMode.HALF_UP); 
			makingCharge = makingCharge.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			priceResponseData.getPriceDetails().getMakingChargeDetails().setMakingChargePercentage(makingChargePer);
			priceResponseData.getPriceDetails().getMakingChargeDetails().setPreDiscountValue(makingCharge);

			// making pct details
			priceResponseData.getPriceDetails().getMakingChargeDetails()
					.setMakingChargePgram(complexityPriceGroup.getMakingChargePgram());
			priceResponseData.getPriceDetails().getMakingChargeDetails()
					.setMakingChargePct(complexityPriceGroup.getMakingChargePct());
			priceResponseData.getPriceDetails().getMakingChargeDetails()
					.setWastagePct(complexityPriceGroup.getWastagePct());
			priceResponseData.getPriceDetails().getMakingChargeDetails()
			          .setMakingChargePunit(complexityPriceGroup.getMakingChargePunit());

			return priceResponseData;
		} else {
			log.info("Complexity price group not found for complexity code: {} and priceGroup: {}",complexityCode,priceGroup);
			throw new ServiceException("Complexity price group is not found for requested item code", "ERR-INV-049");
		
		}
	}

	public Map<String, BigDecimal> getMaterialDetails(InventoryDetailsDao inventoryDetail) {
		if (inventoryDetail.getTotalWeightDetails() == null) {
			throw new ServiceException("weight json is null in InventoryDetails table", ERR_INV_014);
		}
		return getUpdatedMaterialMap(inventoryDetail.getTotalWeightDetails());
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
				if (dataNode.hasNonNull(EngineConstants.DIAMOND_WEIGHT))
					materialMap.put(EngineConstants.DIAMOND_WEIGHT,
							new BigDecimal(dataNode.path(EngineConstants.DIAMOND_WEIGHT).asText()));
			}
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}

		return materialMap;
	}

	@Override
	public PriceResponseDto getMetalVJsonData(ItemDao itemDto, BigDecimal price, PriceResponseDto priceResponseData,
			BigDecimal purity, BigDecimal karat, String locationCode,BigDecimal offset) {

		MetalPriceDto pd = new MetalPriceDto();
		List<MetalPriceDto> data = new ArrayList<>();
		setType(priceResponseData.getItemTypeCode(), pd);

		pd.setWeightUnit(locationService.getCountryDetails(locationCode).getWeightUnit());
		pd.setNetWeight(priceResponseData.getPriceDetails().getNetWeight());
		price = price.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
		pd.setRatePerUnit(price);
		pd.setPurity(purity);
		pd.setKarat(karat);
		pd.setMetalValue(priceResponseData.getPriceDetails().getNetWeight().multiply(price)
				.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
		pd.setMetalTypeCode(priceResponseData.getItemTypeCode());
		pd.setOffset(offset);
		data.add(pd);

		priceResponseData.getPriceDetails().getMetalPriceDetails().setMetalPrices(data);
		priceResponseData.getPriceDetails().getMetalPriceDetails()
				.setPreDiscountValue(priceResponseData.getPriceDetails().getNetWeight().multiply(price)
						.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
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
	public PriceResponseDto studdedVCalculation(PriceResponseDto priceResponseData, ItemDao itemDto,
			BigDecimal measuredWeight, Short measuredQuantity, InventoryDetailsDao inventoryDetail, String locationCode,
			Map<String, StandardPriceResponseDto> standardPrice) {
		
		BigDecimal measuredStdWeight =BigDecimal.ZERO;
		if(BooleanUtils.isFalse(priceResponseData.getCheckInventory()))
		{
			
			measuredStdWeight = measuredWeight!= null ? measuredWeight : itemDto.getStdWeight();
		}else
		{
			/**
			 * For Find Price isCOMPrice should be sent as FALSE
			 * This is to eliminate Weight Tolerance Check For findPrice API
			 */
			if(BooleanUtils.isFalse(priceResponseData.getIsCOMPrice()))
			{
				//measured cann't be null
				//what if incase of measured value '0'?
				measuredStdWeight = measuredWeight;
			}
			else
			{
			measuredStdWeight= getMeasuredStandardWeight(locationCode, measuredWeight, measuredQuantity,
					inventoryDetail);
			}
		}
		
		// Weight in gm (stoneWeight + otherMaterialWeight)
		BigDecimal totalMaterialWeight = setStuddedWeight(inventoryDetail, priceResponseData, itemDto);
		priceResponseData.getPriceDetails().setNetWeight(measuredStdWeight.subtract(totalMaterialWeight));
		BigDecimal materialPrice;
		BigDecimal offset;
		
		//if net weight is 0, then no need for calculation
		if(BigDecimal.ZERO.compareTo(priceResponseData.getPriceDetails().getNetWeight())==0) {
			materialPrice = BigDecimal.ZERO;
			offset = BigDecimal.ZERO;
		} else {
			materialPrice = getMaterialPrice(standardPrice, priceResponseData.getItemTypeCode());
			offset = getOffset(priceResponseData.getItemTypeCode(), itemDto.getPurity(), itemDto.getKarat());
		}
		
		BigDecimal price = materialPrice.multiply(offset);

		priceResponseData = getMetalVJsonData(itemDto, price, priceResponseData, itemDto.getPurity(),
				itemDto.getKarat(), locationCode,offset);
		return priceResponseData;
	}

	private BigDecimal setStuddedWeight(InventoryDetailsDao inventoryDetail, PriceResponseDto priceResponseData,ItemDao itemDto) {

		BigDecimal goldWeight = BigDecimal.ZERO;
		BigDecimal silverWeight = BigDecimal.ZERO;
		BigDecimal platinumWeight = BigDecimal.ZERO;
		BigDecimal totalStoneWeight=BigDecimal.ZERO;
		BigDecimal metalWeight = BigDecimal.ZERO;
		BigDecimal materialWeight = null;
		BigDecimal stoneWeight1 = BigDecimal.ZERO;
		BigDecimal diamondWeight1 = BigDecimal.ZERO;
		Map<String, BigDecimal> materialMap = null;
		if (BooleanUtils.isTrue(priceResponseData.getCheckInventory()) && inventoryDetail.getTotalWeightDetails() == null ) {
			throw new ServiceException("weight json is null in InventoryDetails table", ERR_INV_014);
		}else if(BooleanUtils.isFalse(priceResponseData.getCheckInventory()))
		{
			//BigDecimal totalStoneWeight = BigDecimal.ZERO;
				ItemLotStoneListDto listResponse=productService.getLotItemStonesWithDICheck(itemDto.getItemCode(), null, false,false);

				for(ItemLotStoneBaseDto item : listResponse.getLotStoneDetails())
				{
					totalStoneWeight = totalStoneWeight.add(item.getStoneWeight());
				}
				
				//converting to grm
				totalStoneWeight = totalStoneWeight.divide(new BigDecimal(5));

			priceResponseData.getPriceDetails().getStonePriceDetails().setWeightUnitForView(itemDto.getWeightUnit());
			//stone_weight from itemMaster itself is total stone weight including diamond weight
			//TODO
			materialWeight = BigDecimal.ZERO;
			//stoneweight divde
			BigDecimal metalWeightInItem = itemDto.getStdWeight().subtract(totalStoneWeight);
			if(itemDto.getItemType().getItemTypeCode().equals(MetalTypeCodeEnum.L.toString()))
			{
				//ex : platinum weight will be (std_Weight- stone_weight -material_weight)
				platinumWeight = metalWeightInItem;
			}else if(itemDto.getItemType().getItemTypeCode().equals(MetalTypeCodeEnum.J.toString()))
			{
				goldWeight = metalWeightInItem;
				
			}else if(itemDto.getItemType().getItemTypeCode().equals(MetalTypeCodeEnum.P.toString()))
			{
				silverWeight = metalWeightInItem;
			}
			
		}else 
		{
			materialMap = getMaterialDetails(inventoryDetail);
			stoneWeight1 = materialMap.get(EngineConstants.STONE_WEIGHT);
			diamondWeight1 = materialMap.get(EngineConstants.DIAMOND_WEIGHT);
			materialWeight = materialMap.get(EngineConstants.MATERIAL_WEIGHT);
			platinumWeight = materialMap.get(MetalTypeCodeEnum.L.toString());
			goldWeight = materialMap.get(MetalTypeCodeEnum.J.toString());
			silverWeight = materialMap.get(MetalTypeCodeEnum.P.toString());
			priceResponseData.getPriceDetails().getStonePriceDetails().setWeightUnitForView(inventoryDetail.getWeightUnit());
			totalStoneWeight = stoneWeight1.add(diamondWeight1);
		}
		
		// setting the response by converting into carat
		priceResponseData.getPriceDetails().getStonePriceDetails()
				.setStoneWeight(totalStoneWeight.multiply(new BigDecimal(5)));
		priceResponseData.getPriceDetails().getMaterialDetails().setMaterialWeight(materialWeight);
		priceResponseData.getPriceDetails().getStonePriceDetails().setWeightUnit(EngineConstants.CARAT);
		metalWeight = goldWeight.add(platinumWeight).add(silverWeight);
		priceResponseData.getPriceDetails().setNetWeight(metalWeight);

		// setting stone weight and unit for view purpose
		priceResponseData.getPriceDetails().getStonePriceDetails().setStoneWeightForView(totalStoneWeight);
		
		if (materialWeight != null) {
			return totalStoneWeight.add(materialWeight);
		}
		return totalStoneWeight;
	}

	@Override
	public PriceResponseDto studdedF1Calculation(PriceResponseDto priceResponseData,
			InventoryDetailsDao inventoryDetail, String locationCode) {

		BigDecimal baseF1=BigDecimal.ZERO;
		if(BooleanUtils.isFalse(priceResponseData.getCheckInventory()))
		{
			baseF1 = getStandardStoneCharges(priceResponseData.getItemCode(), null,priceResponseData);
		}
		else
		{
			// level-1 [weight-level]
			baseF1 = getStandardStoneCharges(inventoryDetail.getItemCode(), inventoryDetail.getLotNumber(),priceResponseData);
		}
		

		// level-2 [market-level] (F1*markup)
		BigDecimal f1 = getMarketLevelMakingChargePercentage(baseF1, locationCode,
				EngineConstants.F1_MATERIAL_TYPE_CODE,priceResponseData);

		f1 = f1.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
		priceResponseData.getPriceDetails().getStonePriceDetails().setPreDiscountValue(f1);
		return priceResponseData;
	}

	@Override
	public PriceResponseDto studdedF2Calculation(PriceResponseDto priceResponseData, ItemDao itemDto,
			String locationCode,InventoryDetailsDao inventoryDetail) {
		BigDecimal cfaLevelMkingChargePercentage;
		BigDecimal skuLevelMkingChargePercentage;
		BigDecimal makingChargePercentage;
		//TODO: Conversion - If Conversion is done for this item then making charges should be applied 
		//based on converted value.
		if(inventoryDetail!=null && inventoryDetail.getMakingCharges()!=null) {
			priceResponseData.getPriceDetails().getMakingChargeDetails()
					.setPreDiscountValue(inventoryDetail.getMakingCharges());
			priceResponseData.getPriceDetails().getMakingChargeDetails()
			.setMakingChargePercentage(inventoryDetail.getMakingChargesPct());
			priceResponseData.getPriceDetails().getMakingChargeDetails().setIsSplit(true);
		} else {
			priceResponseData.getPriceDetails().getMakingChargeDetails().setIsDynamic(true);
			BigDecimal sumOfVandF1 = priceResponseData.getPriceDetails().getStonePriceDetails().getPreDiscountValue()
					.add(priceResponseData.getPriceDetails().getMetalPriceDetails().getPreDiscountValue());

			cfaLevelMkingChargePercentage = getCfaLevelMakingChargePercentage(sumOfVandF1,
					priceResponseData.getProductGroupCode(),
					priceResponseData.getPriceDetails().getStonePriceDetails().getNumberOfStones(), priceResponseData);

			skuLevelMkingChargePercentage = getSkuLevelMakingChargePercentage(cfaLevelMkingChargePercentage,
					itemDto.getPriceFactor());

			makingChargePercentage = getMarketLevelMakingChargePercentage(skuLevelMkingChargePercentage, locationCode,
					EngineConstants.F2_MATERIAL_TYPE_CODE,priceResponseData);

			// round off
			makingChargePercentage = makingChargePercentage.setScale(EngineConstants.PERCENT_SCALE, RoundingMode.HALF_UP);
			priceResponseData.getPriceDetails().getMakingChargeDetails().setMakingChargePercentage(makingChargePercentage);

			priceResponseData.getPriceDetails().getMakingChargeDetails()
					.setPreDiscountValue(makingChargePercentage.divide(new BigDecimal(100)).multiply(sumOfVandF1)
							.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
		}
		
		

		return priceResponseData;
	}

	/**
	 * @param sumOfVandF1
	 * @param productGroupCode
	 * @param numberOfStones
	 * @return
	 */
	private BigDecimal getCfaLevelMakingChargePercentage(BigDecimal sumOfVandF1, String productGroupCode,
			Integer numberOfStones,PriceResponseDto priceResponseData) {

		log.info("V + F1: {}, product group: {}, number of stones: {}", sumOfVandF1, productGroupCode, numberOfStones);
		List<MakingChargeMarginDto>  productpriceMarginList = productPriceMapping.fingByProductGroupAndNoOfStones( productGroupCode,
				numberOfStones);

		if (CollectionUtil.isEmpty(productpriceMarginList)) {
			throw new ServiceException(
					"Price configurations not found for the product group, please contact Commercial Team.",
					"ERR-ENG-028", "Product group code: " + productGroupCode);
		}
		
		MakingChargeMarginDto validMargin = null;
		int count = 0;
		for(MakingChargeMarginDto makingChargeMargin:productpriceMarginList) {
			if(sumOfVandF1.compareTo(makingChargeMargin.getFromPrice()) >=0 &&  sumOfVandF1.compareTo(makingChargeMargin.getToPrice()) <=0) {
				validMargin = makingChargeMargin;
				count++;
			}
		}
		
		if (count==0) {
			throw new ServiceException(
					"Price configurations not found for the product group, please contact Commercial Team.",
					"ERR-ENG-028", "Product group code: " + productGroupCode);
		}
		
		else if(count > 1) {
			throw new ServiceException("Multiple price configurations found for the product group, please contact Commercial Team.",
					"ERR-ENG-031","Product group : " + productGroupCode);
		}
		
		//for AB
		priceResponseData.setMakingChargeMarginDetails(new MakingChargeMarginDetailsDto(productpriceMarginList));
		
		// need to return percentage
		return validMargin.getMargin().multiply(new BigDecimal(100)).divide(
				new BigDecimal(100).subtract(validMargin.getMargin()), EngineConstants.PERCENT_SCALE,
				RoundingMode.HALF_UP);

	}

	/**
	 * @param cfaLevelMkingCharge
	 * @param
	 * @param productGroupCode
	 * @param numberOfStones
	 * @return
	 */
	private BigDecimal getSkuLevelMakingChargePercentage(BigDecimal cfaLevelMkingChargePercentage,
			BigDecimal priceFactor) {
		return cfaLevelMkingChargePercentage.multiply(priceFactor);
	}

	/**
	 * @param priceResponseData
	 * @return
	 */
	private BigDecimal getMarketLevelMakingChargePercentage(BigDecimal skuLevelMkingChargePercentage,
			String locationCode, String metalTypeCode,PriceResponseDto priceResponseData) {
		BigDecimal marketMakingChargesPercentage;
		BigDecimal marketMaterialFactor = getMarketMarkupFactor(locationCode, metalTypeCode);

		marketMakingChargesPercentage = skuLevelMkingChargePercentage.multiply(marketMaterialFactor);
		
		if(EngineConstants.F2_MATERIAL_TYPE_CODE.equals(metalTypeCode)) {
			priceResponseData.setMakingChargeMarkupFactor(marketMaterialFactor);
		}
		
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

		MarketMarkupMappingDao marketMaterial = marketMarkupMapping.findByMarketAndMetalTypeCode(market, metalTypeCode);

		if (marketMaterial == null) {
			throw new ServiceException("No Mapping found for F1/F2 Offset", ERR_INV_034);
		}
		return marketMaterial.getMarkupFactor();
	}

	@Override
	public PriceResponseDto plainF2Calculation(String locationCode, ItemDao itemDto,
			PriceResponseDto priceResponseData) {
		String priceGroup = getPriceGroup(locationCode, itemDto.getPricingGroupType());
		priceResponseData.setPriceGroup(priceGroup);
		priceResponseData = getF2JsonData(itemDto.getComplexity().getComplexityCode(), priceGroup, priceResponseData);

		return priceResponseData;
	}

	@Override
	public PriceResponseDto multiMetalVCalculation(String locationCode, InventoryDetailsDao inventoryDetail,
			ItemDao itemDto, PriceResponseDto priceResponseData, BigDecimal measuredWeight, Short measuredQuantity,
			Map<String, StandardPriceResponseDto> standardPrice) {
		Map<String, BigDecimal> materialMap = null;

		BigDecimal measuredStdWeight;
		if (measuredWeight != null) {
			ruleService.checkWeightTolerance(locationCode, inventoryDetail.getProductGroup(),
					inventoryDetail.getTotalWeight(), measuredWeight, inventoryDetail.getTotalQuantity(),
					measuredQuantity);
			String weightDetails = WeightUtil.calculateWeightDetails(
					inventoryDetail.getTotalWeight().divide(BigDecimal.valueOf(inventoryDetail.getTotalQuantity()),
							EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP),
					inventoryDetail.getTotalWeightDetails(), measuredWeight);
			// take updated metal values only
			measuredStdWeight = getMultiMetalNetWeight(weightDetails);
			materialMap = getUpdatedMaterialMap(weightDetails);

		} else {
			materialMap = getMaterialDetails(inventoryDetail);
			measuredStdWeight = getMultiMetalNetWeight(inventoryDetail.getTotalWeightDetails());
			// netWeight will be stdWeight-otherMaterialWeight
		}

		setMulltiMaterialMaterialWeight(priceResponseData, materialMap);
		priceResponseData.getPriceDetails().setNetWeight(measuredStdWeight);

		priceResponseData = getMultiMetalVJsonData(materialMap, locationCode, itemDto, priceResponseData,
				standardPrice);

		return priceResponseData;
	}

	private void setMulltiMaterialMaterialWeight(PriceResponseDto priceResponseData,
			Map<String, BigDecimal> materialMap) {
		BigDecimal materialWeight = materialMap.get(EngineConstants.MATERIAL_WEIGHT);
		priceResponseData.getPriceDetails().getMaterialDetails().setMaterialWeight(materialWeight);
	}

	@Override
	public PriceResponseDto plainF1Calculation(PriceResponseDto priceResponseData) {

		priceResponseData.getPriceDetails().getStonePriceDetails().setPreDiscountValue(BigDecimal.ZERO);

		return priceResponseData;
	}

	@Override
	public PriceResponseDto plainVCalculation(String locationCode, InventoryDetailsDao inventoryDetail, ItemDao itemDto,
			PriceResponseDto priceResponseData, BigDecimal measuredWeight, Short measuredQuantity,
			Map<String, StandardPriceResponseDto> standardPrice) {

		Map<String, BigDecimal> materialMap = null;
		BigDecimal measuredStdWeight;
		BigDecimal materialWeight =BigDecimal.ZERO;
		if(BooleanUtils.isFalse(priceResponseData.getCheckInventory()))
		{
			priceResponseData.setStdWeight(itemDto.getStdWeight());
			//direct
			//materialWeight need to taken from DB, currently material weight is set to 0
			measuredStdWeight =  (measuredWeight!= null ? measuredWeight :itemDto.getStdWeight()).subtract(materialWeight);
		} else 
		{
			materialMap = getMaterialDetails(inventoryDetail);
			materialWeight = materialMap.get(EngineConstants.MATERIAL_WEIGHT);
			priceResponseData.getPriceDetails().getMaterialDetails().setMaterialWeight(materialWeight);
			// netWeight will be stdWeight-otherMaterialWeight
			priceResponseData.setStdWeight(inventoryDetail.getStdWeight());
			/**
			 * For Find Price isCOMPrice should be sent as FALSE
			 * This is to eliminate Weight Tolerance Check For findPrice API
			 */
			if(BooleanUtils.isFalse(priceResponseData.getIsCOMPrice()))
			{
				measuredStdWeight = measuredWeight;
			}
			else
			{
				if(materialWeight!=null) {
					measuredStdWeight = getMeasuredStandardWeight(locationCode, measuredWeight, measuredQuantity,
							inventoryDetail).subtract(materialWeight);		
				}else {
					measuredStdWeight = getMeasuredStandardWeight(locationCode, measuredWeight, measuredQuantity,
							inventoryDetail);
					
				}
			}
		}  

		BigDecimal materialPrice = getMaterialPrice(standardPrice, priceResponseData.getItemTypeCode());
		BigDecimal offset = getOffset(priceResponseData.getItemTypeCode(), itemDto.getPurity(), itemDto.getKarat());
		BigDecimal price = materialPrice.multiply(offset).setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
		priceResponseData.getPriceDetails().setNetWeight(measuredStdWeight);
		
		priceResponseData = getMetalVJsonData(itemDto, price, priceResponseData, itemDto.getPurity(),
				itemDto.getKarat(), locationCode,offset);

		return priceResponseData;
	}

	/**
	 * @param standardPrice
	 * @param metalTypeCode
	 * @return
	 */
	@Override
	public BigDecimal getMaterialPrice(Map<String, StandardPriceResponseDto> standardPrice, String metalTypeCode) {
        AtomicReference< BigDecimal> standardPriceAtomic = new AtomicReference<BigDecimal>();
        standardPriceAtomic.set(BigDecimal.ZERO);
		if (CollectionUtils.isEmpty(standardPrice)) {
			throw new ServiceException(
					"No metal rate set for the day. Please contact commercial helpdesk and get the metal rate password",
					"ERR-ENG-003");
		}
        standardPrice.values().stream().forEach(standard -> {
        	if(metalTypeCode.equalsIgnoreCase(standard.getMetalTypeCode())) {
        		standardPriceAtomic.set(standard.getRatePerUnit());
        	}
        });
        if(BigDecimal.ZERO.compareTo(standardPriceAtomic.get()) != 0) {
        	return standardPriceAtomic.get();
        	
        }else {
			throw new ServiceException("{metalType} rate not available.", "ERR-ENG-022",
					"Rate not found in request for metal type code: " + metalTypeCode,
					Map.of("metalType", MetalTypeCodeEnum.valueOf(metalTypeCode).getValue()));
		}
		
	}

	@Override
	public PriceResponseDto getFinalPrice(PriceResponseDto priceResponseData) {
		priceResponseData
				.setFinalValue((priceResponseData.getPriceDetails().getMetalPriceDetails().getPreDiscountValue()
						.add(priceResponseData.getPriceDetails().getStonePriceDetails().getPreDiscountValue())
						.add(priceResponseData.getPriceDetails().getMakingChargeDetails().getPreDiscountValue()))
								.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));

		return priceResponseData;
	}

	@Override
	public GepPriceResponseDto calculateGepPrice(GepPriceRequest gepPriceRequest,
			GepPriceResponseDto gepPriceResponseDto, Date businessDate) {
		setInitialResponse(gepPriceRequest, gepPriceResponseDto);

		BigDecimal applicableDeductionPct = (gepPriceResponseDto.getStartDate() != null
				&& gepPriceResponseDto.getEndDate() != null
				&& businessDate.compareTo(gepPriceResponseDto.getStartDate()) >= 0
				&& businessDate.compareTo(gepPriceResponseDto.getEndDate()) <= 0)
						? gepPriceResponseDto.getSchemePercentage()
						: gepPriceResponseDto.getDeductionPercentage();
		gepPriceResponseDto.setDeductionPercentage(applicableDeductionPct);

		gepPriceResponseDto.setMeasuredWeight(gepPriceRequest.getMeasuredWeight());
		gepPriceResponseDto
				.setNetValue(gepPriceResponseDto.getRateForPurity().multiply(gepPriceRequest.getMeasuredWeight())
						.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
		gepPriceResponseDto.setDeductionValue(gepPriceResponseDto
				.getNetValue().multiply(applicableDeductionPct.divide(new BigDecimal(100),
						EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP))
				.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));

		gepPriceResponseDto.setSchemeValue(gepPriceResponseDto.getNetValue()
				.multiply(gepPriceResponseDto.getSchemePercentage().divide(new BigDecimal(100),
						EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP))
				.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
		gepPriceResponseDto
				.setFinalValue(gepPriceResponseDto.getNetValue().subtract(gepPriceResponseDto.getDeductionValue())
						.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));

		return gepPriceResponseDto;
	}

	/**
	 * @param gepPriceRequest
	 * @param gepPriceResponseDto
	 */
	private void setInitialResponse(GepPriceRequest gepPriceRequest, GepPriceResponseDto gepPriceResponseDto) {
		gepPriceResponseDto.setPurity(gepPriceRequest.getMeasuredPurity());
		BigDecimal karat = gepPriceRequest.getMeasuredPurity()
				.divide(new BigDecimal(100), EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
				.multiply(new BigDecimal(EngineConstants.MAX_KARAT));
		gepPriceResponseDto.setKarat(karat.setScale(EngineConstants.KARAT_SCALE, RoundingMode.HALF_UP));
		StandardPriceResponseDto standardPrice = gepPriceRequest.getStandardPrice().get(gepPriceRequest.getMetalType());
		if (standardPrice.getRatePerUnit() == null || standardPrice.getRatePerUnit()== BigDecimal.ZERO ){
			throw new ServiceException("{metalType} rate not available.", "ERR-ENG-022",
					"Rate not found in request for metal type code: " + gepPriceRequest.getMetalType(),
					Map.of("metalType", MetalTypeCodeEnum.valueOf(gepPriceRequest.getMetalType()).getValue()));
		}
		gepPriceResponseDto.setRatePerUnit(standardPrice.getRatePerUnit());
		gepPriceResponseDto
				.setWeightUnit(locationService.getCountryDetails(CommonUtil.getLocationCode()).getWeightUnit());
		gepPriceResponseDto.setRateForPurity(gepPriceResponseDto.getRatePerUnit()
				.divide(standardPrice.getPurity(), EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
				.multiply(gepPriceRequest.getMeasuredPurity()));
	}

}
