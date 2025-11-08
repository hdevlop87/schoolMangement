import {combineGuards } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";


export const canAccessSubject = () => combineGuards(Permission('read:subjects'));
export const canUpdateSubject = () => combineGuards(Permission('update:subjects'), isAdministrator);
export const canCreateSubject = () => combineGuards(Permission('create:subjects'), isAdministrator);
export const canDeleteSubject = () => combineGuards(Permission('delete:subjects'), isAdministrator);
export const canAccessAllSubjects = () => combineGuards(Permission('read:subjects'), isAdministrator);