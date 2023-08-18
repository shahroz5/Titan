/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.sftp.session.DefaultSftpSessionFactory;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.SftpConfigDto;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class SftpConfig {

	@Bean
	public DefaultSftpSessionFactory sftpSessionFactory(VendorRepository vendorRepository) {
		SftpConfigDto sftpConnectionProperties = getSftpConnectionProperties(vendorRepository);
		DefaultSftpSessionFactory factory = new DefaultSftpSessionFactory(false);
		factory.setHost(sftpConnectionProperties.getHost());
		factory.setPort(sftpConnectionProperties.getPort());
		factory.setUser(sftpConnectionProperties.getUsername());
		factory.setPassword(sftpConnectionProperties.getPassword());
		factory.setAllowUnknownKeys(true);
		return factory;
	}

	public SftpConfigDto getSftpConnectionProperties(VendorRepository vendorRepository) {
		VendorDao vendor = vendorRepository.findByVendorCode(VendorCodeEnum.EPOSS_SFTP.toString());
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), JsonData.class);
		SftpConfigDto sftpConfigDto = MapperUtil.mapObjToClass(jsonData.getData(), SftpConfigDto.class);
		sftpConfigDto.setPassword(CryptoUtil.decrypt(sftpConfigDto.getPassword(), CommonConstants.PASS_WORD, false));

		return sftpConfigDto;
	}
}
