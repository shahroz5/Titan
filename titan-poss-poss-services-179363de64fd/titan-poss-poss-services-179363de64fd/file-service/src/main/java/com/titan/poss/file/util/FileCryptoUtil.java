/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
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

	private static final String KEY_ALGORITHM = "AES";
	
	public static void encryptFile(String password, File inputFile, File outputFile) throws IOException {
		encryptOrDecryptFile(Cipher.ENCRYPT_MODE, password, inputFile, outputFile);
	}

	public static void decryptFile(String password, File inputFile, File outputFile) throws IOException {
		encryptOrDecryptFile(Cipher.DECRYPT_MODE, password, inputFile, outputFile);
	}

	private static void encryptOrDecryptFile(int mode, String password, File inputFile, File outputFile)
			throws IOException {
		try {
			IvParameterSpec iv = new IvParameterSpec(password.getBytes(StandardCharsets.UTF_8));
			SecretKeySpec skeySpec = new SecretKeySpec(password.getBytes(StandardCharsets.UTF_8), KEY_ALGORITHM);

			// AES initialization
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
	        cipher.init(mode, skeySpec, iv);
	        
			readAndWriteFile(cipher, inputFile, outputFile);

		} catch (NoSuchAlgorithmException | InvalidKeyException | NoSuchPaddingException
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
