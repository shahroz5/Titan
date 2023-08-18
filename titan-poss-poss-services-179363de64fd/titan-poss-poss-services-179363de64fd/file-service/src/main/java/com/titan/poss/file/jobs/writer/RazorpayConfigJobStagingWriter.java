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
import com.titan.poss.file.dto.RazorpayConfigDto;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.integration.dao.VendorConfigDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class RazorpayConfigJobStagingWriter implements ItemWriter<RazorpayConfigDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private RazorpayConfigJobWriter razorpayConfigJobWriter;

	@Autowired
	private CommonValidationService commonValidationService;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public void write(List<? extends RazorpayConfigDto> items) throws Exception {
		List<RazorpayConfigDto> list = new ArrayList<>();
		for (RazorpayConfigDto razorpayConfigDto : items) {
			if (razorpayConfigDto != null) {
				list.add(razorpayConfigDto);
			}
		}

		// getting active locations
		List<String> activeLocationList = commonValidationService.getActiveLocationCodes();
		List<String> locationList = list.stream().map(RazorpayConfigDto::getLocationCode).collect(Collectors.toList());
		List<String> difference = new ArrayList<>(locationList);
		difference.removeAll(activeLocationList);
		if (!difference.isEmpty()) {
			list = handleLocationCriteria(list, difference);
		}

		// getting all merchant ids
		list = handleAccountIdCriteria(list);

		razorpayConfigJobWriter.razorpayConfigStagingWriter(dataSource).write(list);
	}

	private List<RazorpayConfigDto> handleLocationCriteria(List<RazorpayConfigDto> list, List<String> difference) {
		List<RazorpayConfigDto> errorList = list.stream().filter(item -> difference.contains(item.getLocationCode()))
				.collect(Collectors.toList());
		errorList.stream()
				.forEach(item -> dataAuditService.saveDataAuditData(item.getLocationCode(),
						MapperUtil.getJsonString(item), "Location code: " + item.getLocationCode() + " does not exist",
						item.getFileAuditId(), ErrorTypeEnum.ERROR.toString()));
		return list.stream().filter(item -> !difference.contains(item.getLocationCode())).collect(Collectors.toList());
	}

	private List<RazorpayConfigDto> handleAccountIdCriteria(List<RazorpayConfigDto> list) {

		List<VendorConfigDao> vendorConfigs = commonValidationService
				.getVendorConfigs(VendorCodeEnum.PAYMENT_RAZORPAY.toString(), true);
		List<JsonData> vendorConfigDetails = vendorConfigs.stream()
				.map(vendorConfig -> MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class))
				.collect(Collectors.toList());
		Set<String> accountIds = new HashSet<>();
		vendorConfigDetails.stream().forEach(vc -> {
			JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(vc.getData())).getAsJsonObject();
			accountIds.add(jsonObject.get("accountId").toString().replace("\"", ""));
		});

		List<RazorpayConfigDto> razorpayConfigList = new ArrayList<>();
		for (RazorpayConfigDto razorpayConfigDto : list) {
			// ensuring the merchant id is not assigned to any other location.
			if ((!accountIds.add(razorpayConfigDto.getAccountId()))
					&& !razorpayConfigDto.getLocationCode().equalsIgnoreCase(
							validateLocationCodeAndMerchantId(vendorConfigs, razorpayConfigDto.getAccountId()))) {
				dataAuditService.saveDataAuditData(razorpayConfigDto.getLocationCode(),
						MapperUtil.getJsonString(razorpayConfigDto),
						"Duplicate account id. This account id has been assigned to another location",
						razorpayConfigDto.getFileAuditId(), ErrorTypeEnum.ERROR.toString());
			} else {
				razorpayConfigList.add(razorpayConfigDto);
			}
		}
		return razorpayConfigList;
	}

	private String validateLocationCodeAndMerchantId(List<VendorConfigDao> vendorConfigs, String merchantId) {
		String locationCode = null;
		for (VendorConfigDao vendorConfig : vendorConfigs) {
			JsonData vendorDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class);
			JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(vendorDetails.getData()))
					.getAsJsonObject();
			if (jsonObject.get("accountId").toString().replace("\"", "").equalsIgnoreCase(merchantId)) {
				locationCode = vendorConfig.getLocationCode();
			}
		}
		return locationCode;
	}
}
