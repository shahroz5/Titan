/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.dto.FileAuditDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dao.FileAuditDao;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.repository.FileAuditRepository;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.FileSequenceService;
import com.titan.poss.file.service.IntegrationService;
import com.titan.poss.file.util.FileServiceUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class FileAuditServiceImpl implements FileAuditService {

	@Autowired
	private FileAuditRepository fileAuditRepository;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	@Autowired
	private FileSequenceService fileSequenceService;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Value("${clear.file.audit.days:7}")
	private Integer clearFileAuditDays;

	@Autowired
	private IntegrationService integrationService;

	@Override
	@Transactional
	public SchedulerResponseDto deleteOldFileAuditData() {
		Calendar cal = Calendar.getInstance();
		cal.setTime(CalendarUtils.getCurrentDate());
		// Decrementing days by configured days
		cal.add(Calendar.DATE, -clearFileAuditDays);

		// first deleting data audit
		dataAuditService.clearDataAudit(cal.getTime());
		fileAuditRepository.clearFileAudit(cal.getTime());

		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.FILE_CLEAR_FILE_AUDIT.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;
	}

	@Override
	@Transactional
	public FileAuditDto saveFileAuditData(FileAuditDto fileAuditDto) {
		FileAuditDao savedFileDao = saveFileAudit(fileAuditDto);
		return (FileAuditDto) MapperUtil.getObjectMapping(savedFileDao, new FileAuditDto());
	}

	@Override
	@Transactional
	public void updateFileAuditData(FileAuditDto fileAuditDto) {
		Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(fileAuditDto.getFileId());
		if (fileAudit.isPresent()) {
			FileAuditDao updatedFileAuditDaoDao = (FileAuditDao) MapperUtil.getObjectMapping(fileAuditDto,
					fileAudit.get());
			if (fileAuditDto.getSuccessCount() != null) {
				updatedFileAuditDaoDao.setSuccessCount(fileAuditDto.getSuccessCount());
			}
			if (fileAuditDto.getTotalCount() != null) {
				updatedFileAuditDaoDao.setTotalCount(fileAuditDto.getTotalCount());
			}
			if (fileAuditDto.getFailureCount() != null) {
				updatedFileAuditDaoDao.setFailureCount(fileAuditDto.getFailureCount());
			}
			fileAuditRepository.save(updatedFileAuditDaoDao);
		} else {
			throw new ServiceException("File Audit not present", "ERR-FILE-007");
		}
	}

	@Override
	@Transactional
	public void updateFileAudit(String fileId, String status, String fileGroup, String remarks, String fileServer,
			boolean countRequired, Integer sequenceNo, String emailId) {
		Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(fileId);
		if (fileAudit.isPresent()) {
			fileAudit.get().setStatus(status);
			if (sequenceNo != null) {
				fileAudit.get().setSequenceNo(sequenceNo);
				if (status.equalsIgnoreCase(JobProcessStatusEnum.COMPLETED.toString())) {
					fileSequenceService.updateFileSequenceByOne(fileAudit.get().getFileMaster(), sequenceNo);
				}
			}
			if (countRequired) {
				getCount(fileId, fileAudit.get(), status, fileGroup);
			}
			fileAudit.get().setEndTime(CalendarUtils.getCurrentDate());
			long totalTime = (fileAudit.get().getEndTime().getTime() - fileAudit.get().getStartTime().getTime()) / 1000;
			fileAudit.get().setTotalTime(totalTime);
			fileAudit.get().setRemarks(remarks);
			fileAudit.get().setFileServer(fileServer);
			FileAuditDao savedFileAudit = fileAuditRepository.save(fileAudit.get());
			if (status.equalsIgnoreCase(JobProcessStatusEnum.FAILED.toString()) && countRequired) {
				sendEmailForFailedJobs(savedFileAudit, emailId);
			}
		}
	}

	private void getCount(String fileId, FileAuditDao fileAudit, String status, String fileGroup) {

		Integer failureCount = jdbcTemplate.queryForObject(
				"select count(data) from data_audit where file_id = ? and error_type = 'ERROR'",
				new Object[] { fileId }, Integer.class);
		Integer warningCount = jdbcTemplate.queryForObject(
				"select count(data) from data_audit where file_id = ? and error_type = 'WARNING'",
				new Object[] { fileId }, Integer.class);
		fileAudit.setWarningCount(warningCount);
		Integer successCount = (failureCount > 0 || status.equalsIgnoreCase("COMPLETED"))
				? fileAudit.getTotalCount() - failureCount
				: 0;
		fileAudit.setSuccessCount(successCount);
		fileAudit.setFailureCount(failureCount);
		if (fileAudit.getFailureCount() > 0) {
			dataAuditService.createErrorLog(fileId, fileGroup);
		}
	}

	@Override
	public FileAuditDto getInitialFileAuditDto(String fileName, String fileMasterName, String fileGroup,
			String manualJob, Integer totalCount, String createdBy, String filePath) {
		FileAuditDto fileAuditDto = new FileAuditDto();
		fileAuditDto.setFileMasterName(fileMasterName);
		fileAuditDto.setFileName(fileName);
		fileAuditDto.setProcessedDate(CalendarUtils.getCurrentDate());
		fileAuditDto.setStatus(JobProcessStatusEnum.INPROGRESS.toString());
		fileAuditDto.setStartTime(CalendarUtils.getCurrentDate());
		fileAuditDto.setFileGroup(fileGroup);
		boolean manualJobValue = !StringUtils.isEmpty(manualJob) && manualJob.equalsIgnoreCase("true");
		fileAuditDto.setManualJob(manualJobValue);
		fileAuditDto.setTotalCount(totalCount);
		fileAuditDto.setCreatedBy(createdBy);
		fileAuditDto.setFilePath(filePath);
		return fileAuditDto;
	}

	@Override
	@Transactional
	public FileAuditDto saveInitialFileAudit(String fileGroup, String fileName, String manualJob, Integer totalCount,
			String createdBy, String filePath) {
		FileAuditDto fileAudit = null;

		switch (fileGroup) {
		case "AIRPAY_CONFIG":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.AIRPAY_CONFIG.toString(), fileGroup,
					manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "RAZORPAY_CONFIG":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.RAZORPAY_CONFIG.toString(), fileGroup,
					manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "GV_STATUS_UPDATE":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.GIFT_VOUCHER_STATUS_UPDATE.toString(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;

		case "CARD_DETAILS":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.CARD_DETAILS.toString(), fileGroup,
					manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "PAYER_BANK":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.PAYER_BANK.toString(), fileGroup,
					manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "PAYMENT_HOSTNAME_MAPPING":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.PAYMENT_HOSTNAME_MAPPING.toString(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "GEP_CONFIG_EXCLUDE_MAPPING":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.GEP_CONFIG_EXCLUDE_MAPPING.toString(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "PRODUCT_PRICE_MAPPING":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.PRODUCT_PRICE_MAPPING.toString(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;

		case "TAX_CONFIG":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.TAX_CONFIG.toString(), fileGroup,
					manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "GV_VALIDITY_EXTEND":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.GIFT_VOUCHER_EXTEND_VALIDITY.toString(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "FIR":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.FIR_MER.toString(), fileGroup, manualJob,
					totalCount - 1, createdBy, filePath);
			break;
		case "MER":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.FIR_MER.toString(), fileGroup, manualJob,
					totalCount - 1, createdBy, filePath);
			break;
		case "QCGC_CONFIG":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.QCGC_CONFIG.toString(), fileGroup,
					manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "ITEM_GROUP_LEVEL_DISCOUNT":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.ITEM_GROUP_LEVEL_DISCOUNT.toString(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "BEST_DEAL_DISCOUNT":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.ITEM_GROUP_LEVEL_DISCOUNT.toString(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "DISCOUNT_EXCLUDE_ITEM_MAPPING":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.DISCOUNT_EXCLUDE_ITEM_MAPPING.toString(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "PRICE_LOGIC_TEST":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.PRICING_LOGIC_TEST_JOB.getValue(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;
		case "EMPLOYEE_LOAN_CONFIG":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.EMPLOYEE_LOAN_CONFIG.getValue(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;

		case "COMPLEXITY_PRICE_GROUP_DETAILS":
			fileAudit = getInitialFileAuditDto(fileName, FileMasterJobNameEnum.COMPLEXITY_PRICE_GROUP_DETAILS.getValue(),
					fileGroup, manualJob, totalCount - 1, createdBy, filePath);
			break;

		default:
			throw new ServiceException("Invalid file group", "FILE-ERR-015", "Invalid file group: " + fileGroup);
		}
		return saveFileAuditData(fileAudit);
	}

	@Override
	public PagedRestResponse<List<FileAuditDto>> getFileAuditDtos(Pageable pageable) {

		FileAuditDao fileAuditDao = new FileAuditDao();
		fileAuditDao.setCreatedBy(CommonUtil.getUserName());

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<FileAuditDao> criteria = Example.of(fileAuditDao, matcher);

		Page<FileAuditDao> fileAuditList = fileAuditRepository.findAll(criteria, pageable);

		List<FileAuditDto> fileAuditDtoList = new ArrayList<>();
		fileAuditList.forEach(fileAudit -> {
			FileAuditDto fileAuditDto = (FileAuditDto) MapperUtil.getObjectMapping(fileAudit, new FileAuditDto());
			fileAuditDto.setFileGroup(fileAudit.getFileMaster().getFileGroup());
			fileAuditDtoList.add(fileAuditDto);
		});
		return new PagedRestResponse<>(fileAuditDtoList, fileAuditList);
	}

	@Override
	@Transactional
	public void updateFileAuditToFailedStatus(String fileName, String manualJob, String createdBy, String remarks,
			String localFolder, String localFailureFlder, String fileJobName, String fileGroup) {

		if (!StringUtils.isEmpty(localFolder)) {
			FileServiceUtil.moveFileFromSrcToDst(localFolder + fileName, localFailureFlder + fileName);
		}
		FileAuditDto fileAuditDto = getInitialFileAuditDto(fileName, fileJobName, fileGroup, manualJob, 0, createdBy,
				localFolder);
		setFailureFileAuditDto(fileAuditDto, remarks);
		FileAuditDao savedFileAudit = saveFileAudit(fileAuditDto);
		sendEmailForFailedJobs(savedFileAudit, null);
	}

	private FileAuditDao saveFileAudit(FileAuditDto fileAudit) {
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(fileAudit.getFileGroup(),
				fileAudit.getFileMasterName());
		if (fileMaster == null) {
			throw new ServiceException("File Master not found", "ERR-FILE-001",
					"File Master not found for file group: " + fileAudit.getFileGroup());
		}
		FileAuditDao fileAuditDao = (FileAuditDao) MapperUtil.getObjectMapping(fileAudit, new FileAuditDao());
		fileAuditDao.setFileMaster(fileMaster);
		return fileAuditRepository.save(fileAuditDao);
	}

	private FileAuditDto setFailureFileAuditDto(FileAuditDto fileAuditDto, String remarks) {
		fileAuditDto.setStatus(JobProcessStatusEnum.FAILED.toString());
		fileAuditDto.setRemarks(remarks);
		fileAuditDto.setEndTime(CalendarUtils.getCurrentDate());
		long totalTime = (fileAuditDto.getEndTime().getTime() - fileAuditDto.getStartTime().getTime()) / 1000;
		fileAuditDto.setTotalTime(totalTime);
		fileAuditDto.setSuccessCount(0);
		fileAuditDto.setFailureCount(0);
		return fileAuditDto;
	}

	@Override
	@Transactional
	public boolean checkIfAlreadyProcessed(String fileName, String fileJobName, Object manualJob, String localPath,
			String localFailurePath, String fileGroup) {

		List<FileAuditDao> fileAudits = fileAuditRepository.findByFileNameAndStatus(fileName,
				JobProcessStatusEnum.COMPLETED.toString());
		if (fileAudits.isEmpty()) {
			return true;
		} else {
			updateFileAuditToFailedStatus(fileName, manualJob.toString(), FileIntegrationConstants.ERP_USER,
					"File has been already processed", localPath, localFailurePath, fileJobName, fileGroup);
			return false;
		}
	}

	private void sendEmailForFailedJobs(FileAuditDao fileAudit, String userEmailId) {
		integrationService.sendMailForFailedJob(fileAudit, userEmailId);
	}
}
