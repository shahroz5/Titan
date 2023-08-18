/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.dao.FileSequenceDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface FileSequenceService {

	FileSequenceDao saveNewFileSequence(FileMasterDao fileMaster, Integer fiscalYear, Integer sequenceNo);

	void updateFileSequenceByOne(FileMasterDao fileMaster, Integer sequenceNo);
	
	void updateFileSequenceByGroupAndName(String fileGroup, String fileName, Integer sequenceNo);

}
