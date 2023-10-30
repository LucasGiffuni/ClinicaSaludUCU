package com.example.clinica_ucu.service.impl;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.example.clinica_ucu.ClinicaUcuApplication;
import com.example.clinica_ucu.model.Funcionario;
import com.example.clinica_ucu.model.JwtRequest;
import com.example.clinica_ucu.model.TokenInfo;
import com.example.clinica_ucu.model.User.DatabaseUser;
import com.example.clinica_ucu.model.response.DefaultResponse;
import com.example.clinica_ucu.model.response.DefaultResponseData;
import com.example.clinica_ucu.security.JwtUtilService;
import com.google.common.hash.Hashing;

@Service
public class UserServiceImpl {
    private final Logger logger = LoggerFactory.getLogger(ClinicaUcuApplication.class);

    @Autowired
    private JwtUtilService jwtUtilService;
    @Autowired
    private AuthenticationManager authenticationManager;

    public List<DatabaseUser> getAllUsers() throws SQLException, ClassNotFoundException {

        List<DatabaseUser> users = new ArrayList<>();
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/CLINICA", "root", "bernardo");

        String sql = "select LogId from Logins ";
        PreparedStatement preparedStmt = con.prepareStatement(sql);
        ResultSet rs = preparedStmt.executeQuery();
        while (rs.next()) {
            DatabaseUser u = new DatabaseUser(rs.getString(1));
            users.add(u);
        }
        return users;
    }

    public DefaultResponse validateUser(String username, String password) {
        String encryptedpassword = null;

        try {
            MessageDigest m = MessageDigest.getInstance("MD5");

            m.update(password.getBytes());

            byte[] bytes = m.digest();
            StringBuilder s = new StringBuilder();
            for (int i = 0; i < bytes.length; i++) {
                s.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
            }
            encryptedpassword = s.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/CLINICA", "root", "bernardo");

            String sql = "select Password from Logins where LogId = ?";

            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setString(1, username);
            ResultSet resultSet = preparedStmt.executeQuery();
            resultSet.absolute(1); // Go directly to 2nd row

            System.out.println("DATA: " + resultSet.getString(1));

            if (resultSet.getString(1).equals(encryptedpassword)) {

                logger.info("Usuario LOGUEADO");

                final String token = jwtUtilService
                        .generateToken(new User(username, encryptedpassword, new ArrayList<>()));

                DefaultResponse response = new DefaultResponse();
                response.setDefaultResponse("200", token);
                return response;
            }

            con.close();
        } catch (Exception e) {
            DefaultResponse response = new DefaultResponse();
            response.setDefaultResponse("400", "Error");
            e.printStackTrace();
            return response;
        }
        DefaultResponse response = new DefaultResponse();
        response.setDefaultResponse("400", "Error");
        return response;

    }

    public DefaultResponse createUser(String username, String password) throws NoSuchAlgorithmException {
        String encryptedpassword = null;

        try {
            MessageDigest m = MessageDigest.getInstance("MD5");

            m.update(password.getBytes());

            byte[] bytes = m.digest();
            StringBuilder s = new StringBuilder();
            for (int i = 0; i < bytes.length; i++) {
                s.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
            }
            encryptedpassword = s.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/CLINICA", "root", "bernardo");

            String sql = " insert into Logins (LogId, Password)"
                    + " values (?, ?)";

            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setInt(1, Integer.parseInt(username));
            preparedStmt.setString(2, encryptedpassword);
            preparedStmt.execute();

            System.out.println("Plain-text password: " + password);
            System.out.println("Encrypted password using MD5: " + encryptedpassword);
            con.close();
            DefaultResponse response = new DefaultResponse();
            response.setDefaultResponse("200", "Usuario: " + username + " creado!");
            return response;

        } catch (Exception e) {
            System.out.println(e);
        }

        DefaultResponse response = new DefaultResponse();
        response.setDefaultResponse("400", "Error");
        return response;
    }

    public DefaultResponse createFuncionario(Funcionario funcionario) {

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/CLINICA", "root", "bernardo");

            String sql = " insert into Funcionarios (CI, Nombre, Apellido, Fch_Nacimiento, Direccion, Telefono, Email, LogId)"
                    + " values (?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setInt(1, Integer.parseInt(funcionario.getCI()));
            preparedStmt.setString(2, funcionario.getNombre());
            preparedStmt.setString(3, funcionario.getApellido());
            preparedStmt.setDate(4, Date.valueOf(funcionario.getFch_Nacimiento()));
            preparedStmt.setString(5, funcionario.getDireccion());
            preparedStmt.setInt(6, Integer.parseInt(funcionario.getTelefono()));
            preparedStmt.setString(7, funcionario.getEmail());
            preparedStmt.setInt(8, Integer.parseInt(funcionario.getLogId()));

            preparedStmt.execute();

            DefaultResponse response = new DefaultResponse();
            response.setDefaultResponse("200", "Funcionario Creado");
            
            con.close();
            return response;

        } catch (Exception e) {
            e.printStackTrace();
        }
        DefaultResponse response = new DefaultResponse();
        response.setDefaultResponse("400", "Error");
        return response;
    }

}
