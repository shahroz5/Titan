/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.auth.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URL;
import java.net.URLEncoder;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator.Builder;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.titan.poss.core.auth.domain.JwtTokenProps;
import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.utils.CalendarUtils;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class JwtUtill {
	private static final String API_KEY = "apiKey";

	@Value("${strictCheck:true}")
	private Boolean strictCheck;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	// 1 hour default for normal user
	@Value("${poss.auth.token-validity:60}")
	private long accessTokenForUser;

	// 30 days default for API user
	@Value("${poss.auth.api.token-validity:43200}")
	private long accessTokenForApiUser;

	// 5min, 10 second default configuring
//	@Value("${poss.auth.nbf-buffer:10000}")
//	private long nbfBufferMs;

	private static String issuer = null;
	private static final String UTF_8 = "UTF-8";
	private static final Logger LOGGER = LoggerFactory.getLogger(JwtUtill.class);
	static {
		try {
			issuer = (new URL("https://poss.tanishq.co.in/")).getHost();
		} catch (IOException e) {
			LOGGER.error("", e);
		}
	}

	public long getTokenValidtyForNormalUser() {
		return accessTokenForUser;
	}

	/**
	 * Generate Random OAuthToken
	 * 
	 * @return String - Random OAuthToken
	 * @throws IOException
	 */
	public OAuthToken generate(JwtTokenProps jwtTokenProps, boolean isApiUser) throws IOException {
		int milliSecondPerMinute = 60 * 1000;
		long accessTokenTime = (isApiUser) ? accessTokenForApiUser : accessTokenForUser;
		Instant instant = Instant.now();
		Date issuedAt = new Date(instant.toEpochMilli());
//		Date nbf = new Date(issuedAt.getTime());
//		nbf.setTime(nbf.getTime() - nbfBufferMs);
		if (jwtTokenProps.getExpiresAt() == null) {
			jwtTokenProps.setExpiresAt(new Date(instant.toEpochMilli() + accessTokenTime * milliSecondPerMinute));
		}
		List<String> userRoles = jwtTokenProps.getScp();
		List<String> encodedRoles = generateEcodedAclFormat(userRoles);
		OAuthToken token = new OAuthToken();
		Builder tokenBuilder = JWT.create().withIssuer(issuer).withIssuedAt(issuedAt)
				.withAudience(jwtTokenProps.getAudience())// .withNotBefore(nbf)
				.withExpiresAt(jwtTokenProps.getExpiresAt()).withClaim("upn", jwtTokenProps.getUpn())
				.withArrayClaim("acl", encodedRoles.toArray(new String[encodedRoles.size()]))
				.withClaim(API_KEY, jwtTokenProps.isApiKey()).withClaim("loc", jwtTokenProps.getLoc())
				.withClaim("type", jwtTokenProps.getType()).withClaim("org", jwtTokenProps.getOrgCode())
				.withClaim("emp", jwtTokenProps.getEmpCode()).withClaim("empName", jwtTokenProps.getEmpName())
				.withClaim("isSso", jwtTokenProps.getIsSso());

		// extra fields which are not required for API user
		if (!jwtTokenProps.isApiKey())
			tokenBuilder.withClaim("mob", jwtTokenProps.getMobileNo()).withClaim("email", jwtTokenProps.getEmailId())
					.withClaim("host", jwtTokenProps.getHostName()).withClaim("brand", jwtTokenProps.getBrandCode())
					.withClaim("fpc", jwtTokenProps.isForcePasswordChange())
					.withClaim("offline", jwtTokenProps.getIsOffline()).withClaim("app", jwtTokenProps.getAppName());

		String accessToken = tokenBuilder.sign(Algorithm.HMAC256(jwtSecret));

		token.setAccessToken(accessToken);
		token.setTokenType("Bearer");
		token.setExpiresAt(CalendarUtils.formatDetfaultToStr(jwtTokenProps.getExpiresAt()));
		token.setExpiresIn(String.valueOf((jwtTokenProps.getExpiresAt().getTime() - issuedAt.getTime()) / 1000));
		return token;
	}

	public OAuthToken generate(JwtTokenProps jwtTokenProps) throws IOException {
		return generate(jwtTokenProps, false);
	}

	private static List<String> generateEcodedAclFormat(List<String> userRoles) {

		Map<String, List<Integer>> data = new HashMap<>();
		for (int i = 0; i < userRoles.size(); i++) {
			String module = userRoles.get(i).substring(0, 1);
			if (data.get(module) == null) {
				List<Integer> intList = new ArrayList<>();
				intList.add(Integer.parseInt(userRoles.get(i).substring(1)));
				data.put(module, intList);
			} else {
				List<Integer> intList = data.get(module);
				intList.add(Integer.parseInt(userRoles.get(i).substring(1)));
				data.put(module, intList);
			}
		}
		List<String> binaryData = new ArrayList<>();
		for (Map.Entry<String, List<Integer>> entry : data.entrySet()) {
			binaryData.add(entry.getKey() + "-" + getBinaryStringByList(entry.getValue()));
		}
		return binaryData;
	}

	private static String getBinaryStringByList(List<Integer> value) {
		Integer max = Collections.max(value);
		int totalBits = max + 1 + (8 - ((max + 1) % 8));
		List<Integer> list = new ArrayList<>(Collections.nCopies(totalBits, 0));
		for (int i = 0; i < value.size(); i++) {
			list.set(value.get(i), 1);
		}
		String str = StringUtils.join(list, "");
		byte[] bval = new BigInteger(str, 2).toByteArray();
		if (bval.length > totalBits / 8) {
			byte[] bvalNew = new byte[bval.length - 1];
			System.arraycopy(bval, 1, bvalNew, 0, bval.length - 1);
			bval = bvalNew;
		} else if (bval.length < totalBits / 8) {
			int length = totalBits / 8;
			byte[] bvalNew = new byte[length];
			for (int i = 0; i < length; i++) {
				if (i < length - bval.length) {
					bvalNew[i] = 0;
				} else {
					bvalNew[i] = bval[i - length + bval.length];
				}
			}
			bval = bvalNew;
		}
		return Base64.encodeBase64String(bval).replace("=", "");
	}

	/**
	 * Validate jwt token
	 * 
	 * @return String - Random OAuthToken
	 * @throws JWTVerificationException,UnsupportedEncodingException
	 */
	public JWT verify(String token, String audience) throws UnsupportedEncodingException {
		token = token.replace("%20", " ");
		int index = token.trim().indexOf("Bearer ");
		JWT jwt;
		if (index != 0) {
			throw new JWTVerificationException("Bearer as prefix is missing in token");
		} else {
			JWTVerifier verifier = JWT.require(Algorithm.HMAC256(jwtSecret)).acceptLeeway(100).withIssuer(issuer)
					.build(); // Reusable
			jwt = (JWT) verifier.verify(token.trim().substring(7).trim());
			if (!jwt.getClaim(API_KEY).asBoolean()) {
				this.audienceCheck(audience);
			}
		}
		return jwt;
	}

	public String getJwtValueByClaimAsString(String token, String claim) {
		String val;
		try {
			JWT jwt = getJwt(token);
			val = jwt.getClaim(claim).asString();
		} catch (Exception e) {
			val = null;
		}
		return val;

	}

	public JWT getJwt(String token) {
		token = token.replace("%20", " ");
		JWT jwt = null;
		try {
			JWTVerifier verifier = JWT.require(Algorithm.HMAC256(jwtSecret)).acceptLeeway(100).withIssuer(null).build();
			jwt = (JWT) verifier.verify(token.trim().trim());
		} catch (Exception e) {
		}
		return jwt;
	}

	private void audienceCheck(String audience) {
		if (audience == null) {
			throw new JWTVerificationException("Invalid audience");
		}
	}

	public String mapTokenToQueryParams(String url, OAuthToken token) throws UnsupportedEncodingException {
		return (url.indexOf('?') != -1 ? "&" : "?") + "accessToken=" + URLEncoder.encode(token.getAccessToken(), UTF_8)
				+ "&tokenType=" + URLEncoder.encode(token.getTokenType(), UTF_8) + "&expiresIn="
				+ URLEncoder.encode(token.getExpiresIn(), UTF_8) + "&expiresAt="
				+ URLEncoder.encode(token.getExpiresAt(), UTF_8) + "&refreshTokenId="
				+ URLEncoder.encode(token.getRefreshTokenId(), UTF_8) + "&refreshTokenExpiresIn="
				+ URLEncoder.encode(token.getRefreshTokenIssuedAt(), UTF_8) + "&refreshTokenIssuedAt="
				+ URLEncoder.encode(token.getRefreshTokenExpiresIn(), UTF_8) + "&refreshTokenExpiresAt="
				+ URLEncoder.encode(token.getRefreshTokenExpiresAt(), UTF_8);
	}

	public String getCookieByName(Cookie[] cookies, String cookieName) {
		String val = null;
		if (cookies == null || cookies.length == 0)
			return val;
		for (int i = 0; i < cookies.length; i++) {
			Cookie cookie = cookies[i];
			if (cookieName.equals(cookie.getName())) {
				val = cookie.getValue();
				break;
			}
		}
		return val;
	}

}
