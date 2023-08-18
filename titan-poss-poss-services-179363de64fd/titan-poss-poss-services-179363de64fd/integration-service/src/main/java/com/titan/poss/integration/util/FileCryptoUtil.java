/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import com.titan.poss.core.exception.ServiceException;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
public class FileCryptoUtil {

	private FileCryptoUtil() {
		throw new IllegalArgumentException("FileCryptoUtil class");
	}

	private static final String SALT = "f1nd1ngn3m0";
	private static final int PWD_ITERATIONS = 65536;
	private static final int KEY_SIZE = 256;
	private static byte[] ivBytes = { -56, 121, 48, -20, -110, 72, 63, -110, -3, 39, 111, -20, 101, 42, 69, -98 };
	private static final String KEY_ALGORITHM = "AES";
	private static final String ALGORITHM = "AES/GCM/NoPadding";
	private static final String SECRET_KEY_FACTORY_ALGORIHTM = "PBKDF2WithHmacSHA1";
	public static final int GCM_TAG_LENGTH = 16;

	public static void encryptFile(String password, File inputFile, File outputFile) throws IOException {
		encryptOrDecryptFile(Cipher.ENCRYPT_MODE, password, inputFile, outputFile);
	}

	public static void decryptFile(String password, File inputFile, File outputFile) throws IOException {
		encryptOrDecryptFile(Cipher.DECRYPT_MODE, password, inputFile, outputFile);
	}

	private static void encryptOrDecryptFile(int mode, String password, File inputFile, File outputFile)
			throws IOException {
		byte[] saltBytes = SALT.getBytes(StandardCharsets.UTF_8);
		SecretKeyFactory skf;
		try {
			skf = SecretKeyFactory.getInstance(SECRET_KEY_FACTORY_ALGORIHTM);
			PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), saltBytes, PWD_ITERATIONS, KEY_SIZE);
			SecretKey secretKey = skf.generateSecret(spec);
			SecretKeySpec key = new SecretKeySpec(secretKey.getEncoded(), KEY_ALGORITHM);

			GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, ivBytes);
			// AES initialization
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			cipher.init(mode, key, gcmParameterSpec);

			readAndWriteFile(cipher, inputFile, outputFile);

		} catch (NoSuchAlgorithmException | InvalidKeySpecException | InvalidKeyException | NoSuchPaddingException
				| InvalidAlgorithmParameterException e) {
			throw new ServiceException("Error occurred while encrypting/decrypting file", "ERR-CORE-030", e);
		}
	}

	private static void readAndWriteFile(Cipher cipher, File inputFile, File outputFile) throws IOException {
		try (FileInputStream inputStream = new FileInputStream(inputFile);
				FileOutputStream outputStream = new FileOutputStream(outputFile)) {
			byte[] inputBytes = new byte[(int) inputFile.length()];
			int bytesRead = inputStream.read(inputBytes);
			log.debug("No of bytes read: {}", bytesRead);

			byte[] outputBytes = cipher.doFinal(inputBytes);
			outputStream.write(outputBytes);
		} catch (IllegalBlockSizeException | BadPaddingException | IOException e) {
			throw new ServiceException("Error occurred while encrypting/decrypting file", "ERR-CORE-030", e);
		}
	}
}
