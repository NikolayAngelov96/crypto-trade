exports.validateUser = (userData) => {
  const { username, email, password, repeatPassword } = userData;

  if (!username || !email || !password || !repeatPassword) {
    throw new Error("All fields are required");
  }

  if (username.length < 5) {
    throw new Error("Username should be at least 5 characters long");
  }

  if (email.length < 10) {
    throw new Error("Email should be at least 10 characters long");
  }

  if (password.length < 4) {
    throw new Error("Password should be at least 4 characters long");
  }

  if (password !== repeatPassword) {
    throw new Error("Passwords do not match");
  }
};

exports.validateCrypto = (crypto) => {
  const { name, image, price, description, paymentMethod } = crypto;

  if (!name || !image || !price || !description || !paymentMethod) {
    throw new Error("All fields are required");
  }

  if (name.length < 2) {
    throw new Error("Name should be at least 2 characters");
  }

  if (Number(price) < 0) {
    throw new Error("Price should be a positive number");
  }

  if (!image.startsWith("http")) {
    throw new Error("Image should start with http/s");
  }

  if (description.length < 10) {
    throw new Error("Description should be at least 10 characters long");
  }
};
