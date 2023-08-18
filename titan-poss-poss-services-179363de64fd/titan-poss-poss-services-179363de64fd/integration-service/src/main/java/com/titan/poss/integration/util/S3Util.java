/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.util;

import static com.titan.poss.core.utils.FileUtil.FILE_FORWARD_SEPARATOR;

import java.util.HashMap;
import java.util.Map;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
//@Service("integrationS3Util")
public class S3Util {

	public static final String TEMP_BUCKET_PREFIX = "temp";
	public static final String TEMP_BUCKET_PREFIX_REGEX = "^" + TEMP_BUCKET_PREFIX + FILE_FORWARD_SEPARATOR + ".{1}$";

	public static final String BUCKET = "bucket";
	public static final String KEY = "key";

	private S3Util() {
		throw new IllegalArgumentException("S3Util class");
	}

	public static Map<String, String> getBucketKeyName(String filePath) {

		Map<String, String> bucketKey = new HashMap<>();

		filePath = filePath.substring(1);
		int firstFolderEndIndex = filePath.indexOf(FILE_FORWARD_SEPARATOR);
		String bucketName = filePath.substring(0, firstFolderEndIndex);
		String key = filePath.substring(firstFolderEndIndex + 1);

		bucketKey.put(BUCKET, bucketName);
		bucketKey.put(KEY, key);

		return bucketKey;
	}
}
