import { body } from "express-validator";

export const registerValidator = [
    body("fullName")
        .notEmpty()
        .withMessage("Name required"),

    body("email")
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage(
            "Password minimum 6 chars"
        ),

    body("mobile")
        .notEmpty()
        .withMessage("Mobile required"),
];