/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.utils;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang.StringUtils;
import org.springframework.util.CollectionUtils;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public final class CollectionUtil {

	private CollectionUtil() {
		throw new IllegalArgumentException("CollectionUtils class");
	}

	private static final String[] EMPTY_ARRAY = new String[0];

	public static Stream<String> collectionAsStream(Collection<String> collection) {
		return (collection == null || collection.isEmpty()) ? Stream.empty() : collection.stream();
	}

	public static boolean isEmpty(Collection<?> coll) {
		return (coll == null || coll.isEmpty());
	}

	public static boolean isNotEmpty(Collection<?> coll) {
		return !isEmpty(coll);
	}

	/**
	 * Get Json in Map<String, String> format
	 * 
	 * @param configDetailStr
	 * @return Map<String, String>
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, String> getMapFromObj(Object obj) {
		return (Map<String, String>) obj;
	}

	public static boolean isEmptyOrEmptyValue(List<String> list) {

		boolean status = true;

		if (list == null || list.isEmpty())
			return status;

		List<String> notEmptyList = list.stream().filter(StringUtils::isNotBlank).collect(Collectors.toList());

		if (!notEmptyList.isEmpty())
			status = false;

		return status;
	}

	public static <T> Iterable<T> emptyIfNull(Iterable<T> iterable) {
		return iterable == null ? Collections.<T>emptyList() : iterable;
	}

	/**
	 * Convert all elements of an collection to upper-case with null-safe
	 * 
	 * @param values
	 * @return Boolean
	 */
	public static Set<String> setToUpperCase(Set<String> values) {
		return Stream.ofNullable(values).flatMap(Collection::stream).filter(Objects::nonNull)
				.map(value -> value.toUpperCase().trim()).collect(Collectors.toSet());
	}

	/**
	 * check if both collection are not having anything in common
	 * 
	 * @param first
	 * @param second
	 * @return Boolean
	 */
	public static Boolean disjointCheckFailed(Collection<?> first, Collection<?> second) {
		Boolean isFailed = false;
		if ((first != null && second != null) && !Collections.disjoint(first, second))
			isFailed = true;
		return isFailed;
	}

	public static Set<String> duplicates(List<String> data) {
		Set<String> uniques = new HashSet<>();
		Set<String> duplicates = new HashSet<>();
		if (data == null || data.isEmpty())
			return new HashSet<>();
		for (int i = 0; i < data.size(); i++) {
			// false means already there in the set
			if (!uniques.add(data.get(i)))
				duplicates.add(data.get(i));
		}
		return duplicates;
	}

	public static Boolean isUnique(Collection<?> data) {
		return data.size() == new HashSet<>(data).size();
	}

	/**
	 * Check if both Strings are same with null-safe check
	 * 
	 * @param str1
	 * @param str2
	 * @return Boolean
	 */
	public static Boolean isSameString(String str1, String str2) {
		Boolean isValid = false;
		if (str1 != null && str2 != null)
			isValid = str1.equals(str2);
		return isValid;
	}

	/**
	 * checking if both provided collections having same elements
	 * 
	 * @param first
	 * @param second
	 * @return Boolean
	 */
	public static Boolean isEqualCollection(Set<?> first, Set<?> second) {
		Set<?> firstSorted = new TreeSet<>(first);
		Set<?> secondSorted = new TreeSet<>(second);
		return firstSorted.equals(secondSorted);
	}

	/**
	 * check if a collection is a superset of a collection
	 * 
	 * @param superSet
	 * @param subSet
	 * @return Boolean
	 */
	public static Boolean containsAll(Collection<String> superSet, Collection<String> subSet) {
		return superSet.containsAll(subSet);
	}

	/**
	 * Return String[] from collection
	 * 
	 * @param list
	 * @return String[]
	 */
	public static String[] getArrayFromCollection(Collection<String> list) {
		if (list == null)
			return EMPTY_ARRAY;
		return list.toArray(new String[0]);
	}

	/**
	 * check if the string is there in the collection with ignore case
	 * 
	 * @param allValues
	 * @param valueToCheck
	 * @return Boolean
	 */
	public static Boolean isContains(Collection<String> allValues, String valueToCheck) {
		Boolean isValid = false;
		for (String val : allValues) {
			if (val.equalsIgnoreCase(valueToCheck)) {
				isValid = true;
				break;
			}
		}
		return isValid;
	}

	public static Set<String> setNullIfEmpty(Set<String> list) {
		return (CollectionUtils.isEmpty(list)) ? null : list;
	}

	/**
	 * Convert object to List
	 * 
	 * @param <T>
	 * @param obj
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T extends List<?>> T cast(Object obj) {
		return (T) obj;
	}

	public static void sortList(List<String> list) {
		Collections.sort(list);
	}

	public static List<String> convertListIntegerToListStr(List<Integer> intList) {
		return intList.stream().map(StringUtil::convertIntToNum).collect(Collectors.toList());
	}

	public static int getSize(Map<?, ?> val) {
		int size = 0;
		if (val != null && !val.isEmpty())
			size = val.size();
		return size;
	}

	public static int getSize(Collection<?> val) {
		int size = 0;
		if (val != null && !val.isEmpty())
			size = val.size();
		return size;
	}

	public static <T> Collection<T> getCommonElement(Set<T> coll1, Set<T> coll2) {

		Set<T> listTemp = new HashSet<>(coll1);
		listTemp.retainAll(coll2);
		return listTemp;
	}
}
