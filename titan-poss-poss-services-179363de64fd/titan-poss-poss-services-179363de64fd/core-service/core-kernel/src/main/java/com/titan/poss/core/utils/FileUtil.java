/**
 * 
 */
package com.titan.poss.core.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigInteger;
import java.net.MalformedURLException;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import org.apache.commons.codec.binary.Hex;
import javax.activation.MimetypesFileTypeMap;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.enums.CSVReaderNullFieldIndicator;
import com.opencsv.exceptions.CsvException;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.exception.ServiceException;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree
 * @version 1.0
 */

@Slf4j
public final class FileUtil {

	private FileUtil() {
		throw new IllegalStateException("FileUtil class");
	}

	private static final Logger LOGGER = LoggerFactory.getLogger(FileUtil.class);

	public static final String FILE_PATH_SEPARATOR = "\\";

	public static final String FILE_FORWARD_SEPARATOR = "/";
	public static final char FILE_FORWARD_SEPARATOR_CHAR = '/';

	public static final String FAILED = "FAILED";

	private static final String ERR_MSG = "Error while reading the file";

	private static final String ERR_CORE_029 = "ERR-CORE-029";
	
	private static final String ERR_CORE_058 = "ERR-CORE-058";

	/**
	 * Return file content in String format
	 * 
	 * @param filePath          directory path
	 * @param keyFileName       file name
	 * @param isNewLineRequired if text for new line needed to be in new line in
	 *                          return, else in 1 line all
	 * @return String
	 */
	public static String getFileContentInStringFormat(String filePath, String keyFileName, Boolean isNewLineRequired) {

		byte[] fileContent = getFileContentInByteArrayFormat(filePath, keyFileName);
		return (BooleanUtils.isTrue(isNewLineRequired)) ? new String(fileContent)
				: new String(fileContent).replace("\r", "").replace("\n", "");

	}

	public static String generateCheckSum(MultipartFile reqFile) {
		BigInteger j = BigInteger.ZERO;
		try {
			byte[] key = reqFile.getBytes();
			MessageDigest md = MessageDigest.getInstance("SHA-1");
			byte[] hash = md.digest(key);
			for (int i = 0; i < hash.length; i++) {
				j = new BigInteger(1, new byte[] { hash[i] }).add(j);
			}
		} catch (Exception e) {
			throw new ServiceException("Error While Generating the CheckSum of the File", "ERR_CORE_029");
		}
		return j.toString();

	}
	
	public static String generateCheckSumService(MultipartFile reqFile) {
		//BigInteger j = BigInteger.ZERO;
		String h;
		
		try {
			byte[] key = reqFile.getBytes();
			MessageDigest md = MessageDigest.getInstance("SHA-1");
			byte[] hash = md.digest(key);
			h = Hex.encodeHexString(hash);
		} catch (Exception e) {
			throw new ServiceException("Error While Generating the CheckSum of the File", "ERR_CORE_029");
		}
		return h;

	}


	/**
	 * Return file content in byte[] format
	 * 
	 * @param filePath directory path
	 * @param fileName file name
	 * @return byte[]
	 */
	public static byte[] getFileContentInByteArrayFormat(String filePath, String fileName) {

		File file = new File(filePath, fileName);
		checkFIleExistAndPermission(file);

		return convertFileToByteArray(file);
	}

	public static void createDirectoryIfNotExist(File directory) {
		if (!directory.exists()) {
			directory.mkdirs();
		}
	}

	public static void deleteDirectory(File directory) {
		try {
			FileUtils.deleteDirectory(directory);
		} catch (IOException e) {
			throw new ServiceException("File operation failed.", "ERR-CORE-049");
		}
	}

	// NOT TESTED
	public static File convertMultiPartToFile(MultipartFile file) throws IOException {

		File convFile = new File(file.getOriginalFilename());
		try (final FileOutputStream fos = new FileOutputStream(convFile)) {
			fos.write(file.getBytes());
		}
		return convFile;
	}

	public static Resource findFileResourceFromPath(String path) {
		Resource resource = null;
		try {
			resource = FileUtil.getResourceByFilePath(path);
		} catch (MalformedURLException e) {
			log.debug("Malformed Url:\n{}", e);
		}
		return resource;
	}

	public static Resource getResourceByFilePath(String filePath) throws MalformedURLException {

		return new UrlResource(Paths.get(filePath).toUri());
	}

	public static void saveContentToFileFromByteArray(String filePath, byte[] content) throws IOException {

		FileUtils.writeByteArrayToFile(new File(filePath), content);
	}

	public static File getFileByPath(String filePath) {

		File file = new File(filePath);
		checkFIleExistAndPermission(file);

		return file;
	}

	public static void copyFile(String originalPath, String newPath) throws IOException {

		File fileOriginal = new File(originalPath);

		String newDirectory = newPath.substring(0, newPath.lastIndexOf('/'));
		File newFileDir = new File(newDirectory);
		createDirectoryIfNotExist(newFileDir);

		Files.copy(fileOriginal.toPath(), Paths.get(newPath), StandardCopyOption.REPLACE_EXISTING);

	}

	public static ResponseEntity<Resource> getFileResourceFromLocalDrive(String path, MediaType mediaType) {

		Resource resource = FileUtil.findFileResourceFromPath(path);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + FileUtil.getFileNameByPath(path))
				.contentType(mediaType).body(resource);
	}

	public static String getFileNameByPath(String filePath) {

		int folderPathEndIndex = filePath.lastIndexOf(FILE_FORWARD_SEPARATOR);
		if (folderPathEndIndex == -1)
			return null;
		return filePath.substring(folderPathEndIndex + 1, filePath.length());
	}

	public static String getMimeTypeByFileName(String fileName) {

		String mimeType = URLConnection.guessContentTypeFromName(fileName);
		if (mimeType == null)
			mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
		return mimeType;
	}

	// NOT TESTED
	public static String getFileExtensionByPathOrName(String filePath) {

		int folderPathEndIndex = filePath.lastIndexOf('.');
		if (folderPathEndIndex == -1)
			return null;
		return filePath.substring(folderPathEndIndex + 1, filePath.length());
	}

	private static void checkFIleExistAndPermission(File file) {
		if (!file.exists() || !file.isFile() || !file.canRead())
			throw new ServiceException("File doesn't exist or not readable", "ERR-CORE-020", file);
	}

	public static byte[] convertFileToByteArray(File file) {

		byte[] fileContent = new byte[0];
		try {
			fileContent = Files.readAllBytes(file.toPath());
		} catch (IOException e) {
			throw new ServiceException("File doesn't exist or not readable", "ERR-CORE-020", e);
		}
		return fileContent;
	}

	public static ByteArrayResource convertResoruceFromInputStream(InputStream is) throws IOException {

		byte[] file = is.readAllBytes();
		return new ByteArrayResource(file);
	}

	/**
	 * Validates the file format
	 * 
	 * @param file
	 * @param fileGroup - can be FIR,MER,STN,INVOICE
	 * @return Validation remarks
	 */
	public static String validateFile(MultipartFile file, String fileGroup, String fileExtensionsAllowed,
			String fileTypesAllowed, Integer expectedNoOfColumns) {
		boolean isValid = true;
		String remarks = null;
		try {
			if (fileGroup != null && fileGroup.equalsIgnoreCase(FileGroupEnum.GHS_BANK_DEPOSIT.name())) {
				isValid = Pattern.matches(RegExConstants.FILE_NAME_REGEX_GHS, file.getOriginalFilename());
			} else if (fileGroup != null && fileGroup.equalsIgnoreCase(FileGroupEnum.SERVICE_POSS_BANK_DEPOSIT.name())) {
				isValid = Pattern.matches(RegExConstants.FILE_NAME_REGEX_GHS, file.getOriginalFilename());
			} else {
				isValid = Pattern.matches(RegExConstants.FILE_NAME_REGEX, file.getOriginalFilename());
			}
			if (!isValid) {
				remarks = "Invalid File Name";
			}
			// Validates fileExtension(Exclude for Invoice file)
			Optional<String> fileExtension = getFileExtensionByFileName(file.getOriginalFilename());
			if (!fileExtension.isPresent()) {
				remarks = "No File Extension Found";
			} else {
				if (fileGroup != null && !fileExtensionsAllowed.equalsIgnoreCase(fileExtension.get())) {
					remarks = "Invalid File Extension:" + fileExtension.get();
				}
			}
			if (file.isEmpty() && file.getSize() < 0) {
				remarks = "File should not be empty:" + file.getOriginalFilename();
			}
			// Validates fileType/mimeType - using this method since Tika library consumed
			// more memory
			String fileType = new MimetypesFileTypeMap().getContentType(file.getOriginalFilename());

			LOGGER.info("file Type - {},{}", file.getOriginalFilename(), fileType);
			if (StringUtils.isBlank(fileType)
					|| (StringUtils.isNotBlank(fileType) && !fileTypesAllowed.equalsIgnoreCase(fileType))) {
				remarks = "Invalid File Type:" + fileType;
			}
			if (expectedNoOfColumns != null && (!expectedNoOfColumns.equals(getNoOfColumns(file)))) {
				remarks = "Invalid Number of columns";
			}
		} catch (Exception e) {
			remarks = "Exception occured while validating the File";
		}
		LOGGER.info("File validation remarks - {}, {}", file.getOriginalFilename(), remarks);
		return remarks;
	}

	private static Optional<String> getFileExtensionByFileName(String fileName) {
		return Optional.ofNullable(fileName).filter(f -> f.contains("."))
				.map(f -> f.substring(fileName.lastIndexOf('.') + 1));
	}

	private static Integer getNoOfColumns(MultipartFile file) {
		byte[] bytes = null;
		try {
			bytes = file.getBytes();
		} catch (IOException e) {
			throw new ServiceException(ERR_MSG, ERR_CORE_029, e);
		}
		String completeData = new String(bytes);
		String[] rows = completeData.split("\n");
		String[] columns = rows[0].split(",");

		return columns.length;
	}

	/**
	 * reads the csv file
	 * 
	 * @param file
	 * @param delimitter - , |
	 * @return file Content in String[] format
	 * @throws CsvException
	 * @throws IOException
	 */
	public static List<String[]> readCSVFile(MultipartFile file, char delimitter) {
		BufferedReader fileReader;

		try {
			fileReader = new BufferedReader(new InputStreamReader(file.getInputStream()));
			CSVParser parser = new CSVParserBuilder().withSeparator(delimitter)
					.withFieldAsNull(CSVReaderNullFieldIndicator.BOTH).withIgnoreLeadingWhiteSpace(true)
					.withIgnoreQuotations(false).withStrictQuotes(false).build();
			CSVReader csvReader = new CSVReaderBuilder(fileReader).withSkipLines(1).withCSVParser(parser).build();
			return csvReader.readAll();
		} catch (IOException | CsvException e) {
			throw new ServiceException(ERR_MSG, ERR_CORE_029, e);
		}
	}

	public static List<String[]> readFile(File file, char delimitter, Integer noOfLinesToSkip) {

		try (FileReader filereader = new FileReader(file)) {
			CSVParser parser = new CSVParserBuilder().withSeparator(delimitter)
					.withFieldAsNull(CSVReaderNullFieldIndicator.BOTH).withIgnoreLeadingWhiteSpace(true)
					.withIgnoreQuotations(false).withStrictQuotes(false).build();
			CSVReader csvReader = new CSVReaderBuilder(filereader).withSkipLines(noOfLinesToSkip).withCSVParser(parser)
					.build();
			return csvReader.readAll();
		} catch (IOException | CsvException e) {
			throw new ServiceException(ERR_MSG, ERR_CORE_029, e);
		}
	}

	/**
	 * validates file
	 * 
	 * @param fileExt
	 * @param fileType
	 * @return map of status of file validation
	 */
	public static Map<String, String> validateReqFile(MultipartFile reqFile, String fileGroup, String fileExt,
			String fileType, Integer expectedNoOfColumns) {
		Map<String, String> fileStatus = new HashMap<>();
		String validationRemarks = FileUtil.validateFile(reqFile, fileGroup, fileExt, fileType, expectedNoOfColumns);
		LOGGER.info("validationRemarks - {}", validationRemarks);
		if (validationRemarks != null) {
			fileStatus.put(FAILED, validationRemarks);
			return fileStatus;
		}
		return fileStatus;
	}

	
	/**
	 * reads the csv file with headers
	 * 
	 * @param file
	 * @param delimitter - , |
	 * @return file Content in String[] format
	 * @throws CsvException
	 * @throws IOException
	 */
	public static List<String[]> readCSVFileHeader(MultipartFile file, char delimitter) {
		BufferedReader fileReader;

		try {
			fileReader = new BufferedReader(new InputStreamReader(file.getInputStream()));
			CSVParser parser = new CSVParserBuilder().withSeparator(delimitter)
					.withFieldAsNull(CSVReaderNullFieldIndicator.BOTH).withIgnoreLeadingWhiteSpace(true)
					.withIgnoreQuotations(false).withStrictQuotes(false).build();
			CSVReader csvReader = new CSVReaderBuilder(fileReader).withCSVParser(parser).build();
			return csvReader.readAll();
		} catch (IOException | CsvException e) {
			throw new ServiceException(ERR_MSG, ERR_CORE_029, e);
		}
	}

	public static void validateHeaderColumns(MultipartFile file) {
		BufferedReader fileReader;
		try {
			fileReader = new BufferedReader(new InputStreamReader(file.getInputStream()));
			CSVReader csvReader = new CSVReaderBuilder(fileReader)
                    .build();
			String[] headers = csvReader.readNext();
		      List<String> headerList = Arrays.asList(headers);  

			List<String> expectedHeaders = new ArrayList<>(Arrays.asList(new String[]{"Complexitycode", "Pricegroup", "MakingChargesPerUnit", "Makingchargespergram", "IsActive","Wastagepercentage","MakingChargePercentage"}));
		
			if (!(expectedHeaders.equals(headerList)))
				throw new ServiceException("Please Interchange the columns of complexity and price group" , ERR_CORE_058);
			
			//return csvReader.readAll();
		} catch (IOException | CsvException e) {
			throw new ServiceException(ERR_MSG, ERR_CORE_029, e);
		}
	}

}
