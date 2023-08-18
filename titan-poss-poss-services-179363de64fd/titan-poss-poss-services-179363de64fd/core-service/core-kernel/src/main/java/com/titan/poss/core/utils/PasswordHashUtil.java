/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.utils;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import com.titan.poss.core.dto.BoutiqueMetalRateDto;
import com.titan.poss.core.dto.DepositPasswordDto;
import com.titan.poss.core.dto.GhsOfflineEODRequestDto;
import com.titan.poss.core.dto.ManualBillDto;
import com.titan.poss.core.dto.MetalRateWithWeightDto;
import com.titan.poss.core.exception.ServiceException;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class PasswordHashUtil {

	private static final Logger LOGGER = LoggerFactory.getLogger(PasswordHashUtil.class);

	private static final int KEY_LENGTH = 64; // 512 bits
	private static final int ITERATION_COUNT = 1000;
	private static final String ERR_CORE_006 = " ERR-CORE-006";
	private static final String NO_SUCH_ALGO = "No Such Algorithm exists";

	private PasswordHashUtil() {
		throw new IllegalAccessError("Utility class");
	}

	public static String getCommonSaltForSales() {
		return getValueFromKeyWithNullAssertion("poss.crypto.hash_key_sales",
				"Salt is mandatory. Please set salt for this service");
	}

	public static String getGhsSaltForSales() {
		return getValueFromKeyWithNullAssertion("poss.crypto.hash_key_sales_ghs",
				"GHS Salt is mandatory. Please set salt for this service");
	}

	private static String getValueFromKeyWithNullAssertion(String key, String nullErrMessage) {
		String val = ApplicationPropertiesUtil.getProperty(key);
		Assert.notNull(val, nullErrMessage);
		return val;
	}

	public static String getSecurePassword(String password, String salt) {
		char[] passwordCharArray = password.toCharArray();
		byte[] res = new byte[1];
		try {
			SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512");
			PBEKeySpec spec = new PBEKeySpec(passwordCharArray, Base64.getDecoder().decode(salt), ITERATION_COUNT,
					KEY_LENGTH);
			SecretKey key = skf.generateSecret(spec);
			res = key.getEncoded();
		} catch (InvalidKeySpecException invalidKey) {
			LOGGER.error(" Invalid Key ", invalidKey);
		} catch (NoSuchAlgorithmException noSuchAlgo) {
			LOGGER.error(NO_SUCH_ALGO, noSuchAlgo);
		}
		return Base64.getEncoder().encodeToString(res);
	}

	public static String getSecureOfflinePassword(String input, String salt) {
		MessageDigest md = null;
		String password = null;
		String base64EncryptedPassword = null;
		StringBuilder bld = new StringBuilder();
		try {
			md = MessageDigest.getInstance("SHA-512");
			md.update(input.concat(salt).getBytes(StandardCharsets.UTF_8));
			byte[] messageDigestRawText = md.digest();
			base64EncryptedPassword = Base64.getEncoder().encodeToString(messageDigestRawText);
			if (base64EncryptedPassword.length() >= 80) {
				for (int i = 10; i <= base64EncryptedPassword.length(); i++) {
					if (i % 10 == 0 && bld.length() <= 7) {
						bld.append(base64EncryptedPassword.charAt(i));
					}
				}
				password = bld.toString();
			} else {
				throw new ServiceException("error while encoding password input", ERR_CORE_006);
			}
		} catch (NoSuchAlgorithmException noSuchAlgo) {
			LOGGER.error(NO_SUCH_ALGO, noSuchAlgo);
		}
		
		return password;
	}

	public static String decode(String value) {
		byte[] decodedValue = Base64.getDecoder().decode(value); // Basic Base64 decoding
		return new String(decodedValue);
	}

	public static String encode(String password) {
		byte[] passwordEncoded = Base64.getEncoder().encode(password.getBytes());
		return new String(passwordEncoded);
	}

	public static String getSalt() {
		SecureRandom secureRandom;
		byte[] salt = new byte[16];
		try {
			secureRandom = SecureRandom.getInstance("SHA1PRNG");
			secureRandom.nextBytes(salt);
		} catch (NoSuchAlgorithmException noSuchAlgo) {
			LOGGER.error(NO_SUCH_ALGO, noSuchAlgo);
		}
		return Base64.getEncoder().encodeToString(salt);
	}

	/**
	 * this method will return a hashed password based on input parameters. (Same
	 * logic to be used in EPOSS and POSS)
	 * 
	 * @param depositPassword
	 * @param locationCode
	 * @return String
	 */
	public static String getPasswordForBanking(DepositPasswordDto depositPassword, String locationCode) {

		return getSecureOfflinePassword(encode(depositPassword.toString() + locationCode), getCommonSaltForSales());
	}

	/**
	 * this method will return a hashed password based on input parameters. (Same
	 * logic to be used in EPOSS and POSS)
	 * 
	 * @param manualBillDto
	 * @param locationCode
	 * @param metalRateWithWeightListDto
	 * @return String
	 */
	public static String getPasswordForManualBill(ManualBillDto manualBillDto, String locationCode,
			Map<String, MetalRateWithWeightDto> metalRateWithWeightList, String txnType,Boolean isBimetal) {

		StringBuilder input = new StringBuilder("");
		// sort map keys
		List<String> metalTypeCodeList = new ArrayList<>(metalRateWithWeightList.keySet());
		Collections.sort(metalTypeCodeList);

		// get each item from map & concatenate for input
		for (String metalTypeCode : metalTypeCodeList) {
			MetalRateWithWeightDto metalRateWithWeightDto = metalRateWithWeightList.get(metalTypeCode);
			input.append(metalRateWithWeightDto.getMetalTypeCode() + metalRateWithWeightDto.getRatePerUnit()
					+ metalRateWithWeightDto.getTotalMetalWeight());
		}

		// bill value removed from password generation input (new requirement from BA)
		input.append(locationCode + manualBillDto.getManualBillDate() + manualBillDto.getManualBillNo() + txnType + isBimetal);

		
		return getSecureOfflinePassword(encode(input.toString()), getCommonSaltForSales());

	}

	public static String getPasswordForMetalRate(Map<String, BoutiqueMetalRateDto> metalRates, String locationCode,
			Date applicableDate) {

		StringBuilder input = new StringBuilder("");
		// sort map keys
		List<String> metalTypeCodeList = new ArrayList<>(metalRates.keySet());
		Collections.sort(metalTypeCodeList);

		// get each item from map & concatenate for input
		for (String metalTypeCode : metalTypeCodeList) {
			BoutiqueMetalRateDto metalRateDto = metalRates.get(metalTypeCode);
			input.append(metalRateDto.getMetalTypeCode() + metalRateDto.getRatePerUnit());
		}

		input.append(metalRates.toString() + locationCode + applicableDate);
		
		return getSecureOfflinePassword(encode(input.toString()), getCommonSaltForSales());

	}

	public static String getGhsOfflinePasswordBod(String locationCode, Date businessDate, BigDecimal goldRate) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
		String input = locationCode + ";" + simpleDateFormat.format(businessDate) + ";" + goldRate.toString();

		return getSecureOfflinePassword(encode(input), getGhsSaltForSales());
	}

	public static String getGhsOfflinePasswordEod(GhsOfflineEODRequestDto ghsOfflineEODRequestDto) {

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");

		String input = ghsOfflineEODRequestDto.getLocationCode() + ";"
				+ simpleDateFormat.format(ghsOfflineEODRequestDto.getBusinessDate()) + ";"
				+ ghsOfflineEODRequestDto.getCashAmount().toString() + ";"
				+ ghsOfflineEODRequestDto.getCCRevenue().toString() + ";"
				+ ghsOfflineEODRequestDto.getCCCommission().toString() + ";"
				+ ghsOfflineEODRequestDto.getDDAmount().toString() + ";"
				+ ghsOfflineEODRequestDto.getChequeAmount().toString() + ";"
				+ ghsOfflineEODRequestDto.getNetAmount().toString() + ";"
				+ ghsOfflineEODRequestDto.getCashReversal().toString() + ";"
				+ ghsOfflineEODRequestDto.getCCReversal().toString() + ";"
				+ ghsOfflineEODRequestDto.getDDReversal().toString() + ";"
				+ ghsOfflineEODRequestDto.getChequeReversal().toString() + ";"
				+ ghsOfflineEODRequestDto.getCashRefund().toString() + ";"
				+ ghsOfflineEODRequestDto.getRoRefund().toString() + ";"
				+ ghsOfflineEODRequestDto.getAchAmount().toString() + ";"
				+ ghsOfflineEODRequestDto.getEmplSalaryDeductionAmount() + ";"
				+ ghsOfflineEODRequestDto.getAchReversal() + ";"
				+ ghsOfflineEODRequestDto.getEmplSalaryDeductionAmountReversal() + ";"
				+ ghsOfflineEODRequestDto.getAirPayAmount() + ";" + ghsOfflineEODRequestDto.getPaytmAmount() + ";"
				+ ghsOfflineEODRequestDto.getAirPayReversal() + ";" + ghsOfflineEODRequestDto.getPaytmReversal();

		return getSecureOfflinePassword(encode(input), getGhsSaltForSales());
	}

}