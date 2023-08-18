///*  
// * Copyright 2019. Titan Company Limited
// * All rights reserved.
// */
//package com.titan.poss.sales.utils;
//
//import java.io.FileOutputStream;
//import java.io.IOException;
//
//import com.itextpdf.text.DocumentException;
//import com.itextpdf.text.pdf.PdfReader;
//import com.itextpdf.text.pdf.PdfStamper;
//import com.itextpdf.text.pdf.PdfWriter;
//
///**
// * 
// * @author Mindtree Ltd.
// * @version 1.0
// */
//public class PDFEncryption {
//
//	private PDFEncryption() {
//
//	}
//
//	private static final String USER_PSW = "password";
//	private static final String OWNER_PSW = "secured";
//
//	public static void encryptPdf(String src, String dest) throws IOException, DocumentException {
//
//		PdfReader reader = new PdfReader(src);
//		PdfStamper stamper = new PdfStamper(reader, new FileOutputStream(dest));
//		stamper.setEncryption(USER_PSW.getBytes(), OWNER_PSW.getBytes(), PdfWriter.ALLOW_PRINTING,
//				PdfWriter.ENCRYPTION_AES_128 | PdfWriter.DO_NOT_ENCRYPT_METADATA);
//		stamper.close();
//		reader.close();
//	}
//
//}
