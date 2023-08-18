/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.List;

import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.jsoup.Jsoup;
import org.jsoup.helper.W3CDom;
import org.jsoup.nodes.Document;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.FileUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
public class CMPrintUtil {

	private CMPrintUtil() {
		throw new IllegalStateException("CMPrintUtil class");
	}

	public static ResponseEntity<Resource> printPdfAndSave(String html, String basePath, String docPath, int noOfcopies) {

		docPath = basePath + docPath;

		int folderPathEndIndex = docPath.lastIndexOf('/');
		String fileName = docPath.substring(folderPathEndIndex + 1, docPath.length());
		Resource resource = exportToPdfOpenHtmlToPdf(html, docPath, noOfcopies);
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
				.contentType(MediaType.APPLICATION_PDF).body(resource);
	}

	private static org.w3c.dom.Document getDocumentFromHtml(String html) {
		Document document = Jsoup.parse(html);
		return new W3CDom().fromJsoup(document);
	}

	public static Resource exportToPdfOpenHtmlToPdf(String html, String docPath, int noOfcopies) {
		log.trace("HTML file content:\n{}", html);
		int folderPathEndIndex = docPath.lastIndexOf('/');
		// get the folder path
		String folderPath = docPath.substring(0, folderPathEndIndex);

		File directory = new File(folderPath);

		// create folder if not exist
		createDirectoryIfNotExist(directory);
		Resource res = null;
		PDFMergerUtility obj = new PDFMergerUtility();
		 String mergedFile = folderPath +"/Merged.pdf";
		 obj.setDestinationFileName(mergedFile);
		int iterationCount = 0;
		try {
			do {
				if(iterationCount == 1) {
		        	html = html.replace("CUSTOMER COPY", "OFFICE COPY");
		        	docPath = folderPath + "/CM-Copy.pdf";
				}
				if(iterationCount <= 1) {	
					try (OutputStream os = new FileOutputStream(docPath)) {
						PdfRendererBuilder builder = new PdfRendererBuilder();
						builder.useFastMode();
						builder.toStream(os);
						builder.withW3cDocument(getDocumentFromHtml(html), "");
						builder.run();		
					}catch (Exception e) {
						throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
					}
				}					
				obj.addSource(new File(docPath));
	    		iterationCount++;	
		     }while(iterationCount < noOfcopies);
			obj.mergeDocuments();
			res = FileUtil.getResourceByFilePath(mergedFile);
		}catch (Exception e) {
			throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
		}
		return res;		
		}


	private static void createDirectoryIfNotExist(File directory) {
		if (!directory.exists()) {
			directory.mkdirs();
		}
	}
	
	public static File mergeFiles(List<File> files, String destinationPath, String outputFileName) {
		File resource = null;
		PDFMergerUtility pdfMerger = new PDFMergerUtility();
		pdfMerger.setDestinationFileName(destinationPath+"/"+outputFileName+".pdf");
		for(File file : files) {
			try {
				pdfMerger.addSource(file);
				pdfMerger.mergeDocuments();
				resource = FileUtil.getResourceByFilePath(destinationPath+"/"+outputFileName+".pdf").getFile();
			} catch (Exception e) {
				throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
			}
		}
		return resource;
	}


}
