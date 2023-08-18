/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.utils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.apache.commons.collections4.map.HashedMap;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.exception.FieldErrorResource;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;

import feign.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * The Class JsonUtils.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
public class JsonUtils {

	/**
	 * Instantiates a new json utils.
	 */
	private JsonUtils() {

	}

	private static final String ERR_CORE_013 = "ERR-CORE-013";
	private static final String JSON_DATA_FORMAT_ERROR = "JSON data format error";

	/** The Constant UNABLE_TO_PARSE_JSON. */
	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	/** The Constant ERR_CORE_003. */
	private static final String ERR_CORE_003 = "ERR-CORE-003";

	/** The Constant PASS_WORD. */
	private static final String PASS_WORD = "Password";

	/** The Constant PASS_WORD_WITH_SMALL_LETTERS. */
	private static final String PASS_WORD_WITH_SMALL_LETTERS = "password";

	/**
	 * Gets the value from json object or string.
	 *
	 * @param object the object
	 * @param path   the path
	 * @return the value from json string
	 */
	public static String getValueFromJsonString(Object object, String path) {

		JsonNode jsonNode = getJsonNodeByField(object, path);

		if (jsonNode == null)
			return null;

		return jsonNode.toString().replace("\"", "");
	}

	public static <T> T getValueFromJson(Object object, String path, Class<T> className) {

		JsonNode jsonNode = getJsonNodeByField(object, path);

		if (jsonNode == null)
			return null;

		return MapperUtil.getObjectMapperInstance().convertValue(jsonNode, className);
	}

	public static JsonNode getJsonNodeByField(Object object, String path) {

		if (object == null)
			return null;

		if (object instanceof String)
			object = MapperUtil.getJsonFromString(object.toString());

		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsonNode = null;
		try {
			jsonNode = objectMapper.readValue(objectMapper.writeValueAsString(object), JsonNode.class);
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003, object);
		}
		return jsonNode.path(path);

	}

	public static void prettyPrintJson(Object obj) {

		if (obj != null) {
			Gson gson = new GsonBuilder().setPrettyPrinting().create();
			String jsonOutput = gson.toJson(obj);
			log.debug("\n{}\n", jsonOutput);
		}
	}

	public static String getJson(Object obj) {

		String output = null;
		if (obj != null) {
			Gson gson = new GsonBuilder().create();
			output = gson.toJson(obj);
		}
		return output;
	}

	/**
	 * Gets the list value from json string.
	 *
	 * @param jsonString the json string
	 * @param path       the path
	 * @return the list value from json string
	 */
	public static List<String> getListValueFromJsonString(String jsonString, String path) {
		String jsonStr = null;
		ObjectMapper objectMapper = new ObjectMapper();
		Object object = MapperUtil.getJsonFromString(jsonString);
		JsonNode jsonNode = null;
		try {
			jsonNode = objectMapper.readTree(objectMapper.writeValueAsString(object));
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		jsonNode = jsonNode.path(path);
		jsonStr = jsonNode.toString().replace("[", "").replace("]", "");
		String[] splitArray = jsonStr.split(",");
		return Arrays.asList(splitArray);
	}

	/**
	 * Gets the dto mapping.
	 *
	 * @param destinationClass the destination class
	 * @param objMapper        the obj mapper
	 * @param jsonString       the json string
	 * @return the dto mapping
	 */
	public static Object getDtoMapping(Class<?> destinationClass, ObjectMapper objMapper, String jsonString) {
		Object object = null;
		try {
			objMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			object = objMapper.readValue(jsonString, destinationClass);
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		return object;
	}

	/**
	 * Encrypt password field if present in json.
	 *
	 * @param jsonString the json string
	 * @return the json object
	 */
	public static JsonObject encryptPasswordInJson(String jsonString) {
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		JsonElement password;
		password = jsonObject.get(PASS_WORD_WITH_SMALL_LETTERS);
		if (password != null) {
			String encryptedPassword = CryptoUtil.encrypt(password.getAsString(), PASS_WORD_WITH_SMALL_LETTERS);
			jsonObject.addProperty(PASS_WORD_WITH_SMALL_LETTERS, encryptedPassword);
		}
		password = jsonObject.get(PASS_WORD);
		if (password != null) {
			String encryptedPassword = CryptoUtil.encrypt(password.getAsString(), PASS_WORD_WITH_SMALL_LETTERS);
			jsonObject.addProperty(PASS_WORD, encryptedPassword);
		}
		return jsonObject;
	}

	/**
	 * Decrypt password field in present in json.
	 *
	 * @param jsonString the json string
	 * @return the json object
	 */
	public static JsonObject decryptPasswordInJson(String jsonString) {
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		JsonElement encryptedPassword;
		encryptedPassword = jsonObject.get(PASS_WORD_WITH_SMALL_LETTERS);
		if (encryptedPassword != null) {
			String decryptedPassword = CryptoUtil.decrypt(encryptedPassword.getAsString().replace("\"", ""),
					PASS_WORD_WITH_SMALL_LETTERS);
			jsonObject.addProperty(PASS_WORD_WITH_SMALL_LETTERS, decryptedPassword);
		}
		encryptedPassword = jsonObject.get(PASS_WORD);
		if (encryptedPassword != null) {
			String decryptedPassword = CryptoUtil.decrypt(encryptedPassword.getAsString().replace("\"", ""),
					PASS_WORD_WITH_SMALL_LETTERS);
			jsonObject.addProperty(PASS_WORD, decryptedPassword);
		}
		return jsonObject;
	}

	public static String getValueFromJsonWithNullCheck(JsonObject jsonObject, String varName) {
		String var = null;
		JsonElement varJson = jsonObject.get(varName);
		if (varJson != null)
			var = varJson.getAsString();
		return var;
	}

	public static JsonData convertStrToJsonData(String str) {

		if (StringUtils.isBlank(str))
			return null;

		Object obj = MapperUtil.getJsonFromString(str);
		JsonData jsonData = null;
		if (obj != null)
			jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);

		return jsonData;
	}

	public static Validator getValidatorObject() {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		return factory.getValidator();
	}

	public static Object validateDto(Object data, Class<?> className) {

		Object dataJson = MapperUtil.getObjectMapperInstance().convertValue(data, className);
		checkFieldViolation(getValidatorObject().validate(dataJson));
		return dataJson;
	}

	public static Map<String, String> getFieldError(Object data, Class<?> className) {

		Object dataJson = MapperUtil.getObjectMapperInstance().convertValue(data, className);
		Map<String, String> messages = new HashedMap<>();
		getValidatorObject().validate(dataJson)
				.forEach(violation -> messages.put(violation.getPropertyPath().toString(), violation.getMessage()));

		return messages;
	}

	public static <T> void checkFieldViolation(Set<ConstraintViolation<T>> violators) {

		List<FieldErrorResource> fieldErrorsList = violators.stream()
				.map(violation -> new FieldErrorResource(violation.getPropertyPath().toString(), violation.getMessage(),
						violation.getInvalidValue()))
				.collect(Collectors.toList());

		Set<String> defaulterFieldNames = fieldErrorsList.stream()
				.map(fer -> StringUtil.changeCaseToReadableFormat(fer.getField())).collect(Collectors.toSet());

		if (!fieldErrorsList.isEmpty()) {
			throw new ServiceException("Request is not valid", "ERR-CORE-001", fieldErrorsList,
					Map.of("FIELD_NAMES", Arrays.toString(defaulterFieldNames.toArray())));
		}

	}

	public static void validateDto(Object data, String errorCode, String errorMessage) {

		// validate all field
		Map<String, String> fieldError = JsonUtils.getFieldError(data, data.getClass());

		if (!fieldError.isEmpty()) {
			throw new ServiceException(errorMessage, errorCode, fieldError);
		}
	}

	public static JsonNode convertToJsonNode(Response response) {

		JsonNode jsonNode = null;
		try {
			jsonNode = new ObjectMapper().readTree(
					IOUtils.toString(response.body().asInputStream(), String.valueOf(StandardCharsets.UTF_8)));
		} catch (IOException e) {
			throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013, e);
		}
		return jsonNode;
	}

	@SuppressWarnings("unchecked")
	public static JsonNode throwServiceException(JsonNode jsonResponse) {
		Object errorCause = null;
		if (jsonResponse.has(CommonConstants.ERROR_CAUSE)) {
			JsonNode errCauseJson = jsonResponse.get(CommonConstants.ERROR_CAUSE);
			errorCause = (errCauseJson != null) ? errCauseJson : null;
		}
		JsonNode fieldErrCause = jsonResponse.get(CommonConstants.FIELD_ERROR);
		if (fieldErrCause != null) {
			errorCause = Map.of(CommonConstants.FIELD_ERROR, fieldErrCause);
		}
		// for dynamic value
		JsonNode dynamicValuesJson = jsonResponse.get(CommonConstants.DYNAMIC_VALUES);
		Map<String, String> dynamicValues = null;
		if (dynamicValuesJson != null) {
			dynamicValues = MapperUtil.mapObjToClass(dynamicValuesJson, Map.class);
		}

		throw new ServiceException(jsonResponse.get(CommonConstants.MESSAGE).asText(),
				jsonResponse.get(CommonConstants.CODE).asText(), errorCause, dynamicValues);

	}

}
