import { OAuth2CredentialRepository } from '@yikart/channel-db'
import { AccountType } from '@yikart/common'
import { RedisService } from '@yikart/redis'
import { describe, expect, it, vi } from 'vitest'
import {
  OAuth2CredentialStore,
  readOAuth2Credential,
  writeOAuth2Credential,
} from './oauth2-credential.util'

interface TestCredential {
  access_token: string
  refresh_token: string
  expires_in: number
  scopes: string[]
}

function createStore(overrides: {
  cached?: TestCredential | null
  persisted?: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
  } | null
}) {
  const redisService = {
    getJson: vi.fn().mockResolvedValue(overrides.cached ?? null),
    setJson: vi.fn().mockResolvedValue(true),
  }
  const oauth2CredentialRepository = {
    getOne: vi.fn().mockResolvedValue(overrides.persisted ?? null),
    upsertOne: vi.fn().mockResolvedValue(true),
  }
  const store: OAuth2CredentialStore = {
    redisService: redisService as unknown as RedisService,
    oauth2CredentialRepository:
      oauth2CredentialRepository as unknown as OAuth2CredentialRepository,
    platform: AccountType.BILIBILI,
  }
  return { store, redisService, oauth2CredentialRepository }
}

describe('readOAuth2Credential', () => {
  it('returns the cached credential without hitting the database', async () => {
    const cached: TestCredential = {
      access_token: 'cached-token',
      refresh_token: 'cached-refresh',
      expires_in: 100,
      scopes: ['a'],
    }
    const { store, oauth2CredentialRepository } = createStore({ cached })

    const credential = await readOAuth2Credential<TestCredential>(
      store,
      'account-1',
      tokens => ({ ...tokens, scopes: [] }),
    )

    expect(credential).toEqual(cached)
    expect(oauth2CredentialRepository.getOne).not.toHaveBeenCalled()
  })

  it('falls back to the persisted credential when the cache is empty', async () => {
    const { store, redisService } = createStore({
      cached: null,
      persisted: {
        accessToken: 'db-token',
        refreshToken: 'db-refresh',
        accessTokenExpiresAt: 200,
      },
    })

    const credential = await readOAuth2Credential<TestCredential>(
      store,
      'account-1',
      tokens => ({ ...tokens, scopes: [] }),
    )

    expect(credential).toEqual({
      access_token: 'db-token',
      refresh_token: 'db-refresh',
      expires_in: 200,
      scopes: [],
    })
    expect(redisService.getJson).toHaveBeenCalledWith(
      'bilibili:access_token:account-1',
    )
  })

  it('returns null when neither the cache nor the database has a credential', async () => {
    const { store } = createStore({ cached: null, persisted: null })

    const credential = await readOAuth2Credential<TestCredential>(
      store,
      'account-1',
      tokens => ({ ...tokens, scopes: [] }),
    )

    expect(credential).toBeNull()
  })
})

describe('writeOAuth2Credential', () => {
  it('caches and persists the credential', async () => {
    const { store, redisService, oauth2CredentialRepository } = createStore({})
    const credential = {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 300,
    }

    const saved = await writeOAuth2Credential(
      store,
      'account-1',
      credential,
      300,
    )

    expect(saved).toBe(true)
    expect(redisService.setJson).toHaveBeenCalledWith(
      'bilibili:access_token:account-1',
      credential,
      300,
    )
    expect(oauth2CredentialRepository.upsertOne).toHaveBeenCalledWith(
      'account-1',
      AccountType.BILIBILI,
      {
        accessToken: 'token',
        refreshToken: 'refresh',
        accessTokenExpiresAt: 300,
      },
    )
  })

  it('reports failure when persisting fails', async () => {
    const { store, oauth2CredentialRepository } = createStore({})
    oauth2CredentialRepository.upsertOne.mockResolvedValue(false)

    const saved = await writeOAuth2Credential(store, 'account-1', {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 300,
    })

    expect(saved).toBe(false)
  })
})
