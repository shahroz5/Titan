/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.util;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.util.CollectionUtils;

import com.google.gson.JsonObject;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.MissingFieldCheckDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class VendorUtil {

	private VendorUtil() {
		throw new IllegalArgumentException("VendorUtil class");
	}

	private static final String USER_NAME = "userName";
	private static final String PASS_WORD = "password";

	public static Set<String> listMissingFields(List<MissingFieldCheckDto> fields) {
		Set<String> missingFields = new HashSet<>();
		if (CollectionUtils.isEmpty(fields))
			return missingFields;
		for (int i = 0; i < fields.size(); i++) {
			addIfMissing(fields.get(i).getValue(), fields.get(i).getFieldName(), missingFields);
		}
		return missingFields;
	}

	private static void addIfMissing(String val, String fieldName, Set<String> missingFields) {
		if (StringUtils.isBlank(val))
			missingFields.add(fieldName);
	}

	public static List<MissingFieldCheckDto> checkCommonMissingFieldInHeader(VendorDao vendor,
			List<MissingFieldCheckDto> fieldsCheck) {

		fieldsCheck.add(new MissingFieldCheckDto(vendor.getBaseurl(), "base url"));
		fieldsCheck.add(new MissingFieldCheckDto(vendor.getPort(), "port"));

		fieldsCheck.add(new MissingFieldCheckDto(vendor.getWebServiceType(), "protocol"));
		return fieldsCheck;
	}

	public static List<MissingFieldCheckDto> checkCommonMissingJsonFieldInHeader(List<MissingFieldCheckDto> fieldsCheck,
			JsonObject jsonObjectData) {

		String userName = JsonUtils.getValueFromJsonWithNullCheck(jsonObjectData, USER_NAME);
		String password = JsonUtils.getValueFromJsonWithNullCheck(jsonObjectData, PASS_WORD);

		fieldsCheck.add(new MissingFieldCheckDto(userName, USER_NAME));
		fieldsCheck.add(new MissingFieldCheckDto(password, PASS_WORD));

		return fieldsCheck;
	}

}
