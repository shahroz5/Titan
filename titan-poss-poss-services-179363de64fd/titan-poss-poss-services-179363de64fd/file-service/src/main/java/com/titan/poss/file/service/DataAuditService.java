/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import java.util.Date;
import java.util.List;

import com.titan.poss.core.dto.DataAuditDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface DataAuditService {

	void handleDataAudit(List<DataAuditDto> dataAuditList, String fileId, String fileGroup);

	void createErrorLog(String fileAuditId, String fileGroup);

	DataAuditDto saveDataAudit(DataAuditDto dataAudit);

	void saveDataAuditData(String primaryData, String data, String errorMessage, String fileAuditId, String errorType);
	
	void clearDataAudit(Date endTime);
}
