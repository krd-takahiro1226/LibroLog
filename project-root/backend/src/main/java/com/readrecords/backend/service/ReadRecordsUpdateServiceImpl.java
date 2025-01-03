package com.readrecords.backend.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.readrecords.backend.dto.UserReadRecordsDto;
import com.readrecords.backend.repository.ReadRecordUpdateRepository;

import jakarta.transaction.Transactional;

@Service
public class ReadRecordsUpdateServiceImpl implements ReadRecordsUpdateService {    
    // コンストラクタの依存性注入 (DI)
    private final ReadRecordUpdateRepository readRecordUpdateRepository;
    
    public ReadRecordsUpdateServiceImpl(ReadRecordUpdateRepository readRecordUpdateRepository){
        this.readRecordUpdateRepository = readRecordUpdateRepository;
    }

    @Override
    @Transactional
    public void updateReadRecords (List<UserReadRecordsDto> updateRequestDtos, String userId){
        for(UserReadRecordsDto request : updateRequestDtos){
            // Todo UserReadRecordsDtoの表現より、スネークケースとキャメルケースが混在
            Optional<Integer> optionalRecordId= readRecordUpdateRepository.findRecordIdByIsbnAndUserId(request.getISBN(), userId);
            if(optionalRecordId.isPresent()){
                Integer recordId = optionalRecordId.get();
                readRecordUpdateRepository.updateReadRecord(
                    recordId,
                    request.getStart_date(),
                    request.getEnd_date(),
                    request.getPriority()
                );
            }else{
                throw new RuntimeException("Record not found for ISBN: " + request.getISBN());
            }
        }
    }
}
