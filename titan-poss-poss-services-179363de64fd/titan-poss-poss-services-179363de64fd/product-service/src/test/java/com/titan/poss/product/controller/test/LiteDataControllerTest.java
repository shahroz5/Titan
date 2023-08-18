package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.product.ProductBase;

public class LiteDataControllerTest extends ProductBase {

	private static HttpHeaders headers1 = new HttpHeaders();
	private static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "lite-data/brands?isPageable=true", "lite-data/brands?isPageable=true&parentBrandCode=Tanishq",
			"lite-data/brands" })
	void testListBrands(String url) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(url), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testListItems() {
		List<String> itemCodes = getItemCodes();
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("lite-data/conversion/" + itemCodes.get(0)), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testListStoneTypeLite() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lite-data/stone-types"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private List<String> getItemCodes() {
		List<String> itemCodes = new ArrayList<>();
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort("items"), HttpMethod.GET, entity,
				JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			itemCodes.add(data.get("itemCode").asText());
		}
		return itemCodes;
	}

	@Test
	void testListMaterial() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lite-data/materials"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	void testListComplexity() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lite-data/complexities"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

}
