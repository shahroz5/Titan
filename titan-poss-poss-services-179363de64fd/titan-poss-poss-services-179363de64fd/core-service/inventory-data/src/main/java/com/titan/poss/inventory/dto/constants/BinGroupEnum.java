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
public enum BinGroupEnum {

	STN, PURCFA, CON, GRN, DISPUTE, FOC, LOSS, LOAN, EXHIBITION, MIA, TEPSALE, DEFECTIVE, TEP, GEP, CUSTOMERORDERBIN,
	SPARE, RESERVEBIN,CUTPIECE, HALLMARKDISPUTEBIN;

	public static List<String> issueBin(UserTypeEnum userType) {

		if (userType.equals(UserTypeEnum.L1) || userType.equals(UserTypeEnum.L2)) {

			return List.of(STN.toString(), BinGroupEnum.GRN.toString(), BinGroupEnum.FOC.toString(),
					BinGroupEnum.LOSS.toString(), BinGroupEnum.LOAN.toString(), BinGroupEnum.EXHIBITION.toString(),
					BinGroupEnum.MIA.toString(), BinGroupEnum.TEPSALE.toString(), BinGroupEnum.DISPUTE.toString());

		} else {

			if (userType.equals(UserTypeEnum.L3)) {

				return List.of(BinGroupEnum.PURCFA.toString(), BinGroupEnum.CON.toString(), BinGroupEnum.GRN.toString(),
						BinGroupEnum.FOC.toString(), BinGroupEnum.LOSS.toString(), BinGroupEnum.LOAN.toString(),
						BinGroupEnum.EXHIBITION.toString(), BinGroupEnum.MIA.toString(),
						BinGroupEnum.TEPSALE.toString());

			} else {

				return new ArrayList<>();

			}

		}

	}

	public static List<String> receiveBin(UserTypeEnum userType) {

		if (userType.equals(UserTypeEnum.L1) || userType.equals(UserTypeEnum.L2)) {

			return List.of(BinGroupEnum.STN.toString(), BinGroupEnum.DEFECTIVE.toString(), BinGroupEnum.LOAN.toString(),
					BinGroupEnum.EXHIBITION.toString(), BinGroupEnum.TEPSALE.toString(), BinGroupEnum.LOSS.toString(),
					BinGroupEnum.FOC.toString(), BinGroupEnum.HALLMARKDISPUTEBIN.toString());

		} else {

			if (userType.equals(UserTypeEnum.L3)) {

				return List.of(BinGroupEnum.PURCFA.toString(), BinGroupEnum.CON.toString(),
						BinGroupEnum.DEFECTIVE.toString(), BinGroupEnum.LOAN.toString(),
						BinGroupEnum.EXHIBITION.toString(), BinGroupEnum.TEPSALE.toString(),
						BinGroupEnum.LOSS.toString(), BinGroupEnum.FOC.toString());

			} else {

				return new ArrayList<>();

			}

		}

	}

}
