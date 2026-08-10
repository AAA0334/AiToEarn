import { Logger } from '@nestjs/common'
import {
  ChannelAccountDataBulk,
  ChannelAccountDataCube,
  ChannelArcDataBulk,
  ChannelArcDataCube,
} from '../platforms/common'

export abstract class DataCubeBase {
  private readonly dataCubeLogger = new Logger(DataCubeBase.name)

  /**
   * 上报用户数据
   * @param accountId
   */
  abstract accountPortraitReport(
    accountId: string,
  ): Promise<void>

  // 获取账号的统计数据
  abstract getAccountDataCube(
    accountId: string,
  ): Promise<ChannelAccountDataCube>

  // 获取作品的统计数据
  abstract getArcDataCube(
    accountId: string,
    dataId: string,
  ): Promise<ChannelArcDataCube>

  // 获取账号的增量数据,平台不支持时返回空数据
  async getAccountDataBulk(
    accountId: string,
  ): Promise<ChannelAccountDataBulk> {
    this.dataCubeLogger.log(`${this.constructor.name}.getAccountDataBulk not implemented, accountId: ${accountId}`)
    return {
      list: [],
    }
  }

  // 获取作品的增量数据,平台不支持时返回空数据
  async getArcDataBulk(
    accountId: string,
    dataId: string,
  ): Promise<ChannelArcDataBulk> {
    this.dataCubeLogger.log(
      `${this.constructor.name}.getArcDataBulk not implemented, accountId: ${accountId}, dataId: ${dataId}`,
    )
    return {
      recordId: '',
      dataId: '',
      list: [],
    }
  }
}
