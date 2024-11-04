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
     check("name")
          .trim()
          .notEmpty().withMessage("Name is required")
          .isAlpha("en-US", { ignore: " " }).withMessage("Name must contain only letters and spaces"),

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

/// USER UPDATE VALIDATION ///
const userUpdateValidator = [
     check("fullName")
           .trim()
           .isAlpha("en-US", { ignore: " " }).withMessage("Name must contain only letters and spaces"),
     
     check("dateOfBirth")
           .optional({ checkFalsy: true })
           .toDate(),
           
     check("gender")
           .optional({ checkFalsy: true })
           .trim()
           .toLowerCase()
           .isIn(["male", "female", "other"]).withMessage("Gender must be either male , female, or other "),

     check("areaPincode")
           .optional({ checkFalsy: true })
           .trim()
           .isNumeric(),

     check("addressLine1")
           .optional({ checkFalsy: true })
           .trim()
           .isLength({ max: 255 }).withMessage("Characters limit exceeded"),

     check("addressLine2")
           .optional({ checkFalsy: true })
           .trim()
           .isLength({ max: 255 }).withMessage("Characters limit exceeded"),
     
     check("landmark")
           .optional({ checkFalsy: true })
           .trim()
           .isLength({ max: 100 }),

     check("state")
           .optional({ checkFalsy: true })
           .trim()
           .isAlpha("en-US", { ignore: " " }).withMessage("State must only be in letters"),
     
     check("country")
           .optional({ checkFalsy: true })
           .trim()
           .isAlpha("en-US", { ignore: " " })
]

export { 
     hostRegisterValidator,
     hostLoginValidator,
     userRegisterValidator,
     userLoginValidator,
     userUpdateValidator
 }