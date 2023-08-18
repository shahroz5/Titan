/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.dao.FileSequenceDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("IntegrationFileSequenceRepository")
public interface FileSequenceRepository extends JpaRepository<FileSequenceDao, String> {

	FileSequenceDao findByFileMasterAndFiscalYear(FileMasterDao fileMaster, Integer fiscalYear);
	
	FileSequenceDao findByFileMaster(FileMasterDao fileMaster);

}
