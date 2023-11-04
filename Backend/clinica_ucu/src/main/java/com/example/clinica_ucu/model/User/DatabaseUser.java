package com.example.clinica_ucu.model.User;

public class DatabaseUser {

    private String Username;

    
    public DatabaseUser(String username) {
        Username = username;
    }

    public String getUsername() {
        return Username;
    }

    public void setUsername(String username) {
        Username = username;
    }

}
