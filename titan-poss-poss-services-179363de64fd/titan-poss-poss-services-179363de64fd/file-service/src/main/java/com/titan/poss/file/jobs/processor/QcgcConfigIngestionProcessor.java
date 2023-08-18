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
import com.titan.poss.file.dto.QcgcConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class QcgcConfigIngestionProcessor implements ItemProcessor<QcgcConfigDto, QcgcConfigDto> {

	@Override
	public QcgcConfigDto process(QcgcConfigDto qcgcConfigDto) throws Exception {
		qcgcConfigDto.setConfigDetails(
				getConfigDetails(qcgcConfigDto).replace("\\", "").replace("\"{", "{").replace("\"}\"}", "\"}}"));
		qcgcConfigDto.setIsActive(true);
		return qcgcConfigDto;
	}

	private String getConfigDetails(QcgcConfigDto qcgcConfigDto) {
		JsonData jsonData = new JsonData();
		jsonData.setType(FileGroupEnum.QCGC_CONFIG.toString());
		jsonData.setData(MapperUtil.getJsonString(qcgcConfigDto));

		return MapperUtil.getJsonString(jsonData);
	}

}
