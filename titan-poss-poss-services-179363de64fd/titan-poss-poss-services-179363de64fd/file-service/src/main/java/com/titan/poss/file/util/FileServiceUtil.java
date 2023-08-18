/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import javax.activation.MimetypesFileTypeMap;

import org.apache.commons.lang.StringUtils;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.exception.ServiceException;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
public class FileServiceUtil {

	private FileServiceUtil() {
		throw new IllegalArgumentException("FileServiceUtil class");
	}

	private static final String FAILED = "FAILED";

	public static final String FILE_PATH_SEPARATOR = "\\";

	public static Map<String, String> validateReqFile(File reqFile, String fileGroup, String fileExt, String fileType,
			Integer expectedNoOfColumns) {
		Map<String, String> fileStatus = new HashMap<>();
		String validationRemarks = FileServiceUtil.validateFile(reqFile, fileGroup, fileExt, fileType,
				expectedNoOfColumns);
		if (validationRemarks != null) {
			fileStatus.put(FAILED, validationRemarks);
			return fileStatus;
		}
		return fileStatus;
	}

	/**
	 * Validates the file format
	 * 
	 * @param file
	 * @param fileGroup - can be FIR,MER,STN,INVOICE
	 * @return Validation remarks
	 */
	public static String validateFile(File file, String fileGroup, String fileExtensionsAllowed,
			String fileTypesAllowed, Integer expectedNoOfColumns) {
		boolean isValid = true;
		try {
			// Validates File Name Pattern(may vary based on FileGroup)
			isValid = Pattern.matches(RegExConstants.FILE_NAME_REGEX, file.getName());
			if (!isValid) {
				return "Invalid File Name";
			}
			Optional<String> fileExtension = getFileExtensionByFileName(file.getName());
			if (!fileExtension.isPresent()) {
				return "No File Extension Found";
			} else {
				if (fileGroup != null && !fileExtensionsAllowed.equalsIgnoreCase(fileExtension.get())) {
					return "Invalid File Extension:" + fileExtension.get();
				}
			}
			if ((!file.exists()) && file.getTotalSpace() <= 0) {
				return "File should not be empty:" + file.getName();
			}
			// Validates fileType/mimeType - using this method since Tika library consumed
			// more memory
			String fileType = new MimetypesFileTypeMap().getContentType(file.getName());

			if (StringUtils.isBlank(fileType)
					|| (StringUtils.isNotBlank(fileType) && !fileTypesAllowed.equalsIgnoreCase(fileType))) {
				return "Invalid File Type:" + fileType;
			}

			if (expectedNoOfColumns != null && (!expectedNoOfColumns.equals(getNoOfColumns(file)))) {
				return "Invalid Number of columns";
			}
		} catch (Exception e) {
			return "Exception occured while validating the File";
		}
		log.debug("File validation passed for - {}", file.getName());
		return null;
	}

	private static Optional<String> getFileExtensionByFileName(String fileName) {
		return Optional.ofNullable(fileName).filter(f -> f.contains("."))
				.map(f -> f.substring(fileName.lastIndexOf('.') + 1));
	}

	private static Integer getNoOfColumns(File file) {
		Integer noOfColumns = 0;
		try (Scanner scanner = new Scanner(file)) {
			if (scanner.hasNextLine()) {
				noOfColumns = scanner.nextLine().split(",").length;
			}
		} catch (FileNotFoundException e) {
			throw new ServiceException("File not found", "ERR-CORE-029", e);
		}
		return noOfColumns;
	}

	public static List<String[]> readLinesFromFile(String filePath, String fileName) {
		List<String[]> list = new ArrayList<>();
		try (Stream<String> lines = Files.lines(Paths.get(filePath + fileName), Charset.defaultCharset())) {
			lines.forEachOrdered(line -> list.add(line.split(",")));
		} catch (IOException e) {
			throw new ServiceException("Exception while processing file", "ERR-FILE-004", e);
		}
		// skipping 1st row
		list.remove(0);
		return list;
	}

	public static int getTotalCount(String fileName) {
		int noOfLinesRead = 0;
		String line = null;
		try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
			while (!StringUtils.isEmpty(line = reader.readLine()) && !StringUtils.isEmpty(line.replace(",", ""))) {
				noOfLinesRead++;
			}
		} catch (IOException e) {
			throw new ServiceException("Exception while getting the total count from the file. line: " + line,
					"ERR-FILE-004", e);
		}
		return noOfLinesRead;
	}

	public static void moveFileFromSrcToDst(String source, String destination) {
		try {
			Files.move(Paths.get(source), Paths.get(destination));
		} catch (FileAlreadyExistsException ex) {
			log.warn("The file trying to move already exists in the dest folder: " + destination
					+ ", so deleting the file");
			FileServiceUtil.deleteFile(source);
		} catch (IOException ex) {
			log.error("Exception while moving the file", ex);
		}
	}

	public static void deleteFile(String filePath) {
		try {
			Files.deleteIfExists(Paths.get(filePath));
		} catch (IOException ex) {
			log.error("Exception while deleting the file", ex);
		}
	}
}
