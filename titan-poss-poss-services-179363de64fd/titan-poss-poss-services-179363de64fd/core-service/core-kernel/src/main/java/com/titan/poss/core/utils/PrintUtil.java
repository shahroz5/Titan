/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

import org.jsoup.Jsoup;
import org.jsoup.helper.W3CDom;
import org.jsoup.nodes.Document;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.titan.poss.core.exception.ServiceException;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
public class PrintUtil {

	private PrintUtil() {
		throw new IllegalStateException("PrintUtil class");
	}

	public static ResponseEntity<Resource> printPdfAndSave(String html, String basePath, String docPath) {

		docPath = basePath + docPath;

		int folderPathEndIndex = docPath.lastIndexOf('/');
		String fileName = docPath.substring(folderPathEndIndex + 1, docPath.length());

		Resource resource = exportToPdfOpenHtmlToPdf(html, docPath);
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
				.contentType(MediaType.APPLICATION_PDF).body(resource);
	}

	private static org.w3c.dom.Document getDocumentFromHtml(String html) {
		Document document = Jsoup.parse(html);
		return new W3CDom().fromJsoup(document);
	}

	public static Resource exportToPdfOpenHtmlToPdf(String html, String docPath) {

		log.trace("HTML file content:\n{}", html);

		int folderPathEndIndex = docPath.lastIndexOf('/');
		// get the folder path
		String folderPath = docPath.substring(0, folderPathEndIndex);

		File directory = new File(folderPath);

		// create folder if not exist
		createDirectoryIfNotExist(directory);
		Resource res = null;
		try (OutputStream os = new FileOutputStream(docPath)) {
			PdfRendererBuilder builder = new PdfRendererBuilder();
			builder.useFastMode();
			builder.toStream(os);
			builder.withW3cDocument(getDocumentFromHtml(html), "");
			builder.run();
			res = FileUtil.getResourceByFilePath(docPath);
		} catch (Exception e) {
			throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
		}
		return res;
	}

	private static void createDirectoryIfNotExist(File directory) {
		if (!directory.exists()) {
			directory.mkdirs();
		}
	}

}
