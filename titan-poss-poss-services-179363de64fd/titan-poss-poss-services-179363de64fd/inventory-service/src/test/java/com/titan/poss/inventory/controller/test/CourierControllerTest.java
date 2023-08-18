package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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
import com.titan.poss.inventory.dto.AddRemoveLocationDto;
import com.titan.poss.inventory.dto.request.CourierUpdateDto;
import com.titan.poss.inventory.dto.response.CourierDto;

@DisplayName("CourierControllerTest")
class CourierControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();
	private static HttpHeaders headers2 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
		headers2.add("Authorization", "Bearer " + AuthUtil.getAuthToken("approvaluser", "titan12"));
	}

	@ParameterizedTest
	@CsvSource({ "couriers?isPageable=true", "couriers?isPageable=false", "couriers?isPageable=true&locationCode=urb" })
	void testListCourier(String url) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers2);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(url), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetCourier() {
		List<String> courierName = getCourierName();
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers2);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("couriers/" + courierName.get(0)),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	private List<String> getCourierName() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers2);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort("couriers?isPageable=true"),
				HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> courierName = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			courierName.add(data.get("courierName").asText());
		}
		return courierName;
	}

	@Test
	void testGetLocationCodes() {
		List<String> courierName = getCourierName();
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers2);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("couriers/" + courierName.get(0) + "/locations"), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	void testAddCourier() {
		CourierDto courierDto = new CourierDto();
		courierDto.setAddress(generateString(6));
		courierDto.setContactPerson(generateString(5));
		courierDto.setCourierName(generateString(4));
		courierDto.setIsActive(false);
		courierDto.setMailId(generateString(4) + "@jeeaya.com");
		courierDto.setMobileNumber("9816513241");
		courierDto.setDescription("0179221642");
		courierDto.setCountryCode(generateString(5));
		courierDto.setStateName(generateString(5));
		courierDto.setTownName(generateString(5));

		HttpEntity<CourierDto> entity1 = new HttpEntity<>(courierDto, headers2);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("couriers"), HttpMethod.POST, entity1,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testUpdateCourier() {
		CourierUpdateDto courierUpdateDto = new CourierUpdateDto();
		String courierName = null;
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers2);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort("couriers?isPageable=true"),
				HttpMethod.GET, entity, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			courierName = data.get("courierName").asText();
			courierUpdateDto.setAddress(data.get("address").asText());
			courierUpdateDto.setContactPerson(data.get("contactPerson").asText());
			courierUpdateDto.setIsActive(false);
			courierUpdateDto.setMailId(data.get("mailId").asText());
			courierUpdateDto.setMobileNumber(data.get("mobileNumber").asText());
			courierUpdateDto.setDescription(data.get("description").asText());
			courierUpdateDto.setStateName(data.get("stateName").asText());
			courierUpdateDto.setTownName(data.get("townName").asText());
			break;
		}

		HttpEntity<CourierUpdateDto> entity1 = new HttpEntity<>(courierUpdateDto, headers2);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("couriers/" + courierName),
				HttpMethod.PATCH, entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testAddConfigLocationMapping() {
		AddRemoveLocationDto addRemoveLocationDto = new AddRemoveLocationDto();
		List<String> addLocations = new ArrayList<>();
		List<String> removeLocations = new ArrayList<>();
		removeLocations.add("URB");
		addRemoveLocationDto.setAddLocations(addLocations);
		addRemoveLocationDto.setRemoveLocations(removeLocations);

		HttpEntity<AddRemoveLocationDto> entity = new HttpEntity<>(addRemoveLocationDto, headers2);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("couriers/HARJEETSERVICE22/locations"), HttpMethod.POST, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
