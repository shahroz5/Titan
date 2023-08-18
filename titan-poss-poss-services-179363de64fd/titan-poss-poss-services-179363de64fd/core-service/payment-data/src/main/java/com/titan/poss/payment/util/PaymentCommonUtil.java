/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.FieldDetailDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PaymentCommonUtil {

	/**
	 * @param fieldDetail
	 * @return List<FieldDetailDto>
	 */
	public List<FieldDetailDto> getFieldDetails(String fieldDetail) {
		List<FieldDetailDto> fieldDetails = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		try {
			JsonNode actualObj = mapper.readTree(fieldDetail);
			for (int i = 0; i < actualObj.size(); i++) {
				FieldDetailDto fieldDetailDto = mapper.treeToValue(actualObj.get(i), FieldDetailDto.class);
				fieldDetails.add(fieldDetailDto);
			}
		} catch (IOException e) {
			throw new ServiceException("Error in Dto Mapping", "ERR-CORE-015");
		}

		return fieldDetails;
	}

	/**
	 *
	 * @param inputDate
	 * @return boolean
	 */
	public static boolean dateValidation(Date inputDate, Date validFrom) {

		Long validityDays = CalendarUtils.getDayDiff(validFrom, inputDate);
		//update to business date.
		Long diffDays = CalendarUtils.getDayDiff(new Date(), inputDate);

		return validityDays <= 1095 && diffDays <= 90;
	}

	public static Long dateDifference(Date inputDate, Date validFrom) {

		return CalendarUtils.getDayDiff(validFrom, inputDate);
	}
}
