/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.utils;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.titan.poss.core.dto.BrandConfigDetails;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dto.InventoryItemDetailsDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class InventoryUtil {

	private InventoryUtil() {

	}

	public static void createAndUpdateItemDetails(String itemDetails, InventoryDetailsDaoExt invDetails, Integer docNo,
			Date docDate) {

		if(itemDetails != null) {
			JsonNode root;
			JsonNode dataNode = null;
			InventoryItemDetailsDto itemDetailsImp = null;
			try {
				root = MapperUtil.getObjectMapperInstance().readTree(itemDetails);
				dataNode = root.path("data");
				itemDetailsImp = MapperUtil.getObjectMapperInstance().convertValue(dataNode, InventoryItemDetailsDto.class);
				if(itemDetailsImp != null) {
					itemDetailsImp.setDocDate(docDate);
					itemDetailsImp.setDocNo(docNo);
				}
			} catch (IOException e) {
				throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR_CORE_003");
			}
			if(itemDetailsImp != null) {
				JsonData itemDetailsImprt = new JsonData("ITEM_DETAILS", itemDetailsImp);

				invDetails.setItemDetails(MapperUtil.getStringFromJson(itemDetailsImprt));
			}else {
				invDetails.setItemDetails("{}");
			}
		}
		else {
			invDetails.setItemDetails("{}");
		}
		

	}

	public static Short checkPrintMaxConfig(BrandDto brandDto, Short currentPrintValue) {

		BrandConfigDetails configDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(brandDto.getConfigDetails().getData(), BrandConfigDetails.class);
		if (currentPrintValue == null) {
			currentPrintValue = 1;
		} else if (currentPrintValue >= configDetails.getNumberOfPrintsAllowed()) {
			throw new ServiceException("Reached max configuration print Limit: please contact admin", "ERR-INV-042");
		} else {
			currentPrintValue = (short) (currentPrintValue.intValue() + 1);
		}
		return currentPrintValue;

	}
	
	public static String printAmount(String priceInWords) {
		String HYPHEN = "-";
	 	String SPACE = " ";
	 	String BLANK = "";
	 	List<String> highSeriesList = Arrays.asList("Crore","Lakh","Thousand","Hundred","And");
		List<String> priceWordsList = Arrays.asList(priceInWords.split(SPACE));
		String temp=BLANK;
		String finalString=BLANK;
		for(String priceWord : priceWordsList) {
			temp=temp+priceWord+SPACE;
			if(highSeriesList.contains(priceWord)) {
				temp = temp.replace(priceWord, BLANK).trim().replace(SPACE, HYPHEN);
				finalString = finalString + (temp.isBlank() ? BLANK : temp + SPACE)  +  priceWord +SPACE;
				temp=BLANK;
			}
			
		}
		return (finalString + temp.trim().replace(SPACE, HYPHEN)).toLowerCase();
	}

}
