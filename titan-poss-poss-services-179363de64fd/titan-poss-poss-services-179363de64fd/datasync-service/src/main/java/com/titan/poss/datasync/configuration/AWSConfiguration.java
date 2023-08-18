/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.aws.messaging.core.NotificationMessagingTemplate;
import org.springframework.cloud.aws.messaging.core.QueueMessagingTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.amazon.sqs.javamessaging.AmazonSQSExtendedClient;
import com.amazon.sqs.javamessaging.ExtendedClientConfiguration;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSAsync;
import com.amazonaws.services.sns.AmazonSNSAsyncClientBuilder;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSAsync;
import com.amazonaws.services.sqs.AmazonSQSAsyncClientBuilder;
import com.amazonaws.services.sqs.AmazonSQSClient;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class AWSConfiguration {

	@Value("${cloud.aws.credentials.accesskey}")
	private String accessKey;

	@Value("${cloud.aws.credentials.secretkey}")
	private String secretKey;

	@Value("${cloud.aws.region.static}")
	private String region;

	@Value("${cloud.aws.s3.credentials.accessKey}")
	private String s3accessKey;

	@Value("${cloud.aws.s3.credentials.secretKey}")
	private String s3secretKey;
	
	@Value("${cloud.aws.s3.queue.bucketName:prod-queue-message}")
	private String S3_BUCKET_NAME;

	@Bean
	@Primary
	public BasicAWSCredentials s3basicAWSCredentials() {
		return new BasicAWSCredentials(s3accessKey, s3secretKey);
	}

	@Bean
	public BasicAWSCredentials basicAWSCredentials() {
		return new BasicAWSCredentials(accessKey, secretKey);
	}

	@Bean
	@Primary
	public AmazonS3 amazonS3() {
		return AmazonS3ClientBuilder.standard().withRegion(region)
				.withCredentials(new AWSStaticCredentialsProvider(s3basicAWSCredentials())).build();
	}

	@Bean
	@Primary
	public AmazonSQS amazonSQSAsync() {
			
		final ExtendedClientConfiguration extendedClientConfig = new ExtendedClientConfiguration()
				.withLargePayloadSupportEnabled(amazonS3(), S3_BUCKET_NAME);

		return new AmazonSQSExtendedClient(AmazonSQSClient.builder().withRegion(region)
				.withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials())).build(), extendedClientConfig);
		
//		return AmazonSQSAsyncClientBuilder.standard().withRegion(region)
//				.withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials())).build();
	}

	@Bean
	@Primary
	public AmazonSNS amazonSNSAsync() {

		return AmazonSNSAsyncClientBuilder.standard().withRegion(region)
				.withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials())).build();
	}

	@Bean
	public QueueMessagingTemplate queueMessagingTemplate(AmazonSQSAsync amazonSQSAsync) {
		return new QueueMessagingTemplate(amazonSQSAsync);
	}

	@Bean
	public NotificationMessagingTemplate notificationMessagingTemplate(AmazonSNS amazonSNS) {
		return new NotificationMessagingTemplate(amazonSNS);
	}

}
