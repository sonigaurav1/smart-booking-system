/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as appointments from "../appointments.js";
import type * as employees from "../employees.js";
import type * as functions_helpers_requireRole from "../functions/helpers/requireRole.js";
import type * as functions_mutations_bookAppointment from "../functions/mutations/bookAppointment.js";
import type * as functions_mutations_createBusiness from "../functions/mutations/createBusiness.js";
import type * as functions_mutations_createEmployee from "../functions/mutations/createEmployee.js";
import type * as functions_mutations_createService from "../functions/mutations/createService.js";
import type * as functions_mutations_deleteEmployee from "../functions/mutations/deleteEmployee.js";
import type * as functions_mutations_deleteService from "../functions/mutations/deleteService.js";
import type * as functions_mutations_updateEmployee from "../functions/mutations/updateEmployee.js";
import type * as functions_mutations_updateService from "../functions/mutations/updateService.js";
import type * as functions_mutations_updateUserRole from "../functions/mutations/updateUserRole.js";
import type * as functions_queries_getAppointmentsForBusiness from "../functions/queries/getAppointmentsForBusiness.js";
import type * as functions_queries_getBusinessById from "../functions/queries/getBusinessById.js";
import type * as functions_queries_getBusinessBySlug from "../functions/queries/getBusinessBySlug.js";
import type * as functions_queries_getBusinessForClerk from "../functions/queries/getBusinessForClerk.js";
import type * as functions_queries_getEmployeeById from "../functions/queries/getEmployeeById.js";
import type * as functions_queries_getServiceById from "../functions/queries/getServiceById.js";
import type * as functions_queries_listBusinesses from "../functions/queries/listBusinesses.js";
import type * as functions_queries_listServicesForBusiness from "../functions/queries/listServicesForBusiness.js";
import type * as lib_auth_clerk from "../lib/auth/clerk.js";
import type * as lib_roles from "../lib/roles.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  appointments: typeof appointments;
  employees: typeof employees;
  "functions/helpers/requireRole": typeof functions_helpers_requireRole;
  "functions/mutations/bookAppointment": typeof functions_mutations_bookAppointment;
  "functions/mutations/createBusiness": typeof functions_mutations_createBusiness;
  "functions/mutations/createEmployee": typeof functions_mutations_createEmployee;
  "functions/mutations/createService": typeof functions_mutations_createService;
  "functions/mutations/deleteEmployee": typeof functions_mutations_deleteEmployee;
  "functions/mutations/deleteService": typeof functions_mutations_deleteService;
  "functions/mutations/updateEmployee": typeof functions_mutations_updateEmployee;
  "functions/mutations/updateService": typeof functions_mutations_updateService;
  "functions/mutations/updateUserRole": typeof functions_mutations_updateUserRole;
  "functions/queries/getAppointmentsForBusiness": typeof functions_queries_getAppointmentsForBusiness;
  "functions/queries/getBusinessById": typeof functions_queries_getBusinessById;
  "functions/queries/getBusinessBySlug": typeof functions_queries_getBusinessBySlug;
  "functions/queries/getBusinessForClerk": typeof functions_queries_getBusinessForClerk;
  "functions/queries/getEmployeeById": typeof functions_queries_getEmployeeById;
  "functions/queries/getServiceById": typeof functions_queries_getServiceById;
  "functions/queries/listBusinesses": typeof functions_queries_listBusinesses;
  "functions/queries/listServicesForBusiness": typeof functions_queries_listServicesForBusiness;
  "lib/auth/clerk": typeof lib_auth_clerk;
  "lib/roles": typeof lib_roles;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
