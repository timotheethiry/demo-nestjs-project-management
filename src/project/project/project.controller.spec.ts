import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

describe('ProjectController', () => {
	let controller: ProjectController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProjectController],
			providers: [ProjectService],
		}).compile();

		controller = module.get<ProjectController>(ProjectController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
