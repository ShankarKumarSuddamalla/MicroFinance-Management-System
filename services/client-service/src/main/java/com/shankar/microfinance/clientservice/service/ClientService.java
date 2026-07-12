package com.shankar.microfinance.clientservice.service;

import com.shankar.microfinance.clientservice.dto.request.ClientRequest;
import com.shankar.microfinance.clientservice.dto.response.ClientResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ClientService {

    ClientResponse createClient(

            ClientRequest request,

            Long authUserId

    );

    ClientResponse getClientByClientNumber(String clientNumber);

    Page<ClientResponse> getAllClients(int page,int size,String sortBy);

    ClientResponse updateClient(String clientNumber,
                                ClientRequest request);

    void deleteClient(String clientNumber);

    ClientResponse getClientByMobile(String mobileNumber);
    ClientResponse getClientByAadhaar(String aadhaarNumber);
    ClientResponse getClientByPan(String panNumber);
    List<ClientResponse> searchByFirstName(String firstName);
}