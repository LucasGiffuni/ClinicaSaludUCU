package com.example.clinica_ucu.service.impl;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

import com.example.clinica_ucu.model.CarnetSalud;
import com.example.clinica_ucu.model.Funcionario;
import com.example.clinica_ucu.model.response.DefaultResponse;
import com.example.clinica_ucu.security.JwtUtilService;

@Service
public class FuncionarioServiceImpl {

    private Connection con;

    private void createConection() throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        this.con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/CLINICA", "root", "bernardo");
    }

    public DefaultResponse createFuncionario(Funcionario funcionario) {

        try {
            createConection();
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

    public DefaultResponse cargarCarnetSalud(CarnetSalud carnetSalud) {
        try {
            createConection();
            String sql = " insert into Carnet_Salud (Ci, Fch_Emision, Fch_Vencimiento, Comprobante )"
                    + " values (?, ?, ?, ?)";

            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setInt(1, Integer.parseInt(carnetSalud.getCi()));
            preparedStmt.setDate(2, Date.valueOf(carnetSalud.getFch_Emision()));
            preparedStmt.setDate(3, Date.valueOf(carnetSalud.getFch_Vencimiento()));
            preparedStmt.setBlob(4, carnetSalud.getComprobante());

            preparedStmt.execute();

            DefaultResponse response = new DefaultResponse();
            response.setDefaultResponse("200", "Carnet de salud cargado Correctamente.");

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