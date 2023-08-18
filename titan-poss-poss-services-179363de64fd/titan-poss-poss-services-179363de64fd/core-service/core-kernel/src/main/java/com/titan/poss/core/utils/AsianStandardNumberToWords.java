/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.utils;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class AsianStandardNumberToWords implements NumberToWordsUtil {

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
	private static final String CRORE = " Crore";
	private static final String LAKH = " Lakh";

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

	private static final String AND = " And";

	private static final String[] TENS_SERIES = { TWENTY, THIRTY, FORTY, FIFTY, SIXTY, SEVENTY, EIGHTY, NINETY };

	private static final String[] UNITS_SERIES = { BLANK, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE };

	private static final String[] TEENS_SERIES = { TEN, ELEVEN, TWELVE, THIRTEEN, FOURTEEN, FIFTEEN, SIXTEEN, SEVENTEEN,
			EIGHTEEN, NINETEEN };


	private static final String[] HIGH_SERIES = { BLANK, BLANK, HUNDRED, THOUSAND, LAKH, CRORE };



	@Override
	public String convert(long inputNumber) {
		String stringValueofNumber = String.valueOf(inputNumber);
		String priceInString = "";
		int position = 1;
		boolean hundredsFlag = false;
		while (stringValueofNumber.length() > 0) {
			if (position == 1) // words for tens and unit
			{
				if (stringValueofNumber.length() >= 2) {
					String temp = stringValueofNumber.substring(stringValueofNumber.length() - 2,
							stringValueofNumber.length());
					stringValueofNumber = stringValueofNumber.substring(0, stringValueofNumber.length() - 2);
					priceInString += digitsToWords(temp);
				} else if (stringValueofNumber.length() == 1) {
					priceInString += digitsToWords(stringValueofNumber);
					stringValueofNumber = BLANK;
				}
				position++;
			} else if (position == 2) { // words for hundreds
				String temp = stringValueofNumber.substring(stringValueofNumber.length() - 1,
						stringValueofNumber.length());
				stringValueofNumber = stringValueofNumber.substring(0, stringValueofNumber.length() - 1);
				if (priceInString.length() > 0 && !(digitsToWords(temp).equals(BLANK))) {
					priceInString = (digitsToWords(temp) + HIGH_SERIES[position] + AND) + priceInString;
					hundredsFlag = true;
				} else {
					if (!digitsToWords(temp).equals(BLANK))
					{
						priceInString = (digitsToWords(temp) + HIGH_SERIES[position]) + priceInString;
					}
					hundredsFlag = true;
				}
				position++;
			} else if (position > 2) // words for others
			{
				if (stringValueofNumber.length() >= 2) 
				{
					String temp = stringValueofNumber.substring(stringValueofNumber.length() - 2,
							stringValueofNumber.length());
					stringValueofNumber = stringValueofNumber.substring(0, stringValueofNumber.length() - 2);
					if (!hundredsFlag && priceInString.length() > 0)
					{
						priceInString = digitsToWords(temp) + HIGH_SERIES[position] + AND + priceInString;
					}

					else {
						if (!digitsToWords(temp).equals(BLANK))
						{
							priceInString = digitsToWords(temp) + HIGH_SERIES[position] + priceInString;
						}
					}
				} else if (stringValueofNumber.length() == 1) // EXTRACT 1 DIGIT
				{
					if (!hundredsFlag && priceInString.length() > 0)
					{
						priceInString = digitsToWords(stringValueofNumber) + HIGH_SERIES[position] + AND
								+ priceInString;

					}

					else {
						if (!digitsToWords(stringValueofNumber).equals(BLANK)) {
							priceInString = digitsToWords(stringValueofNumber) + HIGH_SERIES[position] + priceInString;
						}
						stringValueofNumber = BLANK;
					}
				}
				position++;
			}
		}

		return priceInString;
	}

	private String digitsToWords(String inputString) {// returns numbers passed in words
		String priceInString = "";
		int totalValue = 0;
		for (int initial = inputString.length() - 1; initial >= 0; initial--) {
			int position = inputString.charAt(initial) - 48;
			if (initial == 0 && position > 1 && inputString.length() > 1)
			{
				priceInString = TENS_SERIES[position - 2] + priceInString;

			}
			else if (initial == 0 && position == 1 && inputString.length() == 2)
			{
				for (int i = 0; i < 2; i++)
				{
					totalValue = (totalValue * 10) + (inputString.charAt(i) - 48);
				}
				return TEENS_SERIES[totalValue - 10];
			} else {
				if (position > 0)
				{
					priceInString = UNITS_SERIES[position] + priceInString;
				}
			}
		}
		return priceInString;
	}
}
