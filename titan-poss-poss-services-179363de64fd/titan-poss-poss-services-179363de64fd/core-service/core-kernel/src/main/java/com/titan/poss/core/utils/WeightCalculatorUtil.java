/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.utils;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.response.JsonData;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class WeightCalculatorUtil {

	private WeightCalculatorUtil() {

	}

	public static String calculateWeightDetails(BigDecimal actualUnitWeight, String weightDetails,
			BigDecimal measuredUnitWeight) {

		Map<String, BigDecimal> measuredWeightDetail = getMaterialMap(actualUnitWeight, weightDetails,
				measuredUnitWeight);

		Map<String, Object> measuredWeightDetails = new LinkedHashMap<>();
		measuredWeightDetails.put("type", CommonConstants.WEIGHT_DETAILS);
		measuredWeightDetails.put("data", measuredWeightDetail);

		return MapperUtil.getStringFromJson(measuredWeightDetails);

	}

	public static Map<String, BigDecimal> getMaterialMap(BigDecimal actualUnitWeight, String weightDetails,
			BigDecimal measuredUnitWeight) {
		JsonData jsonData = MapperUtil.mapObjToClass(weightDetails, JsonData.class);
		Object weightDetailsJson;
		if (!StringUtil.isBlankJsonData(jsonData)) {
			weightDetailsJson = jsonData.getData();
		} else {
			weightDetailsJson = MapperUtil.getJsonFromString(weightDetails);
		}

		BigDecimal actualGoldWeight = getBigDecimalValueFromJsonField(weightDetailsJson, "goldWeight");
		BigDecimal actualPlatinumWeight = getBigDecimalValueFromJsonField(weightDetailsJson, "platinumWeight");
		BigDecimal actualSilverWeight = getBigDecimalValueFromJsonField(weightDetailsJson, "silverWeight");
		BigDecimal actualStoneWeight = getBigDecimalValueFromJsonField(weightDetailsJson, "stoneWeight");
		BigDecimal actualDiamondWeight = getBigDecimalValueFromJsonField(weightDetailsJson, "diamondWeight");
		BigDecimal actualOtherMaterialWeight = getBigDecimalValueFromJsonField(weightDetailsJson, "materialWeight");

		BigDecimal otherWeights = actualStoneWeight.add(actualDiamondWeight).add(actualOtherMaterialWeight);

		BigDecimal proportionalWeight = ((measuredUnitWeight.subtract(otherWeights))
				.divide(actualUnitWeight.subtract(otherWeights), 5, RoundingMode.HALF_UP));

		MathContext precision = new MathContext(5);

		BigDecimal measuredGoldWeight = proportionalWeight.multiply(actualGoldWeight).round(precision);
		BigDecimal measuredPlatinumWeight = proportionalWeight.multiply(actualPlatinumWeight).round(precision);
		BigDecimal measuredSilverWeight = proportionalWeight.multiply(actualSilverWeight).round(precision);

		Map<String, BigDecimal> measuredWeightDetail = new HashMap<>();
		measuredWeightDetail.put("goldWeight", measuredGoldWeight);
		measuredWeightDetail.put("platinumWeight", measuredPlatinumWeight);
		measuredWeightDetail.put("silverWeight", measuredSilverWeight);
		measuredWeightDetail.put("stoneWeight", actualStoneWeight);
		measuredWeightDetail.put("diamondWeight", actualDiamondWeight);
		measuredWeightDetail.put("materialWeight", actualOtherMaterialWeight);
		return measuredWeightDetail;
	}

	public static BigDecimal getBigDecimalValueFromJsonField(Object weightDetailsJson, String fieldName) {
		String value = JsonUtils.getValueFromJsonString(weightDetailsJson, fieldName);

		return (isNumber(value)) ? BigDecimal.valueOf(Double.valueOf(value)) : BigDecimal.ZERO;

	}

	public static boolean isNumber(String value) {
		if (value == null) {
			return false;
		}
		try {
			Double.parseDouble(value);
		} catch (NumberFormatException e) {
			return false;
		}
		return true;
	}

}
