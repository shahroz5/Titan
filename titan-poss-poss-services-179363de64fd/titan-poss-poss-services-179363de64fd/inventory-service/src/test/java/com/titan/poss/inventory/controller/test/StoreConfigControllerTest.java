package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

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

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;

@DisplayName("lite-dataControllerTest")
class StoreConfigControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.bgr", "welcome123"));
	}

	@Test
	void testListCourier() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lite-data/couriers"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "WEIGHT_TOLERANCE", "CONVERSION_RESTRICTION" })
	void testListInventoryConfigs(String config) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("lite-data/configs?configType=" + config), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "RECEIVE_BIN", "ISSUE_BIN" })
	void testListBin(String binType) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lite-data/bins?binType=" + binType),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testCreateReqDocNo() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("lite-data/doc-no?fiscalYear=2020&locationCode=bgr"), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "1,10,1,10,OK", "1,54.5,1,52.5,BAD_REQUEST", "1,54.5,2,54.5,BAD_REQUEST" })
	void testValidateConfiguration(Integer availQuant, double availWeight, Integer measQuant, double measWeight,
			String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("lite-data/validate?availableQuantity=" + availQuant + "&availableWeight="
						+ availWeight + "&configType=WEIGHT_TOLERANCE&measuredQuantity=" + measQuant
						+ "&measuredWeight=" + measWeight + "&productGroupCode=71"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void testListBinDetails() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lite-data/STN/bins?isPageable=true"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}
}
