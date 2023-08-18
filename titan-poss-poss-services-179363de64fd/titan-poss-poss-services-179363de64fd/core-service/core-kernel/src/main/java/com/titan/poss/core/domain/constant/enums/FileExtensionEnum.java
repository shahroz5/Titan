/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant.enums;

import java.util.List;

/**
 * Customer type enum.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum FileExtensionEnum {

	TXT("txt"), CSV("csv"), EXCEL("xlsx"), PDF("pdf"), JPEG("jpeg"), JPG("jpg"), JFIF("jfif"),DOC("docx");

	// BMP, DIB, RLE, JPE, GIF, TIF, TIFF, PDF was there in UploadFileExtensionEnum
	private String value;

	public String getValue() {
		return this.value;

	}

	private FileExtensionEnum(String value) {
		this.value = value;
	}

	public static List<String> allowedExtensionsForSalesFileUpload() {
		return List.of(JPEG.getValue(), JPG.getValue(), JFIF.getValue(), PDF.getValue());
	}

	public static List<String> allowedExtensionsForCustomerDocumentUpload() {
		return List.of(JPEG.getValue(), JPG.getValue(), JFIF.getValue(), PDF.getValue());
	}
	
	public static List<String> allowedExtensionsForDiscountWorkflowDocumentUpload() {
		return List.of(PDF.getValue(),DOC.getValue());
	}

}
