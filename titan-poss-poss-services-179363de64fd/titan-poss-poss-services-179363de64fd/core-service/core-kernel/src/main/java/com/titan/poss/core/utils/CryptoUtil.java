/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.utils;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.titan.poss.core.exception.ServiceException;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class CryptoUtil {
	private static String secretKeyStr = ApplicationPropertiesUtil.getProperty("poss.crypto.encrpKey");

	private static final Logger LOGGER = LoggerFactory.getLogger(CryptoUtil.class);

	private CryptoUtil() {
		throw new IllegalArgumentException("CryptoUtil class");
	}

	private static final String PUBLIC_KEY_PATH = "public.key";
	private static final String PVT_KEY_PATH = "private.key";
	private static final String KEY_PATH = "/";

	private static final String SYMMETRIC_ENC_AES = "AES";
	private static final String ASYMMETRIC_ENC_RSA = "RSA";

	/**
	 * Encrypts plain text using AES symmetric encryption algorithm
	 *
	 * @param plainText
	 * @return
	 */
	public static String encrypt(String plainText, String fieldName, boolean shouldThrowErr) {

		if (plainText == null)
			return plainText;

		String cipherText = plainText;
		try {
			SecretKeySpec secretKeyForEncrypt = new SecretKeySpec(secretKeyStr.getBytes(), SYMMETRIC_ENC_AES);
			Cipher cipherForEncrypt = Cipher.getInstance(SYMMETRIC_ENC_AES);
			cipherForEncrypt.init(Cipher.ENCRYPT_MODE, secretKeyForEncrypt);
			byte[] byteCipherText = cipherForEncrypt.doFinal(plainText.getBytes());
			cipherText = Base64.getEncoder().encodeToString(byteCipherText);
		} catch (Exception exception) {
			LOGGER.error("Symmetric encryption error  for field: {}, input: {}", fieldName, plainText);
			if (shouldThrowErr)
				throw new ServiceException("Error in encryption.", "ERR-CORE-006");
		}
		return cipherText;
	}

	public static String encrypt(String plainText, String fieldName) {

		return encrypt(plainText, fieldName, true);
	}

	/**
	 * Decrypts cipher text using AES symmetric encryption algorithm
	 *
	 * @param cipherText
	 * @return
	 */
	public static String decrypt(String cipherText, String fieldName, boolean shouldThrowErr) {

		if (cipherText == null)
			return cipherText;

		String plainText = cipherText;
		try {
			SecretKeySpec secretKeyForDecrypt = new SecretKeySpec(secretKeyStr.getBytes(), SYMMETRIC_ENC_AES);
			Cipher cipherForDecrypt = Cipher.getInstance(SYMMETRIC_ENC_AES);
			cipherForDecrypt.init(Cipher.DECRYPT_MODE, secretKeyForDecrypt);
			byte[] byteDecryptedText = cipherForDecrypt.doFinal(Base64.getDecoder().decode(cipherText));
			plainText = new String(byteDecryptedText);
		} catch (Exception e) {
			LOGGER.error("Symmetric decryption error for field: {}, input: {}\nDetails: {}", fieldName, cipherText,
					e.getStackTrace());
			if (shouldThrowErr)
				throw new ServiceException("Error while decrypting.", "ERR-CORE-054", e);
		}
		return plainText;
	}

	public static String decrypt(String cipherText, String fieldName) {

		return decrypt(cipherText, fieldName, true);
	}

	public static String asymmetricEncrypt(String plainText, String fieldName) {

		try {
			PublicKey publicKey = getPublicKey();
			Cipher cipher = Cipher.getInstance(ASYMMETRIC_ENC_RSA);
			cipher.init(Cipher.ENCRYPT_MODE, publicKey);
			return new String(Base64.getEncoder().encode(cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8))));
		} catch (Exception ex) {
			LOGGER.error("Asymmetric encryption error for field: {}, input: {}", fieldName, plainText);
			throw new ServiceException("Error in encryption.", "ERR-CORE-006", ex);
		}
	}

	public static String asymmetricDecrypt(String cipherText, String fieldName, boolean isFromAuth) {

		try {
			PrivateKey privateKey = getPrivateKey();
			Cipher cipher = Cipher.getInstance(ASYMMETRIC_ENC_RSA);
			cipher.init(Cipher.DECRYPT_MODE, privateKey);
			return new String(cipher.doFinal(Base64.getDecoder().decode(cipherText)));
		} catch (Exception ex) {
			LOGGER.error("Asymmetric decryption error for field: {}, input: {}", fieldName, cipherText);
			if (isFromAuth) {
				throw new ServiceException("Error in decryption.", "ERR-CORE-007", ex);
			}
			throw new ServiceException("Error while decrypting.", "ERR-CORE-054");
		}
	}

	private static PrivateKey getPrivateKey() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {

		byte[] keyData = CryptoUtil.class.getResourceAsStream(KEY_PATH + PVT_KEY_PATH).readAllBytes();
		PKCS8EncodedKeySpec privateSpec = new PKCS8EncodedKeySpec(parseKeyData(keyData));
		KeyFactory kf = KeyFactory.getInstance(ASYMMETRIC_ENC_RSA);
		return kf.generatePrivate(privateSpec);
	}

	public static PrivateKey getPrivateBYFile(String filePath, String fileName)
			throws NoSuchAlgorithmException, InvalidKeySpecException {

		byte[] keyData = FileUtil.getFileContentInByteArrayFormat(filePath, fileName);
		PKCS8EncodedKeySpec privateSpec = new PKCS8EncodedKeySpec(parseKeyData(keyData));
		KeyFactory kf = KeyFactory.getInstance(ASYMMETRIC_ENC_RSA);
		return kf.generatePrivate(privateSpec);
	}

	private static PublicKey getPublicKey() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
		String publicKeyContent = new String(
				CryptoUtil.class.getResourceAsStream(KEY_PATH + PUBLIC_KEY_PATH).readAllBytes(),
				StandardCharsets.UTF_8);
		X509EncodedKeySpec spec = new X509EncodedKeySpec(Base64.getDecoder().decode(publicKeyContent));
		KeyFactory kf = KeyFactory.getInstance(ASYMMETRIC_ENC_RSA);
		return kf.generatePublic(spec);
	}

	/**
	 * Parses a base64 encoded private key by stripping the header and footer lines
	 * 
	 * @param keyData PEM file contents
	 * @return Raw key byes
	 * @throws IOException
	 */
	public static byte[] parseKeyData(byte[] keyData) {
		StringBuilder sb = new StringBuilder();
		String[] lines = new String(keyData).split("[\r?\n]+");
		String[] skips = new String[] { "-----BEGIN", "-----END", ": " };
		for (String line : lines) {
			boolean skipLine = false;
			for (String skip : skips) {
				if (line.contains(skip)) {
					skipLine = true;
				}
			}
			if (!skipLine) {
				sb.append(line.trim());
			}
		}
		return Base64.getDecoder().decode(sb.toString());
	}

	public static String getLoginKeyData() throws IOException {
		InputStream publicKeyInputStream = CryptoUtil.class.getResourceAsStream(KEY_PATH + PUBLIC_KEY_PATH);
		return new String(publicKeyInputStream.readAllBytes(), StandardCharsets.UTF_8).replaceAll("\n", "")
				.replaceAll("\r", "");
	}

	public static String getMd5(String input) {
		try {

			// Static getInstance method is called with hashing MD5
			MessageDigest md = MessageDigest.getInstance("MD5");

			// digest() method is called to calculate message digest
			// of an input digest() return array of byte
			byte[] messageDigest = md.digest(input.getBytes());

			// Convert byte array into signum representation
			BigInteger no = new BigInteger(1, messageDigest);

			// Convert message digest into hex value
			StringBuilder hashtextSb = new StringBuilder();
			hashtextSb.append(no.toString(16));
			while (hashtextSb.toString().length() < 32) {
				hashtextSb.append("0" + hashtextSb);
			}
			return hashtextSb.toString();
		}

		// For specifying wrong message digest algorithms
		catch (NoSuchAlgorithmException e) {
			throw new ServiceException("Error in MD 5 conversion.", "");
		}
	}
}
