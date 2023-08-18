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
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dto.AirpayConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class AirpayConfigJobStagingWriter implements ItemWriter<AirpayConfigDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private AirpayConfigJobWriter airpayConfigJobWriter;

	@Autowired
	private CommonValidationService commonValidationService;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public void write(List<? extends AirpayConfigDto> items) throws Exception {
		List<AirpayConfigDto> list = new ArrayList<>();
		for (AirpayConfigDto airpayConfigDto : items) {
			if (airpayConfigDto != null) {
				list.add(airpayConfigDto);
			}
		}

		// getting active locations
		List<String> activeLocationList = commonValidationService.getActiveLocationCodes();
		List<String> locationList = list.stream().map(AirpayConfigDto::getLocationCode).collect(Collectors.toList());
		List<String> difference = new ArrayList<>(locationList);
		difference.removeAll(activeLocationList);
		if (!difference.isEmpty()) {
			list = handleLocationCriteria(list, difference);
		}

		// getting all merchant ids
		list = handleMerchantIdCriteria(list);

		airpayConfigJobWriter.airpayConfigStagingWriter(dataSource).write(list);
	}

	private List<AirpayConfigDto> handleLocationCriteria(List<AirpayConfigDto> list, List<String> difference) {
		List<AirpayConfigDto> errorList = list.stream().filter(item -> difference.contains(item.getLocationCode()))
				.collect(Collectors.toList());
		errorList.stream()
				.forEach(item -> dataAuditService.saveDataAuditData(item.getLocationCode(),
						MapperUtil.getJsonString(item), "Location code: " + item.getLocationCode() + " does not exist",
						item.getFileAuditId(), ErrorTypeEnum.ERROR.toString()));
		return list.stream().filter(item -> !difference.contains(item.getLocationCode())).collect(Collectors.toList());
	}

	private List<AirpayConfigDto> handleMerchantIdCriteria(List<AirpayConfigDto> list) {

		List<VendorConfigDao> vendorConfigs = commonValidationService
				.getVendorConfigs(VendorCodeEnum.PAYMENT_AIRPAY.toString(), true);
		List<JsonData> vendorConfigDetails = vendorConfigs.stream()
				.map(vendorConfig -> MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class))
				.collect(Collectors.toList());
		Set<String> merchantIds = new HashSet<>();
		vendorConfigDetails.stream().forEach(vc -> {
			JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(vc.getData())).getAsJsonObject();
			merchantIds.add(jsonObject.get("MerchantId").toString().replace("\"", ""));
		});

		List<AirpayConfigDto> airpayConfigList = new ArrayList<>();
		for (AirpayConfigDto airpayConfigDto : list) {
			// ensuring the merchant id is not assigned to any other location.
			if ((!merchantIds.add(airpayConfigDto.getMerchantId()))
					&& !airpayConfigDto.getLocationCode().equalsIgnoreCase(
							validateLocationCodeAndMerchantId(vendorConfigs, airpayConfigDto.getMerchantId()))) {
				dataAuditService.saveDataAuditData(airpayConfigDto.getLocationCode(),
						MapperUtil.getJsonString(airpayConfigDto),
						"Duplicate merchant id. This merchant id has been assigned to another location",
						airpayConfigDto.getFileAuditId(), ErrorTypeEnum.ERROR.toString());
			} else {
				airpayConfigList.add(airpayConfigDto);
			}
		}
		return airpayConfigList;
	}

	private String validateLocationCodeAndMerchantId(List<VendorConfigDao> vendorConfigs, String merchantId) {
		String locationCode = null;
		for (VendorConfigDao vendorConfig : vendorConfigs) {
			JsonData vendorDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class);
			JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(vendorDetails.getData()))
					.getAsJsonObject();
			if (jsonObject.get("MerchantId").toString().replace("\"", "").equalsIgnoreCase(merchantId)) {
				locationCode = vendorConfig.getLocationCode();
			}
		}
		return locationCode;
	}
}
