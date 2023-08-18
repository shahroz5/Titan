/*  Copyright 2019. Titan Company Limited
All rights reserved.
*/
package com.titan.poss.core.utils;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.EncoderException;
import org.apache.commons.codec.net.URLCodec;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.response.JsonData;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class StringUtil {

	private StringUtil() {
		throw new IllegalArgumentException("StringUtil class");
	}

	private static final String RANDOM_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	private static final String RANDOM_CHAR_OTP = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
	// removed I & l, 0 & O

	private static final Logger LOGGER = LoggerFactory.getLogger(StringUtil.class);

	public static boolean compare(String str1, String str2) {
		return (str1 == null ? str2 == null : str1.equals(str2));
	}

	public static String appendUniqueString(Object details, String newValue) {

		if (details == null || details.toString().isBlank())
			return newValue;
		else {
			String detailsStr = details.toString();
			String[] docStrArr = detailsStr.split(",\\s+");
			Set<String> detailsSet = Arrays.stream(docStrArr).collect(Collectors.toSet());
			detailsSet.add(newValue);
			docStrArr = detailsSet.stream().toArray(String[]::new);
			detailsStr = String.join(", ", docStrArr);
			return detailsStr;
		}

	}

	public static boolean isUniqueStringAvailable(Object details, String newValue) {

		boolean isAvailable = false;

		if (details != null) {

			String detailsStr = details.toString();
			String[] docStrArr = detailsStr.split(",");
			Set<String> detailsSet = Arrays.stream(docStrArr).collect(Collectors.toSet());

			isAvailable = detailsSet.contains(newValue);

		}
		return isAvailable;
	}

	public static String encodePath(String path) {
		try {
			path = new URLCodec().encode(path);
		} catch (EncoderException e) {
			LOGGER.error("String: {} can't be encoded: {}", path, e);
		}
		return path;
	}

	public static String decodePath(String path) {
		try {
			path = new URLCodec().decode(path);
		} catch (DecoderException e) {
			LOGGER.error("String: {} can't be decoded: {}", path, e);
		}
		return path;
	}

	public static String getRandomString(Integer length) {
		return RandomStringUtils.random(length, RANDOM_CHAR);
	}

	public static String getRandomStringForOtp(Integer length) {
		return RandomStringUtils.random(length, RANDOM_CHAR_OTP);
	}

	public static boolean isNumeric(String str) {
		try {
			Double.parseDouble(str);
		} catch (NumberFormatException nfe) {
			return false;
		}
		return true;
	}

	public static boolean isNull(String str) {

		boolean nRet = false;
		if (str == null)
			nRet = true;
		return nRet;
	}

	public static String ifNull(String str, String changeStr) {

		String retStr = "";
		if (isNull(str) && !isNull(changeStr)) {
			retStr = changeStr;
		} else {
			retStr = null;
		}
		return retStr;
	}

	public static boolean contains(String str, String searchStr, boolean ignoreCase) {
		if (str == null || searchStr == null) {
			return false;
		}
		return ignoreCase ? str.toLowerCase().contains(searchStr.toLowerCase()) : str.contains(searchStr);
	}

	public static String reverse(String str) {
		return StringUtils.isEmpty(str) ? str : new StringBuilder().append(str).reverse().toString();
	}

	public static String removeSpace(String str) {
		String newStr = null;
		if (str != null)
			newStr = str.replaceAll("[\\s]", "");
		return newStr;
	}

	public static boolean equalWithNullCheck(String str1, String str2) {
		if (str1 == null || str2 == null)
			return false;
		return str1.equals(str2);
	}

	public static Integer getLenOfStringArr(String[] arr) {
		return (arr != null) ? arr.length : null;
	}

	public static Integer getLenOfStringArrWONullErr(String[] arr) {
		return (arr != null) ? arr.length : 0;
	}

	public static String[] merge2StringArray(String[] arr1, String[] arr2) {
		return (String[]) ArrayUtils.addAll(arr1, arr2);
	}

	public static String convertToUTF(String currencySymbol) {
		StringBuilder unicode = new StringBuilder("");
		for (int i = 0; i < currencySymbol.length(); i++) {
			int chInt = currencySymbol.charAt(i);
			unicode.append("U+" + Integer.toHexString(chInt | 0x10000).substring(1).toUpperCase());
		}
		return unicode.toString();
	}

	public static boolean isBlankJsonStr(String str) {

		boolean isValid = false;
		if (StringUtils.isBlank(str) || removeSpace(str).equals("{}"))
			isValid = true;
		return isValid;
	}

	public static boolean isBlankJsonData(JsonData jsonData) {

		boolean isValid = false;
		if (jsonData == null || jsonData.getData() == null || "".equals(jsonData.getData())
				|| "{}".equals(jsonData.getData()))
			isValid = true;
		return isValid;
	}

	/**
	 * send first word of a name, if 1st word 1 length, append 2nd word too
	 * 
	 * @param name
	 * @return String
	 */
	public static String getNameForEmail(String name) {
		String emailName = "User";
		if (StringUtils.isNotBlank(name)) {
			emailName = name.trim();
			String[] words = emailName.split(RegExConstants.WORD_SEPARATOR);
			emailName = words[0];

			// if only 1 char or (2 char and second char is dot) then combine 2nd word also
			if (((words[0].length() == 1) || (words[0].length() == 2 && words[0].charAt(1) == '.')) && words.length > 1)
				emailName = emailName.concat(" " + words[1]);
		}
		String titleCaseFormatted = emailName;
		if (StringUtils.isNotBlank(emailName)) {
			titleCaseFormatted = getTitleCase(emailName);
		}
		return titleCaseFormatted;
	}

	/**
	 * CHange the string to title case
	 * 
	 * @param str
	 * @return Boolean
	 */
	public static String getTitleCase(String str) {

	// @formatter:off
	return Arrays.stream(str.split(RegExConstants.WORD_SEPARATOR)).
			map(word -> word.isEmpty() 
					? word : Character.toTitleCase(word.charAt(0)) + word.substring(1).toLowerCase())
			.collect(Collectors.joining(" "));
	// @formatter:on
	}

	public static Object convertStrToJsonIfPossible(String str) {

		Object obj = null;
		try {
			obj = StringUtils.isBlank(str) ? null : MapperUtil.getJsonFromString(str);
		} catch (Exception e) {
			obj = str;
		}
		return obj;
	}

	public static String appendPort(String url, int port) {

		if (StringUtils.isNotBlank(url) && (port != 80 && port != 443)) {
			StringBuilder urlBuilder = new StringBuilder(url);
			url = urlBuilder.append(":").append(port).toString();
		}

		return url;
	}

	public static String checkNullString(String string) {
		if (string == null) {
			string = "";
		}
		return string;

	}

	public static String convertIntToNum(Integer num) {
		return num.toString();
	}

	public static String convertSetToCommaSeparatedValue(Set<?> collectionList) {

		StringBuilder sb = new StringBuilder();

		if (collectionList == null || collectionList.isEmpty()) {
			return sb.toString();
		}

		for (Object item : collectionList) {
			if (item == null) {
				continue;
			}
			if (sb.length() == 0) {
				sb.append(String.valueOf(item));
			} else {
				sb.append(",");
				sb.append(String.valueOf(item));
			}
		}

		return sb.toString();
	}

	public static String changeCaseToReadableFormat(String s) {

		if (s.lastIndexOf('.') != -1)
			s = s.substring(s.lastIndexOf('.') + 1);

		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < s.length(); i++) {

			char c = s.charAt(i);
			if (isCapitalCase(c)) {

				boolean isPrevLarge = isCapitalCase(s.charAt(i - 1));
				boolean isNextLarge = (i + 1 >= s.length()) || isCapitalCase(s.charAt(i + 1));

				if (!isPrevLarge || !isNextLarge)
					sb.append(" ");
				sb.append((char) (c + 32));

			} else if (isSmallCase(c)) {
				sb.append(c);
			} else {
				sb.append(" ");
				sb.append(c);
			}
		}
		return sb.toString();

	}

	private static boolean isCapitalCase(char c) {
		return (65 <= c && c <= 90);
	}

	private static boolean isSmallCase(char c) {
		return (97 <= c && c <= 122);
	}

}
