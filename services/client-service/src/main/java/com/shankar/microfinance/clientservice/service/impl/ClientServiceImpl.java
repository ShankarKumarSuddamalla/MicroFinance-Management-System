package com.shankar.microfinance.clientservice.service.impl;

import com.shankar.microfinance.clientservice.dto.request.ClientRequest;
import com.shankar.microfinance.clientservice.dto.response.ClientResponse;
import com.shankar.microfinance.clientservice.entity.Client;
import com.shankar.microfinance.clientservice.entity.enums.KycStatus;
import com.shankar.microfinance.clientservice.exception.DuplicateResourceException;
import com.shankar.microfinance.clientservice.exception.ResourceNotFoundException;
import com.shankar.microfinance.clientservice.repository.ClientRepository;
import com.shankar.microfinance.clientservice.service.ClientService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public ClientResponse createClient(ClientRequest request,  Long authUserId) {

        if (clientRepository.existsByAadhaarNumber(request.getAadhaarNumber())) {
            throw new DuplicateResourceException("Aadhaar number already exists");
        }

        if (clientRepository.existsByPanNumber(request.getPanNumber())) {
            throw new DuplicateResourceException("PAN number already exists");
        }

        Client client = new Client();

        client.setClientNumber(generateClientNumber());

        // Later we will add AuthUserId from JWT after Auth Service integration.
        client.setAuthUserId(authUserId);

        client.setFirstName(request.getFirstName());
        client.setLastName(request.getLastName());
        client.setGender(request.getGender());
        client.setDateOfBirth(request.getDateOfBirth());
        client.setMobileNumber(request.getMobileNumber());
        client.setEmail(request.getEmail());
        client.setAadhaarNumber(request.getAadhaarNumber());
        client.setPanNumber(request.getPanNumber());
        client.setOccupation(request.getOccupation());
        client.setMonthlyIncome(request.getMonthlyIncome());
        client.setMaritalStatus(request.getMaritalStatus());
        client.setAddressLine1(request.getAddressLine1());
        client.setAddressLine2(request.getAddressLine2());
        client.setCity(request.getCity());
        client.setState(request.getState());
        client.setPostalCode(request.getPostalCode());
        client.setCountry(request.getCountry());
        client.setKycStatus(KycStatus.PENDING);

        Client savedClient = clientRepository.save(client);

        return mapToResponse(savedClient);
    }

    @Override
    public ClientResponse getClientByClientNumber(String clientNumber) {

        Client client = clientRepository
                .findByClientNumber(clientNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Client not found"));

        return mapToResponse(client);
    }

    @Override
    public Page<ClientResponse> getAllClients(int page, int size, String sortBy) {

        Pageable pageable= PageRequest.of(page,size, Sort.by(sortBy));
        return clientRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public ClientResponse updateClient(String clientNumber,
                                       ClientRequest request) {

        Client client = clientRepository
                .findByClientNumber(clientNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Client not found"));

        client.setFirstName(request.getFirstName());
        client.setLastName(request.getLastName());
        client.setGender(request.getGender());
        client.setDateOfBirth(request.getDateOfBirth());
        client.setMobileNumber(request.getMobileNumber());
        client.setEmail(request.getEmail());
        client.setOccupation(request.getOccupation());
        client.setMonthlyIncome(request.getMonthlyIncome());
        client.setMaritalStatus(request.getMaritalStatus());
        client.setAddressLine1(request.getAddressLine1());
        client.setAddressLine2(request.getAddressLine2());
        client.setCity(request.getCity());
        client.setState(request.getState());
        client.setPostalCode(request.getPostalCode());
        client.setCountry(request.getCountry());

        Client updatedClient = clientRepository.save(client);

        return mapToResponse(updatedClient);
    }

    @Override
    public void deleteClient(String clientNumber) {

        Client client = clientRepository
                .findByClientNumber(clientNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Client not found"));

        clientRepository.delete(client);
    }

    //Converts Entity into DTOs
    private ClientResponse mapToResponse(Client client) {

        ClientResponse response = new ClientResponse();

        response.setClientNumber(client.getClientNumber());
        response.setFirstName(client.getFirstName());
        response.setLastName(client.getLastName());
        response.setMobileNumber(client.getMobileNumber());
        response.setEmail(client.getEmail());
        response.setMonthlyIncome(client.getMonthlyIncome());
        response.setKycStatus(client.getKycStatus());

        return response;
    }
    private String generateClientNumber() {

        long count = clientRepository.count() + 1;

        return String.format("CLI%06d", count);
    }

    @Override
    public ClientResponse getClientByMobile(String mobileNumber) {

        Client client = clientRepository
                .findByMobileNumber(mobileNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Client not found"));

        return mapToResponse(client);
    }

    @Override
    public ClientResponse getClientByAadhaar(String aadhaarNumber) {

        Client client = clientRepository
                .findByAadhaarNumber(aadhaarNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Client not found"));

        return mapToResponse(client);
    }

    @Override
    public ClientResponse getClientByPan(String panNumber) {

        Client client = clientRepository
                .findByPanNumber(panNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Client not found"));

        return mapToResponse(client);
    }
    @Override
    public List<ClientResponse> searchByFirstName(String firstName) {

        return clientRepository
                .findByFirstNameContainingIgnoreCase(firstName)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}