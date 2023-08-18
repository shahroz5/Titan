/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.dto.FileAuditDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface FileAuditService {

	FileAuditDto saveFileAuditData(FileAuditDto fileAuditDto);

	void updateFileAuditData(FileAuditDto fileAuditDto);

	void updateFileAudit(String fileId, String status, String fileGroup, String remarks, String fileServer,
			boolean countRequired, Integer sequenceNo, String emailId);

	FileAuditDto getInitialFileAuditDto(String fileName, String fileMasterName, String fileGroup, String manualJob,
			Integer totalCount, String createdBy, String filePath);

	FileAuditDto saveInitialFileAudit(String fileGroup, String fileName, String manualJob, Integer totalCount,
			String createdBy, String filePath);

	PagedRestResponse<List<FileAuditDto>> getFileAuditDtos(Pageable pageable);

	void updateFileAuditToFailedStatus(String fileName, String manualJob, String createdBy, String remarks,
			String localFolder, String localFailureFlder, String fileJobName, String fileGroup);

	boolean checkIfAlreadyProcessed(String fileName, String fileJobName, Object manualJob, String localPath,
			String localFailurePath, String fileGroup);
	
	SchedulerResponseDto deleteOldFileAuditData();

}
