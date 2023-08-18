package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
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
import com.titan.poss.inventory.constant.LovTypeEnum;
import com.titan.poss.inventory.dto.request.LovUpdateDto;
import com.titan.poss.inventory.dto.response.KeyValueDto;
import com.titan.poss.inventory.dto.response.LovCreateDto;

@DisplayName("LovControllerTest")
class LovControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();
	private static HttpHeaders headers2 = new HttpHeaders();





	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
		headers2.add("Authorization", "Bearer " + AuthUtil.getAuthToken("approvaluser", "titan12"));

	}





	@Test
	void testGetLovTypes() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("lovs/lov-types"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}





	@Test
	void testGetLov() {
		List<String> lovTypes = getLovType();

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("lovs/" + lovTypes.get(0)), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}





	private List<String> getLovType() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate
				.exchange(createURLWithPort("lovs/lov-types"), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> lovTypes = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			String l = data.get(0).asText();
			lovTypes.add(l);
		}
		return lovTypes;
	}





	@Test
	void testCreateLov() {
		LovCreateDto lovCreateDto = new LovCreateDto();
		String code = generateString(6);
		lovCreateDto.setCode(code);
		lovCreateDto.setLovType(LovTypeEnum.DEFECTTYPE.toString());
		lovCreateDto.setValue(code);

		HttpEntity<LovCreateDto> entity1 = new HttpEntity<>(lovCreateDto, headers2);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("lovs"), HttpMethod.POST, entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}





	@Test
	void testUpdateLov() {
		List<String> lovTypes = getLovType();
		KeyValueDto keyValueDto = new KeyValueDto();
		List<KeyValueDto> values = new ArrayList<>();
		LovUpdateDto lovUpdateDto = new LovUpdateDto();
		String code = generateString(6);
		keyValueDto.setCode(code);
		keyValueDto.setIsActive(false);
		keyValueDto.setValue(code);
		values.add(keyValueDto);
		lovUpdateDto.setValues(values);

		HttpEntity<LovUpdateDto> entity1 = new HttpEntity<>(lovUpdateDto, headers2);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("lovs/" + lovTypes.get(0)), HttpMethod.PATCH, entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

}
