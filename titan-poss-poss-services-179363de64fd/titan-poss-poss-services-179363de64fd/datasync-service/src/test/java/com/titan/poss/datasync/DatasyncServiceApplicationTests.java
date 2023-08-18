/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync;

import java.text.SimpleDateFormat;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;

import com.titan.poss.core.utils.ApplicationPropertiesUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@SpringBootTest(classes = DatasyncServiceApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DatasyncServiceApplicationTests {

	@BeforeAll
	public void init() {
		SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy-HH-mm-ss");
		String time = formatter.format(System.currentTimeMillis());
		System.setProperty("timestamp", String.valueOf(time));
		ConfigurableEnvironment environment = new StandardEnvironment();
		ApplicationPropertiesUtil.initApplicationProperties(environment);
	}

}
