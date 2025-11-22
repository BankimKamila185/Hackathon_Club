const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    // Min 6 chars, at least one number and one letter
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return re.test(password);
};

export { validateEmail, validatePassword };
