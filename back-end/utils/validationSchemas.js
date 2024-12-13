const registerHotelValidation = {
    name: {
        notEmpty: {
            errorMessage: "Name field must not be empty"
        }
    },
    email: {
        isEmail: {
            errorMessage: "Email must be valid"
        },
        notEmpty: {
            errorMessage: "Email field must not be empty"
        }
    },
    phoneNumber: {
        isLength: {
            options: {
                min: 10,
                max: 10
            },
            errorMessage: "Phone number must be 10 numbers long"
        },
        notEmpty: {
            errorMessage: "Phone number field must not be empty"
        }
    },
    roomsCount: {
        isNumeric: {
            errorMessage: "Rooms count must be a number"
        },
        notEmpty: {
            errorMessage: "Rooms count field must not be empty"
        }
    },
    address: {
        notEmpty: {
            errorMessage: "Address field must not be empty"
        }
    },
    login: {
        notEmpty: {
            errorMessage: "Login field must not be empty"
        }
    },
    password: {
        isLength: {
            options: {
                min: 8
            },
            errorMessage: "Password must be at least 8 characters long"
        },
        notEmpty: {
            errorMessage: "Password field must not be empty"
        }
    }
}

const createRoomValidation = {
    number: {
        isNumeric: {
            errorMessage: "Room number must be a number"
        },
        notEmpty: {
            errorMessage:"Number field must not be empty"
        }
    },
    type: {
        notEmpty: {
            errorMessage:"Type field must not be empty"
        }
    },
    capacity: {
        isNumeric: {
            errorMessage: "Room capacity must be a number"
        },
        notEmpty: {
            errorMessage:"Capacity field must not be empty"
        }
    },
    name: {
        notEmpty: {
            errorMessage:"Name field must not be empty"
        }
    },
    description: {

    },
    price: {
        isNumeric: {
            errorMessage: "Room price must be a number"
        },
        notEmpty: {
            errorMessage:"Price field must not be empty"
        }
    }
};

module.exports = {registerHotelValidation, createRoomValidation};