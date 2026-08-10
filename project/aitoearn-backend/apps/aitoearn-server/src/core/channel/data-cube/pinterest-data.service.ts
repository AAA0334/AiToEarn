/*
 * @Author: nevin
 * @Date: 2025-02-15 20:59:55
 * @LastEditTime: 2025-04-27 17:58:21
 * @LastEditors: nevin
 * @Description: b站-统计数据
 */
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { AccountType } from '@yikart/common'
import { AccountRepository } from '@yikart/mongodb'
import { PinterestService } from '../platforms/pinterest/pinterest.service'
import { DataCubeBase } from './data.base'

@Injectable()
export class PinterestDataService extends DataCubeBase {
  constructor(
    readonly pinterestService: PinterestService,
    private readonly accountRepository: AccountRepository,
  ) {
    super()
  }

  @OnEvent(`account.create.${AccountType.PINTEREST}`)
  async accountPortraitReport(accountId: string) {
    const res = await this.getAccountDataCube(accountId)
    await this.accountRepository.updateAccountStatistics(accountId, {
      workCount: res.arcNum,
      fansCount: res.fensNum,
    })
  }

  async getAccountDataCube(accountId: string) {
    const res: any = await this.pinterestService.getUserStat(accountId)
    return {
      fensNum: res.userInfo.follower,
      arcNum: res.userInfo.monthly_views,
    }
  }

  async getArcDataCube(accountId: string) {
    const res: any = await this.pinterestService.getUserStat(accountId)
    const { userInfo } = res
    return {
      fensNum: userInfo.follower_count,
      playNum: userInfo.monthly_views,
      pin_count: userInfo.pin_count,
      board_count: userInfo.board_count,
    }
  }
}
