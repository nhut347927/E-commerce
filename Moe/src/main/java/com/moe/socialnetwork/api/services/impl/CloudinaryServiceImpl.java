package com.moe.socialnetwork.api.services.impl;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.moe.socialnetwork.api.services.ICloudinaryService;
import com.moe.socialnetwork.util.Base64Util;

/**
 * Author: nhutnm379
 */
@Service
public class CloudinaryServiceImpl implements ICloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(String base64) throws IOException {
        String cleanBase64 = Base64Util.cleanBase64Header(base64);
        Map<?, ?> response = cloudinary.uploader().upload(
                "data:image/jpeg;base64," + cleanBase64,
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "format", "jpg",
                        "folder", "images"));
        return (String) response.get("public_id");
    }

    public String uploadAnyFile(String base64) throws IOException {
        String cleanBase64 = Base64Util.cleanBase64Header(base64);
        Map<?, ?> response = cloudinary.uploader().upload(
                "data:application/octet-stream;base64," + cleanBase64,
                ObjectUtils.asMap(
                        "resource_type", "raw",
                        "folder", "files"));
        return (String) response.get("public_id");
    }

    public boolean deleteFile(String publicId) throws IOException {
        String resourceType = getResourceTypeFromPublicId(publicId);

        Map<String, Object> options = new HashMap<>();
        options.put("resource_type", resourceType);

        Map<?, ?> response = cloudinary.uploader().destroy(publicId, options);
        System.out.println("Delete response: " + response);
        return "ok".equals(response.get("result"));
    }

    private String getResourceTypeFromPublicId(String publicId) {
        if (publicId.startsWith("videos/")) {
            return "video";
        } else if (publicId.startsWith("audios/")) {
            return "raw"; // Cloudinary uses "raw" for audio files
        } else if (publicId.startsWith("images/")) {
            return "image";
        }
        // Fallback if resource type is unclear
        return "image";
    }

    public String uploadImage(File file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file,
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "format", "jpg",
                        "folder", "images"));
        return (String) response.get("public_id");
    }
}