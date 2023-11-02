package com.example.clinica_ucu.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.clinica_ucu.model.User.DatabaseUser;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.crypto.Data;

@Service
public class UserService implements UserDetailsService {

  @Value("${jwtSecurity.encryptedPassword}")
  private String encryptedPassword;

  @Value("${jwtSecurity.users.user1}")
  private String user1;
  @Value("${jwtSecurity.users.user2}")
  private String user2;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Map<String, String> usuarios = new HashMap<String, String>();

    UserServiceImpl service;

    service = new UserServiceImpl();

    try {
      for (DatabaseUser user : service.getAllUsers()) {
        usuarios.put(user.getUsername(), "USER");
      }
    } catch (ClassNotFoundException | SQLException e) {
      e.printStackTrace();
    }
    var rol = usuarios.get(username);
    System.out.println(rol);

    if (rol != null) {
      User.UserBuilder userBuilder = User.withUsername(username);

      userBuilder.password(encryptedPassword).roles(rol);
      return userBuilder.build();
    } else {
      throw new UsernameNotFoundException(username);
    }

  }

}