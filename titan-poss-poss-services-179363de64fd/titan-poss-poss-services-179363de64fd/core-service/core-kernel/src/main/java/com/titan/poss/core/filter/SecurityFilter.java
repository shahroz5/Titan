/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.filter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;
import org.springframework.web.server.MethodNotAllowedException;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.auth.domain.AuthenticationToken;
import com.titan.poss.core.auth.util.JwtUtill;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.exception.ErrorResponse;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
//@Configuration
public class SecurityFilter extends GenericFilterBean {

	JwtUtill jwtUtill;

	private static final Logger SFLOGGER = LoggerFactory.getLogger(SecurityFilter.class);

	private static final List<String> BLACKLISTED_ONLINE_MODULE_FOR_OFFLINE_USR = List.of("/SALES", "/STORE");

	public SecurityFilter(JwtUtill jwtUtill) {
		super();
		this.jwtUtill = jwtUtill;
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain)
			throws ServletException, IOException {
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		try {
			String audience = request.getHeader("Host");
			boolean isOptionMethod = HttpMethod.OPTIONS.name().equalsIgnoreCase(request.getMethod());

			// if HTTP method is not option
			if (!isOptionMethod) {
				Optional<String> authToken = Optional.ofNullable(request.getHeader(CommonConstants.AUTH_HEADER));
				// header must exist if it's not an HTTP Method
				if (!authToken.isPresent()) {
					throw new AuthenticationCredentialsNotFoundException("Authorization header not present");
				} else {
					verifyTokenAndCookies(request, response, audience, authToken);
				}
				// http method is OPTION & when strictCheck is true throw error
			} else if (getStrictCheck()) {
				throw new MethodNotAllowedException(request.getMethod(), null);
			}
			filterChain.doFilter(request, response);
		} catch (MethodNotAllowedException e) {
			setErrorResponse(response, e, "HTTP Method provided is not allowed");
		} catch (AuthenticationCredentialsNotFoundException | JWTVerificationException | AccessDeniedException e) {
			setErrorResponse(response, e, e.getMessage());
		} catch (Exception e) {
			SFLOGGER.error("SecurityFilter Exception :- \n", e);
			response.addHeader("Set-Cookie", "Authorization=null; HttpOnly; Path=/; max-age=0;");
			response.addHeader("Set-Cookie", "ref_tok=null; HttpOnly; Path=/; max-age=0;");
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
		}
	}

	private String getErrorMessage(String errorCode, String errorMessage) {

		String errMessage = ApplicationPropertiesUtil.getProperty(errorCode);
		if (StringUtils.isBlank(errMessage))
			errMessage = errorMessage;
		return errMessage;
	}

	public void setErrorResponse(HttpServletResponse response, Throwable ex, String errorMessage) {
		SFLOGGER.error("SecurityFilter Exception :- \n", ex);
		Object errorCause = null;
		HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
		String errorCode = StringUtils.EMPTY;
		if (ex instanceof MethodNotAllowedException) {
			httpStatus = HttpStatus.METHOD_NOT_ALLOWED;
			errorCode = "ERR-CORE-024";
		} else if (ex instanceof AuthenticationCredentialsNotFoundException || ex instanceof JWTVerificationException) {
			httpStatus = HttpStatus.UNAUTHORIZED;
			errorCode = "ERR-AUTH-018";
			errorCause = errorMessage;
			// invalid authentication token, token expired etc
		} else if (ex instanceof AccessDeniedException) {
			httpStatus = HttpStatus.FORBIDDEN;
			errorCode = "ERR-AUTH-016";
			errorCause = ex.getMessage();
		}
		errorMessage = getErrorMessage(errorCode, errorMessage);

		response.setStatus(httpStatus.value());
		response.setContentType("application/json");
		ErrorResponse apiError = new ErrorResponse(errorCode, errorMessage, getUUID(),
				(errorCause == null) ? ex.getCause() : errorCause);
		try {
			String json = MapperUtil.getStringFromJson(apiError);
			response.getWriter().write(json);
		} catch (IOException e) {
			SFLOGGER.error("Error :- \n", e);
		}
	}

	private String getUUID() {
		return UUID.randomUUID().toString().replace("-", "").substring(0, 15);
	}

	public Authentication verifyTokenAndCookies(HttpServletRequest request, HttpServletResponse response,
			String audience, Optional<String> authToken) {

		Cookie[] cookies = request.getCookies();
		boolean strictCheck = getStrictCheck();
		SFLOGGER.info("Strict Check :  " + strictCheck);
		audience = removePortIfExist(audience);
		Authentication auth = this.verifyToken(authToken, audience);
		AuthUser authUser = (AuthUser) auth.getPrincipal();

		// As API user needs to call any API without cookie sets
		if (strictCheck && !authUser.isApiKey()) {
			this.cookieCheck(cookies, response, authToken);
		}

		// store user trying to access restricted service of EPOSS
		// one way only allowed if he url contain eposs keyword
		if (authUser.getLocationCode() != null) {

			String requestUrl = request.getRequestURI().toUpperCase();

			boolean isOffLine = true;
			if ((authUser.getIsOffline() != null))
				isOffLine = authUser.getIsOffline();

			if (ApplicationPropertiesUtil.getProperty("app.name").equalsIgnoreCase(AppTypeEnum.EPOSS.name())
					&& isOffLine && (!requestUrl.contains("EPOSS"))) {

				// /V is added as API contains /{version} after base path
				// so it will ignore other place where URL contains sales or store keyword
				boolean isBlackListedURL = BLACKLISTED_ONLINE_MODULE_FOR_OFFLINE_USR.stream()
						.map(service -> service + "/V").anyMatch(requestUrl::contains);
				// TEMP
				isBlackListedURL = false;
				if (isBlackListedURL)
					throw new AccessDeniedException(
							"Some services are black listed for offline store users. Services :- "
									+ BLACKLISTED_ONLINE_MODULE_FOR_OFFLINE_USR.stream()
											.map(serviceUrl -> serviceUrl.substring(1, serviceUrl.length()))
											.collect(Collectors.toList()));
			}

		}

		// if EPOSS user trying to access POSS application
		if (isEpossUser(authUser) && !CommonUtil.isEpossApp()) {
			throw new AccessDeniedException("EPOSS users can't access POSS application.");
		}

		// After end of all verification
		// set security context for application each time filter take action
		// take value from request & set it in context
		SecurityContextHolder.getContext().setAuthentication(auth);

		// Not sure what is this, need to comment & test
		HttpSession session = request.getSession(true);
		session.setAttribute("SECURITY_CONTEXT_USER", auth);
		return auth;
	}

	public boolean isEpossUser(AuthUser authUser) {
		return authUser.isACorpUser() || authUser.isARegionUser();
	}

	public boolean getStrictCheck() {
		String envIsTokenCheckRequired = ApplicationPropertiesUtil.getProperty("strictCheck");
		return StringUtils.isBlank(envIsTokenCheckRequired) || Boolean.parseBoolean(envIsTokenCheckRequired);
	}

	private String removePortIfExist(String audience) {
		String hostName = null;
		if (StringUtils.isBlank(audience))
			return audience;
		int index = audience.indexOf(':');
		if (index == -1)
			hostName = audience;
		else
			hostName = audience.substring(0, index);

		return hostName;
	}

	/**
	 * This method check if required cookie exist, & request token is same as cookie
	 * 
	 * @param cookies   cookies in application
	 * @param response  httpservlet response
	 * @param authToken token in httpservlet request
	 */
	private void cookieCheck(Cookie[] cookies, HttpServletResponse response, Optional<String> authToken) {

		if (cookies == null || cookies.length == 0)
			throw new AuthenticationCredentialsNotFoundException("Authorization Cookie doesn't exist");

		boolean isAuthorizationExist = false;
		boolean isRefTokenExist = false;
		for (Cookie ck : cookies) {
			if (CommonConstants.AUTH_HEADER.equals(ck.getName())) {
				if (authToken.isPresent() && ck.getValue().equals(authToken.get().trim().substring(7).trim())) {
					isAuthorizationExist = true;
				} else {
					ck.setValue(null);
					ck.setMaxAge(0);
					response.addCookie(ck);
					throw new AuthenticationCredentialsNotFoundException("Authorization header and Cookie mismatch");
				}
			} else if (CommonConstants.REF_TOKEN_HEADER.equals(ck.getName())) {
				isRefTokenExist = true;
			}
		}
		if (!isAuthorizationExist) {
			throw new AuthenticationCredentialsNotFoundException("Authorization Cookie doesn't exist");
		}
		if (!isRefTokenExist) {
			throw new AuthenticationCredentialsNotFoundException("Reference token Cookie doesn't exist");
		}
	}

	private Authentication verifyToken(Optional<String> authToken, String audience) {
		// verify provided token is created using same JWT Secret
		Map<String, Claim> claims = new HashMap<>();
		if (authToken.isPresent()) {
			JWT jwt;
			try {
				jwt = jwtUtill.verify(authToken.get(), audience);
			} catch (UnsupportedEncodingException e) {
				SFLOGGER.error(e.getMessage());
				throw new BadCredentialsException("Authenticatin failed");
			}
			claims = jwt.getClaims();
		}
		boolean isApiKey = claims.get("apiKey").asBoolean();
		List<String> aclList = generateDecodedAclData(Arrays.asList(claims.get("acl").asArray(String.class)));
		List<GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList(
				StringUtils.join(aclList.toArray(new String[aclList.size()]), ","));
		AuthUser authUser = this.createAuthUser(claims, authorities, isApiKey);
		return new AuthenticationToken(authUser, null, authorities);
	}

	private static List<String> generateDecodedAclData(List<String> binaryData) {
		List<String> aclList = new ArrayList<>();
		for (int i = 0; i < binaryData.size(); i++) {
			String str = binaryData.get(i);
			String charAtZero = str.substring(0, 1);
			String base64EncodedData = str.substring(2);
			byte[] aclBytes = Base64.decodeBase64(base64EncodedData);
			StringBuilder byteString = new StringBuilder();
			for (byte eachByte : aclBytes) {
				if (eachByte >= 0) {
					String temp = Integer.toBinaryString(eachByte);
					byteString.append(generateBitData(temp));
				} else {
					byteString.append(generateBitData(Integer.toBinaryString((int) Byte.toUnsignedLong(eachByte))));
				}
			}
			String[] charArray = byteString.toString().split("");
			for (int j = 0; j < charArray.length; j++) {
				if (charArray[j].equals("1")) {
					aclList.add(charAtZero + String.valueOf(j));
				}
			}
		}
		return aclList;
	}

	private static String generateBitData(String byteString) {
		StringBuilder result = new StringBuilder();
		result.append(byteString);
		while (result.length() < 8) {
			result.insert(0, '0');
		}
		return result.toString();
	}

	private AuthUser createAuthUser(Map<String, Claim> claims, List<GrantedAuthority> authorities, boolean isApiKey) {

		// not to set mobile no for API user
		String mob = (isApiKey) ? null : getClaimByKeyWNullCheck(claims, "mob");
		String email = (isApiKey) ? null : getClaimByKeyWNullCheck(claims, "email");

		AuthUser authUser;
		authUser = new AuthUser(getClaimByKeyWNullCheck(claims, "upn"), "N/A", authorities,
				getClaimByKeyWNullCheck(claims, "loc"), getClaimByKeyWNullCheck(claims, "type"),
				getClaimByKeyWNullCheck(claims, "org"), mob);
		authUser.setEmployeeCode(getClaimByKeyWNullCheck(claims, "emp"));
		authUser.setEmployeeName(getClaimByKeyWNullCheck(claims, "empName"));
		authUser.setEmailId(email);
		authUser.setHostName(getClaimByKeyWNullCheck(claims, "host"));
		authUser.setBrandCode(getClaimByKeyWNullCheck(claims, "brand"));
		authUser.setForcePasswordChange(getBooleanClaimByKeyWNullCheck(claims, "fpc"));
		authUser.setApiKey(isApiKey);
		authUser.setForcePasswordChange(Boolean.valueOf(getClaimByKeyWNullCheck(claims, "fpc")));
		authUser.setIsOffline(getBooleanClaimByKeyWNullCheck(claims, "offline"));
		String appNameStr = getClaimByKeyWNullCheck(claims, "app");
		AppTypeEnum appName = null;
		if (appNameStr != null)
			appName = AppTypeEnum.valueOf(appNameStr);
		authUser.setAppName(appName);
		if (isApiKey)
			authUser.setToken(getClaimByKeyWNullCheck(claims, "token"));
		return authUser;
	}

	private String getClaimByKeyWNullCheck(Map<String, Claim> claims, String key) {
		Claim clm = claims.get(key);
		String val = null;
		if (clm != null)
			val = clm.asString();
		return val;
	}

	private Boolean getBooleanClaimByKeyWNullCheck(Map<String, Claim> claims, String key) {
		Claim clm = claims.get(key);
		Boolean val = null;
		if (clm != null)
			val = clm.asBoolean();
		return val;
	}

}
