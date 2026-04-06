package com.chodae.service;

import com.chodae.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccessControlService {

    private final UserMapper userMapper;

    public boolean isSuperAdmin(String userId) {
        if (userId == null || userId.isBlank()) {
            return false;
        }
        return userMapper.isSuperAdminByUserId(userId);
    }
}
