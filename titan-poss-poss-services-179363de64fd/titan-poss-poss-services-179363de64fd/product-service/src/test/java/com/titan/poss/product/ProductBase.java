package com.titan.poss.product;

import org.apache.commons.lang.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.jdbc.Sql;

import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.test.AuthUtil;

@SpringBootTest(classes = ProductApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = "spring.profiles.active=test")
@Sql(scripts = { "classpath:data.sql" })
public class ProductBase {
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
		return "http://localhost:" + port + "/product/v2/" + uri;
	}

	protected static String generateString(int length) {
		String characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz1234567890";
		return RandomStringUtils.random(length, characters);
	}

	protected static Integer generateInteger(int length) {
		String characters = "01234567890";
		return Integer.parseInt(RandomStringUtils.random(length, characters));
	}

}
