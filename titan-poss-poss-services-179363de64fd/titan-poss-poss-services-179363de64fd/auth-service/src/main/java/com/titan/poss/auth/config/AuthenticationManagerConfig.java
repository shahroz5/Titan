/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.config;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Lists;
import com.titan.poss.auth.dao.UserLoginDao;
import com.titan.poss.auth.dto.CredentialDto;
import com.titan.poss.auth.service.UserService;
import com.titan.poss.core.auth.domain.AuthenticationToken;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.PasswordHashUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Configuration
public class AuthenticationManagerConfig implements AuthenticationProvider {

	@Value("${poss.auth.login.max-failed-attempts:3}")
	private int maxRetryAttempt;

	@Value("${poss.auth.login.block-time:8}")
	private int blockTimeInSec;

	@Value("${poss.logout.offset:3}")
	private int logoutOffset;

	@Autowired
	private UserService userService;

	private Map<String, Date> userWithTimeMap = new HashMap<>();

	@Override
	@Transactional
	public Authentication authenticate(Authentication authentication) {

		String username = authentication.getName();
		CredentialDto credential = (CredentialDto) authentication.getCredentials();
		String password = credential.getPassword();
		String brandCode = credential.getBrandCode();
		boolean isApiUserAllowed = credential.isApiUserAllowed();
		UserLoginDao user = userService.verifyUser(username, brandCode, isApiUserAllowed);
		Authentication auth = null;

		Date currentTime = CalendarUtils.getCurrentDate();
		int maxRetryAttemptBeforeLock = maxRetryAttempt - 1;

		Date userSprcificExpTime = userWithTimeMap.get(username);

		if (userSprcificExpTime != null) {

			if (userSprcificExpTime.compareTo(currentTime) > 0) {

				long waitingTime = userSprcificExpTime.getTime() - currentTime.getTime();
				long waitingTimeInSec = (waitingTime / 1000) + 1; // floor, by default it gives ceiling

				// @formatter:off
				Map<String, String> dynVal = Map.of("BLOCK_IN_SEC", Integer.toString(blockTimeInSec),
												    "MAX_RETRY_ATTEMPT", Integer.toString(maxRetryAttemptBeforeLock),
								                    "PENDING_SEC", Long.toString(waitingTimeInSec));
				// @formatter:on

				throw new ServiceException("Please try after " + waitingTime + " seconds", "ERR-AUTH-022", dynVal);
			} else {
				userWithTimeMap.remove(username);
			}

		}

		if (user.getPassword() != null) {
			String decodedPassword;
			decodedPassword = CryptoUtil.asymmetricDecrypt(password, "password", true);
			String salt = user.getSalt();
			String hashedPassword = PasswordHashUtil.getSecurePassword(decodedPassword, salt);

			if (hashedPassword.equals(user.getPassword())) {

				List<? extends GrantedAuthority> emptyList = Lists.newArrayList();
				auth = new UsernamePasswordAuthenticationToken(username, password, emptyList);
				user.setIsLocked(false);
				user.setFailedAttempts(0);
				user.setLastLoginDate(CalendarUtils.getCurrentDate());
				user.setLastModifiedBy(user.getUserName());
				userService.saveUser(user);

			} else {

				user.setFailedAttempts(user.getFailedAttempts() + 1);
				user.setLastModifiedBy(user.getUserName());

				if (user.getFailedAttempts() == maxRetryAttemptBeforeLock) {
					// last n-1 try done with all failure, hence need to block for some second,
					// before allowing
					Date blockTill = addNSecToCurrentTime(blockTimeInSec);
					userWithTimeMap.put(username, blockTill);
				}

				if (user.getFailedAttempts() < maxRetryAttempt) {
					userService.saveUserLogin(user);
				} else {
					user.setIsLocked(true);
					userService.sendLockedNotification(user);
					userService.saveUserLogin(user);
					userService.throwMaxLoginTryReachedErr(maxRetryAttempt);
				}
				log.error("invalid credential - {}", username);
			}
		}
		return auth;
	}

	private Date addNSecToCurrentTime(int blockTimeInSec) {
		Calendar currentTimeCal = Calendar.getInstance();
		currentTimeCal.add(Calendar.SECOND, blockTimeInSec);
		return currentTimeCal.getTime();
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(AuthenticationToken.class);
	}

}
