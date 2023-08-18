/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.integration.sftp.session.DefaultSftpSessionFactory;
import org.springframework.integration.sftp.session.SftpSession;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.config.SftpConfig;
import com.titan.poss.file.constants.PaymentCodeEnum;
import com.titan.poss.file.dao.FileAuditDao;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.dao.FileSequenceDao;
import com.titan.poss.file.dto.LocationCodeAndMaxBusinessDateDto;
import com.titan.poss.file.dto.SftpConfigDto;
import com.titan.poss.file.jobs.mapper.LocationCodeAndBusinessDayMapper;
import com.titan.poss.file.repository.FileAuditRepository;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.repository.FileSequenceRepository;
import com.titan.poss.file.service.FileSequenceService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.file.util.FileCryptoUtil;
import com.titan.poss.file.util.FileServiceUtil;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.repository.CountryRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class FileServiceImpl implements FileService {

	@Autowired
	private FileSequenceRepository fileSequenceRepository;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	@Autowired
	private FileSequenceService fileSequenceService;

	@Autowired
	private Environment env;

	@Autowired
	private CountryRepository countryRepository;

	@Value("${country.code:IND}")
	private String countryCode;

	@Autowired
	private DefaultSftpSessionFactory sftpSessionFactory;

	@Autowired
	private FileAuditRepository fileAuditRepository;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileService fileService;

	@Autowired
	private LocationCodeAndBusinessDayMapper locationCodeAndBusinessDayMapper;

	@Autowired
	private SftpConfig sftpConfig;

	@Autowired
	private VendorRepository vendorRepository;

	private static String secretKeyStr = ApplicationPropertiesUtil.getProperty("poss.crypto.encrpKey");

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	private static final String FILE_BASE_FOLDER = "files.baseFolder";

	private static final String TEMP_FILE_FOLDER = "temp.file.folder";

	private static final String INPUT_DATE_FORMAT = "yyyy-MM-dd";

	private static final String REQUIRED_DATE_FORMAT = "dd-MMM-yyyy";

	private static final String FILE_MASTER_NOT_FOUND = "File Master not found";

	private static final String ERR_FILE_001 = "ERR-FILE-001";

	private static final String PATH_DELIMITTER = "/";

	@Override
	public String getNetcarrotsFileName(String transactionDate, String fileName, String fileGroup, boolean increment) {
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(fileGroup, fileName);
		if (fileMaster == null) {
			throw new ServiceException(FILE_MASTER_NOT_FOUND, ERR_FILE_001);
		}
		CountryDao countryData = fileService.getCountryData();
		FileSequenceDao fileSequence = getFileSequence(fileMaster, countryData.getFiscalYear());
		if (fileSequence == null) {
			fileSequence = createFileSequence(fileMaster, countryData.getFiscalYear());
		}
		if (StringUtils.isEmpty(transactionDate)) {
			transactionDate = LocalDate.now().toString();
		}
		Date inputDate = CalendarUtils.convertStringToDate(transactionDate, INPUT_DATE_FORMAT);
		String date = CalendarUtils.formatDateToString(inputDate, REQUIRED_DATE_FORMAT).replace("-", "");
		Integer seqNo = increment ? fileSequence.getSequenceNo() + 1 : fileSequence.getSequenceNo();
		return fileMaster.getFilePrefix() + "_" + seqNo + "_" + date + fileMaster.getFileExtension();
	}

	private FileSequenceDao createFileSequence(FileMasterDao fileMaster, Integer fiscalYear) {
		return fileSequenceService.saveNewFileSequence(fileMaster, fiscalYear, null);
	}

	@Override
	public void removeTempFile(String fileGroup, String fileName) {
		try {
			Path path = Paths.get(env.getProperty(FILE_BASE_FOLDER) + env.getProperty(TEMP_FILE_FOLDER)
					+ PATH_DELIMITTER + fileGroup + PATH_DELIMITTER + fileName);
			Files.deleteIfExists(path);
		} catch (IOException e) {
			throw new ServiceException("Exception while removing file from temp folder", "ERR-FILE-003", e);
		}
	}

	@Override
	public String saveFileInTempFolder(MultipartFile file, String fileGroup) {
		String directoryName = env.getProperty(FILE_BASE_FOLDER) + env.getProperty(TEMP_FILE_FOLDER) + fileGroup;
		fileService.makeDirectoryIfNotExists(directoryName);
		String fileLocation = directoryName + PATH_DELIMITTER + file.getOriginalFilename();
		if (!file.isEmpty()) {
			try (InputStream in = new BufferedInputStream(file.getInputStream());
					OutputStream os = new BufferedOutputStream(new FileOutputStream(fileLocation));) {
				byte[] buffer = new byte[4096];
				int length;
				while ((length = in.read(buffer)) > 0) {
					os.write(buffer, 0, length);
				}
			} catch (IOException e) {
				throw new ServiceException("Exception while saving file in temp folder", "ERR-FILE-002", e);
			}
		}
		return fileLocation;
	}

	@Override
	public Integer getNoOfColumns(String fileGroup, String param) {

		switch (fileGroup) {
		case "AIRPAY_CONFIG":
			return 6;
		case "GV_STATUS_UPDATE":
			return 2;
		case "GV_VALIDITY_EXTEND":
			return 2;
		case "CARD_DETAILS":
			return 2;
		case "PAYER_BANK":
			return 2;
		case "PAYMENT_HOSTNAME_MAPPING":
			if (param.equalsIgnoreCase(PaymentCodeEnum.UNIPAY.name())) {
				return 5;
			} else {
				return 4;
			}
		case "GEP_CONFIG_EXCLUDE_MAPPING":
			return 2;
		case "PRODUCT_PRICE_MAPPING":
			return 6;
		case "TAX_CONFIG":
			return 11;
		case "FIR":
			return 8;
		case "MER":
			return 8;
		case "QCGC_CONFIG":
			return 2;
		case "ITEM_GROUP_LEVEL_DISCOUNT":
			return 31;
		case "BEST_DEAL_DISCOUNT":
			return 31;
		case "DISCOUNT_EXCLUDE_ITEM_MAPPING":
			return 2;
		case "PRICE_LOGIC_TEST":
			return 10;
		case "RAZORPAY_CONFIG":
			return 2;
		case "EMPLOYEE_LOAN_CONFIG":
			return 12;
		case "COMPLEXITY_PRICE_GROUP_DETAILS":
			return 7;
		default:
			throw new ServiceException("Invalid file group", "ERR-FILE-007");
		}
	}

	@Override
	public String getGvRedemptionFileName(String fileName, String fileGroup) {

		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(fileGroup, fileName);
		if (fileMaster == null) {
			throw new ServiceException(FILE_MASTER_NOT_FOUND, ERR_FILE_001);
		}
		CountryDao countryData = fileService.getCountryData();
		FileSequenceDao fileSequence = getFileSequence(fileMaster, countryData.getFiscalYear());
		if (fileSequence == null) {
			fileSequence = createFileSequence(fileMaster, countryData.getFiscalYear());
		}

		return fileMaster.getFilePrefix() + (fileSequence.getSequenceNo() + 1) + fileMaster.getFileExtension();

	}

	@Override
	public String getCommonOracleFileName(String fileName, String fileGroup) {
		log.info("File name is :  " + fileName);
		log.info("File group is :  " + fileGroup);
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(fileGroup, fileName);
		if (fileMaster == null) {
			throw new ServiceException(FILE_MASTER_NOT_FOUND, ERR_FILE_001);
		}
		CountryDao countryData = fileService.getCountryData();
		FileSequenceDao fileSequence = getFileSequence(fileMaster, countryData.getFiscalYear());
		if (fileSequence == null) {
			fileSequence = createFileSequence(fileMaster, countryData.getFiscalYear());
		}

		return fileMaster.getFilePrefix() + (getCountryData().getFiscalYear() % 100 + 1)
				+ String.format("%05d", fileSequence.getSequenceNo() + 1) + fileMaster.getFileExtension();

	}

	@Override
	public CountryDao getCountryData() {
		CountryDao country = countryRepository.findOneByCountryCode(countryCode);
		if (country == null) {
			throw new ServiceException("Invalid country code", "ERR-FILE-016");
		}
		return country;
	}

	@Override
	public void downloadFilesFromSftpServer(String sftpServerPath, String localPath, String fileExt) {

		// accessing sftp
		SftpConfigDto sftpConnectionProperties = sftpConfig.getSftpConnectionProperties(vendorRepository);
		try (SftpSession sftpSession = sftpSessionFactory.getSession()) {
			log.debug("Connected to the sftp server.");
			String[] fileNames = sftpSession.listNames(sftpConnectionProperties.getBasePath() + sftpServerPath);
			for (String fileName : fileNames) {
				// downloading each txt file and ignoring a folder
				File downloadFile = new File(localPath + fileName);
				try (FileOutputStream outputStream = new FileOutputStream(downloadFile)) {
					// downloading a file
					sftpSession.read(sftpConnectionProperties.getBasePath() + sftpServerPath + fileName, outputStream);
				}
			}
		} catch (Exception exception) {
			throw new ServiceException("Error while downloading/deleting files from sftp server", "ERR-FILE-017",
					exception);
		}
	}

	@Override
	public void moveFilesInSftpServer(String sftpSourcePath, String sftpDestServerPath, String localPath) {
		SftpConfigDto sftpConnectionProperties = sftpConfig.getSftpConnectionProperties(vendorRepository);
		// accessing the local folder
		File folder = new File(localPath);
		File[] files = folder.listFiles();
		for (final File fileEntry : files) {
			// moving the files to sftp server folder
			try (InputStream inputStream = new FileInputStream(fileEntry);
					SftpSession sftpSession = sftpSessionFactory.getSession()) {
				sftpSession.rename(sftpConnectionProperties.getBasePath() + sftpSourcePath + fileEntry.getName(),
						sftpConnectionProperties.getBasePath() + sftpDestServerPath + fileEntry.getName());
			} catch (Exception exception) {
				throw new ServiceException("Error while uploading files to sftp server with sftp source path: "
						+ sftpSourcePath + fileEntry.getName() + " and sftp dest path: " + sftpDestServerPath
						+ fileEntry.getName(), "ERR-FILE-018", exception);
			}
		}
	}

	@Override
	public void moveMasterFile(String fileId, String sourcePath, String successPath, String failurePath) {
		Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(fileId);
		if (fileAudit.isPresent()) {
			// if there is atleast success count, then
			// the file will be placed in the success folder
			// else the file will be placed in the failure folder
			if (fileAudit.get().getStatus().equalsIgnoreCase("COMPLETED") && fileAudit.get().getSuccessCount() > 0) {
				FileServiceUtil.moveFileFromSrcToDst(sourcePath, successPath);
			} else {
				FileServiceUtil.moveFileFromSrcToDst(sourcePath, failurePath);
			}
		}
	}

	@Override
	public void removeFile(String folderPath) {
		File folder = new File(folderPath);
		File[] files = folder.listFiles();
		for (final File fileEntry : files) {
			// removing files after they have been processed
			try {
				Files.deleteIfExists(Paths.get(folderPath + fileEntry.getName()));
			} catch (IOException e) {
				log.error("Error while removing the file: " + fileEntry);
			}
		}
	}

	@Override
	public void uploadFilesToSftpServer(String sftpServerPath, String localPath) {
		log.debug("local path: " + localPath);
		log.debug("sftp path: " + sftpServerPath);
		SftpConfigDto sftpConnectionProperties = sftpConfig.getSftpConnectionProperties(vendorRepository);
		String fullSftpServerPath = sftpConnectionProperties.getBasePath() + sftpServerPath;
		// accessing the local folder
		File folder = new File(localPath);
		File[] files = folder.listFiles();
		for (final File fileEntry : files) {
			// copying the files to sftp server folder
			try (InputStream inputStream = new FileInputStream(localPath + fileEntry.getName());
					SftpSession sftpSession = sftpSessionFactory.getSession()) {
				sftpSession.write(inputStream, fullSftpServerPath + fileEntry.getName());
			} catch (Exception exception) {
				log.debug("Error while uploading files to sftp server with local path: " + localPath
						+ fileEntry.getName() + " and sftp path: " + sftpServerPath + fileEntry.getName() + " Exception: " + exception+ " Message: " + exception.getMessage() );
			}
		}
	}

	@Override
	public void updateFileMasterLocationMapping(String locationCodeAndBusinessDateUpdateSql,
			String locationCodeAndBusinessDateInsertSql, String jobName, String fileId) {

		List<LocationCodeAndMaxBusinessDateDto> locationCodesAndBusinessDatesToBeUpdated = namedParameterJdbcTemplate
				.query(locationCodeAndBusinessDateUpdateSql, locationCodeAndBusinessDayMapper);

		// updating records if present
		for (LocationCodeAndMaxBusinessDateDto locationCode : locationCodesAndBusinessDatesToBeUpdated) {
			String updateFileMasterLocationMappingSql = "UPDATE file_master_location_mapping set last_business_date = '"
					+ locationCode.getLastBusinessDate() + "'  where location_code = '" + locationCode.getLocationCode()
					+ "' and file_master_id = (select id from file_master where file_name = '" + jobName + "');";
			jdbcTemplate.execute(updateFileMasterLocationMappingSql);
		}

		List<LocationCodeAndMaxBusinessDateDto> locationCodesAndBusinessDatesToBeInserted = namedParameterJdbcTemplate
				.query(locationCodeAndBusinessDateInsertSql, locationCodeAndBusinessDayMapper);

		// inserting records if not present
		for (LocationCodeAndMaxBusinessDateDto locationCode : locationCodesAndBusinessDatesToBeInserted) {
			String insertFileMasterLocationMappingSql = "INSERT into [file].dbo.file_master_location_mapping (file_master_id,location_code,last_business_date,created_by,created_date,last_modified_by,last_modified_date)\r\n"
					+ "values ((select id from [file].dbo.file_master where file_name ='" + jobName + "'),'"
					+ locationCode.getLocationCode() + "','" + locationCode.getLastBusinessDate() + "','"
					+ FileIntegrationConstants.ERP_USER + "',getdate(),'" + FileIntegrationConstants.ERP_USER
					+ "',getdate())";
			jdbcTemplate.execute(insertFileMasterLocationMappingSql);
		}

	}

	@Override
	public void encryptOrdecryptFile(String inputPath, String outputPath, String encryptOrDecrypt) {
		File folder = new File(inputPath);
		File[] files = folder.listFiles();
		for (final File fileEntry : files) {
			if (fileEntry.exists()) {
				File decryptedFile = new File(outputPath + fileEntry.getName());
				try {
					if (encryptOrDecrypt.equalsIgnoreCase("ENCRYPT")) {
						FileCryptoUtil.encryptFile(secretKeyStr, fileEntry, decryptedFile);
					} else {
						FileCryptoUtil.decryptFile(secretKeyStr, fileEntry, decryptedFile);
					}
				} catch (IOException e) {
					throw new ServiceException("Error occurred while encrypting/decrypting file", "ERR-CORE-030", e);
				}
			}
		}
		removeFile(inputPath);
	}

	@Override
	public String getOutBoundFileName(String fileName, String fileGroup) {
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(fileGroup, fileName);
		if (fileMaster == null) {
			throw new ServiceException(FILE_MASTER_NOT_FOUND, ERR_FILE_001);
		}
		CountryDao countryData = fileService.getCountryData();
		FileSequenceDao fileSequence = getFileSequence(fileMaster, countryData.getFiscalYear());
		if (fileSequence == null) {
			fileSequence = createFileSequence(fileMaster, countryData.getFiscalYear());
		}

		return fileMaster.getFilePrefix() + getCountryData().getFiscalYear() % 100 + (fileSequence.getSequenceNo() + 1)
				+ fileMaster.getFileExtension();
	}

	@Override
	public void makeDirectoryIfNotExists(String directoryName) {
		File directory = new File(directoryName);
		if (!directory.exists()) {
			directory.mkdir();
		}
	}

	private FileSequenceDao getFileSequence(FileMasterDao fileMaster, Integer fiscalYear) {
		if (fileMaster.getResetSequenceNo()) {
			return fileSequenceRepository.findByFileMasterAndFiscalYear(fileMaster, fiscalYear);
		} else {
			return fileSequenceRepository.findByFileMaster(fileMaster);
		}
	}

	@Override
	public void moveFilesFromSrcToDest(String srcFolder, String destFolder) {
		final File folder = new File(srcFolder);
		File[] files = folder.listFiles();

		if (files != null && files.length > 0) {
			for (final File fileEntry : files) {
				boolean rename = fileEntry.renameTo(new File(destFolder + fileEntry.getName()));
				log.debug("file rename: " + rename);
			}
		}
	}

}
