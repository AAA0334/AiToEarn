import { OAuth2CredentialRepository } from '@yikart/channel-db'
import { AccountType } from '@yikart/common'
import { RedisService } from '@yikart/redis'
import { ChannelRedisKeys } from '../channel.constants'

/**
 * 各平台 OAuth2 凭证的公共字段,凭证统一先读写 Redis 缓存,再落库。
 */
export interface OAuth2CredentialTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface OAuth2CredentialStore {
  redisService: RedisService
  oauth2CredentialRepository: OAuth2CredentialRepository
  platform: AccountType | 'meta'
}

/**
 * 读取账号的授权凭证:优先取缓存,缓存缺失时回落到数据库。
 * buildFromPersisted 负责把库里的凭证转换成平台自身的凭证结构。
 */
export async function readOAuth2Credential<T extends OAuth2CredentialTokens>(
  store: OAuth2CredentialStore,
  accountId: string,
  buildFromPersisted: (tokens: OAuth2CredentialTokens) => T,
): Promise<T | null> {
  const cached = await store.redisService.getJson<T>(
    ChannelRedisKeys.accessToken(store.platform, accountId),
  )
  if (cached)
    return cached

  const persisted = await store.oauth2CredentialRepository.getOne(
    accountId,
    store.platform,
  )
  if (!persisted)
    return null

  return buildFromPersisted({
    access_token: persisted.accessToken,
    refresh_token: persisted.refreshToken,
    expires_in: persisted.accessTokenExpiresAt,
  })
}

/**
 * 保存账号的授权凭证:同时写入缓存和数据库,两者都成功才算成功。
 */
export async function writeOAuth2Credential(
  store: OAuth2CredentialStore,
  accountId: string,
  credential: OAuth2CredentialTokens,
  cacheSeconds?: number,
): Promise<boolean> {
  const cached = await store.redisService.setJson(
    ChannelRedisKeys.accessToken(store.platform, accountId),
    credential,
    cacheSeconds,
  )
  const persisted = await store.oauth2CredentialRepository.upsertOne(
    accountId,
    store.platform,
    {
      accessToken: credential.access_token,
      refreshToken: credential.refresh_token,
      accessTokenExpiresAt: credential.expires_in,
    },
  )
  return cached && persisted
}
