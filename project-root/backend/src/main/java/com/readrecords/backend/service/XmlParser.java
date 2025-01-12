package com.readrecords.backend.service;

import com.readrecords.backend.dto.SearchBooksResponseDto;
import java.io.StringReader;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import org.springframework.stereotype.Service;

@Service
public class XmlParser {
  public SearchBooksResponseDto parse(String xml) throws JAXBException {
    JAXBContext jaxbContext = JAXBContext
        .newInstance(SearchBooksResponseDto.class);
    Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
    StringReader reader = new StringReader(xml);
    return (SearchBooksResponseDto) unmarshaller.unmarshal(reader);
  }
}
