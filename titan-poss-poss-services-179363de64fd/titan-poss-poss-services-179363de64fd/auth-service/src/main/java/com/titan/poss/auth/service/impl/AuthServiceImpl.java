/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.service.impl;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.ProviderNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.auth0.jwt.JWT;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.auth.dao.EmployeeDao;
import com.titan.poss.auth.dao.EmployeeRoleMappingDao;
import com.titan.poss.auth.dao.RoleDao;
import com.titan.poss.auth.dao.UserLoginDao;
import com.titan.poss.auth.dao.UserSessionDao;
import com.titan.poss.auth.dto.CredentialDto;
import com.titan.poss.auth.repository.EmployeeRoleMappingRepository;
import com.titan.poss.auth.repository.RoleAclRepositoryExt;
import com.titan.poss.auth.repository.UserLoginRepository;
import com.titan.poss.auth.repository.UserSessionRepository;
import com.titan.poss.auth.service.AuthService;
import com.titan.poss.auth.service.UserService;
import com.titan.poss.core.auth.domain.AuthenticationToken;
import com.titan.poss.core.auth.domain.JwtTokenProps;
import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.auth.domain.TokenBodyResponse;
import com.titan.poss.core.auth.util.JwtUtill;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.exception.RequestException;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.HttpRequestUtil;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.repository.LocationRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("authService")
public class AuthServiceImpl implements AuthService {

	@Value("${poss.logout.offset:3}")
	private int logoutOffset;

	@Value("${strictCheck:true}")
	private Boolean strictCheck;

	@Value("${app.name}")
	private String appName;

	@Value("${poss.auth.force-change-password-days:30}")
	private int forceChangePasswordDays;

	private static final Logger LOGGER = LoggerFactory.getLogger(AuthServiceImpl.class);

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserLoginRepository userLoginRepository;

	@Autowired
	private EmployeeRoleMappingRepository empRoleRepository;

	@Autowired
	private RoleAclRepositoryExt roleAclRepo;

	@Autowired
	private UserSessionRepository userSessionRepository;

	@Autowired
	private JwtUtill jwtUtill;

	@Autowired
	private UserService userService;

	@Autowired
	private LocationRepository locationRepo;

	private static final String REF_TOK_NULL_HTTP_ONLY_PATH_MAX_AGE_0 = "ref_tok=null; HttpOnly; Path=/; max-age=0;";
	private static final String AUTHORIZATION_NULL_HTTP_ONLY_PATH_MAX_AGE_0 = "Authorization=null; HttpOnly; Path=/; max-age=0;";
	private static final String SET_COOKIE = "Set-Cookie";

	private static final String SESSION_DOESNT_EXIST = "Session doesn't exist";

	@Override
	@Transactional
	public OAuthToken login(String username, CredentialDto credentials, String hostNameEnc, boolean isApiUserAllowed,
			HttpServletResponse response) {

		String brandCode = null;
		String password = null;
		if (credentials != null) {
			brandCode = credentials.getBrandCode();
			password = credentials.getPassword();
		}
		String hostName = null;
		if (StringUtils.isNotBlank(hostNameEnc))
			hostName = CryptoUtil.asymmetricDecrypt(hostNameEnc, "hostName", true);

		LOGGER.info("Validating credentials for user {}", username);
		// DTO for 2nd parameter
		CredentialDto credntials = new CredentialDto(password, brandCode, isApiUserAllowed);

		Authentication auth = new AuthenticationToken(username, credntials);
		OAuthToken oAuthToken = null;
		try {
			authenticationManager.authenticate(auth);
			oAuthToken = generateJwtToken(username, brandCode, hostName, false);
		} catch (ProviderNotFoundException e) {
			throw new BadCredentialsException("Invalid credentials");
		}

		// set cookie
		if (!isApiUserAllowed && oAuthToken != null)
			setCookies(response, oAuthToken, true);

		return oAuthToken;
	}

	private void removeHeadersFromCookies(HttpServletResponse response) {
		response.addHeader(SET_COOKIE, AUTHORIZATION_NULL_HTTP_ONLY_PATH_MAX_AGE_0);
		response.addHeader(SET_COOKIE, REF_TOK_NULL_HTTP_ONLY_PATH_MAX_AGE_0);
	}

	private List<RoleDao> getValidRoleBasedOnEmployee(EmployeeDao emp) {
		List<EmployeeRoleMappingDao> erm = empRoleRepository.findByEmployee(emp);
		return erm.stream().map(EmployeeRoleMappingDao::getRole).collect(Collectors.toList());
	}

	private List<String> getActiveAclByRoles(List<String> roleCodes) {
		List<String> acls = new ArrayList<>();
		if (!CollectionUtils.isEmpty(roleCodes))
			acls = roleAclRepo.getActiveAclByRoles(roleCodes);
		return acls;
	}

	private Boolean isOffline(EmployeeDao employee) {

		Boolean isOffline = false;

		if (CommonUtil.isAStoreUser(employee.getUserType())) {

			LocationDao locationDao = locationRepo.findOneByLocationCode(employee.getLocationCode());

			isOffline = BooleanUtils.isTrue(locationDao.getIsOffline());
		}
		return isOffline;
	}

	private OAuthToken generateJwtToken(String username, String brandCode, String hostName, boolean isSso) {

		UserLoginDao user = userLoginRepository.findByUserName(username);
		if (user == null)
			throw new BadCredentialsException("Invalid credentials");

		EmployeeDao employee = user.getEmployee();
		boolean isApiUser = employee.getUserType().equals(UserTypeEnum.API.name());

		OAuthToken oAuthToken = null;
		try {

			oAuthToken = setJwtTokenProps(user, isApiUser, hostName, brandCode, isSso);

		} catch (Exception e) {
			LOGGER.error("error  while generating jwt token", e);
		}
		// Generate refresh token only if the user is not an API users
		if (!isApiUser && oAuthToken != null)
			generateRefreshToken(oAuthToken, user.getUserName(), hostName);
		LOGGER.info("Authentication successful for user {}", username);
		return oAuthToken;
	}

	private void generateRefreshToken(OAuthToken oAuthToken, String upn, String hostName) {

		long refreshTokenExpiresAt = CalendarUtils.getMidnightTime(logoutOffset);
		List<UserSessionDao> userSessions = userSessionRepository.findByUserLoginUserNameAndIsActiveTrue(upn);
		if (!userSessions.isEmpty()) {
			long currentTime = Instant.now().getEpochSecond();
			for (int i = userSessions.size() - 1; i >= 0; i--) {
				long exp = userSessions.get(i).getExpiryDate().getTime() / 1000;
				if (currentTime > exp) {
					log.debug("id: {}, expTime: {}, deactivate" + userSessions.get(i), new Date(exp));
					userSessions.get(i).setActive(false);
					userSessions.get(i).setLastModifiedBy(upn);
					userSessions.get(i).setLastModifiedDate(CalendarUtils.getCurrentDate());
				}
			}
		}
		Instant instant = Instant.now();
		UserSessionDao userSession = new UserSessionDao();
		UserLoginDao user = new UserLoginDao();
		user.setUserName(upn);
		userSession.setUserLogin(user);
		userSession.setHostName(hostName);
		userSession.setActive(true);
		userSession.setExpiryDate(Date.from(Instant.ofEpochSecond(refreshTokenExpiresAt / 1000)));
		userSession.setLoginDate(Date.from(Instant.ofEpochSecond(instant.getEpochSecond())));
		userSession.setToken(UUID.randomUUID().toString().replace("-", ""));
		userSession.setCreatedBy(user.getUserName());
		userSession.setLastModifiedBy(user.getUserName());
		userSession.setLastModifiedDate(CalendarUtils.getCurrentDate());
		userSession.setCreatedDate(CalendarUtils.getCurrentDate());
		userSessions.add(userSession);
		userSessionRepository.saveAll(userSessions);

		oAuthToken.setRefreshTokenExpiresAt(Instant.ofEpochSecond(refreshTokenExpiresAt / 1000).toString());
		oAuthToken.setRefreshTokenExpiresIn(
				String.valueOf(refreshTokenExpiresAt - CalendarUtils.getCurrentDate().getTime()));
		oAuthToken.setRefreshTokenId(userSession.getToken());
		oAuthToken.setRefreshTokenIssuedAt(Instant.ofEpochSecond(instant.getEpochSecond()).toString());
	}

	@Override
	@Transactional
	public OAuthToken reload(String authCookie, String device, String audience, String refToken) throws IOException {
		OAuthToken token = null;
		TokenBodyResponse bodyJson;
		if (authCookie == null || refToken == null) {
			log.debug("Authorization: {}, refToken: {}", authCookie, refToken);
			throw new InsufficientAuthenticationException(SESSION_DOESNT_EXIST);
		}
		jwtUtill.verify("Bearer " + authCookie, audience);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		String tokenBody = new String(Base64.getDecoder().decode(authCookie.split("\\.")[1]), StandardCharsets.UTF_8);
		bodyJson = mapper.readValue(tokenBody, TokenBodyResponse.class);

		UserSessionDao userSession = userSessionRepository.findOneByUserLoginUserNameAndToken(bodyJson.getUpn(),
				refToken);
		checkIfSessionExist(userSession);

		userService.verifyUser(userSession.getUserLogin().getUserName(), bodyJson.getBrand(), false);
		token = new OAuthToken();
		token.setTokenType("Bearer");
		token.setAccessToken(authCookie);
		token.setExpiresAt(String.valueOf(bodyJson.getExp()));
		token.setExpiresIn(String.valueOf(bodyJson.getExp() - bodyJson.getIat()));
		token.setRefreshTokenId(refToken);
		token.setRefreshTokenIssuedAt(userSession.getCreatedDate().toInstant().toString());
		token.setRefreshTokenExpiresAt(userSession.getExpiryDate().toInstant().toString());
		token.setRefreshTokenExpiresIn(
				String.valueOf(userSession.getExpiryDate().getTime() - userSession.getCreatedDate().getTime()));

		return token;
	}

	private void checkIfSessionExist(UserSessionDao userSession) {
		if (userSession == null || !userSession.isActive())
			throw new InsufficientAuthenticationException(SESSION_DOESNT_EXIST);
	}

	public OAuthToken setJwtTokenProps(UserLoginDao user, boolean isApiUser, String hostName, String brandCode,
			boolean isSso) throws IOException {

		EmployeeDao employee = user.getEmployee();

		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();

		JwtTokenProps jwtTokenProps = new JwtTokenProps();
		jwtTokenProps.setAudience(HttpRequestUtil.getHost(request));
		jwtTokenProps.setIpAddress(HttpRequestUtil.getDevice(request));

		jwtTokenProps.setHostName(hostName);
		jwtTokenProps.setBrandCode(brandCode);

		jwtTokenProps.setAppName(appName);

		jwtTokenProps.setIsOffline(isOffline(employee));
		jwtTokenProps.setIsSso(isSso);

		List<RoleDao> roles = getValidRoleBasedOnEmployee(user.getEmployee());
		List<String> roleCodes = roles.stream().map(RoleDao::getRoleCode).collect(Collectors.toList());
		List<String> acls = getActiveAclByRoles(roleCodes);

		jwtTokenProps.setScp(acls.stream().distinct().collect(Collectors.toList()));
		if (!isSso)
			jwtTokenProps.setForcePasswordChange(CalendarUtils.getCurrentDate()
					.after(CalendarUtils.addNnoOfDays(forceChangePasswordDays, user.getPasswordChangedDate())));
		jwtTokenProps.setUpn(user.getUserName());
		jwtTokenProps.setEmpCode(employee.getEmployeeCode());
		jwtTokenProps.setEmpName(employee.getEmpName());

		jwtTokenProps.setApiKey(isApiUser);

		getJwtTokenProperties(employee, jwtTokenProps);
		return jwtUtill.generate(jwtTokenProps, isApiUser);
	}

	@Override
	public OAuthToken refreshToken(String refreshToken, String device, HttpServletResponse response)
			throws IOException {

		UserSessionDao session = verifyRefreshToken(refreshToken);

		UserLoginDao user = userService.verifyUser(session.getUserLogin().getUserName(),
				CommonUtil.getAuthUser().getBrandCode(), false);

		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();

		String token = jwtUtill.getCookieByName(request.getCookies(), "Authorization");

		if (token == null)
			throw new InsufficientAuthenticationException(SESSION_DOESNT_EXIST);

		JWT jwt = jwtUtill.getJwt(token);
		String hostName = jwt.getClaim("host").asString();
		String brandCode = jwt.getClaim("brand").asString();
		Boolean isSso = jwt.getClaim("isSso").asBoolean();
		OAuthToken oAuthToken = setJwtTokenProps(user, false, hostName, brandCode, isSso);

		oAuthToken.setRefreshTokenId(session.getToken());
		oAuthToken.setRefreshTokenExpiresAt(session.getExpiryDate().toInstant().toString());
		oAuthToken.setRefreshTokenExpiresIn(
				String.valueOf(session.getExpiryDate().getTime() - session.getCreatedDate().getTime()));
		oAuthToken.setRefreshTokenIssuedAt(session.getCreatedDate().toInstant().toString());

		// set cookie
		setCookies(response, oAuthToken, false);

		return oAuthToken;
	}

	private void setCookies(HttpServletResponse response, OAuthToken token, boolean isLoginApi) {
		response.addCookie(setCookie("Authorization", token.getAccessToken()));
		// set ref_token only through login API, not through refresh API anymoore
		if (isLoginApi) {
			Date currentDate = CalendarUtils.getCurrentDate();
			Integer midNightSec = (int) ((CalendarUtils.getMidnightTime(logoutOffset) - currentDate.getTime()) / 1000);
			response.addCookie(setCookie("ref_tok", token.getRefreshTokenId(), midNightSec));
		}
	}

	private Cookie setCookie(String name, String value, Integer expTime) {

		Cookie cookie = new Cookie(name, value);

		if (!CommonUtil.isDev())
			cookie.setHttpOnly(true);
		if (strictCheck)
			cookie.setSecure(true);
		cookie.setPath("/");

		int expiry = 0;
		if (expTime == null)
			expiry = (int) jwtUtill.getTokenValidtyForNormalUser() * 60;
		else
			expiry = expTime;
		cookie.setMaxAge(expiry);
		return cookie;
	}

	private Cookie setCookie(String name, String value) {
		return setCookie(name, value, null);
	}

	private void getJwtTokenProperties(EmployeeDao employee, JwtTokenProps jwtTokenProps) {
		jwtTokenProps.setType(employee.getUserType());
		if (!StringUtils.isEmpty(employee.getLocationCode())) {
			jwtTokenProps.setLoc(employee.getLocationCode());
		} else if (!StringUtils.isEmpty(employee.getRegionCode())) {
			jwtTokenProps.setLoc(employee.getRegionCode());
		} else if (!StringUtils.isEmpty(employee.getOrgCode())) {
			jwtTokenProps.setLoc(employee.getOrgCode());
		}
		jwtTokenProps.setOrgCode(employee.getOrgCode());
		jwtTokenProps.setMobileNo(employee.getMobileNo());
		jwtTokenProps.setEmailId(employee.getEmailId());
	}

	private UserSessionDao verifyRefreshToken(String tokenId) {
		log.debug("session id to check: {}", tokenId);
		UserSessionDao session = userSessionRepository.findOneByToken(tokenId);
		if (session == null) {
			throw new InsufficientAuthenticationException(SESSION_DOESNT_EXIST);
		}
		if (isTokenExpired(session) || !session.isActive()) {
			log.debug("Active? {}", session.isActive());
			throw new CredentialsExpiredException("Refresh Token Expired");
		}
		return session;
	}

	private boolean isTokenExpired(UserSessionDao session) {
		boolean isExpired = true;
		long exp = session.getExpiryDate().toInstant().toEpochMilli() / 1000;
		long currentTime = Instant.now().getEpochSecond();
		if (currentTime < exp) {
			isExpired = false;
		} else {
			log.debug("currentTime: {}, expTime: {}. Expired." + new Date(currentTime), new Date(exp));
		}
		return isExpired;
	}

	@Override
	@Transactional
	public String logout(String username, String device, String refToken, HttpServletResponse response) {
		LOGGER.info("Logout request for user: {} with ref_token: {}", username, refToken);
		removeHeadersFromCookies(response);
		UserSessionDao userSession = verifyRefreshToken(refToken);
		checkIfSessionExist(userSession);
		userSession.setLogoutDate(CalendarUtils.getCurrentDate());
		userSession.setActive(false);
		userSession.setLastModifiedBy(username);
		userSession.setLastModifiedDate(CalendarUtils.getCurrentDate());
		userSessionRepository.save(userSession);
		LOGGER.info("Logout successful for user {}", username);
		return "Logged out Succesfully";
	}

	@Override
	public Map<String, Object> init() {

		Map<String, Object> response = new HashMap<>();
		try {
			response.put("publicKey", CryptoUtil.getLoginKeyData());
		} catch (Exception e) {
			throw new ServiceException("Unable to fetch public key", "ERR-AUTH-011", e);
		}
		return response;
	}

	@Override
	public OAuthToken samlLogin(String username, String brandCode, String hostName, HttpServletResponse res) {
		OAuthToken oAuthToken = null;
		try {
			oAuthToken = generateJwtToken(username, brandCode, hostName, true);
			setCookies(res, oAuthToken, true);
		} catch (RequestException e) {
			LOGGER.error(e.getMessage());
			return null;
		}
		return oAuthToken;
	}

}
