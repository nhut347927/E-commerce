package com.moe.socialnetwork.api.services.impl;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.moe.socialnetwork.api.services.ICloudinaryService;
/**
 * Author: nhutnm379
 */
@Service
public class CloudinaryServiceImpl implements ICloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "format", "jpg",
                        "folder", "images"));
        return (String) response.get("public_id");
    }

 
    public String uploadAnyFile(MultipartFile file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file.getBytes(),
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
            return "raw"; // Cloudinary xài "raw" cho file audio
        } else if (publicId.startsWith("images/")) {
            return "image";
        }
        // fallback nếu không rõ
        return "image";
    }

    public String uploadImage(File file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file,
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "format", "jpg", // Chuyển đổi tất cả thành JPG
                        "folder", "images"));
        return (String) response.get("public_id");
    }


}