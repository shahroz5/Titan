/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.utils;

import java.beans.PropertyDescriptor;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
public class MapperUtil {

	private static final String CONCAT = "CONCAT('%',\'\"";

	private static final String LIKE = " LIKE ";

	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	private static final String ERR_CORE_003 = "ERR-CORE-003";

	private static final String ERR_CORE_027 = "ERR-CORE-027";

	private static Map<Object, Object> emptyMap = new LinkedHashMap<>();

	private MapperUtil() {
		throw new IllegalStateException("MapperUtil class");
	}

	/**
	 * Returns the destination Dto Object after mapping data from Source DAO Object
	 * 
	 * @param source           Dao class object that has data
	 * @param destinationClass .class for the Dto instance
	 * @return Dto Object
	 */
	public static Object getDtoMapping(Object source, Class<?> destinationClass, String... ignoreProperties) {
		Object destObject;
		try {
			destObject = destinationClass.getDeclaredConstructor().newInstance();
		} catch (Exception e) {
			throw new ServiceException("Error in Dto Mapping", "ERR-CORE-015");
		}
		beanMapping(source, destObject, ignoreProperties);
		return destObject;
	}

	public static void beanMapping(Object sourceObj, Object destinationObj, String... ignoreProperties) {
		BeanUtils.copyProperties(sourceObj, destinationObj, ignoreProperties);
	}

	/**
	 * Returns the updated Destination Object after mapping data from Source Object
	 * without mapping null values of the Source Object.
	 * 
	 * @param source      object which is the source
	 * @param destination object which is the destination
	 * @return Dto Object
	 */
	public static Object getObjectMapping(Object source, Object destination, String... ignoreProperties) {

		String[] allIgnoreFields = StringUtil.merge2StringArray(ignoreProperties, getNullOrEmptyStringField(source));

		BeanUtils.copyProperties(source, destination, allIgnoreFields);

		return destination;
	}

	public static String[] getNullOrEmptyStringField(Object source) {
		final BeanWrapper src = new BeanWrapperImpl(source);
		PropertyDescriptor[] pds = src.getPropertyDescriptors();

		Set<String> ignoreNames = new HashSet<>();
		for (PropertyDescriptor pd : pds) {
			Object srcValue = src.getPropertyValue(pd.getName());
			if (srcValue == null || pd.getPropertyType() == String.class && StringUtils.isBlank((String) srcValue))
				ignoreNames.add(pd.getName());
		}

		String[] result = new String[ignoreNames.size()];
		return ignoreNames.toArray(result);
	}

	public static <T> T mapObjToClass(Object obj, Class<T> className) {

		if (obj == null)
			return null;

		if (obj instanceof String)
			obj = MapperUtil.getJsonFromString(obj.toString());

		return getObjectMapperInstance().convertValue(obj, className);
	}

	public static <T> T mapJsonDataToClass(Object obj, Class<T> className) {

		JsonData jsonData = mapObjToClass(obj, JsonData.class);

		if (jsonData == null || jsonData.getData() == null)
			return null;

		return getObjectMapperInstance().convertValue(jsonData.getData(), className);
	}

	public static String queryGeneratorForDetails(Object source, Class<?> className, String details) {

		final BeanWrapper src = new BeanWrapperImpl(source);
		PropertyDescriptor[] pds = src.getPropertyDescriptors();

		StringBuilder query = new StringBuilder("SELECT r FROM " + className.getName() + " r WHERE ");

		boolean firstProperty = true;
		boolean firstIterate = true;

		for (PropertyDescriptor pd : pds) {

			if (firstIterate) {

				firstIterate = false;

			} else {

				Object srcValue = src.getPropertyValue(pd.getName());

				if (srcValue != null) {

					if (firstProperty) {

						query.append("(r." + details + LIKE + CONCAT + pd.getName() + "\":\"" + srcValue + "\"\','%')"
								+ " OR r." + details + LIKE + CONCAT + pd.getName() + "\":" + srcValue + "\','%'))");

						firstProperty = false;

					} else {

						query.append(" AND (r." + details + LIKE + CONCAT + pd.getName() + "\":\"" + srcValue
								+ "\"\','%')" + " OR r." + details + LIKE + CONCAT + pd.getName() + "\":" + srcValue
								+ "\','%'))");

					}

				}

			}

		}

		if (firstProperty) {
			query = new StringBuilder("SELECT r FROM " + className.getName() + " r");
		}

		return query.toString();

	}

	public static Object getJsonFromString(String jsonString) {
		return getJsonFromString(jsonString, true);

	}

	public static Object getJsonFromString(String jsonString, boolean throwError) {

		if (StringUtils.isEmpty(jsonString)) {
			return emptyMap;
		}
		ObjectMapper objectMapper = getObjectMapperInstance();

		Map<Object, Object> obj = null;
		try {
			obj = objectMapper.readValue(jsonString, new TypeReference<Map<Object, Object>>() {
			});
		} catch (IOException e) {
			if (throwError)
				throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003, jsonString);
		}
		return obj;

	}

	public static <T> List<T> jsonStrToList(String jsonStr, Class<T> className) {

		if (StringUtils.isBlank(jsonStr))
			return Collections.emptyList();

		ObjectMapper objectMapper = getObjectMapperInstance();
		CollectionType javaType = objectMapper.getTypeFactory().constructCollectionType(List.class, className);

		List<T> asList;
		try {
			asList = objectMapper.readValue(jsonStr, javaType);
		} catch (Exception e) {
			log.debug("{}", e);
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003, jsonStr);
		}
		return asList;
	}

//	public static <T> List<T> objToList(Object obj, Class<T> className) {
//
//		if (obj == null)
//			return Collections.emptyList();
//
//		Response response = new Response();
//		T[] t_array = response.readEntity(object);
//		List<T> t_arraylist = Arrays.asList(t_array);
//		return asList;
//	}

	public static String getStringFromJson(Object o) {
		if (o == null) {
			o = emptyMap;
		}
		ObjectMapper objectMapper = getObjectMapperInstance();
		if (!(o instanceof Map)) {
			try {
				o = objectMapper.convertValue(o, Map.class);
			} catch (Exception ex) {
				throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003, o);
			}
		}

		String source = "";
		try {
			if (o != null)
				source = objectMapper.writeValueAsString(o);
			else
				source = objectMapper.writeValueAsString(emptyMap);
		} catch (JsonProcessingException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		return source;
	}

	public static String getJsonString(Object o) {
		ObjectMapper mapper = new ObjectMapper();
		String jsonInString = null;
		try {
			jsonInString = mapper.writeValueAsString(o);
		} catch (JsonProcessingException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		return jsonInString;
	}

	public static ObjectMapper getObjectMapperInstance() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
		objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		return objectMapper;
	}

	public static String mergeJsonObjects(Object sourceObj, Object destinitionObj) {

		if (!(sourceObj instanceof Map) || !(destinitionObj instanceof Map)) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}

		String mergedResult = null;
		try {
			ObjectMapper objectMapper = getObjectMapperInstance();
			String source = objectMapper.writeValueAsString(sourceObj);
			String destinition = objectMapper.writeValueAsString(destinitionObj);
			Map<Object, Object> sourceMap = objectMapper.readValue(source, new TypeReference<Map<Object, Object>>() {
			});
			Map<Object, Object> destMap = objectMapper.readValue(destinition, new TypeReference<Map<Object, Object>>() {
			});
			if (destMap == null) {
				destMap = new LinkedHashMap<>();
			}
			if (sourceMap == null) {
				sourceMap = new LinkedHashMap<>();
			}
			for (Map.Entry<Object, Object> s : sourceMap.entrySet()) {
				if (s.getValue() != null)
					destMap.put(s.getKey(), s.getValue());
			}

			mergedResult = objectMapper.writeValueAsString(destMap);

		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		return mergedResult;
	}

	public static String maskString(String strText, int startIndex, int endIndex, char maskChar) {

		if (strText == null || strText.equals(""))
			return "";

		if (startIndex < 0)
			startIndex = 0;

		if (endIndex > strText.length())
			endIndex = strText.length();

		if (strText.length() < endIndex)
			throw new ServiceException("End index cannot be greater than length of the input string", ERR_CORE_027);

		if (startIndex > endIndex)
			throw new ServiceException("End index cannot be greater than start index", ERR_CORE_027);

		int maskLength = endIndex - startIndex;

		if (maskLength == 0)
			return strText;

		StringBuilder sbMaskString = new StringBuilder(maskLength);

		for (int i = 0; i < maskLength; i++) {
			sbMaskString.append(maskChar);
		}

		return strText.substring(0, startIndex) + sbMaskString.toString() + strText.substring(startIndex + maskLength);
	}

}
