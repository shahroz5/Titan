/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.controller;

import java.net.URL;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@RequestMapping(value = "datasync/storage/v2")
public class FileController {

	@Autowired
	AmazonS3 amazonS3;

	String bucketName = "nap-customer-documents";

	@PostMapping(value = "/signedurl")
	public FileResponse getSignedUrl(@RequestParam String operation, @RequestParam String objectKey) {

		FileResponse fr = new FileResponse();

		fr.setUrl(getUrl(operation, objectKey));
		return fr;
	}

	public String getUrl(String operation, String objectKey) {

		Date expTime = new Date();
		long milli = expTime.getTime();
		milli += 1000 * 60 * 60;
		expTime.setTime(milli);

		GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, objectKey)
				.withMethod(HttpMethod.valueOf(operation)).withExpiration(expTime);
		URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);

		return url.toString();
	}



}
