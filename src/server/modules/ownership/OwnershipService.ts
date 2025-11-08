
import { Injectable } from 'najm-api';
import { RoleChecker, ROLES } from '../roles';
import { OwnershipRepository } from './OwnershipRepository';

@Injectable()
export class OwnershipService {
    private cache = new Map();
    private CACHE_TTL = 60000; // 1 minute

    constructor(
        private ownershipRepo: OwnershipRepository,
        private roleChecker: RoleChecker
    ) { }

    async getAccessibleIds(user, resourceType) {

        if (this.roleChecker.isAdministrator(user.role)) {
            return 'ALL';
        }

        const cacheKey = `${resourceType}:${user.id}:${user.role}`;
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        // Method name mapping: role -> resource -> methodName
        const methodPattern = {
            [ROLES.STUDENT]: {
                student: 'getOwnStudentIds',
                parent: 'getStudentParentIds',
                class: 'getStudentClassIds',
                grade: 'getOwnGradeIds',
                section: 'getStudentSectionIds',
                attendance: 'getOwnAttendanceIds',
            },
            [ROLES.TEACHER]: {
                teacher: 'getOwnTeacherIds',
                student: 'getTeacherStudentIds',
                parent: 'getTeacherParentIds',
                class: 'getTeacherClassIds',
                grade: 'getTeacherGradeIds',
                section: 'getTeacherSectionIds',
                attendance: 'getTeacherAttendanceIds',
            },
            [ROLES.PARENT]: {
                parent: 'getOwnParentIds',
                student: 'getParentStudentIds',
                class: 'getParentClassIds',
                grade: 'getParentGradeIds',
                section: 'getParentSectionIds',
                attendance: 'getParentAttendanceIds',
            },
        };

        const methodName = methodPattern[user.role]?.[resourceType];

        if (!methodName || !this.ownershipRepo[methodName]) {
            console.warn(`Missing ownership method: ${methodName} for role ${user.role} and resource ${resourceType}`);
            return [];
        }

        const ids = await this.ownershipRepo[methodName](user.id);
        this.setCache(cacheKey, ids);
        return ids;
    }

    async canAccess(user, resourceType, resourceId) {
        const ids = await this.getAccessibleIds(user, resourceType);
        if (ids === 'ALL') return true;
        return ids.includes(resourceId);
    }

    async canAccessMultiple(user, resourceType, resourceIds) {
        const ids = await this.getAccessibleIds(user, resourceType);
        if (ids === 'ALL') return true;
        return resourceIds.every(id => ids.includes(id));
    }

    clearCache(userId?) {
        if (userId) {
            for (const key of this.cache.keys()) {
                if (key.includes(userId)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }

    private getCache(key) {
        const cached = this.cache.get(key);
        if (!cached || Date.now() - cached.timestamp > this.CACHE_TTL) {
            this.cache.delete(key);
            return null;
        }
        return cached.ids;
    }

    private setCache(key, ids) {
        this.cache.set(key, { ids, timestamp: Date.now() });
    }
}