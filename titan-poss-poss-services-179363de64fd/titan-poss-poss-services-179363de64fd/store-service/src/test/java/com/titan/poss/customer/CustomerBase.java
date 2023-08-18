/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.customer;

import java.util.Random;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.test.context.jdbc.Sql;

import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.store.StoreServiceApplication;

/**
 * Base customer test class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@SpringBootTest(classes = StoreServiceApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = "spring.profiles.active=test")
@Sql(scripts = { "classpath:data.sql" })
public class CustomerBase {

	protected String characters = "abcdefghijklmnopqrstuvwxyz";

	protected String mobileNumString = "1234567890";

	protected final Random rand = new Random();

	@LocalServerPort
	protected int port;

	@Autowired
	protected TestRestTemplate restTemplate;

	@BeforeAll
	public static void init() {
		ConfigurableEnvironment environment = new StandardEnvironment();
		ApplicationPropertiesUtil.initApplicationProperties(environment);
	}

	protected String createURLWithPort(String uri) {
		return "http://localhost:" + port + "/store/v2/" + uri;
	}

}
