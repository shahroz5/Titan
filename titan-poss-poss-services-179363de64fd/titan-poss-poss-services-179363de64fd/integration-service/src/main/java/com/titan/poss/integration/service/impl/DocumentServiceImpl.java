/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service.impl;

import static com.titan.poss.core.utils.FileUtil.FILE_FORWARD_SEPARATOR;
import static com.titan.poss.integration.util.S3Util.TEMP_BUCKET_PREFIX;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.dto.PresignedUrlDto;
import com.titan.poss.core.enums.DbBackupStatusEnum;
import com.titan.poss.core.enums.VendorTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.DbBackupAuditDto;
import com.titan.poss.integration.dto.FileUploadResponseDto;
import com.titan.poss.integration.intg.dao.DbBackupAuditDao;
import com.titan.poss.integration.intg.repository.DbBackupAuditRepository;
import com.titan.poss.integration.service.DocumentService;
import com.titan.poss.integration.service.StorageService;
import com.titan.poss.integration.service.VendorService;
import com.titan.poss.integration.service.factory.StorageFactory;
import com.titan.poss.integration.util.S3Util;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class DocumentServiceImpl implements DocumentService {

	@Autowired
	private VendorService vendorService;

	@Autowired
	private StorageFactory storageFactory;
	
	@Autowired
	private AmazonS3 s3client;

	@Autowired
	private DbBackupAuditRepository dbBackupAuditRepository;
	
	
	@Value("${docs.file.source.path}")
	String fileBasePath;
	
	@Value("${db.backup.files.path}")
	String dbBackupFilePath;


	/**
	 * 
	 * @param filePath
	 * @return BooleanResponse
	 */
	@Override
	public void uploadFileByPath(String filePath) {

		String fileLocationPath = fileBasePath + filePath;
		File file = FileUtil.getFileByPath(fileLocationPath);

		Map<String, String> bucketKey = S3Util.getBucketKeyName(filePath);
		String bucketName = bucketKey.get(S3Util.BUCKET);
		String key = bucketKey.get(S3Util.KEY);

		log.debug("\nGet info.\nBucket: {}, key: {}", bucketName, key);

		StorageService storageService = getActiveStorageService();
		storageService.uploadFile(bucketName, key, file);
	}

	private StorageService getActiveStorageService() {
		VendorDao vendor = vendorService.getActiveByVendorType(VendorTypeEnum.STORAGE);
		return storageFactory.getStorageService(vendor.getVendorCode());
	}

	@Override
	public FileUploadResponseDto uploadMultipartFiles(MultipartFile file, String documentTypeStr, String id) {

		String bucketName = getBucketNameByDocType(documentTypeStr);

		// if temporary, bucket >> temp/{random-uuid}/{fileName} for any documentType
		// if permanent, bucket >> {permanent-uuid}/{fileName} for any documentType

		StringBuilder commonKey = new StringBuilder();
		if (StringUtils.isBlank(id)) {

			id = UUID.randomUUID().toString();
			// append extra "temp/" to bucket
			commonKey.append(TEMP_BUCKET_PREFIX);
			commonKey.append(FILE_FORWARD_SEPARATOR);
		}
		commonKey.append(id);
		commonKey.append(FILE_FORWARD_SEPARATOR);

		String fileName = file.getOriginalFilename();
		if (StringUtils.isBlank(fileName)) {
			return null;
		}
		fileName = fileName.replace(" ", "_");

		StorageService storageService = getActiveStorageService();
		return storageService.uploadFile(bucketName, commonKey.toString(), file, fileName);
	}

	@Override
	public PresignedUrlDto getPresignedUrlOfObjects(Set<String> objectKeys, String documentTypeStr) {

		StorageService storageService = getActiveStorageService();
		return storageService.getUrlForListOfObject(objectKeys, getBucketNameByDocType(documentTypeStr));
	}

	private String getBucketNameByDocType(String documentTypeStr) {

		DocumentBucketEnum documentType = DocumentBucketEnum.valueOf(documentTypeStr);
		return documentType.getBucketName();
	}

	@Override
	public void updateTempFile(String oldDocumentPath, String newDocumentPath, String documentTypeStr) {

		String bucketName = getBucketNameByDocType(documentTypeStr);

		StorageService storageService = getActiveStorageService();
		storageService.updateKey(oldDocumentPath, newDocumentPath, bucketName);
	}

	@Override
	public void deleteFileByPath(String filePath) {

		Map<String, String> bucketKey = S3Util.getBucketKeyName(filePath);
		String bucketName = bucketKey.get(S3Util.BUCKET);
		String key = bucketKey.get(S3Util.KEY);

		StorageService storageService = getActiveStorageService();
		storageService.deleteFile(bucketName, key);
	}

	@Override
	public byte[] getFileByPath(String filePath, HttpServletResponse response) {

		String fileName = FileUtil.getFileNameByPath(filePath);

		Map<String, String> bucketKey = S3Util.getBucketKeyName(filePath);
		String bucketName = bucketKey.get(S3Util.BUCKET);
		String key = bucketKey.get(S3Util.KEY);

		log.debug("\nTrying to fetching from AWS.\nBucket: {}, key: {}", bucketName, key);

		response.addHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
		response.addHeader("TEST KEY", "TEST VALUE");
		String mimeType = FileUtil.getMimeTypeByFileName(fileName);
		response.setContentType(mimeType);
		StorageService storageService = getActiveStorageService();
		byte[] content = storageService.getFile(bucketName, key);

		saveContentToFile(filePath, content);

		return content;
	}

	/**
	 * @param filePath
	 * @param content
	 */
	private void saveContentToFile(String filePath, byte[] content) {

		String path = fileBasePath + filePath;
		try {
			FileUtil.saveContentToFileFromByteArray(path, content);
		} catch (IOException e) {
			log.debug("Issue in file writing: {}", e);
			throw new ServiceException("Issue in File creation", "ERR-INT-003", e);
		}

	}
	
	@Override
	public String uploadBackupFile() {
		String filePath = dbBackupFilePath;
		File file = new File(filePath);
		return uploadBackupFile(file);
	}
	@Override
//	@Scheduled(cron="0 0 12 * * ?")
	public String uploadBackupFile(File fileDir) {
		log.info("file path 217  {}", fileDir);
		File[] filesList = fileDir.listFiles();
	        for (File file: filesList) {
	        	log.info("file  213  {}", file);
	        	String alreadyExistFile = "";
	            if (file.isFile()) {
	            	log.info("file name 222 {}" , file.getName());
	            	DbBackupAuditDao backupAudit = dbBackupAuditRepository.findByFileNameAndStatus(file.getName(), DbBackupStatusEnum.COMPLETED.toString());
	    			if (backupAudit != null) {
	    				if(alreadyExistFile.length() > 0)
	    					alreadyExistFile = alreadyExistFile+", ";
	    				alreadyExistFile = alreadyExistFile + file.getName();
	    			} else 
	    				copyBackupFiles(file);
	            }
	        }
		return "File uploaded successfully";
	}
	
	private String copyBackupFiles(File file) {
		Date startTime =  CalendarUtils.getCurrentDate();
		try {
			String fileName = file.getName();
		
			FileInputStream inputStream = new FileInputStream(file);
			log.info("file input  {}" , inputStream);
            		
			s3client.putObject(new PutObjectRequest("nap-btq-db-backup",fileName, inputStream, new ObjectMetadata()));
		} catch (Exception e) {
			saveBackupAudit(startTime, file, DbBackupStatusEnum.FAILED.toString());	
			throw new ServiceException("Issue in File creation", "ERR-INT-004", e);
		}
		saveBackupAudit(startTime, file, DbBackupStatusEnum.COMPLETED.toString());
		return "File uploaded successfully";
	}


	private void saveBackupAudit(Date startTime, File file, String status) {
		DbBackupAuditDto dbBackupAudit = new DbBackupAuditDto();
		dbBackupAudit.setFileName(file.getName());
		dbBackupAudit.setStartTime(startTime);
		dbBackupAudit.setEndTime(CalendarUtils.getCurrentDate());
		dbBackupAudit.setVersion(0);
		dbBackupAudit.setStatus(status);
		
		DbBackupAuditDao dbBackupAuditDao = (DbBackupAuditDao) MapperUtil.getObjectMapping(dbBackupAudit, new DbBackupAuditDao());
		dbBackupAuditRepository.save(dbBackupAuditDao);
	}
	
}
