/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.customer.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.lang.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.customer.CustomerBase;
import com.titan.poss.store.dto.request.CatchmentAddDto;
import com.titan.poss.store.dto.request.CatchmentUpdateDto;
import com.titan.poss.store.dto.response.CatchmentDto;

/**
 * CatchmentController test class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
class CatchmentControllerTest extends CustomerBase {

	public static final String URI = "catchments";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));
	}

	private Map<String, CatchmentDto> getCatchmentList() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI), HttpMethod.GET, entity,
				JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Map<String, CatchmentDto> catchmentList = new HashMap<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			CatchmentDto catchmentDto = new CatchmentDto();
			catchmentDto.setCatchmentCode(data.get("catchmentCode").asText());
			catchmentDto.setDescription(data.get("description").asText());
			catchmentDto.setIsActive(data.get("isActive").asBoolean());

			catchmentList.put(data.get("catchmentCode").asText(), catchmentDto);
		}

		return catchmentList;
	}

	@ParameterizedTest
	@CsvSource({ "BU,,BAD_REQUEST", ",Kengeri,BAD_REQUEST", ",,OK" })
	void testAddCatchment(String catchmentCode, String description, String status) {
		CatchmentAddDto catchmentAddDto = new CatchmentAddDto();
		if (StringUtils.isEmpty(catchmentCode)) {
			catchmentAddDto.setCatchmentCode(RandomStringUtils.random(2, characters.toUpperCase()));
		} else {
			catchmentAddDto.setCatchmentCode(catchmentCode);
		}

		if (StringUtils.isEmpty(description)) {
			catchmentAddDto.setDescription(
					"Test" + RandomStringUtils.random(2, characters) + RandomStringUtils.random(1, mobileNumString));
		} else {
			catchmentAddDto.setDescription(description);
		}

		HttpEntity<CatchmentAddDto> entity = new HttpEntity<>(catchmentAddDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@ValueSource(strings = { "?searchField=Rajarajeshwari", "?searchField=LUCKNOW" })
	void testListCatchmentArea(String searchField) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + searchField), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ ",OK", "TH,BAD_REQUEST" })
	void testGetCatchment(String catchmentCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		if (StringUtils.isEmpty(catchmentCode)) {
			catchmentCode = getCatchmentList().keySet().toArray(new String[0])[0];
		}

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + catchmentCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "XXX0,,BAD_REQUEST", ",Kengeri,BAD_REQUEST", ",,OK" })
	void testUpdateCatchment(String catchmentCode, String description, String status) {
		Map<String, CatchmentDto> catchmentList = getCatchmentList();

		if (StringUtils.isEmpty(catchmentCode)) {
			catchmentCode = catchmentList.keySet().toArray(new String[0])[0];
		}

		CatchmentUpdateDto catchmentUpdateDto = new CatchmentUpdateDto();
		catchmentUpdateDto
				.setIsActive(catchmentList.get(catchmentList.keySet().toArray(new String[0])[0]).getIsActive());

		if (!StringUtils.isEmpty(description)) {
			catchmentUpdateDto.setDescription(description);
		}

		HttpEntity<CatchmentUpdateDto> entity = new HttpEntity<>(catchmentUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + catchmentCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
