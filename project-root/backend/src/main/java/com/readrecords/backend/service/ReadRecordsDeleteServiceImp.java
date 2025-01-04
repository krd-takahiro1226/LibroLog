package com.readrecords.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.readrecords.backend.repository.ReadRecordsDeleteRepository;

import jakarta.transaction.Transactional;

@Service
public class ReadRecordsDeleteServiceImp implements ReadRecordsDeleteService {
    // コンストラクタの依存性注入（DI）
    private final ReadRecordsDeleteRepository readRecordsDeleteRepository;
    public ReadRecordsDeleteServiceImp(ReadRecordsDeleteRepository readRecordsDeleteRepository){
        this.readRecordsDeleteRepository = readRecordsDeleteRepository;
    }

    @Override
    @Transactional
    public void deleteReadRecords(List<String> ISBNs, String userId){
        for(String ISBN: ISBNs){
           Optional<Integer> optionalRecordId= readRecordsDeleteRepository.findRecordIdByIsbnAndUserId(ISBN, userId);
           if(optionalRecordId.isPresent()){
            Integer recordId = optionalRecordId.get();
            readRecordsDeleteRepository. deleteReadRecords(recordId,userId);
           }else{
            throw new RuntimeException("Record not found for ISBN: " + ISBN);
           }
        }
    }


}
