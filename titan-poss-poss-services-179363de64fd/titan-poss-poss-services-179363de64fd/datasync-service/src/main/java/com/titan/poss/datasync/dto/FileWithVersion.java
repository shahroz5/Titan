package com.titan.poss.datasync.dto;

import com.fasterxml.jackson.core.Version;

import lombok.Data;

@Data
public class FileWithVersion implements Comparable<FileWithVersion>{
	
	private String filenameWithVersion;
	
	public FileWithVersion(String filenameWithVersion) {
		super();
		this.filenameWithVersion = filenameWithVersion;
	}

	@Override
	public int compareTo(FileWithVersion otherFilenameWithVersion) {
		return compareVersions(this.filenameWithVersion, otherFilenameWithVersion.getFilenameWithVersion());
	}
	
	private int compareVersions(String ver1, String ver2) {

		int[] versionArr1 = convertVersionStringToArray(ver1);
		int[] versionArr2 = convertVersionStringToArray(ver2);

		Version version1 = new Version(versionArr1[0], versionArr1[1], versionArr1[2], null, null, null);
		Version version2 = new Version(versionArr2[0], versionArr2[1], versionArr2[2], null, null, null);

		return version1.compareTo(version2);
	}
	
	private int[] convertVersionStringToArray(String version) {
		String[] versionStr = version.split("[.]");
		int[] versionArray = new int[versionStr.length];

		for (int i = 0; i < versionStr.length; i++) {
			versionArray[i] = Integer.parseInt(versionStr[i]);
		}
		return versionArray;
	}

}
