/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.factory;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.sales.service.DocumentGenerator;

/**
 * Factory for different Document Generation implementations.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class DocumentFactory {

	private Map<String, DocumentGenerator> documentServiceBeans;

	public static final String TYPE_NOT_REGISTERD = "Type is not registered.";

	public DocumentFactory() {
		documentServiceBeans = new HashMap<>();
	}

	public void registerDocumentService(String documentType, String fileType, DocumentGenerator documentService) {
		documentServiceBeans.put(getTypeByDocTypeAndFileType(documentType, fileType), documentService);
	}

	private String getTypeByDocTypeAndFileType(String documentType, String fileType) {
		return documentType + '_' + fileType;
	}

	/**
	 * This method returns respective service for implementation based on
	 * DocumentType. NOTE :- register respective document generation services in
	 * constructors of respective impl classes.
	 * 
	 * @param documentType
	 * @return DocumentGenerationService
	 */
	public DocumentGenerator getDocumentService(String documentType, String fileType) {

		String type = getTypeByDocTypeAndFileType(documentType, fileType);

		if (documentServiceBeans.containsKey(type) && documentServiceBeans.get(type) != null)
			return documentServiceBeans.get(type);

		throw new ServiceException(TYPE_NOT_REGISTERD, "ERR-CORE-047", "Type: " + type);

	}

}
