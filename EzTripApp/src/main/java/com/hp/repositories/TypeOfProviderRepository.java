/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.repositories;

import com.hp.pojo.TypeOfProvider;

/**
 *
 * @author Joon
 */
public interface TypeOfProviderRepository {
    TypeOfProvider getTypeOfProviderByName(String name);
}
