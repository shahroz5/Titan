package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
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
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.request.BinItemDto;
import com.titan.poss.inventory.dto.request.BinRequestCreateDto;
import com.titan.poss.inventory.dto.request.ConversionApprovalRequestDto;
import com.titan.poss.inventory.dto.request.InventoryBinUpdateDto;
import com.titan.poss.inventory.dto.request.RequestItemSearchDto;
import com.titan.poss.inventory.dto.request.RequestSearchDto;

@DisplayName("StockManagementControllerTest")
public class StockManagementControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "?binType=BIN_BIN", "?binType=ISSUE_TO_CFA" })
	void testListBins(String type) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stock-managements/bins" + type),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "?binType=BIN_BIN", "?binType=ISSUE_TO_CFA" })
	void testListProductCategory(String type) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("stock-managements/product-category" + type), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "?binType=BIN_BIN", "?binType=ISSUE_TO_CFA" })
	void testListProductGroup(String type) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("stock-managements/product-group" + type), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "?binType=BIN_BIN", "?binType=ISSUE_TO_CFA" })
	void testListInventoryItems(String type) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stock-managements/items" + type),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "STN,FINGER RING,OK", "TEP,TEP,BAD_REQUEST" })
	void testUpdateAllInventoryItemsByBinCode(String group, String code, String status) {
		List<String> binList = getName("bins");
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate
				.exchange(
						createURLWithPort("stock-managements/bin/items?destinationBinGroup=" + group
								+ "&destinationBincode=" + code + "&srcBincode=" + binList.get(0)),
						HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	private List<String> getName(String type) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("stock-managements/" + type + "?binType=BIN_BIN"), HttpMethod.GET, entity1,
				JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> binList = new ArrayList<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			binList.add(data.get("name").asText());
		}
		return binList;
	}

	@ParameterizedTest
	@CsvSource({ "STN,FINGER RING,OK", "TEP,TEP,BAD_REQUEST" })
	void testUpdateAllInventoryItemsByProductCategory(String group, String code, String status) {
		List<String> productCategoryList = getName("product-category");

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("stock-managements/product-category/items?destinationBinGroup=" + group
						+ "&destinationBincode=" + code + "&productCategory=" + productCategoryList.get(0)),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "STN,ZEROBIN,OK", "TEP,TEP,BAD_REQUEST" })
	void testUpdateAllInventoryItemsByProductGroup(String group, String code, String status) {

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate
				.exchange(
						createURLWithPort("stock-managements/product-group/items?destinationBinGroup=" + group
								+ "&destinationBincode=" + code + "&productGroup=88"),
						HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void testUpdateInventoryItems() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("stock-managements/items?binType=BIN_BIN"), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		InventoryBinUpdateDto binTransferItems = new InventoryBinUpdateDto();
		List<BinItemDto> binItemDtoList = new ArrayList<>();
		BinItemDto binItemDto = new BinItemDto();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			binItemDto.setBinCode("ZEROBIN");
			binItemDto.setBinGroupCode("STN");
			binItemDto.setInventoryId(data.get("id").asText());
			binItemDtoList.add(binItemDto);
			binTransferItems.setBinItems(binItemDtoList);
			break;
		}

		HttpEntity<InventoryBinUpdateDto> entity = new HttpEntity<>(binTransferItems, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stock-managements/bins/items"),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	void testListLocationsWithItems() {
		RequestSearchDto requestSearchDto = new RequestSearchDto();
		List<RequestItemSearchDto> requestItemSearchList = new ArrayList<>();
		RequestItemSearchDto requestItemSearchDto = new RequestItemSearchDto();
		requestItemSearchDto.setItemCode("511036PULAAA00");
		requestItemSearchDto.setQuantity((short) 1);
		requestItemSearchList.add(requestItemSearchDto);
		requestSearchDto.setReqItems(requestItemSearchList);

		HttpEntity<RequestSearchDto> entity = new HttpEntity<>(requestSearchDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("stock-managements/items/locations?regionType=COUNTRY"), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private List<InventoryDetailsDao> getItemDetails() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);
		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("stock-managements/items?binType=BIN_BIN"), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		List<InventoryDetailsDao> inventoryDetails = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			InventoryDetailsDao inventoryDetail = new InventoryDetailsDao();
			inventoryDetail.setId(data.get("id").asText());
			inventoryDetail.setItemCode(data.get("itemCode").asText());
			inventoryDetail.setLotNumber(data.get("lotNumber").asText());
			inventoryDetail.setBinCode(data.get("binCode").asText());
			inventoryDetail.setStdWeight(BigDecimal.valueOf(data.get("stdWeight").asDouble()));
			inventoryDetails.add(inventoryDetail);
		}
		return inventoryDetails;
	}

	@ParameterizedTest
	@CsvSource({ "OK" })
	void testCreateBinRequest(String status) {
		BinRequestCreateDto binRequestDto = new BinRequestCreateDto();
		if (status.equals("OK")) {
			binRequestDto.setBin(generateString(4));
		} else {
			binRequestDto.setBin("Saphire");
		}
		binRequestDto.setRemarks("requesting bin for managing saphire products");

		HttpEntity<BinRequestCreateDto> entity1 = new HttpEntity<>(binRequestDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stock-managements/bins/requests"),
				HttpMethod.POST, entity1, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void testListBinCreationRequest() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stock-managements/bins/requests"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testListItems() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(
				"stock-managements/conversion/items?binCode=ZEROBIN&itemCode=509132VA154110&itemWeight=5.124&lotNumber=1BA000001"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetAvailableBinCodesByLocation() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stock-managements/bincodes"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testListConversionRequest() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("stock-managements/conversion/requests"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void listConversionRequestItems() {
		List<String> conversionId = getConversionId();
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("stock-managements/conversion/requests/" + conversionId.get(0) + "/items"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private List<String> getConversionId() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("stock-managements/conversion/requests"), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		List<String> conversionId = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			conversionId.add(data.get("id").asText());
		}
		return conversionId;
	}

	@Test
	void updateConversionRequest() {
		List<String> conversionId = getConversionId();
		ConversionApprovalRequestDto conversionApprovalRequestDto = new ConversionApprovalRequestDto();
		conversionApprovalRequestDto.setRsoName("TestUser");
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("stock-managements/conversion/requests/" + conversionId.get(0)), HttpMethod.PATCH,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
