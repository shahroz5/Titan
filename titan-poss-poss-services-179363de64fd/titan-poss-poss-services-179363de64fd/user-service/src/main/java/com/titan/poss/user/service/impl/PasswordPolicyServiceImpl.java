/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.UserLoginDao;
import com.titan.poss.user.dto.PasswordHistory;
import com.titan.poss.user.repository.UserLoginRepositoryExt;
import com.titan.poss.user.service.PasswordPolicyService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("UserPasswordPolicyService")
public class PasswordPolicyServiceImpl implements PasswordPolicyService {

	@Autowired
	UserLoginRepositoryExt userLoginRepo;

	private static final String PSWD_NOT_COMPLIANCE = "Provided password is not in compliance with password policy";
	private static final String ERR_UAM_004 = "ERR-UAM-004";
	private static final String REASON = "REASON";

	// COMPLIANCE CONSTANTS
	private static final String PSWD_REGEX = RegExConstants.PSWD_REGEX_VAR;
	private static final String PSWD_REGEX_MIN_CONST = "#MIN";
	private static final String PSWD_REGEX_MAX_CONST = "#MAX";

	@Value("${poss.user.pswd.min-len:8}")
	private Integer minLenPswd;

	@Value("${poss.user.pswd.max-len:32}")
	private Integer maxLenPswd;

	@Value("${poss.user.pswd.max-consecutive-char:2}")
	private Integer maxConsecutiveAllowed;

	@Value("${poss.user.pswd.max-char-frequency:3}")
	private Integer maxFreqAllowed;

	@Value("${poss.user.pswd.max-no-pswd-store:10}")
	private Integer maxNoOfPswdToStore;

	@Value("${poss.user.check-n-last-pswd:4}")
	private Integer noOfLastPswdToCheck;

	private String getPasswordRegex() {
		// @formatter:off
		return PSWD_REGEX.replace(PSWD_REGEX_MIN_CONST, Integer.toString(minLenPswd))
						 .replace(PSWD_REGEX_MAX_CONST, Integer.toString(maxLenPswd));
		// @formatter:on
	}

	@Override
	public UserLoginDao checkPasswordPolicy(UserLoginDao userLogin, String oldHashedPassword, String newHashedPassword,
			String encodedPassword) {
		String userName = userLogin.getUserName();
		String remarks;

		String input = getRealPswd(encodedPassword);

		// regex to check caps, small, special char, minimum length
		boolean isValid = Pattern.matches(getPasswordRegex(), input);
		if (!isValid) {
			remarks = "This password does not meet the length, complexity requirements of your corporate password policy.";
			throw new ServiceException(PSWD_NOT_COMPLIANCE, ERR_UAM_004, remarks, Map.of(REASON, remarks));
		}
		// to check user name & password not same
		if (input.equals(userName)) {
			remarks = "Username and password should not match";
			throw new ServiceException(PSWD_NOT_COMPLIANCE, ERR_UAM_004, remarks, Map.of(REASON, remarks));
		}

		// consecutive occurrence check
		boolean isConsecutiveDuplicate = isConsecutiveDuplicateChars(input, maxConsecutiveAllowed + 1);
		if (!isConsecutiveDuplicate) {
			remarks = "Maximum occurrence of consecutive characters allowed in a password is " + maxConsecutiveAllowed
					+ ".";
			throw new ServiceException(PSWD_NOT_COMPLIANCE, ERR_UAM_004, remarks, Map.of(REASON, remarks));
		}

		// max frequency allowed check
		boolean isMaxFreqValid = isMaxNoOfTimeSameChars(input, maxFreqAllowed);
		if (!isMaxFreqValid) {
			remarks = "Maximum number of times the same character can appear in a password is " + maxFreqAllowed + ".";
			throw new ServiceException(PSWD_NOT_COMPLIANCE, ERR_UAM_004, remarks, Map.of(REASON, remarks));
		}

		// add & check if not matching with last 5 elements
		checkForLastNPasswords(userLogin, newHashedPassword);

		return userLogin;
	}

	// form string for regex string
	public String getRemarksForRegex() {
		String remarks;
		boolean isPart1 = false;
		boolean isPart2 = false;
		StringBuilder remark = new StringBuilder();
		remark.append("Password");
		List<String> eligibilityChar = new ArrayList<>();
		if (PSWD_REGEX.contains("a-z"))
			eligibilityChar.add("small case");
		if (PSWD_REGEX.contains("A-Z"))
			eligibilityChar.add("upper case");
		if (PSWD_REGEX.contains("@") || PSWD_REGEX.contains("#"))
			eligibilityChar.add("special character");
		if (!eligibilityChar.isEmpty()) {
			isPart1 = generateRemarks(remark, eligibilityChar);
		}
		if (PSWD_REGEX.contains(PSWD_REGEX_MIN_CONST) && PSWD_REGEX.contains(PSWD_REGEX_MAX_CONST)) {

			if (isPart1)
				remark.append(" &");
			remark.append(" should be of range " + minLenPswd + " - " + maxLenPswd);
			isPart2 = true;
		}
		remarks = (!isPart1 && !isPart2) ? null : remark.toString();
		return remarks;
	}

	private boolean generateRemarks(StringBuilder remark, List<String> eligibilityChar) {
		boolean isPart1;
		isPart1 = true;
		remark.append(" should contain ");
		for (int i = 0; i < eligibilityChar.size(); i++) {
			remark.append(eligibilityChar.get(i));
			if (i != eligibilityChar.size() - 1) {
				remark.append(", ");
			}
		}
		return isPart1;
	}

	@SuppressWarnings("unchecked")
	private void checkForLastNPasswords(UserLoginDao userLogin, String newHashedPassword) {
		PasswordHistory pswdHistory = new PasswordHistory();
		List<String> passwords = new ArrayList<>();
		String pswdHistoryStr = userLogin.getPasswordHistory();
		if (!StringUtils.isBlank(pswdHistoryStr)) {
			// free space for new password & check last n password to not to match
			Object obj = MapperUtil.getJsonFromString(pswdHistoryStr);
			Map<String, Object> map = (Map<String, Object>) obj;
			passwords = (List<String>) map.get("passwords");
			emptyOldPswdAndCheckForLastNPassword(passwords, newHashedPassword);
		}
		// add new password to list of passwords & set to class object
		passwords.add(newHashedPassword);
		pswdHistory.setPasswords(passwords);
		userLogin.setPasswordHistory(MapperUtil.getStringFromJson(pswdHistory));

	}

	/**
	 * It store new updated password, but empty space if limit is touched or more
	 * then store it in list after checking if last N password is not same as new
	 * password
	 * 
	 * @param passwords
	 * @param newHashedPassword
	 */
	private List<String> emptyOldPswdAndCheckForLastNPassword(List<String> passwords, String newHashedPassword) {
		int size = passwords.size();
		if (size >= maxNoOfPswdToStore) {
			// if 14 elements, remove 14- (MAX - 1(as adding 1 element))
			// remove starting size - (MAX_NO_PSWD_TO_STORE + 1) elements
			int noOfElementToRemove = size - (maxNoOfPswdToStore - 1);
			passwords.subList(0, noOfElementToRemove).clear();
		}
		// before adding new value to password history list
		boolean isMatching = isPswdMatchWithLastNPswd(passwords, newHashedPassword);
		if (isMatching) {
			String remarks = "User's new password should not be same as last " + noOfLastPswdToCheck + " passwords.";
			throw new ServiceException(PSWD_NOT_COMPLIANCE, ERR_UAM_004, remarks, Map.of(REASON, remarks));
		}
		return passwords;
	}

	private boolean isPswdMatchWithLastNPswd(List<String> pswds, String password) {
		int size = pswds.size();
		// size 0 will never come as if 0 in insertion method, never call this method
		int start = (size < noOfLastPswdToCheck) ? 0 : size - noOfLastPswdToCheck;
		int end = size;
		List<String> pswdsToCompare = pswds.subList(start, end);

		return pswdsToCompare.contains(password);
	}

	// decode the password
	private String getRealPswd(String encryptedPassword) {
		return CryptoUtil.asymmetricDecrypt(encryptedPassword, "password", false);
	}

	// check if any consecutive chars are duplicate for n times
	private boolean isConsecutiveDuplicateChars(String str, int duplicateCount) {
		if (StringUtils.isEmpty(str) || str.length() < duplicateCount) {
			return true;
		}
		boolean isDuplicate = false;
		for (int i = 0; i < str.length() - duplicateCount + 1; i++) {
			isDuplicate = allCharactersSame(str.substring(i, i + duplicateCount));
			if (isDuplicate) {
				break;
			}
		}
		return !isDuplicate;
	}

	// check if a string having 0 to n, all chars are same
	private static boolean allCharactersSame(String str) {

		int n = str.length();
		for (int i = 1; i < n; i++)
			if (str.charAt(i) != str.charAt(0))
				return false;
		return true;
	}

	// check if any character's frequency is more than allowed
	private boolean isMaxNoOfTimeSameChars(String str, int maxNoOfTime) {
		if (StringUtils.isEmpty(str) || str.length() < maxNoOfTime) {
			return true;
		}

		String[] result = new String[str.length()];
		for (int i = 0; i < str.length(); i++)
			result[i] = Character.toString(str.charAt(i));

		Map<String, Long> freq = Stream.of(result)
				.collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

		boolean isValid = true;
		for (Long num : freq.values()) {
			if (num.intValue() > maxFreqAllowed) {
				isValid = false;
				break;
			}
		}
		return isValid;
	}

}
