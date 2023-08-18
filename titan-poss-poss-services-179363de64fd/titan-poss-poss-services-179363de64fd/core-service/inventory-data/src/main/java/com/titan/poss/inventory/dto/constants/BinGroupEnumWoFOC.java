/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.constants;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.domain.constant.UserTypeEnum;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum BinGroupEnumWoFOC {

	STN, PURCFA, CON,FOC, GRN, DISPUTE, LOSS, LOAN, EXHIBITION, MIA, TEPSALE, DEFECTIVE, TEP, GEP, CUSTOMERORDERBIN,
	SPARE, RESERVEBIN, HALLMARKDISPUTEBIN;

	public static List<String> issueBin(UserTypeEnum userType) {

		if (userType.equals(UserTypeEnum.L1) || userType.equals(UserTypeEnum.L2)) {

			return List.of(STN.toString(), BinGroupEnumWoFOC.GRN.toString(),
					BinGroupEnumWoFOC.LOSS.toString(), BinGroupEnumWoFOC.LOAN.toString(), BinGroupEnumWoFOC.EXHIBITION.toString(),
					BinGroupEnumWoFOC.MIA.toString(), BinGroupEnumWoFOC.TEPSALE.toString(),BinGroupEnumWoFOC.DISPUTE.toString());

		} else {

			if (userType.equals(UserTypeEnum.L3)) {

				return List.of(BinGroupEnumWoFOC.PURCFA.toString(), BinGroupEnumWoFOC.CON.toString(), BinGroupEnumWoFOC.GRN.toString(),
					    BinGroupEnumWoFOC.LOSS.toString(), BinGroupEnumWoFOC.LOAN.toString(),
						BinGroupEnumWoFOC.EXHIBITION.toString(), BinGroupEnumWoFOC.MIA.toString(),
						BinGroupEnumWoFOC.TEPSALE.toString());

			} else {

				return new ArrayList<>();

			}

		}

	}

	public static List<String> receiveBin(UserTypeEnum userType) {

		if (userType.equals(UserTypeEnum.L1) || userType.equals(UserTypeEnum.L2)) {

			return List.of(BinGroupEnumWoFOC.STN.toString(), BinGroupEnumWoFOC.DEFECTIVE.toString(), BinGroupEnumWoFOC.LOAN.toString(),
					BinGroupEnumWoFOC.EXHIBITION.toString(), BinGroupEnumWoFOC.TEPSALE.toString(), BinGroupEnumWoFOC.LOSS.toString(),
					BinGroupEnumWoFOC.FOC.toString(),BinGroupEnumWoFOC.HALLMARKDISPUTEBIN.toString());

		} else {

			if (userType.equals(UserTypeEnum.L3)) {

				return List.of(BinGroupEnumWoFOC.PURCFA.toString(), BinGroupEnumWoFOC.CON.toString(),
						BinGroupEnumWoFOC.DEFECTIVE.toString(), BinGroupEnumWoFOC.LOAN.toString(),
						BinGroupEnumWoFOC.EXHIBITION.toString(), BinGroupEnumWoFOC.TEPSALE.toString(),
						BinGroupEnumWoFOC.LOSS.toString(), BinGroupEnumWoFOC.FOC.toString());

			} else {

				return new ArrayList<>();

			}

		}

	}

}
