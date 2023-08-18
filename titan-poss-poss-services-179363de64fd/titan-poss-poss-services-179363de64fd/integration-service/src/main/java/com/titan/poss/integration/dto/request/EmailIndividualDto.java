/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.request;

import java.io.File;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailIndividualDto {

	private String html;
	Map<String, byte[]> attachments;
	private String templateName;
	private Map<String, String> data;
	Map<String, File> fileAttachments;

	@Override
	public String toString() {
		return "EmailIndividualDto [attachments=" + attachments + ", templateName=" + templateName + ", data=" + data
				+ "]";
	}

}
