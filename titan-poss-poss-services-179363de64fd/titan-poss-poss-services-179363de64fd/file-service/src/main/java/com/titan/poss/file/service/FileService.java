/*  

 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.location.dao.CountryDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface FileService {

	public String getNetcarrotsFileName(String transactionDate, String fileName, String fileGroup, boolean increment);

	public String getGvRedemptionFileName(String fileName, String fileGroup);

	String saveFileInTempFolder(MultipartFile file, String fileGroup);

	void removeTempFile(String fileGroup, String fileName);

	Integer getNoOfColumns(String fileGroup, String param);

	String getCommonOracleFileName(String fileName, String fileGroup);

	CountryDao getCountryData();

	void downloadFilesFromSftpServer(String sftpServerPath, String localPath, String fileExt);

	void moveFilesInSftpServer(String sftpSourcePath, String sftpDestServerPath, String localPath);

	void moveMasterFile(String fileId, String sourcePath, String successPath, String failurePath);

	void removeFile(String folderPath);

	void uploadFilesToSftpServer(String sftpServerPath, String localPath);

	void updateFileMasterLocationMapping(String locationCodeAndBusinessDateUpdateSql,
			String locationCodeAndBusinessDateInsertSql, String jobName, String fileId);

	void encryptOrdecryptFile(String inputPath, String outputPath, String encryptOrDecrypt);

	public String getOutBoundFileName(String fileName, String fileGroup);

	void makeDirectoryIfNotExists(String directoryName);
	
	void moveFilesFromSrcToDest(String srcFolder, String destFolder);

}
