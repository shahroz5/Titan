/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dto.AirpayConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class AirpayConfigIngestionProcessor implements ItemProcessor<AirpayConfigDto, AirpayConfigDto> {

	@Override
	public AirpayConfigDto process(AirpayConfigDto airpayConfigDto) throws Exception {
		airpayConfigDto.setConfigDetails(
				getConfigDetails(airpayConfigDto).replace("\\", "").replace("\"{", "{").replace("\"}\"}", "\"}}"));
		airpayConfigDto.setIsActive(true);
		return airpayConfigDto;
	}

	private String getConfigDetails(AirpayConfigDto airpayConfigDto) {
		// encrypting the password
		airpayConfigDto.setPassword(StringUtils.isEmpty(airpayConfigDto.getPassword()) ? null
				: CryptoUtil.encrypt(airpayConfigDto.getPassword(), CommonConstants.PASS_WORD));
		JsonData jsonData = new JsonData();
		jsonData.setType(FileGroupEnum.AIRPAY_CONFIG.toString());
		jsonData.setData(MapperUtil.getJsonString(airpayConfigDto));

		return MapperUtil.getJsonString(jsonData);
	}

}
