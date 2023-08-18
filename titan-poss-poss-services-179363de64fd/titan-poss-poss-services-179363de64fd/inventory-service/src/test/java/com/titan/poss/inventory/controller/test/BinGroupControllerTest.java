package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;
import com.titan.poss.inventory.dto.request.BinGroupUpdateDto;
import com.titan.poss.inventory.dto.response.BinGroupDto;
import com.titan.poss.inventory.dto.response.BinLocationDto;

@DisplayName("BinGroupControllerTest")
class BinGroupControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("approvaluser", "titan12"));
	}

	@Test
	void testListBinGroup() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("bingroups"), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetBinGroup() {
		List<String> binGroupCode = getBinGroupCodes();

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("bingroups/" + binGroupCode.get(0)),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private List<String> getBinGroupCodes() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort("bingroups"), HttpMethod.GET,
				entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> binGroupCode = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			binGroupCode.add(data.get("binGroupCode").asText());
		}
		return binGroupCode;
	}

	@Test
	void testAddBinGroup() {
		BinGroupDto binGroupDto = new BinGroupDto();
		binGroupDto.setBinGroupCode(generateString(4));
		binGroupDto.setDescription("Testing bin group creation flow");
		binGroupDto.setIsActive(false);

		HttpEntity<BinGroupDto> entity = new HttpEntity<>(binGroupDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("bingroups"), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testUpdateBinGroup() {
		BinGroupUpdateDto binGroupUpdateDto = new BinGroupUpdateDto();
		binGroupUpdateDto.setDescription("Testing flow");
		binGroupUpdateDto.setIsActive(true);

		HttpEntity<BinGroupUpdateDto> entity = new HttpEntity<>(binGroupUpdateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("bingroups/TestGroupCode"),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "true", "false" })
	void testListBin(String pageable) {
		List<String> binGroupCode = getBinGroupCodes();
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("bingroups/" + binGroupCode.get(0) + "/bins?isPageable=" + pageable), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "KALEERE,OK", "RYTR,OK" })
	void testGetLocationCodes(String binCode, String status) {
//		List<String> binGroupCode = getBinGroupCodes();
//		List<String> binCode = getBinCode(binGroupCode);
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("bingroups/TestGroupCode/locations?binCodes=" + binCode), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	private List<String> getBinCode(List<String> binGroupCode) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("bingroups/" + binGroupCode.get(1) + "/bins?isPageable=true"), HttpMethod.GET,
				entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> binCode = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			binCode.add(data.get("binCode").asText());
		}
		return binCode;
	}

	@ParameterizedTest
	@CsvSource({ "ADD", "REMOVE" })
	void testLocationsMapping(String type) {
//		List<String> binGroupCode = getBinGroupCodes();
//		List<String> binCode = getBinCode(binGroupCode);
		BinLocationDto binLocationDto = new BinLocationDto();
		Set<String> binCodes = new HashSet<String>();
		Set<String> addLocations = new HashSet<String>();
		Set<String> removeLocations = new HashSet<String>();
		if (type.equals("ADD")) {
			addLocations.add("ABO");
		}
		if (type.equals("REMOVE")) {
			removeLocations.add("BGR");
		}
		binCodes.add("TestGroupCode");
		binLocationDto.setAddLocations(addLocations);
		binLocationDto.setBinCodes(binCodes);
		binLocationDto.setRemoveLocations(removeLocations);

		HttpEntity<BinLocationDto> entity = new HttpEntity<>(binLocationDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("bingroups/TestGroupCode/locations"),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

}
