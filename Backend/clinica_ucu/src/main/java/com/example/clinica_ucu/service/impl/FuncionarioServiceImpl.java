package com.example.clinica_ucu.service.impl;

import java.sql.Blob;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.clinica_ucu.model.CarnetSalud;
import com.example.clinica_ucu.model.Funcionario;
import com.example.clinica_ucu.model.User.DatabaseUser;
import com.example.clinica_ucu.model.response.DefaultResponse;
import com.example.clinica_ucu.model.response.NewFuncionarioResponse;
import com.example.clinica_ucu.model.response.ObtenerReporteResponse;
import com.example.clinica_ucu.security.JwtUtilService;

@Service
public class FuncionarioServiceImpl {

    private Connection con;

    @Value("${spring.datasource.connectionString}")
    private String connectionString;
    @Value("${spring.datasource.databaseName}")
    private String databaseName;
    @Value("${spring.datasource.databaseUsername}")
    private String databaseUser;
    @Value("${spring.datasource.databasePassword}")
    private String databasePassword;

    private void createConection() throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        this.con = DriverManager.getConnection(
                connectionString + databaseName, databaseUser, databasePassword);
    }

    public NewFuncionarioResponse createFuncionario(Funcionario funcionario) {

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
            preparedStmt.setString(8, funcionario.getLogId());

            preparedStmt.execute();

            DefaultResponse defaultResponse = new DefaultResponse("200", "OK");
            NewFuncionarioResponse response = new NewFuncionarioResponse(defaultResponse, "Funcionario Creado");
            con.close();
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            DefaultResponse defaultResponse = new DefaultResponse("400", "Error");
            NewFuncionarioResponse response = new NewFuncionarioResponse(defaultResponse, "Funcionario ya creado");
            return response;

        }

    }

    public DefaultResponse cargarCarnetSalud(CarnetSalud carnetSalud) {
        try {
            createConection();
            String sql = " insert into Carnet_Salud (Ci, Fch_Emision, Fch_Vencimiento  )"
                    + " values (?, ?, ?)";

            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setInt(1, Integer.parseInt(carnetSalud.getCi()));
            preparedStmt.setDate(2, Date.valueOf(carnetSalud.getFch_Emision()));
            preparedStmt.setDate(3, Date.valueOf(carnetSalud.getFch_Vencimiento()));

            preparedStmt.execute();

            DefaultResponse response = new DefaultResponse("200", "Carnet de salud cargado Correctamente.");

            con.close();
            return response;

        } catch (Exception e) {
            e.printStackTrace();
        }
        DefaultResponse response = new DefaultResponse("400", "Error");
        return response;
    }

    public DefaultResponse cargarComprobante(String cI, byte[] file)
            throws ClassNotFoundException, SQLException {
        createConection();
        String sql = " UPDATE Carnet_Salud set Comprobante = ? where Ci = ?";
        Blob blob = new SerialBlob(file);
        PreparedStatement preparedStmt = con.prepareStatement(sql);
        preparedStmt.setInt(1, Integer.parseInt(cI));
        preparedStmt.setBlob(2, blob);

        preparedStmt.execute();

        DefaultResponse response = new DefaultResponse("200", "Carnet de salud cargado Correctamente.");

        con.close();
        return response;
    }

    public ObtenerReporteResponse obtenerReporte() {

        List<Funcionario> Funcionarios = new ArrayList<Funcionario>();
        ObtenerReporteResponse response = new ObtenerReporteResponse();
        try {
            createConection();
            String sql = "select * from Funcionarios as F where F.Ci not in (Select Ci from Carnet_Salud as C where F.Ci = C.ci)";

            PreparedStatement preparedStmt = con.prepareStatement(sql);
            ResultSet rs = preparedStmt.executeQuery();
            while (rs.next()) {
                Funcionario r = new Funcionario(Integer.toString(rs.getInt(1)), rs.getString(2), rs.getString(3),
                        rs.getDate(4).toString(), rs.getString(5),
                        Integer.toString(rs.getInt(6)), rs.getString(7));
                Funcionarios.add(r);

            }

            for (Funcionario funcionario : Funcionarios) {
                System.out.println(funcionario.toString());
            }
            preparedStmt.execute();

            DefaultResponse df = new DefaultResponse("200", "Funcionarios sin carnet de salud:");
            response.setFuncionarios(Funcionarios);
            response.setResponse(df);
            con.close();
            return response;

        } catch (Exception e) {
            e.printStackTrace();
        }
        DefaultResponse df = new DefaultResponse("400", "Error");
        response.setResponse(df);

        return response;
    }
}
