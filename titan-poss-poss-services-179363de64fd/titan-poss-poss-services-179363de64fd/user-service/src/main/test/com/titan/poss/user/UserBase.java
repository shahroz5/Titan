package com.titan.poss.user;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.http.HttpHeaders;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.test.AuthUtil;


@SpringBootTest(classes = UserApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
public class UserBase {
	@LocalServerPort
	protected int port;
	@Autowired
	protected TestRestTemplate restTemplate;
	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	public static void init() {
		ConfigurableEnvironment environment = new StandardEnvironment();
		ApplicationPropertiesUtil.initApplicationProperties(environment);
	}

	protected static void initAuthUser(String username, String password) {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken(username, password));
	}

	protected String createURLWithPort(String uri) {
		return "http://localhost:" + port + "/user/v1/" + uri;
	}
}
