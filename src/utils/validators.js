import  { check } from "express-validator";

/// HOST REGISTRATION VALIDATION ///
const hostRegisterValidator = [ 
    check("name")
         .trim()
         .notEmpty().withMessage("Name is required")
         .isAlpha("en-US", { ignore: " " }).withMessage("Name must contain only letters and spaces"),

    check("email")
         .trim()
         .notEmpty().withMessage("Email is required")
         .isEmail().withMessage("Invalid email address")
         .normalizeEmail(),
         
    check("password")
         .trim()
         .notEmpty().withMessage("Password is required")
         .isLength( {min: 8, max: 20} ).withMessage("Password must contain minimum 8 characters"),

    check("phoneNumber")
         .trim()
         .notEmpty().withMessage("Phone Number is required")
         .isNumeric().withMessage("Phone Number must only contain numbers")
         .isLength( { min: 10, max: 10 } ).withMessage("Phone Number must contain only 10 digits")
]

/// HOST LOGIN VALIDATION ///
const hostLoginValidator = [
    check("email")
         .trim()
         .notEmpty().withMessage("Email is required")
         .isEmail().withMessage("Invalid email address")
         .normalizeEmail(),

    check("password")
         .trim()
         .notEmpty().withMessage("Password is required")     
]


/// USER REGISTRATION VALIDATION ///
const userRegisterValidator = [
     check("firstName")
          .trim()
          .notEmpty().withMessage("First Name is required")
          .isAlpha("en-US", { ignore: " " }).withMessage("First Name must contain only letters and spaces"),

     check("lastName")
           .trim()
           .notEmpty().withMessage("First Name is required")
           .isAlpha("en-US", { ignore: " " }).withMessage("First Name must contain only letters and spaces"),

     check("email")
           .trim()
           .notEmpty().withMessage("Email is required")
           .isEmail().withMessage("Invalid email address")
           .normalizeEmail(),

     check("phoneNumber")
           .trim()
           .notEmpty().withMessage("Phone Number is required")
           .isNumeric().withMessage("Phone Number must only contain numbers")
           .isLength( { min: 10, max: 10 } ).withMessage("Phone Number must contain only 10 digits"),

     check("password")
           .trim()
           .notEmpty().withMessage("Password is required")
           .isLength( {min: 8, max: 20} ).withMessage("Password must contain minimum 8 characters"),
]

/// USER LOGIN VALIDATION ///
const userLoginValidator = [
     check("email")
          .trim()
          .notEmpty().withMessage("Email is required")
          .isEmail().withMessage("Invalid email address")
          .normalizeEmail(),
 
     check("password")
          .trim()
          .notEmpty().withMessage("Password is required")     
 ]

export { 
     hostRegisterValidator,
     hostLoginValidator,
     userRegisterValidator,
     userLoginValidator
 }