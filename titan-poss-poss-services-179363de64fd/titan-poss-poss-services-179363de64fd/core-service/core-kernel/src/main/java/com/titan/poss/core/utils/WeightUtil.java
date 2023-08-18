/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.utils;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import com.titan.poss.core.domain.constant.CommonConstants;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class WeightUtil {

	private WeightUtil() {
	}

	@SuppressWarnings("unchecked")
	public static String calculateWeightDetails(BigDecimal actualUnitWeight, String actualWeightDetails,
			BigDecimal measuredUnitWeight) {
		Map<Object, Object> weightDetailsJson = (Map<Object, Object>) MapperUtil.getJsonFromString(actualWeightDetails);
		BigDecimal otherWeight = BigDecimal.ZERO;
		Map<String, BigDecimal> measuredWeightDetail = new HashMap<>();
		String stoneWeight = JsonUtils.getValueFromJsonString(weightDetailsJson.get("data"), "stoneWeight");
		// kept 5 decimals as conversion from gm to carat needs precision
		// changed back to 3 decimals for billing calculation
		if (stoneWeight != null && !stoneWeight.isEmpty()) {
			BigDecimal actualStoneWeight = new BigDecimal(stoneWeight);
			otherWeight = otherWeight.add(actualStoneWeight.multiply(BigDecimal.valueOf(0.2)));
			measuredWeightDetail.put("stoneWeight", actualStoneWeight.setScale(3, RoundingMode.HALF_UP));
		}
		String diamondWeight = JsonUtils.getValueFromJsonString(weightDetailsJson.get("data"), "diamondWeight");
		// kept 5 decimals as conversion from gm to carat needs precision
		// changed back to 3 decimals for billing calculation
		if (diamondWeight != null && !diamondWeight.isEmpty()) {
			BigDecimal actualStoneWeight = new BigDecimal(diamondWeight);
			otherWeight = otherWeight.add(actualStoneWeight.multiply(BigDecimal.valueOf(0.2)));
			measuredWeightDetail.put("diamondWeight", actualStoneWeight.setScale(3, RoundingMode.HALF_UP));
		}
		String otherMaterialWeight = JsonUtils.getValueFromJsonString(weightDetailsJson.get("data"), "materialWeight");
		if (otherMaterialWeight != null && !otherMaterialWeight.isEmpty()) {
			BigDecimal actualOtherMaterialWeight = new BigDecimal(otherMaterialWeight);
			otherWeight = otherWeight.add(actualOtherMaterialWeight);
			measuredWeightDetail.put("materialWeight", actualOtherMaterialWeight.setScale(3, RoundingMode.HALF_UP));
		}
		if (actualUnitWeight.subtract(otherWeight).compareTo(BigDecimal.ZERO) > 0) {
			getMeasuredWeightDetail(actualUnitWeight, measuredUnitWeight, weightDetailsJson, otherWeight,
					measuredWeightDetail);
		}
		Map<String, Object> measuredWeightDetails = new LinkedHashMap<>();
		measuredWeightDetails.put("type", CommonConstants.WEIGHT_DETAILS);
		measuredWeightDetails.put("data", measuredWeightDetail);
		return MapperUtil.getStringFromJson(measuredWeightDetails);
	}

	private static Map<String, BigDecimal> getMeasuredWeightDetail(BigDecimal actualUnitWeight,
			BigDecimal measuredUnitWeight, Map<Object, Object> weightDetailsJson, BigDecimal otherWeight,
			Map<String, BigDecimal> measuredWeightDetail) {
		BigDecimal ratio = (measuredUnitWeight.subtract(otherWeight)).divide(actualUnitWeight.subtract(otherWeight),
				MathContext.DECIMAL32);
		String goldWeight = JsonUtils.getValueFromJsonString(weightDetailsJson.get("data"), "goldWeight");
		if (goldWeight != null && !goldWeight.isEmpty()) {
			BigDecimal actualGoldWeight = new BigDecimal(goldWeight);
			BigDecimal measuredGoldWeight = actualGoldWeight.multiply(ratio);
			measuredWeightDetail.put("goldWeight", measuredGoldWeight.setScale(3, RoundingMode.HALF_UP));
		}
		String platinumWeight = JsonUtils.getValueFromJsonString(weightDetailsJson.get("data"), "platinumWeight");
		if (platinumWeight != null && !platinumWeight.isEmpty()) {
			BigDecimal actualPlatinumWeight = new BigDecimal(platinumWeight);
			BigDecimal measuredPlatinumWeight = actualPlatinumWeight.multiply(ratio);
			measuredWeightDetail.put("platinumWeight", measuredPlatinumWeight.setScale(3, RoundingMode.HALF_UP));
		}
		String silverWeight = JsonUtils.getValueFromJsonString(weightDetailsJson.get("data"), "silverWeight");
		if (silverWeight != null && !silverWeight.isEmpty()) {
			BigDecimal actualSilverWeight = new BigDecimal(silverWeight);
			BigDecimal measuredSilverWeight = actualSilverWeight.multiply(ratio);
			measuredWeightDetail.put("silverWeight", measuredSilverWeight.setScale(3, RoundingMode.HALF_UP));
		}
		return measuredWeightDetail;
	}
}
