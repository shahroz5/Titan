/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FileAuditDto {

	private String fileId;

	private String fileMasterName;
	
	private String filePath;
	
	private String fileServer;

	private String fileName;

	private Integer sequenceNo;
	
	private Date processedDate;

	private Integer successCount;

	private Integer failureCount;

	private Integer totalCount;
	
	private String status;
	
	private Date startTime;
	
	private Date endTime;

	private String errorLogFilePath;
	
	private String fileGroup;
	
	private Boolean manualJob;
	
	private String createdBy;
	
	private Long totalTime;

	private Integer warningCount;

	private String remarks;
}
