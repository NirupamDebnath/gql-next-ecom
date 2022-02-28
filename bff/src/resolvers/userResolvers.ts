import jwt from "jsonwebtoken";
import { sendSineUpTokenEmail } from "@utils/email";
import { getConnection, QueryFailedError, getRepository } from "typeorm";
import { User } from "@entity/User";
import bcrypt from "bcrypt";
import logger from "@logger";
import { finished } from "stream/promises";
import { GraphQLUpload } from "graphql-upload";

interface UserSignUpDetails {
  email: string;
  firstName: string;
  lastName: string;
}

interface CoreQueryFailedError extends QueryFailedError {
  code?: string;
  stack?: string;
}

export const resolvers = {
  Query: {
    signup: async (
      _parents: any,
      {
        email,
        firstName,
        lastName,
      }: {
        email: string;
        firstName: string;
        lastName: string;
      },
      _ctx: any,
      _info: any
    ) => {
      const existingUser: User | undefined = await getRepository(User)
        .createQueryBuilder("user")
        .select(["user.email"])
        .where("user.email = :email", { email })
        .getOne();
      if (existingUser && existingUser.email === email) {
        logger.error(new Error("User with this email already exists"));
        throw Error("Email already exists");
      }
      const token = jwt.sign(
        {
          email,
          firstName,
          lastName,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        String(process.env.USER_SIGNUP_SIGNATURE),
        {
          algorithm: "HS256",
        }
      );
      await sendSineUpTokenEmail(token, email);
      return `Please click on the link sent to your email for login`;
    },
    verifyEmail: (_parents: any, { token }: any, _ctx: any, _info: any) => {
      const decoded = jwt.verify(
        token,
        String(process.env.USER_SIGNUP_SIGNATURE)
      );
      return jwt.sign(
        {
          ...(decoded as UserSignUpDetails),
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        String(process.env.SET_PASSWORD_SIGNATURE),
        {
          algorithm: "HS256",
        }
      );
    },
    hello: async (_parents: any, _args: any, _ctx: any, _info: any) => {
      return "Hello Megha";
    },
    signin: async (
      _parents: any,
      { email, password }: { email: string; password: string },
      _ctx: any,
      _info: any
    ) => {
      const user: User = await getConnection()
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.email = :email", { email })
        .addSelect("user.password")
        .getOneOrFail();

      const isValidPassword = await bcrypt.compare(password, user.password);
      logger.info(`Login successfull ${isValidPassword}`);
      if (isValidPassword) {
        const token = jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          },
          String(process.env.AUTH_SIGNATURE),
          {
            algorithm: "HS256",
          }
        );
        return {
          access_token: token,
        };
      } else {
        throw Error("Invalid Credential");
      }
    },
  },
  // Upload: GraphQLUpload,
  Mutation: {
    createUser: async (
      _parents: any,
      { token, password }: { token: string; password: string },
      _ctx: any,
      _info: any
    ) => {
      const decoded = jwt.verify(
        token,
        String(process.env.SET_PASSWORD_SIGNATURE)
      );
      const { email, firstName, lastName } = decoded as UserSignUpDetails;

      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([{ email, firstName, lastName, password: hashedPassword }])
          .execute();
      } catch (error) {
        if (error instanceof QueryFailedError) {
          if ((error as CoreQueryFailedError).code) {
            throw Error("Email Id already exists");
          }
        }
      }

      return "User created successfully";
    },
    uploadPayslip: async (
      _parent: any,
      { file }: any,
      _ctx: any,
      _info: any
    ) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      // Invoking the `createReadStream` will return a Readable Stream.
      // See https://nodejs.org/api/stream.html#stream_readable_streams
      logger.info("Creating stream");
      const stream = createReadStream();
      logger.info("reading out stream");

      // This is purely for demonstration purposes and will overwrite the
      // local-file-output.txt in the current working directory on EACH upload.
      const out = require("fs").createWriteStream(
        `./data/payslip/${filename}.txt`
      );
      stream.pipe(out);
      await finished(out);

      return { filename, mimetype, encoding };
    },
  },
};
