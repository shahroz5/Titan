/*  Copyright 2019. Titan Company Limited
All rights reserved.
*/
package com.titan.poss.core.utils;

import org.apache.commons.lang3.RandomStringUtils;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class OTPUtil {

	private OTPUtil() {
		throw new IllegalAccessError("OtpUtil class");
	}

	// removed I & l, 0 & O
	private static final String ALPHA_NUMERIC = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
	private static final String NUMERIC = "123456789";

	public static String generateOtp(int length) {
		return RandomStringUtils.random(length, ALPHA_NUMERIC);
	}

	public static String generateNumberOtp(int length) {
		return RandomStringUtils.random(length, NUMERIC);
	}

	public static String randomNumeric(int length) {
		return RandomStringUtils.random(length, NUMERIC);
	}
}
