package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer.Alphanumeric;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
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
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;
import com.titan.poss.inventory.dto.constants.OtherRequestStatusEnum;
import com.titan.poss.inventory.dto.request.OtherRequestItemCreateDto;
import com.titan.poss.inventory.dto.request.OtherRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.OtherRequestItemsCreateDto;
import com.titan.poss.inventory.dto.request.OtherRequestUpdateDto;
import com.titan.poss.inventory.dto.request.OtherTransactionRequestCreateDto;
import com.titan.poss.inventory.dto.request.RemoveOtherItemsDto;
import com.titan.poss.inventory.dto.request.RequestOtherItemDto;
import com.titan.poss.inventory.dto.response.OtherRequestItemDto;

@TestMethodOrder(Alphanumeric.class)
@DisplayName("OtherRequestControllerTest")
class OtherRequestControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.bgr", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "LOAN", "LOSS", "EXH" })
	@DisplayName("testListOtherRequestItems")
	void b(String type) {
		String stockrequestId = getOtherRequestId(type);

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/" + stockrequestId + "/items?requestType=" + type), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private String getOtherRequestId(String type) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("other-requests?requestType=" + type), HttpMethod.POST, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		String stockrequestId = jsonNode.getBody().get("id").asText();
		return stockrequestId;
	}

	@ParameterizedTest
	@CsvSource({ "LOAN", "LOSS", "EXH" })
	@DisplayName("testCreateOtherTransactionRequest")
	void a(String type) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("other-requests?requestType=" + type),
				HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "ADJ", "CONV", "PSV", "FOC" })
	@DisplayName("testCreateOtherTransactionRequestOtherTransactionRequestTypeEnumOtherTransactionRequestCreateDtoBindingResult")
	void h(String type) {
		List<RequestOtherItemDto> items = new ArrayList<>();
		RequestOtherItemDto requestOtherItemDto = new RequestOtherItemDto();
		JsonData jsonData = new JsonData();
		OtherTransactionRequestCreateDto otherRequestCreateDto = new OtherTransactionRequestCreateDto();
		// get items from inventory
		List<String> inventory = getInventory();
		requestOtherItemDto.setInventoryId(inventory.get(0));
		requestOtherItemDto.setItemCode(inventory.get(1));
		requestOtherItemDto.setLotNumber("1BA000001");
		requestOtherItemDto.setMeasuredWeight(BigDecimal.valueOf(10));
		requestOtherItemDto.setQuantity((short) 1);
		requestOtherItemDto.setItemDetails(null);
		items.add(requestOtherItemDto);
		String approval = "{\"approvalCode\":\"123PB\",\"approvedBy\":\"User\"}";
		Object obj = MapperUtil.getJsonFromString(approval);
		jsonData.setData(obj);
		jsonData.setType("approval");
		otherRequestCreateDto.setItems(items);
		otherRequestCreateDto.setRemarks("Testing methods");
		otherRequestCreateDto.setApprovalDetails(jsonData);

		HttpEntity<OtherTransactionRequestCreateDto> entity1 = new HttpEntity<>(otherRequestCreateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/items?requestType=" + type), HttpMethod.POST, entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	private List<String> getInventory() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("stock-managements/items?binType=BIN_BIN"), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> idList = new ArrayList<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			idList.add(data.get("id").asText());
			idList.add(data.get("itemCode").asText());
			break;
		}
		return idList;
	}

	@ParameterizedTest
	@CsvSource({ "14,EXH", "12,LOAN", "13,LOSS" })
	@DisplayName("testUpdateOtherRequestItem")
	void d(Integer id, String type) {
//		String stockrequestId = getOtherRequestId(type);
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		OtherRequestItemsCreateDto otherRequestItemsCreateDto = new OtherRequestItemsCreateDto();
		List<OtherRequestItemCreateDto> stockItems = new ArrayList<>();
		otherRequestItemsCreateDto.setStockItems(stockItems);

		HttpEntity<OtherRequestItemsCreateDto> entity2 = new HttpEntity<>(otherRequestItemsCreateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/" + id + "/items?requestType=" + type), HttpMethod.POST, entity2,
				String.class);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("other-requests/" + id + "/items?requestType=" + type), HttpMethod.GET, entity1,
				JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		OtherRequestItemDto otherRequestItemDto = new OtherRequestItemDto();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			otherRequestItemDto.setId(data.get("id").asText());
			otherRequestItemDto.setAvailableQuantity((short) data.get("availableQuantity").asDouble());
			otherRequestItemDto.setMeasuredWeight(BigDecimal.valueOf(data.get("measuredWeight").asDouble()));
			otherRequestItemDto.setInventoryId(data.get("inventoryId").asText());
			break;
		}
		OtherRequestItemUpdateDto itemUpdateDto = new OtherRequestItemUpdateDto();
		itemUpdateDto.setInventoryId(otherRequestItemDto.getInventoryId());
		itemUpdateDto.setMeasuredWeight(otherRequestItemDto.getMeasuredWeight());
		itemUpdateDto.setQuantity(otherRequestItemDto.getAvailableQuantity());

		HttpEntity<OtherRequestItemUpdateDto> entity = new HttpEntity<>(itemUpdateDto, headers1);
		response = restTemplate.exchange(
				createURLWithPort(
						"other-requests/" + id + "/items/" + otherRequestItemDto.getId() + "?requestType=" + type),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "12,LOAN,employee_loan", "14,EXH,address_exh", "13,LOSS,approval" })
	@DisplayName("testUpdateOtherRequest")
	void e(String id, String type, String approvalType) {
//		String stockrequestId = getOtherRequestId(type);
		OtherRequestUpdateDto requestUpdateDto = new OtherRequestUpdateDto();
		JsonData carrierDetails = new JsonData();
		JsonData approvalDetails = new JsonData();
		String carrier = null;
		String approval = null;
		if (type.equals("LOAN")) {
			carrier = "{\"employeeId\":\"E12456\",\"employeeName\":\"TITANuser\",\"designation\":\"CASHIER\",\"emailId\":\"xys@mindtree.com\",\"mobileNo\":\"9876543211\",\"brand\":\"XYZ\"}";
			approval = "{\"approvalCode\":\"E12456\",\"approvedBy\":\"BTQMANGER\"}";
		}
		if (type.equals("EXH")) {
			carrier = "{\"address1\":\"patiala\",\"address2\":\"gurdeep\",\"city\":\"patiala\",\"town\":\"patiala\",\"pincode\":\"9876543211\"}";
			approval = "{\"approvalCode\":\"E12456\",\"approvedBy\":\"BTQMANGER\"}";
		}
		if (type.equals("LOSS")) {
			approval = "{\"approvalCode\":\"BTQ\",\"approvedBy\":\"BTQMANAGER\",\"pincode\":\"134511\"}";
		}

		Object obj = MapperUtil.getJsonFromString(carrier);
		carrierDetails.setData(obj);
		carrierDetails.setType(approvalType);
		Object obj1 = MapperUtil.getJsonFromString(approval);
		approvalDetails.setData(obj1);
		approvalDetails.setType("approval");
		requestUpdateDto.setRemarks("Testing flow for updating request");
		requestUpdateDto.setStatus(OtherRequestStatusEnum.APVL_PENDING.toString());
		requestUpdateDto.setCarrierDetails(carrierDetails);
		requestUpdateDto.setApprovalDetails(approvalDetails);
		HttpEntity<OtherRequestUpdateDto> entity1 = new HttpEntity<>(requestUpdateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/" + id + "?requestType=" + type), HttpMethod.PATCH, entity1,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		f(type, id);

	}

	@ParameterizedTest
	@CsvSource({ "LOAN", "LOSS", "EXH" })
	@DisplayName("testCreateOtherRequestItems")
	void c(String type) {
		String stockrequestId = getOtherRequestId(type);
		OtherRequestItemsCreateDto otherRequestItemsCreateDto = new OtherRequestItemsCreateDto();
		List<OtherRequestItemCreateDto> stockItems = new ArrayList<>();
		otherRequestItemsCreateDto.setStockItems(stockItems);

		HttpEntity<OtherRequestItemsCreateDto> entity1 = new HttpEntity<>(otherRequestItemsCreateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/" + stockrequestId + "/items?requestType=" + type), HttpMethod.POST,
				entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "EXH", "LOAN", "LOSS" })
	@DisplayName("testRemoveStockRequestItems")
	void g(String type) {
		String stockrequestId = getOtherRequestId(type);
		RemoveOtherItemsDto removeOtherItemDto = new RemoveOtherItemsDto();
		List<String> itemIds = new ArrayList<>();
		removeOtherItemDto.setItemIds(itemIds);
		HttpEntity<RemoveOtherItemsDto> entity1 = new HttpEntity<>(removeOtherItemDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/" + stockrequestId + "/items?requestType=" + type), HttpMethod.PUT,
				entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@DisplayName("testCancelOtherTransferRequest")
	void f(String type, String stockrequestId) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/items/" + stockrequestId + "/cancel?requestType=" + type),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "ADJ", "CONV", "PSV", "FOC" })
	@DisplayName("testCancelOtherTransactionRequest")
	void i(String type) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("other-issues/request?requestType=" + type), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> stockrequestId = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			if (data.get("status").asText().equals("APVL_PENDING")) {
				stockrequestId.add(data.get("id").asText());
			}
		}
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/" + stockrequestId.get(0) + "/cancel?requestType=" + type),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	@DisplayName("updateOtherRequestItemNegativeTest")
	void j() {
		String stockrequestId = getOtherRequestId("LOAN");
		OtherRequestItemUpdateDto itemUpdateDto = new OtherRequestItemUpdateDto();
		HttpEntity<OtherRequestItemUpdateDto> entity = new HttpEntity<>(itemUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/" + stockrequestId
						+ "/items/D65BCF79-4B18-48B8-80F9-10460F75C316?requestType=LOAN"),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().name().equals("BAD_REQUEST"));
	}

	@Test
	@DisplayName("createOtherTransactionNegativeTest")
	void k() {
		OtherTransactionRequestCreateDto otherRequestCreateDto = new OtherTransactionRequestCreateDto();
		JsonData jsonData = new JsonData();
		List<RequestOtherItemDto> items = new ArrayList<>();
		otherRequestCreateDto.setRemarks("testing");
		otherRequestCreateDto.setItems(items);
		otherRequestCreateDto.setApprovalDetails(jsonData);
		HttpEntity<OtherTransactionRequestCreateDto> entity = new HttpEntity<>(otherRequestCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-requests/items?requestType=FOC"), HttpMethod.POST, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));
	}

}
