import { Controller, Get, Post, Headers, t } from 'najm-api';
import { SeedService } from './SeedService';
import { isAdmin } from '@/server/modules/roles/RoleGuards';



@Controller('/seed')
export class SeedController {
  constructor(
    private seedService: SeedService,
  ) { }

  @Post('/system')
  async seedSystem(@Headers('seed_api_key') API_KEY) {
    const data = await this.seedService.seedSystem(API_KEY);
    return {
      data,
      message: t('seed.success.systemSeeded'),
      status: 'success'
    };
  }

  @Post('/demo')
  @isAdmin()
  async seedDemo(@Headers('seed_api_key') API_KEY) {
    await this.seedService.seedDemo(API_KEY);
    return {
      data: null,
      message: 'System seeded successfully',
      status: 'success'
    };
  }

  @Post('/clear')
  async clearAllData() {
    await this.seedService.clearAll();
    return {
      data: null,
      message: 'All data cleared successfully',
      status: 'success'
    };
  }

}
