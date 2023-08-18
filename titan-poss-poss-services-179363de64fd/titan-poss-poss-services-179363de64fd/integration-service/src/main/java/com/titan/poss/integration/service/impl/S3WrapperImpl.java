/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.PresignedUrlDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.dto.FileUploadResponseDto;
import com.titan.poss.integration.service.S3Wrapper;
import com.titan.poss.integration.service.factory.StorageFactory;
import com.titan.poss.integration.util.S3Util;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class S3WrapperImpl implements S3Wrapper {

	public S3WrapperImpl(StorageFactory storageFactory) {
		storageFactory.registerStorageService(VendorCodeEnum.AWS_S3.name(), this);
	}

	@Autowired
	private AmazonS3 s3Client;

	@Value("${cloud.aws.s3.expTime}")
	private Integer expTimeDurationSeconds;

	@Override
	public PutObjectResult uploadFile(String bucketName, String key, File file) {

		try {
			return upload(new FileInputStream(file), bucketName, key);
		} catch (FileNotFoundException e) {
			throw new ServiceException("File doesn't exist or not readable", "ERR-CORE-020", e);
		}
	}

	// temp/{uuid} when temp, other wise {uuid} as key, append file name here to key
	@Override
	public FileUploadResponseDto uploadFile(String bucketName, String commonKey, MultipartFile file, String fileName) {

		Date expiration = getExpiryTime();

		String key = commonKey + fileName;
		try {
			upload(file.getInputStream(), bucketName, key);
		} catch (IOException e) {
			throw new ServiceException("File doesn't exist or not readable", "ERR-CORE-020", e);
		}

		String presignedUrl = getSignedUrlByKey(bucketName, expiration, key);

		return new FileUploadResponseDto(fileName, key, presignedUrl, expiration);
	}

	@Override
	public byte[] getFile(String bucketName, String key) {
		S3Object s3Object = s3Client.getObject(bucketName, key);
		S3ObjectInputStream objectInputStream = s3Object.getObjectContent();
		byte[] content;
		try {
			content = IOUtils.toByteArray(objectInputStream);
		} catch (IOException e) {
			throw new ServiceException("byte array copy failed.", "ERR-INT-003", e);
		}
		return content;

	}

	@Override
	public void deleteFile(String bucketName, String key) {
		s3Client.deleteObject(bucketName, key);
	}

	// generic upload method
	private PutObjectResult upload(InputStream inputStream, String bucketName, String key) {

		PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, inputStream, new ObjectMetadata());
		PutObjectResult result = s3Client.putObject(putObjectRequest);

		IOUtils.closeQuietly(inputStream);

		return result;
	}

	@Override
	public PresignedUrlDto getUrlForListOfObject(Set<String> keys, String bucketName) {

		Date expiration = getExpiryTime();

		Map<String, String> objWithUrl = new HashMap<>();

		for (String key : keys) {

			String signedUrl = getSignedUrlByKey(bucketName, getExpiryTime(), key);

			objWithUrl.put(key, signedUrl);
		}

		return new PresignedUrlDto(objWithUrl, expiration);
	}

	private String getSignedUrlByKey(String bucketName, Date expiration, String key) {

		// @formatter:off
		GeneratePresignedUrlRequest generateRequest = 
				new GeneratePresignedUrlRequest(bucketName, key).withExpiration(expiration);
		// @formatter:on

		return s3Client.generatePresignedUrl(generateRequest).toString();
	}

	private Date getExpiryTime() {

		return new Date(new Date().getTime() + (expTimeDurationSeconds * 1000));
	}

	@Override
	public void updateKey(String oldDocumentPath, String newDocumentPath, String bucketName) {

		Map<String, String> newBucketKey = S3Util.getBucketKeyName(newDocumentPath);
		String newKey = newBucketKey.get(S3Util.KEY);

		Map<String, String> oldBucketKey = S3Util.getBucketKeyName(oldDocumentPath);
		String oldKey = oldBucketKey.get(S3Util.KEY);

		s3Client.copyObject(bucketName, oldKey, bucketName, newKey);
		s3Client.deleteObject(bucketName, oldKey);
	}

}
