import { Injectable } from '@nestjs/common';
import { Project } from 'src/project/entities/project.entity';
import { Role } from 'src/shared/role.enum';
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';
import { User } from 'src/user/entities/user.entity';

/**
 *
 * @param currentUser - Utilisateur authentifié (généralement currentUser)
 * @param target - Ressource User à comparer
 * @param project - Projet concerné
 *
 */

@Injectable()
export class PermissionsService {
	isAdmin(currentUser: JwtPayload): boolean {
		return currentUser.role === Role.Admin;
	}

	isOwner(currentUser: JwtPayload, target: User): boolean {
		return currentUser.sub === target.id;
	}

	isProjectOverseer(currentUser: JwtPayload, project: Project): boolean {
		return project.overseer?.id === currentUser.sub;
	}

	isProjectMember(currentUser: JwtPayload, project: Project): boolean {
		return (
			project.members?.some((member) => member.id === currentUser.sub) ?? false
		);
	}

	hasSomeRole(loggedUser: User, requiredRoles: Role[]): boolean {
		return requiredRoles.some((role) => loggedUser.role?.includes(role));
	}

	canViewProject(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) ||
			this.isProjectOverseer(currentUser, project) ||
			this.isProjectMember(currentUser, project)
		);
	}

	canCreatePhase(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) || this.isProjectOverseer(currentUser, project)
		);
	}

	canEditPhase(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) || this.isProjectOverseer(currentUser, project)
		);
	}

	canDeletePhase(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) || this.isProjectOverseer(currentUser, project)
		);
	}

	canCreateStep(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) ||
			this.isProjectOverseer(currentUser, project) ||
			this.isProjectMember(currentUser, project)
		);
	}

	canReadStep(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) ||
			this.isProjectOverseer(currentUser, project) ||
			this.isProjectMember(currentUser, project)
		);
	}

	canEditStep(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) ||
			this.isProjectOverseer(currentUser, project) ||
			this.isProjectMember(currentUser, project)
		);
	}

	canDeleteStep(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) ||
			this.isProjectOverseer(currentUser, project) ||
			this.isProjectMember(currentUser, project)
		);
	}

	canEditTask(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) ||
			this.isProjectOverseer(currentUser, project) ||
			this.isProjectMember(currentUser, project)
		);
	}

	canDeleteTask(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) || this.isProjectOverseer(currentUser, project)
		);
	}

	canProposeProjectClosure(currentUser: JwtPayload, project: Project): boolean {
		return this.isProjectOverseer(currentUser, project);
	}

	canCloseProject(currentUser: JwtPayload): boolean {
		return this.isAdmin(currentUser);
	}

	canAssignOverseer(currentUser: JwtPayload): boolean {
		return this.isAdmin(currentUser);
	}

	canAssignMember(currentUser: JwtPayload, project: Project): boolean {
		return (
			this.isAdmin(currentUser) || this.isProjectOverseer(currentUser, project)
		);
	}
}
