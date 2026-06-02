/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hp.controllers.admin;

import java.text.ParseException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.hp.dto.user.UserCreateDTO;
import com.hp.services.GenderService;
import com.hp.services.RoleService;
import com.hp.services.TypeOfProviderService;
import com.hp.services.UserService;

/**
 *
 * @author Joon
 */
@Controller
@RequestMapping("/admin")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private GenderService genderService;

    @Autowired
    private TypeOfProviderService typeOfProviderService;

    @GetMapping("/users")
    public String usersView(Model model, @RequestParam Map<String, String> params) {
        int currentPage = 1;

        try {
            currentPage = Integer.parseInt(params.getOrDefault("page", "1"));
        } catch (NumberFormatException e) {
            currentPage = 1;
        }

        if (currentPage < 1) {
            currentPage = 1;
            params.put("page", "1");
        }
        model.addAttribute("users", this.userService.getUsers(params));
        model.addAttribute("roles", this.roleService.getRoles());
        model.addAttribute("currentPage", currentPage);
        model.addAttribute("params", params);
        return "users";
    }

    @PostMapping("/api/users/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void setActive(@PathVariable("id") Integer userId, @RequestParam("active") boolean active) {
        this.userService.setActive(userId, active);
    }

    @GetMapping("/users/create")
    public String createUserView(Model model) {
        UserCreateDTO user = new UserCreateDTO(
                null, null, null, null, null,
                null, null, null, null, null,
                null);
        model.addAttribute("user", user);
        model.addAttribute("roles", this.roleService.getRoles());
        model.addAttribute("genders", this.genderService.getGenders());
        model.addAttribute("typesOfProviders", this.typeOfProviderService.getTypeOfProviders());
        return "user_create";
    }

    @PostMapping("/users/create")
    public String createUser(@ModelAttribute(name = "user") UserCreateDTO user) throws ParseException {
        this.userService.addUser(user);
        return "redirect:/admin/users";
    }

}
