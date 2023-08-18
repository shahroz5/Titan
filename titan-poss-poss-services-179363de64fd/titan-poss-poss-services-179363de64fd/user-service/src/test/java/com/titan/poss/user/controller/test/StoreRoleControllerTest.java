package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
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
import com.titan.poss.user.UserBase;

@ExtendWith(SpringExtension.class)
class StoreRoleControllerTest extends UserBase {

	public static final String URI = "store/roles";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));
	}

	private List<String> getRoleCode() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI), HttpMethod.GET, entity,
				JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> roleCodes = new ArrayList<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			roleCodes.add(data.get("roleCode").asText());
		}

		return roleCodes;
	}

	@Test
	void testListRoles() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ ",OK", "ZXXXZ,BAD_REQUEST" })
	void testGetRoleDetails(String roleCode, String status) {

		if (StringUtils.isEmpty(roleCode))
			roleCode = getRoleCode().get(0);

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + roleCode), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
