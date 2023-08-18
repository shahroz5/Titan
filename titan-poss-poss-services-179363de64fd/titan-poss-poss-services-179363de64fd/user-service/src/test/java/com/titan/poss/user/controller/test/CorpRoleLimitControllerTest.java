/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
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
import com.titan.poss.user.dto.constants.RoleLimitRequestStatus;
import com.titan.poss.user.dto.request.RoleChangeRequestDto;
import com.titan.poss.user.dto.request.RoleLimitApproveDto;
import com.titan.poss.user.dto.request.RoleLimitReqDto;
import com.titan.poss.user.dto.response.RequestedRoleDetails;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;

/**
 * CorpRoleLimitController test class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
class CorpRoleLimitControllerTest extends UserBase {

	public static final String URI = "corp/role-limits";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("admin", "Welcome@123"));
	}

	private Map<Integer, RoleLimitResponseDto> getRequestIdAndData() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI + "?size=200"), HttpMethod.GET,
				entity, JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Map<Integer, RoleLimitResponseDto> roleCodes = new HashMap<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			RoleLimitResponseDto roleLimitResponse = new RoleLimitResponseDto();
			roleLimitResponse.setId(data.get("id").asInt());
			roleLimitResponse.setReqLocationCode(data.get("reqLocationCode").asText());
			roleLimitResponse.setOwnerType(data.get("ownerType").asText());
			roleLimitResponse.setReqDocNo(data.get("reqDocNo").asInt());
			roleLimitResponse.setRequesterName(data.get("requesterName").asText());
			roleLimitResponse.setRequesterContactNo(data.get("requesterContactNo").asText());
			roleLimitResponse.setRequestRemarks(data.get("requestRemarks").asText());
			roleLimitResponse.setStatus(data.get("status").asText());

			roleCodes.put(data.get("id").asInt(), roleLimitResponse);
		}

		return roleCodes;
	}

	private Set<RequestedRoleDetails> getRoleLimitRequestDetails(Integer id) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI + "/" + id + "/requests"),
				HttpMethod.GET, entity, JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Set<RequestedRoleDetails> requestedRoleDetailsList = new HashSet<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("requestedRoleDetails").iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			RequestedRoleDetails requestedRoleDetails = new RequestedRoleDetails();
			requestedRoleDetails.setRoleCode(data.get("roleCode").asText());
			requestedRoleDetails.setReqValue((short) data.get("reqValue").asInt());
			requestedRoleDetails.setAssignedUsers((short) data.get("assignedUsers").asInt());
			requestedRoleDetails.setUserLimit((short) data.get("userLimit").asInt());

			requestedRoleDetailsList.add(requestedRoleDetails);
		}

		return requestedRoleDetailsList;
	}

	private Integer getRequestId(RoleLimitRequestStatus status, Map<Integer, RoleLimitResponseDto> roleLimitRequests) {
		for (Map.Entry<Integer, RoleLimitResponseDto> roleLimitRequest : roleLimitRequests.entrySet()) {
			if (roleLimitRequest.getValue().getStatus().equals(status.name())
					&& roleLimitRequest.getValue().getReqLocationCode().equals("KHN")) {
				return roleLimitRequest.getKey();
			}
		}
		return null;
	}

	private RoleLimitApproveDto setRoleLimitApprove(RoleLimitRequestStatus status, String remarks,
			Set<RoleLimitReqDto> roleLimitReqSet) {

		RoleLimitApproveDto roleLimitApproveDto = new RoleLimitApproveDto();
		roleLimitApproveDto.setApprovalRemarks(remarks);
		roleLimitApproveDto.setStatus(status.name());
		roleLimitApproveDto.setRoles(roleLimitReqSet);

		return roleLimitApproveDto;
	}

	@ParameterizedTest
	@ValueSource(strings = { "?locationCode=URB&status=PENDING", "" })
	void testListAllRequests(String filter) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + filter), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "2909,BAD_REQUEST" })
	void testGetRoleRequestDetails(Integer reqId, String status) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + reqId + "/requests"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "U59,SM,BAD_REQUEST,2", "U59,SM,OK,", "X01,SM,BAD_REQUEST,", "U59,BOS,BAD_REQUEST," })
	void testRoleLimitChange(String locationCode, String roleCode, String status, Integer userLimit) {
		RoleLimitReqDto roleLimitReqDto = new RoleLimitReqDto();
		roleLimitReqDto.setRoleCode(roleCode);

		if (userLimit == null)
			roleLimitReqDto.setReqValue((short) 4);
		else
			roleLimitReqDto.setReqValue((short) 2);

		RoleChangeRequestDto roleChangeRequestDto = new RoleChangeRequestDto();
		roleChangeRequestDto.setRoles(Set.of(roleLimitReqDto));

		HttpEntity<RoleChangeRequestDto> entity = new HttpEntity<>(roleChangeRequestDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/locations/" + locationCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "2909,,BAD_REQUEST", "3,APPROVED,OK", "3,approveLess,BAD_REQUEST", "3,FINANCE,BAD_REQUEST",
			"3,PARTIAL_APPROVED,BAD_REQUEST", "3,,OK", "3,REJECTED,OK", "1,APPROVED,BAD_REQUEST",
			"2,APPROVED,BAD_REQUEST", "3,APPROVE2,BAD_REQUEST", "3,PARTIAL_APPROVED,OK" })
	void testRoleLimitApprove(Integer reqId, String roleOrStatus, String status) {

		Map<Integer, RoleLimitResponseDto> roleLimitRequests = getRequestIdAndData();

		Integer requestId = null;

		if ("APPROVED".equalsIgnoreCase(roleOrStatus)) {
			requestId = getRequestId(RoleLimitRequestStatus.valueOf(roleOrStatus), roleLimitRequests);
		} else {
			requestId = getRequestId(RoleLimitRequestStatus.PENDING, roleLimitRequests);
		}

		if (reqId == 3) {
			requestId = reqId;
		}

		Set<RequestedRoleDetails> requestedRoleDetails = getRoleLimitRequestDetails(requestId);

		Set<RoleLimitReqDto> roleLimitReqSet = new HashSet<>();
		RoleLimitReqDto roleLimitReqDtoLast = new RoleLimitReqDto();

		for (RequestedRoleDetails request : requestedRoleDetails) {
			RoleLimitReqDto roleLimitReqDto = new RoleLimitReqDto();
			roleLimitReqDto.setRoleCode(request.getRoleCode());

			if ("approveLess".equalsIgnoreCase(roleOrStatus))
				roleLimitReqDto.setReqValue((short) (request.getAssignedUsers() - 1));
			else
				roleLimitReqDto.setReqValue(request.getReqValue());

			roleLimitReqSet.add(roleLimitReqDto);
			roleLimitReqDtoLast = roleLimitReqDto;
		}

		if ("FINANCE".equalsIgnoreCase(roleOrStatus)) {
			roleLimitReqSet.remove(roleLimitReqDtoLast);
			roleLimitReqDtoLast.setRoleCode(roleOrStatus);
			roleLimitReqDtoLast.setReqValue((short) 4);

			roleLimitReqSet.add(roleLimitReqDtoLast);
		}

		requestId = reqId;

		RoleLimitApproveDto roleLimitApproveDto;

		if (RoleLimitRequestStatus.PARTIAL_APPROVED.name().equals(roleOrStatus)) {

			if ("OK".equalsIgnoreCase(status)) {
				roleLimitReqSet.clear();
				roleLimitReqSet.add(roleLimitReqDtoLast);
			}
			roleLimitApproveDto = setRoleLimitApprove(RoleLimitRequestStatus.PARTIAL_APPROVED, "Partial approval test",
					roleLimitReqSet);
		} else if (RoleLimitRequestStatus.REJECTED.name().equals(roleOrStatus)) {
			roleLimitApproveDto = setRoleLimitApprove(RoleLimitRequestStatus.REJECTED, "Reject test", roleLimitReqSet);
		} else {
			// approve less than number of requests
			if ("APPROVE2".equals(roleOrStatus)) {
				List<RoleLimitReqDto> roleLimitReqList = roleLimitReqSet.stream().collect(Collectors.toList());

				roleLimitReqSet.remove(roleLimitReqList.get(0));
			}

			roleLimitApproveDto = setRoleLimitApprove(RoleLimitRequestStatus.APPROVED, "Approval test",
					roleLimitReqSet);
		}

		HttpEntity<RoleLimitApproveDto> entity = new HttpEntity<>(roleLimitApproveDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/requests/" + requestId),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
