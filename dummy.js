import { User } from './models/postgres/user.js';

const createUsers = async (usersData) => {
  try {
    const users = await Promise.all(
      usersData.map(async (userData) => {
        const newUser = await User.create(userData);
        return newUser;
      })
    );

    return users;
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  const usersData = [
    {
        "firstName": "Pedro",
        "lastName": "Medina",
        "email": "pedrojosmed@gmail.com",
        "password": "21412341341",
        "photourl": "https://lh3.googleusercontent.com/a/ACg8ocIeaB47J_Sg0s4vxaT6MhDSdZ9MxPXpiQqGt4q2P488=s96-c",
        "address": "123 Main St",
        "city": "Miami",
        "phoneNumber": "555-1234",
        "isAdmin": false,
        "resetToken": null,
        "resetTokenExpiration": null,
        "emailSubscription": true,
        "accountStatus": "active",
        "lastLogin": "2024-08-10T10:00:00Z"
      }
  ];

  const users = await createUsers(usersData);

  console.log(users);
})();
