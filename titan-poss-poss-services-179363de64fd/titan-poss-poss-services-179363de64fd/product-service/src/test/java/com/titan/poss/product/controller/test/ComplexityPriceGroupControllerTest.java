package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
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
import com.titan.poss.product.dto.request.CompPriceGrpCreateDto;
import com.titan.poss.product.dto.request.CompPriceGrpUpdateDto;

public class ComplexityPriceGroupControllerTest extends ProductBase {

	private static final String URI = "complexity-price-groups";

	private static HttpHeaders headers = new HttpHeaders();

	private static final String RESULTS = "results";

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListComplexityPriceGroup() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("complexity-price-groups?isActive=true"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ ",OK" })
	void testGetComplexityPriceGroup(String id, String status) {
		List<String> complexityPriceGroupId = getComplexityPriceGroupId();
		if (StringUtils.isBlank(id))
			id = complexityPriceGroupId.get(0);
		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + id), HttpMethod.GET,
				entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "C,P,UNPROCESSABLE_ENTITY", "PA,KADAPA,OK", "PA,Bangalore,BAD_REQUEST","AS,Bangalore,BAD_REQUEST","PA,asd,BAD_REQUEST"})
	void testAddComplexityPriceGroup(String complexityCode, String priceGroup, String status) {
		CompPriceGrpCreateDto compPriceGrpCreateDto = new CompPriceGrpCreateDto();
		compPriceGrpCreateDto.setComplexityCode(complexityCode);
		compPriceGrpCreateDto.setPriceGroup(priceGroup);
		compPriceGrpCreateDto.setWastagePct(new BigDecimal(0));
		HttpEntity<CompPriceGrpCreateDto> entity = new HttpEntity<>(compPriceGrpCreateDto, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "12132,-1,UNPROCESSABLE_ENTITY", ",1,OK"})
	void testUpdateComplexityPriceGroup(String id, int makingChargePunit, String status) {
		List<String> complexityPriceGroupId = getComplexityPriceGroupId();
		if (StringUtils.isBlank(id))
			id = complexityPriceGroupId.get(0);
		CompPriceGrpUpdateDto compPriceGrpUpdateDto = new CompPriceGrpUpdateDto();
		compPriceGrpUpdateDto.setMakingChargePunit(new BigDecimal(makingChargePunit));
		HttpEntity<CompPriceGrpUpdateDto> entity = new HttpEntity<>(compPriceGrpUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + id), HttpMethod.PATCH,
				entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	private List<String> getComplexityPriceGroupId() {
		List<String> complexityPriceGroupId = new ArrayList<>();
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI), HttpMethod.GET, entity,
				JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get(RESULTS).iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			complexityPriceGroupId.add(data.get("id").asText());
		}
		return complexityPriceGroupId;
	}
}
