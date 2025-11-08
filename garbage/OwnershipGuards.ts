import { TeacherRepository, StudentRepository, ParentRepository, UserRepository } from "@/server/modules";
import { Guards, Headers, Ctx, Params } from "najm-api";
import { createOwnershipGuard } from "./utils";
import { getInstance } from "najm-api";


const checkTeacherOwnership = createOwnershipGuard(async (userId, teacherId) => {
   const teacherRepository = getInstance(TeacherRepository);
   return await teacherRepository.isOwner(userId, teacherId);
});

const checkStudentOwnership = createOwnershipGuard(async (userId, studentId, userRole) => {
   const studentRepository = getInstance(StudentRepository);
   return await studentRepository.isOwner(userId, studentId, userRole);
});

const checkParentOwnership = createOwnershipGuard(async (userId, parentId) => {
   const parentRepository = getInstance(ParentRepository);
   return await parentRepository.isOwner(userId, parentId);
});


export class OwnershipGuards {
   static async isTeacherOwner(@Params('id') teacherId, @Headers('authorization') authorization, @Ctx() context) {
      return await checkTeacherOwnership(authorization, context, teacherId);
   }

   static async isStudentOwner(@Params('id') studentId, @Headers('authorization') authorization, @Ctx() context) {
      return await checkStudentOwnership(authorization, context, studentId);
   }

   static async isParentOwner(@Params('id') parentId, @Headers('authorization') authorization, @Ctx() context) {
      return await checkParentOwnership(authorization, context, parentId);
   }
}

export const isTeacherOwner = () => Guards(OwnershipGuards.isTeacherOwner);
export const isStudentOwner = () => Guards(OwnershipGuards.isStudentOwner);
export const isParentOwner = () => Guards(OwnershipGuards.isParentOwner);


