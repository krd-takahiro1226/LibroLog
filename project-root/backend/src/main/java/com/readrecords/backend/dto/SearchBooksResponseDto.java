package com.readrecords.backend.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@XmlRootElement(name = "root")
@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class SearchBooksResponseDto {
    @XmlElementWrapper(name = "Items")
    @XmlElement(name = "Item")
    private List<SearchBooksItemDto> items;
    @XmlElement(name = "carrier")
    private int carrier;
    @XmlElement(name = "count")
    private int count;
    @XmlElement(name = "first")
    private int first;
    @XmlElement(name = "hits")
    private int hits;
    @XmlElement(name = "last")
    private int last;
    @XmlElement(name = "page")
    private int page;
    @XmlElement(name = "pageCount")
    private int pageCount;
}
