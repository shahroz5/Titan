/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.util;

import java.io.IOException;
import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public final class DocumentBuilderUtil {

	private DocumentBuilderUtil() {
		throw new IllegalStateException("DocumentBuilderUtil");
	}

	/**
	 * Builds the document from xml.
	 *
	 * @param xmlResponse the xml response
	 * @return the document
	 * @throws SAXException                 the SAX exception
	 * @throws IOException                  Signals that an I/O exception has
	 *                                      occurred.
	 * @throws ParserConfigurationException the parser configuration exception
	 */
	public static Document buildDocumentFromXml(String xmlResponse)
			throws SAXException, IOException, ParserConfigurationException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

		factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
		factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
		factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
		// Disable external DTDs as well

		factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
		factory.setXIncludeAware(false);
		factory.setExpandEntityReferences(false);
		DocumentBuilder db = factory.newDocumentBuilder();
		InputSource inputSource = new InputSource(new StringReader(xmlResponse));
		return db.parse(inputSource);
	}
}
