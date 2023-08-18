/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.QcgcConfigDto;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.integration.dao.VendorConfigDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class QcgcConfigJobStagingWriter implements ItemWriter<QcgcConfigDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private QcgcConfigJobWriter qcgcConfigJobWriter;

	@Autowired
	private CommonValidationService commonValidationService;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public void write(List<? extends QcgcConfigDto> items) throws Exception {
		List<QcgcConfigDto> list = new ArrayList<>();
		for (QcgcConfigDto airpayConfigDto : items) {
			if (airpayConfigDto != null) {
				list.add(airpayConfigDto);
			}
		}
		list = handleTerminalIdCriteria(list);

		qcgcConfigJobWriter.qcgcConfigStagingWriter(dataSource).write(list);
	}

	private List<QcgcConfigDto> handleTerminalIdCriteria(List<QcgcConfigDto> list) {

		List<VendorConfigDao> vendorConfigs = commonValidationService.getVendorConfigs(VendorCodeEnum.QC_GC.toString(),
				true);
		List<JsonData> vendorConfigDetails = vendorConfigs.stream()
				.map(vendorConfig -> MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class))
				.collect(Collectors.toList());
		Set<String> termianlIds = new HashSet<>();
		vendorConfigDetails.stream().forEach(vc -> {
			JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(vc.getData())).getAsJsonObject();
			termianlIds.add(jsonObject.get("TerminalId").toString().replace("\"", ""));
		});

		List<QcgcConfigDto> qcgcConfigList = new ArrayList<>();
		for (QcgcConfigDto qcgcConfigDto : list) {
			// ensuring the terminal id is not assigned to any other location.
			if ((!termianlIds.add(qcgcConfigDto.getTerminalId())) && !qcgcConfigDto.getLocationCode().equalsIgnoreCase(
					validateLocationCodeAndTerminalId(vendorConfigs, qcgcConfigDto.getTerminalId()))) {
				dataAuditService.saveDataAuditData(qcgcConfigDto.getLocationCode(),
						MapperUtil.getJsonString(qcgcConfigDto),
						"Duplicate terminal id. This terminal id has been assigned to another location",
						qcgcConfigDto.getFileId(), ErrorTypeEnum.ERROR.toString());
			} else {
				qcgcConfigList.add(qcgcConfigDto);
			}
		}
		return qcgcConfigList;
	}

	private String validateLocationCodeAndTerminalId(List<VendorConfigDao> vendorConfigs, String terminalId) {
		String locationCode = null;
		for (VendorConfigDao vendorConfig : vendorConfigs) {
			JsonData vendorDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class);
			JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(vendorDetails.getData()))
					.getAsJsonObject();
			if (jsonObject.get("TerminalId").toString().replace("\"", "").equalsIgnoreCase(terminalId)) {
				locationCode = vendorConfig.getLocationCode();
			}
		}
		return locationCode;
	}
}
