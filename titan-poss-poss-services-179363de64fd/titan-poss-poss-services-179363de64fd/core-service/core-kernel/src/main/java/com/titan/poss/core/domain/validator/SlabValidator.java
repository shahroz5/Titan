/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.validator;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.util.CollectionUtils;

import com.titan.poss.core.dto.SlabDto;
import com.titan.poss.core.dto.SlabValuesDto;
import com.titan.poss.core.exception.ServiceException;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class SlabValidator {

	private SlabValidator() {
		throw new IllegalArgumentException("SlabValidator class");
	}

	private static final String ERR_CORE_032 = "ERR-CORE-032";

	private static final String ERR_CORE_033 = "ERR-CORE-033";

	private static final String SLAB_VALIDATION_FAILED = "Slab validation failed";

	/**
	 * this method validates list of slabObjects
	 * 
	 * @param slabValuesDto
	 */
	public static Boolean slabValidation(SlabValuesDto values) {

		if (values != null) {
			List<SlabDto> slabList = values.getSlabList();

			if (slabList != null && !slabList.isEmpty()) {
				Collections.sort(slabList, Comparator.comparing(SlabDto::getFromRange));

				for (int i = 0; i < slabList.size(); i++) {

					SlabDto currentRecord = slabList.get(i);
					validateCurrentRecord(currentRecord);

					if (i > 0) {

						SlabDto previousRecord = slabList.get(i - 1);
						validatePreviousRecord(currentRecord, previousRecord);
					}
				}

			}
		}
		return true;

	}

	/**
	 * this method validates currentRecord fromRange wrt previousRecord toRange
	 * 
	 * @param currentRecord
	 * @param previousRecord
	 */
	private static void validatePreviousRecord(SlabDto currentRecord, SlabDto previousRecord) {

		if (isBetween(currentRecord.getFromRange(), previousRecord.getFromRange(), previousRecord.getToRange())) {
			throw new ServiceException(SLAB_VALIDATION_FAILED, ERR_CORE_032,
					"Range of RowId-" + currentRecord.getRowId() + " is OverLapping with Range of RowId-"
							+ previousRecord.getRowId() + "");
		}

		if (isBetween(currentRecord.getToRange(), previousRecord.getFromRange(), previousRecord.getToRange())) {
			throw new ServiceException(SLAB_VALIDATION_FAILED, ERR_CORE_032,
					"Range of RowId-" + currentRecord.getRowId() + " is OverLapping with Range of RowId-"
							+ previousRecord.getRowId() + "");
		}

	}

	private static Boolean isBetween(BigDecimal value, BigDecimal fromRange, BigDecimal toRange) {
		return value.compareTo(fromRange) >= 0 && value.compareTo(toRange) <= 0;
	}

	/**
	 * this method validates currentRecord fromRange and toRange
	 * 
	 * @param currentRecord
	 */
	private static void validateCurrentRecord(SlabDto currentRecord) {

		if (currentRecord.getFromRange().compareTo(currentRecord.getToRange()) > 0) {
			throw new ServiceException(SLAB_VALIDATION_FAILED, ERR_CORE_032,
					"FromRange is greater than toRange @rowId:- " + currentRecord.getRowId());
		}

	}

	/**
	 * This method will create and validate slabObject
	 * 
	 * @param list
	 * @param Class
	 * @param fromRangeFieldName
	 * @param toRangeFieldName
	 * @param rowIdFieldName
	 */
	public static void createAndValidateSlabObject(List<?> list, Class<?> classs, String fromFieldName,
			String toFieldName, String rowIdFieldName) {

		if (!CollectionUtils.isEmpty(list)) {
			List<SlabDto> slabList = new ArrayList<>();

			Field fromField;
			Field toField;
			Field rowIdField;
			try {
				fromField = classs.getDeclaredField(fromFieldName);
				fromField.setAccessible(true);

				toField = classs.getDeclaredField(toFieldName);
				toField.setAccessible(true);

				rowIdField = classs.getDeclaredField(rowIdFieldName);
				rowIdField.setAccessible(true);

				for (Object obj : list) {

					SlabDto slabDto = new SlabDto();

					slabDto.setFromRange(new BigDecimal(fromField.get(obj).toString())); // get the value of obj for
																							// that
					slabDto.setToRange(new BigDecimal(toField.get(obj).toString()));
					slabDto.setRowId(Integer.parseInt(rowIdField.get(obj).toString()));

					slabList.add(slabDto);
				}

			} catch (Exception e) {

				throw new ServiceException("Error while converting Object for validation", ERR_CORE_033);
			}

			SlabValuesDto valueDto = new SlabValuesDto();
			valueDto.setSlabList(slabList);

			SlabValidator.slabValidation(valueDto);
		}

	}

}
