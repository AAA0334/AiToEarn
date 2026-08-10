/**
 * 开放平台通用类型:B站、抖音等开放平台的稿件、鉴权、统计结构完全一致,统一在此维护。
 */

export interface CommonResponse<T> {
  code: number // 0;
  message: string // '0';
  ttl: number // 1;
  data: T
}

export interface AccessToken {
  access_token: string // 'd30bedaa4d8eb3128cf35ddc1030e27d';
  expires_in: number // 1630220614;
  refresh_token: string // 'WxFDKwqScZIQDm4iWmKDvetyFugM6HkX';
  scopes: string[] // ['USER_INFO', 'ATC_DATA', 'ATC_BASE'];
}

export interface GrantScopes {
  openid: string
  scopes: string[]
}

export enum VideoUTypes {
  Little = 0,
  Big = 1,
}

// status?: 'all' | 'is_pubing' | 'pubed' | 'not_pubed';
export enum ArchiveStatus {
  all = 'all',
  is_pubing = 'is_pubing',
  pubed = 'pubed',
  not_pubed = 'not_pubed',
}

export interface ArchiveTypeChild {
  description: string
  id: number
  name: string
  parent: number
}

export interface ArchiveTypeItem {
  children: ArchiveTypeChild[]
  description: string
  id: number
  name: string
  parent: number
}

export interface ArchiveListItem {
  addit_info: {
    reject_reason: string
    state: number
    state_desc: string
  }
  copyright: number
  cover: string
  ctime: number
  desc: string
  no_reprint: number
  ptime: number
  resource_id: string
  tag: string
  tid: number
  title: string
  video_info: {
    cid: number
    duration: number
    filename: string
    iframe_url: string
    share_url: string
  }
}

export interface ArchiveListPage {
  pn: number
  ps: number
  total: number
}

export interface ArchiveListData {
  list: ArchiveListItem[]
  page: ArchiveListPage
}

export interface ArchiveAddByUtokenData {
  resource_id: string
}

export interface UserStatData {
  arc_passed_total: number
  follower: number
  following: number
}

export interface ArcStatData {
  coin: number
  danmaku: number
  favorite: number
  like: number
  ptime: number
  reply: number
  share: number
  title: string
  view: number
}

export interface ArcIncStatData {
  inc_click: number
  inc_coin: number
  inc_dm: number
  inc_elec: number
  inc_fav: number
  inc_like: number
  inc_reply: number
  inc_share: number
}

export interface etagData {
  etag: string
}

export interface DeleteVideoData {}
