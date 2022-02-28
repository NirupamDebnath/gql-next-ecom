import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import jwt from "jsonwebtoken";
import { defaultFieldResolver, GraphQLSchema } from "graphql";
import { gql } from "apollo-server-core";
import logger from "@utils/logger";
import { User } from "@entity/User";
import { getRepository } from "typeorm";

function authDirective(
  directiveName: string,
  getUserFn: (token: string) => {
    hasRole: (role: string) => Promise<boolean | undefined>;
  }
) {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return {
    authDirectiveTypeDefs: gql`directive @${directiveName}(
        requires: Role = ADMIN,
      ) on OBJECT | FIELD_DEFINITION
  
      enum Role {
        ADMIN
        USER
      }`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const authDirective = getDirective(schema, type, directiveName)?.[0];
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName];
          if (authDirective) {
            const { requires } = authDirective;
            if (requires) {
              const { resolve = defaultFieldResolver } = fieldConfig;
              fieldConfig.resolve = async function (
                source,
                args,
                context,
                info
              ) {
                const authHeaderValues = context.authorization.split(" ");
                let authToken = null;
                if (authHeaderValues.length === 2)
                  authToken = authHeaderValues[1];
                else authToken = authHeaderValues[0];
                const user = getUserFn(authToken);
                context.user = user;
                if (!(await user.hasRole(requires))) {
                  throw new Error("not authorized");
                }
                return resolve(source, args, context, info);
              };
              return fieldConfig;
            }
          }
        },
      }),
  };
}

function getUser(token: string) {
  const roles = ["USER", "ADMIN"];
  const decoded = jwt.verify(token, String(process.env.AUTH_SIGNATURE));
  logger.info(JSON.stringify(decoded));
  return {
    hasRole: async (role: string) => {
      const existingUser: User | undefined = await getRepository(User)
        .createQueryBuilder("user")
        .where("user.email = :email", { email: (<any>decoded).email })
        .getOne();
      logger.info(Object(existingUser).role);
      logger.info(role);
      return existingUser && existingUser.role === role;
    },
  };
}

export const { authDirectiveTypeDefs, authDirectiveTransformer } =
  authDirective("auth", getUser);
