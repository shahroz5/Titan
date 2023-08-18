package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.user.UserBase;

@ExtendWith(SpringExtension.class)
class AclControllerTest extends UserBase{

	@BeforeAll
	public static void initUser() {
		initAuthUser("admin", "welcome123");
	}

	private List<String> getAclGroup(){
		
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		
		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("acl"), HttpMethod.GET, entity,
				JsonNode.class);
		
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		
		List<String> aclGroup = new ArrayList<>();
		
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			aclGroup.add(data.get("").asText());
		}
		return aclGroup;
	}
	
	@Test
	void testListAclGroup1() {
		List<String> x = getAclGroup();
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("acl"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testListSubAclGroup1StringPageable() {
		fail("Not yet implemented");
	}

	@Test
	void testListSubAclGroup1StringStringStringPageable() {
		fail("Not yet implemented");
	}

}
