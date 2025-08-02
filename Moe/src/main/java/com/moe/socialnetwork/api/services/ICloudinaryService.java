package com.moe.socialnetwork.api.services;

import java.io.File;
import java.io.IOException;

/**
 * Author: nhutnm379
 */
public interface ICloudinaryService {
    String uploadImage(String base64) throws IOException;

    String uploadAnyFile(String base64) throws IOException;

    String uploadImage(File file) throws IOException;

    boolean deleteFile(String publicId) throws IOException;
}