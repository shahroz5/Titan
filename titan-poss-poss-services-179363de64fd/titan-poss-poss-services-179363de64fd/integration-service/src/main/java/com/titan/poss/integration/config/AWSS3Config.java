/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.S3VendorData;
import com.titan.poss.integration.dto.VendorDataDto;
import com.titan.poss.integration.repository.VendorRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class AWSS3Config {

	@Autowired
	private VendorRepository vendorRepository;

	@Bean
	@Primary
	public AmazonS3 amazonS3() {

		VendorDao vendor = vendorRepository.findByVendorCodeAndIsActiveTrue(VendorCodeEnum.AWS_S3.name());
		if (vendor == null || !vendor.getIsActive())
			throw new ServiceException("No active vendor details found for AWS S3", "Online bucket",
					(vendor != null) ? vendor.getIsActive() : null);

		JsonData jsonData = MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class);
		S3VendorData s3Details = MapperUtil.mapObjToClass(jsonData.getData(), S3VendorData.class);

		String accesskey = CryptoUtil.decrypt(s3Details.getAccesskey(), "accessKey");
		String secretKey = CryptoUtil.decrypt(s3Details.getSecretkey(), "secretKey");
		BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accesskey, secretKey);
		// @formatter:off
		return AmazonS3ClientBuilder.standard()
				.withClientConfiguration(getAWSClientConfiguration(vendor))
				.withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
				.withRegion(s3Details.getRegion())
				.build();
		// @formatter:on
	}

	private ClientConfiguration getAWSClientConfiguration(VendorDao vendor) {

		ClientConfiguration awsClientConfig = new ClientConfiguration();

		awsClientConfig.setMaxErrorRetry(vendor.getRetryCount());
		awsClientConfig.setConnectionTimeout(vendor.getTimeOutSeconds() * 1000);
		// this configuration is required when you want to test in local for dev/prod/QA
		// it will be commented.
		// awsClientConfig.setProxyHost("172.22.218.218");
		// awsClientConfig.setProxyPort(8085);

		return awsClientConfig;
	}

	@Bean("ghs")
	public AmazonS3 s3eGHS() {

		VendorDao vendor = vendorRepository.findByVendorCode(VendorCodeEnum.GHS.name());
		VendorDataDto vendorDataDto = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), JsonData.class)
						.getData(), VendorDataDto.class);
		BasicAWSCredentials awsCredentials = new BasicAWSCredentials(vendorDataDto.getAccesskey(),
				vendorDataDto.getSecretkey());
		return AmazonS3ClientBuilder.standard().withRegion(Regions.fromName(vendorDataDto.getRegion()))
				.withCredentials(new AWSStaticCredentialsProvider(awsCredentials)).build();
	}

}
