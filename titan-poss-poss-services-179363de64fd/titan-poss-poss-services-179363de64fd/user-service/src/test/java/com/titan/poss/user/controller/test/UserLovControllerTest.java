/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.user.UserBase;
import com.titan.poss.user.dto.KeyValueDto;
import com.titan.poss.user.dto.constants.LovTypeEnum;
import com.titan.poss.user.dto.request.LovUpdateDto;
import com.titan.poss.user.dto.response.LovDto;

/**
 * UserLovController test class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
class UserLovControllerTest extends UserBase {

	public static final String URI = "lovs";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));
	}

	private LovDto getLovDetails(LovTypeEnum lovType) {

		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType.toString());

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI + "/" + lovType),
				HttpMethod.GET, entity, JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("values").iterator();

		List<KeyValueDto> values = new ArrayList<>();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			KeyValueDto keyValueDto = new KeyValueDto();
			keyValueDto.setCode(data.get("code").asText());
			keyValueDto.setValue(data.get("value").asText());
			keyValueDto.setIsActive(data.get("isActive").asBoolean());

			values.add(keyValueDto);

		}

		lovDto.setResults(values);
		return lovDto;

	}

	@Test
	void testGetLovTypes() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/lov-types"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetLov() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + LovTypeEnum.ROLE_TYPE),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testUpdateLov() {
		LovDto lovDto = getLovDetails(LovTypeEnum.ROLE_TYPE);

		LovUpdateDto lovUpdateDto = new LovUpdateDto();
		lovUpdateDto.setValues(List.of(lovDto.getResults().get(0)));

		HttpEntity<LovUpdateDto> entity = new HttpEntity<>(lovUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + lovDto.getLovType()),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
