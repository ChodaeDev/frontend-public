package com.chodae.config;

import com.chodae.dto.UserLevel;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(UserLevel.class)
public class UserLevelTypeHandler extends BaseTypeHandler<UserLevel> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, UserLevel parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.toValue());
    }

    @Override
    public UserLevel getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String s = rs.getString(columnName);
        return UserLevel.fromString(s);
    }

    @Override
    public UserLevel getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String s = rs.getString(columnIndex);
        return UserLevel.fromString(s);
    }

    @Override
    public UserLevel getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String s = cs.getString(columnIndex);
        return UserLevel.fromString(s);
    }
}
