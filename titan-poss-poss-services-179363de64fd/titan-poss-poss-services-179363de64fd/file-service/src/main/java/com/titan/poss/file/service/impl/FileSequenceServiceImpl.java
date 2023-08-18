/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.dao.FileSequenceDao;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.repository.FileSequenceRepository;
import com.titan.poss.file.service.FileSequenceService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.location.dao.CountryDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class FileSequenceServiceImpl implements FileSequenceService {

	@Autowired
	private FileSequenceRepository fileSequenceRepository;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	@Autowired
	private FileService fileService;

	@Value("${default.sequence.no:5000}")
	private Integer defualtSequenceNo;

	private static final String FILE_MASTER_ERR_MSG = "File Master not found";

	@Override
	@Transactional
	public FileSequenceDao saveNewFileSequence(FileMasterDao fileMaster, Integer fiscalYear, Integer sequenceNo) {
		if (fileMaster == null) {
			throw new ServiceException(FILE_MASTER_ERR_MSG, "ERR-FILE-001", FILE_MASTER_ERR_MSG);
		}
		FileSequenceDao fileSequenceDao = new FileSequenceDao();
		fileSequenceDao.setFileMaster(fileMaster);
		if (fileMaster.getResetSequenceNo()) {
			fileSequenceDao.setFiscalYear(fiscalYear);
		}
		if (sequenceNo == null) {
			fileSequenceDao.setSequenceNo(defualtSequenceNo);
		} else {
			fileSequenceDao.setSequenceNo(sequenceNo);
		}
		return fileSequenceRepository.save(fileSequenceDao);
	}

	@Override
	@Transactional
	public void updateFileSequenceByOne(FileMasterDao fileMaster, Integer sequenceNo) {
		if (fileMaster == null) {
			throw new ServiceException(FILE_MASTER_ERR_MSG, "ERR-FILE-001", FILE_MASTER_ERR_MSG);
		}
		CountryDao countryData = fileService.getCountryData();
		FileSequenceDao fileSequence = null;
		if (fileMaster.getResetSequenceNo()) {
			fileSequence = fileSequenceRepository.findByFileMasterAndFiscalYear(fileMaster,
					countryData.getFiscalYear());
		} else {
			fileSequence = fileSequenceRepository.findByFileMaster(fileMaster);
		}
		if (fileSequence != null) {
			if (sequenceNo == null) {
				fileSequence.setSequenceNo(fileSequence.getSequenceNo() + 1);
			} else {
				fileSequence.setSequenceNo(sequenceNo);
			}
			fileSequenceRepository.save(fileSequence);
		} else {
			saveNewFileSequence(fileMaster, countryData.getFiscalYear(), sequenceNo);
		}
	}

	@Transactional
	@Override
	public void updateFileSequenceByGroupAndName(String fileGroup, String fileName, Integer sequenceNo) {
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(fileGroup, fileName);
		updateFileSequenceByOne(fileMaster, sequenceNo);
	}
}
