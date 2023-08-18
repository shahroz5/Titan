package com.titan.poss.auth.util;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.auth.domain.AuthenticationToken;
import com.titan.poss.core.auth.util.JwtUtill;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;

@Service
public class AuthTokenUtil {

	@Autowired
	JwtUtill jwtUtill;

	private static final Logger SFLOGGER = LoggerFactory.getLogger(AuthTokenUtil.class);

	public Authentication verifyTokenAndCookies(HttpServletRequest request, HttpServletResponse response,
			String audience, Optional<String> authToken) {

		Cookie[] cookies = request.getCookies();
		boolean strictCheck = getStrictCheck();
		audience = removePortIfExist(audience);
		Authentication auth = this.verifyToken(authToken, audience);
		AuthUser authUser = (AuthUser) auth.getPrincipal();

		// As API user needs to call any API without cookie sets
		if (strictCheck && !authUser.isApiKey()) {
			this.cookieCheck(cookies, response, authToken);
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
		authUser.setEmailId(email);
		authUser.setHostName(getClaimByKeyWNullCheck(claims, "host"));
		authUser.setBrandCode(getClaimByKeyWNullCheck(claims, "brand"));
		authUser.setForcePasswordChange(getBooleanClaimByKeyWNullCheck(claims, "fpc"));
		authUser.setApiKey(isApiKey);
		authUser.setForcePasswordChange(Boolean.valueOf(getClaimByKeyWNullCheck(claims, "fpc")));
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
