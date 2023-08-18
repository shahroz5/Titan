
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller.test;

import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.engine.product.repository.ItemRepositoryExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@DisplayName("PriceControllerTest")
class PriceControllerTest extends PriceEngineBase {

	@Autowired
	ItemRepositoryExt itemRepo;

	public static final String NONUCP = "NONUCP";
	public static final String MEDIA_TYPE = "application";
	public static final String MEDIA_SUB_TYPE = "merge-patch+json";
	public static final String PRICE_URL = "price/details";

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
	}

	@Test
	@DisplayName("getPlainPrice")
	void a() {

		// String res = itemRepo.getItemCode("71", NONUCP, "URB");

		// PriceCalculationRequestDto priceCalcDto = getRequestDto(res);

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=500990CBAEAA00&lotNumber=2JA005228"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("getCoinPrice")
	void h() {

		// String res = itemRepo.getItemCode("71", NONUCP, "URB");

		// PriceCalculationRequestDto priceCalcDto = getRequestDto(res);

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=600102ZKARAP00&stdWeight=4.000"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("getCoinPriceNegative")
	void i() {

		// String res = itemRepo.getItemCode("71", NONUCP, "URB");

		// PriceCalculationRequestDto priceCalcDto = getRequestDto(res);

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=600102ZKARAP00&stdWeight=4.000"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("getStuddedPrice")
	void b() {

		// String res = itemRepo.getItemCode("72", NONUCP, "URB");

		// PriceCalculationRequestDto priceCalcDto = getRequestDto(res);

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=5011631IOABA04&lotNumber=2BD000632"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("getPJWSPrice")
	void d() {

		// String res = itemRepo.getItemCode("88", NONUCP, "URB");

		// PriceCalculationRequestDto priceCalcDto = getRequestDto(res);

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=5110162HAAAAP2&lotNumber=3IJ000471"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("getBiMetalPlainPrice")
	void e() {

		// String res = itemRepo.getItemCode("B6", NONUCP, "URB");
		// PriceCalculationRequestDto priceCalcDto = getRequestDto(res);

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=742770VCEV1A00&lotNumber=2CD000009"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("getPlainStuddedPrice")
	void f() {

		// String res = itemRepo.getItemCode("B7", NONUCP, "URB");

		// PriceCalculationRequestDto priceCalcDto = getRequestDto(res);

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=512115DVAABAP5&lotNumber=2BA000002"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("getBiMetalStuddedPrice")
	void g() {

		// String res = itemRepo.getItemCode("B5", NONUCP, "URB");

		// PriceCalculationRequestDto priceCalcDto = getRequestDto(res);

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=742417FFBSAA02&lotNumber=2BD000005"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("negativeScenarioItemCode")
	void passWrongItemCode() {
		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=742417FFBAA03&lotNumber=2BD000005"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));
	}

	@Test
	@DisplayName("negativeScenarioLotNumber")
	void passWrongLotNumber() {
		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=742417FFBSAA02&lotNumber=2BD000015"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));
	}

	@Test
	@DisplayName("negativeScenarioLocationCode")
	void passWrongLocationCode() {

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=500990CBAEAA00&lotNumber=2BD000005"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));

	}

	@Test
	@DisplayName("UCP")
	void ucp() {

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(PRICE_URL + "?checkInventory=false&itemCode=552811CWAUAAPL&lotNumber=2JA000714"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}
}
