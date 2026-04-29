export const registerSchema = {
  body: {
    type: "object",
    required: [
      "username",
      "display_name",
      "email",
      "phone",
      "birthdate",
      "password",
    ],
    properties: {
      username: {
        type: "string",
        minLength: 3,
        maxLength: 30,
      },
      visibility: {
        type: "string",
        enum: ["private", "public"],
      },
      profile_image: {
        type: "string",
        format: "uri",
      },
      bio: {
        type: "string",
        maxLength: 500,
      },
      display_name: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
      email: {
        type: "string",
        format: "email",
      },
      phone: {
        type: "string",
        pattern: "^\\+?[1-9]\\d{7,14}$",
      },
      birthdate: {
        type: "string",
        format: "date",
      },
      password: {
        type: "string",
        minLength: 8,
      },
    },
    additionalProperties: false,
  },
};
