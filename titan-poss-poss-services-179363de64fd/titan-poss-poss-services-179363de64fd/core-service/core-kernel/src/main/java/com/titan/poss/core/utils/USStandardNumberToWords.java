/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.utils;

import java.text.DecimalFormat;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class USStandardNumberToWords implements NumberToWordsUtil {

	USStandardNumberToWords() {
	}
	private static final String BLANK = "";
	private static final String TEN = " Ten";
	private static final String TWENTY = " Twenty";
	private static final String THIRTY = " Thirty";
	private static final String FORTY = " Forty";
	private static final String FIFTY = " Fifty";
	private static final String SIXTY = " Sixty";
	private static final String SEVENTY = " Seventy";
	private static final String EIGHTY = " Eighty";
	private static final String NINETY = " Ninety";
	private static final String HUNDRED = " Hundred";
	private static final String THOUSAND = " Thousand";

	private static final String DECIMAL_FORMAT = "000000000000";

	private static final String ZERO = " Zero";
	private static final String MILLION = " Million";
	private static final String BILLION = " Billion";

	private static final String ONE = " One";
	private static final String TWO = " Two";
	private static final String THREE = " Three";
	private static final String FOUR = " Four";
	private static final String FIVE = " Five";
	private static final String SIX = " Six";
	private static final String SEVEN = " Seven";
	private static final String EIGHT = " Eight";
	private static final String NINE = " Nine";
	private static final String ELEVEN = " Eleven";
	private static final String TWELVE = " Twelve";
	private static final String THIRTEEN = " Thirteen";
	private static final String FOURTEEN = " Fourteen";
	private static final String FIFTEEN = " Fifteen";
	private static final String SIXTEEN = " Sixteen";
	private static final String SEVENTEEN = " Seventeen";
	private static final String EIGHTEEN = " Eighteen";
	private static final String NINETEEN = " Nineteen";

	private static final String[] TENS_SERIES = { BLANK, TEN, TWENTY, THIRTY, FORTY, FIFTY, SIXTY, SEVENTY, EIGHTY,
			NINETY };

	private static final String[] ONES_SERIES = { BLANK, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN,
			ELEVEN, TWELVE, THIRTEEN, FOURTEEN, FIFTEEN, SIXTEEN, SEVENTEEN, EIGHTEEN, NINETEEN };



	private static String convertLessToThousand(int price) {

		String currentPrice;

		if (price % 100 < 20) {
			currentPrice = ONES_SERIES[price % 100];
			price /= 100;
		} else {
			currentPrice = ONES_SERIES[price % 10];
			price /= 10;

			currentPrice = TENS_SERIES[price % 10] + currentPrice;
			price /= 10;
		}
		if (price == 0)
			return currentPrice;
		return ONES_SERIES[price] + HUNDRED + currentPrice;
	}

	@Override
	public String convert(long price) {

		if (price == 0) {
			return ZERO;
		}

		String priceInString;

		DecimalFormat df = new DecimalFormat(DECIMAL_FORMAT);
		priceInString = df.format(price);

		int billions = Integer.parseInt(priceInString.substring(0, 3));
		int millions = Integer.parseInt(priceInString.substring(3, 6));
		int hundredThousands = Integer.parseInt(priceInString.substring(6, 9));
		int thousands = Integer.parseInt(priceInString.substring(9, 12));

		String finalPrice = inBillions(billions);

		String priceWithMillions = inMillions(millions);
		finalPrice = finalPrice + priceWithMillions;

		String priceWithHundredThousands = inHundredThousands(hundredThousands);
		finalPrice = finalPrice + priceWithHundredThousands;

		String priceWithThousands;
		priceWithThousands = convertLessToThousand(thousands);
		finalPrice = finalPrice + priceWithThousands;

		// remove extra spaces!
		return finalPrice.replaceAll("^\\s+", "").replaceAll("\\b\\s{2,}\\b", " ");
	}

	private static String inHundredThousands(int hundredThousands) {
		String priceWithHundredThousands;
		switch (hundredThousands) {
		case 0:
			priceWithHundredThousands = BLANK;
			break;
		case 1:
			priceWithHundredThousands = ONE + THOUSAND;
			break;
		default:
			priceWithHundredThousands = convertLessToThousand(hundredThousands) + THOUSAND;
		}
		return priceWithHundredThousands;
	}

	private static String inMillions(int millions) {
		String priceWithMillions;
		switch (millions) {
		case 0:
			priceWithMillions = BLANK;
			break;
		case 1:
			priceWithMillions = convertLessToThousand(millions) + MILLION;
			break;
		default:
			priceWithMillions = convertLessToThousand(millions) + MILLION;
		}
		return priceWithMillions;
	}

	private static String inBillions(int billions) {
		String priceInBillions;
		switch (billions) {
		case 0:
			priceInBillions = BLANK;
			break;
		case 1:
			priceInBillions = convertLessToThousand(billions) + BILLION;
			break;
		default:
			priceInBillions = convertLessToThousand(billions) + BILLION;
		}
		return priceInBillions;
	}
}
