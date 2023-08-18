/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.file.dao.FileMasterDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface FileMasterRepository extends JpaRepository<FileMasterDao, String> {

	FileMasterDao findByFileGroupAndFileName(String fileGroup, String fileName);

	List<FileMasterDao> findByFileGroup(String fileGroup);

	List<FileMasterDao> findByFileNameIn(List<String> jobNames);
}
