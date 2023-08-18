/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.dto.MakingChargeMarginDetailsDto;
import com.titan.poss.core.dto.MakingChargeMarginDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.core.utils.WeightCalculatorUtil;
import com.titan.poss.core.utils.WeightUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderPriceUtilService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service for price calculation.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesOrderPriceUtilService")
public class OrderPriceUtilServiceImpl implements OrderPriceUtilService {

	@Autowired
	private EngineService engineService;

	@Override
	public BigDecimal getMeasuredStandardWeight(BigDecimal measuredWeight, Short measuredQuantity,
			InventoryDetailsDao inventoryDao, String productGroupCode) {
		BigDecimal measuredStdWeight = BigDecimal.ZERO;
		if (measuredWeight != null && measuredQuantity != null) {
			engineService.checkWeightToleranceValue(productGroupCode, inventoryDao.getTotalWeight(), measuredWeight,
					inventoryDao.getTotalQuantity(), measuredQuantity);

			measuredStdWeight = measuredWeight;

		} else if (measuredWeight == null && measuredQuantity == null) {
			measuredStdWeight = inventoryDao.getTotalWeight().divide(
					BigDecimal.valueOf(inventoryDao.getTotalQuantity()), SalesConstants.DIVISION_SCALE,
					RoundingMode.HALF_UP);
		}
		return measuredStdWeight;
	}

	@Override
	public PriceResponseDto getMultiMetalVJsonData(Map<String, BigDecimal> materialMap, PriceDetailsDto priceDetailsOld,
			PriceResponseDto priceResponseDataNew, Map<String, MetalPriceDto> metalPriceDetailsOld) {
		BigDecimal sumV = BigDecimal.ZERO;

		List<MetalPriceDto> data = new ArrayList<>();
		for (Entry<String, BigDecimal> materialDetail : materialMap.entrySet()) {
			if ((materialDetail.getValue().compareTo(BigDecimal.ZERO) != 0)
					&& MetalTypeCodeEnum.getUniqueMetals().contains(materialDetail.getKey())) {
				MetalPriceDto pd = metalPriceDetailsOld.get(materialDetail.getKey());
				pd.setMetalValue(pd.getRatePerUnit().multiply(materialDetail.getValue())
						.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
				data.add(pd);
			}
		}

		for (MetalPriceDto priceData : data) {
			sumV = sumV.add(priceData.getMetalValue());
		}

		priceResponseDataNew.getPriceDetails().getMetalPriceDetails().setPreDiscountValue(sumV);
		priceResponseDataNew.getPriceDetails().getMetalPriceDetails().setMetalPrices(data);

		// set stone details from old to new response
		priceResponseDataNew.getPriceDetails().setStonePriceDetails(priceDetailsOld.getStonePriceDetails());

		return priceResponseDataNew;
	}

	@Override
	public PriceResponseDto getMetalVJsonData(PriceResponseDto priceResponseDataNew, String metalTypeCode,
			Map<String, MetalPriceDto> metalPriceDetailsOld) {

		MetalPriceDto pd = metalPriceDetailsOld.get(metalTypeCode);
		List<MetalPriceDto> data = new ArrayList<>();

		pd.setNetWeight(priceResponseDataNew.getPriceDetails().getNetWeight());
		pd.setMetalValue(priceResponseDataNew.getPriceDetails().getNetWeight().multiply(pd.getRatePerUnit())
				.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		data.add(pd);

		priceResponseDataNew.getPriceDetails().getMetalPriceDetails().setMetalPrices(data);
		priceResponseDataNew.getPriceDetails().getMetalPriceDetails().setPreDiscountValue(pd.getMetalValue());
		return priceResponseDataNew;
	}

	@Override
	public PriceResponseDto plainVCalculation(InventoryDetailsDao inventoryDao, PriceDetailsDto priceDetailsOld,
			PriceResponseDto priceResponseDataNew, BigDecimal measuredWeight, Short measuredQuantity) {

		if (StringUtil.isBlankJsonStr(inventoryDao.getTotalWeightDetails())) {
			throw new ServiceException(SalesConstants.JSON_DATA_FORMAT_ERROR, SalesConstants.ERR_CORE_013,
					"weight json is null in InventoryDetails table");
		}

		Map<String, BigDecimal> materialMap = WeightCalculatorUtil.getMaterialMap(inventoryDao.getTotalWeight(),
				inventoryDao.getTotalWeightDetails(), inventoryDao.getTotalWeight());

		BigDecimal materialWeight = materialMap.get(SalesConstants.MATERIAL_WEIGHT);
		priceResponseDataNew.getPriceDetails().getMaterialDetails().setMaterialWeight(materialWeight);
		// netWeight will be stdWeight-otherMaterialWeight
		BigDecimal measuredStdWeight = getMeasuredStandardWeight(measuredWeight, measuredQuantity, inventoryDao,
				priceResponseDataNew.getProductGroupCode()).subtract(materialWeight);

		priceResponseDataNew.getPriceDetails().setNetWeight(measuredStdWeight);
		priceResponseDataNew.setStdWeight(inventoryDao.getStdWeight());
		priceResponseDataNew = getMetalVJsonData(priceResponseDataNew, priceDetailsOld.getItemTypeCode(),
				priceDetailsOld.getMetalPriceDetails().getMetalPrices().stream()
						.collect(Collectors.toMap(MetalPriceDto::getMetalTypeCode, Function.identity())));

		return priceResponseDataNew;
	}

	@Override
	public PriceResponseDto plainF1Calculation(PriceResponseDto priceResponseDataNew) {

		priceResponseDataNew.getPriceDetails().getStonePriceDetails().setPreDiscountValue(BigDecimal.ZERO);
		return priceResponseDataNew;
	}

	@Override
	public PriceResponseDto plainF2Calculation(PriceDetailsDto priceDetailsOld, PriceResponseDto priceResponseDtoNew) {

		priceResponseDtoNew.getPriceDetails().setMakingChargeDetails(priceDetailsOld.getMakingChargeDetails());

		// recalculate MC charge and total MC%
		BigDecimal makingChargePer = BigDecimal.ZERO;
		BigDecimal makingCharge;

		makingChargePer = makingChargePer
				.add(priceResponseDtoNew.getPriceDetails().getMakingChargeDetails().getWastagePct());

		makingCharge = priceResponseDtoNew.getPriceDetails().getNetWeight()
				.multiply(priceResponseDtoNew.getPriceDetails().getMakingChargeDetails().getMakingChargePgram());		

		makingChargePer = makingChargePer
				.add(priceResponseDtoNew.getPriceDetails().getMakingChargeDetails().getMakingChargePct());
		

		boolean isOnlyMakingChargePgram = false;
		if (BigDecimal.ZERO.compareTo(makingChargePer) == 0) {
			isOnlyMakingChargePgram = true;
		}

		if (priceResponseDtoNew.getPriceDetails().getMetalPriceDetails().getPreDiscountValue()
				.compareTo(new BigDecimal(0)) == 0) {
			makingChargePer = BigDecimal.ZERO;
		} else {
			makingChargePer = makingChargePer.add(makingCharge
					.divide(priceResponseDtoNew.getPriceDetails().getMetalPriceDetails().getPreDiscountValue(),
							SalesConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
					.multiply(new BigDecimal(100)));
		}

		// round off is not required when only isOnlyMakingChargePgram is present, as it
		// will lead to difference in making charge value
		if (!isOnlyMakingChargePgram || BigDecimal.ZERO.compareTo(makingChargePer) == 0) {
			// UAT_1620: reported difference in calculation before and after round off
			makingChargePer = makingChargePer.setScale(SalesConstants.PERCENT_SCALE, RoundingMode.HALF_UP);
			// need to recalculate making charge, only when isOnlyMakingChargePgram is
			// false, else making charge is calculated previously.
			// removed recalculation with overall % due to UAT defect 2021.
			makingCharge = makingCharge.add(makingChargePer.divide(new BigDecimal(100))
					.multiply(priceResponseDtoNew.getPriceDetails().getMetalPriceDetails().getPreDiscountValue()));
		}

		// round off will happen if only MakingChargePgram is present.
		makingChargePer = makingChargePer.setScale(SalesConstants.PERCENT_SCALE, RoundingMode.HALF_UP);
		makingCharge = makingCharge.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
		priceResponseDtoNew.getPriceDetails().getMakingChargeDetails().setMakingChargePercentage(makingChargePer);
		priceResponseDtoNew.getPriceDetails().getMakingChargeDetails().setPreDiscountValue(makingCharge);

		return priceResponseDtoNew;
	}

	@Override
	public PriceResponseDto studdedVCalculation(PriceDetailsDto priceDetailsOld, PriceResponseDto priceResponseDataNew,
			BigDecimal measuredWeight, Short measuredQuantity, InventoryDetailsDao inventoryDao) {
		BigDecimal measuredStdWeight = getMeasuredStandardWeight(measuredWeight, measuredQuantity, inventoryDao,
				priceResponseDataNew.getProductGroupCode());

		// copy stone and material details
		priceResponseDataNew.getPriceDetails().setStonePriceDetails(priceDetailsOld.getStonePriceDetails());
		priceResponseDataNew.getPriceDetails().setMaterialDetails(priceDetailsOld.getMaterialDetails());

		// NOTE: need the map without measured weight
		Map<String, BigDecimal> weightDetailsMap = WeightCalculatorUtil.getMaterialMap(inventoryDao.getTotalWeight(),
				inventoryDao.getTotalWeightDetails(), inventoryDao.getTotalWeight());

		// Weight in gm (stoneWeight + diamondWeight + otherMaterialWeight)
		BigDecimal totalMaterialWeight = weightDetailsMap.get(SalesConstants.STONE_WEIGHT)
				.add(weightDetailsMap.get(SalesConstants.DIAMOND_WEIGHT));
		if (weightDetailsMap.get(SalesConstants.MATERIAL_WEIGHT) != null) {
			totalMaterialWeight = totalMaterialWeight.add(weightDetailsMap.get(SalesConstants.MATERIAL_WEIGHT));
		}

		priceResponseDataNew.getPriceDetails().setNetWeight(measuredStdWeight.subtract(totalMaterialWeight));

		// if net weight is 0, then no need for calculation
		Map<String, MetalPriceDto> metalPriceDetailsOld = priceDetailsOld.getMetalPriceDetails().getMetalPrices()
				.stream().collect(Collectors.toMap(MetalPriceDto::getMetalTypeCode, Function.identity()));
		if (BigDecimal.ZERO.compareTo(priceResponseDataNew.getPriceDetails().getNetWeight()) == 0) {
			metalPriceDetailsOld.get(priceDetailsOld.getItemTypeCode()).setRatePerUnit(BigDecimal.ZERO);
		}

		priceResponseDataNew = getMetalVJsonData(priceResponseDataNew, priceDetailsOld.getItemTypeCode(),
				metalPriceDetailsOld);
		return priceResponseDataNew;
	}

	@Override
	public PriceResponseDto studdedF1Calculation(PriceDetailsDto priceDetailsOld,
			PriceResponseDto priceResponseDataNew) {
		// copy stone price details from old to new
		priceResponseDataNew.getPriceDetails().setStonePriceDetails(priceDetailsOld.getStonePriceDetails());

		return priceResponseDataNew;
	}

	@Override
	public PriceResponseDto studdedF2Calculation(PriceResponseDto priceResponseDataNew,
			OrderDetailsConfigDaoExt orderDetailsConfig,PriceDetailsDto priceResponseDataOld) {

		if(priceResponseDataOld!=null && BooleanUtils.isTrue(priceResponseDataOld.getMakingChargeDetails().getIsSplit())) {
			priceResponseDataNew.getPriceDetails().setMakingChargeDetails(priceResponseDataOld.getMakingChargeDetails());
		} else {
		
		priceResponseDataNew.getPriceDetails().getMakingChargeDetails().setIsDynamic(true);

		BigDecimal sumOfVandF1 = priceResponseDataNew.getPriceDetails().getStonePriceDetails().getPreDiscountValue()
				.add(priceResponseDataNew.getPriceDetails().getMetalPriceDetails().getPreDiscountValue());

		BigDecimal cfaLevelMkingChargePercentage = getCfaLevelMakingChargePercentage(sumOfVandF1, priceResponseDataNew,
				orderDetailsConfig);

		BigDecimal skuLevelMkingChargePercentage = getSkuLevelMakingChargePercentage(cfaLevelMkingChargePercentage,
				orderDetailsConfig.getPriceFactor());

		// MC % with round off
		BigDecimal makingChargePercentage = skuLevelMkingChargePercentage
				.multiply(orderDetailsConfig.getMakingChargeMarkupFactor())
				.setScale(SalesConstants.PERCENT_SCALE, RoundingMode.HALF_UP);
		priceResponseDataNew.getPriceDetails().getMakingChargeDetails()
				.setMakingChargePercentage(makingChargePercentage);

		priceResponseDataNew.getPriceDetails().getMakingChargeDetails()
				.setPreDiscountValue(makingChargePercentage.divide(new BigDecimal(100)).multiply(sumOfVandF1)
						.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		}
		return priceResponseDataNew;
	}

	@Override
	public PriceResponseDto multiMetalVCalculation(InventoryDetailsDao inventoryDao, PriceDetailsDto priceDetailsOld,
			PriceResponseDto priceResponseDataNew, BigDecimal measuredWeight, Short measuredQuantity) {
		Map<String, BigDecimal> materialMap = null;

		BigDecimal measuredStdWeight;
		if (measuredWeight != null) {
			engineService.checkWeightToleranceValue(priceResponseDataNew.getProductGroupCode(),
					inventoryDao.getTotalWeight(), measuredWeight, inventoryDao.getTotalQuantity(), measuredQuantity);
			String weightDetails = WeightUtil.calculateWeightDetails(
					inventoryDao.getTotalWeight().divide(BigDecimal.valueOf(inventoryDao.getTotalQuantity()),
							SalesConstants.DIVISION_SCALE, DomainConstants.ROUNDIND_MODE),
					inventoryDao.getTotalWeightDetails(), measuredWeight);

			materialMap = getUpdatedMaterialMap(weightDetails);
			// take updated metal values only
			measuredStdWeight = getMultiMetalNetWeight(materialMap);

		} else {

			materialMap = getUpdatedMaterialMap(inventoryDao.getTotalWeightDetails());
			measuredStdWeight = getMultiMetalNetWeight(materialMap);
			// netWeight will be stdWeight-otherMaterialWeight
		}

		setMulltiMaterialMaterialWeight(priceResponseDataNew, materialMap);
		priceResponseDataNew.getPriceDetails().setNetWeight(measuredStdWeight);
		priceResponseDataNew = getMultiMetalVJsonData(materialMap, priceDetailsOld, priceResponseDataNew,
				priceDetailsOld.getMetalPriceDetails().getMetalPrices().stream()
						.collect(Collectors.toMap(MetalPriceDto::getMetalTypeCode, Function.identity())));

		return priceResponseDataNew;
	}

	@Override
	public PriceResponseDto getFinalPrice(PriceResponseDto priceResponseDataNew) {
		priceResponseDataNew
				.setFinalValue((priceResponseDataNew.getPriceDetails().getMetalPriceDetails().getPreDiscountValue()
						.add(priceResponseDataNew.getPriceDetails().getStonePriceDetails().getPreDiscountValue())
						.add(priceResponseDataNew.getPriceDetails().getMakingChargeDetails().getPreDiscountValue()))
								.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));

		return priceResponseDataNew;
	}

	@Override
	public BigDecimal getMaterialPrice(Map<String, StandardPriceResponseDto> standardPrice, String metalTypeCode) {
		if (CollectionUtils.isEmpty(standardPrice)) {
			throw new ServiceException(
					"No metal rate set for the day. Please contact commercial helpdesk and get the metal rate password",
					"ERR-ENG-003");
		}

		if (standardPrice.get(metalTypeCode) != null) {

			return standardPrice.get(metalTypeCode).getRatePerUnit();
		} else {
			throw new ServiceException("{metalType} rate not available.", "ERR-ENG-022",
					"Rate not found in request for metal type code: " + metalTypeCode,
					Map.of("metalType", MetalTypeCodeEnum.valueOf(metalTypeCode).getValue()));
		}
	}

	private BigDecimal getCfaLevelMakingChargePercentage(BigDecimal sumOfVandF1, PriceResponseDto priceResponseDataNew,
			OrderDetailsConfigDaoExt orderDetailsConfig) {

		log.info("V + F1: {}, product group: {}, number of stones: {}", sumOfVandF1,
				priceResponseDataNew.getProductGroupCode(),
				priceResponseDataNew.getPriceDetails().getStonePriceDetails().getNumberOfStones());
		MakingChargeMarginDetailsDto makingChargeMarginDetailsDto = MapperUtil.mapJsonDataToClass(
				orderDetailsConfig.getMakingChargeMarginDetails(), MakingChargeMarginDetailsDto.class);

		if (makingChargeMarginDetailsDto == null
				|| CollectionUtil.isEmpty(makingChargeMarginDetailsDto.getMarginDetails())) {
			throw new ServiceException(
					"Price configurations not found for the product group, please contact Commercial Team.",
					"ERR-ENG-028", "Product group code: " + priceResponseDataNew.getProductGroupCode());
		}

		MakingChargeMarginDto validMargin = null;
		int count = 0;
		for (MakingChargeMarginDto makingChargeMargin : makingChargeMarginDetailsDto.getMarginDetails()) {
			if (sumOfVandF1.compareTo(makingChargeMargin.getFromPrice()) >= 0
					&& sumOfVandF1.compareTo(makingChargeMargin.getToPrice()) <= 0) {
				validMargin = makingChargeMargin;
				count++;
			}
		}

		if (count == 0) {
			throw new ServiceException(
					"Price configurations not found for the product group, please contact Commercial Team.",
					"ERR-ENG-028", "Product group code: " + priceResponseDataNew.getProductGroupCode());
		}

		else if (count > 1) {
			throw new ServiceException(
					"Multiple price configurations found for the product group, please contact Commercial Team.",
					"ERR-ENG-031", "Product group : " + priceResponseDataNew.getProductGroupCode());
		}

		// for AB -- no need to set the margin details

		// need to return percentage
		return validMargin.getMargin().multiply(new BigDecimal(100)).divide(
				new BigDecimal(100).subtract(validMargin.getMargin()), SalesConstants.PERCENT_SCALE,
				RoundingMode.HALF_UP);

	}

	private BigDecimal getSkuLevelMakingChargePercentage(BigDecimal cfaLevelMkingChargePercentage,
			BigDecimal priceFactor) {
		return cfaLevelMkingChargePercentage.multiply(priceFactor);
	}

	private BigDecimal getMultiMetalNetWeight(Map<String, BigDecimal> materialMap) {

		BigDecimal updatedNetWeight = BigDecimal.ZERO;
		// sum of gold platinum silver updated weight
		if (materialMap.containsKey(SalesConstants.GOLD_WEIGHT)) {
			updatedNetWeight = updatedNetWeight.add(materialMap.get(SalesConstants.GOLD_WEIGHT));
		}
		if (materialMap.containsKey(SalesConstants.SILVER_WEIGHT)) {
			updatedNetWeight = updatedNetWeight.add(materialMap.get(SalesConstants.SILVER_WEIGHT));
		}
		if (materialMap.containsKey(SalesConstants.PLATINUM_WEIGHT)) {
			updatedNetWeight = updatedNetWeight.add(materialMap.get(SalesConstants.PLATINUM_WEIGHT));
		}

		return updatedNetWeight;
	}

	private void setMulltiMaterialMaterialWeight(PriceResponseDto priceResponseData,
			Map<String, BigDecimal> materialMap) {
		BigDecimal materialWeight = materialMap.get(SalesConstants.MATERIAL_WEIGHT);
		priceResponseData.getPriceDetails().getMaterialDetails().setMaterialWeight(materialWeight);
	}

	private Map<String, BigDecimal> getUpdatedMaterialMap(String weightDetails) {
		Map<String, BigDecimal> materialMap = new HashMap<>();
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(weightDetails);
			JsonNode dataNode = root.path("data");

			if (!dataNode.isMissingNode()) {
				if (dataNode.hasNonNull(SalesConstants.GOLD_WEIGHT))
					materialMap.put(MetalTypeCodeEnum.J.toString(),
							new BigDecimal(dataNode.path(SalesConstants.GOLD_WEIGHT).asText()));
				if (dataNode.hasNonNull(SalesConstants.SILVER_WEIGHT))
					materialMap.put(MetalTypeCodeEnum.P.toString(),
							new BigDecimal(dataNode.path(SalesConstants.SILVER_WEIGHT).asText()));
				if (dataNode.hasNonNull(SalesConstants.PLATINUM_WEIGHT))
					materialMap.put(MetalTypeCodeEnum.L.toString(),
							new BigDecimal(dataNode.path(SalesConstants.PLATINUM_WEIGHT).asText()));
				if (dataNode.hasNonNull(SalesConstants.MATERIAL_WEIGHT))
					materialMap.put(SalesConstants.MATERIAL_WEIGHT,
							new BigDecimal(dataNode.path(SalesConstants.MATERIAL_WEIGHT).asText()));
				if (dataNode.hasNonNull(SalesConstants.STONE_WEIGHT))
					materialMap.put(SalesConstants.STONE_WEIGHT,
							new BigDecimal(dataNode.path(SalesConstants.STONE_WEIGHT).asText()));
				if (dataNode.hasNonNull(SalesConstants.DIAMOND_WEIGHT))
					materialMap.put(SalesConstants.DIAMOND_WEIGHT,
							new BigDecimal(dataNode.path(SalesConstants.DIAMOND_WEIGHT).asText()));
			}
		} catch (IOException e) {
			throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR-CORE-003");
		}

		return materialMap;
	}
}
