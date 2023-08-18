/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.dto.FileAuditDto;
import com.titan.poss.core.dto.FileUploadResponseData;
import com.titan.poss.core.dto.FileUploadResponseDto;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.file.config.ExecuteBatchJobs;
import com.titan.poss.file.constants.PaymentCodeEnum;
import com.titan.poss.file.dao.FileAuditDao;
import com.titan.poss.file.factory.FileJobFactory;
import com.titan.poss.file.repository.FileAuditRepository;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.file.service.FileUploadService;
import com.titan.poss.file.util.FileServiceUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class FileUploadServiceImpl implements FileUploadService {

	@Autowired
	private FileJobFactory fileProcessFactory;

	@Autowired
	private ExecuteBatchJobs executeBatchJobs;

	@Autowired
	private FileAuditRepository fileAuditRepository;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileAuditService fileAuditService;

	@Value("${fileupload.duration.gap}")
	private Integer fileUploadDurationGap;

	private static final String SUCCESS = "SUCCESS";

	private static final String FAILED = "FAILED";

	@Override
	public FileUploadResponseDto processDataFromFile(String fileGroup, MultipartFile file, String param) {
		Map<String, String> fileStatus;
		FileUploadResponseDto responseDto = new FileUploadResponseDto();
		fileStatus = FileUtil.validateReqFile(file, fileGroup, FileExtensionEnum.CSV.toString(),
				ContentTypesEnum.CSV.getValue(), fileService.getNoOfColumns(fileGroup, param));
		if (fileGroup.equals("COMPLEXITY_PRICE_GROUP_DETAILS"))
			FileUtil.validateHeaderColumns(file);
		if (fileStatus.get(FAILED) != null) {
			responseDto.setFileValidationError(true);
			responseDto.setMessage(fileStatus.get(FAILED));
		} else {
			checkIfJobIsRunning(fileGroup);
			// save file in temp folder
			String filePath = fileService.saveFileInTempFolder(file, fileGroup);
			String manualJob = "true";
			int totalCount = FileServiceUtil.getTotalCount(filePath);
			validatePaymentCode(fileGroup, param);
			FileAuditDto fileAudit = fileAuditService.saveInitialFileAudit(fileGroup, file.getOriginalFilename(),
					manualJob, totalCount, CommonUtil.getUserName(), null);
			LaunchJobRequest jobRequest = fileProcessFactory.getLaunchJobRequest(fileGroup, file.getOriginalFilename(),
					fileAudit.getFileId(), param);
			if (jobRequest.getJobParams().get("sync").equalsIgnoreCase("true")) {
				// sync job
				executeBatchJobs.executeJob(jobRequest, false);
				responseDto.setRecords(getUploadResponseData(fileAudit.getFileId()));
				responseDto.setFileValidationError(false);
				responseDto.setUploadType("sync");
			} else {
				// async job
				responseDto.setUploadType("async");
				executeBatchJobs.executeJob(jobRequest, true);
			}
			responseDto.setFileId(fileAudit.getFileId());
			responseDto.setMessage(SUCCESS);
		}
		return responseDto;
	}

	/**
	 * To check if the same user is trying to upload the same file with in the
	 * duration while another job is in progress
	 */
	private void checkIfJobIsRunning(String fileGroup) {
		Date currentDate = CalendarUtils.getCurrentDate();
		List<FileAuditDao> fileAudit = fileAuditRepository.findByStatusAndCreatedByAndFileMasterFileName(
				JobProcessStatusEnum.INPROGRESS.toString(), CommonUtil.getUserName(), fileGroup);
		if (!fileAudit.isEmpty()) {
			long totalTime = (currentDate.getTime() - fileAudit.get(0).getStartTime().getTime()) / 60000;
			if (totalTime < fileUploadDurationGap) {
				throw new ServiceException("Same Job is in-progress. Please try again after some time", "ERR-FILE-014");
			}
		}

	}

	private FileUploadResponseData getUploadResponseData(String fileAuditId) {
		Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(fileAuditId);
		if (!fileAudit.isPresent()) {
			throw new ServiceException("FileAudit not present", "ERR-FILE-007");
		}
		FileUploadResponseData responseData = new FileUploadResponseData();
		responseData.setTotalCount(fileAudit.get().getTotalCount());
		responseData.setSuccessCount(fileAudit.get().getSuccessCount());
		responseData.setFailureCount(fileAudit.get().getFailureCount());
		return responseData;
	}

	/**
	 * @param param
	 */
	private void validatePaymentCode(String fileGroup, String param) {
		if (fileGroup.equalsIgnoreCase("PAYMENT_HOSTNAME_MAPPING")) {
			List<String> paymentTypes = PaymentCodeEnum.getPaymentTypeEnum();
			if (StringUtils.isEmpty(param) || !paymentTypes.contains(param)) {
				throw new ServiceException("Invalid payment code: " + param, "ERR-FILE-022",
						Map.of("paymentCode", StringUtils.isEmpty(param) ? "" : param));
			}
		}
	}
}
