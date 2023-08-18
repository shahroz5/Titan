package com.titan.poss.engine.controller.test;

import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.utils.test.AuthUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class TaxEngineControllerTest extends TaxEngineBase {

	public static final String MEDIA_TYPE = "application";
	public static final String MEDIA_SUB_TYPE = "merge-patch+json";
	public static final String TAX_URL = "tax/";

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
	}

	@Test
	@DisplayName("taxCalculationCustomer")
	void getTaxPercentageForCustomer() {

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(TAX_URL
				+ "details?customerId=71&destBtqLocationCode=BGR&itemCode=509132VA154110&srcBtqLocationCode=URB&txnType=CUST_TRANSACTION_ADV_BOOKING"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	@DisplayName("taxCalculationInventory")
	void getTaxPercentageForInventory() {

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(TAX_URL
				+ "details?destBtqLocationCode=BGR&itemCode=509132VA154110&srcBtqLocationCode=URB&txnType=INV_MANAGMNT_STOCK_ISSUE"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void negativeTestCase() {

		MediaType mediaType = new MediaType(MEDIA_TYPE, MEDIA_SUB_TYPE);
		headers1.setContentType(mediaType);
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(TAX_URL
				+ "details?destBtqLocationCode=BGR&itemCode=509132VA15411&srcBtqLocationCode=URB&txnType=INV_MANAGMNT_STOCK_ISSUE"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.INTERNAL_SERVER_ERROR));
	}
}
