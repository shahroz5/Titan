/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.RazorpayConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class RazorpayConfigIngestionProcessor implements ItemProcessor<RazorpayConfigDto, RazorpayConfigDto> {

	@Override
	public RazorpayConfigDto process(RazorpayConfigDto razorpayConfigDto) throws Exception {
		razorpayConfigDto.setConfigDetails(
				getConfigDetails(razorpayConfigDto).replace("\\", "").replace("\"{", "{").replace("\"}\"}", "\"}}"));
		razorpayConfigDto.setIsActive(true);
		return razorpayConfigDto;
	}

	private String getConfigDetails(RazorpayConfigDto razorpayConfigDto) {
		JsonData jsonData = new JsonData();
		jsonData.setType(FileGroupEnum.RAZORPAY_CONFIG.toString());
		jsonData.setData(MapperUtil.getJsonString(razorpayConfigDto));

		return MapperUtil.getJsonString(jsonData);
	}

}
