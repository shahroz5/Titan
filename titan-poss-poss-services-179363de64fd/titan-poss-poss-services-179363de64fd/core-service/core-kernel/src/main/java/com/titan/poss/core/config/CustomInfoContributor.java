/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.config;

import java.util.Map;

import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CommonUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class CustomInfoContributor implements InfoContributor {

	@Override
	public void contribute(Info.Builder builder) {

		Map<String, Object> info = CommonUtil.getPrintInfoInMap();

		for (Map.Entry<String, Object> entry : info.entrySet()) {
			builder.withDetail(entry.getKey(), entry.getValue());
		}

	}

}
