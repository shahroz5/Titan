/*  
* Copyright 2019. Titan Company Limited
* All rights reserved.
*/

package com.titan.poss.sales.service.impl;

import static com.titan.poss.core.utils.FileUtil.FILE_FORWARD_SEPARATOR;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.PresignedUrlDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.OTPUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.CustomerDocumentSyncDto;
import com.titan.poss.sales.dto.PresignedDto;
import com.titan.poss.sales.dto.constants.CustomerDocumentStatusEnum;
import com.titan.poss.sales.dto.constants.UploadFileDocTypeEnum;
import com.titan.poss.sales.dto.response.FileDetailsDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.CustomerDocumentService;
import com.titan.poss.sales.service.FileService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;

import feign.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
@Slf4j
public class FileServiceImpl implements FileService {

	private static final Logger LOGGER = LoggerFactory.getLogger(FileServiceImpl.class);
	public static final String ERR_SALE_109 = "ERR-SALE-109";
	public static final String ERR_CORE_048 = "ERR-CORE-048";

	private static final String RECORD_NOT_FOUND = "Record(s) Not found";
	private static final String ERR_CORE_039 = "ERR-CORE-039";

	@Value("${docs.file.source.path}")
	String fileBasePath;

	@Autowired
	private CustomerDocumentsRepository customerDocumentRepo;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationRepo;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private FileService fileService;

	@Autowired
	private CustomerDocumentService customerDocService;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Value("${app.name}")
	private String appName;

	public static final Integer NUMBER_APPEND_LENGTH = 6;
	public static final String LOCATION_CODE = "locationCode";

	private String getRandomNo() {
		return OTPUtil.randomNumeric(NUMBER_APPEND_LENGTH);
	}

	@Override
	@Transactional
	public PublishResponse uploadFileTransactional(String txnId, Integer customerId, String docTypeStr,
			String fileTypeStr, MultipartFile file) {
		UploadFileDocTypeEnum docType = UploadFileDocTypeEnum.valueOf(docTypeStr);
		CustomerDocumentsDao customerDocument = null;
		String id = null;
		try {

			// if file is not of customer related, then no need of customer id
			if (docType != UploadFileDocTypeEnum.CUSTOMER_WORKFLOW || docType != UploadFileDocTypeEnum.CM
					|| docType != UploadFileDocTypeEnum.AB)
				customerId = null;

			String extension = getFileExtension(file);
			validateInput(txnId, customerId, docTypeStr, extension, file);

			CustomerDao customer = getCustomerId(customerId, CommonUtil.getLocationCode());
			String customerMasterId = null;
			if (customer != null)
				customerMasterId = customer.getId();

			boolean isPermanent = (txnId != null);

			// assign uuid only if temp file upload happens
			String tempUUID = null;
			if (!isPermanent)
				tempUUID = UUID.randomUUID().toString();

			// generate temp or permanent path based on id field value
			String relativePath = generateFilePath(txnId, docTypeStr, customerMasterId, file.getOriginalFilename(),
					extension, tempUUID, false);

			saveAndGenerateFilePath(relativePath, file);

			customerDocument = updateCustomerDocument(relativePath, txnId, docTypeStr, customer, fileTypeStr, tempUUID);

			// data-sync based on document_type & file_type (for e.g, customer)

			id = customerDocument.getId();

		} catch (IOException e) {
			throw new ServiceException("Error in file upload", "ERR-SALE-108");
		}
		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)
				&& (docType == UploadFileDocTypeEnum.CUSTOMER_WORKFLOW || docType == UploadFileDocTypeEnum.AB
						|| docType == UploadFileDocTypeEnum.CM)
				|| (docType == UploadFileDocTypeEnum.CUSTOMER_WORKFLOW && customerId != null)) {
			syncDto = syncStaggingCustomerDocument(customerDocument, SalesOperationCode.CUSTOMER_DOCUMENT_CUS);
		}
		PublishResponse response = new PublishResponse();
		response.setApiResponse(id);
		response.setSyncStagingDto(syncDto);
		return response;
	}

	@Transactional
	@Override
	public PublishResponse updateTempFileTransactional(String txnId, Integer customerId, String docTypeStr,
			String fileType, String tempId) {

		UploadFileDocTypeEnum docType = UploadFileDocTypeEnum.valueOf(docTypeStr);

		// if file is not of customer related, then no need of customer id
		if (docType != UploadFileDocTypeEnum.CUSTOMER_WORKFLOW)
			customerId = null;

		CustomerDocumentsDao cdTemp = getCustomerDocByIdAndLocationCode(tempId, CommonUtil.getStoreCode());

		if (cdTemp.getTxnId() != null || cdTemp.getCustomer() != null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039, "This is not a temp file. txnId: "
					+ cdTemp.getTxnId() + ", customerId: " + cdTemp.getCustomer().getId());

		if (!cdTemp.getDocumentType().equals(docTypeStr) || !cdTemp.getFileType().equals(fileType)) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006, "original: "
					+ cdTemp.getDocumentType() + "-" + cdTemp.getFileType() + ", input: " + docTypeStr + "-" + fileType,
					Map.of("type", "file"));
		}

		DocumentBucketEnum docTypeBucket = getDocumentBucketEnumByDocType(cdTemp.getDocumentType());

		String tempPath = fileBasePath + cdTemp.getDocumentPath();
		File tempLocalFIle = new File(tempPath);
		if (!tempLocalFIle.exists())
			throw new ServiceException("temp file not found in local server.", ERR_CORE_048);

		CustomerDao customer = getCustomerId(customerId, CommonUtil.getLocationCode());
		String customerMasterId = null;
		if (customer != null)
			customerMasterId = customer.getId();

		String extension = getFileExtension(cdTemp.getDocumentPath());
		String fileOriginalName = FileUtil.getFileNameByPath(cdTemp.getDocumentPath());
		String docPathNew = generateFilePath(txnId, docTypeStr, customerMasterId, fileOriginalName, extension, null,
				true);

		// copy to new path
		try {
			FileUtil.copyFile(tempPath, fileBasePath + docPathNew);
		} catch (IOException e) {
			throw new ServiceException("File operation failed", "ERR-CORE-049");
		}

		// online storage operation
		Boolean onlineUploadStatus = null;
		try {
			if (!cdTemp.getIsSynced()) {
				log.debug("S3 upload API, since temp one is not synced");
				integrationService.uploadFileToOnlineBucket(docPathNew);
				// provide tempFileKey, new filePath
			} else {
				integrationService.updateTempFile(docTypeBucket.name(), cdTemp.getDocumentPath(), docPathNew);
			}
			onlineUploadStatus = true;
		} catch (Exception e) {
			log.error("Upload File to online bucket failed. Error Message:- " + e.getMessage());
			onlineUploadStatus = false;
		}

		CustomerDocumentsDao cd = setNewCustomerDocument(docTypeStr, cdTemp, docPathNew, onlineUploadStatus);

		if (txnId != null)
			cd.setTxnId(txnId);
		cd.setCustomer(customer);
		cd = customerDocService.save(cd);

		customerDocService.deactivateCustomerDoc(cdTemp);

		// Delete temp file if all done
		deleteFile(tempLocalFIle);

		// delete the temp directory where temp file was stored
		String tempDir = tempPath.substring(0, tempPath.lastIndexOf(FILE_FORWARD_SEPARATOR));
		log.debug("Directory to delete: {}", tempDir);
		FileUtil.deleteDirectory(new File(tempDir));
		SyncStagingDto syncDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			syncDto = syncStaggingCustomerDocument(cd, SalesOperationCode.CUSTOMER_DOCUMENT_CUS);
		}
		PublishResponse response = new PublishResponse();
		response.setApiResponse(cd.getId());
		response.setSyncStagingDto(syncDto);
		return response;

	}

	private void deleteFile(File localFIle) {
		try {
			Files.delete(localFIle.toPath());
		} catch (IOException e) {
			log.error("File deletion operation failed for temp file: " + localFIle);
		}
	}

	private CustomerDocumentsDao setNewCustomerDocument(String docTypeStr, CustomerDocumentsDao cdTemp,
			String docPathNew, Boolean onlineUploadStatus) {
		CustomerDocumentsDao cd = (CustomerDocumentsDao) MapperUtil.getDtoMapping(cdTemp, CustomerDocumentsDao.class);
		cd.setId(UUID.randomUUID().toString());
		if (docTypeStr.equals(UploadFileDocTypeEnum.CUSTOMER.name()))
			cd.setLocationCode(null);
		cd.setDocumentPath(docPathNew);
		cd.setIsSynced(onlineUploadStatus);
		return cd;
	}

	private CustomerDao getCustomerId(Integer customerId, String locationCode) {

		if (customerId == null)
			return null;

		CustomerLocationMappingIdDao customerObj = new CustomerLocationMappingIdDao();

		customerObj.setCustomerId(customerId);
		customerObj.setLocationCode(locationCode);

		Optional<CustomerLocationMappingDao> customerLocMappingId = customerLocationRepo.findById(customerObj);
		if (customerLocMappingId.isPresent()) {
			return customerLocMappingId.get().getCustomer();
		} else {
			throw new ServiceException("No mapping found for passed customer:", ERR_SALE_109,
					"No mapping found for passed customer:");
		}

	}

	private String saveAndGenerateFilePath(String relativePath, MultipartFile file) throws IOException {

		Path path = Paths.get(fileBasePath + relativePath);
		// copying file to the generated path
		try {
			Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new ServiceException("Error in file upload", "ERR-SALE-108", e);
		}

		return relativePath;
	}

	private String generateFilePath(String txnId, String docTypeStr, String customerMasterId, String fileOriginalName,
			String extension, String tempUUID, boolean isUpdate) {

		DocumentBucketEnum docTypeBucket = getDocumentBucketEnumByDocType(docTypeStr);

		StringBuilder finalPathToBeAppended = new StringBuilder();
		StringBuilder fileName = generateFileName(fileOriginalName, extension, isUpdate);

		finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append(docTypeBucket.getBucketName());

		// when doc type not customer, add location code
		if (!docTypeStr.equals(UploadFileDocTypeEnum.CUSTOMER.name()))
			finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append(CommonUtil.getStoreCode());

		// permanent file path
		if (tempUUID == null) {
			if (customerMasterId != null)
				finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append(customerMasterId); // appending customerId
			if (txnId != null)
				finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append(txnId); // appending txnId
		} else {
			finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append("temp");
			finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append(tempUUID);
		}

		File directory = new File(fileBasePath + finalPathToBeAppended.toString());

		if (!directory.exists()) {
			directory.mkdirs();
		}

		finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append(fileName.toString());

		return finalPathToBeAppended.toString();
	}

	private DocumentBucketEnum getDocumentBucketEnumByDocType(String docTypeStr) {
		UploadFileDocTypeEnum docType = UploadFileDocTypeEnum.valueOf(docTypeStr);
		return (docType != UploadFileDocTypeEnum.CUSTOMER) ? DocumentBucketEnum.CUSTOMER_TRANSACTION
				: DocumentBucketEnum.CUSTOMER_DOCUMENT;
	}

	private StringBuilder generateFileName(String fileOriginalName, String extension, boolean isUpdate) {

		StringBuilder fileName = new StringBuilder();
		String fileNameWoExtension = getNameWoExtension(fileOriginalName);
		fileName.append(fileNameWoExtension);

		// temp file already have this, when converting to permanent not to do again
		if (!isUpdate) {
			fileName.append("_").append(getRandomNo());
		}
		fileName.append(".").append(extension);
		return fileName;
	}

	private String getFileExtension(MultipartFile file) {
		return getFileExtension(file.getOriginalFilename());
	}

	private String getFileExtension(String fileName) {
		String example = StringUtils.cleanPath(fileName);
		String separator = ".";
		int sepPos = example.lastIndexOf(separator);
		if (sepPos == -1) {
			throw new ServiceException("improper extension of a file", ERR_SALE_109);
		}

		return example.substring(sepPos + separator.length());
	}

	private String getNameWoExtension(String fileName) {
		String example = StringUtils.cleanPath(fileName);
		String separator = ".";
		int sepPos = example.lastIndexOf(separator);
		if (sepPos == -1) {
			throw new ServiceException("improper extension of a file", ERR_SALE_109);
		}

		return example.substring(0, sepPos);
	}

	private CustomerDocumentsDao updateCustomerDocument(String docPath, String txnId, String docType,
			CustomerDao customer, String fileType, String tempUUID) {

		Boolean onlineUploadStatus = true;
		try {
			uploadFileToOnlineBucket(docPath);
		} catch (Exception e) {
			log.error("Upload File to online bucket failed. Error Message:- " + e.getMessage());
			onlineUploadStatus = false;
		}

		CustomerDocumentsDao cd = new CustomerDocumentsDao();
		if (tempUUID != null)
			cd.setId(tempUUID);
		else
			cd.setId(UUID.randomUUID().toString());
		cd.setDocumentPath(docPath);
		cd.setCustomer(customer);
		// proper sales txn or temp file
		if (txnId != null || tempUUID != null)
			cd.setLocationCode(CommonUtil.getStoreCode());
		cd.setTxnId(txnId);
		cd.setDocumentType(docType);
		cd.setFileType(fileType);
		cd.setIsSynced(onlineUploadStatus);
		return customerDocumentRepo.save(cd);
	}

	private void uploadFileToOnlineBucket(String documentPath) {
		integrationService.uploadFileToOnlineBucket(documentPath);
	}

	private void validateInput(String txnId, Integer customerId, String docTypeStr, String extension,
			MultipartFile file) {

		Set<String> fileExtensionsAllowed;

		if (docTypeStr.equalsIgnoreCase(UploadFileDocTypeEnum.CUSTOMER_WORKFLOW.name())) {
			fileExtensionsAllowed = FileExtensionEnum.allowedExtensionsForCustomerDocumentUpload().stream()
					.map(String::toUpperCase).collect(Collectors.toSet());
			if (file.getSize() / (1024 * 1024) > 2) {
				throw new ServiceException("Uploaded document needs to be less than equal to 2 MB", "ERR-SALE-310");
			}
		} else {
			fileExtensionsAllowed = FileExtensionEnum.allowedExtensionsForSalesFileUpload().stream()
					.map(String::toUpperCase).collect(Collectors.toSet());
		}
		if (!(fileExtensionsAllowed.contains(extension.toUpperCase())))
			throw new ServiceException("extension is not allowed", ERR_SALE_109, "provided extension '." + extension
					+ "' is not applicable for file upload. Allowed: " + fileExtensionsAllowed);

		UploadFileDocTypeEnum docType = UploadFileDocTypeEnum.valueOf(docTypeStr);

		String remarks = null;

		// if customer & txn id there, else if CM/ GEP txn id not there, throw err
		remarks = txnIdAndCustomerCheck(txnId, customerId, docType, remarks);

		if (remarks != null)
			throw new ServiceException("Invalid input based on document type.", ERR_SALE_109, remarks);

	}

	private String txnIdAndCustomerCheck(String txnId, Integer customerId, UploadFileDocTypeEnum docType,
			String remarks) {

		if (docType.isTxnIdRequiredForUpload()) {
			if (org.apache.commons.lang.StringUtils.isBlank(txnId))
				remarks = "txnId is required for this document type.";
		} else if (org.apache.commons.lang.StringUtils.isNotBlank(txnId) || customerId != null) {
			// if txn id not blank or customer id not null
			remarks = "temp file can't be attached to txnId and customerId.";
		}
		return remarks;

	}

	private String getLocationWIthCheck(String locationCode) {

		if (CommonUtil.isAStoreUser() && locationCode == null)
			locationCode = CommonUtil.getStoreCode();
		else if (locationCode == null)
			throw new ServiceException("Location code mandatory", "ERR-SALE-048",
					"location code is mandatory for corporate user");
		return locationCode;
	}

	private String getFileNameFromCustomerDocument(CustomerDocumentsDao cd) {

		String docPath = cd.getDocumentPath();
		int lastIndex = docPath.lastIndexOf(FILE_FORWARD_SEPARATOR);
		return docPath.substring(lastIndex + 1);
	}

	@Override
	public ListResponse<FileDetailsDto> listFileIds(String txnId, Integer customerId, String documentType,
			String fileType, String locationCode) {

		locationCode = getLocationWIthCheck(locationCode);

		// if store user in POSS and location input is not same as store location, then
		// have to call EPOSS. (allowed only for documentType: CN_WORKFLOW)
		if (!CommonUtil.isEpossApp() && UploadFileDocTypeEnum.CN_WORKFLOW.name().equals(documentType)
				&& BooleanUtils.isTrue(CommonUtil.isAStoreUser()) && !CommonUtil.getStoreCode().equals(locationCode)) {
			// customerId not taken
			return callEpossForList(txnId, documentType, fileType, locationCode);
		} else if (CommonUtil.isEpossApp() && !UploadFileDocTypeEnum.CN_WORKFLOW.name().equals(documentType)
				&& BooleanUtils.isTrue(CommonUtil.isAStoreUser()) && !CommonUtil.getStoreCode().equals(locationCode)) {
			locationCode = CommonUtil.getStoreCode();
		}

		List<CustomerDocumentsDao> customerDocs = listAllCustomerDocs(txnId, customerId, documentType, fileType,
				locationCode);

		return new ListResponse<>(
				customerDocs.stream().map(cd -> new FileDetailsDto(cd.getId(), getFileNameFromCustomerDocument(cd)))
						.collect(Collectors.toList()));
	}

	/**
	 * @param txnId
	 * @param documentType
	 * @param fileType
	 * @param locationCode
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private ListResponse<FileDetailsDto> callEpossForList(String txnId, String documentType, String fileType,
			String locationCode) {
		return epossCallService.callEposs(HttpMethod.GET, "api/sales/v2/files/list",
				Map.of("id", txnId, "documentType", documentType, "fileType", fileType, LOCATION_CODE, locationCode),
				null, ListResponse.class);
	}

	@Override
	public boolean isAnyFileUploaded(String id, Integer customerId, String documentType, String fileType) {

		return !listAllCustomerDocs(id, customerId, documentType, fileType, CommonUtil.getStoreCode()).isEmpty();
	}

	private List<CustomerDocumentsDao> listAllCustomerDocs(String id, Integer customerId, String documentType,
			String fileType, String locationCode) {

		UploadFileDocTypeEnum docType = UploadFileDocTypeEnum.valueOf(documentType);
		txnIdAndCustomerCheckForList(id, docType);
		if (docType != UploadFileDocTypeEnum.CUSTOMER_WORKFLOW && docType != UploadFileDocTypeEnum.CUSTOMER)
			customerId = null;

		CustomerDao customer = getCustomerId(customerId, locationCode);
		String customerMasterId = null;
		if (customer != null)
			customerMasterId = customer.getId();

		List<CustomerDocumentsDao> cds;
		if (id != null) {
			cds = customerDocumentRepo.findAllByTxnIdAndLocationCodeAndDocumentTypeAndFileTypeAndIsActiveTrue(id,
					locationCode, documentType, fileType);
		} else {

			cds = customerDocumentRepo.findAllByCustomerIdAndDocumentTypeAndFileTypeAndIsActiveTrue(customerMasterId,
					documentType, fileType);
		}
		// sorting by created time ascending as otherwise it will not be in order
		Collections.sort(cds);
		return cds;
	}

	private void txnIdAndCustomerCheckForList(String txnId, UploadFileDocTypeEnum docType) {

		String remarks = null;
		if (docType.isTxnIdRequiredForList() && org.apache.commons.lang.StringUtils.isBlank(txnId))
			remarks = "txnId is required for this document type.";

		if (remarks != null)
			throw new ServiceException("Invalid input based on document type.", ERR_SALE_109, remarks);

	}

	@Override
	public PresignedDto getPresignedUrlById(String id, String locationCode) {

		locationCode = getLocationWIthCheck(locationCode);

		// if store user in POSS and location input is not same as store location, then
		// have to call EPOSS.
		if (!CommonUtil.isEpossApp() && BooleanUtils.isTrue(CommonUtil.isAStoreUser())
				&& !CommonUtil.getStoreCode().equals(locationCode)) {
			return epossCallService.callEposs(HttpMethod.GET, "api/sales/v2/files/" + id + "/presigned-url",
					Map.of(LOCATION_CODE, locationCode), null, PresignedDto.class);
		}

		CustomerDocumentsDao cd = getCustomerDocByIdAndLocationCode(id, locationCode);

		if (!cd.getIsSynced())
			throw new ServiceException("File is not synced to online storage.", "ERR-SALE-244");

		String docPath = cd.getDocumentPath();
		if (docPath.charAt(0) == '/')
			docPath = docPath.substring(1);

		Integer firstSlashIndex = docPath.indexOf(FILE_FORWARD_SEPARATOR);
		String bucketName = docPath.substring(0, firstSlashIndex);
		String key = docPath.substring(firstSlashIndex + 1);

		DocumentBucketEnum bucketEnum = DocumentBucketEnum.getBucketByName(bucketName);

		PresignedUrlDto dto = integrationService.getPresignedUrlOfObjects(Set.of(key), bucketEnum.name());
		return new PresignedDto(dto.getObj().get(key), dto.getExpTime());
	}

	@Override
	public ResponseEntity<Resource> getFileById(String id, String locationCode) {

		locationCode = getLocationWIthCheck(locationCode);

		// if store user in POSS and location input is not same as store location, then
		// have to call EPOSS.

		CustomerDocumentDto cd = getCustomerDocDtoByIdAndLocationCode(id, locationCode);

		String path = fileBasePath + cd.getDocumentPath();
		File localFIle = new File(path);

		log.debug("FileName: {}\nMimeType: {}", localFIle.getName(),
				FileUtil.getMimeTypeByFileName(localFIle.getName()));

		MediaType mt = getMediaTypeDefaultOrPdfByName(localFIle);

		// if exist in local, return file
		if (localFIle.exists()) {

			log.trace("Avalable in local. Fetching from: {}", path);
			// return file from local as available
			return FileUtil.getFileResourceFromLocalDrive(path, mt);

		} else if (cd.getIsSynced()) {

			log.trace("Not avalable in local. Fetching from online bucket: {}", path);
			String docPath = cd.getDocumentPath();

			// get file from online bucket & copy to server
			Response res = integrationService.getFileInByteArrayResponse(docPath);
			int status = res.status();

			if (status == HttpStatus.OK.value()) {

				// return content from inter-service response
				try {

					ByteArrayResource bar = FileUtil.convertResoruceFromInputStream(res.body().asInputStream());
					return ResponseEntity.ok()
							.header(HttpHeaders.CONTENT_DISPOSITION,
									"attachment; filename=" + FileUtil.getFileNameByPath(docPath))
							.contentType(mt).body(bar);

				} catch (IOException e) {

					throw new ServiceException("File operation failed", "ERR-CORE-045", e);
				}

			} else {

				throwError(res);
			}
		}

		throw new ServiceException("File Not found in local, not synced also.", ERR_CORE_048,
				"File is not found in local server & not synced also.");

		// if not there in local, not synced
	}

	/**
	 * @param id
	 * @param locationCode
	 * @return
	 */
	private CustomerDocumentDto callEpossToGetFileDetails(String id, String locationCode) {
		return epossCallService.callEposs(HttpMethod.GET, "api/sales/v2/files/" + id + "/document-detail",
				Map.of(LOCATION_CODE, locationCode), null, CustomerDocumentDto.class);
	}

	private MediaType getMediaTypeDefaultOrPdfByName(File localFIle) {
		MediaType mt = MediaType.APPLICATION_OCTET_STREAM;
		if (FileUtil.getMimeTypeByFileName(localFIle.getName()).equals(MediaType.APPLICATION_PDF_VALUE))
			mt = MediaType.APPLICATION_PDF;
		return mt;
	}

	private CustomerDocumentsDao getCustomerDocByIdAndLocationCode(String id, String locationCode) {

		// @formatter:off
		return customerDocumentRepo.findByIdAndLocationCodeAndIsActiveTrue(id, locationCode)
				.orElseThrow(() -> new ServiceException("File not found.", ERR_CORE_048, "Record not found for provided input. Id: " + id));
		// @formatter:on
	}

	@Override
	public CustomerDocumentDto getCustomerDocDtoByIdAndLocationCode(String id, String locationCode) {

		locationCode = getLocationWIthCheck(locationCode);

		if (!CommonUtil.isEpossApp() && BooleanUtils.isTrue(CommonUtil.isAStoreUser())
				&& !CommonUtil.getStoreCode().equals(locationCode)) {
			return callEpossToGetFileDetails(id, locationCode);
		}

		CustomerDocumentsDao cdDao = getCustomerDocByIdAndLocationCode(id, locationCode);
		CustomerDocumentDto customerDocumentDto = MapperUtil.mapObjToClass(cdDao, CustomerDocumentDto.class);
		customerDocumentDto.setCustomerMasterId(cdDao.getCustomer() != null ? cdDao.getCustomer().getId() : null);

		return customerDocumentDto;
	}

	@Override
	@Transactional
	public void deleteFileById(String id) {

		CustomerDocumentsDao cd = getCustomerDocByIdAndLocationCode(id, CommonUtil.getStoreCode());

		String path = fileBasePath + cd.getDocumentPath();
		File localFIle = new File(path);

		// local operation
		if (localFIle.exists()) {
			log.trace("Avalable in local. Deleting");
			try {
				Files.delete(localFIle.toPath());
			} catch (IOException e) {
				log.trace("Error while deleting from local: {}", e);
			}
		} else {
			log.trace("Not Avalable in local.");
		}

		// online file storage operation
		if (cd.getIsSynced()) {
			integrationService.deleteFileByPath(cd.getDocumentPath());
		}

		cd.setIsActive(false);
		cd.setSrcSyncId(cd.getSrcSyncId() + 1) ;
		cd = customerDocumentRepo.save(cd);
		SyncStagingDto syncDto = syncStaggingCustomerDocument(cd, SalesOperationCode.CUSTOMER_DOCUMENT_CUS);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			salesSyncDataService.publishSalesMessagesToQueue(syncDto);

	}

	private CustomerDocumentsDao getActiveCustomerDocumentRecord(String txnId, Integer customerId, String documentType,
			String fileType, String locationCode) {

		CustomerDocumentsDao cd;
		if (txnId != null) {
			cd = customerDocumentRepo.findByTxnIdAndLocationCodeAndDocumentTypeAndFileTypeAndIsActiveTrue(txnId,
					locationCode, documentType, fileType);
		} else {
			CustomerDao customer = getCustomerId(customerId, locationCode);
			String customerMasterId = null;
			if (customer != null)
				customerMasterId = customer.getId();

			cd = customerDocumentRepo.findByCustomerIdAndDocumentTypeAndFileTypeAndIsActiveTrue(customerMasterId,
					documentType, fileType);
		}

		return cd;
	}

	public boolean isDocumentExist(String txnId, Integer customerId, String documentType, String fileType,
			String locationCode) {

		boolean isExist = false;

		CustomerDocumentsDao cd = getActiveCustomerDocumentRecord(txnId, customerId, documentType, fileType,
				locationCode);

		if (cd != null)
			isExist = true;

		return isExist;

	}

	private void throwError(Response res) {
		JsonNode jsonNode = JsonUtils.convertToJsonNode(res);

		String errCode = jsonNode.get(CommonConstants.CODE).asText();
		if (errCode != null && errCode.equals("ERR-INT-004")) {
			log.debug("File doesn't exist in online bucket, deactivating customer document, generating again");
			throw new ServiceException("Not available in oneline bucket also.", ERR_CORE_048);
		}

		// throw error
		if (jsonNode.get(CommonConstants.CODE) != null && jsonNode.get(CommonConstants.MESSAGE) != null)
			JsonUtils.throwServiceException(jsonNode);
		else
			throw new ServiceException("Online storage operation failed.", "ERR-INT-003", jsonNode);
	}

	// ========================================== Data Sync Implementation
	// ==========================================

	@Override
	public String uploadFile(String id, Integer customerId, String documentType, String fileType, MultipartFile file) {

		PublishResponse response = fileService.uploadFileTransactional(id, customerId, documentType, fileType, file);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName) && response.getSyncStagingDto() != null) {
			salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<String>() {
		});
	}

	@Override
	public String updateTempFile(String id, Integer customerId, String documentType, String fileType, String tempId) {
		PublishResponse response = fileService.updateTempFileTransactional(id, customerId, documentType, fileType,
				tempId);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName) && response.getSyncStagingDto() != null) {
			salesSyncDataService.publishSalesMessagesToQueue(response.getSyncStagingDto());
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<String>() {
		});
	}

	private SyncStagingDto syncStaggingCustomerDocument(CustomerDocumentsDao customerDocument, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		if (customerDocument != null) {
			List<CustomerDocumentSyncDto> customerDocList = List.of(new CustomerDocumentSyncDto(customerDocument));
			syncDataList.add(DataSyncUtil.createSyncData(customerDocList, 0));
		}
		MessageRequest customerDocumentMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation,
				destinations, MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto customerDocumentStagingDto = new SyncStagingDto();
		customerDocumentStagingDto.setMessageRequest(customerDocumentMsgRequest);
		String customerDocumentMsgRqst = MapperUtil.getJsonString(customerDocumentMsgRequest);
		SyncStaging customerDocumentSyncStaging = new SyncStaging();
		customerDocumentSyncStaging.setMessage(customerDocumentMsgRqst);
		customerDocumentSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		customerDocumentSyncStaging = saleSyncStagingRepository.save(customerDocumentSyncStaging);
		customerDocumentStagingDto.setId(customerDocumentSyncStaging.getId());
		return customerDocumentStagingDto;
	}

	@Override
	public void updateCustomerDocumentStatus(String id) {

		Optional<CustomerDocumentsDao> customerDocumentsDaos = customerDocumentRepo.findById(id);
		if (!customerDocumentsDaos.isPresent())
			return;
		CustomerDocumentsDao customerDocumentsDao = customerDocumentsDaos.get();
		WorkflowProcessGetResponseDto workflowProcessGetResponseDto = epossCallService
				.getProcessDetails(customerDocumentsDao.getProcessId(), WorkflowTypeEnum.CUSTOMER_UPLOAD_DOCUMENT);
		if (WorkflowProcessStatusEnum.APPROVED.name().equals(workflowProcessGetResponseDto.getApprovalStatus())) {
			customerDocumentsDao.setDocumentType(UploadFileDocTypeEnum.CUSTOMER.name());
			customerDocumentsDao.setStatus(CustomerDocumentStatusEnum.APPROVED.name());
			customerDocumentRepo.save(customerDocumentsDao);
		} else {
			throw new ServiceException("Request is not approved", "ERR-SALE-098",
					"Request status should be: " + WorkflowProcessStatusEnum.APPROVED.name() + ", found: "
							+ workflowProcessGetResponseDto.getApprovalStatus());
		}
	}

}
