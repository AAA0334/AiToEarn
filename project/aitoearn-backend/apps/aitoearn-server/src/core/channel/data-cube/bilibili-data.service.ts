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
import { BilibiliService } from '../platforms/bilibili/bilibili.service'
import { DataCubeBase } from './data.base'

@Injectable()
export class BilibiliDataService extends DataCubeBase {
  constructor(
    readonly bilibiliService: BilibiliService,
    private readonly accountRepository: AccountRepository,
  ) {
    super()
  }

  @OnEvent(`account.create.${AccountType.BILIBILI}`)
  async accountPortraitReport(accountId: string) {
    const res = await this.getAccountDataCube(accountId)
    await this.accountRepository.updateAccountStatistics(accountId, {
      workCount: res.arcNum,
      fansCount: res.fensNum,
    })
  }

  async getAccountDataCube(accountId: string) {
    const res = await this.bilibiliService.getUserStat(accountId)
    return {
      fensNum: res.follower,
      arcNum: res.arc_passed_total,
    }
  }

  async getArcDataCube(accountId: string, dataId: string) {
    const res = await this.bilibiliService.getArcStat(accountId, dataId)

    return {
      fensNum: res.favorite,
      playNum: res.view,
      commentNum: res.reply,
      likeNum: res.like,
      shareNum: res.share,
      collectNum: res.favorite,
    }
  }
}
