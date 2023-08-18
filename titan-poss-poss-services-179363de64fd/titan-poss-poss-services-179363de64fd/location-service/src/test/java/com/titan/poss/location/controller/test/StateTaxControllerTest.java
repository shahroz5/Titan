package com.titan.poss.location.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.location.dto.request.StateTaxMappingCreateDto;
import com.titan.poss.location.dto.request.StateTaxMappingUpdateDto;
import com.titan.poss.location.dto.response.StateTaxMappingDto;
import com.titan.poss.location.test.LocationBase;

public class StateTaxControllerTest extends LocationBase {

	private static final String URI = "state-tax";

	private static final String RESULTS = "results";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListStateTax() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("state-tax?isActive=true&isPageable=false"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ ",OK", "37B062F3-3BD3-42F1-9556-0004D3F63110,BAD_REQUEST" })
	void testGetStateTax(String id, String status) {
		if (StringUtils.isBlank(id))
			id = getStateTaxMappingList().keySet().toArray(new String[0])[0];
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + id), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ ",OK", "37B062F3-3BD3-42F1-9556-0004D3F63110,BAD_REQUEST,BAD_REQUEST" })
	void testUpdateStateTax(String id, String status) {

		Map<String, StateTaxMappingDto> stateTaxMappingMapData = getStateTaxMappingList();
		StateTaxMappingDto stateTaxMappingDto = stateTaxMappingMapData
				.get(stateTaxMappingMapData.keySet().toArray(new String[0])[0]);
		if (StringUtils.isBlank(id))
			id = stateTaxMappingDto.getId();
		StateTaxMappingUpdateDto stateTaxMappingUpdateDto = new StateTaxMappingUpdateDto();
		stateTaxMappingUpdateDto.setIsActive(stateTaxMappingDto.getIsActive());
		HttpEntity<StateTaxMappingUpdateDto> entity = new HttpEntity<>(stateTaxMappingUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + id), HttpMethod.PATCH,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY" })
	void testAddStateTax(String status) {

		StateTaxMappingCreateDto stateTaxMappingCreateDto = new StateTaxMappingCreateDto();

		// stateTaxMappingCreateDto.setStateId(1);
		// stateTaxMappingCreateDto.setTaxClassCode("TC2");
		stateTaxMappingCreateDto.setIsActive(true);
		JsonData jsonData = new JsonData();
		jsonData.setType("CGST/SGST");
		// if (status.equals("UNPROCESSABLE_ENTITY"))
		// stateTaxMappingCreateDto.setTaxDetails(null);
		// else
		// stateTaxMappingCreateDto.setTaxDetails(jsonData);
		HttpEntity<StateTaxMappingCreateDto> entity = new HttpEntity<>(stateTaxMappingCreateDto, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	private Map<String, StateTaxMappingDto> getStateTaxMappingList() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI), HttpMethod.GET, entity,
				JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Map<String, StateTaxMappingDto> stateTaxMappingDataMap = new HashMap<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get(RESULTS).iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			StateTaxMappingDto stateTaxMappingDto = new StateTaxMappingDto();

			stateTaxMappingDto.setId(data.get("id").asText());
			// stateTaxMappingDto.setTaxClassCode(data.get("taxClassCode").asText());
			// stateTaxMappingDto.setStateId(data.get("stateId").asInt());
			stateTaxMappingDto.setIsActive(data.get("isActive").asBoolean());

			stateTaxMappingDataMap.put(data.get("id").asText(), stateTaxMappingDto);

		}

		return stateTaxMappingDataMap;
	}

}
