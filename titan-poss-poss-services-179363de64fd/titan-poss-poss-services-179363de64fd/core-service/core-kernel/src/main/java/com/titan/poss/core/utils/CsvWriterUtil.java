/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.utils;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.opencsv.CSVWriter;
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.exception.ServiceException;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CsvWriterUtil {

	private CsvWriterUtil() {
		throw new IllegalArgumentException("CsvWriterUtil class");
	}

	public static void writeErrorLogToCsv(List<DataAuditDto> dataAuditList, String fileName) {
		try (CSVWriter writer = new CSVWriter(new FileWriter(fileName))) {
			// adding header to csv
			String[] header = { "Primary data", "Data", "Error Message", "Error Type\n" };
			writer.writeNext(header);
			List<String[]> data = new ArrayList<>();
			for (DataAuditDto dataAudit : dataAuditList) {
				data.add(new String[] { dataAudit.getPrimaryData(), dataAudit.getData(), dataAudit.getErrorMessage(),
						dataAudit.getErrorType() });
			}
			writer.writeAll(data);
			writer.flush();
		} catch (IOException e) {
			throw new ServiceException("Error while writing to csv", "ERR-FILE-006", e);
		}

	}

	public static void writeDataToCsv(List<String[]> data, String fileName, String[] header) {
		try (CSVWriter writer = new CSVWriter(new FileWriter(fileName))) {
			// adding header to csv
			writer.writeNext(header);
			writer.writeAll(data);
			writer.flush();
		} catch (IOException e) {
			throw new ServiceException("Error while writing to csv", "ERR-FILE-006", e);
		}

	}
}
