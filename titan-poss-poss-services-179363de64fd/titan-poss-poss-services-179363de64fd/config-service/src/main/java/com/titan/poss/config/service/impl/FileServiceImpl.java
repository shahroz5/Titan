package com.titan.poss.config.service.impl;

import static com.titan.poss.core.utils.FileUtil.FILE_FORWARD_SEPARATOR;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.titan.poss.config.dto.response.FileUploadResponseDto;
import com.titan.poss.config.service.FileService;
import com.titan.poss.config.service.IntegrationService;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.OTPUtil;

import feign.Response;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FileServiceImpl implements FileService {

	@Value("${docs.file.source.path}")
	String fileBasePath;

	public static final Integer NUMBER_APPEND_LENGTH = 6;

	@Autowired
	private IntegrationService integrationService;

	@Override
	public FileUploadResponseDto uploadFile(String docType, String fileType, MultipartFile file) {
		String extension = getFileExtension(file);
		validateInput(docType, extension, file);

		String tempUUID = UUID.randomUUID().toString();
		FileUploadResponseDto fileUploadResponseDto = new FileUploadResponseDto();
		String relativePath = generateFilePath(docType, file.getOriginalFilename(), extension, tempUUID, false,fileUploadResponseDto);
		saveAndGenerateFilePath(relativePath, file);

		try {
			uploadFileToOnlineBucket(relativePath);
		} catch (Exception e) {
			log.error("Upload File to online bucket failed. Error Message:- " + e.getMessage());
		}
		
		
		fileUploadResponseDto.setFileId(tempUUID);
		
		return fileUploadResponseDto;
	}

	private void uploadFileToOnlineBucket(String relativePath) {
		integrationService.uploadFileToOnlineBucket(relativePath);

	}

	private String saveAndGenerateFilePath(String relativePath, MultipartFile file) {

		Path path = Paths.get(fileBasePath + relativePath);
		// copying file to the generated path
		try {
			Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new ServiceException("Error in file upload", "ERR-SALE-108", e);
		}

		return relativePath;

	}

	private String generateFilePath(String docType, String fileOriginalName, String extension, String tempUUID,
			boolean isUpdate, FileUploadResponseDto fileUploadResponseDto) {
	

		StringBuilder finalPathToBeAppended = new StringBuilder();
		StringBuilder fileName = generateFileName(fileOriginalName, extension, isUpdate);
		fileUploadResponseDto.setFileName(fileName.toString());

		finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append("discount-workflow");
		finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append(tempUUID);

		File directory = new File(fileBasePath + finalPathToBeAppended.toString());

		if (!directory.exists()) {
			directory.mkdirs();
		}

		finalPathToBeAppended.append(FILE_FORWARD_SEPARATOR).append(fileName.toString());

		return finalPathToBeAppended.toString();
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

	private Object getRandomNo() {
		return OTPUtil.randomNumeric(NUMBER_APPEND_LENGTH);
	}

	private String getNameWoExtension(String fileOriginalName) {
		String example = StringUtils.cleanPath(fileOriginalName);
		String separator = ".";
		int sepPos = example.lastIndexOf(separator);
		if (sepPos == -1) {
			throw new ServiceException("improper extension of a file", "ERR-SALE-109");
		}

		return example.substring(0, sepPos);
	}

	private String getFileExtension(MultipartFile file) {
		String example = StringUtils.cleanPath(file.getOriginalFilename());
		String separator = ".";
		int sepPos = example.lastIndexOf(separator);
		if (sepPos == -1) {
			throw new ServiceException("improper extension of a file", "ERR-SALE-109");
		}

		return example.substring(sepPos + separator.length());
	}

	private void validateInput(String docTypeStr, String extension, MultipartFile file) {

		Set<String> fileExtensionsAllowed;

		fileExtensionsAllowed = FileExtensionEnum.allowedExtensionsForDiscountWorkflowDocumentUpload().stream()
				.map(String::toUpperCase).collect(Collectors.toSet());

		if (!(fileExtensionsAllowed.contains(extension.toUpperCase())))
			throw new ServiceException("extension is not allowed", "ERR-SALE-109", "provided extension '." + extension
					+ "' is not applicable for file upload. Allowed: " + fileExtensionsAllowed);

	}

	@Override
	public ResponseEntity<Resource> getFileById(String id, String fileName) {
		String path = fileBasePath + "/discount-workflow/"+id+"/"+fileName;
		File localFIle = new File(path);
		
		log.debug("FileName: {}\nMimeType: {}", localFIle.getName(),
				FileUtil.getMimeTypeByFileName(localFIle.getName()));

		MediaType mt = getMediaTypeDefaultOrPdfByName(localFIle);
		// if exist in local, return file
		if (localFIle.exists()) {

			log.trace("Avalable in local. Fetching from: {}", path);
			// return file from local as available
			return FileUtil.getFileResourceFromLocalDrive(path, mt);

		} else {

			log.trace("Not avalable in local. Fetching from online bucket: {}", path);
			

			// get file from online bucket & copy to server
			Response res = integrationService.getFileInByteArrayResponse(path);
			int status = res.status();
			if (status == HttpStatus.OK.value()) {

				// return content from inter-service response
				try {

					ByteArrayResource bar = FileUtil.convertResoruceFromInputStream(res.body().asInputStream());
					return ResponseEntity.ok()
							.header(HttpHeaders.CONTENT_DISPOSITION,
									"inline; filename=" + FileUtil.getFileNameByPath(path))
							.contentType(mt).body(bar);

				} catch (IOException e) {

					throw new ServiceException("File operation failed", "ERR-CORE-045", e);
				}

			} else {

				throwError(res);
			}
		}

		throw new ServiceException("File Not found in local, not synced also.", "ERR-CORE-048",
				"File is not found in local server & not synced also.");

		// if not there in local, not synced
	}

	private void throwError(Response res) {
		JsonNode jsonNode = JsonUtils.convertToJsonNode(res);

		String errCode = jsonNode.get(CommonConstants.CODE).asText();
		if (errCode != null && errCode.equals("ERR-INT-004")) {
			log.debug("File doesn't exist in online bucket, deactivating customer document, generating again");
			throw new ServiceException("Not available in oneline bucket also.", "ERR-CORE-048");
		}

		// throw error
		if (jsonNode.get(CommonConstants.CODE) != null && jsonNode.get(CommonConstants.MESSAGE) != null)
			JsonUtils.throwServiceException(jsonNode);
		else
			throw new ServiceException("Online storage operation failed.", "ERR-INT-003", jsonNode);
		
	}

	private MediaType getMediaTypeDefaultOrPdfByName(File localFIle) {
		MediaType mt = MediaType.APPLICATION_OCTET_STREAM;
		if (FileUtil.getMimeTypeByFileName(localFIle.getName()).equals(MediaType.APPLICATION_PDF_VALUE))
			mt = MediaType.APPLICATION_PDF;
		return mt;
	}

}
