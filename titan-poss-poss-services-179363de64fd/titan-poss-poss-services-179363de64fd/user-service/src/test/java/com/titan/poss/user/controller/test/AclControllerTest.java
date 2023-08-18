/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.user.UserBase;

/**
 * AclContoller test class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
class AclControllerTest extends UserBase {

	private static final String URI = "acls";

	private static final String RESULTS = "results";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("admin", "Welcome@123"));
	}

	private String requestParams;

	private List<String> getAclGroup() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI), HttpMethod.GET, entity,
				JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> aclGroup = new ArrayList<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get(RESULTS).iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			aclGroup.add(data.get("aclGroupCode").asText());
		}

		return aclGroup;
	}

	private List<String> getSubAclGroup() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI + "/" + getAclGroup().get(0)),
				HttpMethod.GET, entity, JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> subAclGroup = new ArrayList<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get(RESULTS).iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			subAclGroup.add(data.get("aclGroupCode").asText());
		}

		return subAclGroup;
	}

	@ParameterizedTest
	@CsvSource({ "SM,true,OK", "UT,false,BAD_REQUEST", "CASHIER,true,OK", "ADMIN,true,OK", ",true,OK" })
	void testListAclGroup(String roleCode, Boolean isPagable, String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		if (StringUtils.isEmpty(roleCode)) {
			requestParams = "?isPageable=" + isPagable;
		} else {
			requestParams = "?isPageable=" + isPagable + "&roleCode=" + roleCode;
		}

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + requestParams), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "SM,true,OK", "UT,false,BAD_REQUEST", "CASHIER,true,OK", "ADMIN,true,OK", ",true,OK" })
	void testListSubAclGroup(String roleCode, Boolean isPagable, String status) {
		List<String> aclGroup = getAclGroup();

		if (StringUtils.isEmpty(roleCode)) {
			requestParams = "?isPageable=" + isPagable;
		} else {
			requestParams = "?isPageable=" + isPagable + "&roleCode=" + roleCode;
		}

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/" + aclGroup.get(0) + requestParams), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "SM,true,OK", "UT,false,BAD_REQUEST", "CASHIER,true,OK", "ADMIN,true,OK", ",true,OK" })
	void testListAclBasedOnAclGroup(String roleCode, Boolean isPagable, String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		if (StringUtils.isEmpty(roleCode)) {
			requestParams = "?isPageable=" + isPagable;
		} else {
			requestParams = "?isPageable=" + isPagable + "&roleCode=" + roleCode;
		}

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/" + getSubAclGroup().get(0) + "/acls" + requestParams), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}