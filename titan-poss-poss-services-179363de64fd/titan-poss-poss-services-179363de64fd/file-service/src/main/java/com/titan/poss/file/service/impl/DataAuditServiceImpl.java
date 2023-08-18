/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CsvWriterUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dao.DataAuditDao;
import com.titan.poss.file.dao.FileAuditDao;
import com.titan.poss.file.repository.DataAuditRepository;
import com.titan.poss.file.repository.FileAuditRepository;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class DataAuditServiceImpl implements DataAuditService {

	@Autowired
	private FileAuditRepository fileAuditRepository;

	@Autowired
	private DataAuditRepository dataAuditRepository;

	@Autowired
	private FileService fileService;

	@Autowired
	private Environment env;

	private static final String ERROR_LOG_FILE_FOLDER = "errorLog.file.folder";

	private static final String FILE_AUDIT_NOT_PRESENT = "File Audit not present";

	private static final String ERR_FILE_007 = "ERR-FILE-007";

	@Override
	@Transactional
	public void handleDataAudit(List<DataAuditDto> errorAuditList, String fileAuditId, String fileGroup) {
		if (!errorAuditList.isEmpty()) {
			List<DataAuditDao> dataAuditDaoList = errorAuditList.stream()
					.map(dataAudit -> (DataAuditDao) MapperUtil.getObjectMapping(dataAudit, new DataAuditDao()))
					.collect(Collectors.toList());
			Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(fileAuditId);
			dataAuditDaoList.stream().forEach(dataAudit -> {
				if (fileAudit.isPresent()) {
					dataAudit.setFileAudit(fileAudit.get());
				}
			});
			dataAuditRepository.saveAll(dataAuditDaoList);

			String fileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
			String filePath = env.getProperty(ERROR_LOG_FILE_FOLDER) + fileGroup
					+ FileIntegrationConstants.PATH_DELIMITTER + fileAuditId + "." + FileExtensionEnum.CSV.getValue();
			String errorLogFileName = fileBasePath + filePath;
			saveErrorLogFile(errorAuditList, errorLogFileName);
			updateFileAudit(fileAuditId, filePath);

		}
	}

	/**
	 * @param fileId
	 */
	private void updateFileAudit(String fileId, String filePath) {
		Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(fileId);
		if (fileAudit.isPresent()) {
			fileAudit.get().setErrorLogFilePath(filePath);
			fileAuditRepository.save(fileAudit.get());
		} else {
			throw new ServiceException(FILE_AUDIT_NOT_PRESENT, ERR_FILE_007);
		}
	}

	private void saveErrorLogFile(List<DataAuditDto> dataAuditList, String fileName) {
		CsvWriterUtil.writeErrorLogToCsv(dataAuditList, fileName);
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public DataAuditDto saveDataAudit(DataAuditDto dataAudit) {
		Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(dataAudit.getFileId());
		if (!fileAudit.isPresent()) {
			throw new ServiceException(FILE_AUDIT_NOT_PRESENT, ERR_FILE_007);
		}
		DataAuditDao dataAuditDao = (DataAuditDao) MapperUtil.getObjectMapping(dataAudit, new DataAuditDao());
		dataAuditDao.setFileAudit(fileAudit.get());
		return (DataAuditDto) MapperUtil.getObjectMapping(dataAuditRepository.save(dataAuditDao), new DataAuditDto());
	}

	@Override
	public void createErrorLog(String fileAuditId, String fileGroup) {
		List<DataAuditDao> dataAuditList = dataAuditRepository.findByFileAuditFileId(fileAuditId);
		List<DataAuditDto> dataAuditDtoList = dataAuditList.stream()
				.map(dataAudit -> (DataAuditDto) MapperUtil.getObjectMapping(dataAudit, new DataAuditDto()))
				.collect(Collectors.toList());
		String fileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String directoryName = fileBasePath + env.getProperty(ERROR_LOG_FILE_FOLDER) + fileGroup;
		fileService.makeDirectoryIfNotExists(directoryName);
		String filePath = env.getProperty(ERROR_LOG_FILE_FOLDER) + fileGroup + FileIntegrationConstants.PATH_DELIMITTER
				+ fileAuditId + "." + FileExtensionEnum.CSV.getValue();
		String errorLogFileName = fileBasePath + filePath;
		saveErrorLogFile(dataAuditDtoList, errorLogFileName);
		updateFileAudit(fileAuditId, filePath);

	}

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void saveDataAuditData(String primaryData, String data, String errorMessage, String fileAuditId,
			String errorType) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(primaryData);
		dataAudit.setData(data);
		dataAudit.setErrorMessage(errorMessage);
		dataAudit.setFileId(fileAuditId);
		dataAudit.setErrorType(errorType);
		Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(dataAudit.getFileId());
		if (!fileAudit.isPresent()) {
			throw new ServiceException(FILE_AUDIT_NOT_PRESENT, ERR_FILE_007);
		}
		DataAuditDao dataAuditDao = (DataAuditDao) MapperUtil.getObjectMapping(dataAudit, new DataAuditDao());
		dataAuditDao.setFileAudit(fileAudit.get());
		dataAuditRepository.save(dataAuditDao);
	}

	@Override
	public void clearDataAudit(Date endTime) {
		dataAuditRepository.clearDataAudit(endTime);
	}

}
