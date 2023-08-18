/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.EnumMap;
import java.util.Map;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.titan.poss.core.exception.ServiceException;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
public class QRCodeGenerator {

	private static final String QR_CODE_FAILED = "QR Code generation failed: ";
	private static final String ISSUE_IN_CREATION = "Issue in QR Code creation";
	private static final String ERR_CORE_053 = "ERR-CORE-053";

	private QRCodeGenerator() {
		throw new IllegalArgumentException("QRCodeGenerator class");
	}

	public static String getQrCodeBase64(String text) {
		return getQrCodeBase64(text, 1000, 1000);
	}

	public static String getQrCodeBase64(String text, int width, int height) {

		QRCodeWriter qrCodeWriter = new QRCodeWriter();
		try {
			byte[] pngData = getQRCodeImage(text, width, height, qrCodeWriter);
			byte[] encoded = Base64.getEncoder().encode(pngData);
			return new String(encoded);
		} catch (Exception e) {
			log.error(QR_CODE_FAILED, e);
			throw new ServiceException(ISSUE_IN_CREATION, ERR_CORE_053, e);
		}
	}

	public static byte[] getQRCodeImage(String text, int width, int height, QRCodeWriter qrCodeWriter) {

		if (qrCodeWriter == null)
			qrCodeWriter = new QRCodeWriter();

		BitMatrix bitMatrix;
		Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
		hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
		hints.put(EncodeHintType.MARGIN, 0); /* default = 4 */

		try {
			bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);
		} catch (WriterException e) {
			log.error(QR_CODE_FAILED, e);
			throw new ServiceException(ISSUE_IN_CREATION, ERR_CORE_053, e);
		}
		ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
		try {
			MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
		} catch (IOException e) {
			log.error(QR_CODE_FAILED, e);
			throw new ServiceException(ISSUE_IN_CREATION, ERR_CORE_053, e);
		}
		return pngOutputStream.toByteArray();
	}
}
